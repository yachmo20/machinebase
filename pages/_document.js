import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* Google Search Console */}
        <meta name="google-site-verification" content="bl_2b3x6-2VniZH5sX9WAiMXN-STpMNeBIPo22VEgyo" />
        {/* Naver Search Advisor */}
        <meta name="naver-site-verification" content="5735bba74be55947a2b39e5084de20a227e143d9" />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6120256241393723"
          crossOrigin="anonymous"
        />
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
