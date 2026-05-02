import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import App from '../machinetool-platform'

const PAGE_SIZE = 20

export default function Home({ initialMachines, total }) {
  const [machines, setMachines] = useState(initialMachines)
  const [loading, setLoading] = useState(false)
  const loaderRef = useRef(null)

  const loadMore = async () => {
    if (loading || machines.length >= total) return
    setLoading(true)
    const from = machines.length
    const { data } = await supabase
      .from('machines')
      .select('id,name,maker,country,type,year,tags,rating,reviews,max_workpiece_size,max_rapid_feed')
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

  // 무한 스크롤 — 화면 하단 도달 시 자동 로드
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
      <App machines={machines} total={total} />
      {/* 로딩 트리거 */}
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
  const { data, error, count } = await supabase
    .from('machines')
    .select('id,name,maker,country,type,year,tags,rating,reviews,max_workpiece_size,max_rapid_feed', { count:'exact' })
    .order('name')
    .range(0, PAGE_SIZE - 1)

  if (error) return { props: { initialMachines:[], total:0 } }

  const initialMachines = (data || []).map(m => ({
    ...m,
    tags: typeof m.tags === 'string' ? m.tags.split(',') : m.tags || []
  }))

  return { props: { initialMachines, total: count || 0 } }
}
