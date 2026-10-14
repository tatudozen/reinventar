-- =============================================================================
-- Atualiza jornada_surveys para o contexto Reinventar (55+)
--
-- 1. Corrige policy de INSERT que bloqueava anon (EXISTS na tabela com SELECT revogado)
-- 2. Renomeia comunidade → comunidade_ia (alinha com o código)
-- 3. Adiciona tamanho_jornada e suporte_desejado (novas perguntas)
-- 4. Cria is_survey_completed() RPC — usada pelo SatisfactionSurvey e ResultDashboard
--    para verificar se a jornada já tem pesquisa respondida
-- =============================================================================


-- 1. Corrigir policy de INSERT
--    Problema: "exists (select 1 from reinventar.jornadas ...)" roda no contexto de
--    anon, que não tem SELECT na tabela → INSERT falhava silenciosamente.
--    A FK já garante integridade referencial; basta with check (true).
drop policy if exists "reinventar_survey_insert_public" on reinventar.jornada_surveys;

create policy "reinventar_survey_insert_public"
  on reinventar.jornada_surveys for insert
  with check (true);


-- 2. Renomear coluna comunidade → comunidade_ia
alter table reinventar.jornada_surveys
  rename column comunidade to comunidade_ia;


-- 3. Adicionar colunas novas
alter table reinventar.jornada_surveys
  add column if not exists tamanho_jornada text,
  add column if not exists suporte_desejado text[];


-- 4. RPC is_survey_completed
--    Retorna true se já existe pelo menos 1 survey para o jornada_id informado.
--    security definer: roda como owner (ignora RLS sobre jornada_surveys).
--    Usado por: SatisfactionSurvey (alreadyCompleted) e ResultDashboard (CTA condicional).
create or replace function reinventar.is_survey_completed(p_id text)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from reinventar.jornada_surveys where jornada_id = p_id limit 1
  );
$$;

grant execute on function reinventar.is_survey_completed(text) to anon, authenticated;
