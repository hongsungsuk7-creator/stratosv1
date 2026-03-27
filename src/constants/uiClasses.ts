/**
 * 공통 UI 클래스 문자열 — 색·테마는 `src/styles/design-tokens.css`에서 조정하세요.
 */

/** 페이지 필터 도구줄: select / input (풀 너비, rounded-lg) */
export const UI_FILTER_CONTROL_CLASS =
  'w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500';

/** 대시보드 상단 필터: 작은 높이·text-xs */
export const UI_FILTER_CONTROL_COMPACT_CLASS =
  'w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md focus:ring-indigo-500 focus:border-indigo-500 block py-1.5 pl-2 pr-8 h-9 dark:bg-slate-700 dark:border-slate-600 dark:text-white';

/** 대시보드 필터 변형 (본문 대비 살짝 연한 텍스트) */
export const UI_FILTER_CONTROL_COMPACT_SLATE_CLASS =
  'w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md focus:ring-indigo-500 focus:border-indigo-500 block py-1.5 pl-2 pr-8 h-8 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200';

/** KPI 카드용 인라인 select (작은 너비, py-1 px-2) */
export const UI_KPI_INLINE_SELECT_CLASS =
  'bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md focus:ring-indigo-500 focus:border-indigo-500 block py-1 px-2 h-8 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200';

/** IRT 모델 페이지: 폼 select (rounded-lg, p-2) */
export const UI_FILTER_CONTROL_IRT_SELECT_CLASS =
  'w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 pr-8';

/** IRT 모델 페이지: 폼 input */
export const UI_FILTER_CONTROL_IRT_INPUT_CLASS =
  'w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2';
