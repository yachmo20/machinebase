import { useState, useEffect } from "react";
import Head from "next/head";

const theme = {
  dark: { bg:"#080c14", text:"#e0e6f0", textSub:"#6a7d92", textMuted:"#567", headerBg:"rgba(8,12,20,0.93)", headerBorder:"rgba(79,195,247,0.1)", pillBorder:"#1e2a3a", pillColor:"#789", cardBg:"rgba(255,255,255,0.03)", cardBorder:"rgba(255,255,255,0.06)", specBlockBorder:"rgba(255,255,255,0.06)", footerColor:"#445" },
  light: { bg:"#f0f4f8", text:"#1a2332", textSub:"#4a5568", textMuted:"#718096", headerBg:"rgba(240,244,248,0.95)", headerBorder:"rgba(0,0,0,0.08)", pillBorder:"#cbd5e1", pillColor:"#64748b", cardBg:"#ffffff", cardBorder:"#e2e8f0", specBlockBorder:"#e2e8f0", footerColor:"#718096" },
};

const content = {
  ko: {
    title: "개인정보 처리방침",
    metaTitle: "개인정보 처리방침 | MACHINEBASE",
    metaDesc: "MACHINEBASE 개인정보 처리방침 - 수집하는 정보, 이용 목적, 보호 방법에 대해 안내합니다.",
    lastUpdated: "최종 수정일: 2025년 6월",
    sections: [
      { heading: "1. 수집하는 개인정보", body: "MACHINEBASE는 서비스 제공을 위해 최소한의 정보만 수집합니다.\n\n• 자동 수집 정보: 방문자의 IP 주소, 브라우저 유형, 운영체제, 방문 일시, 페이지 조회 기록\n• 선택 제공 정보: 스펙 오류 신고 시 입력하는 이메일 주소 (선택 항목)\n• 평점 데이터: 기계별 사용자 평점 (개인 식별 불가)" },
      { heading: "2. 개인정보의 이용 목적", body: "수집된 정보는 다음 목적으로만 이용됩니다.\n\n• 서비스 운영 및 개선: 방문자 통계 분석, 사이트 성능 개선\n• 오류 대응: 사용자가 제보한 스펙 오류의 확인 및 수정\n• 광고 게재: Google AdSense를 통한 맞춤형 광고 제공" },
      { heading: "3. Google AdSense 및 쿠키", body: "본 사이트는 Google AdSense를 사용하여 광고를 게재합니다. Google은 쿠키를 사용하여 이전 방문 기록을 기반으로 관련성 높은 광고를 표시할 수 있습니다.\n\n• Google의 광고 쿠키 사용에 대한 자세한 내용은 Google 개인정보 처리방침(https://policies.google.com/privacy)을 참고하세요.\n• 사용자는 Google 광고 설정(https://adssettings.google.com)에서 맞춤 광고를 비활성화할 수 있습니다.\n• 또는 www.aboutads.info에서 제3자 광고 쿠키 사용을 거부할 수 있습니다." },
      { heading: "4. 개인정보의 보관 및 파기", body: "자동 수집되는 방문 로그는 서비스 운영 기간 동안 보관되며, 서비스 종료 시 지체 없이 파기합니다. 오류 제보 시 제공된 이메일 주소는 처리 완료 후 30일 이내에 삭제합니다." },
      { heading: "5. 개인정보의 제3자 제공", body: "MACHINEBASE는 수집된 개인정보를 제3자에게 판매, 대여, 공유하지 않습니다. 단, 법률에 의한 요청이 있는 경우에는 관련 법령에 따라 제공될 수 있습니다." },
      { heading: "6. 이용자의 권리", body: "이용자는 언제든지 자신의 개인정보에 대해 열람, 수정, 삭제를 요청할 수 있습니다. 관련 요청은 아래 연락처로 보내주시기 바랍니다." },
      { heading: "7. 개인정보 보호책임자", body: "문의: admin@machinebase.com\n\n본 방침은 관련 법령 및 서비스 정책 변경에 따라 수정될 수 있으며, 변경 시 사이트를 통해 공지합니다." },
    ],
    back: "← 메인으로",
    copyright: "© 2025 MACHINEBASE. 무단 복제 및 배포 금지.",
  },
  en: {
    title: "Privacy Policy",
    metaTitle: "Privacy Policy | MACHINEBASE",
    metaDesc: "MACHINEBASE Privacy Policy - Learn about the information we collect, how we use it, and how we protect your data.",
    lastUpdated: "Last updated: June 2025",
    sections: [
      { heading: "1. Information We Collect", body: "MACHINEBASE collects only the minimum information necessary to provide our service.\n\n• Automatically collected: Visitor IP address, browser type, operating system, visit timestamps, page view history\n• Optionally provided: Email address submitted when reporting spec errors (optional)\n• Rating data: User ratings per machine (not personally identifiable)" },
      { heading: "2. How We Use Information", body: "Collected information is used only for the following purposes:\n\n• Service operation and improvement: Visitor statistics analysis, site performance optimization\n• Error response: Verification and correction of user-reported spec errors\n• Advertising: Serving targeted ads through Google AdSense" },
      { heading: "3. Google AdSense & Cookies", body: "This site uses Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits.\n\n• For more details about Google's use of advertising cookies, see Google's Privacy Policy (https://policies.google.com/privacy).\n• You can opt out of personalized advertising at Google Ad Settings (https://adssettings.google.com).\n• You can also opt out of third-party ad cookies at www.aboutads.info." },
      { heading: "4. Data Retention & Deletion", body: "Automatically collected visit logs are retained during the service operation period and will be promptly deleted upon service termination. Email addresses provided during error reports are deleted within 30 days of resolution." },
      { heading: "5. Third-Party Disclosure", body: "MACHINEBASE does not sell, rent, or share collected personal information with third parties. However, information may be provided in accordance with applicable laws when required by legal process." },
      { heading: "6. Your Rights", body: "You may request access to, correction of, or deletion of your personal information at any time. Please send related requests to the contact below." },
      { heading: "7. Data Protection Contact", body: "Contact: admin@machinebase.com\n\nThis policy may be updated in accordance with changes in applicable laws or service policies. Changes will be announced on this site." },
    ],
    back: "← Home",
    copyright: "© 2025 MACHINEBASE. All rights reserved.",
  },
};

export default function PrivacyPage() {
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
        <h1 style={{ fontSize: isMobile ? "24px" : "32px", fontWeight:"800", marginBottom:"8px" }}>{t.title}</h1>
        <p style={{ color:c.textMuted, fontSize:"12px", marginBottom:"40px" }}>{t.lastUpdated}</p>

        {t.sections.map((sec, i) => (
          <section key={i} style={{ marginBottom:"36px" }}>
            <h2 style={{ fontSize:"16px", fontWeight:"700", color:"#4fc3f7", marginBottom:"12px" }}>{sec.heading}</h2>
            <div style={{ fontSize:"14px", lineHeight:1.9, color:c.textSub, whiteSpace:"pre-line" }}>{sec.body}</div>
          </section>
        ))}
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
