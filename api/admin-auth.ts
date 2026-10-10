import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'crypto';

const PASSWORD = process.env.ADMIN_PASSWORD!;
const SECRET = process.env.ADMIN_SECRET!;
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 horas

function sign(ts: string): string {
  return createHmac('sha256', SECRET).update(ts).digest('hex');
}

// Evita timing attacks — nunca use === para comparar segredos
function safeEqual(a: string, b: string): boolean {
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { action, password, token } = req.body || {};

  if (action === 'verify') {
    if (!token || typeof token !== 'string') return res.json({ ok: false });
    const [ts, sig] = token.split('.');
    const age = Date.now() - parseInt(ts, 10);
    // age >= 0 rejeita tokens com timestamp futuro (CWE-613)
    const valid = sig != null && safeEqual(sig, sign(ts)) && age >= 0 && age < TOKEN_TTL_MS;
    return res.json({ ok: valid });
  }

  if (action === 'login') {
    if (!PASSWORD || !SECRET) {
      return res.status(500).json({ ok: false, error: 'Servidor mal configurado' });
    }
    if (!password || !safeEqual(password, PASSWORD)) {
      return res.status(401).json({ ok: false, error: 'Senha incorreta' });
    }
    const ts = Date.now().toString();
    return res.json({ ok: true, token: `${ts}.${sign(ts)}` });
  }

  return res.status(400).json({ ok: false, error: 'Ação inválida' });
}
