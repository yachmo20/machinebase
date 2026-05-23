import { useState, useEffect } from "react";
import Head from "next/head";

const theme = {
  dark: { bg:"#080c14", text:"#e0e6f0", textSub:"#6a7d92", textMuted:"#567", headerBg:"rgba(8,12,20,0.93)", headerBorder:"rgba(79,195,247,0.1)", pillBorder:"#1e2a3a", pillColor:"#789", cardBg:"rgba(255,255,255,0.03)", cardBorder:"rgba(255,255,255,0.06)", specBlockBorder:"rgba(255,255,255,0.06)", footerColor:"#445" },
  light: { bg:"#f0f4f8", text:"#1a2332", textSub:"#4a5568", textMuted:"#718096", headerBg:"rgba(240,244,248,0.95)", headerBorder:"rgba(0,0,0,0.08)", pillBorder:"#cbd5e1", pillColor:"#64748b", cardBg:"#ffffff", cardBorder:"#e2e8f0", specBlockBorder:"#e2e8f0", footerColor:"#718096" },
};

const content = {
  ko: {
    title: "소개 / 문의",
    metaTitle: "소개 및 문의 | MACHINEBASE",
    metaDesc: "MACHINEBASE는 전 세계 공작기계 사양을 한 곳에서 비교할 수 있는 무료 정보 플랫폼입니다.",
    aboutTitle: "MACHINEBASE란?",
    aboutBody: "MACHINEBASE는 전 세계 공작기계의 상세 사양을 한 곳에서 검색하고 비교할 수 있는 무료 정보 플랫폼입니다.\n\nCNC 선반, 머시닝센터, 5축 가공기, 복합가공기, 수평 머시닝센터 등 주요 카테고리의 기계들에 대해 축 스트로크, 주축 파워/토크, 급이송속도, 테이퍼, 매거진 툴 수, 테이블 크기, 기계 무게 등 22개 이상의 스펙 항목을 제공합니다.\n\n현재 DMG Mori, Mazak, Okuma, DN Solutions, Hyundai WIA, Haas, Makino 등 7개 글로벌 제조사의 367개 이상 기종이 등록되어 있으며, 계속 확대 중입니다.",
    missionTitle: "왜 만들었나요?",
    missionBody: "공작기계를 비교하려면 제조사 홈페이지를 일일이 찾아다니며 카탈로그를 열어봐야 했습니다. 사양 항목의 표기 방식도 제조사마다 달라 비교가 쉽지 않았습니다.\n\nMACHINEBASE는 이 불편을 해소하기 위해, 모든 기계의 사양을 통일된 형식으로 정리하고 한 화면에서 나란히 비교할 수 있게 만들었습니다.",
    dataTitle: "데이터 출처",
    dataBody: "모든 사양 정보는 각 제조사의 공식 웹사이트, 제품 카탈로그, 기술 자료를 기반으로 수집·정리됩니다. 오류나 누락을 발견하시면 아래 연락처 또는 각 기계 상세 페이지의 '스펙 오류 신고' 기능을 통해 알려주시면 감사하겠습니다.",
    contactTitle: "문의",
    contactBody: "서비스 관련 문의, 데이터 오류 신고, 제휴 및 광고 제안, 기타 의견은 아래 이메일로 보내주세요.",
    contactEmail: "admin@machinebase.com",
    linksTitle: "관련 링크",
    back: "← 메인으로",
    copyright: "© 2025 MACHINEBASE. 무단 복제 및 배포 금지.",
    privacyLink: "개인정보 처리방침",
    termsLink: "이용약관",
  },
  en: {
    title: "About / Contact",
    metaTitle: "About & Contact | MACHINEBASE",
    metaDesc: "MACHINEBASE is a free platform to search and compare global machine tool specifications side by side.",
    aboutTitle: "What is MACHINEBASE?",
    aboutBody: "MACHINEBASE is a free information platform where you can search and compare detailed specifications of machine tools from around the world in one place.\n\nWe provide 22+ spec items including axis strokes, spindle power/torque, rapid feed rates, taper, magazine capacity, table size, and machine weight for major categories such as CNC lathes, machining centers, 5-axis machines, multi-tasking machines, and horizontal machining centers.\n\nCurrently, 367+ models from 7 global manufacturers including DMG Mori, Mazak, Okuma, DN Solutions, Hyundai WIA, Haas, and Makino are registered and continuously expanding.",
    missionTitle: "Why we built this",
    missionBody: "Comparing machine tools used to mean visiting each manufacturer's website one by one, opening catalogs, and trying to match up specification formats that differed from maker to maker.\n\nMACHINEBASE was created to solve this problem by organizing all machine specifications in a unified format and enabling side-by-side comparison on a single screen.",
    dataTitle: "Data Sources",
    dataBody: "All specification information is collected and organized based on each manufacturer's official website, product catalogs, and technical documentation. If you find errors or missing data, please let us know via the contact below or through the 'Report Error' feature on each machine's detail page.",
    contactTitle: "Contact",
    contactBody: "For service inquiries, data error reports, partnership and advertising proposals, or any other feedback, please send an email to:",
    contactEmail: "admin@machinebase.com",
    linksTitle: "Related Links",
    back: "← Home",
    copyright: "© 2025 MACHINEBASE. All rights reserved.",
    privacyLink: "Privacy Policy",
    termsLink: "Terms of Service",
  },
};

export default function AboutPage() {
  const [lang, setLang] = useState("ko");
  const [dark, setDark] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const c = dark ? theme.dark : theme.light;
  const t = content[lang];

  const sectionStyle = { marginBottom:"40px" };
  const headingStyle = { fontSize:"18px", fontWeight:"700", color:"#4fc3f7", marginBottom:"14px" };
  const bodyStyle = { fontSize:"14px", lineHeight:1.9, color:c.textSub, whiteSpace:"pre-line" };

  return (
    <div style={{ minHeight:"100vh", background:c.bg, color:c.text, fontFamily:"'IBM Plex Sans','Noto Sans KR',sans-serif", transition:"background 0.3s, color 0.3s" }}>
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDesc} />
      </Head>

      <header style={{ position:"sticky", top:0, zIndex:100, background:c.headerBg, backdropFilter:"blur(12px)", borderBottom:`1px solid ${c.headerBorder}` }}>
        <div style={{ maxWidth:"900px", margin:"0 auto", padding: isMobile ? "10px 14px" : "12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <a href="/" style={{ display:"flex", alignItems:"center", gap:"10px", textDecoration:"none", color:c.text }}>
            <span style={{ fontSize:"22px" }}>⚙</span>
            <span style={{ fontSize:"15px", fontWeight:"800", letterSpacing:"2px", color:"#4fc3f7", fontFamily:"'IBM Plex Mono',monospace" }}>MACHINEBASE</span>
          </a>
          <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
            <div style={{ display:"flex", border:`1px solid ${c.pillBorder}`, borderRadius:"6px", overflow:"hidden" }}>
              <button onClick={() => setLang("ko")} style={{ background:lang==="ko"?"rgba(79,195,247,0.15)":"transparent", border:"none", color:lang==="ko"?"#4fc3f7":c.pillColor, padding:"6px 10px", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>KO</button>
              <button onClick={() => setLang("en")} style={{ background:lang==="en"?"rgba(79,195,247,0.15)":"transparent", border:"none", color:lang==="en"?"#4fc3f7":c.pillColor, padding:"6px 10px", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>EN</button>
            </div>
            <button onClick={() => setDark(!dark)} style={{ background:dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)", border:`1px solid ${c.pillBorder}`, borderRadius:"6px", padding:"6px 10px", cursor:"pointer", fontSize:"14px", lineHeight:1 }}>
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth:"900px", margin:"0 auto", padding: isMobile ? "40px 16px 80px" : "60px 24px 100px" }}>
        <a href="/" style={{ display:"inline-block", color:"#4fc3f7", fontSize:"13px", textDecoration:"none", marginBottom:"24px" }}>{t.back}</a>
        <h1 style={{ fontSize: isMobile ? "24px" : "32px", fontWeight:"800", marginBottom:"40px" }}>{t.title}</h1>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>{t.aboutTitle}</h2>
          <div style={bodyStyle}>{t.aboutBody}</div>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>{t.missionTitle}</h2>
          <div style={bodyStyle}>{t.missionBody}</div>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>{t.dataTitle}</h2>
          <div style={bodyStyle}>{t.dataBody}</div>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>{t.contactTitle}</h2>
          <div style={bodyStyle}>{t.contactBody}</div>
          <a href={`mailto:${t.contactEmail}`} style={{ display:"inline-block", marginTop:"16px", background:"rgba(79,195,247,0.1)", border:"1px solid rgba(79,195,247,0.3)", color:"#4fc3f7", padding:"12px 28px", borderRadius:"8px", fontSize:"14px", fontWeight:"700", textDecoration:"none", letterSpacing:"0.5px" }}>
            ✉ {t.contactEmail}
          </a>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>{t.linksTitle}</h2>
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
            <a href="/privacy" style={{ color:"#4fc3f7", fontSize:"14px", textDecoration:"none", padding:"8px 16px", border:"1px solid rgba(79,195,247,0.2)", borderRadius:"7px" }}>{t.privacyLink}</a>
            <a href="/terms" style={{ color:"#4fc3f7", fontSize:"14px", textDecoration:"none", padding:"8px 16px", border:"1px solid rgba(79,195,247,0.2)", borderRadius:"7px" }}>{t.termsLink}</a>
          </div>
        </section>
      </main>

      <footer style={{ borderTop:`1px solid ${c.specBlockBorder}`, padding:"24px" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"11px", color:c.footerColor, flexWrap:"wrap", gap:"8px" }}>
          <span>{t.copyright}</span>
          <a href="mailto:admin@machinebase.com" style={{ color:c.textMuted, textDecoration:"none" }}>✉ admin@machinebase.com</a>
        </div>
      </footer>
    </div>
  );
}
