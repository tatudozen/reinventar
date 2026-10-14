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

function srHeaders(extra?: Record<string, string>) {
  return {
    apikey:          SUPABASE_SERVICE_KEY,
    Authorization:   `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type':  'application/json',
    ...extra,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ ok: false, error: 'Servidor mal configurado' });
  }

  const token = (req.headers['authorization'] ?? '').toString().replace('Bearer ', '');
  if (!verifyToken(token)) return res.status(401).json({ ok: false, error: 'Não autorizado' });

  // GET — lê video_urls da tabela admin_config
  if (req.method === 'GET') {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_config?select=video_urls&limit=1`,
      { headers: srHeaders({ 'Accept-Profile': 'reinventar' }) },
    );
    const rows = await r.json().catch(() => []);
    const videoUrls = Array.isArray(rows) && rows[0] ? (rows[0].video_urls ?? {}) : {};
    return res.json({ ok: true, videoUrls });
  }

  // PUT — salva video_urls (PATCH na única linha da tabela)
  if (req.method === 'PUT') {
    const { videoUrls } = req.body || {};
    if (typeof videoUrls !== 'object' || videoUrls === null) {
      return res.status(400).json({ ok: false, error: 'videoUrls inválido' });
    }
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_config`,
      {
        method:  'PATCH',
        headers: srHeaders({ 'Content-Profile': 'reinventar', Prefer: 'return=minimal' }),
        body:    JSON.stringify({ video_urls: videoUrls }),
      },
    );
    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      return res.status(502).json({ ok: false, error: `Supabase (${r.status})`, detail });
    }
    return res.json({ ok: true });
  }

  return res.status(405).end();
}
