import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { maker } = req.query;
  if (!maker) return res.status(400).json({ error: 'maker required' });

  try {
    const { data, error } = await supabase
      .from('manufacturers')
      .select('*')
      .eq('maker', maker)
      .single();

    if (error || !data) return res.status(404).json(null);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json(null);
  }
}
