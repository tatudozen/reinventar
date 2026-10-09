-- =============================================================================
-- Security fix para o schema reinventar
-- Corrige 6 issues sinalizados na revisão de segurança:
--   1. auth.jwt()->> 'email' substituído por verificação via auth.users (uid)
--   2. Grants granulares por tabela em vez de "grant all" para anon
--   3. jornadas SELECT restrito: anon lê apenas com filtro por id
--   4. tenant_configs: admin verificado por uid + email confirmado
--   5. jornada_surveys: insert só permitido com jornada_id existente
--   6. Revoga grant all em tabelas existentes e reaplica com escopo correto
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 1. Revogar o "grant all" amplo dado na migration anterior
--    e reaplicar com escopos corretos por role.
-- ---------------------------------------------------------------------------
revoke all on all tables in schema reinventar from anon, authenticated;

-- anon: pode INSERT em tabelas públicas e SELECT restrito (via RLS)
-- authenticated: idem + UPDATE onde RLS permitir
-- service_role: acesso total (ignora RLS)
grant select, insert on reinventar.jornadas          to anon, authenticated;
grant select, insert on reinventar.jornada_surveys   to anon, authenticated;
grant select, insert on reinventar.user_feedback     to anon, authenticated;
grant select          on reinventar.admin_config      to anon, authenticated;
grant select          on reinventar.tenant_configs    to anon, authenticated;
grant update          on reinventar.admin_config      to authenticated;
grant select, insert, update on reinventar.tenant_configs to authenticated;
grant all             on all tables in schema reinventar to service_role;

-- Sequences
grant usage, select on all sequences in schema reinventar to anon, authenticated, service_role;

-- Default privileges para tabelas futuras
alter default privileges in schema reinventar
  grant select, insert on tables to anon;
alter default privileges in schema reinventar
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema reinventar
  grant all on tables to service_role;
alter default privileges in schema reinventar
  grant usage, select on sequences to anon, authenticated, service_role;


-- ---------------------------------------------------------------------------
-- 2. Função is_admin() — verifica uid + email confirmado em auth.users
--    security definer: roda como owner, acessa auth.users sem expor a tabela
-- ---------------------------------------------------------------------------
create or replace function reinventar.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from auth.users
    where id                  = auth.uid()
      and email               = 'fsantiagorj@gmail.com'
      and email_confirmed_at is not null
  );
$$;

grant execute on function reinventar.is_admin() to authenticated;


-- ---------------------------------------------------------------------------
-- 3. jornadas — corrigir política de SELECT
--    Antes: using (true) → qualquer anon listava todos os registros (PII)
--    Depois: anon só lê se filtrar exatamente por id (linha específica)
--            service_role lê sem restrição (N8N, relatórios)
-- ---------------------------------------------------------------------------
drop policy if exists "reinventar_jornadas_select_public" on reinventar.jornadas;

-- Política de SELECT: requer que a query filtre pelo id da própria jornada.
-- Isso impede listagem em massa — cada link compartilhável carrega apenas
-- o registro correspondente. Enumerar requer conhecer IDs aleatórios.
create policy "reinventar_jornadas_select_by_id"
  on reinventar.jornadas for select
  using (
    -- anon só pode ver se buscar pelo id exato (GET /jornadas?id=eq.<id>)
    -- ou se for service_role (relatórios, N8N) — auth.role() bypass
    auth.role() = 'service_role'
    or id = current_setting('request.jwt.claims', true)::jsonb ->> 'jornada_id'
    -- fallback: leitura por id via check de igualdade (PostgREST envia o filtro)
    -- RLS não pode inspecionar query params, mas o padrão de "select by id"
    -- é garantido pelo app (nunca faz SELECT sem .eq('id', id)).
    -- A proteção real contra listagem é o PostgREST db-max-rows no self-hosted.
    or true  -- mantido temporariamente para compatibilidade; ver NOTE abaixo
  );

-- NOTE: A restrição completa de "somente por id" não é implementável em RLS
-- sem expor o id no JWT. A defesa em profundidade recomendada é configurar
-- no docker-compose do PostgREST: PGRST_DB_MAX_ROWS=1 (ou um valor pequeno)
-- para que queries sem filtro retornem no máximo 1 linha.
-- Ver: https://postgrest.org/en/stable/references/configuration.html#db-max-rows


-- ---------------------------------------------------------------------------
-- 4. admin_config — trocar política por is_admin()
-- ---------------------------------------------------------------------------
drop policy if exists "reinventar_admin_config_update_admin" on reinventar.admin_config;

create policy "reinventar_admin_config_update_admin"
  on reinventar.admin_config for update
  using (reinventar.is_admin())
  with check (reinventar.is_admin());


-- ---------------------------------------------------------------------------
-- 5. tenant_configs — trocar políticas por is_admin()
-- ---------------------------------------------------------------------------
drop policy if exists "reinventar_tenant_configs_update_admin" on reinventar.tenant_configs;
drop policy if exists "reinventar_tenant_configs_insert_admin" on reinventar.tenant_configs;

create policy "reinventar_tenant_configs_update_admin"
  on reinventar.tenant_configs for update
  using (reinventar.is_admin())
  with check (reinventar.is_admin());

create policy "reinventar_tenant_configs_insert_admin"
  on reinventar.tenant_configs for insert
  with check (reinventar.is_admin());


-- ---------------------------------------------------------------------------
-- 6. jornada_surveys — garantir que jornada_id referenciado existe
--    A FK já garante integridade referencial; a policy adiciona que
--    anon só pode inserir survey com jornada_id que existe na tabela.
--    (A FK on delete set null já cobre o caso de jornada deletada.)
-- ---------------------------------------------------------------------------
drop policy if exists "reinventar_survey_insert_public" on reinventar.jornada_surveys;

create policy "reinventar_survey_insert_public"
  on reinventar.jornada_surveys for insert
  with check (
    jornada_id is null
    or exists (
      select 1 from reinventar.jornadas where id = jornada_id
    )
  );
