# Instagram Clone

React로 만든 인스타그램 스타일의 피드 앱입니다.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 프로젝트 구조

```
instagram-clone/
├── images/              # 이미지 파일들
│   ├── park.jpg        # 프로필 사진
│   ├── won.jpeg        # 프로필 사진
│   └── ...             # 피드 이미지들
├── src/
│   ├── components/
│   │   ├── Feed.jsx    # 피드 컴포넌트
│   │   ├── Feed.css
│   │   ├── Post.jsx    # 게시물 컴포넌트
│   │   └── Post.css
│   ├── App.jsx         # 메인 앱 컴포넌트
│   ├── App.css
│   ├── main.jsx        # 진입점
│   └── index.css       # 전역 스타일
├── index.html
├── package.json
└── vite.config.js
```

## 기능

- 인스타그램 스타일의 피드 UI
- 좋아요 기능
- 댓글 보기/작성 기능
- 반응형 디자인
