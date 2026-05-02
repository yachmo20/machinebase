export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { machine_id, machine_name, report_type, field_name, current_value, suggested_value, source_url, reporter_email } = req.body

  // Supabase에 저장
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { error } = await supabase.from('reports').insert([{
    machine_id, machine_name, report_type,
    field_name, current_value, suggested_value,
    source_url, reporter_email, status: 'pending'
  }])

  if (error) return res.status(500).json({ error: error.message })

  // 이메일 알림 (Resend 서비스 사용)
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'noreply@machinebase.com',
        to: process.env.ADMIN_EMAIL,
        subject: `[MACHINEBASE] 새 제보: ${machine_name}`,
        html: `
          <h2>새 스펙 제보가 들어왔습니다</h2>
          <p><b>기종:</b> ${machine_name}</p>
          <p><b>제보 유형:</b> ${report_type}</p>
          <p><b>항목:</b> ${field_name}</p>
          <p><b>현재 값:</b> ${current_value}</p>
          <p><b>제안 값:</b> ${suggested_value}</p>
          <p><b>출처:</b> ${source_url || '없음'}</p>
          <p><b>제보자 이메일:</b> ${reporter_email || '없음'}</p>
        `
      })
    })
  } catch (e) {
    console.log('이메일 전송 실패:', e)
  }

  res.status(200).json({ success: true })
}
