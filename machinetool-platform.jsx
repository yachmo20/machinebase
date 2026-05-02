import { useState, useEffect } from "react";

function ReportForm({ machine, lang }) {
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
    <div style={{ marginTop:"32px", borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"24px" }}>
      {status === 'done' ? (
        <div style={{ padding:"16px 20px", background:"rgba(79,195,247,0.08)", border:"1px solid rgba(79,195,247,0.2)", borderRadius:"10px", color:"#4fc3f7", fontSize:"14px" }}>
          ✓ {t.done}
        </div>
      ) : !open ? (
        <button onClick={() => setOpen(true)}
          style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.1)", color:"#789", padding:"10px 20px", borderRadius:"8px", cursor:"pointer", fontSize:"13px" }}>
          ⚑ {t.btn}
        </button>
      ) : (
        <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"24px" }}>
          <div style={{ fontSize:"14px", fontWeight:"700", color:"#4fc3f7", marginBottom:"20px" }}>⚑ {t.title} — {machine.name}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            <div style={{ gridColumn:"1/-1" }}>
              <div style={RF.label}>{t.type}</div>
              <select value={form.report_type} onChange={e => setForm({...form, report_type:e.target.value})} style={RF.input}>
                {t.types.map(tp => <option key={tp}>{tp}</option>)}
              </select>
            </div>
            <div>
              <div style={RF.label}>{t.field}</div>
              <input value={form.field_name} onChange={e => setForm({...form, field_name:e.target.value})} style={RF.input} placeholder={t.field} />
            </div>
            <div>
              <div style={RF.label}>{t.current}</div>
              <input value={form.current_value} onChange={e => setForm({...form, current_value:e.target.value})} style={RF.input} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <div style={RF.label}>{t.suggested}</div>
              <input value={form.suggested_value} onChange={e => setForm({...form, suggested_value:e.target.value})} style={RF.input} />
            </div>
            <div>
              <div style={RF.label}>{t.source}</div>
              <input value={form.source_url} onChange={e => setForm({...form, source_url:e.target.value})} style={RF.input} placeholder="https://..." />
            </div>
            <div>
              <div style={RF.label}>{t.email}</div>
              <input value={form.reporter_email} onChange={e => setForm({...form, reporter_email:e.target.value})} style={RF.input} placeholder="email@example.com" />
            </div>
          </div>
          {status === 'error' && <div style={{ color:"#f87171", fontSize:"12px", marginTop:"8px" }}>{t.error}</div>}
          <div style={{ display:"flex", gap:"8px", marginTop:"16px" }}>
            <button onClick={handleSubmit} disabled={status==='sending'}
              style={{ background:"#4fc3f7", color:"#080c14", border:"none", padding:"10px 24px", borderRadius:"7px", cursor:"pointer", fontSize:"13px", fontWeight:"700" }}>
              {status==='sending' ? t.sending : t.submit}
            </button>
            <button onClick={() => setOpen(false)}
              style={{ background:"transparent", border:"1px solid #1e2a3a", color:"#789", padding:"10px 18px", borderRadius:"7px", cursor:"pointer", fontSize:"13px" }}>
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const RF = {
  label: { fontSize:"11px", color:"#567", marginBottom:"5px" },
  input: { width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"7px", padding:"9px 12px", color:"#dde8f5", fontSize:"13px", outline:"none", boxSizing:"border-box" },
};


const i18n = {
  ko: {
    siteTitle: "MACHINEBASE",
    siteSub: "글로벌 공작기계 데이터베이스",
    navBrowse: "기계 탐색",
    navCompare: "비교하기",
    heroLabel: "전 세계 공작기계 데이터베이스",
    heroTitle1: "글로벌 공작기계를",
    heroTitle2: "완전 사양으로 비교하세요",
    heroDesc: "축 스트로크 · 주축 토크/파워 · 급이송속도 · 테이퍼 · 매거진 툴 수 · 테이블 크기 · 기계 무게 등\n22개 상세 스펙을 한 곳에서 검색하고 나란히 비교합니다.",
    searchPlaceholder: "기계명, 제조사, 기계 종류 검색...",
    statMachines: "등록 기종",
    statMakers: "글로벌 제조사",
    statSpecs: "비교 스펙 항목",
    filterType: "기계 종류",
    filterMaker: "제조사",
    filterAll: "전체",
    compareSelected: "비교 선택:",
    compareNow: "지금 비교하기 →",
    compareReset: "✕ 초기화",
    detailSpec: "상세 스펙 →",
    addCompare: "+ 비교",
    inCompare: "✓ 비교중",
    reviews: "건",
    backToList: "← 목록으로",
    addToCompare: "+ 비교 추가",
    allSpecs: "전체 스펙",
    removeBtn: "✕ 제거",
    emptyCompare: "비교할 기계를 목록에서 선택해주세요 (최대 3개)",
    footerText: "전 세계 공작기계 정보 플랫폼",
    lastUpdated: "최종 업데이트",
    source: "출처",
    specGroups: {
      "가공 범위": "가공 범위",
      "주축 사양": "주축 사양",
      "이송 성능": "이송 성능",
      "툴 매거진": "툴 매거진",
      "제어 / 전장": "제어 / 전장",
      "기계 제원": "기계 제원",
    },
  },
  en: {
    siteTitle: "MACHINEBASE",
    siteSub: "Global Machine Tool Database",
    navBrowse: "Browse",
    navCompare: "Compare",
    heroLabel: "Global Machine Tool Database",
    heroTitle1: "Compare Machine Tools",
    heroTitle2: "with Full Specifications",
    heroDesc: "Axis stroke · Spindle torque/power · Rapid feed · Taper · Magazine tools · Table size · Machine weight\nSearch and compare 22+ specs side by side.",
    searchPlaceholder: "Search by model, maker, type...",
    statMachines: "Models",
    statMakers: "Global Makers",
    statSpecs: "Spec Items",
    filterType: "Type",
    filterMaker: "Maker",
    filterAll: "All",
    compareSelected: "Comparing:",
    compareNow: "Compare Now →",
    compareReset: "✕ Clear",
    detailSpec: "Full Specs →",
    addCompare: "+ Compare",
    inCompare: "✓ Added",
    reviews: "reviews",
    backToList: "← Back",
    addToCompare: "+ Add to Compare",
    allSpecs: "All Specs",
    removeBtn: "✕ Remove",
    emptyCompare: "Select machines from the list to compare (max 3)",
    footerText: "Global Machine Tool Information Platform",
    lastUpdated: "Last Updated",
    source: "Source",
    specGroups: {
      "가공 범위": "Machining Range",
      "주축 사양": "Spindle Specs",
      "이송 성능": "Feed Performance",
      "툴 매거진": "Tool Magazine",
      "제어 / 전장": "Control / Electrical",
      "기계 제원": "Machine Dimensions",
    },
  },
};

const specGroups = [
  {
    label: "가공 범위",
    icon: "📐",
    keys: ["최대 소재 크기","최대 가공 직경","최대 가공 길이","X축 스트로크","Y축 스트로크","Z축 스트로크","테이블 크기","최대 적재 하중"],
  },
  {
    label: "주축 사양",
    icon: "⚙️",
    keys: ["주축 최대 회전수","주축 테이퍼","주축 파워","주축 토크"],
  },
  {
    label: "이송 성능",
    icon: "⚡",
    keys: ["최대 급이송속도","X축 급이송속도","Y축 급이송속도","Z축 급이송속도"],
  },
  {
    label: "툴 매거진",
    icon: "🔧",
    keys: ["매거진 툴 수","최대 툴 직경","최대 툴 길이","최대 툴 무게"],
  },
  {
    label: "제어 / 전장",
    icon: "🖥️",
    keys: ["제어기","소비전력"],
  },
  {
    label: "기계 제원",
    icon: "📦",
    keys: ["기계 크기 (L×W×H)","기계 무게"],
  },
];

const specKeyMap = {
  "최대 소재 크기": "Max Workpiece Size",
  "최대 가공 직경": "Max Turning Dia.",
  "최대 가공 길이": "Max Turning Length",
  "X축 스트로크": "X Axis Stroke",
  "Y축 스트로크": "Y Axis Stroke",
  "Z축 스트로크": "Z Axis Stroke",
  "테이블 크기": "Table Size",
  "최대 적재 하중": "Max Table Load",
  "주축 최대 회전수": "Max Spindle Speed",
  "주축 테이퍼": "Spindle Taper",
  "주축 파워": "Spindle Power",
  "주축 토크": "Spindle Torque",
  "최대 급이송속도": "Max Rapid Feed",
  "X축 급이송속도": "X Rapid Feed",
  "Y축 급이송속도": "Y Rapid Feed",
  "Z축 급이송속도": "Z Rapid Feed",
  "매거진 툴 수": "Magazine Capacity",
  "최대 툴 직경": "Max Tool Dia.",
  "최대 툴 길이": "Max Tool Length",
  "최대 툴 무게": "Max Tool Weight",
  "제어기": "Controller",
  "소비전력": "Power Consumption",
  "기계 크기 (L×W×H)": "Machine Dimensions",
  "기계 무게": "Machine Weight",
};

const typeMap = {
  "복합가공기": "Multi-Tasking",
  "CNC 선반": "CNC Lathe",
  "머시닝센터": "Machining Center",
  "5축 머시닝센터": "5-Axis MC",
  "수평 머시닝센터": "Horizontal MC",
};

const machines_fallback = [
  {
    id:1, name:"INTEGREX i-400", maker:"Mazak", country:"🇯🇵 일본", country_en:"🇯🇵 Japan",
    type:"복합가공기", year:2022, tags:["복합가공","5축","AI제어"], rating:4.7, reviews:124,
    max_workpiece_size:"φ610 × 1,524 mm", max_rapid_feed:"26 m/min",
    specs:{
      "최대 소재 크기":"φ610 × 1,524 mm","최대 가공 직경":"φ 610 mm","최대 가공 길이":"1,524 mm",
      "X축 스트로크":"–","Y축 스트로크":"–","Z축 스트로크":"1,524 mm","테이블 크기":"–","최대 적재 하중":"–",
      "주축 최대 회전수":"5,000 rpm","주축 테이퍼":"CAT-50 / HSK-A100","주축 파워":"22 kW","주축 토크":"600 N·m",
      "최대 급이송속도":"26 m/min","X축 급이송속도":"26 m/min","Y축 급이송속도":"–","Z축 급이송속도":"26 m/min",
      "매거진 툴 수":"40개","최대 툴 직경":"φ 152 mm","최대 툴 길이":"350 mm","최대 툴 무게":"15 kg",
      "제어기":"MAZATROL SmoothAi","소비전력":"35 kVA","기계 크기 (L×W×H)":"5,950 × 2,915 × 2,780 mm","기계 무게":"18,000 kg",
    },
  },
  {
    id:2, name:"NTX 2500", maker:"DMG Mori", country:"🇩🇪 독일", country_en:"🇩🇪 Germany",
    type:"복합가공기", year:2023, tags:["복합가공","5축","IoT"], rating:4.5, reviews:89,
    max_workpiece_size:"φ500 × 1,500 mm", max_rapid_feed:"24 m/min",
    specs:{
      "최대 소재 크기":"φ500 × 1,500 mm","최대 가공 직경":"φ 500 mm","최대 가공 길이":"1,500 mm",
      "X축 스트로크":"–","Y축 스트로크":"±52.5 mm","Z축 스트로크":"1,500 mm","테이블 크기":"–","최대 적재 하중":"–",
      "주축 최대 회전수":"4,500 rpm","주축 테이퍼":"HSK-A100","주축 파워":"30 kW","주축 토크":"728 N·m",
      "최대 급이송속도":"24 m/min","X축 급이송속도":"24 m/min","Y축 급이송속도":"24 m/min","Z축 급이송속도":"24 m/min",
      "매거진 툴 수":"36개","최대 툴 직경":"φ 130 mm","최대 툴 길이":"350 mm","최대 툴 무게":"12 kg",
      "제어기":"CELOS / Siemens 840D","소비전력":"40 kVA","기계 크기 (L×W×H)":"6,290 × 2,850 × 2,760 mm","기계 무게":"19,500 kg",
    },
  },
  {
    id:3, name:"PUMA 2600SY", maker:"DN Solutions", country:"🇰🇷 한국", country_en:"🇰🇷 Korea",
    type:"CNC 선반", year:2022, tags:["선반","서브스핀들","Y축"], rating:4.3, reviews:201,
    max_workpiece_size:"φ480 × 1,020 mm", max_rapid_feed:"24 m/min",
    specs:{
      "최대 소재 크기":"φ480 × 1,020 mm","최대 가공 직경":"φ 480 mm","최대 가공 길이":"1,020 mm",
      "X축 스트로크":"265 mm","Y축 스트로크":"±52 mm","Z축 스트로크":"1,055 mm","테이블 크기":"–","최대 적재 하중":"–",
      "주축 최대 회전수":"4,500 rpm","주축 테이퍼":"A2-8","주축 파워":"22 kW","주축 토크":"588 N·m",
      "최대 급이송속도":"24 m/min","X축 급이송속도":"24 m/min","Y축 급이송속도":"12 m/min","Z축 급이송속도":"20 m/min",
      "매거진 툴 수":"30개","최대 툴 직경":"φ 120 mm","최대 툴 길이":"200 mm","최대 툴 무게":"8 kg",
      "제어기":"Fanuc 0i-TF","소비전력":"30 kVA","기계 크기 (L×W×H)":"4,450 × 2,010 × 2,100 mm","기계 무게":"9,800 kg",
    },
  },
  {
    id:4, name:"LT-300MY", maker:"Hyundai WIA", country:"🇰🇷 한국", country_en:"🇰🇷 Korea",
    type:"CNC 선반", year:2021, tags:["선반","밀링복합","Y축"], rating:4.2, reviews:156,
    max_workpiece_size:"φ450 × 900 mm", max_rapid_feed:"20 m/min",
    specs:{
      "최대 소재 크기":"φ450 × 900 mm","최대 가공 직경":"φ 450 mm","최대 가공 길이":"900 mm",
      "X축 스트로크":"260 mm","Y축 스트로크":"±50 mm","Z축 스트로크":"935 mm","테이블 크기":"–","최대 적재 하중":"–",
      "주축 최대 회전수":"5,000 rpm","주축 테이퍼":"A2-8","주축 파워":"18.5 kW","주축 토크":"478 N·m",
      "최대 급이송속도":"20 m/min","X축 급이송속도":"20 m/min","Y축 급이송속도":"10 m/min","Z축 급이송속도":"20 m/min",
      "매거진 툴 수":"24개","최대 툴 직경":"φ 100 mm","최대 툴 길이":"180 mm","최대 툴 무게":"6 kg",
      "제어기":"Fanuc 0i-TF Plus","소비전력":"25 kVA","기계 크기 (L×W×H)":"4,060 × 1,950 × 2,050 mm","기계 무게":"8,200 kg",
    },
  },
  {
    id:5, name:"LB3000 EX II", maker:"Okuma", country:"🇯🇵 일본", country_en:"🇯🇵 Japan",
    type:"CNC 선반", year:2023, tags:["선반","서브스핀들","고정밀"], rating:4.6, reviews:98,
    max_workpiece_size:"φ505 × 1,010 mm", max_rapid_feed:"22 m/min",
    specs:{
      "최대 소재 크기":"φ505 × 1,010 mm","최대 가공 직경":"φ 505 mm","최대 가공 길이":"1,010 mm",
      "X축 스트로크":"280 mm","Y축 스트로크":"±55 mm","Z축 스트로크":"1,025 mm","테이블 크기":"–","최대 적재 하중":"–",
      "주축 최대 회전수":"5,000 rpm","주축 테이퍼":"A2-8","주축 파워":"22 kW","주축 토크":"556 N·m",
      "최대 급이송속도":"22 m/min","X축 급이송속도":"22 m/min","Y축 급이송속도":"12 m/min","Z축 급이송속도":"22 m/min",
      "매거진 툴 수":"32개","최대 툴 직경":"φ 120 mm","최대 툴 길이":"200 mm","최대 툴 무게":"8 kg",
      "제어기":"OSP-P500L","소비전력":"28 kVA","기계 크기 (L×W×H)":"4,360 × 2,050 × 2,130 mm","기계 무게":"10,200 kg",
    },
  },
  {
    id:6, name:"VF-2SS", maker:"Haas", country:"🇺🇸 미국", country_en:"🇺🇸 USA",
    type:"머시닝센터", year:2022, tags:["머시닝센터","고속가공","가성비"], rating:4.4, reviews:312,
    max_workpiece_size:"762 × 406 × 508 mm", max_rapid_feed:"25.4 m/min",
    specs:{
      "최대 소재 크기":"762 × 406 × 508 mm","최대 가공 직경":"–","최대 가공 길이":"–",
      "X축 스트로크":"762 mm","Y축 스트로크":"406 mm","Z축 스트로크":"508 mm","테이블 크기":"914 × 356 mm","최대 적재 하중":"1,360 kg",
      "주축 최대 회전수":"12,000 rpm","주축 테이퍼":"CAT-40","주축 파워":"22.4 kW","주축 토크":"122 N·m",
      "최대 급이송속도":"25.4 m/min","X축 급이송속도":"25.4 m/min","Y축 급이송속도":"25.4 m/min","Z축 급이송속도":"25.4 m/min",
      "매거진 툴 수":"24개","최대 툴 직경":"φ 89 mm","최대 툴 길이":"381 mm","최대 툴 무게":"5.4 kg",
      "제어기":"Haas NGC","소비전력":"15 kVA","기계 크기 (L×W×H)":"2,667 × 2,794 × 2,946 mm","기계 무게":"5,670 kg",
    },
  },
  {
    id:7, name:"DMU 50", maker:"DMG Mori", country:"🇩🇪 독일", country_en:"🇩🇪 Germany",
    type:"5축 머시닝센터", year:2023, tags:["5축","고정밀","Heidenhain"], rating:4.8, reviews:76,
    max_workpiece_size:"φ630 × 400 mm (로터리테이블)", max_rapid_feed:"30 m/min",
    specs:{
      "최대 소재 크기":"φ630 × 400 mm","최대 가공 직경":"–","최대 가공 길이":"–",
      "X축 스트로크":"500 mm","Y축 스트로크":"450 mm","Z축 스트로크":"400 mm","테이블 크기":"φ 630 mm (로터리)","최대 적재 하중":"300 kg",
      "주축 최대 회전수":"18,000 rpm","주축 테이퍼":"HSK-A63","주축 파워":"25 kW","주축 토크":"120 N·m",
      "최대 급이송속도":"30 m/min","X축 급이송속도":"30 m/min","Y축 급이송속도":"30 m/min","Z축 급이송속도":"30 m/min",
      "매거진 툴 수":"30개","최대 툴 직경":"φ 80 mm","최대 툴 길이":"300 mm","최대 툴 무게":"8 kg",
      "제어기":"Heidenhain TNC 640","소비전력":"43 kVA","기계 크기 (L×W×H)":"3,210 × 2,700 × 2,872 mm","기계 무게":"8,500 kg",
    },
  },
  {
    id:8, name:"HCN-6800", maker:"Mazak", country:"🇯🇵 일본", country_en:"🇯🇵 Japan",
    type:"수평 머시닝센터", year:2022, tags:["수평MC","고생산성","파렛트"], rating:4.6, reviews:54,
    max_workpiece_size:"630 × 630 × 900 mm", max_rapid_feed:"60 m/min",
    specs:{
      "최대 소재 크기":"630 × 630 × 900 mm","최대 가공 직경":"–","최대 가공 길이":"–",
      "X축 스트로크":"900 mm","Y축 스트로크":"800 mm","Z축 스트로크":"900 mm","테이블 크기":"630 × 630 mm","최대 적재 하중":"800 kg",
      "주축 최대 회전수":"12,000 rpm","주축 테이퍼":"BT-50 / HSK-A100","주축 파워":"30 kW","주축 토크":"334 N·m",
      "최대 급이송속도":"60 m/min","X축 급이송속도":"60 m/min","Y축 급이송속도":"60 m/min","Z축 급이송속도":"60 m/min",
      "매거진 툴 수":"40개","최대 툴 직경":"φ 125 mm","최대 툴 길이":"400 mm","최대 툴 무게":"20 kg",
      "제어기":"MAZATROL SmoothG","소비전력":"55 kVA","기계 크기 (L×W×H)":"4,815 × 4,085 × 3,490 mm","기계 무게":"19,000 kg",
    },
  },
];

const makerColors = {
  Mazak:"#4fc3f7","DMG Mori":"#58a6ff","DN Solutions":"#00e5ff",
  "Hyundai WIA":"#38bdf8",Okuma:"#a78bfa",Haas:"#4ade80",
};

const previewKeys = ["최대 소재 크기","최대 급이송속도","주축 최대 회전수","주축 파워","매거진 툴 수"];

export default function App({ machines: externalMachines }) {
  const [lang, setLang] = useState("ko");
  const [view, setView] = useState("browse");
  const [compareList, setCompareList] = useState([]);
  const [filterType, setFilterType] = useState("전체");
  const [filterMaker, setFilterMaker] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [detailMachine, setDetailMachine] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => { setMounted(true); }, []);

  const t = i18n[lang];
  const machineData = externalMachines && externalMachines.length > 0 ? externalMachines : machines_fallback;

  const types = [t.filterAll, ...new Set(machineData.map((m) => m.type))];
  const makers = [t.filterAll, ...new Set(machineData.map((m) => m.maker))];

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
    if (compareList.find((m) => m.id === machine.id)) {
      setCompareList(compareList.filter((m) => m.id !== machine.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, machine]);
    }
  };

  const isInCompare = (id) => compareList.some((m) => m.id === id);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const openDetail = async (machine) => {
    setView("detail");
    if (machine.specs) {
      setDetailMachine(machine);
      return;
    }
    setLoadingDetail(true);
    setDetailMachine(machine);
    try {
      const res = await fetch(`/api/machine?id=${machine.id}`);
      const data = await res.json();
      if (data) {
        const full = {
          ...data,
          tags: typeof data.tags === 'string' ? data.tags.split(',') : data.tags || []
        };
        setDetailMachine(full);
      }
    } catch (e) { console.error(e); }
    setLoadingDetail(false);
  };

  const getSpecKey = (key) => lang === "en" ? (specKeyMap[key] || key) : key;
  const getGroupLabel = (label) => t.specGroups[label] || label;
  const getType = (type) => lang === "en" ? (typeMap[type] || type) : type;
  const getCountry = (m) => lang === "en" ? (m.country_en || m.country) : m.country;

  const Stars = ({ rating }) => (
    <span style={{ color:"#fbbf24", fontSize:"12px" }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5-Math.floor(rating))}
      <span style={{ color:"#666", marginLeft:"4px", fontSize:"11px" }}>{rating}</span>
    </span>
  );

  const compareGroups = activeGroup ? specGroups.filter((g) => g.label === activeGroup) : specGroups;
  const colCount = compareList.length || 1;

  return (
    <div style={S.root}>
      <div style={S.bgGrid} />

      {/* Header */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <div style={S.logo}>
            <span style={S.logoIcon}>⚙</span>
            <div>
              <div style={S.logoText}>{t.siteTitle}</div>
              <div style={S.logoSub}>{t.siteSub}</div>
            </div>
          </div>
          <nav style={S.nav}>
            <button onClick={() => setView("browse")}
              style={{ ...S.navBtn, ...(view==="browse"?S.navBtnActive:{}) }}>{t.navBrowse}</button>
            <button onClick={() => compareList.length > 0 && setView("compare")}
              style={{ ...S.navBtn, ...(view==="compare"?S.navBtnActive:{}), opacity:compareList.length===0?0.4:1 }}>
              {t.navCompare}{compareList.length > 0 && <span style={S.badge}>{compareList.length}</span>}
            </button>
            {/* Language Toggle */}
            <div style={S.langToggle}>
              <button onClick={() => setLang("ko")}
                style={{ ...S.langBtn, ...(lang==="ko"?S.langBtnActive:{}) }}>KO</button>
              <button onClick={() => setLang("en")}
                style={{ ...S.langBtn, ...(lang==="en"?S.langBtnActive:{}) }}>EN</button>
            </div>
          </nav>
        </div>
      </header>

      <main style={S.main}>

        {/* BROWSE */}
        {view === "browse" && (<>
          <section style={{ ...S.hero, opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(20px)", transition:"all 0.7s ease" }}>
            <div style={S.heroLabel}>{t.heroLabel}</div>
            <h1 style={S.heroTitle}>{t.heroTitle1}<br /><span style={S.heroAccent}>{t.heroTitle2}</span></h1>
            <p style={S.heroDesc}>{t.heroDesc}</p>
            <div style={S.heroSearch}>
              <input type="text" placeholder={t.searchPlaceholder}
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={S.searchInput} />
              <span style={S.searchIcon}>🔍</span>
            </div>
            <div style={S.heroStats}>
              {[[machineData.length+"+", t.statMachines],["6", t.statMakers],["22+", t.statSpecs]].map(([n,l]) => (
                <div key={l} style={S.heroStat}>
                  <span style={S.heroStatNum}>{n}</span>
                  <span style={S.heroStatLabel}>{l}</span>
                </div>
              ))}
            </div>
          </section>

          <section style={S.filterBar}>
            <div style={S.filterGroup}>
              <span style={S.filterLabel}>{t.filterType}</span>
              <div style={S.filterPills}>
                {types.map((tp) => (
                  <button key={tp} onClick={() => setFilterType(tp)}
                    style={{ ...S.pill, ...(filterType===tp?S.pillActive:{}) }}>{getType(tp)}</button>
                ))}
              </div>
            </div>
            <div style={S.filterGroup}>
              <span style={S.filterLabel}>{t.filterMaker}</span>
              <div style={S.filterPills}>
                {makers.map((mk) => (
                  <button key={mk} onClick={() => setFilterMaker(mk)}
                    style={{ ...S.pill, ...(filterMaker===mk?S.pillActive:{}) }}>{mk}</button>
                ))}
              </div>
            </div>
          </section>

          {compareList.length > 0 && (
            <div style={S.compareBar}>
              <span style={S.compareBarText}>{t.compareSelected} {compareList.map((m)=>m.name).join(" vs ")}</span>
              <button onClick={() => setView("compare")} style={S.compareBarBtn}>{t.compareNow}</button>
              <button onClick={() => setCompareList([])} style={S.compareBarClear}>{t.compareReset}</button>
            </div>
          )}

          <section style={S.grid}>
            {filtered.map((machine, i) => (
              <div key={machine.id}
                style={{ ...S.card, ...(hoveredCard===machine.id?S.cardHover:{}), ...(isInCompare(machine.id)?S.cardSelected:{}),
                  opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(30px)", transition:`all 0.5s ease ${i*0.06}s` }}
                onMouseEnter={() => setHoveredCard(machine.id)} onMouseLeave={() => setHoveredCard(null)}>
                <div style={{ ...S.cardAccent, backgroundColor:makerColors[machine.maker]||"#4fc3f7" }} />
                <div style={S.cardHeader}>
                  <div>
                    <div style={S.cardType}>{getType(machine.type)}</div>
                    <div style={S.cardName}>{machine.name}</div>
                    <div style={S.cardMaker}>
                      <span style={{ ...S.makerDot, backgroundColor:makerColors[machine.maker]||"#4fc3f7" }} />
                      {machine.maker} · {getCountry(machine)}
                    </div>
                  </div>
                  <div style={S.cardYear}>{machine.year}</div>
                </div>
                <div style={{ padding:"0 18px 6px" }}>
                  <Stars rating={machine.rating} />
                  <span style={{ color:"#555", fontSize:"11px", marginLeft:"6px" }}>({machine.reviews} {t.reviews})</span>
                </div>
                <div style={S.specPreview}>
                  {previewKeys.map((k) => (
                    <div key={k} style={S.specItem}>
                      <span style={S.specKey}>{getSpecKey(k)}</span>
                      <span style={S.specVal}>{machine.specs?.[k] ?? machine[k === "최대 소재 크기" ? "max_workpiece_size" : k === "최대 급이송속도" ? "max_rapid_feed" : k] ?? "–"}</span>
                    </div>
                  ))}
                </div>
                <div style={S.strokeRow}>
                  {["X축 스트로크","Y축 스트로크","Z축 스트로크"].map((ax) => (
                    <div key={ax} style={S.strokeBadge}>
                      <span style={S.strokeAxisLabel}>{ax[0]}</span>
                      <span style={S.strokeVal}>{machine.specs?.[ax]??"–"}</span>
                    </div>
                  ))}
                </div>
                <div style={S.tags}>
                  {(typeof machine.tags === "string" ? machine.tags.split(",") : machine.tags||[]).map((tag) => (
                    <span key={tag} style={S.tag}>{tag}</span>
                  ))}
                </div>
                <div style={S.cardActions}>
                  <button style={S.btnDetail} onClick={() => openDetail(machine)}>{t.detailSpec}</button>
                  <button onClick={() => toggleCompare(machine)}
                    style={{ ...S.btnCompare, ...(isInCompare(machine.id)?S.btnCompareActive:{}) }}>
                    {isInCompare(machine.id)?t.inCompare:t.addCompare}
                  </button>
                </div>
              </div>
            ))}
          </section>
        </>)}

        {/* DETAIL */}
        {view === "detail" && detailMachine && (
          <section style={S.detailView}>
            {loadingDetail && (
              <div style={{ textAlign:"center", padding:"20px", color:"#4fc3f7", fontSize:"13px" }}>
                ⟳ {lang === "ko" ? "상세 스펙 불러오는 중..." : "Loading full specs..."}
              </div>
            )}
            <div style={S.compareHeader}>
              <button onClick={() => setView("browse")} style={S.backBtn}>{t.backToList}</button>
              <div>
                <h2 style={S.compareTitle}>{detailMachine.name}</h2>
                <span style={{ fontSize:"12px", color:"#567" }}>
                  {detailMachine.maker} · {getCountry(detailMachine)} · {detailMachine.year}
                  {detailMachine.last_verified && (
                    <span style={{ marginLeft:"12px", color:"#4fc3f7" }}>
                      ✓ {t.lastUpdated}: {new Date(detailMachine.last_verified).toLocaleDateString()}
                    </span>
                  )}
                  {detailMachine.source_url && (
                    <a href={detailMachine.source_url} target="_blank" rel="noreferrer"
                      style={{ marginLeft:"12px", color:"#4fc3f7", fontSize:"11px" }}>
                      🔗 {t.source}
                    </a>
                  )}
                </span>
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"28px", alignItems:"center" }}>
              {(typeof detailMachine.tags === "string" ? detailMachine.tags.split(",") : detailMachine.tags||[]).map((tg) => (
                <span key={tg} style={S.tag}>{tg}</span>
              ))}
              <button onClick={() => toggleCompare(detailMachine)}
                style={{ ...S.btnCompare, padding:"5px 14px", fontSize:"12px", ...(isInCompare(detailMachine.id)?S.btnCompareActive:{}) }}>
                {isInCompare(detailMachine.id)?t.inCompare:t.addToCompare}
              </button>
            </div>
            {specGroups.map((group) => (
              <div key={group.label} style={S.specGroupBlock}>
                <div style={S.specGroupTitle}><span>{group.icon}</span><span>{getGroupLabel(group.label)}</span></div>
                <div style={S.specGroupGrid}>
                  {group.keys.map((key) => (
                    <div key={key} style={S.specDetailItem}>
                      <div style={S.specDetailKey}>{getSpecKey(key)}</div>
                      <div style={S.specDetailVal}>{detailMachine.specs?.[key]??"–"}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* 제보 폼 */}
            <ReportForm machine={detailMachine} lang={lang} />
          </section>
        )}

        {/* COMPARE */}
        {view === "compare" && (
          <section style={S.compareView}>
            <div style={S.compareHeader}>
              <button onClick={() => setView("browse")} style={S.backBtn}>{t.backToList}</button>
              <h2 style={S.compareTitle}>{t.navCompare}</h2>
            </div>
            <div style={S.groupTabs}>
              <button onClick={() => setActiveGroup(null)}
                style={{ ...S.groupTab, ...(activeGroup===null?S.groupTabActive:{}) }}>{t.allSpecs}</button>
              {specGroups.map((g) => (
                <button key={g.label} onClick={() => setActiveGroup(g.label)}
                  style={{ ...S.groupTab, ...(activeGroup===g.label?S.groupTabActive:{}) }}>
                  {g.icon} {getGroupLabel(g.label)}
                </button>
              ))}
            </div>
            {compareList.length === 0 ? (
              <div style={S.emptyCompare}>{t.emptyCompare}</div>
            ) : (
              <div style={S.compareTable}>
                <div style={{ ...S.compareRow, gridTemplateColumns:`200px repeat(${colCount},1fr)` }}>
                  <div style={S.compareRowLabel} />
                  {compareList.map((m) => (
                    <div key={m.id} style={S.compareColHeader}>
                      <div style={{ ...S.compareColBar, backgroundColor:makerColors[m.maker]||"#4fc3f7" }} />
                      <div style={S.compareColName}>{m.name}</div>
                      <div style={S.compareColMaker}>{m.maker}</div>
                      <div style={S.compareColCountry}>{getCountry(m)} · {m.year}</div>
                      <Stars rating={m.rating} />
                      <div style={S.compareTags}>
                        {(typeof m.tags==="string"?m.tags.split(","):m.tags||[]).map((tg) => (
                          <span key={tg} style={S.tag}>{tg}</span>
                        ))}
                      </div>
                      <button onClick={() => toggleCompare(m)} style={S.removeBtn}>{t.removeBtn}</button>
                    </div>
                  ))}
                </div>
                {compareGroups.map((group) => (
                  <div key={group.label}>
                    <div style={{ ...S.compareRow, gridTemplateColumns:`200px repeat(${colCount},1fr)`, background:"rgba(79,195,247,0.04)" }}>
                      <div style={{ ...S.compareRowLabel, color:"#4fc3f7", fontWeight:"700", fontSize:"11px", letterSpacing:"1px" }}>
                        {group.icon} {getGroupLabel(group.label).toUpperCase()}
                      </div>
                      {compareList.map((m) => <div key={m.id} style={{ ...S.compareCell, borderRight:"1px solid rgba(255,255,255,0.04)" }} />)}
                    </div>
                    {group.keys.map((key, ki) => (
                      <div key={key} style={{ ...S.compareRow, gridTemplateColumns:`200px repeat(${colCount},1fr)`,
                        backgroundColor:ki%2===0?"rgba(255,255,255,0.015)":"transparent" }}>
                        <div style={S.compareRowLabel}>{getSpecKey(key)}</div>
                        {compareList.map((m) => (
                          <div key={m.id} style={{ ...S.compareCell, borderRight:"1px solid rgba(255,255,255,0.04)" }}>
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

      <footer style={S.footer}>
        <div style={S.footerInner}>
          <span style={{ color:"#445" }}>© 2025 MACHINEBASE</span>
          <span style={{ color:"#333" }}>·</span>
          <span style={{ color:"#445" }}>{t.footerText}</span>
        </div>
      </footer>
    </div>
  );
}

const S = {
  root:{ minHeight:"100vh", backgroundColor:"#080c14", color:"#e0e6f0", fontFamily:"'Noto Sans KR','IBM Plex Sans',sans-serif", position:"relative", overflowX:"hidden" },
  bgGrid:{ position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(79,195,247,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(79,195,247,0.03) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none", zIndex:0 },
  header:{ position:"sticky", top:0, zIndex:100, background:"rgba(8,12,20,0.93)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(79,195,247,0.1)" },
  headerInner:{ maxWidth:"1200px", margin:"0 auto", padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  logo:{ display:"flex", alignItems:"center", gap:"12px" },
  logoIcon:{ fontSize:"26px" },
  logoText:{ fontSize:"17px", fontWeight:"800", letterSpacing:"3px", color:"#4fc3f7", fontFamily:"'IBM Plex Mono',monospace" },
  logoSub:{ fontSize:"10px", color:"#456", letterSpacing:"1px" },
  nav:{ display:"flex", gap:"8px", alignItems:"center" },
  navBtn:{ background:"transparent", border:"1px solid #1e2a3a", color:"#789", padding:"8px 18px", borderRadius:"6px", cursor:"pointer", fontSize:"13px", position:"relative", transition:"all 0.2s" },
  navBtnActive:{ border:"1px solid #4fc3f7", color:"#4fc3f7", background:"rgba(79,195,247,0.08)" },
  badge:{ position:"absolute", top:"-6px", right:"-6px", background:"#4fc3f7", color:"#080c14", borderRadius:"50%", width:"16px", height:"16px", fontSize:"10px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center" },
  langToggle:{ display:"flex", border:"1px solid #1e2a3a", borderRadius:"6px", overflow:"hidden", marginLeft:"8px" },
  langBtn:{ background:"transparent", border:"none", color:"#789", padding:"7px 12px", cursor:"pointer", fontSize:"12px", fontWeight:"600", transition:"all 0.15s" },
  langBtnActive:{ background:"rgba(79,195,247,0.15)", color:"#4fc3f7" },
  main:{ maxWidth:"1200px", margin:"0 auto", padding:"0 24px 60px", position:"relative", zIndex:1 },
  hero:{ textAlign:"center", padding:"70px 20px 44px" },
  heroLabel:{ display:"inline-block", border:"1px solid rgba(79,195,247,0.3)", color:"#4fc3f7", fontSize:"11px", letterSpacing:"2px", padding:"4px 14px", borderRadius:"20px", marginBottom:"20px", background:"rgba(79,195,247,0.05)" },
  heroTitle:{ fontSize:"clamp(26px,4.5vw,48px)", fontWeight:"800", lineHeight:1.2, margin:"0 0 14px", color:"#dde8f5" },
  heroAccent:{ background:"linear-gradient(90deg,#4fc3f7,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
  heroDesc:{ color:"#6a7d92", fontSize:"14px", maxWidth:"540px", margin:"0 auto 28px", lineHeight:1.8, whiteSpace:"pre-line" },
  heroSearch:{ position:"relative", maxWidth:"480px", margin:"0 auto 36px" },
  searchInput:{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(79,195,247,0.2)", borderRadius:"10px", padding:"14px 48px 14px 18px", color:"#dde8f5", fontSize:"14px", outline:"none", boxSizing:"border-box" },
  searchIcon:{ position:"absolute", right:"16px", top:"50%", transform:"translateY(-50%)", fontSize:"16px" },
  heroStats:{ display:"flex", justifyContent:"center", gap:"40px" },
  heroStat:{ display:"flex", flexDirection:"column", alignItems:"center" },
  heroStatNum:{ fontSize:"26px", fontWeight:"800", color:"#4fc3f7", fontFamily:"'IBM Plex Mono',monospace" },
  heroStatLabel:{ fontSize:"11px", color:"#567", marginTop:"2px" },
  filterBar:{ display:"flex", flexWrap:"wrap", gap:"16px", marginBottom:"20px", padding:"18px", background:"rgba(255,255,255,0.02)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.04)" },
  filterGroup:{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" },
  filterLabel:{ fontSize:"11px", color:"#567", letterSpacing:"1px", minWidth:"50px" },
  filterPills:{ display:"flex", gap:"6px", flexWrap:"wrap" },
  pill:{ background:"transparent", border:"1px solid #1e2a3a", color:"#789", padding:"5px 12px", borderRadius:"20px", cursor:"pointer", fontSize:"12px", transition:"all 0.15s" },
  pillActive:{ background:"rgba(79,195,247,0.1)", border:"1px solid #4fc3f7", color:"#4fc3f7" },
  compareBar:{ display:"flex", alignItems:"center", gap:"14px", padding:"12px 20px", background:"rgba(79,195,247,0.07)", border:"1px solid rgba(79,195,247,0.2)", borderRadius:"10px", marginBottom:"22px", flexWrap:"wrap" },
  compareBarText:{ flex:1, fontSize:"13px", color:"#9dd" },
  compareBarBtn:{ background:"#4fc3f7", color:"#080c14", border:"none", padding:"8px 18px", borderRadius:"6px", cursor:"pointer", fontSize:"13px", fontWeight:"700" },
  compareBarClear:{ background:"transparent", border:"1px solid #333", color:"#667", padding:"8px 14px", borderRadius:"6px", cursor:"pointer", fontSize:"12px" },
  grid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:"18px" },
  card:{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"14px", padding:"0 0 18px", overflow:"hidden", position:"relative", transition:"all 0.25s ease" },
  cardHover:{ transform:"translateY(-4px)", border:"1px solid rgba(79,195,247,0.2)", background:"rgba(255,255,255,0.04)", boxShadow:"0 12px 40px rgba(0,0,0,0.4)" },
  cardSelected:{ border:"1px solid #4fc3f7", background:"rgba(79,195,247,0.05)" },
  cardAccent:{ height:"3px", width:"100%" },
  cardHeader:{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"16px 18px 8px" },
  cardType:{ fontSize:"10px", color:"#567", letterSpacing:"1px", marginBottom:"3px" },
  cardName:{ fontSize:"15px", fontWeight:"700", color:"#d5e3f0", marginBottom:"3px", fontFamily:"'IBM Plex Mono',monospace" },
  cardMaker:{ fontSize:"12px", color:"#789", display:"flex", alignItems:"center", gap:"6px" },
  makerDot:{ width:"7px", height:"7px", borderRadius:"50%", display:"inline-block" },
  cardYear:{ fontSize:"11px", color:"#456", fontFamily:"'IBM Plex Mono',monospace" },
  specPreview:{ margin:"8px 18px 0", display:"flex", flexDirection:"column", gap:"5px" },
  specItem:{ display:"flex", justifyContent:"space-between", fontSize:"11.5px", borderBottom:"1px solid rgba(255,255,255,0.04)", paddingBottom:"4px" },
  specKey:{ color:"#567" },
  specVal:{ color:"#9bb", fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px", textAlign:"right", maxWidth:"55%" },
  strokeRow:{ display:"flex", gap:"6px", padding:"10px 18px 0", flexWrap:"wrap" },
  strokeBadge:{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"6px", padding:"5px 10px", display:"flex", flexDirection:"column", alignItems:"center", minWidth:"70px" },
  strokeAxisLabel:{ fontSize:"9px", color:"#4fc3f7", letterSpacing:"1px", fontWeight:"700", fontFamily:"'IBM Plex Mono',monospace" },
  strokeVal:{ fontSize:"10px", color:"#7bc", fontFamily:"'IBM Plex Mono',monospace", marginTop:"2px" },
  tags:{ display:"flex", gap:"5px", padding:"8px 18px 0", flexWrap:"wrap" },
  tag:{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", color:"#789", fontSize:"10px", padding:"2px 8px", borderRadius:"10px" },
  cardActions:{ display:"flex", gap:"8px", padding:"12px 18px 0" },
  btnDetail:{ flex:1, background:"transparent", border:"1px solid #1e2a3a", color:"#789", padding:"8px", borderRadius:"7px", cursor:"pointer", fontSize:"12px" },
  btnCompare:{ flex:1, background:"transparent", border:"1px solid rgba(79,195,247,0.3)", color:"#4fc3f7", padding:"8px", borderRadius:"7px", cursor:"pointer", fontSize:"12px" },
  btnCompareActive:{ background:"rgba(79,195,247,0.15)", border:"1px solid #4fc3f7" },
  detailView:{ padding:"36px 0" },
  specGroupBlock:{ marginBottom:"16px", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", overflow:"hidden" },
  specGroupTitle:{ display:"flex", alignItems:"center", gap:"8px", padding:"11px 20px", background:"rgba(79,195,247,0.04)", borderBottom:"1px solid rgba(255,255,255,0.06)", fontSize:"13px", fontWeight:"700", color:"#4fc3f7", letterSpacing:"1px" },
  specGroupGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))" },
  specDetailItem:{ padding:"12px 20px", borderRight:"1px solid rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.04)" },
  specDetailKey:{ fontSize:"10px", color:"#567", marginBottom:"4px", letterSpacing:"0.5px" },
  specDetailVal:{ fontSize:"13px", color:"#9bb", fontFamily:"'IBM Plex Mono',monospace", fontWeight:"600" },
  compareView:{ padding:"36px 0" },
  compareHeader:{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"20px", flexWrap:"wrap" },
  backBtn:{ background:"transparent", border:"1px solid #1e2a3a", color:"#789", padding:"8px 16px", borderRadius:"7px", cursor:"pointer", fontSize:"13px" },
  compareTitle:{ fontSize:"20px", fontWeight:"700", color:"#d5e3f0", margin:0 },
  groupTabs:{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"16px" },
  groupTab:{ background:"transparent", border:"1px solid #1e2a3a", color:"#789", padding:"6px 14px", borderRadius:"20px", cursor:"pointer", fontSize:"12px" },
  groupTabActive:{ background:"rgba(79,195,247,0.1)", border:"1px solid #4fc3f7", color:"#4fc3f7" },
  emptyCompare:{ textAlign:"center", color:"#567", padding:"60px", border:"1px dashed #1e2a3a", borderRadius:"12px" },
  compareTable:{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"14px", overflowX:"auto" },
  compareRow:{ display:"grid", borderBottom:"1px solid rgba(255,255,255,0.04)", minWidth:"580px" },
  compareRowLabel:{ padding:"12px 18px", fontSize:"11.5px", color:"#567", fontWeight:"600", borderRight:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center" },
  compareColHeader:{ padding:"18px", borderRight:"1px solid rgba(255,255,255,0.04)", position:"relative", overflow:"hidden" },
  compareColBar:{ position:"absolute", top:0, left:0, right:0, height:"3px" },
  compareColName:{ fontSize:"14px", fontWeight:"700", color:"#d5e3f0", fontFamily:"'IBM Plex Mono',monospace", marginBottom:"3px" },
  compareColMaker:{ fontSize:"12px", color:"#789", marginBottom:"2px" },
  compareColCountry:{ fontSize:"11px", color:"#567", marginBottom:"8px" },
  compareTags:{ display:"flex", gap:"4px", flexWrap:"wrap", margin:"6px 0" },
  removeBtn:{ background:"transparent", border:"1px solid #1e2a3a", color:"#567", padding:"4px 10px", borderRadius:"6px", cursor:"pointer", fontSize:"11px", marginTop:"6px" },
  compareCell:{ padding:"11px 18px", fontSize:"12px", color:"#9bb", fontFamily:"'IBM Plex Mono',monospace", display:"flex", alignItems:"center" },
  footer:{ borderTop:"1px solid rgba(255,255,255,0.04)", padding:"22px", position:"relative", zIndex:1 },
  footerInner:{ maxWidth:"1200px", margin:"0 auto", display:"flex", gap:"12px", justifyContent:"center", fontSize:"12px" },
};
