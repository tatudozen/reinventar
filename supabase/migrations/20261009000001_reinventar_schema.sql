-- =============================================================================
-- Schema: reinventar
-- App separado da Jornada Ikigai, adaptado para público 55+
-- Auth (GoTrue) é compartilhado com o schema public — usuários podem ter
-- contas nas duas apps sem conflito.
--
-- Para expor este schema via PostgREST, adicionar ao .env do Supabase self-hosted:
--   PGRST_DB_SCHEMAS=public,reinventar
-- (ou na variável equivalente do docker-compose: db-postgrest -> PGRST_DB_SCHEMAS)
-- =============================================================================

create schema if not exists reinventar;

-- Grants necessários para PostgREST funcionar no schema
grant usage on schema reinventar to anon, authenticated, service_role;
alter default privileges in schema reinventar
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema reinventar
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema reinventar
  grant all on functions to anon, authenticated, service_role;


-- =============================================================================
-- Tabela: jornadas
-- Resultado principal de cada participante do Reinventar.
-- Estrutura idêntica ao public.jornadas para facilitar reuso de código.
-- =============================================================================
create table if not exists reinventar.jornadas (
  id                 text primary key,
  user_name          text not null,
  user_email         text not null,
  user_phone         text,
  guide              text,           -- guia escolhido (mentor/criador/guardiao/etc.)
  xp                 int default 0,
  completed_phases   int[],          -- equivalente a completed_missions
  phase_data         jsonb,          -- equivalente a mission_data
  referred_by        text,           -- id da jornada de quem indicou (?am_id=)
  created_at         timestamptz default now()
);

create index if not exists reinventar_jornadas_referred_by_idx
  on reinventar.jornadas (referred_by)
  where referred_by is not null;

alter table reinventar.jornadas enable row level security;

create policy "reinventar_jornadas_insert_public"
  on reinventar.jornadas for insert
  with check (true);

create policy "reinventar_jornadas_select_public"
  on reinventar.jornadas for select
  using (true);


-- =============================================================================
-- Tabela: admin_config
-- Configuração administrativa do Reinventar (URLs dos vídeos dos guias, etc.)
-- =============================================================================
create table if not exists reinventar.admin_config (
  id         uuid primary key default gen_random_uuid(),
  video_urls jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Função update_updated_at já existe no schema public; cria localmente
create or replace function reinventar.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists reinventar_admin_config_updated_at on reinventar.admin_config;
create trigger reinventar_admin_config_updated_at
  before update on reinventar.admin_config
  for each row execute function reinventar.update_updated_at();

insert into reinventar.admin_config (video_urls)
select '{}'::jsonb
where not exists (select 1 from reinventar.admin_config);

alter table reinventar.admin_config enable row level security;

create policy "reinventar_admin_config_select_public"
  on reinventar.admin_config for select
  using (true);

create policy "reinventar_admin_config_update_admin"
  on reinventar.admin_config for update
  using (auth.jwt() ->> 'email' = 'fsantiagorj@gmail.com');


-- =============================================================================
-- Tabela: tenant_configs
-- Configuração por parceiro/subdomínio (home_url, explore_url, explore_label).
-- Uma linha por tenant ativo. Lida pelo app via hostname.
-- =============================================================================
create table if not exists reinventar.tenant_configs (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,  -- identificador do tenant (ex: 'cursoprogressao')
  home_url      text,                  -- URL base do parceiro para links de compartilhamento
  explore_label text,                  -- label do botão CTA (ex: 'Ver Programas')
  explore_url   text,                  -- URL de destino do botão CTA
  updated_at    timestamptz default now()
);

drop trigger if exists reinventar_tenant_configs_updated_at on reinventar.tenant_configs;
create trigger reinventar_tenant_configs_updated_at
  before update on reinventar.tenant_configs
  for each row execute function reinventar.update_updated_at();

alter table reinventar.tenant_configs enable row level security;

create policy "reinventar_tenant_configs_select_public"
  on reinventar.tenant_configs for select
  using (true);

create policy "reinventar_tenant_configs_update_admin"
  on reinventar.tenant_configs for update
  using (auth.jwt() ->> 'email' = 'fsantiagorj@gmail.com');

create policy "reinventar_tenant_configs_insert_admin"
  on reinventar.tenant_configs for insert
  with check (auth.jwt() ->> 'email' = 'fsantiagorj@gmail.com');


-- =============================================================================
-- Tabela: jornada_surveys
-- Pesquisa de satisfação ao final da jornada (adaptada para público 55+).
-- =============================================================================
create table if not exists reinventar.jornada_surveys (
  id           bigserial primary key,
  jornada_id   text references reinventar.jornadas(id) on delete set null,
  perfil       text not null,   -- guia escolhido
  nps          int not null check (nps between 0 and 10),
  clareza      text not null,   -- "O resultado fez sentido para você?"
  fase_fav     text not null,   -- fase favorita
  dificuldade  text,            -- algo que achou difícil
  precisao     text not null,   -- "O quanto o resultado reflete quem você é?"
  sugestao     text,            -- sugestão livre
  comunidade   boolean not null default false, -- interesse em comunidade
  created_at   timestamptz default now()
);

alter table reinventar.jornada_surveys enable row level security;

create policy "reinventar_survey_insert_public"
  on reinventar.jornada_surveys for insert
  with check (true);

create policy "reinventar_survey_select_admin"
  on reinventar.jornada_surveys for select
  using (auth.role() = 'service_role');


-- =============================================================================
-- Tabela: reports
-- Relatórios Profundos gerados pelo N8N, acessíveis via slug.
-- Sem SELECT para anon — leitura pela função serverless com service_role.
-- =============================================================================
create table if not exists reinventar.reports (
  id         bigint generated always as identity primary key,
  slug       text unique not null
               default substr(md5(random()::text || clock_timestamp()::text), 1, 10),
  jornada_id text references reinventar.jornadas(id) on delete set null,
  title      text,
  content_md text not null,
  created_at timestamptz not null default now()
);

create index if not exists reinventar_reports_slug_idx on reinventar.reports(slug);

alter table reinventar.reports enable row level security;
-- Sem policy de SELECT: anon não lê. N8N e função usam service_role.


-- =============================================================================
-- Tabela: user_feedback
-- Feedback rápido de usuários (mantido simples, igual ao public).
-- =============================================================================
create table if not exists reinventar.user_feedback (
  id         bigserial primary key,
  rating     int not null check (rating between 1 and 5),
  comment    text,
  page       text default 'geral',
  user_agent text,
  created_at timestamptz default now()
);

alter table reinventar.user_feedback enable row level security;

create policy "reinventar_feedback_insert_public"
  on reinventar.user_feedback for insert
  with check (true);

create policy "reinventar_feedback_select_admin"
  on reinventar.user_feedback for select
  using (auth.role() = 'service_role');
