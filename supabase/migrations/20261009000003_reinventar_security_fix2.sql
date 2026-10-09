-- =============================================================================
-- Security fix 2 para o schema reinventar
-- Corrige 3 issues que permaneceram após a migration anterior:
--
--   1. jornadas SELECT: "or true" tornava a policy ineficaz → substituído por
--      RPC security definer (get_jornada) — anon não acessa a tabela diretamente
--   2. Default privileges da migration 1 ainda concediam "grant all" para
--      tabelas futuras → revogado explicitamente
--   3. tenant_configs: grant insert para anon/authenticated era indevido → revogado
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 1. Revogar default privileges amplos definidos na migration 1
--    "alter default privileges" não tem um REVOKE direto na sintaxe padrão;
--    redefine-se com o escopo correto para sobrescrever.
-- ---------------------------------------------------------------------------
-- Revoga para anon (migration 1 tinha grant all)
alter default privileges in schema reinventar
  revoke all on tables from anon;

-- Revoga para authenticated (migration 1 tinha grant all)
alter default privileges in schema reinventar
  revoke all on tables from authenticated;

-- Reaplica somente para service_role (acesso total, ignora RLS)
alter default privileges in schema reinventar
  grant all on tables to service_role;

alter default privileges in schema reinventar
  grant all on sequences to service_role;

-- Anon e authenticated NÃO recebem default privileges em novas tabelas.
-- Grants são aplicados explicitamente, tabela a tabela, abaixo.


-- ---------------------------------------------------------------------------
-- 2. Corrigir grants de tenant_configs
--    anon e authenticated não devem fazer INSERT/UPDATE — só service_role e admin.
-- ---------------------------------------------------------------------------
revoke insert, update on reinventar.tenant_configs from anon, authenticated;
-- SELECT permanece: o app precisa ler a config do tenant no frontend.


-- ---------------------------------------------------------------------------
-- 3. Substituir SELECT direto em jornadas por RPC security definer
--
--    Problema: RLS não consegue inspecionar o WHERE de uma query.
--    "using (true)" expõe todas as linhas (PII) a qualquer anon.
--    Solução: remover SELECT para anon/authenticated da tabela diretamente;
--    expor apenas via função que retorna no máximo 1 linha pelo id exato.
-- ---------------------------------------------------------------------------

-- 3a. Remover grants de SELECT direto para anon/authenticated em jornadas
revoke select on reinventar.jornadas from anon, authenticated;

-- 3b. Remover policies de SELECT da tabela (anon não acessa mais diretamente)
drop policy if exists "reinventar_jornadas_select_public"   on reinventar.jornadas;
drop policy if exists "reinventar_jornadas_select_by_id"    on reinventar.jornadas;

-- 3c. Função RPC: retorna exatamente 1 jornada pelo id
--     security definer: roda como owner (service_role), bypassa RLS,
--     mas só retorna dados do id solicitado — nunca lista todas as linhas.
create or replace function reinventar.get_jornada(p_id text)
returns setof reinventar.jornadas
language sql
security definer
stable
as $$
  select * from reinventar.jornadas where id = p_id limit 1;
$$;

-- Concede execução a anon e authenticated
grant execute on function reinventar.get_jornada(text) to anon, authenticated;

-- 3d. Função RPC: conta referências (para o componente ShareQuizLink)
create or replace function reinventar.count_referrals(p_jornada_id text)
returns bigint
language sql
security definer
stable
as $$
  select count(*) from reinventar.jornadas where referred_by = p_jornada_id;
$$;

grant execute on function reinventar.count_referrals(text) to anon, authenticated;


-- ---------------------------------------------------------------------------
-- 4. Manter INSERT direto em jornadas (anon precisa criar sua jornada)
--    e revogar SELECT que ficou residual
-- ---------------------------------------------------------------------------
-- INSERT já está garantido pela policy "reinventar_jornadas_insert_public"
-- e pelo grant select, insert da migration anterior.
-- Apenas confirmar que SELECT está revogado (complementa o revoke acima):
revoke select on reinventar.jornadas from anon, authenticated;
