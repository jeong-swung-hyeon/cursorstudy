# API 엔드포인트 확인 가이드

## 현재 문제

공공 데이터 포털 API에서 `HTTP 500: Unexpected errors` 오류가 발생하고 있습니다.

## 가능한 원인

### 1. API 엔드포인트 경로 문제

현재 사용 중인 엔드포인트:
```
https://apis.data.go.kr/3140000/sportFacilityService
```

**문제 가능성:**
- 실제 API는 더 구체적인 메서드 경로가 필요할 수 있습니다
- 예: `/getSportFacilityList`, `/getFacilityInfo` 등

### 2. 인증키 문제

**확인 사항:**
- 인증키가 유효한지 확인
- 인증키가 만료되지 않았는지 확인
- 일반 인증키(Decoding)를 사용하는지 확인

### 3. 필수 파라미터 누락

공공 데이터 포털 API는 특정 필수 파라미터가 필요할 수 있습니다.

## 확인 방법

### 방법 1: 공공 데이터 포털에서 API 문서 확인

1. https://www.data.go.kr 접속
2. 로그인 후 "마이페이지" → "활용신청 내역" 확인
3. 해당 API의 상세 문서 확인
4. 정확한 엔드포인트 경로 확인

### 방법 2: Swagger UI 확인

만약 해당 API에 Swagger UI가 제공된다면:
1. Swagger UI URL 확인
2. 실제 엔드포인트 경로 확인
3. 필수 파라미터 확인

### 방법 3: 직접 API 테스트

브라우저나 Postman에서 직접 테스트:

```bash
# 예시 (실제 경로는 API 문서에서 확인 필요)
curl "https://apis.data.go.kr/3140000/sportFacilityService/getSportFacilityList?serviceKey=YOUR_KEY&pageNo=1&numOfRows=10&resultType=json"
```

## 일반적인 공공 데이터 포털 API 구조

공공 데이터 포털 API는 보통 다음과 같은 구조를 가집니다:

```
https://apis.data.go.kr/{서비스코드}/{서비스명}/{메서드명}
```

예시:
- `https://apis.data.go.kr/B551014/SRVC_SFMS_FACIL_INFO/TODZ_SFMS_FACIL_INFO`
- `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo`

## 해결 방법

### 1. API 문서에서 정확한 엔드포인트 확인

공공 데이터 포털에서 제공하는 API 문서를 확인하여:
- 정확한 엔드포인트 경로
- 필수 파라미터 목록
- 응답 형식

을 확인하세요.

### 2. 서버 코드 수정

`backend/server.py` 파일의 `BASE_URL`을 수정:

```python
# 현재
BASE_URL = 'https://apis.data.go.kr/3140000/sportFacilityService'

# 수정 예시 (실제 경로로 변경 필요)
BASE_URL = 'https://apis.data.go.kr/3140000/sportFacilityService/getSportFacilityList'
```

### 3. 인증키 재확인

1. 공공 데이터 포털에 로그인
2. 마이페이지 → 개발계정 → 인증키 관리
3. 인증키가 활성화되어 있는지 확인
4. 필요시 인증키 재발급

## 디버깅 팁

### 서버 로그 확인

서버 터미널에서 다음 정보를 확인하세요:

1. **API 호출 URL**: 실제로 호출되는 전체 URL
2. **응답 코드**: HTTP 상태 코드
3. **응답 본문**: API가 반환하는 오류 메시지

### 브라우저에서 직접 테스트

브라우저 주소창에 다음을 입력하여 테스트:

```
http://localhost:8000/api/sport-facilities?pageNo=1&numOfRows=10&resultType=json
```

서버 로그에서 실제 API 호출 URL을 확인할 수 있습니다.

## 다음 단계

1. 공공 데이터 포털에서 API 문서 확인
2. 정확한 엔드포인트 경로 확인
3. `backend/server.py`의 `BASE_URL` 수정
4. 서버 재시작 후 테스트
