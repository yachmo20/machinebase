"""
공통 유틸리티 모듈
- Supabase DB 저장
- Claude AI 스펙 추출
- 로깅
"""

import os
import json
import anthropic
from supabase import create_client
from datetime import datetime, timezone

# ── 환경변수 ──────────────────────────────────────────────
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
claude = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)


# ── 로거 ──────────────────────────────────────────────────
def log(msg, level="INFO"):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] [{level}] {msg}")


# ── Claude AI 스펙 추출 ───────────────────────────────────
SPEC_KEYS = [
    "최대 소재 크기", "최대 가공 직경", "최대 가공 길이",
    "X축 스트로크", "Y축 스트로크", "Z축 스트로크",
    "테이블 크기", "최대 적재 하중",
    "주축 최대 회전수", "주축 테이퍼", "주축 파워", "주축 토크",
    "최대 급이송속도", "X축 급이송속도", "Y축 급이송속도", "Z축 급이송속도",
    "매거진 툴 수", "최대 툴 직경", "최대 툴 길이", "최대 툴 무게",
    "제어기", "소비전력", "기계 크기 (L×W×H)", "기계 무게"
]

def extract_specs_with_ai(html_text: str, machine_name: str, maker: str) -> dict:
    """Claude API로 HTML에서 스펙 추출"""
    
    prompt = f"""
아래는 {maker}의 {machine_name} CNC 공작기계 제품 페이지 텍스트입니다.
다음 스펙 항목들을 JSON으로 추출해주세요.

추출할 항목:
{json.dumps(SPEC_KEYS, ensure_ascii=False, indent=2)}

규칙:
- 값이 없으면 "–" 로 표시
- 단위 포함해서 추출 (예: "762 mm", "12,000 rpm", "22.4 kW")
- 옵션 스펙은 "(옵션: xxx)" 형식으로 표시
- 숫자 단위 통일: mm, rpm, kW, N·m, m/min, kg, kVA
- JSON만 반환, 다른 텍스트 없이

페이지 텍스트:
{html_text[:6000]}
"""

    try:
        response = claude.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}]
        )
        
        raw = response.content[0].text.strip()
        # JSON 블록 추출
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0].strip()
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0].strip()
        
        specs = json.loads(raw)
        return specs
        
    except Exception as e:
        log(f"AI 추출 실패 ({machine_name}): {e}", "ERROR")
        return {k: "–" for k in SPEC_KEYS}


def extract_machine_info_with_ai(html_text: str, maker: str) -> dict:
    """기종명, 타입, 태그 등 기본 정보 추출"""
    
    prompt = f"""
아래 텍스트에서 {maker} CNC 기계의 기본 정보를 JSON으로 추출해주세요.

추출 항목:
- name: 기종명 (예: "VF-2SS", "INTEGREX i-400")
- type: 기계 종류 (다음 중 하나: "머시닝센터", "CNC 선반", "5축 머시닝센터", "수평 머시닝센터", "복합가공기", "드릴탭센터")
- year: 출시연도 (모르면 2024)
- tags: 태그 배열 (예: ["5축", "고속", "항공우주"])
- max_workpiece_size: 최대 소재 크기 (예: "762 × 406 × 508 mm")
- max_rapid_feed: 최대 급이송속도 (예: "36 m/min")

JSON만 반환:

텍스트:
{html_text[:3000]}
"""
    
    try:
        response = claude.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )
        raw = response.content[0].text.strip()
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0].strip()
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0].strip()
        return json.loads(raw)
    except Exception as e:
        log(f"기본정보 추출 실패: {e}", "ERROR")
        return {}


# ── Supabase DB 저장 ──────────────────────────────────────
def upsert_machine(data: dict) -> bool:
    """기계 데이터 upsert (이름+제조사 기준)"""
    try:
        # 기존 데이터 확인
        existing = supabase.table("machines")\
            .select("id")\
            .eq("name", data["name"])\
            .eq("maker", data["maker"])\
            .execute()
        
        now = datetime.now(timezone.utc).isoformat()
        data["last_crawled"] = now
        
        if existing.data:
            # 업데이트
            machine_id = existing.data[0]["id"]
            data["last_verified"] = now
            supabase.table("machines")\
                .update(data)\
                .eq("id", machine_id)\
                .execute()
            log(f"  ✏️  업데이트: {data['name']}")
        else:
            # 신규 삽입
            data["last_verified"] = now
            data.setdefault("rating", 0)
            data.setdefault("rating_avg", 0)
            data.setdefault("rating_count", 0)
            data.setdefault("view_count", 0)
            supabase.table("machines").insert(data).execute()
            log(f"  ✅ 신규 추가: {data['name']}")
        
        return True
        
    except Exception as e:
        log(f"  ❌ DB 저장 실패 ({data.get('name')}): {e}", "ERROR")
        return False


# ── 결과 리포트 ───────────────────────────────────────────
def print_report(maker: str, results: list):
    success = sum(1 for r in results if r)
    fail = len(results) - success
    log(f"\n{'='*50}")
    log(f"📊 {maker} 크롤링 완료")
    log(f"   총 {len(results)}개 처리 | ✅ 성공 {success}개 | ❌ 실패 {fail}개")
    log(f"{'='*50}\n")
