import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'crypto';

const SECRET               = process.env.ADMIN_SECRET!;
const TOKEN_TTL_MS         = 8 * 60 * 60 * 1000;
const SUPABASE_URL         = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function verifyToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const [ts, sig] = token.split('.');
  if (!ts || !sig) return false;
  const expected = createHmac('sha256', SECRET).update(ts).digest('hex');
  const age = Date.now() - parseInt(ts, 10);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) && age >= 0 && age < TOKEN_TTL_MS;
  } catch { return false; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ ok: false, error: 'Servidor mal configurado' });
  }

  const token = (req.headers['authorization'] ?? '').toString().replace('Bearer ', '');
  if (!verifyToken(token)) return res.status(401).json({ ok: false, error: 'Não autorizado' });

  if (req.method !== 'GET') return res.status(405).end();

  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/jornada_surveys?select=id,perfil,nps,clareza,fase_fav,dificuldade,precisao,tamanho_jornada,sugestao,comunidade_ia,suporte_desejado,created_at&order=created_at.desc&limit=500`,
    {
      headers: {
        apikey:          SUPABASE_SERVICE_KEY,
        Authorization:   `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Accept-Profile': 'reinventar',
      },
    },
  );

  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    return res.status(502).json({ ok: false, error: `Supabase (${r.status})`, detail });
  }

  const surveys = await r.json().catch(() => []);
  return res.json({ ok: true, surveys: Array.isArray(surveys) ? surveys : [] });
}
