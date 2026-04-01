import { PSCORE_CAMPUS_2025_MT_DATA } from '@/data/pscoreCampus2025MtData';
import { resolveExamPeriodFromTestLabel, toExamPeriodKey } from '@/utils/examPeriod';

const P_SCORE_ROWS = PSCORE_CAMPUS_2025_MT_DATA.filter((row) => row.section === 'P-Score');

/**
 * 선택 시험·연도에 맞는 P-SCORE 응시 캠퍼스 수(고유 캠퍼스명 기준).
 * 기간 행이 없으면 fallbackCount(예: 랭킹 표 행 수)를 반환.
 */
export function getExamCohortCampusCount(
  selectedTests: string[],
  selectedYear: number | undefined,
  fallbackCount: number,
): number {
  const selectedPeriodKeys = selectedTests
    .map((label) => resolveExamPeriodFromTestLabel(label, selectedYear))
    .filter((period): period is { year: number; month: number } => Boolean(period))
    .map(toExamPeriodKey);
  const periodKeySet = new Set(selectedPeriodKeys);

  const candidateRows =
    periodKeySet.size > 0
      ? P_SCORE_ROWS.filter((row) => periodKeySet.has(toExamPeriodKey({ year: row.year, month: row.month })))
      : selectedYear
        ? P_SCORE_ROWS.filter((row) => row.year === selectedYear)
        : P_SCORE_ROWS;

  const targetRows = candidateRows.length > 0 ? candidateRows : P_SCORE_ROWS;
  const latestPeriodKey = targetRows.reduce(
    (max, row) => Math.max(max, toExamPeriodKey({ year: row.year, month: row.month })),
    0,
  );
  const latestRows = targetRows.filter(
    (row) => toExamPeriodKey({ year: row.year, month: row.month }) === latestPeriodKey,
  );

  return latestRows.length > 0
    ? new Set(latestRows.map((r) => r.campus)).size
    : fallbackCount;
}
