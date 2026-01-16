# Vercel 배포 가이드

## 빠른 시작

### 1단계: GitHub에 프로젝트 업로드

```bash
# Git 초기화 (아직 안 했다면)
git init

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit"

# GitHub 저장소 생성 후
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### 2단계: Vercel에 배포

#### 옵션 A: 웹 인터페이스 사용 (가장 쉬움)

1. [vercel.com](https://vercel.com) 접속
2. "Sign Up" 또는 "Log In" 클릭
3. GitHub 계정으로 로그인
4. "Add New Project" 클릭
5. 방금 푸시한 저장소 선택
6. 프로젝트 설정 확인:
   - **Framework Preset**: Create React App (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동 설정됨)
   - **Output Directory**: `build` (자동 설정됨)
7. "Deploy" 클릭
8. 배포 완료 후 제공되는 URL로 접속!

#### 옵션 B: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포 (프리뷰)
vercel

# 프로덕션 배포
vercel --prod
```

## 배포 후 확인사항

✅ 빌드가 성공적으로 완료되었는지 확인
✅ 제공된 URL로 접속하여 앱이 정상 작동하는지 확인
✅ 메모 생성/수정/삭제 기능 테스트
✅ 검색 기능 테스트

## 환경 변수 설정 (필요한 경우)

만약 환경 변수가 필요하다면:
1. Vercel 대시보드에서 프로젝트 선택
2. Settings → Environment Variables
3. 변수 추가

## 자동 배포

GitHub에 푸시할 때마다 자동으로 배포됩니다:
- `main` 브랜치에 푸시 → 프로덕션 배포
- 다른 브랜치에 푸시 → 프리뷰 배포

## 커스텀 도메인 설정

1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Domains
3. 도메인 추가 및 DNS 설정

## 문제 해결

### 빌드 실패 시
- `npm run build`를 로컬에서 실행하여 오류 확인
- Vercel 빌드 로그 확인

### 라우팅 문제
- `vercel.json` 파일이 올바르게 설정되어 있는지 확인
- SPA 라우팅을 위해 모든 경로가 `index.html`로 리다이렉트되는지 확인

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Create React App 배포 가이드](https://create-react-app.dev/docs/deployment/)
