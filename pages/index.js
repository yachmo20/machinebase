import { supabase } from '../lib/supabase'
import App from '../machinetool-platform'

export default function Home({ machines }) {
  return <App machines={machines} />
}

export async function getServerSideProps() {
  const { data, error } = await supabase
    .from('machines')
    .select('*')
    .order('name')

  if (error) {
    console.error(error)
    return { props: { machines: [] } }
  }

  // tags 문자열을 배열로 변환
  const machines = data.map(m => ({
    ...m,
    tags: typeof m.tags === 'string' ? m.tags.split(',') : m.tags || []
  }))

  return {
    props: { machines }
  }
}
