# LearnChinese - 중국어 생활회화 학습 웹서비스

## 프로젝트 개요
25단계로 구성된 중국어 생활회화 학습 SPA. GitHub Pages 배포, 백엔드 없는 정적 사이트.

## 기술 스택
- Vite + React 18
- Tailwind CSS (게임풍 커스텀 테마)
- React Router (HashRouter)
- localStorage (학습 진도)

## 주요 명령어
- `npm run dev` — 개발 서버
- `npm run build` — 프로덕션 빌드
- `npm run preview` — 빌드 미리보기

## 구조
- `src/data/level*.json` — 레벨별 학습 데이터 (25개)
- `src/pages/` — Home, Lesson, Quiz, Result 페이지
- `src/hooks/useProgress.js` — localStorage 기반 진도 관리
- `src/components/` — 재사용 UI 컴포넌트

## 핵심 로직
- 퀴즈 통과 기준: 5문제 중 4문제 이상 (80%)
- 레벨 해제: 이전 레벨 통과 시 다음 레벨 자동 해제
- HashRouter 사용 (GitHub Pages 호환)
- base 경로: `/LearnChinese/`
