import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import App from '../machinetool-platform'

const PAGE_SIZE = 20

export default function Home({ initialMachines, total, todayViews, allMakers, allTypes }) {
  const [machines, setMachines] = useState(initialMachines)
  const [loading, setLoading] = useState(false)
  const loaderRef = useRef(null)

  useEffect(() => {
    fetch('/api/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: '/' })
    })
  }, [])

  const loadMore = async () => {
    if (loading || machines.length >= total) return
    setLoading(true)
    const from = machines.length
    const { data } = await supabase
      .from('machines')
      .select('id,name,maker,country,country_en,type,year,tags,rating_avg,rating_count,max_workpiece_size,max_rapid_feed,specs')
      .order('maker')
      .order('name')
      .range(from, from + PAGE_SIZE - 1)
    if (data) {
      const newItems = data.map(m => ({
        ...m,
        tags: typeof m.tags === 'string' ? m.tags.split(',') : m.tags || []
      }))
      setMachines(prev => [...prev, ...newItems])
    }
    setLoading(false)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore() },
      { threshold: 0.1 }
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [machines, loading])

  return (
    <>
      <App
        machines={machines}
        total={total}
        todayViews={todayViews}
        allMakers={allMakers}
        allTypes={allTypes}
      />
      <div ref={loaderRef} style={{ height:'40px', display:'flex', alignItems:'center', justifyContent:'center' }}>
        {loading && <span style={{ color:'#4fc3f7', fontSize:'13px' }}>Loading...</span>}
        {!loading && machines.length >= total && machines.length > 0 && (
          <span style={{ color:'#456', fontSize:'12px' }}>— {machines.length}개 전체 표시 —</span>
        )}
      </div>
    </>
  )
}

export async function getServerSideProps() {
  // 첫 20개 기종
  const { data, error, count } = await supabase
    .from('machines')
    .select('id,name,maker,country,country_en,type,year,tags,rating_avg,rating_count,max_workpiece_size,max_rapid_feed,specs', { count: 'exact' })
    .order('maker')
    .order('name')
    .range(0, PAGE_SIZE - 1)

  if (error) return { props: { initialMachines:[], total:0, todayViews:0, allMakers:[], allTypes:[] } }

  const initialMachines = (data || []).map(m => ({
    ...m,
    tags: typeof m.tags === 'string' ? m.tags.split(',') : m.tags || []
  }))

  // 전체 제조사 목록 (별도 쿼리)
  const { data: makerData } = await supabase
    .from('machines')
    .select('maker')
    .order('maker')

  const allMakers = [...new Set((makerData || []).map(m => m.maker))].sort()

  // 전체 기계 종류 목록 (별도 쿼리)
  const { data: typeData } = await supabase
    .from('machines')
    .select('type')

  const allTypes = [...new Set((typeData || []).map(m => m.type))]

  // 오늘 방문자 수
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { count: todayCount } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .gte('viewed_at', today.toISOString())

  return {
    props: {
      initialMachines,
      total: count || 0,
      todayViews: todayCount || 0,
      allMakers,
      allTypes,
    }
  }
}
