import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function reinventarHeaders(extra: Record<string, string> = {}) {
  return {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    'Accept-Profile': 'reinventar',
    ...extra,
  };
}

function crmHeaders(extra: Record<string, string> = {}) {
  return {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    'Accept-Profile': 'crm',
    'Content-Profile': 'crm',
    ...extra,
  };
}

interface ReferralRule {
  id: number;
  name: string;
  threshold: number;
  webhook_url: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ ok: false, error: 'Variáveis de ambiente ausentes' });
  }

  const { referrer_id, tenant_host } = req.body || {};
  if (!referrer_id || typeof referrer_id !== 'string') {
    return res.status(400).json({ ok: false, error: 'referrer_id é obrigatório' });
  }

  try {
    // 1. Conta quantas indicações o indicador gerou
    const countRes = await fetch(
      `${SUPABASE_URL}/rest/v1/jornadas?referred_by=eq.${encodeURIComponent(referrer_id)}&select=id`,
      { headers: reinventarHeaders({ 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' }) },
    );
    const contentRange = countRes.headers.get('content-range') || '';
    const referral_count = parseInt(contentRange.split('/')[1] || '0', 10);
    if (!referral_count) return res.json({ ok: true, fired: 0, referral_count: 0 });

    // 2. Regras ativas cujo limiar já foi atingido, filtradas por tenant
    const tenantFilter = tenant_host
      ? `&tenant_host=eq.${encodeURIComponent(tenant_host)}`
      : '&tenant_host=is.null';
    const rulesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/referral_rules?active=eq.true&threshold=lte.${referral_count}${tenantFilter}&select=id,name,threshold,webhook_url`,
      { headers: crmHeaders() },
    );
    const rules: ReferralRule[] = await rulesRes.json();
    if (!Array.isArray(rules) || rules.length === 0) return res.json({ ok: true, fired: 0, referral_count });

    // 3. Dados do indicador para o payload do webhook
    const refRes = await fetch(
      `${SUPABASE_URL}/rest/v1/jornadas?id=eq.${encodeURIComponent(referrer_id)}&select=user_name,user_email`,
      { headers: reinventarHeaders() },
    );
    const refData = await refRes.json();
    const referrer = Array.isArray(refData) ? refData[0] : null;

    // 4. Para cada regra, reivindica o disparo (idempotente) e chama o webhook
    let fired = 0;
    for (const rule of rules) {
      const claimRes = await fetch(`${SUPABASE_URL}/rest/v1/referral_rule_fires`, {
        method: 'POST',
        headers: crmHeaders({ 'Prefer': 'return=representation,resolution=ignore-duplicates' }),
        body: JSON.stringify({ rule_id: rule.id, referrer_id }),
      });
      const claimed = await claimRes.json().catch(() => []);
      if (!Array.isArray(claimed) || claimed.length === 0) continue;

      try {
        await fetch(rule.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'referral_reward',
            rule_name: rule.name,
            threshold: rule.threshold,
            referral_count,
            referrer_id,
            referrer_name: referrer?.user_name ?? null,
            referrer_email: referrer?.user_email ?? null,
          }),
        });
        fired++;
      } catch (err) {
        console.error(`Erro ao chamar webhook da regra ${rule.id}:`, err);
      }
    }

    return res.json({ ok: true, fired, referral_count });
  } catch (err) {
    console.error('Erro ao avaliar regras de indicação:', err);
    return res.status(500).json({ ok: false, error: 'Erro ao avaliar regras' });
  }
}
