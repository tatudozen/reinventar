import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildDeepReportPrompt } from './_deep-report-prompt.js';

const DEEP_REPORT_SECRET = (process.env.DEEP_REPORT_SECRET ?? '').trim();
const SUPABASE_URL       = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GEMINI_API_KEY     = process.env.GEMINI_API_KEY!;

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GEMINI_API_KEY) {
    return res.status(500).json({ ok: false, error: 'Servidor mal configurado' });
  }

  // Auth — bearer simples (segredo compartilhado com o N8N)
  const token = (req.headers['authorization'] ?? '').toString().replace(/^Bearer\s+/i, '').trim();
  if (!DEEP_REPORT_SECRET || token !== DEEP_REPORT_SECRET) {
    return res.status(401).json({ ok: false, error: 'Não autorizado' });
  }

  const { jornada_id } = (req.body ?? {}) as { jornada_id?: string };
  if (!jornada_id || typeof jornada_id !== 'string') {
    return res.status(400).json({ ok: false, error: 'jornada_id obrigatório' });
  }

  // Busca dados da jornada via service_role (ignora RLS)
  const supaRes = await fetch(
    `${SUPABASE_URL}/rest/v1/jornadas?id=eq.${encodeURIComponent(jornada_id)}&select=user_name,user_email,user_phone,phase_data&limit=1`,
    {
      headers: {
        apikey:           SUPABASE_SERVICE_KEY,
        Authorization:    `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Accept-Profile': 'reinventar',
      },
    },
  );

  if (!supaRes.ok) {
    const detail = await supaRes.text().catch(() => '');
    return res.status(502).json({ ok: false, error: `Supabase (${supaRes.status})`, detail });
  }

  const rows = await supaRes.json().catch(() => []);
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(404).json({ ok: false, error: 'Jornada não encontrada' });
  }

  const { user_name, user_email, user_phone, phase_data } = rows[0] as {
    user_name?: string;
    user_email?: string;
    user_phone?: string;
    phase_data?: unknown;
  };
  if (!phase_data) {
    return res.status(422).json({ ok: false, error: 'Sem dados de fase — jornada incompleta' });
  }

  const firstName = ((user_name ?? '').split(' ')[0] || 'Viajante').trim();
  const prompt    = buildDeepReportPrompt(firstName, phase_data);

  // Chama Gemini com timeout de 120s
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 120_000);

  let geminiRes: Response;
  try {
    geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      signal:  controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature:       0.85,
          maxOutputTokens:   4096,
          topP:              0.95,
        },
      }),
    });
  } catch (err) {
    clearTimeout(timeoutId);
    const msg = err instanceof Error && err.name === 'AbortError'
      ? 'Gemini timeout (120s)'
      : 'Gemini unreachable';
    return res.status(504).json({ ok: false, error: msg });
  }
  clearTimeout(timeoutId);

  if (!geminiRes.ok) {
    const detail = await geminiRes.text().catch(() => '');
    return res.status(502).json({ ok: false, error: `Gemini (${geminiRes.status})`, detail });
  }

  const geminiData = await geminiRes.json().catch(() => null);
  const report: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (!report) {
    return res.status(502).json({ ok: false, error: 'Gemini não retornou texto' });
  }

  // Salva o relatório no Supabase e obtém o ID
  const saveRes = await fetch(
    `${SUPABASE_URL}/rest/v1/deep_reports`,
    {
      method: 'POST',
      headers: {
        apikey:            SUPABASE_SERVICE_KEY,
        Authorization:     `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Profile': 'reinventar',
        'Content-Type':    'application/json',
        Prefer:            'return=representation',
      },
      body: JSON.stringify({ jornada_id, report_md: report }),
    },
  );

  let report_id = '';
  if (saveRes.ok) {
    const saved = await saveRes.json().catch(() => []);
    report_id = Array.isArray(saved) ? (saved[0]?.id ?? '') : '';
  }

  const report_url = report_id
    ? `https://reinventar.simplesescolhas.com.br/relatorio/${report_id}`
    : `https://reinventar.simplesescolhas.com.br/resultado/${jornada_id}`;

  return res.json({ ok: true, jornada_id, user_name: firstName, user_email: user_email ?? '', user_phone: user_phone ?? '', report, report_id, report_url });
}
