import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'crypto';

const SECRET = process.env.ADMIN_SECRET!;
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function verifyToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const [ts, sig] = token.split('.');
  if (!ts || !sig) return false;
  const expected = createHmac('sha256', SECRET).update(ts).digest('hex');
  const age = Date.now() - parseInt(ts, 10);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) && age >= 0 && age < TOKEN_TTL_MS;
  } catch {
    return false;
  }
}

function supabaseHeaders(method: 'read' | 'write' = 'read') {
  return {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    // PostgREST: roteia para o schema correto (não-public)
    ...(method === 'read'
      ? { 'Accept-Profile': 'reinventar' }
      : { 'Content-Profile': 'reinventar' }),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ ok: false, error: 'Servidor mal configurado' });
  }

  const token = (req.headers['authorization'] ?? '').replace('Bearer ', '');

  if (req.method === 'GET') {
    if (!verifyToken(token)) return res.status(401).json({ ok: false, error: 'Não autorizado' });
    const r = await fetch(`${SUPABASE_URL}/rest/v1/tenant_configs?select=host,home_url,explore_label,explore_url&order=host.asc`, {
      headers: supabaseHeaders('read'),
    });
    const tenants = await r.json();
    return res.json({ ok: true, tenants: Array.isArray(tenants) ? tenants : [] });
  }

  if (req.method === 'POST') {
    if (!verifyToken(token)) return res.status(401).json({ ok: false, error: 'Não autorizado' });
    const { host, home_url, explore_label, explore_url } = req.body || {};
    if (!host || typeof host !== 'string') return res.status(400).json({ ok: false, error: 'host é obrigatório' });
    const r = await fetch(`${SUPABASE_URL}/rest/v1/tenant_configs`, {
      method: 'POST',
      headers: { ...supabaseHeaders('write'), 'Prefer': 'return=minimal' },
      body: JSON.stringify({ host: host.trim().toLowerCase(), home_url: home_url || '', explore_label: explore_label || '', explore_url: explore_url || '' }),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      return res.status(502).json({ ok: false, error: `Supabase (${r.status})`, detail });
    }
    return res.json({ ok: true });
  }

  if (req.method === 'PUT') {
    if (!verifyToken(token)) return res.status(401).json({ ok: false, error: 'Não autorizado' });
    const { host, home_url, explore_label, explore_url } = req.body || {};
    if (!host) return res.status(400).json({ ok: false, error: 'host é obrigatório' });
    const r = await fetch(`${SUPABASE_URL}/rest/v1/tenant_configs?host=eq.${encodeURIComponent(host)}`, {
      method: 'PATCH',
      headers: { ...supabaseHeaders('write'), 'Prefer': 'return=minimal' },
      body: JSON.stringify({ home_url, explore_label, explore_url }),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      return res.status(502).json({ ok: false, error: `Supabase (${r.status})`, detail });
    }
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    if (!verifyToken(token)) return res.status(401).json({ ok: false, error: 'Não autorizado' });
    const host = req.query['host'] as string;
    if (!host) return res.status(400).json({ ok: false, error: 'host é obrigatório' });
    const r = await fetch(`${SUPABASE_URL}/rest/v1/tenant_configs?host=eq.${encodeURIComponent(host)}`, {
      method: 'DELETE',
      headers: supabaseHeaders('write'),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      return res.status(502).json({ ok: false, error: `Supabase (${r.status})`, detail });
    }
    return res.json({ ok: true });
  }

  return res.status(405).end();
}
