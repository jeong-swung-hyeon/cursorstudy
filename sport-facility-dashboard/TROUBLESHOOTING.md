# 문제 해결 가이드

## "Failed to fetch" 오류 해결 방법

### 1. 백엔드 서버 상태 확인

**확인 사항:**
- 백엔드 서버가 `http://localhost:8000`에서 실행 중인지 확인
- 서버 터미널에 다음 메시지가 표시되어야 합니다:
  ```
  서버가 http://localhost:8000 에서 실행 중입니다...
  API 엔드포인트: https://apis.data.go.kr/3140000/sportFacilityService
  ```

**해결 방법:**
1. `backend` 폴더로 이동
2. `start_server.bat` 파일 실행
3. 또는 터미널에서:
   ```bash
   cd backend
   python server.py
   ```

### 2. 브라우저 개발자 도구 확인

**확인 방법:**
1. 브라우저에서 `F12` 키를 눌러 개발자 도구 열기
2. **Network** 탭 선택
3. 페이지 새로고침
4. `/api/sport-facilities` 요청 확인

**확인 사항:**
- 요청 상태 코드 (200, 404, 500 등)
- 요청 URL이 올바른지 (`http://localhost:8000/api/sport-facilities`)
- 응답 내용 확인

### 3. 포트 충돌 확인

**확인 방법:**
```bash
# Windows PowerShell
netstat -ano | findstr :8000
```

**해결 방법:**
- 다른 프로그램이 8000 포트를 사용 중이면:
  1. 해당 프로세스 종료
  2. 또는 `server.py`에서 포트 번호 변경

### 4. 방화벽 확인

Windows 방화벽이 연결을 차단할 수 있습니다.

**해결 방법:**
1. Windows 보안 설정 열기
2. 방화벽 및 네트워크 보호
3. 앱이 방화벽을 통과하도록 허용

### 5. CORS 오류 확인

브라우저 콘솔에서 CORS 관련 오류가 있는지 확인하세요.

**확인 방법:**
- 브라우저 개발자 도구(F12) → Console 탭
- CORS 관련 오류 메시지 확인

**해결 방법:**
- 백엔드 서버의 CORS 헤더가 올바르게 설정되어 있는지 확인
- `server.py`의 `send_cors_headers()` 메서드 확인

### 6. API 엔드포인트 확인

공공 데이터 포털 API의 실제 엔드포인트 구조를 확인해야 합니다.

**확인 방법:**
1. 서버 터미널에서 API 호출 로그 확인
2. 실제 호출되는 URL 확인:
   ```
   [API 호출] https://apis.data.go.kr/3140000/sportFacilityService?...
   ```

**문제 가능성:**
- API 엔드포인트 경로가 잘못되었을 수 있음
- 예: `/getSportFacilityList` 같은 추가 경로가 필요할 수 있음

### 7. 인증키 확인

**확인 사항:**
- 인증키가 올바른지 확인
- 인증키가 만료되지 않았는지 확인
- 일반 인증키(Decoding)를 사용하는지 확인

**확인 방법:**
- 서버 터미널에서 API 응답 확인
- `resultCode`가 `03`이면 인증키 오류

### 8. 네트워크 연결 확인

**확인 방법:**
```bash
# 공공 데이터 포털 API 연결 테스트
curl "https://apis.data.go.kr/3140000/sportFacilityService?serviceKey=YOUR_KEY&pageNo=1&numOfRows=10&resultType=json"
```

## 일반적인 오류 코드

| 오류 코드 | 의미 | 해결 방법 |
|----------|------|----------|
| `01` | 서비스 시스템 오류 | 잠시 후 다시 시도 |
| `02` | 인증키가 파라미터에 없음 | serviceKey 파라미터 확인 |
| `03` | 인증키가 유효하지 않음 | 인증키 재발급 또는 확인 |
| `04` | 필수 파라미터 누락 | pageNo, numOfRows 확인 |

## 디버깅 팁

### 서버 로그 확인
서버 터미널에서 다음 정보를 확인하세요:
- 요청 경로
- API 호출 URL
- 응답 상태
- 오류 메시지

### 프론트엔드 콘솔 확인
브라우저 개발자 도구(F12) → Console 탭에서:
- JavaScript 오류 확인
- 네트워크 요청 상태 확인

### 테스트 방법
1. 브라우저에서 직접 접속 테스트:
   ```
   http://localhost:8000/health
   ```
   → `{"status":"ok",...}` 응답이 와야 함

2. API 엔드포인트 직접 테스트:
   ```
   http://localhost:8000/api/sport-facilities?pageNo=1&numOfRows=10&resultType=json
   ```

## 추가 도움말

문제가 계속되면:
1. 서버 터미널의 전체 로그를 확인하세요
2. 브라우저 개발자 도구의 Network 탭 스크린샷을 찍어보세요
3. 오류 메시지의 전체 내용을 확인하세요
