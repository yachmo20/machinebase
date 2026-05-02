import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { machine_id, score } = req.body
  if (!machine_id || !score) return res.status(400).end()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // 평점 저장
  await supabase.from('ratings').insert([{ machine_id, score }])

  // 평균 계산
  const { data } = await supabase
    .from('ratings')
    .select('score')
    .eq('machine_id', machine_id)

  const scores = data?.map(r => r.score) || []
  const avg = scores.length ? (scores.reduce((a,b) => a+b, 0) / scores.length) : 0
  const count = scores.length
  const roundedAvg = Math.round(avg * 10) / 10

  // machines 테이블 업데이트
  await supabase.from('machines').update({
    rating_avg: roundedAvg,
    rating_count: count
  }).eq('id', machine_id)

  res.status(200).json({ avg: roundedAvg, count })
}
