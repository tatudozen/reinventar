-- =============================================================================
-- Restringe get_jornada a retornar apenas campos não-PII
--
-- Problema: a versão anterior usa "SELECT *" e devolve user_email e user_phone
-- para qualquer browser que carregue um link de resultado compartilhado.
-- Esses campos são visíveis no Network tab mesmo que não sejam renderizados.
--
-- Solução: reescrever a função para retornar apenas id, user_name e phase_data
-- — os únicos campos consumidos pelo ResultDashboard público.
-- =============================================================================

create or replace function reinventar.get_jornada(p_id text)
returns table(
  id            text,
  user_name     text,
  phase_data    jsonb
)
language sql
security definer
stable
as $$
  select id, user_name, phase_data
  from reinventar.jornadas
  where id = p_id
  limit 1;
$$;

-- Grants permanecem: anon e authenticated podem chamar a função
grant execute on function reinventar.get_jornada(text) to anon, authenticated;
