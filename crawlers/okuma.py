"""
Okuma 크롤러
- https://www.okuma.com/products 기준
- 비교적 단순한 HTML 구조
"""

import time
from playwright.sync_api import sync_playwright
from utils import log, extract_specs_with_ai, upsert_machine, print_report

OKUMA_SERIES = [
    {"url": "https://www.okuma.com/products/multi-tasking",          "type": "복합가공기",      "series": "MULTUS"},
    {"url": "https://www.okuma.com/products/5-axis",                 "type": "5축 머시닝센터",  "series": "MU/GENOS 5AX"},
    {"url": "https://www.okuma.com/products/horizontal-machining",   "type": "수평 머시닝센터", "series": "MA/HMC"},
    {"url": "https://www.okuma.com/products/vertical-machining",     "type": "머시닝센터",      "series": "MB/GENOS M"},
    {"url": "https://www.okuma.com/products/cnc-lathes",             "type": "CNC 선반",       "series": "LB/LU/GENOS L"},
]

MAKER = "Okuma"
COUNTRY = "🇯🇵 일본"
COUNTRY_EN = "🇯🇵 Japan"


def get_machine_urls(page, series_url: str) -> list:
    try:
        page.goto(series_url, wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(2000)
        
        links = page.eval_on_selector_all(
            'a[href*="/products/"]',
            '''els => [...new Set(
                els.map(e => e.href)
                   .filter(h => h.includes("okuma.com/products/") &&
                               h.split("/").length > 5 &&
                               !h.includes("#"))
            )]'''
        )
        return links[:25]
    except Exception as e:
        log(f"URL 수집 실패: {e}", "WARN")
        return []


def crawl_machine_page(page, url: str, machine_type: str) -> dict | None:
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(2000)
        
        text = page.inner_text("body")
        if len(text) < 300:
            return None
        
        try:
            name = page.inner_text("h1").strip().split("\n")[0]
        except:
            name = url.split("/")[-1].replace("-", " ").upper()
        
        if not name or len(name) < 2:
            return None
        
        log(f"  🤖 AI 스펙 추출: {name}")
        specs = extract_specs_with_ai(text, name, MAKER)
        
        tags = generate_tags(name, machine_type)
        
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
        log(f"  ❌ 실패 ({url}): {e}", "ERROR")
        return None


def generate_tags(name: str, machine_type: str) -> list:
    tags = []
    name_lower = name.lower()
    if "multus" in name_lower:
        tags.extend(["복합가공", "B축"])
    if "genos" in name_lower:
        tags.append("보급형")
    if "5ax" in name_lower or "5-ax" in name_lower:
        tags.append("5축")
    if machine_type == "수평 머시닝센터":
        tags.extend(["수평MC", "파렛트"])
    tags.append("OSP제어기")
    return list(dict.fromkeys(tags))[:5]


def run():
    log(f"🚀 {MAKER} 크롤러 시작")
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox"]
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()

        for series in OKUMA_SERIES:
            log(f"\n📂 시리즈: {series['series']}")
            urls = get_machine_urls(page, series["url"])
            log(f"   발견된 URL: {len(urls)}개")

            for url in urls:
                data = crawl_machine_page(page, url, series["type"])
                if data:
                    results.append(upsert_machine(data))
                time.sleep(1)

        browser.close()

    print_report(MAKER, results)
    return results


if __name__ == "__main__":
    run()
