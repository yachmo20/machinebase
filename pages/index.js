import { supabase } from '../lib/supabase'
import App from '../machinetool-platform'

const PAGE_SIZE = 20

export default function Home({ machines, total }) {
  return <App machines={machines} total={total} pageSize={PAGE_SIZE} />
}

export async function getServerSideProps() {
  // 카드용 핵심 필드만 + 처음 20개만 로드
  const { data, error, count } = await supabase
    .from('machines')
    .select('id, name, maker, country, type, year, tags, rating, reviews, max_workpiece_size, max_rapid_feed', { count: 'exact' })
    .order('name')
    .range(0, PAGE_SIZE - 1)

  if (error) {
    console.error(error)
    return { props: { machines: [], total: 0 } }
  }

  const machines = data.map(m => ({
    ...m,
    tags: typeof m.tags === 'string' ? m.tags.split(',') : m.tags || []
  }))

  return {
    props: { machines, total: count || 0 }
  }
}
