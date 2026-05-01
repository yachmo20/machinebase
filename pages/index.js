import { supabase } from '../lib/supabase'
import App from '../machinetool-platform'

export default function Home({ machines }) {
  return <App machines={machines} />
}

export async function getServerSideProps() {
  const { data: machines, error } = await supabase
    .from('machines')
    .select('*')
    .order('name')

  if (error) {
    console.error(error)
    return { props: { machines: [] } }
  }

  return {
    props: { machines }
  }
}
