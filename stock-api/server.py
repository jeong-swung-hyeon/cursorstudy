#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
간단한 프록시 서버 - CORS 문제 해결 및 API 호출
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import urllib.request
import json
import sys

API_KEY = 'bbd0250173ddcb4053537eb4851ccb28fc3e9d694cf86a3a2192fe5b1c9a5abb'
BASE_URL = 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo'

class CORSRequestHandler(BaseHTTPRequestHandler):
    def send_cors_headers(self):
        """CORS 헤더 전송"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    
    def do_OPTIONS(self):
        """CORS preflight 요청 처리"""
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
    
    def do_GET(self):
        """GET 요청 처리"""
        parsed_path = urlparse(self.path)
        
        # API 엔드포인트 확인
        if parsed_path.path == '/api/stock':
            query_params = parse_qs(parsed_path.query)
            date = query_params.get('date', [None])[0]
            pageNo = query_params.get('pageNo', ['1'])[0]
            numOfRows = query_params.get('numOfRows', ['1000'])[0]
            
            if not date:
                self.send_cors_headers()
                self.send_error(400, "date 파라미터가 필요합니다")
                return
            
            try:
                # 공공데이터 API 호출
                api_url = f"{BASE_URL}?serviceKey={API_KEY}&numOfRows={numOfRows}&pageNo={pageNo}&resultType=json&basDt={date}"
                
                with urllib.request.urlopen(api_url) as response:
                    data = json.loads(response.read().decode('utf-8'))
                    
                    # CORS 헤더 추가하여 응답
                    self.send_cors_headers()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
                    
            except urllib.error.HTTPError as e:
                try:
                    error_body = e.read().decode('utf-8')
                except:
                    error_body = str(e)
                self.send_cors_headers()
                self.send_error(e.code, f"API 호출 실패: {error_body}")
            except Exception as e:
                self.send_cors_headers()
                self.send_error(500, f"서버 오류: {str(e)}")
        elif parsed_path.path == '/health':
            # 서버 상태 확인 엔드포인트
            self.send_cors_headers()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': '서버가 정상 작동 중입니다'}, ensure_ascii=False).encode('utf-8'))
        else:
            self.send_cors_headers()
            self.send_error(404, "Not Found")
    
    def log_message(self, format, *args):
        """로그 메시지 출력"""
        print(f"[{self.address_string()}] {format % args}")

def run_server(port=8000):
    """서버 실행"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    print(f"서버가 http://localhost:{port} 에서 실행 중입니다...")
    print("종료하려면 Ctrl+C를 누르세요.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료합니다.")
        httpd.server_close()

if __name__ == '__main__':
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("포트 번호가 올바르지 않습니다. 기본값 8000을 사용합니다.")
    
    run_server(port)
