#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
스포츠 시설 정보 API 프록시 서버 - CORS 문제 해결 및 API 호출
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, urlencode
import urllib.request
import json
import sys

# API 설정
API_KEY = 'bbd0250173ddcb4053537eb4851ccb28fc3e9d694cf86a3a2192fe5b1c9a5abb'
BASE_URL = 'https://apis.data.go.kr/3140000/sportFacilityService'
API_METHOD = '/sportFacilityInfo'  # 상세기능: 체육시설 정보 조회

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
        print(f"[요청] {self.command} {self.path}")
        
        # API 엔드포인트 확인
        if parsed_path.path == '/api/sport-facilities':
            query_params = parse_qs(parsed_path.query)
            
            # 파라미터 추출
            page_no = query_params.get('pageNo', ['1'])[0]
            num_of_rows = query_params.get('numOfRows', ['10'])[0]
            result_type = query_params.get('resultType', ['json'])[0]
            
            # 추가 필터 파라미터 (선택적)
            facility_name = query_params.get('facilityName', [None])[0]
            city = query_params.get('city', [None])[0]
            district = query_params.get('district', [None])[0]
            
            try:
                # 공공데이터 API 호출 파라미터 구성
                api_params = {
                    'serviceKey': API_KEY,
                    'pageNo': page_no,
                    'numOfRows': num_of_rows,
                    'resultType': result_type
                }
                
                # 선택적 필터 파라미터 추가
                if facility_name:
                    api_params['facilityName'] = facility_name
                if city:
                    api_params['city'] = city
                if district:
                    api_params['district'] = district
                
                # URL 구성 (메서드 경로 추가)
                query_string = urlencode(api_params)
                api_url = f"{BASE_URL}{API_METHOD}?{query_string}"
                
                print(f"[API 호출] {api_url}")
                
                # API 호출
                req = urllib.request.Request(api_url)
                req.add_header('User-Agent', 'Mozilla/5.0')
                
                with urllib.request.urlopen(req, timeout=30) as response:
                    data = json.loads(response.read().decode('utf-8'))
                    
                    # 응답 검증
                    if 'response' in data and 'header' in data['response']:
                        header = data['response']['header']
                        result_code = header.get('resultCode', '')
                        
                        if result_code != '00':
                            error_msg = header.get('resultMsg', '알 수 없는 오류')
                            self.send_cors_headers()
                            self.send_response(400)
                            self.send_header('Content-Type', 'application/json; charset=utf-8')
                            self.end_headers()
                            error_response = {
                                'error': True,
                                'code': result_code,
                                'message': error_msg
                            }
                            self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))
                            return
                    
                    # 응답 검증 및 로깅
                    response_str = json.dumps(data, ensure_ascii=False)
                    print(f"[응답] 성공 - 데이터 크기: {len(response_str)} bytes")
                    
                    # 응답 구조 확인
                    if 'response' in data and 'header' in data['response']:
                        header = data['response']['header']
                        result_code = header.get('resultCode', '')
                        result_msg = header.get('resultMsg', '')
                        print(f"[API 응답 코드] {result_code}: {result_msg}")
                        
                        if result_code != '00':
                            print(f"[경고] API가 오류 코드를 반환했습니다: {result_code}")
                    
                    # 성공 응답
                    self.send_cors_headers()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(response_str.encode('utf-8'))
                    
            except urllib.error.HTTPError as e:
                try:
                    error_body = e.read().decode('utf-8')
                except:
                    error_body = str(e)
                print(f"[API 오류] HTTP {e.code}: {error_body}")
                self.send_cors_headers()
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                error_response = {
                    'error': True,
                    'code': e.code,
                    'message': f"API 호출 실패: {error_body}"
                }
                self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                import traceback
                error_trace = traceback.format_exc()
                print(f"[서버 오류] {str(e)}")
                print(error_trace)
                self.send_cors_headers()
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                error_response = {
                    'error': True,
                    'code': 500,
                    'message': f"서버 오류: {str(e)}"
                }
                self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))
        
        elif parsed_path.path == '/health':
            # 서버 상태 확인 엔드포인트
            self.send_cors_headers()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'status': 'ok',
                'message': '서버가 정상 작동 중입니다',
                'api_endpoint': BASE_URL
            }, ensure_ascii=False).encode('utf-8'))
        
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
    print(f"API 엔드포인트: {BASE_URL}")
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
