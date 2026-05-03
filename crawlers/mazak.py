"""
Mazak 크롤러
- https://www.mazak.com/jp-en/products/ 기준
- Playwright로 JS 렌더링 후 스펙 추출
- Claude AI로 스펙 파싱
"""

import time
import sys
from playwright.sync_api import sync_playwright
from utils import log, extract_specs_with_ai, upsert_machine, print_report

# ── Mazak 제품 시리즈 URL 목록 ────────────────────────────
# 각 시리즈 페이지 URL (JP 영문 사이트 기준)
MAZAK_SERIES = [
    # 복합가공기 (INTEGREX)
    {"url": "https://www.mazak.com/jp-en/products/integrex-i/",         "type": "복합가공기",      "series": "INTEGREX i"},
    {"url": "https://www.mazak.com/jp-en/products/integrex-i-h/",       "type": "복합가공기",      "series": "INTEGREX i-H"},
    {"url": "https://www.mazak.com/jp-en/products/integrex-j/",         "type": "복합가공기",      "series": "INTEGREX j"},
    {"url": "https://www.mazak.com/jp-en/products/integrex-e/",         "type": "복합가공기",      "series": "INTEGREX e"},
    # 5축 머시닝센터 (VARIAXIS)
    {"url": "https://www.mazak.com/jp-en/products/variaxis-i/",         "type": "5축 머시닝센터",  "series": "VARIAXIS i"},
    {"url": "https://www.mazak.com/jp-en/products/variaxis-c/",         "type": "5축 머시닝센터",  "series": "VARIAXIS C"},
    # 수평 머시닝센터 (HCN)
    {"url": "https://www.mazak.com/jp-en/products/hcn/",                "type": "수평 머시닝센터", "series": "HCN"},
    {"url": "https://www.mazak.com/jp-en/products/hcn-neo/",            "type": "수평 머시닝센터", "series": "HCN NEO"},
    {"url": "https://www.mazak.com/jp-en/products/u/",                  "type": "수평 머시닝센터", "series": "μ"},
    {"url": "https://www.mazak.com/jp-en/products/ff/",                 "type": "수평 머시닝센터", "series": "FF"},
    # 수직 머시닝센터 (NEXUS, VCN)
    {"url": "https://www.mazak.com/jp-en/products/vcn/",                "type": "머시닝센터",      "series": "VCN"},
    {"url": "https://www.mazak.com/jp-en/products/vcn-neo/",            "type": "머시닝센터",      "series": "VCN NEO"},
    # CNC 선반 (QUICK TURN)
    {"url": "https://www.mazak.com/jp-en/products/quick-turn/",         "type": "CNC 선반",       "series": "QUICK TURN"},
    {"url": "https://www.mazak.com/jp-en/products/quick-turn-neo/",     "type": "CNC 선반",       "series": "QUICK TURN NEO"},
    {"url": "https://www.mazak.com/jp-en/products/qt-compact/",         "type": "CNC 선반",       "series": "QT-Compact"},
    {"url": "https://www.mazak.com/jp-en/products/qte/",                "type": "CNC 선반",       "series": "QTE"},
    {"url": "https://www.mazak.com/jp-en/products/hqr/",                "type": "CNC 선반",       "series": "HQR"},
    {"url": "https://www.mazak.com/jp-en/products/multiplex/",          "type": "CNC 선반",       "series": "MULTIPLEX"},
    # 스위스턴 (SYNCREX)
    {"url": "https://www.mazak.com/jp-en/products/syncrex/",            "type": "CNC 선반",       "series": "SYNCREX"},
    # Ez 시리즈
    {"url": "https://www.mazak.com/jp-en/products/vc-ez/",              "type": "머시닝센터",      "series": "VC-Ez"},
    {"url": "https://www.mazak.com/jp-en/products/qt-ez/",              "type": "CNC 선반",       "series": "QT-Ez"},
]

MAKER = "Mazak"
COUNTRY = "🇯🇵 일본"
COUNTRY_EN = "🇯🇵 Japan"


def get_machine_urls_from_series(page, series_url: str) -> list:
    """시리즈 페이지에서 개별 기종 URL 수집"""
    try:
        page.goto(series_url, wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(2000)
        
        # 개별 기종 링크 추출 (패턴: /products/xxx/models/yyy/)
        links = page.eval_on_selector_all(
            'a[href*="/models/"], a[href*="/specifications/"]',
            'els => [...new Set(els.map(e => e.href))]'
        )
        
        # 혹시 모델 링크가 없으면 현재 페이지 자체가 기종 페이지일 수 있음
        if not links:
            links = [series_url]
            
        return links
    except Exception as e:
        log(f"URL 수집 실패 ({series_url}): {e}", "WARN")
        return [series_url]


def crawl_machine_page(page, url: str, machine_type: str) -> dict | None:
    """개별 기종 페이지 크롤링"""
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(2000)
        
        # 페이지 텍스트 추출
        text = page.inner_text("body")
        
        if len(text) < 200:
            return None
        
        # Claude AI로 스펙 추출
        log(f"  🤖 AI 스펙 추출 중: {url.split('/')[-2]}")
        specs = extract_specs_with_ai(text, url.split("/")[-2], MAKER)
        
        # 기종명 추출 (h1 또는 title에서)
        try:
            name = page.inner_text("h1").strip().split("\n")[0]
        except:
            name = url.split("/")[-2].replace("-", " ").upper()
        
        if not name or len(name) < 2:
            return None
        
        # 태그 생성
        tags = generate_tags(name, machine_type, specs)
        
        return {
            "name": name,
            "maker": MAKER,
            "country": COUNTRY,
            "country_en": COUNTRY_EN,
            "type": machine_type,
            "year": 2024,
            "tags": ",".join(tags),
            "specs": specs,
            "max_workpiece_size": specs.get("최대 소재 크기", "–"),
            "max_rapid_feed": specs.get("최대 급이송속도", "–"),
            "source_url": url,
        }
        
    except Exception as e:
        log(f"  ❌ 크롤링 실패 ({url}): {e}", "ERROR")
        return None


def generate_tags(name: str, machine_type: str, specs: dict) -> list:
    """기종명과 스펙에서 태그 자동 생성"""
    tags = []
    name_lower = name.lower()
    
    # 기종명 기반 태그
    if "integrex" in name_lower:
        tags.extend(["복합가공", "B축", "멀티태스킹"])
    if "variaxis" in name_lower:
        tags.extend(["5축", "동시5축"])
    if "syncrex" in name_lower:
        tags.extend(["스위스턴", "소형정밀"])
    if "hcn" in name_lower:
        tags.extend(["수평MC", "파렛트"])
    if "ez" in name_lower:
        tags.append("보급형")
    if "neo" in name_lower:
        tags.append("NEO")
    
    # 스펙 기반 태그
    rpm = specs.get("주축 최대 회전수", "")
    if "12,000" in rpm or "15,000" in rpm or "18,000" in rpm:
        tags.append("고속")
    if "20,000" in rpm or "30,000" in rpm:
        tags.append("초고속")
    
    # 기계 종류 태그
    if machine_type == "복합가공기":
        tags.append("DONE-IN-ONE")
    if machine_type == "5축 머시닝센터":
        tags.append("5축")
    
    # 제어기 태그
    controller = specs.get("제어기", "")
    if "SmoothAi" in controller:
        tags.append("AI제어")
    
    return list(dict.fromkeys(tags))[:5]  # 중복 제거, 최대 5개


def run():
    """Mazak 크롤러 메인 실행"""
    log(f"🚀 {MAKER} 크롤러 시작")
    results = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()
        
        for series in MAZAK_SERIES:
            log(f"\n📂 시리즈: {series['series']}")
            
            # 시리즈 페이지에서 개별 기종 URL 수집
            machine_urls = get_machine_urls_from_series(page, series["url"])
            log(f"   발견된 기종 URL: {len(machine_urls)}개")
            
            for url in machine_urls:
                # 개별 기종 크롤링
                data = crawl_machine_page(page, url, series["type"])
                
                if data:
                    result = upsert_machine(data)
                    results.append(result)
                
                time.sleep(1)  # 서버 부하 방지
        
        browser.close()
    
    print_report(MAKER, results)
    return results


if __name__ == "__main__":
    run()
