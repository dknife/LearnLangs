# LearnLangs - 외국어 생활회화 학습 웹서비스

## 프로젝트 개요
다국어 생활회화 학습 SPA. 중국어(25단계), 스페인어(25단계) 지원. GitHub Pages 배포, 백엔드 없는 정적 사이트.

## 기술 스택 (실제 서비스)
- **순수 정적 페이지**: `index.html` + `app.js` + `data.js` + `spanish_data.js` + `style.css`
- Vite/React (`src/`) 코드도 존재하지만 실제 서비스에는 사용되지 않음
- localStorage (학습 진도 — 언어별 분리 저장)
- GitHub Pages 배포 (GitHub Actions)

## 핵심 파일 구조
```
index.html          ← 엔트리 포인트
app.js              ← 라우팅, 렌더링, 퀴즈 로직 전체 (다국어 지원)
data.js             ← 중국어 25개 레벨 데이터 (LEVEL_DATA, LEVEL_TITLES 등)
spanish_data.js     ← 스페인어 25개 레벨 데이터 (ES_LEVEL_DATA, ES_LEVEL_TITLES 등)
style.css           ← 전체 스타일
src/                ← Vite/React 소스 (서비스 미사용, 참고용)
```

## 다국어 구조
- `LANGS` 설정 객체로 언어별 데이터/TTS/필드명 관리
- 중국어 데이터 필드: `chinese`, `pinyin`
- 스페인어 데이터 필드: `spanish`, `pronunciation`
- Progress는 언어별 별도 localStorage 키 사용

## 핵심 로직
- 퀴즈: 단어4 + 외국어→한국어3 + 한국어→외국어3 = 10문제
- 통과 기준: 10문제 중 8문제 이상 (80%)
- 레벨 해제: 모든 레벨 자유 접근 가능
- 통과한 레벨: 아이콘 위에 대각선 PASS 리본 표시
- HashRouter: `#/` 언어선택, `#/zh` 중국어홈, `#/es` 스페인어홈, `#/zh/lesson/1`, `#/es/quiz/1` 등

## 주의사항
- **변경 시 반드시 `app.js`, `data.js`, `spanish_data.js`, `style.css`를 직접 수정할 것**
- `src/` 폴더의 React 코드를 수정해도 배포에 반영되지 않음
- push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 자동 배포
- **새 파일 추가 시** `deploy.yml`의 `cp` 목록과 `sed` 캐시버스팅에 반드시 반영할 것
