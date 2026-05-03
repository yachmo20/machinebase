"""
메인 크롤러 실행 스크립트
사용법:
  python main.py all          # 전체 실행
  python main.py mazak        # Mazak만 실행
  python main.py dmg_mori     # DMG Mori만 실행
  python main.py okuma        # Okuma만 실행
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from crawlers.utils import log

def run_all():
    from crawlers import mazak, dmg_mori, okuma
    log("🌍 전체 크롤러 실행 시작")
    mazak.run()
    dmg_mori.run()
    okuma.run()
    log("✅ 전체 크롤링 완료!")

def main():
    target = sys.argv[1].lower() if len(sys.argv) > 1 else "all"
    
    if target == "all":
        run_all()
    elif target == "mazak":
        from crawlers import mazak
        mazak.run()
    elif target in ["dmg", "dmg_mori"]:
        from crawlers import dmg_mori
        dmg_mori.run()
    elif target == "okuma":
        from crawlers import okuma
        okuma.run()
    else:
        print(f"알 수 없는 타겟: {target}")
        print("사용법: python main.py [all|mazak|dmg_mori|okuma]")

if __name__ == "__main__":
    main()
