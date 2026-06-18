export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { template_id, admin_secret } = req.body;

  if (admin_secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (!template_id) return res.status(400).json({ error: 'template_id required' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const headers = {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/purchases?template_id=eq.${template_id}`, {
      method: 'DELETE', headers
    });

    const r = await fetch(`${SUPABASE_URL}/rest/v1/templates?id=eq.${template_id}`, {
      method: 'DELETE', headers
    });
    if (!r.ok) throw new Error(await r.text());

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
