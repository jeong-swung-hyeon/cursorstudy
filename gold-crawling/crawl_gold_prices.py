import requests
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import json
import os

def crawl_gold_prices():
    """
    금시세 데이터를 크롤링하여 엑셀 파일로 저장합니다.
    Tabulator 테이블에서 데이터를 추출합니다.
    """
    
    # Chrome 옵션 설정
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # 브라우저 창을 띄우지 않음
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    
    # 웹드라이버 초기화
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # 한국금거래소 금시세 페이지 (일반적인 금시세 사이트)
        # 실제 URL은 사용자가 제공한 페이지로 변경해야 합니다
        url = "https://www.goldmarket.co.kr/gold-price"  # 예시 URL
        
        print(f"페이지 로딩 중: {url}")
        driver.get(url)
        
        # 페이지가 완전히 로드될 때까지 대기
        time.sleep(5)
        
        # Tabulator 테이블이 로드될 때까지 대기
        try:
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "tabulator-table"))
            )
        except:
            print("Tabulator 테이블을 찾을 수 없습니다. JavaScript 실행을 기다립니다...")
            time.sleep(10)
        
        # 페이지 소스 가져오기
        page_source = driver.page_source
        
        # BeautifulSoup으로 파싱
        soup = BeautifulSoup(page_source, 'html.parser')
        
        # Tabulator 테이블 찾기
        table = soup.find('div', {'id': 'example-table'})
        if not table:
            # 다른 가능한 ID나 클래스 시도
            table = soup.find('div', class_='tabulator')
        
        if not table:
            print("테이블을 찾을 수 없습니다. JavaScript로 데이터 추출 시도...")
            # JavaScript로 데이터 추출 시도
            data = driver.execute_script("""
                var table = document.querySelector('#example-table');
                if (!table) return null;
                
                var rows = table.querySelectorAll('.tabulator-row');
                var result = [];
                
                for (var i = 0; i < Math.min(rows.length, 100); i++) {
                    var row = rows[i];
                    var cells = row.querySelectorAll('.tabulator-cell');
                    if (cells.length >= 5) {
                        result.push({
                            '고시날짜': cells[0].textContent.trim(),
                            'Bid': cells[1].textContent.trim(),
                            'Ask': cells[2].textContent.trim(),
                            '국제가 (USD/T.oz)': cells[3].textContent.trim(),
                            '국내기준가 (₩/g)': cells[4].textContent.trim()
                        });
                    }
                }
                return result;
            """)
            
            if data:
                df = pd.DataFrame(data)
            else:
                raise Exception("데이터를 추출할 수 없습니다.")
        else:
            # HTML에서 직접 데이터 추출
            rows = table.find_all('div', class_='tabulator-row')
            data = []
            
            for row in rows[:100]:  # 최대 100개
                cells = row.find_all('div', class_='tabulator-cell')
                if len(cells) >= 5:
                    data.append({
                        '고시날짜': cells[0].get_text(strip=True),
                        'Bid': cells[1].get_text(strip=True),
                        'Ask': cells[2].get_text(strip=True),
                        '국제가 (USD/T.oz)': cells[3].get_text(strip=True),
                        '국내기준가 (₩/g)': cells[4].get_text(strip=True)
                    })
            
            df = pd.DataFrame(data)
        
        # 데이터가 비어있으면 JavaScript 방법 재시도
        if df.empty:
            print("HTML 파싱 실패. JavaScript로 재시도...")
            data = driver.execute_script("""
                var table = document.querySelector('#example-table');
                if (!table) {
                    // 다른 가능한 선택자 시도
                    table = document.querySelector('.tabulator');
                }
                if (!table) return null;
                
                var rows = table.querySelectorAll('.tabulator-row');
                var result = [];
                
                for (var i = 0; i < Math.min(rows.length, 100); i++) {
                    var row = rows[i];
                    var cells = row.querySelectorAll('.tabulator-cell');
                    if (cells.length >= 5) {
                        result.push({
                            '고시날짜': cells[0].textContent.trim(),
                            'Bid': cells[1].textContent.trim(),
                            'Ask': cells[2].textContent.trim(),
                            '국제가 (USD/T.oz)': cells[3].textContent.trim(),
                            '국내기준가 (₩/g)': cells[4].textContent.trim()
                        });
                    }
                }
                return result;
            """)
            
            if data:
                df = pd.DataFrame(data)
        
        if df.empty:
            raise Exception("데이터를 추출할 수 없습니다. 페이지 구조를 확인해주세요.")
        
        # 엑셀 파일로 저장
        output_file = 'gold_prices.xlsx'
        df.to_excel(output_file, index=False, engine='openpyxl')
        print(f"\n✅ {len(df)}개의 데이터를 {output_file}에 저장했습니다.")
        print(f"\n저장된 데이터 미리보기:")
        print(df.head(10))
        
        return df
        
    except Exception as e:
        print(f"오류 발생: {str(e)}")
        print("\n대안: 제공된 HTML에서 직접 데이터 추출 시도...")
        # 제공된 HTML에서 직접 추출하는 방법도 제공
        return None
        
    finally:
        driver.quit()


def extract_from_html_file(html_file_path):
    """
    HTML 파일에서 직접 데이터를 추출합니다.
    """
    with open(html_file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Tabulator 테이블 찾기
    table = soup.find('div', {'id': 'example-table'})
    if not table:
        table = soup.find('div', class_='tabulator')
    
    if not table:
        raise Exception("테이블을 찾을 수 없습니다.")
    
    rows = table.find_all('div', class_='tabulator-row')
    data = []
    
    for row in rows[:100]:  # 최대 100개
        cells = row.find_all('div', class_='tabulator-cell')
        if len(cells) >= 5:
            data.append({
                '고시날짜': cells[0].get_text(strip=True),
                'Bid': cells[1].get_text(strip=True),
                'Ask': cells[2].get_text(strip=True),
                '국제가 (USD/T.oz)': cells[3].get_text(strip=True),
                '국내기준가 (₩/g)': cells[4].get_text(strip=True)
            })
    
    df = pd.DataFrame(data)
    return df


if __name__ == "__main__":
    # 현재 스크립트의 디렉토리로 이동
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print("금시세 데이터 크롤링 시작...")
    
    # 먼저 웹 크롤링 시도
    df = crawl_gold_prices()
    
    # 실패하면 HTML 파일에서 추출 시도
    if df is None or df.empty:
        print("\n웹 크롤링 실패. HTML 파일에서 추출을 시도합니다...")
        # 사용자가 제공한 HTML을 파일로 저장했다고 가정
        # 실제로는 사용자가 URL을 제공하거나 HTML을 파일로 저장해야 합니다
        print("HTML 파일 경로를 입력하거나, 웹 페이지 URL을 확인해주세요.")
    
    print("\n완료!")
