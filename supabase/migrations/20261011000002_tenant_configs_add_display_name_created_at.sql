-- Alinha reinventar.tenant_configs com public.tenant_configs do jornada-ikigai:
-- adiciona display_name e created_at.

alter table reinventar.tenant_configs
  add column if not exists display_name text,
  add column if not exists created_at   timestamptz default now();
