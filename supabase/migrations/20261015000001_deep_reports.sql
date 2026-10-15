-- Tabela para armazenar relatórios profundos gerados por IA
CREATE TABLE IF NOT EXISTS reinventar.deep_reports (
  id         text        PRIMARY KEY DEFAULT substring(md5(gen_random_uuid()::text) FROM 1 FOR 12),
  jornada_id text        NOT NULL REFERENCES reinventar.jornadas(id) ON DELETE CASCADE,
  report_md  text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reinventar.deep_reports ENABLE ROW LEVEL SECURITY;

-- Qualquer um com o ID pode ler (o ID curto é o "token de acesso")
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'reinventar' AND tablename = 'deep_reports' AND policyname = 'deep_reports_select'
  ) THEN
    CREATE POLICY "deep_reports_select" ON reinventar.deep_reports FOR SELECT USING (true);
  END IF;
END $$;

-- Apenas service_role pode inserir (bypassa RLS)
GRANT SELECT ON reinventar.deep_reports TO anon, authenticated;

-- RPC pública para busca por ID
CREATE OR REPLACE FUNCTION reinventar.get_deep_report(p_id text)
RETURNS TABLE(id text, jornada_id text, report_md text, created_at timestamptz)
LANGUAGE sql SECURITY DEFINER SET search_path = reinventar
AS $$
  SELECT id, jornada_id, report_md, created_at
  FROM reinventar.deep_reports
  WHERE id = p_id
  LIMIT 1;
$$;
