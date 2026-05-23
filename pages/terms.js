import { useState, useEffect } from "react";
import Head from "next/head";

const theme = {
  dark: { bg:"#080c14", text:"#e0e6f0", textSub:"#6a7d92", textMuted:"#567", headerBg:"rgba(8,12,20,0.93)", headerBorder:"rgba(79,195,247,0.1)", pillBorder:"#1e2a3a", pillColor:"#789", cardBg:"rgba(255,255,255,0.03)", cardBorder:"rgba(255,255,255,0.06)", specBlockBorder:"rgba(255,255,255,0.06)", footerColor:"#445" },
  light: { bg:"#f0f4f8", text:"#1a2332", textSub:"#4a5568", textMuted:"#718096", headerBg:"rgba(240,244,248,0.95)", headerBorder:"rgba(0,0,0,0.08)", pillBorder:"#cbd5e1", pillColor:"#64748b", cardBg:"#ffffff", cardBorder:"#e2e8f0", specBlockBorder:"#e2e8f0", footerColor:"#718096" },
};

const content = {
  ko: {
    title: "이용약관",
    metaTitle: "이용약관 | MACHINEBASE",
    metaDesc: "MACHINEBASE 이용약관 - 서비스 이용 조건과 면책 사항을 안내합니다.",
    lastUpdated: "최종 수정일: 2025년 6월",
    sections: [
      { heading: "제1조 (목적)", body: "본 약관은 MACHINEBASE(이하 '서비스')가 제공하는 공작기계 사양 정보 서비스의 이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 기타 필요한 사항을 규정함을 목적으로 합니다." },
      { heading: "제2조 (서비스의 내용)", body: "서비스는 다음과 같은 기능을 제공합니다.\n\n• 글로벌 공작기계(CNC 선반, 머시닝센터, 5축 가공기, 복합가공기 등)의 상세 사양 정보 제공\n• 기계 간 사양 비교 기능\n• 기계별 사용자 평점 기능\n• 스펙 오류 신고 및 제보 기능" },
      { heading: "제3조 (면책 조항)", body: "본 사이트의 모든 제품 사양 정보는 각 제조사 공식 자료를 기반으로 작성되었으나, 오류·누락·변경이 있을 수 있습니다.\n\n• 구매 결정 전 반드시 제조사 또는 공식 대리점을 통해 최신 사양을 확인하시기 바랍니다.\n• 본 사이트는 정보 제공 목적으로만 운영되며, 게재된 정보로 인해 발생한 직·간접적 손해에 대해 어떠한 법적 책임도 지지 않습니다.\n• 사양 정보의 정확성을 보장하지 않으며, 정보 이용에 따른 모든 판단과 책임은 이용자에게 있습니다." },
      { heading: "제4조 (지식재산권)", body: "서비스의 디자인, 로고, 데이터베이스 구조 및 편집 저작물에 대한 권리는 MACHINEBASE에 있습니다. 개별 기계 사양 정보의 저작권은 해당 제조사에 있으며, 본 서비스는 정보 제공 목적으로 이를 수집·정리하여 제공합니다.\n\n이용자는 서비스의 콘텐츠를 개인적·비상업적 목적으로 이용할 수 있으나, 무단 복제, 대량 수집(크롤링), 재배포는 금지됩니다." },
      { heading: "제5조 (이용자의 의무)", body: "이용자는 다음 행위를 해서는 안 됩니다.\n\n• 서비스의 안정적 운영을 방해하는 행위\n• 자동화 도구를 이용한 대량 데이터 수집\n• 허위 정보를 고의로 제보하는 행위\n• 타인의 권리를 침해하거나 법령을 위반하는 행위" },
      { heading: "제6조 (광고)", body: "서비스는 Google AdSense 등 제3자 광고 네트워크를 통해 광고를 게재할 수 있습니다. 광고 내용에 대한 책임은 해당 광고주에게 있으며, 서비스는 광고로 인해 발생한 손해에 대해 책임을 지지 않습니다." },
      { heading: "제7조 (서비스의 변경 및 중단)", body: "서비스는 운영상 필요한 경우 사전 공지 후 서비스 내용을 변경하거나 중단할 수 있습니다. 무료로 제공되는 서비스의 변경·중단에 대해 별도의 보상을 하지 않습니다." },
      { heading: "제8조 (약관의 변경)", body: "본 약관은 관련 법령 및 서비스 정책 변경에 따라 수정될 수 있으며, 변경 시 서비스를 통해 공지합니다. 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다." },
      { heading: "제9조 (준거법 및 분쟁 해결)", body: "본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련한 분쟁은 서울중앙지방법원을 관할 법원으로 합니다." },
      { heading: "문의", body: "본 약관에 대한 문의사항은 admin@machinebase.com으로 연락해 주시기 바랍니다." },
    ],
    back: "← 메인으로",
    copyright: "© 2025 MACHINEBASE. 무단 복제 및 배포 금지.",
  },
  en: {
    title: "Terms of Service",
    metaTitle: "Terms of Service | MACHINEBASE",
    metaDesc: "MACHINEBASE Terms of Service - Service usage conditions and disclaimers.",
    lastUpdated: "Last updated: June 2025",
    sections: [
      { heading: "1. Purpose", body: "These Terms of Service govern the use of the machine tool specification information service provided by MACHINEBASE (hereinafter 'the Service') and define the rights, obligations, and other necessary matters between the Service and its users." },
      { heading: "2. Service Description", body: "The Service provides the following features:\n\n• Detailed specification information for global machine tools (CNC lathes, machining centers, 5-axis machines, multi-tasking machines, etc.)\n• Side-by-side machine specification comparison\n• User ratings per machine\n• Spec error reporting and submission" },
      { heading: "3. Disclaimer", body: "All product specifications on this site are based on official manufacturer data but may contain errors, omissions, or outdated information.\n\n• Always verify specifications directly with the manufacturer or authorized dealer before making purchasing decisions.\n• This site is operated for informational purposes only. We assume no legal liability for any direct or indirect damages arising from the use of information on this site.\n• We do not guarantee the accuracy of specification data. All judgments and responsibilities based on this information rest with the user." },
      { heading: "4. Intellectual Property", body: "Rights to the Service's design, logo, database structure, and editorial compilations belong to MACHINEBASE. Copyright for individual machine specifications belongs to the respective manufacturers, and this Service collects and organizes such information for informational purposes.\n\nUsers may use the Service's content for personal, non-commercial purposes. Unauthorized reproduction, mass collection (crawling), and redistribution are prohibited." },
      { heading: "5. User Obligations", body: "Users must not engage in the following activities:\n\n• Actions that disrupt the stable operation of the Service\n• Mass data collection using automated tools\n• Deliberately reporting false information\n• Infringing on the rights of others or violating applicable laws" },
      { heading: "6. Advertising", body: "The Service may display advertisements through third-party advertising networks such as Google AdSense. Responsibility for advertising content lies with the respective advertisers. The Service is not liable for any damages arising from advertisements." },
      { heading: "7. Service Modification & Suspension", body: "The Service may modify or suspend its content after prior notice when operationally necessary. No compensation will be provided for changes or suspension of services provided free of charge." },
      { heading: "8. Changes to Terms", body: "These Terms may be updated in accordance with changes in applicable laws or service policies. Changes will be announced through the Service. Users who do not agree to the updated terms may discontinue use of the Service." },
      { heading: "9. Governing Law & Dispute Resolution", body: "These Terms shall be interpreted under the laws of the Republic of Korea. Disputes related to the use of the Service shall be subject to the jurisdiction of the Seoul Central District Court." },
      { heading: "Contact", body: "For inquiries regarding these Terms, please contact admin@machinebase.com." },
    ],
    back: "← Home",
    copyright: "© 2025 MACHINEBASE. All rights reserved.",
  },
};

export default function TermsPage() {
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
