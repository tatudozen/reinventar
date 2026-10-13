import type { VercelRequest, VercelResponse } from '@vercel/node';

const CRM_URL = process.env.CRM_URL || 'https://cz-crm-chi.vercel.app';
const LEADS_API_KEY = process.env.LEADS_API_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  if (!LEADS_API_KEY) return res.status(500).json({ ok: false, error: 'LEADS_API_KEY não configurada' });

  const r = await fetch(`${CRM_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Api-Key': LEADS_API_KEY },
    body: JSON.stringify(req.body),
  });
  const data = await r.json().catch(() => ({}));
  return res.status(r.ok ? 200 : r.status).json(data);
}
