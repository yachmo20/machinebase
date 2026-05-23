import { useState, useEffect } from "react";

function ReportForm({ machine, lang, dark }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ report_type:"오류 수정", field_name:"", current_value:"", suggested_value:"", source_url:"", reporter_email:"" });
  const [status, setStatus] = useState(null);

  const t = lang === "en" ? {
    btn:"Report Error / Missing Spec", title:"Report Spec", type:"Report Type",
    types:["Correction","Missing Spec","Other"],
    field:"Field name (e.g. Max Spindle Speed)", current:"Current value shown",
    suggested:"Correct value", source:"Source URL (optional)", email:"Your email (optional)",
    submit:"Submit Report", sending:"Sending...",
    done:"Thank you! We will review and update.", error:"Failed. Please try again.", cancel:"Cancel",
  } : {
    btn:"스펙 오류 신고 / 누락 제보", title:"스펙 제보", type:"제보 유형",
    types:["오류 수정","누락 스펙 추가","기타"],
    field:"항목명 (예: 주축 최대 회전수)", current:"현재 표시된 값",
    suggested:"정확한 값", source:"출처 URL (선택)", email:"연락처 이메일 (선택)",
    submit:"제보 제출", sending:"전송 중...",
    done:"제보해주셔서 감사합니다! 검토 후 반영하겠습니다.", error:"전송 실패. 다시 시도해주세요.", cancel:"취소",
  };

  const inputStyle = {
    width:"100%", borderRadius:"7px", padding:"9px 12px", fontSize:"13px", outline:"none", boxSizing:"border-box",
    background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
    border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #d1d9e0",
    color: dark ? "#dde8f5" : "#1a2332",
  };

  const handleSubmit = async () => {
    setStatus('sending');
    try {
      const res = await fetch('/api/report', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ machine_id:machine.id, machine_name:machine.name, ...form })
      });
      if (res.ok) { setStatus('done'); setOpen(false); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <div style={{ marginTop:"32px", borderTop:`1px solid ${dark?"rgba(255,255,255,0.06)":"#e2e8f0"}`, paddingTop:"24px" }}>
      {status === 'done' ? (
        <div style={{ padding:"16px 20px", background:"rgba(79,195,247,0.08)", border:"1px solid rgba(79,195,247,0.2)", borderRadius:"10px", color:"#4fc3f7", fontSize:"14px" }}>✓ {t.done}</div>
      ) : !open ? (
        <button onClick={() => setOpen(true)} style={{ background:"transparent", cursor:"pointer", fontSize:"13px", padding:"10px 20px", borderRadius:"8px", border: dark?"1px solid rgba(255,255,255,0.1)":"1px solid #cbd5e1", color: dark?"#789":"#64748b" }}>⚑ {t.btn}</button>
      ) : (
        <div style={{ borderRadius:"12px", padding:"24px", background: dark?"rgba(255,255,255,0.02)":"#f8fafc", border: dark?"1px solid rgba(255,255,255,0.08)":"1px solid #e2e8f0" }}>
          <div style={{ fontSize:"14px", fontWeight:"700", color:"#4fc3f7", marginBottom:"20px" }}>⚑ {t.title} — {machine.name}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            <div style={{ gridColumn:"1/-1" }}>
              <div style={{ fontSize:"11px", color: dark?"#567":"#94a3b8", marginBottom:"5px" }}>{t.type}</div>
              <select value={form.report_type} onChange={e => setForm({...form, report_type:e.target.value})} style={inputStyle}>
                {t.types.map(tp => <option key={tp}>{tp}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:"11px", color: dark?"#567":"#94a3b8", marginBottom:"5px" }}>{t.field}</div>
              <input value={form.field_name} onChange={e => setForm({...form, field_name:e.target.value})} style={inputStyle} placeholder={t.field} />
            </div>
            <div>
              <div style={{ fontSize:"11px", color: dark?"#567":"#94a3b8", marginBottom:"5px" }}>{t.current}</div>
              <input value={form.current_value} onChange={e => setForm({...form, current_value:e.target.value})} style={inputStyle} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <div style={{ fontSize:"11px", color: dark?"#567":"#94a3b8", marginBottom:"5px" }}>{t.suggested}</div>
              <input value={form.suggested_value} onChange={e => setForm({...form, suggested_value:e.target.value})} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize:"11px", color: dark?"#567":"#94a3b8", marginBottom:"5px" }}>{t.source}</div>
              <input value={form.source_url} onChange={e => setForm({...form, source_url:e.target.value})} style={inputStyle} placeholder="https://..." />
            </div>
            <div>
              <div style={{ fontSize:"11px", color: dark?"#567":"#94a3b8", marginBottom:"5px" }}>{t.email}</div>
              <input value={form.reporter_email} onChange={e => setForm({...form, reporter_email:e.target.value})} style={inputStyle} placeholder="email@example.com" />
            </div>
          </div>
          {status === 'error' && <div style={{ color:"#f87171", fontSize:"12px", marginTop:"8px" }}>{t.error}</div>}
          <div style={{ display:"flex", gap:"8px", marginTop:"16px" }}>
            <button onClick={handleSubmit} disabled={status==='sending'} style={{ background:"#4fc3f7", color:"#080c14", border:"none", padding:"10px 24px", borderRadius:"7px", cursor:"pointer", fontSize:"13px", fontWeight:"700" }}>
              {status==='sending' ? t.sending : t.submit}
            </button>
            <button onClick={() => setOpen(false)} style={{ background:"transparent", padding:"10px 18px", borderRadius:"7px", cursor:"pointer", fontSize:"13px", border: dark?"1px solid #1e2a3a":"1px solid #cbd5e1", color: dark?"#789":"#64748b" }}>{t.cancel}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function StarRating({ machineId, currentAvg, currentCount, dark, lang }) {
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [avg, setAvg] = useState(currentAvg || 0);
  const [count, setCount] = useState(currentCount || 0);

  const handleRate = async (score) => {
    if (submitted) return;
    setSubmitted(true);
    try {
      const res = await fetch('/api/rate', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ machine_id: machineId, score })
      });
      const data = await res.json();
      if (data.avg) setAvg(Math.round(data.avg * 10) / 10);
      if (data.count) setCount(data.count);
    } catch(e) { console.error(e); }
  };

  const display = hovered || avg;
  const label = lang === "en" ? "Rate this machine" : "이 기계를 평가하세요";
  const submittedLabel = lang === "en" ? "Thanks for rating!" : "평가해주셔서 감사합니다!";

  return (
    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
      {[1,2,3,4,5].map(s => (
        <span key={s}
          onClick={() => handleRate(s)}
          onMouseEnter={() => !submitted && setHovered(s)}
          onMouseLeave={() => !submitted && setHovered(0)}
          style={{ fontSize:"16px", cursor: submitted ? "default" : "pointer", color: s <= display ? "#fbbf24" : dark?"#333":"#d1d5db", transition:"color 0.1s" }}>
          ★
        </span>
      ))}
      {count > 0 && <span style={{ fontSize:"11px", color: dark?"#567":"#94a3b8", marginLeft:"4px" }}>{avg} ({count}{lang==="en"?" reviews":"건"})</span>}
      {count === 0 && !submitted && <span style={{ fontSize:"11px", color: dark?"#456":"#94a3b8" }}>{label}</span>}
      {submitted && <span style={{ fontSize:"11px", color:"#4fc3f7" }}>{submittedLabel}</span>}
    </div>
  );
}

const i18n = {
  ko: {
    siteTitle: "MACHINEBASE", siteSub: "글로벌 공작기계 데이터베이스",
    navBrowse: "기계 탐색", navCompare: "비교하기",
    heroLabel: "전 세계 공작기계 데이터베이스",
    heroTitle1: "글로벌 공작기계를", heroTitle2: "완전 사양으로 비교하세요",
    heroDesc: "축 스트로크 · 주축 토크/파워 · 급이송속도 · 테이퍼 · 매거진 툴 수 · 테이블 크기 · 기계 무게 등\n22개 상세 스펙을 한 곳에서 검색하고 나란히 비교합니다.",
    searchPlaceholder: "기계명, 제조사, 기계 종류 검색...",
    statMachines: "등록 기종", statMakers: "글로벌 제조사", statSpecs: "비교 스펙 항목", statToday: "오늘 방문자",
    filterType: "기계 종류", filterMaker: "제조사", filterAll: "전체",
    compareSelected: "비교 선택:", compareNow: "지금 비교하기 →", compareReset: "✕ 초기화",
    detailSpec: "상세 스펙 →", addCompare: "+ 비교", inCompare: "✓ 비교중", reviews: "건",
    backToList: "← 목록으로", addToCompare: "+ 비교 추가", allSpecs: "전체 스펙",
    removeBtn: "✕ 제거", emptyCompare: "비교할 기계를 목록에서 선택해주세요 (최대 3개)",
    footerText: "전 세계 공작기계 정보 플랫폼", lastUpdated: "최종 업데이트", source: "출처",
    optionLabel: "옵션", standardLabel: "표준",
    disclaimerTitle: "면책 고지",
    disclaimer: "본 사이트의 모든 제품 사양 정보는 각 제조사 공식 자료를 기반으로 작성되었으나, 오류·누락·변경이 있을 수 있습니다. 구매 결정 전 반드시 제조사 또는 공식 대리점을 통해 최신 사양을 확인하시기 바랍니다. 본 사이트는 정보 제공 목적으로만 운영되며, 게재된 정보로 인해 발생한 직·간접적 손해에 대해 어떠한 법적 책임도 지지 않습니다.",
    copyright: "© 2025 MACHINEBASE. 무단 복제 및 배포 금지.", contact: "오류 신고",
    specGroups: { "가공 범위":"가공 범위","주축 사양":"주축 사양","이송 성능":"이송 성능","툴 매거진":"툴 매거진","제어 / 전장":"제어 / 전장","기계 제원":"기계 제원" },
  },
  en: {
    siteTitle: "MACHINEBASE", siteSub: "Global Machine Tool Database",
    navBrowse: "Browse", navCompare: "Compare",
    heroLabel: "Global Machine Tool Database",
    heroTitle1: "Compare Machine Tools", heroTitle2: "with Full Specifications",
    heroDesc: "Axis stroke · Spindle torque/power · Rapid feed · Taper · Magazine tools · Table size · Machine weight\nSearch and compare 22+ specs side by side.",
    searchPlaceholder: "Search by model, maker, type...",
    statMachines: "Models", statMakers: "Global Makers", statSpecs: "Spec Items", statToday: "Today's Visitors",
    filterType: "Type", filterMaker: "Maker", filterAll: "All",
    compareSelected: "Comparing:", compareNow: "Compare Now →", compareReset: "✕ Clear",
    detailSpec: "Full Specs →", addCompare: "+ Compare", inCompare: "✓ Added", reviews: "reviews",
    backToList: "← Back", addToCompare: "+ Add to Compare", allSpecs: "All Specs",
    removeBtn: "✕ Remove", emptyCompare: "Select machines from the list to compare (max 3)",
    footerText: "Global Machine Tool Information Platform", lastUpdated: "Last Updated", source: "Source",
    optionLabel: "Option", standardLabel: "Standard",
    disclaimerTitle: "Disclaimer",
    disclaimer: "All specifications on this site are based on official manufacturer data but may contain errors, omissions, or outdated information. Always verify specifications directly with the manufacturer or authorized dealer before making purchasing decisions. This site is for informational purposes only. We assume no liability for any direct or indirect damages arising from the use of information on this site.",
    copyright: "© 2025 MACHINEBASE. All rights reserved.", contact: "Report Error",
    specGroups: { "가공 범위":"Machining Range","주축 사양":"Spindle Specs","이송 성능":"Feed Performance","툴 매거진":"Tool Magazine","제어 / 전장":"Control / Electrical","기계 제원":"Machine Dimensions" },
  },
};

const specGroups = [
  { label:"가공 범위", icon:"📐", keys:["최대 소재 크기","최대 가공 직경","최대 가공 길이","X축 스트로크","Y축 스트로크","Z축 스트로크","테이블 크기","최대 적재 하중"] },
  { label:"주축 사양", icon:"⚙️", keys:["주축 최대 회전수","주축 테이퍼","주축 파워","주축 토크"] },
  { label:"이송 성능", icon:"⚡", keys:["최대 급이송속도","X축 급이송속도","Y축 급이송속도","Z축 급이송속도"] },
  { label:"툴 매거진", icon:"🔧", keys:["매거진 툴 수","최대 툴 직경","최대 툴 길이","최대 툴 무게"] },
  { label:"제어 / 전장", icon:"🖥️", keys:["제어기","소비전력"] },
  { label:"기계 제원", icon:"📦", keys:["기계 크기 (L×W×H)","기계 무게"] },
];

const specKeyMap = {
  "최대 소재 크기":"Max Workpiece Size","최대 가공 직경":"Max Turning Dia.","최대 가공 길이":"Max Turning Length",
  "X축 스트로크":"X Axis Stroke","Y축 스트로크":"Y Axis Stroke","Z축 스트로크":"Z Axis Stroke",
  "테이블 크기":"Table Size","최대 적재 하중":"Max Table Load","주축 최대 회전수":"Max Spindle Speed",
  "주축 테이퍼":"Spindle Taper","주축 파워":"Spindle Power","주축 토크":"Spindle Torque",
  "최대 급이송속도":"Max Rapid Feed","X축 급이송속도":"X Rapid Feed","Y축 급이송속도":"Y Rapid Feed","Z축 급이송속도":"Z Rapid Feed",
  "매거진 툴 수":"Magazine Capacity","최대 툴 직경":"Max Tool Dia.","최대 툴 길이":"Max Tool Length","최대 툴 무게":"Max Tool Weight",
  "제어기":"Controller","소비전력":"Power Consumption","기계 크기 (L×W×H)":"Machine Dimensions","기계 무게":"Machine Weight",
};

const typeMap = {
  "복합가공기":"Multi-Tasking","CNC 선반":"CNC Lathe","머시닝센터":"Machining Center",
  "5축 머시닝센터":"5-Axis MC","수평 머시닝센터":"Horizontal MC","드릴탭센터":"Drill/Tap Center",
};

const machines_fallback = [
  { id:1, name:"INTEGREX i-400", maker:"Mazak", country:"🇯🇵 일본", country_en:"🇯🇵 Japan", type:"복합가공기", year:2022, tags:["복합가공","5축","AI제어"], rating_avg:4.7, rating_count:124, max_workpiece_size:"φ610 × 1,524 mm", max_rapid_feed:"26 m/min", specs:{ "최대 소재 크기":"φ610 × 1,524 mm","최대 가공 직경":"φ 610 mm","최대 가공 길이":"1,524 mm","X축 스트로크":"–","Y축 스트로크":"–","Z축 스트로크":"1,524 mm","테이블 크기":"–","최대 적재 하중":"–","주축 최대 회전수":"5,000 rpm","주축 테이퍼":"CAT-50 / HSK-A100","주축 파워":"22 kW","주축 토크":"600 N·m","최대 급이송속도":"26 m/min","X축 급이송속도":"26 m/min","Y축 급이송속도":"–","Z축 급이송속도":"26 m/min","매거진 툴 수":"40개","최대 툴 직경":"φ 152 mm","최대 툴 길이":"350 mm","최대 툴 무게":"15 kg","제어기":"MAZATROL SmoothAi","소비전력":"35 kVA","기계 크기 (L×W×H)":"5,950 × 2,915 × 2,780 mm","기계 무게":"18,000 kg" } },
  { id:2, name:"NTX 2500", maker:"DMG Mori", country:"🇩🇪 독일", country_en:"🇩🇪 Germany", type:"복합가공기", year:2023, tags:["복합가공","5축","IoT"], rating_avg:4.5, rating_count:89, max_workpiece_size:"φ500 × 1,500 mm", max_rapid_feed:"24 m/min", specs:{ "최대 소재 크기":"φ500 × 1,500 mm","최대 가공 직경":"φ 500 mm","최대 가공 길이":"1,500 mm","X축 스트로크":"–","Y축 스트로크":"±52.5 mm","Z축 스트로크":"1,500 mm","테이블 크기":"–","최대 적재 하중":"–","주축 최대 회전수":"4,500 rpm","주축 테이퍼":"HSK-A100","주축 파워":"30 kW","주축 토크":"728 N·m","최대 급이송속도":"24 m/min","X축 급이송속도":"24 m/min","Y축 급이송속도":"24 m/min","Z축 급이송속도":"24 m/min","매거진 툴 수":"36개","최대 툴 직경":"φ 130 mm","최대 툴 길이":"350 mm","최대 툴 무게":"12 kg","제어기":"CELOS / Siemens 840D","소비전력":"40 kVA","기계 크기 (L×W×H)":"6,290 × 2,850 × 2,760 mm","기계 무게":"19,500 kg" } },
  { id:3, name:"PUMA 2600SY", maker:"DN Solutions", country:"🇰🇷 한국", country_en:"🇰🇷 Korea", type:"CNC 선반", year:2022, tags:["선반","서브스핀들","Y축"], rating_avg:4.3, rating_count:201, max_workpiece_size:"φ480 × 1,020 mm", max_rapid_feed:"24 m/min (Y: 12 / Z: 20)", specs:{ "최대 소재 크기":"φ480 × 1,020 mm","최대 가공 직경":"φ 480 mm","최대 가공 길이":"1,020 mm","X축 스트로크":"265 mm","Y축 스트로크":"±52 mm","Z축 스트로크":"1,055 mm","테이블 크기":"–","최대 적재 하중":"–","주축 최대 회전수":"4,500 rpm","주축 테이퍼":"A2-8","주축 파워":"22 kW","주축 토크":"588 N·m","최대 급이송속도":"24 m/min (Y: 12 / Z: 20)","X축 급이송속도":"24 m/min","Y축 급이송속도":"12 m/min","Z축 급이송속도":"20 m/min","매거진 툴 수":"30개","최대 툴 직경":"φ 120 mm","최대 툴 길이":"200 mm","최대 툴 무게":"8 kg","제어기":"Fanuc 0i-TF","소비전력":"30 kVA","기계 크기 (L×W×H)":"4,450 × 2,010 × 2,100 mm","기계 무게":"9,800 kg" } },
  { id:4, name:"LT-300MY", maker:"Hyundai WIA", country:"🇰🇷 한국", country_en:"🇰🇷 Korea", type:"CNC 선반", year:2021, tags:["선반","밀링복합","Y축"], rating_avg:4.2, rating_count:156, max_workpiece_size:"φ450 × 900 mm", max_rapid_feed:"20 m/min (Y: 10)", specs:{ "최대 소재 크기":"φ450 × 900 mm","최대 가공 직경":"φ 450 mm","최대 가공 길이":"900 mm","X축 스트로크":"260 mm","Y축 스트로크":"±50 mm","Z축 스트로크":"935 mm","테이블 크기":"–","최대 적재 하중":"–","주축 최대 회전수":"5,000 rpm","주축 테이퍼":"A2-8","주축 파워":"18.5 kW","주축 토크":"478 N·m","최대 급이송속도":"20 m/min (Y: 10)","X축 급이송속도":"20 m/min","Y축 급이송속도":"10 m/min","Z축 급이송속도":"20 m/min","매거진 툴 수":"24개","최대 툴 직경":"φ 100 mm","최대 툴 길이":"180 mm","최대 툴 무게":"6 kg","제어기":"Fanuc 0i-TF Plus","소비전력":"25 kVA","기계 크기 (L×W×H)":"4,060 × 1,950 × 2,050 mm","기계 무게":"8,200 kg" } },
  { id:5, name:"LB3000 EX II", maker:"Okuma", country:"🇯🇵 일본", country_en:"🇯🇵 Japan", type:"CNC 선반", year:2023, tags:["선반","서브스핀들","고정밀"], rating_avg:4.6, rating_count:98, max_workpiece_size:"φ505 × 1,010 mm", max_rapid_feed:"22 m/min (Y: 12)", specs:{ "최대 소재 크기":"φ505 × 1,010 mm","최대 가공 직경":"φ 505 mm","최대 가공 길이":"1,010 mm","X축 스트로크":"280 mm","Y축 스트로크":"±55 mm","Z축 스트로크":"1,025 mm","테이블 크기":"–","최대 적재 하중":"–","주축 최대 회전수":"5,000 rpm","주축 테이퍼":"A2-8","주축 파워":"22 kW","주축 토크":"556 N·m","최대 급이송속도":"22 m/min (Y: 12)","X축 급이송속도":"22 m/min","Y축 급이송속도":"12 m/min","Z축 급이송속도":"22 m/min","매거진 툴 수":"32개","최대 툴 직경":"φ 120 mm","최대 툴 길이":"200 mm","최대 툴 무게":"8 kg","제어기":"OSP-P500L","소비전력":"28 kVA","기계 크기 (L×W×H)":"4,360 × 2,050 × 2,130 mm","기계 무게":"10,200 kg" } },
  { id:6, name:"VF-2SS", maker:"Haas", country:"🇺🇸 미국", country_en:"🇺🇸 USA", type:"머시닝센터", year:2024, tags:["머시닝센터","고속가공","가성비"], rating_avg:4.4, rating_count:312, max_workpiece_size:"762 × 406 × 508 mm", max_rapid_feed:"35.6 m/min", specs:{ "최대 소재 크기":"762 × 406 × 508 mm","최대 가공 직경":"–","최대 가공 길이":"–","X축 스트로크":"762 mm","Y축 스트로크":"406 mm","Z축 스트로크":"508 mm","테이블 크기":"914 × 356 mm","최대 적재 하중":"1,360 kg","주축 최대 회전수":"12,000 rpm","주축 테이퍼":"CAT-40","주축 파워":"22.4 kW","주축 토크":"122 N·m","최대 급이송속도":"35.6 m/min","X축 급이송속도":"35.6 m/min","Y축 급이송속도":"35.6 m/min","Z축 급이송속도":"35.6 m/min","매거진 툴 수":"30개 사이드마운트 (옵션: 40개)","최대 툴 직경":"φ 89 mm","최대 툴 길이":"381 mm","최대 툴 무게":"5.4 kg","제어기":"Haas NGC","소비전력":"15 kVA","기계 크기 (L×W×H)":"2,667 × 2,794 × 2,946 mm","기계 무게":"5,670 kg" } },
  { id:7, name:"DMU 50", maker:"DMG Mori", country:"🇩🇪 독일", country_en:"🇩🇪 Germany", type:"5축 머시닝센터", year:2023, tags:["5축","고정밀","Heidenhain"], rating_avg:4.8, rating_count:76, max_workpiece_size:"φ630 × 400 mm", max_rapid_feed:"30 m/min", specs:{ "최대 소재 크기":"φ630 × 400 mm","최대 가공 직경":"–","최대 가공 길이":"–","X축 스트로크":"500 mm","Y축 스트로크":"450 mm","Z축 스트로크":"400 mm","테이블 크기":"φ 630 mm (로터리)","최대 적재 하중":"300 kg","주축 최대 회전수":"18,000 rpm","주축 테이퍼":"HSK-A63","주축 파워":"25 kW","주축 토크":"120 N·m","최대 급이송속도":"30 m/min","X축 급이송속도":"30 m/min","Y축 급이송속도":"30 m/min","Z축 급이송속도":"30 m/min","매거진 툴 수":"30개","최대 툴 직경":"φ 80 mm","최대 툴 길이":"300 mm","최대 툴 무게":"8 kg","제어기":"Heidenhain TNC 640","소비전력":"43 kVA","기계 크기 (L×W×H)":"3,210 × 2,700 × 2,872 mm","기계 무게":"8,500 kg" } },
  { id:8, name:"HCN-6800", maker:"Mazak", country:"🇯🇵 일본", country_en:"🇯🇵 Japan", type:"수평 머시닝센터", year:2022, tags:["수평MC","고생산성","파렛트"], rating_avg:4.6, rating_count:54, max_workpiece_size:"630 × 630 × 900 mm", max_rapid_feed:"60 m/min", specs:{ "최대 소재 크기":"630 × 630 × 900 mm","최대 가공 직경":"–","최대 가공 길이":"–","X축 스트로크":"900 mm","Y축 스트로크":"800 mm","Z축 스트로크":"900 mm","테이블 크기":"630 × 630 mm","최대 적재 하중":"800 kg","주축 최대 회전수":"12,000 rpm","주축 테이퍼":"BT-50 / HSK-A100","주축 파워":"30 kW","주축 토크":"334 N·m","최대 급이송속도":"60 m/min","X축 급이송속도":"60 m/min","Y축 급이송속도":"60 m/min","Z축 급이송속도":"60 m/min","매거진 툴 수":"40개","최대 툴 직경":"φ 125 mm","최대 툴 길이":"400 mm","최대 툴 무게":"20 kg","제어기":"MAZATROL SmoothG","소비전력":"55 kVA","기계 크기 (L×W×H)":"4,815 × 4,085 × 3,490 mm","기계 무게":"19,000 kg" } },
];

const makerColors = { Mazak:"#4fc3f7","DMG Mori":"#58a6ff","DN Solutions":"#00e5ff","Hyundai WIA":"#38bdf8",Okuma:"#a78bfa",Haas:"#4ade80" };
const previewKeys = ["최대 소재 크기","최대 급이송속도","주축 최대 회전수","주축 파워","매거진 툴 수"];

const theme = {
  dark: {
    bg:"#080c14", text:"#e0e6f0", textSub:"#6a7d92", textMuted:"#567",
    headerBg:"rgba(8,12,20,0.93)", headerBorder:"rgba(79,195,247,0.1)",
    cardBg:"rgba(255,255,255,0.03)", cardBorder:"rgba(255,255,255,0.06)",
    cardHoverBg:"rgba(255,255,255,0.04)", cardHoverBorder:"rgba(79,195,247,0.2)",
    filterBg:"rgba(255,255,255,0.02)", filterBorder:"rgba(255,255,255,0.04)",
    pillBorder:"#1e2a3a", pillColor:"#789",
    inputBg:"rgba(255,255,255,0.04)", inputBorder:"rgba(79,195,247,0.2)", inputColor:"#dde8f5",
    specKeyColor:"#567", specValColor:"#9bb",
    strokeBg:"rgba(255,255,255,0.04)", strokeBorder:"rgba(255,255,255,0.08)",
    tagBg:"rgba(255,255,255,0.05)", tagBorder:"rgba(255,255,255,0.08)", tagColor:"#789",
    btnBorder:"#1e2a3a", btnColor:"#789",
    specBlockBorder:"rgba(255,255,255,0.06)", specTitleBg:"rgba(79,195,247,0.04)",
    specItemBorder:"rgba(255,255,255,0.04)",
    compareBg:"rgba(255,255,255,0.02)", compareRowBg:"rgba(255,255,255,0.015)",
    compareColBorder:"rgba(255,255,255,0.04)", footerColor:"#445",
    gridLine:"rgba(79,195,247,0.03)",
  },
  light: {
    bg:"#f0f4f8", text:"#1a2332", textSub:"#4a5568", textMuted:"#718096",
    headerBg:"rgba(240,244,248,0.95)", headerBorder:"rgba(0,0,0,0.08)",
    cardBg:"#ffffff", cardBorder:"#e2e8f0",
    cardHoverBg:"#f8fafc", cardHoverBorder:"rgba(79,195,247,0.4)",
    filterBg:"#ffffff", filterBorder:"#e2e8f0",
    pillBorder:"#cbd5e1", pillColor:"#64748b",
    inputBg:"#ffffff", inputBorder:"rgba(79,195,247,0.3)", inputColor:"#1a2332",
    specKeyColor:"#718096", specValColor:"#2d3748",
    strokeBg:"#f1f5f9", strokeBorder:"#e2e8f0",
    tagBg:"#f1f5f9", tagBorder:"#e2e8f0", tagColor:"#64748b",
    btnBorder:"#cbd5e1", btnColor:"#64748b",
    specBlockBorder:"#e2e8f0", specTitleBg:"rgba(79,195,247,0.06)",
    specItemBorder:"#f1f5f9",
    compareBg:"#ffffff", compareRowBg:"#f8fafc",
    compareColBorder:"#f1f5f9", footerColor:"#718096",
    gridLine:"rgba(79,195,247,0.04)",
  },
};

export default function App({ machines: externalMachines, todayViews: initialTodayViews, allMakers: propMakers, allTypes: propTypes, total: totalMachines }) {
  const [lang, setLang] = useState("ko");
  const [dark, setDark] = useState(true);
  const [view, setView] = useState("browse");
  const [compareList, setCompareList] = useState([]);
  const [filterType, setFilterType] = useState("전체");
  const [filterMaker, setFilterMaker] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [detailMachine, setDetailMachine] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [todayViews, setTodayViews] = useState(initialTodayViews || 0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/pageview', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ page:'/' }) })
      .then(r => r.json()).then(d => { if (d.today_views) setTodayViews(d.today_views); }).catch(() => {});

    // 모바일 여부 감지 (768px 미만)
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const c = dark ? theme.dark : theme.light;
  const t = i18n[lang];
  const machineData = externalMachines && externalMachines.length > 0 ? externalMachines : machines_fallback;
  // DB에서 받은 전체 목록 우선 사용, 없으면 현재 로드된 데이터에서 추출
  const types = [t.filterAll, ...(propTypes && propTypes.length > 0 ? propTypes : [...new Set(machineData.map((m) => m.type))])];
  const makers = [t.filterAll, ...(propMakers && propMakers.length > 0 ? propMakers : [...new Set(machineData.map((m) => m.maker))].sort())];

  const filtered = machineData.filter((m) => {
    const matchType = filterType === "전체" || filterType === t.filterAll || m.type === filterType;
    const matchMaker = filterMaker === "전체" || filterMaker === t.filterAll || m.maker === filterMaker;
    const matchSearch = !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.maker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchMaker && matchSearch;
  });

  const toggleCompare = (machine) => {
    if (compareList.find((m) => m.id === machine.id)) setCompareList(compareList.filter((m) => m.id !== machine.id));
    else if (compareList.length < 3) setCompareList([...compareList, machine]);
  };

  const isInCompare = (id) => compareList.some((m) => m.id === id);

  const openDetail = async (machine) => {
    setView("detail");
    window.history.pushState({ view: "detail" }, "");
    if (machine.specs) { setDetailMachine(machine); return; }
    setLoadingDetail(true);
    setDetailMachine(machine);
    try {
      const res = await fetch(`/api/machine?id=${machine.id}`);
      const data = await res.json();
      if (data) {
        const full = { ...data, tags: typeof data.tags === 'string' ? data.tags.split(',') : data.tags || [] };
        setDetailMachine(full);
      }
    } catch (e) { console.error(e); }
    setLoadingDetail(false);
  };

  // 브라우저 뒤로가기 → 상세/비교 화면에서 목록으로 복귀
  useEffect(() => {
    const handlePopState = () => {
      setView("browse");
      setDetailMachine(null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const getSpecKey = (key) => lang === "en" ? (specKeyMap[key] || key) : key;
  const getGroupLabel = (label) => t.specGroups[label] || label;
  const getType = (type) => lang === "en" ? (typeMap[type] || type) : type;
  const getCountry = (m) => lang === "en" ? (m.country_en || m.country) : m.country;

  const getStandardVal = (val) => {
    if (!val) return "–";
    return String(val).replace(/\s*\(옵션[^)]*\)/g, "").replace(/\s*\(Option[^)]*\)/gi, "").trim() || "–";
  };

  const SpecVal = ({ val }) => {
    if (!val || val === "–") return <span style={{ color:c.specValColor, fontFamily:"IBM Plex Mono,monospace", fontWeight:"600" }}>–</span>;
    const str = String(val);
    const optMatch = str.match(/^(.*?)\s*(\([옵션Option][^)]*\))(.*)$/i);
    if (!optMatch) return <span style={{ color:c.specValColor, fontFamily:"IBM Plex Mono,monospace", fontWeight:"600", fontSize:"13px" }}>{str}</span>;
    return (
      <span style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:"13px" }}>
        <span style={{ color:c.specValColor, fontWeight:"600" }}>{optMatch[1]}</span>
        <span style={{ color:"#4fc3f7", fontSize:"11px", marginLeft:"4px", opacity:0.8 }}>{optMatch[2]}</span>
        {optMatch[3] && <span style={{ color:c.specValColor, fontWeight:"600" }}>{optMatch[3]}</span>}
      </span>
    );
  };

  const compareGroups = activeGroup ? specGroups.filter((g) => g.label === activeGroup) : specGroups;
  const colCount = compareList.length || 1;

  const heroStats = [
    [(totalMachines || machineData.length)+"+", t.statMachines],
    [(propMakers && propMakers.length > 0 ? propMakers.length : new Set(machineData.map(m=>m.maker)).size).toString(), t.statMakers],
    ["22+", t.statSpecs],
    [todayViews > 0 ? todayViews.toLocaleString() : "–", t.statToday],
  ];

  // 필터 버튼 공통 스타일
  const pillStyle = (active) => ({
    background: active ? "rgba(79,195,247,0.1)" : "transparent",
    border: `1px solid ${active ? "#4fc3f7" : c.pillBorder}`,
    color: active ? "#4fc3f7" : c.pillColor,
    padding:"4px 11px", borderRadius:"20px", cursor:"pointer", fontSize:"12px",
    whiteSpace:"nowrap", transition:"all 0.15s",
  });

  return (
    <div style={{ minHeight:"100vh", backgroundColor:c.bg, color:c.text, fontFamily:"'Noto Sans KR','IBM Plex Sans',sans-serif", position:"relative", overflowX:"hidden", transition:"background 0.3s, color 0.3s" }}>
      <div style={{ position:"fixed", inset:0, backgroundImage:`linear-gradient(${c.gridLine} 1px,transparent 1px),linear-gradient(90deg,${c.gridLine} 1px,transparent 1px)`, backgroundSize:"40px 40px", pointerEvents:"none", zIndex:0 }} />

      {/* Header */}
      <header style={{ position:"sticky", top:0, zIndex:100, background:c.headerBg, backdropFilter:"blur(12px)", borderBottom:`1px solid ${c.headerBorder}`, transition:"background 0.3s" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "10px 14px" : "12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap: isMobile ? "wrap" : "nowrap", gap: isMobile ? "10px" : "0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", minWidth:0, flex: isMobile ? "1 1 auto" : "0 0 auto" }}>
            <span style={{ fontSize: isMobile ? "22px" : "26px", flexShrink:0 }}>⚙</span>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize: isMobile ? "15px" : "17px", fontWeight:"800", letterSpacing: isMobile ? "2px" : "3px", color:"#4fc3f7", fontFamily:"'IBM Plex Mono',monospace", whiteSpace:"nowrap" }}>{t.siteTitle}</div>
              <div style={{ fontSize: isMobile ? "9px" : "10px", color:c.textMuted, letterSpacing:"1px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.siteSub}</div>
            </div>
          </div>
          {/* 모바일: 우측 상단에 KO/EN + 테마만 */}
          {isMobile && (
            <div style={{ display:"flex", gap:"6px", alignItems:"center", flexShrink:0 }}>
              <div style={{ display:"flex", border:`1px solid ${c.pillBorder}`, borderRadius:"6px", overflow:"hidden" }}>
                <button onClick={() => setLang("ko")} style={{ background:lang==="ko"?"rgba(79,195,247,0.15)":"transparent", border:"none", color:lang==="ko"?"#4fc3f7":c.pillColor, padding:"6px 10px", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>KO</button>
                <button onClick={() => setLang("en")} style={{ background:lang==="en"?"rgba(79,195,247,0.15)":"transparent", border:"none", color:lang==="en"?"#4fc3f7":c.pillColor, padding:"6px 10px", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>EN</button>
              </div>
              <button onClick={() => setDark(!dark)} style={{ background:dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)", border:`1px solid ${c.pillBorder}`, borderRadius:"6px", padding:"6px 10px", cursor:"pointer", fontSize:"14px", lineHeight:1, transition:"all 0.2s" }}>
                {dark ? "☀️" : "🌙"}
              </button>
            </div>
          )}
          {/* 모바일: 둘째 줄에 메뉴 버튼 (전체 폭) */}
          {isMobile ? (
            <nav style={{ display:"flex", gap:"8px", alignItems:"center", width:"100%", flexBasis:"100%" }}>
              <button onClick={() => setView("browse")} style={{ flex:1, background:view==="browse"?"rgba(79,195,247,0.08)":"transparent", border:`1px solid ${view==="browse"?"#4fc3f7":c.pillBorder}`, color:view==="browse"?"#4fc3f7":c.pillColor, padding:"9px 10px", borderRadius:"6px", cursor:"pointer", fontSize:"13px" }}>{t.navBrowse}</button>
              <button onClick={() => compareList.length > 0 && setView("compare")} style={{ flex:1, background:view==="compare"?"rgba(79,195,247,0.08)":"transparent", border:`1px solid ${view==="compare"?"#4fc3f7":c.pillBorder}`, color:view==="compare"?"#4fc3f7":c.pillColor, padding:"9px 10px", borderRadius:"6px", cursor:"pointer", fontSize:"13px", position:"relative", opacity:compareList.length===0?0.4:1 }}>
                {t.navCompare}{compareList.length > 0 && <span style={{ position:"absolute", top:"-6px", right:"-6px", background:"#4fc3f7", color:"#080c14", borderRadius:"50%", width:"16px", height:"16px", fontSize:"10px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center" }}>{compareList.length}</span>}
              </button>
            </nav>
          ) : (
            /* 데스크탑: 기존 한 줄 그대로 */
            <nav style={{ display:"flex", gap:"8px", alignItems:"center" }}>
              <button onClick={() => setView("browse")} style={{ background:view==="browse"?"rgba(79,195,247,0.08)":"transparent", border:`1px solid ${view==="browse"?"#4fc3f7":c.pillBorder}`, color:view==="browse"?"#4fc3f7":c.pillColor, padding:"8px 18px", borderRadius:"6px", cursor:"pointer", fontSize:"13px" }}>{t.navBrowse}</button>
              <button onClick={() => compareList.length > 0 && setView("compare")} style={{ background:view==="compare"?"rgba(79,195,247,0.08)":"transparent", border:`1px solid ${view==="compare"?"#4fc3f7":c.pillBorder}`, color:view==="compare"?"#4fc3f7":c.pillColor, padding:"8px 18px", borderRadius:"6px", cursor:"pointer", fontSize:"13px", position:"relative", opacity:compareList.length===0?0.4:1 }}>
                {t.navCompare}{compareList.length > 0 && <span style={{ position:"absolute", top:"-6px", right:"-6px", background:"#4fc3f7", color:"#080c14", borderRadius:"50%", width:"16px", height:"16px", fontSize:"10px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center" }}>{compareList.length}</span>}
              </button>
              <div style={{ display:"flex", border:`1px solid ${c.pillBorder}`, borderRadius:"6px", overflow:"hidden", marginLeft:"4px" }}>
                <button onClick={() => setLang("ko")} style={{ background:lang==="ko"?"rgba(79,195,247,0.15)":"transparent", border:"none", color:lang==="ko"?"#4fc3f7":c.pillColor, padding:"7px 12px", cursor:"pointer", fontSize:"12px", fontWeight:"600" }}>KO</button>
                <button onClick={() => setLang("en")} style={{ background:lang==="en"?"rgba(79,195,247,0.15)":"transparent", border:"none", color:lang==="en"?"#4fc3f7":c.pillColor, padding:"7px 12px", cursor:"pointer", fontSize:"12px", fontWeight:"600" }}>EN</button>
              </div>
              <button onClick={() => setDark(!dark)} style={{ background:dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)", border:`1px solid ${c.pillBorder}`, borderRadius:"6px", padding:"7px 12px", cursor:"pointer", fontSize:"15px", lineHeight:1, transition:"all 0.2s" }}>
                {dark ? "☀️" : "🌙"}
              </button>
            </nav>
          )}
        </div>
      </header>

      <main style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "0 14px 60px" : "0 24px 60px", position:"relative", zIndex:1 }}>

        {/* BROWSE */}
        {view === "browse" && (<>
          <section style={{ textAlign:"center", padding:"70px 20px 44px", opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(20px)", transition:"all 0.7s ease" }}>
            <div style={{ display:"inline-block", border:"1px solid rgba(79,195,247,0.3)", color:"#4fc3f7", fontSize:"11px", letterSpacing:"2px", padding:"4px 14px", borderRadius:"20px", marginBottom:"20px", background:"rgba(79,195,247,0.05)" }}>{t.heroLabel}</div>
            <h1 style={{ fontSize:"clamp(26px,4.5vw,48px)", fontWeight:"800", lineHeight:1.2, margin:"0 0 14px", color:c.text }}>{t.heroTitle1}<br /><span style={{ background:"linear-gradient(90deg,#4fc3f7,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{t.heroTitle2}</span></h1>
            <p style={{ color:c.textSub, fontSize:"14px", maxWidth:"540px", margin:"0 auto 28px", lineHeight:1.8, whiteSpace:"pre-line" }}>{t.heroDesc}</p>
            <div style={{ position:"relative", maxWidth:"480px", margin:"0 auto 36px" }}>
              <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width:"100%", background:c.inputBg, border:`1px solid ${c.inputBorder}`, borderRadius:"10px", padding:"14px 48px 14px 18px", color:c.inputColor, fontSize:"14px", outline:"none", boxSizing:"border-box" }} />
              <span style={{ position:"absolute", right:"16px", top:"50%", transform:"translateY(-50%)", fontSize:"16px" }}>🔍</span>
            </div>
            <div style={{ display:"flex", justifyContent:"center", gap:"32px", flexWrap:"wrap" }}>
              {heroStats.map(([n, l]) => (
                <div key={l} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <span style={{ fontSize:"26px", fontWeight:"800", color: l===t.statToday?"#a78bfa":"#4fc3f7", fontFamily:"'IBM Plex Mono',monospace" }}>{n}</span>
                  <span style={{ fontSize:"11px", color:c.textMuted, marginTop:"2px" }}>{l===t.statToday ? "👁 "+l : l}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── 필터 섹션 — 기계 종류 + 제조사 세로 배치 ── */}
          <section style={{ marginBottom:"20px", padding:"18px 20px", background:c.filterBg, borderRadius:"12px", border:`1px solid ${c.filterBorder}`, transition:"background 0.3s" }}>

            {/* 기계 종류 */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:"12px", marginBottom:"14px" }}>
              <span style={{ fontSize:"11px", color:c.textMuted, letterSpacing:"1px", minWidth:"52px", paddingTop:"5px", flexShrink:0 }}>{t.filterType}</span>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {types.map((tp) => (
                  <button key={tp} onClick={() => setFilterType(tp)} style={pillStyle(filterType===tp || (filterType==="전체" && tp===t.filterAll))}>
                    {getType(tp)}
                  </button>
                ))}
              </div>
            </div>

            {/* 구분선 */}
            <div style={{ borderTop:`1px solid ${c.filterBorder}`, marginBottom:"14px" }} />

            {/* 제조사 — 전체 wrap */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:"12px" }}>
              <span style={{ fontSize:"11px", color:c.textMuted, letterSpacing:"1px", minWidth:"52px", paddingTop:"5px", flexShrink:0 }}>{t.filterMaker}</span>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {makers.map((mk) => (
                  <button key={mk} onClick={() => setFilterMaker(mk)} style={pillStyle(filterMaker===mk || (filterMaker==="전체" && mk===t.filterAll))}>
                    {mk}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {compareList.length > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:"14px", padding:"12px 20px", background:"rgba(79,195,247,0.07)", border:"1px solid rgba(79,195,247,0.2)", borderRadius:"10px", marginBottom:"22px", flexWrap:"wrap" }}>
              <span style={{ flex:1, fontSize:"13px", color:"#9dd" }}>{t.compareSelected} {compareList.map((m)=>m.name).join(" vs ")}</span>
              <button onClick={() => setView("compare")} style={{ background:"#4fc3f7", color:"#080c14", border:"none", padding:"8px 18px", borderRadius:"6px", cursor:"pointer", fontSize:"13px", fontWeight:"700" }}>{t.compareNow}</button>
              <button onClick={() => setCompareList([])} style={{ background:"transparent", border:`1px solid ${c.pillBorder}`, color:c.pillColor, padding:"8px 14px", borderRadius:"6px", cursor:"pointer", fontSize:"12px" }}>{t.compareReset}</button>
            </div>
          )}

          {/* Cards */}
          <section style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:"18px" }}>
            {filtered.map((machine, i) => (
              <div key={machine.id}
                style={{ background: isInCompare(machine.id)?"rgba(79,195,247,0.05)":hoveredCard===machine.id?c.cardHoverBg:c.cardBg,
                  border:`1px solid ${isInCompare(machine.id)?"#4fc3f7":hoveredCard===machine.id?c.cardHoverBorder:c.cardBorder}`,
                  borderRadius:"14px", padding:"0 0 18px", overflow:"hidden", position:"relative",
                  transition:"all 0.25s ease", boxShadow: dark?"none":hoveredCard===machine.id?"0 8px 30px rgba(0,0,0,0.1)":"0 2px 8px rgba(0,0,0,0.04)",
                  opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(30px)", transitionDelay:`${i*0.06}s` }}
                onMouseEnter={() => setHoveredCard(machine.id)} onMouseLeave={() => setHoveredCard(null)}>
                <div style={{ height:"3px", width:"100%", backgroundColor:makerColors[machine.maker]||"#4fc3f7" }} />
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"16px 18px 8px" }}>
                  <div>
                    <div style={{ fontSize:"10px", color:c.textMuted, letterSpacing:"1px", marginBottom:"3px" }}>{getType(machine.type)}</div>
                    <div style={{ fontSize:"15px", fontWeight:"700", color:c.text, marginBottom:"3px", fontFamily:"'IBM Plex Mono',monospace" }}>{machine.name}</div>
                    <div style={{ fontSize:"12px", color:c.textSub, display:"flex", alignItems:"center", gap:"6px" }}>
                      <span style={{ width:"7px", height:"7px", borderRadius:"50%", display:"inline-block", backgroundColor:makerColors[machine.maker]||"#4fc3f7" }} />
                      {machine.maker} · {getCountry(machine)}
                    </div>
                  </div>
                  <div style={{ fontSize:"11px", color:c.textMuted, fontFamily:"'IBM Plex Mono',monospace" }}>{machine.year}</div>
                </div>
                <div style={{ padding:"0 18px 6px" }}>
                  <StarRating machineId={machine.id} currentAvg={machine.rating_avg || machine.rating} currentCount={machine.rating_count} dark={dark} lang={lang} />
                </div>
                <div style={{ margin:"8px 18px 0", display:"flex", flexDirection:"column", gap:"5px" }}>
                  {previewKeys.map((k) => (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:"11.5px", borderBottom:`1px solid ${c.specItemBorder}`, paddingBottom:"4px" }}>
                      <span style={{ color:c.specKeyColor }}>{getSpecKey(k)}</span>
                      <span style={{ color:c.specValColor, fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px", textAlign:"right", maxWidth:"55%" }}>
                        {getStandardVal(machine.specs?.[k] ?? machine[k==="최대 소재 크기"?"max_workpiece_size":k==="최대 급이송속도"?"max_rapid_feed":k])}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:"6px", padding:"10px 18px 0", flexWrap:"wrap" }}>
                  {["X축 스트로크","Y축 스트로크","Z축 스트로크"].map((ax) => (
                    <div key={ax} style={{ background:c.strokeBg, border:`1px solid ${c.strokeBorder}`, borderRadius:"6px", padding:"5px 10px", display:"flex", flexDirection:"column", alignItems:"center", minWidth:"70px" }}>
                      <span style={{ fontSize:"9px", color:"#4fc3f7", letterSpacing:"1px", fontWeight:"700", fontFamily:"'IBM Plex Mono',monospace" }}>{ax[0]}</span>
                      <span style={{ fontSize:"10px", color:c.specValColor, fontFamily:"'IBM Plex Mono',monospace", marginTop:"2px" }}>{machine.specs?.[ax]??"–"}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:"5px", padding:"8px 18px 0", flexWrap:"wrap" }}>
                  {(typeof machine.tags==="string"?machine.tags.split(","):machine.tags||[]).map((tag) => (
                    <span key={tag} style={{ background:c.tagBg, border:`1px solid ${c.tagBorder}`, color:c.tagColor, fontSize:"10px", padding:"2px 8px", borderRadius:"10px" }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display:"flex", gap:"8px", padding:"12px 18px 0" }}>
                  <button style={{ flex:1, background:"transparent", border:`1px solid ${c.btnBorder}`, color:c.btnColor, padding:"8px", borderRadius:"7px", cursor:"pointer", fontSize:"12px" }} onClick={() => openDetail(machine)}>{t.detailSpec}</button>
                  <button onClick={() => toggleCompare(machine)} style={{ flex:1, background:isInCompare(machine.id)?"rgba(79,195,247,0.15)":"transparent", border:`1px solid ${isInCompare(machine.id)?"#4fc3f7":"rgba(79,195,247,0.3)"}`, color:"#4fc3f7", padding:"8px", borderRadius:"7px", cursor:"pointer", fontSize:"12px" }}>
                    {isInCompare(machine.id)?t.inCompare:t.addCompare}
                  </button>
                </div>
              </div>
            ))}
          </section>
        </>)}

        {/* DETAIL */}
        {view === "detail" && detailMachine && (
          <section style={{ padding:"36px 0" }}>
            {loadingDetail && <div style={{ textAlign:"center", padding:"20px", color:"#4fc3f7", fontSize:"13px" }}>⟳ {lang==="ko"?"상세 스펙 불러오는 중...":"Loading full specs..."}</div>}
            <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"20px", flexWrap:"wrap" }}>
              <button onClick={() => window.history.back()} style={{ background:"transparent", border:`1px solid ${c.btnBorder}`, color:c.btnColor, padding:"8px 16px", borderRadius:"7px", cursor:"pointer", fontSize:"13px" }}>{t.backToList}</button>
              <div>
                <h2 style={{ fontSize:"20px", fontWeight:"700", color:c.text, margin:0 }}>{detailMachine.name}</h2>
                <span style={{ fontSize:"12px", color:c.textMuted }}>
                  {detailMachine.maker} · {getCountry(detailMachine)} · {detailMachine.year}
                  {detailMachine.last_verified && <span style={{ marginLeft:"12px", color:"#4fc3f7" }}>✓ {t.lastUpdated}: {new Date(detailMachine.last_verified).toLocaleDateString()}</span>}
                  {detailMachine.source_url && <a href={detailMachine.source_url} target="_blank" rel="noreferrer" style={{ marginLeft:"12px", color:"#4fc3f7", fontSize:"11px" }}>🔗 {t.source}</a>}
                </span>
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"20px", alignItems:"center" }}>
              {(typeof detailMachine.tags==="string"?detailMachine.tags.split(","):detailMachine.tags||[]).map((tg) => (
                <span key={tg} style={{ background:c.tagBg, border:`1px solid ${c.tagBorder}`, color:c.tagColor, fontSize:"10px", padding:"2px 8px", borderRadius:"10px" }}>{tg}</span>
              ))}
              <button onClick={() => toggleCompare(detailMachine)} style={{ background:isInCompare(detailMachine.id)?"rgba(79,195,247,0.15)":"transparent", border:`1px solid ${isInCompare(detailMachine.id)?"#4fc3f7":"rgba(79,195,247,0.3)"}`, color:"#4fc3f7", padding:"5px 14px", borderRadius:"7px", cursor:"pointer", fontSize:"12px" }}>
                {isInCompare(detailMachine.id)?t.inCompare:t.addToCompare}
              </button>
            </div>
            <div style={{ marginBottom:"24px", padding:"16px 20px", background:c.filterBg, borderRadius:"10px", border:`1px solid ${c.filterBorder}` }}>
              <StarRating machineId={detailMachine.id} currentAvg={detailMachine.rating_avg || detailMachine.rating} currentCount={detailMachine.rating_count} dark={dark} lang={lang} />
            </div>
            {specGroups.map((group) => (
              <div key={group.label} style={{ marginBottom:"16px", border:`1px solid ${c.specBlockBorder}`, borderRadius:"12px", overflow:"hidden" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"11px 20px", background:c.specTitleBg, borderBottom:`1px solid ${c.specBlockBorder}`, fontSize:"13px", fontWeight:"700", color:"#4fc3f7", letterSpacing:"1px" }}>
                  <span>{group.icon}</span><span>{getGroupLabel(group.label)}</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))" }}>
                  {group.keys.map((key) => (
                    <div key={key} style={{ padding:"12px 20px", borderRight:`1px solid ${c.specItemBorder}`, borderBottom:`1px solid ${c.specItemBorder}`, background:c.cardBg }}>
                      <div style={{ fontSize:"10px", color:c.specKeyColor, marginBottom:"4px", letterSpacing:"0.5px" }}>{getSpecKey(key)}</div>
                      <SpecVal val={detailMachine.specs?.[key]} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <ReportForm machine={detailMachine} lang={lang} dark={dark} />
          </section>
        )}

        {/* COMPARE */}
        {view === "compare" && (
          <section style={{ padding:"36px 0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"20px", flexWrap:"wrap" }}>
              <button onClick={() => setView("browse")} style={{ background:"transparent", border:`1px solid ${c.btnBorder}`, color:c.btnColor, padding:"8px 16px", borderRadius:"7px", cursor:"pointer", fontSize:"13px" }}>{t.backToList}</button>
              <h2 style={{ fontSize:"20px", fontWeight:"700", color:c.text, margin:0 }}>{t.navCompare}</h2>
            </div>
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"16px" }}>
              <button onClick={() => setActiveGroup(null)} style={{ background:activeGroup===null?"rgba(79,195,247,0.1)":"transparent", border:`1px solid ${activeGroup===null?"#4fc3f7":c.pillBorder}`, color:activeGroup===null?"#4fc3f7":c.pillColor, padding:"6px 14px", borderRadius:"20px", cursor:"pointer", fontSize:"12px" }}>{t.allSpecs}</button>
              {specGroups.map((g) => (
                <button key={g.label} onClick={() => setActiveGroup(g.label)} style={{ background:activeGroup===g.label?"rgba(79,195,247,0.1)":"transparent", border:`1px solid ${activeGroup===g.label?"#4fc3f7":c.pillBorder}`, color:activeGroup===g.label?"#4fc3f7":c.pillColor, padding:"6px 14px", borderRadius:"20px", cursor:"pointer", fontSize:"12px" }}>
                  {g.icon} {getGroupLabel(g.label)}
                </button>
              ))}
            </div>
            {compareList.length === 0 ? (
              <div style={{ textAlign:"center", color:c.textMuted, padding:"60px", border:`1px dashed ${c.pillBorder}`, borderRadius:"12px" }}>{t.emptyCompare}</div>
            ) : (
              <div style={{ background:c.compareBg, border:`1px solid ${c.specBlockBorder}`, borderRadius:"14px", overflowX:"auto" }}>
                <div style={{ display:"grid", gridTemplateColumns:`200px repeat(${colCount},1fr)`, borderBottom:`1px solid ${c.compareColBorder}`, minWidth:"580px" }}>
                  <div style={{ padding:"12px 18px", borderRight:`1px solid ${c.compareColBorder}` }} />
                  {compareList.map((m) => (
                    <div key={m.id} style={{ padding:"18px", borderRight:`1px solid ${c.compareColBorder}`, position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", backgroundColor:makerColors[m.maker]||"#4fc3f7" }} />
                      <div style={{ fontSize:"14px", fontWeight:"700", color:c.text, fontFamily:"'IBM Plex Mono',monospace", marginBottom:"3px" }}>{m.name}</div>
                      <div style={{ fontSize:"12px", color:c.textSub, marginBottom:"2px" }}>{m.maker}</div>
                      <div style={{ fontSize:"11px", color:c.textMuted, marginBottom:"8px" }}>{getCountry(m)} · {m.year}</div>
                      <StarRating machineId={m.id} currentAvg={m.rating_avg || m.rating} currentCount={m.rating_count} dark={dark} lang={lang} />
                      <div style={{ display:"flex", gap:"4px", flexWrap:"wrap", margin:"6px 0" }}>
                        {(typeof m.tags==="string"?m.tags.split(","):m.tags||[]).map((tg) => (
                          <span key={tg} style={{ background:c.tagBg, border:`1px solid ${c.tagBorder}`, color:c.tagColor, fontSize:"10px", padding:"2px 8px", borderRadius:"10px" }}>{tg}</span>
                        ))}
                      </div>
                      <button onClick={() => toggleCompare(m)} style={{ background:"transparent", border:`1px solid ${c.btnBorder}`, color:c.textMuted, padding:"4px 10px", borderRadius:"6px", cursor:"pointer", fontSize:"11px", marginTop:"6px" }}>{t.removeBtn}</button>
                    </div>
                  ))}
                </div>
                {compareGroups.map((group) => (
                  <div key={group.label}>
                    <div style={{ display:"grid", gridTemplateColumns:`200px repeat(${colCount},1fr)`, background:"rgba(79,195,247,0.04)", borderBottom:`1px solid ${c.compareColBorder}`, minWidth:"580px" }}>
                      <div style={{ padding:"12px 18px", borderRight:`1px solid ${c.compareColBorder}`, color:"#4fc3f7", fontWeight:"700", fontSize:"11px", letterSpacing:"1px", display:"flex", alignItems:"center" }}>
                        {group.icon} {getGroupLabel(group.label).toUpperCase()}
                      </div>
                      {compareList.map((m) => <div key={m.id} style={{ borderRight:`1px solid ${c.compareColBorder}` }} />)}
                    </div>
                    {group.keys.map((key, ki) => (
                      <div key={key} style={{ display:"grid", gridTemplateColumns:`200px repeat(${colCount},1fr)`, backgroundColor:ki%2===0?c.compareRowBg:"transparent", borderBottom:`1px solid ${c.compareColBorder}`, minWidth:"580px" }}>
                        <div style={{ padding:"12px 18px", fontSize:"11.5px", color:c.specKeyColor, fontWeight:"600", borderRight:`1px solid ${c.compareColBorder}`, display:"flex", alignItems:"center" }}>{getSpecKey(key)}</div>
                        {compareList.map((m) => (
                          <div key={m.id} style={{ padding:"11px 18px", fontSize:"12px", color:c.specValColor, fontFamily:"'IBM Plex Mono',monospace", display:"flex", alignItems:"center", borderRight:`1px solid ${c.compareColBorder}` }}>
                            {m.specs?.[key]??"–"}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer style={{ borderTop:`1px solid ${c.specBlockBorder}`, paddingTop:"32px", paddingBottom:"24px", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "0 14px" : "0 24px" }}>
          <div style={{ background: dark?"rgba(255,255,255,0.02)":"#f8fafc", border:`1px solid ${c.specBlockBorder}`, borderRadius:"10px", padding:"18px 22px", marginBottom:"20px" }}>
            <div style={{ fontSize:"11px", fontWeight:"700", color:"#4fc3f7", letterSpacing:"1px", marginBottom:"8px" }}>⚠ {t.disclaimerTitle.toUpperCase()}</div>
            <p style={{ fontSize:"11px", color:c.textMuted, lineHeight:1.7, margin:0 }}>{t.disclaimer}</p>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"12px", justifyContent:"space-between", alignItems:"center", fontSize:"11px" }}>
            <span style={{ color:c.footerColor }}>{t.copyright}</span>
            <div style={{ display:"flex", gap:"16px", alignItems:"center", flexWrap:"wrap" }}>
              <a href="/about" style={{ color:c.textMuted, textDecoration:"none" }}>{lang==="ko"?"소개/문의":"About"}</a>
              <span style={{ color:c.specBlockBorder }}>·</span>
              <a href="/privacy" style={{ color:c.textMuted, textDecoration:"none" }}>{lang==="ko"?"개인정보 처리방침":"Privacy"}</a>
              <span style={{ color:c.specBlockBorder }}>·</span>
              <a href="/terms" style={{ color:c.textMuted, textDecoration:"none" }}>{lang==="ko"?"이용약관":"Terms"}</a>
              <span style={{ color:c.specBlockBorder }}>·</span>
              <a href="mailto:admin@machinebase.com" style={{ color:c.textMuted, textDecoration:"none" }}>✉ {t.contact}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
