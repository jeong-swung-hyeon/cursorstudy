# 프론트엔드 실행 가이드

## PowerShell 실행 정책 오류 해결 방법

PowerShell에서 `npm run dev` 실행 시 오류가 발생하는 경우, 다음 방법 중 하나를 사용하세요.

### 방법 1: 배치 파일 사용 (권장) ⭐

프로젝트 루트에서 `start_dev.bat` 파일을 더블클릭하거나 실행하세요.

```bash
start_dev.bat
```

### 방법 2: CMD 사용

PowerShell 대신 명령 프롬프트(CMD)를 사용하세요:

1. `Win + R` 키를 누르고 `cmd` 입력 후 Enter
2. 프로젝트 폴더로 이동:
   ```bash
   cd C:\cursor30\cursorstudy\sport-facility-dashboard\frontend
   ```
3. 실행:
   ```bash
   npm run dev
   ```

### 방법 3: PowerShell 실행 정책 변경

PowerShell을 관리자 권한으로 실행한 후:

```powershell
# 현재 실행 정책 확인
Get-ExecutionPolicy

# 실행 정책 변경 (현재 사용자만)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**주의**: 실행 정책을 변경하면 보안에 영향을 줄 수 있습니다.

### 방법 4: npx 직접 사용

```bash
npx vite
```

## 일반 실행 방법

### 개발 서버 시작
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

### 빌드 미리보기
```bash
npm run preview
```

## 문제 해결

### 모듈을 찾을 수 없음
```bash
npm install
```

### 포트가 이미 사용 중
`vite.config.js`에서 포트를 변경하거나, 사용 중인 프로세스를 종료하세요.
