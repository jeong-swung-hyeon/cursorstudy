# 공공 데이터 포털 API 사용 가이드 (GW 방식 - Swagger-UI 기반)

## 목차
1. [사전 준비](#사전-준비)
2. [API 호출 URL 구성](#api-호출-url-구성)
3. [필수 파라미터](#필수-파라미터)
4. [API 호출 방법](#api-호출-방법)
5. [응답 결과 확인](#응답-결과-확인)
6. [권장 사항](#권장-사항)
7. [추가 기능](#추가-기능)

---

## 사전 준비

### 인증키 발급
- **공공데이터포털**: https://www.data.go.kr
- 활용신청을 통해 인증키 발급
- **인증키 종류**: 일반 인증키(Decoding) 사용 권장

> ⚠️ **주의**: `serviceKey` 파라미터에는 일반 인증키(Decoding)를 입력해야 합니다.

---

## API 호출 URL 구성

### 기본 구조
```
http://apis.data.go.kr/AAAAAA/api/{호출주소}
```

### 구성 요소
1. **통신 프로토콜**: `http://` 또는 `https://`
2. **Base URL**: `apis.data.go.kr/AAAAAA/api` 
   - `AAAAAA`는 실제 서비스 코드로 대체
3. **호출 주소**: API 엔드포인트 경로
   - 예: `/file-data-list`, `/open-data-list`, `/dataset`, `/standard-data-list`
4. **통신 프로토콜 메소드**: 대부분 `GET` 방식

### 예시 URL
```
http://apis.data.go.kr/AAAAAA/api/v1/file-data-list
```

### 주요 API 엔드포인트
- `GET /file-data-list` - 파일 데이터 리스트
- `GET /open-data-list` - 오픈 API 리스트
- `GET /dataset` - 데이터셋 리스트
- `GET /standard-data-list` - 표준데이터셋 리스트

---

## 필수 파라미터

### 공통 필수 파라미터
| 파라미터 | 타입 | 설명 | 필수 여부 |
|---------|------|------|----------|
| `serviceKey` | string | 공공데이터포털에서 발급받은 인증키 (Decoding) | ✅ 필수 |
| `pageNo` | string | 페이지 번호 | ✅ 필수 |
| `numOfRows` | string | 한 페이지 결과 수 | ✅ 필수 |

### API별 추가 필수 파라미터
API에 따라 추가 필수 파라미터가 있을 수 있습니다.

**예시: 재해위험지구 현황 API**
- `typeCd`: 유형 코드
  - `001`: 고립위험
  - `002`: 붕괴시설 위험
  - `003`: 유실위험
  - `004`: 취약박재시설
  - `005`: 침수위험
  - `006`: 해일위험

### 선택 파라미터
| 파라미터 | 타입 | 설명 | 기본값 |
|---------|------|------|--------|
| `returnType` | string | 응답 데이터 타입 (`json` 또는 `xml`) | `json` |
| `page` | integer | 페이지 인덱스 | `1` |
| `perPage` | integer | 페이지 크기 | `10` |
| `cond[list_title::LIKE]` | string | 목록명 필터링 | - |
| `cond[title::LIKE]` | string | 데이터명 필터링 | - |
| `cond[created_at::LT]` | string | 등록일 필터링 (Less Than) | - |

---

## API 호출 방법

### 방법 1: Swagger-UI 사용 (권장) ⭐

Swagger-UI를 통한 API 테스트는 가장 직관적이고 안전한 방법입니다.

#### 단계별 가이드

**1단계: API 선택 및 실행 준비**
- API 목록에서 호출을 원하는 API를 선택합니다
- 예: `/file-data-list` 엔드포인트 선택

**2단계: 요청변수 입력 및 API 호출**
- "OpenAPI 실행 준비" 버튼 클릭
- 필수 파라미터 입력:
  - `serviceKey`: 일반 인증키(Decoding) 입력
  - `pageNo`: 페이지 번호
  - `numOfRows`: 한 페이지 결과 수
  - 기타 API별 필수 파라미터
- "OpenAPI 호출" 버튼 클릭

**3단계: API 호출 명령어 및 호출 결과 확인**
- 호출된 `curl` 명령어 확인
- 응답 결과 확인 (JSON 또는 XML)

### 방법 2: cURL 명령어 사용

```bash
curl -X GET "http://apis.data.go.kr/AAAAAA/api/v1/file-data-list?page=1&perPage=10" \
  -H "accept: application/json"
```

#### 실제 예시
```bash
curl -X GET "http://apis.data.go.kr/AAAAAA/api/v1/file-data-list?page=1&perPage=10&serviceKey=YOUR_SERVICE_KEY" \
  -H "accept: application/json"
```

### 방법 3: Python 코드 사용

```python
import urllib.request
import json
from urllib.parse import urlencode

# API 설정
BASE_URL = "http://apis.data.go.kr/AAAAAA/api/v1/file-data-list"
SERVICE_KEY = "발급받은_인증키"  # Decoding 키 사용

# 파라미터 설정
params = {
    'serviceKey': SERVICE_KEY,
    'pageNo': '1',
    'numOfRows': '10',
    'returnType': 'json'  # 또는 'xml'
}

# URL 구성
query_string = urlencode(params)
api_url = f"{BASE_URL}?{query_string}"

# API 호출
try:
    with urllib.request.urlopen(api_url) as response:
        data = json.loads(response.read().decode('utf-8'))
        print(json.dumps(data, ensure_ascii=False, indent=2))
except urllib.error.HTTPError as e:
    print(f"HTTP 에러: {e.code} - {e.reason}")
    error_body = e.read().decode('utf-8')
    print(f"에러 내용: {error_body}")
except Exception as e:
    print(f"API 호출 실패: {e}")
```

### 방법 4: JavaScript/Fetch API 사용

```javascript
async function fetchPublicData() {
    const BASE_URL = "http://apis.data.go.kr/AAAAAA/api/v1/file-data-list";
    const SERVICE_KEY = "발급받은_인증키";
    
    const params = new URLSearchParams({
        serviceKey: SERVICE_KEY,
        pageNo: '1',
        numOfRows: '10',
        returnType: 'json'
    });
    
    const apiUrl = `${BASE_URL}?${params.toString()}`;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('API 호출 실패:', error);
        throw error;
    }
}

// 사용 예시
fetchPublicData()
    .then(data => {
        console.log('성공:', data);
    })
    .catch(error => {
        console.error('에러:', error);
    });
```

---

## 응답 결과 확인

### 성공 응답 (HTTP 200)

#### JSON 형식 예시
```json
{
  "currentCount": 10,
  "data": [
    {
      "cost_unfil": "건",
      "created_at": "2020-01-08",
      "data_type": "링크 데이터",
      "dept_nm": "국가기후데이터센터",
      "desc": "기상청에서 발표한 기예보 자료를 제공합니다.",
      "download_cnt": 180,
      "etc": "파일 다운로드는 로그인 후 이용하실 수 있습니다."
    }
  ]
}
```

#### XML 형식 예시
```xml
<?xml version="1.0" encoding="UTF-8"?>
<response>
    <header>
        <resultCode>00</resultCode>
        <resultMsg>NORMAL_SERVICE</resultMsg>
    </header>
    <body>
        <items>
            <item>
                <created_at>2020-01-08</created_at>
                <data_type>링크 데이터</data_type>
                <dept_nm>국가기후데이터센터</dept_nm>
            </item>
        </items>
    </body>
</response>
```

### 에러 코드 확인

#### HTTP 상태 코드
- `200`: 성공
- `400`: 잘못된 요청
- `401`: 인증 실패 (인증키 오류)
- `404`: 리소스를 찾을 수 없음
- `500`: 서버 오류

#### API 응답 코드 (resultCode)
API 응답의 `header.resultCode`를 확인해야 합니다:

| 코드 | 설명 |
|------|------|
| `00` | 정상 처리 |
| `01` | 서비스 시스템에 오류가 있는 경우 |
| `02` | 인증키가 파라미터에 존재하지 않는 경우 |
| `03` | 인증키가 유효하지 않는 경우 |
| `04` | 필수 요청변수(파라미터)가 누락된 경우 |

### 에러 처리 예시

#### Python
```python
def check_api_response(data):
    """API 응답 검증"""
    if 'response' in data and 'header' in data['response']:
        header = data['response']['header']
        result_code = header.get('resultCode')
        result_msg = header.get('resultMsg', '')
        
        if result_code != '00':
            error_messages = {
                '01': '서비스 시스템 오류',
                '02': '인증키가 파라미터에 존재하지 않음',
                '03': '인증키가 유효하지 않음',
                '04': '필수 요청변수 누락'
            }
            error_msg = error_messages.get(result_code, f'알 수 없는 오류: {result_code}')
            raise Exception(f"API 오류 [{result_code}]: {error_msg} - {result_msg}")
    
    return True
```

#### JavaScript
```javascript
function checkApiResponse(data) {
    if (data.response && data.response.header) {
        const header = data.response.header;
        const resultCode = header.resultCode;
        const resultMsg = header.resultMsg || '';
        
        if (resultCode !== '00') {
            const errorMessages = {
                '01': '서비스 시스템 오류',
                '02': '인증키가 파라미터에 존재하지 않음',
                '03': '인증키가 유효하지 않음',
                '04': '필수 요청변수 누락'
            };
            
            const errorMsg = errorMessages[resultCode] || `알 수 없는 오류: ${resultCode}`;
            throw new Error(`API 오류 [${resultCode}]: ${errorMsg} - ${resultMsg}`);
        }
    }
    
    return true;
}
```

---

## 권장 사항

### 1. Swagger-UI로 먼저 테스트
- API 파라미터와 응답 구조를 먼저 확인
- 실제 데이터 형식을 파악한 후 코드 작성

### 2. 인증키 보안 관리
- 인증키를 코드에 직접 하드코딩하지 않기
- 환경변수나 설정 파일로 관리
- `.gitignore`에 인증키가 포함된 파일 추가

```python
# 환경변수 사용 예시
import os
SERVICE_KEY = os.getenv('PUBLIC_DATA_SERVICE_KEY')
```

### 3. 에러 처리 구현
- HTTP 상태 코드와 API 응답 코드 모두 확인
- 적절한 에러 메시지 제공
- 재시도 로직 구현 고려

### 4. 응답 형식 선택
- `returnType=json` 권장 (파싱이 쉬움)
- XML이 필요한 경우에만 `returnType=xml` 사용

### 5. 페이지네이션 처리
- 대량 데이터는 `pageNo`, `numOfRows`로 분할 처리
- 전체 데이터가 필요한 경우 반복 호출 구현

```python
def fetch_all_data(api_url, service_key, num_of_rows=1000):
    """전체 데이터 가져오기 (페이지네이션 처리)"""
    all_items = []
    page_no = 1
    
    while True:
        params = {
            'serviceKey': service_key,
            'pageNo': str(page_no),
            'numOfRows': str(num_of_rows),
            'returnType': 'json'
        }
        
        query_string = urlencode(params)
        url = f"{api_url}?{query_string}"
        
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            # 응답 검증
            if 'response' in data:
                body = data['response'].get('body', {})
                items = body.get('items', {}).get('item', [])
                
                if not items:
                    break
                
                # 단일 항목인 경우 리스트로 변환
                if isinstance(items, dict):
                    items = [items]
                
                all_items.extend(items)
                
                # 마지막 페이지 확인
                total_count = int(body.get('totalCount', 0))
                if len(all_items) >= total_count:
                    break
                
                page_no += 1
            else:
                break
    
    return all_items
```

### 6. 요청 제한 고려
- API 호출 빈도 제한 확인
- 필요시 요청 간 딜레이 추가

```python
import time

def fetch_with_delay(api_url, delay=0.5):
    """딜레이를 두고 API 호출"""
    time.sleep(delay)
    # API 호출 코드
    pass
```

---

## 추가 기능

### 필터링 기능

`cond[필드명::연산자]` 형식을 사용하여 데이터를 필터링할 수 있습니다.

#### 사용 가능한 연산자
- `LIKE`: 부분 일치 검색
- `LT`: Less Than (작음)
- `GT`: Greater Than (큼)
- `EQ`: Equal (같음)

#### 예시
```python
params = {
    'serviceKey': SERVICE_KEY,
    'pageNo': '1',
    'numOfRows': '10',
    'cond[list_title::LIKE]': '기상',  # 목록명에 '기상' 포함
    'cond[title::LIKE]': '날씨',       # 데이터명에 '날씨' 포함
    'cond[created_at::LT]': '2024-01-01'  # 2024년 이전 데이터
}
```

### 정렬 기능
- API별로 정렬 기능 지원 여부가 다름
- Swagger-UI에서 정렬 파라미터 확인 필요

### 파일 다운로드
- 일부 API는 파일 다운로드 기능 제공
- 파일 다운로드는 로그인 후 이용 가능할 수 있음
- `etc` 필드에 관련 안내 메시지 포함

---

## 참고 자료

- **공공데이터포털**: https://www.data.go.kr
- **API 활용신청**: 공공데이터포털에서 원하는 데이터셋 선택 후 활용신청
- **인증키 관리**: 마이페이지 > 개발계정 > 인증키 관리

---

## 문제 해결

### 자주 발생하는 오류

#### 1. 인증키 오류 (코드 02, 03)
- **원인**: 인증키가 누락되었거나 잘못됨
- **해결**: 
  - 인증키가 파라미터에 정확히 포함되었는지 확인
  - Decoding 키를 사용하는지 확인
  - 공공데이터포털에서 인증키 재발급

#### 2. 필수 파라미터 누락 (코드 04)
- **원인**: 필수 파라미터가 누락됨
- **해결**: 
  - Swagger-UI에서 필수 파라미터 확인
  - 모든 필수 파라미터가 포함되었는지 확인

#### 3. CORS 오류 (브라우저에서 직접 호출 시)
- **원인**: 브라우저의 CORS 정책
- **해결**: 
  - 서버 사이드에서 API 호출
  - CORS 프록시 사용 (개발 환경에서만)
  - 백엔드 서버를 통한 프록시 구현

---

## 예제 코드 전체

### Python 완전한 예제
```python
import urllib.request
import json
from urllib.parse import urlencode
import os

class PublicDataAPI:
    def __init__(self, service_key=None):
        self.service_key = service_key or os.getenv('PUBLIC_DATA_SERVICE_KEY')
        if not self.service_key:
            raise ValueError("인증키가 필요합니다. 환경변수 PUBLIC_DATA_SERVICE_KEY를 설정하거나 생성자에 전달하세요.")
    
    def call_api(self, endpoint, params=None, base_url="http://apis.data.go.kr/AAAAAA/api/v1"):
        """API 호출"""
        # 기본 파라미터
        default_params = {
            'serviceKey': self.service_key,
            'pageNo': '1',
            'numOfRows': '10',
            'returnType': 'json'
        }
        
        # 사용자 파라미터 병합
        if params:
            default_params.update(params)
        
        # URL 구성
        query_string = urlencode(default_params)
        api_url = f"{base_url}{endpoint}?{query_string}"
        
        try:
            with urllib.request.urlopen(api_url) as response:
                data = json.loads(response.read().decode('utf-8'))
                
                # 응답 검증
                self._check_response(data)
                
                return data
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            raise Exception(f"HTTP {e.code}: {error_body}")
        except Exception as e:
            raise Exception(f"API 호출 실패: {str(e)}")
    
    def _check_response(self, data):
        """응답 검증"""
        if 'response' in data and 'header' in data['response']:
            header = data['response']['header']
            result_code = header.get('resultCode')
            
            if result_code != '00':
                error_messages = {
                    '01': '서비스 시스템 오류',
                    '02': '인증키가 파라미터에 존재하지 않음',
                    '03': '인증키가 유효하지 않음',
                    '04': '필수 요청변수 누락'
                }
                error_msg = error_messages.get(result_code, f'알 수 없는 오류: {result_code}')
                raise Exception(f"API 오류 [{result_code}]: {error_msg}")
        
        return True
    
    def get_file_data_list(self, page_no=1, num_of_rows=10, **kwargs):
        """파일 데이터 리스트 조회"""
        params = {
            'pageNo': str(page_no),
            'numOfRows': str(num_of_rows),
            **kwargs
        }
        return self.call_api('/file-data-list', params)

# 사용 예시
if __name__ == "__main__":
    # 인증키 설정 (환경변수 또는 직접 입력)
    api = PublicDataAPI(service_key="YOUR_SERVICE_KEY")
    
    try:
        # 파일 데이터 리스트 조회
        result = api.get_file_data_list(page_no=1, num_of_rows=10)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as e:
        print(f"에러: {e}")
```

---

**작성일**: 2024년  
**버전**: 1.0  
**참고**: 이 가이드는 GW 방식(Gateway 방식)의 Swagger-UI 기반 OpenAPI 명세서를 기준으로 작성되었습니다.
