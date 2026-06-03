import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function generateSitemap(machines) {
  const baseUrl = 'https://machinetoolsdb.com';
  const today = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- 메인 페이지 -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- 기타 페이지 -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- 기종 상세 페이지 (598개) -->
  ${machines.map(m => `
  <url>
    <loc>${baseUrl}/?machine=${m.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

</urlset>`;
}

export async function getServerSideProps({ res }) {
  try {
    // 전체 기종 ID 목록 가져오기
    const { data: machines } = await supabase
      .from('machines')
      .select('id')
      .order('id');

    const sitemap = generateSitemap(machines || []);

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();
  } catch (e) {
    res.status(500).end();
  }

  return { props: {} };
}

export default function Sitemap() { return null; }
