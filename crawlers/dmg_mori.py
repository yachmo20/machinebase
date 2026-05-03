"""
DMG Mori 크롤러
- https://en.dmgmori.com/products/machines 기준
- 약 200개 기종
- Playwright + Claude AI 스펙 추출
"""

import time
from playwright.sync_api import sync_playwright
from utils import log, extract_specs_with_ai, upsert_machine, print_report

# ── DMG Mori 제품 카테고리 URL ────────────────────────────
DMG_CATEGORIES = [
    # 선반
    {"url": "https://en.dmgmori.com/products/machines/turning/universal-turning",      "type": "CNC 선반",       "series": "CLX/NLX Universal Turning"},
    {"url": "https://en.dmgmori.com/products/machines/turning/turn-mill-centers",      "type": "복합가공기",      "series": "CTX/NTX Turn-Mill"},
    {"url": "https://en.dmgmori.com/products/machines/turning/vertical-turning",       "type": "CNC 선반",       "series": "VSC Vertical Turning"},
    {"url": "https://en.dmgmori.com/products/machines/turning/production-turning",     "type": "CNC 선반",       "series": "Sprint Production Turning"},
    # 밀링
    {"url": "https://en.dmgmori.com/products/machines/milling/3-axis-milling",         "type": "머시닝센터",      "series": "CMX/DMC 3-axis"},
    {"url": "https://en.dmgmori.com/products/machines/milling/5-axis-milling",         "type": "5축 머시닝센터",  "series": "DMU 5-axis"},
    {"url": "https://en.dmgmori.com/products/machines/milling/horizontal-machining",   "type": "수평 머시닝센터", "series": "NHX/INH Horizontal"},
    {"url": "https://en.dmgmori.com/products/machines/milling/portal-machines",        "type": "머시닝센터",      "series": "DMF/DMU Portal"},
    # 복합가공
    {"url": "https://en.dmgmori.com/products/machines/multi-tasking",                  "type": "복합가공기",      "series": "Multi-Tasking"},
    # 특수 가공
    {"url": "https://en.dmgmori.com/products/machines/ultrasonic",                     "type": "머시닝센터",      "series": "ULTRASONIC"},
    {"url": "https://en.dmgmori.com/products/machines/lasertec",                       "type": "머시닝센터",      "series": "LASERTEC"},
]

MAKER = "DMG Mori"
COUNTRY = "🇩🇪 독일"
COUNTRY_EN = "🇩🇪 Germany"


def get_machine_urls_from_category(page, category_url: str) -> list:
    """카테고리 페이지에서 개별 기종 URL 수집"""
    try:
        page.goto(category_url, wait_until="domcontentloaded", timeout=25000)
        page.wait_for_timeout(3000)
        
        # DMG Mori 제품 링크 패턴
        links = page.eval_on_selector_all(
            'a[href*="/machines/"]',
            '''els => [...new Set(
                els.map(e => e.href)
                   .filter(h => h.includes("/machines/") && 
                               !h.endsWith("/machines/") &&
                               !h.includes("#") &&
                               h.split("/").length > 6)
            )]'''
        )
        
        return links[:30]  # 최대 30개
        
    except Exception as e:
        log(f"URL 수집 실패 ({category_url}): {e}", "WARN")
        return []


def crawl_machine_page(page, url: str, machine_type: str) -> dict | None:
    """개별 기종 페이지 크롤링"""
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=25000)
        page.wait_for_timeout(2000)
        
        # 스펙 탭/섹션 클릭 (있으면)
        try:
            spec_btn = page.query_selector('button:has-text("Technical data"), button:has-text("Specifications"), a:has-text("Technical")')
            if spec_btn:
                spec_btn.click()
                page.wait_for_timeout(1500)
        except:
            pass
        
        text = page.inner_text("body")
        
        if len(text) < 300:
            return None
        
        # 기종명
        try:
            name = page.inner_text("h1").strip().split("\n")[0]
        except:
            name = url.split("/")[-1].replace("-", " ").upper()
        
        if not name or len(name) < 2:
            return None
        
        log(f"  🤖 AI 스펙 추출: {name}")
        specs = extract_specs_with_ai(text, name, MAKER)
        
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
    tags = []
    name_lower = name.lower()

    if "ctx" in name_lower or "ntx" in name_lower:
        tags.extend(["복합가공", "밀턴"])
    if "dmu" in name_lower:
        tags.append("5축")
    if "clx" in name_lower or "nlx" in name_lower:
        tags.append("범용선반")
    if "nhx" in name_lower or "inh" in name_lower:
        tags.extend(["수평MC", "파렛트"])
    if "ultrasonic" in name_lower:
        tags.append("초음파가공")
    if "lasertec" in name_lower:
        tags.append("레이저")
    if "monoblock" in name_lower or "monobloc" in name_lower:
        tags.append("monoBLOCK")
    if "duoblock" in name_lower:
        tags.append("duoBLOCK")

    rpm = specs.get("주축 최대 회전수", "")
    if any(x in rpm for x in ["15,000", "18,000", "20,000"]):
        tags.append("고속")

    if machine_type == "복합가공기":
        tags.append("6면가공")
    if machine_type == "5축 머시닝센터":
        tags.append("동시5축")

    return list(dict.fromkeys(tags))[:5]


def run():
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

        for category in DMG_CATEGORIES:
            log(f"\n📂 카테고리: {category['series']}")

            machine_urls = get_machine_urls_from_category(page, category["url"])
            log(f"   발견된 기종 URL: {len(machine_urls)}개")

            for url in machine_urls:
                data = crawl_machine_page(page, url, category["type"])
                if data:
                    result = upsert_machine(data)
                    results.append(result)
                time.sleep(1.5)

        browser.close()

    print_report(MAKER, results)
    return results


if __name__ == "__main__":
    run()
