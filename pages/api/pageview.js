import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { page, machine_id } = req.body

  await supabase.from('page_views').insert([{
    page: page || '/',
    machine_id: machine_id || null,
  }])

  // 오늘 방문자 수 조회
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .gte('viewed_at', today.toISOString())

  res.status(200).json({ today_views: count || 0 })
}
