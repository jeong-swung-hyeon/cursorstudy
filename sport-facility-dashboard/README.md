# 스포츠 시설 대시보드

공공 데이터 포털의 스포츠 시설 정보를 조회하고 표시하는 모던한 웹 대시보드입니다.

## 🎨 주요 기능

- **모던 미니멀 디자인**: 깔끔하고 현대적인 UI/UX
- **부드러운 애니메이션**: 페이드인, 슬라이드인 등 자연스러운 전환 효과
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화
- **실시간 검색**: 시설명, 시/도, 시/군/구로 필터링
- **페이지네이션**: 대량 데이터를 효율적으로 표시

## 🛠 기술 스택

### 프론트엔드
- **React** - UI 라이브러리
- **Vite** - 빌드 도구
- **바닐라 CSS** - 스타일링 (애니메이션 포함)

### 백엔드
- **Python 3.6+** - 서버 사이드
- **HTTP Server** - 경량 프록시 서버
- **CORS 처리** - 브라우저 CORS 문제 해결

## 📁 프로젝트 구조

```
sport-facility-dashboard/
├── backend/
│   ├── server.py          # Python 백엔드 서버
│   ├── requirements.txt   # Python 의존성 (기본 라이브러리만 사용)
│   └── start_server.bat  # 서버 실행 스크립트 (Windows)
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # 메인 앱 컴포넌트
│   │   ├── App.css        # 앱 스타일
│   │   ├── index.css      # 글로벌 스타일
│   │   └── main.jsx       # 진입점
│   ├── index.html         # HTML 템플릿
│   ├── package.json       # Node.js 의존성
│   ├── start_dev.bat      # 프론트엔드 실행 스크립트 (Windows)
│   └── README.md           # 프론트엔드 가이드
├── API-guide_image/       # API 가이드 이미지
├── 공공데이터포털_API_사용가이드.md  # API 사용 가이드
└── README.md              # 프로젝트 문서
```

## 🚀 시작하기

### 1. 백엔드 서버 실행

#### Windows
```bash
cd backend
start_server.bat
```

#### Linux/Mac
```bash
cd backend
python3 server.py
```

서버는 기본적으로 `http://localhost:8000`에서 실행됩니다.

### 2. 프론트엔드 실행

#### 방법 1: 배치 파일 사용 (권장) ⭐
PowerShell 실행 정책 오류를 피하기 위해 배치 파일을 사용하세요:

```bash
cd frontend
start_dev.bat
```

#### 방법 2: 명령 프롬프트(CMD) 사용
PowerShell 대신 CMD를 사용:

```bash
cd frontend
npm install  # 처음 실행 시만
npm run dev
```

#### 방법 3: PowerShell 실행 정책 변경
PowerShell을 관리자 권한으로 실행 후:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

그 후 다시 실행:
```bash
cd frontend
npm run dev
```

프론트엔드는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## 📡 API 엔드포인트

### 백엔드 API

- **GET** `/api/sport-facilities` - 스포츠 시설 목록 조회
  - Query Parameters:
    - `pageNo` (필수): 페이지 번호 (기본값: 1)
    - `numOfRows` (필수): 페이지당 항목 수 (기본값: 10)
    - `resultType` (선택): 응답 형식 (json/xml, 기본값: json)
    - `facilityName` (선택): 시설명 필터
    - `city` (선택): 시/도 필터
    - `district` (선택): 시/군/구 필터

- **GET** `/health` - 서버 상태 확인

### 공공 데이터 포털 API

- **Base URL**: `https://apis.data.go.kr/3140000/sportFacilityService`
- **인증키**: 프로젝트에 포함됨 (일반 인증키 Decoding)

## 🎯 사용 방법

1. **서버 실행**: 백엔드 서버를 먼저 실행합니다.
2. **프론트엔드 실행**: React 앱을 실행합니다.
3. **검색**: 시설명, 시/도, 시/군/구로 필터링할 수 있습니다.
4. **페이지네이션**: 하단의 페이지네이션 버튼으로 페이지를 이동합니다.

## 🎨 디자인 특징

### 색상 팔레트
- Primary: `#2563eb` (파란색)
- Background: `#f8fafc` (연한 회색)
- Surface: `#ffffff` (흰색)
- Text Primary: `#1e293b` (진한 회색)
- Text Secondary: `#64748b` (중간 회색)

### 애니메이션
- **Fade In**: 카드가 나타날 때 페이드인 효과
- **Slide In**: 검색 섹션이 슬라이드인 효과
- **Hover**: 카드 호버 시 상승 효과
- **Smooth Scroll**: 페이지 변경 시 부드러운 스크롤

### 반응형 브레이크포인트
- **Desktop**: 1400px 이상
- **Tablet**: 768px - 1400px
- **Mobile**: 768px 이하

## 🔧 설정

### 백엔드 포트 변경
`backend/server.py` 파일의 `run_server()` 함수에서 포트를 변경할 수 있습니다.

```python
def run_server(port=8000):  # 포트 번호 변경
    ...
```

### 프론트엔드 API URL 변경
`frontend/src/App.jsx` 파일에서 API URL을 변경할 수 있습니다.

```javascript
const API_BASE_URL = 'http://localhost:8000/api/sport-facilities'
```

## 🐛 문제 해결

### CORS 오류
- 백엔드 서버가 실행 중인지 확인하세요.
- 프론트엔드에서 올바른 API URL을 사용하는지 확인하세요.

### 데이터가 표시되지 않음
- 브라우저 개발자 도구의 Network 탭에서 API 응답을 확인하세요.
- 백엔드 서버 로그를 확인하세요.
- 공공 데이터 포털 API가 정상 작동하는지 확인하세요.

### 서버 연결 실패
- 백엔드 서버가 `http://localhost:8000`에서 실행 중인지 확인하세요.
- 방화벽 설정을 확인하세요.

### PowerShell 실행 정책 오류
PowerShell에서 `npm run dev` 실행 시 `PSSecurityException` 오류가 발생하는 경우:
- **해결 방법 1**: `frontend/start_dev.bat` 파일을 더블클릭하여 실행
- **해결 방법 2**: 명령 프롬프트(CMD) 사용
- **해결 방법 3**: PowerShell 실행 정책 변경 (관리자 권한 필요)
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 📚 참고 자료

- [공공데이터포털](https://www.data.go.kr)
- [React 공식 문서](https://react.dev)
- [Vite 공식 문서](https://vite.dev)

---

**개발자**: 스포츠 시설 대시보드 팀  
**버전**: 1.0.0  
**최종 업데이트**: 2024년
