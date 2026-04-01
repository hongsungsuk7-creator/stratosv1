export interface ExamPeriod {
  year: number;
  month: number;
}

export const toExamPeriodKey = (period: ExamPeriod): number => period.year * 100 + period.month;

export const toExamOptionLabel = (period: ExamPeriod): string =>
  `MT (${period.year}-${String(period.month).padStart(2, '0')})`;

export const parseExamOptionLabel = (label: string): ExamPeriod | null => {
  const match = label.match(/(\d{4})-(\d{2})/);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return null;
  }

  return { year, month };
};

/** MT(2025-12) 형식 또는 대시보드용 라벨(연도 + N월)에서 시험 시점 추출. 연도 없으면 fallbackYear 사용. */
export const resolveExamPeriodFromTestLabel = (
  label: string,
  fallbackYear?: number,
): ExamPeriod | null => {
  const dashed = parseExamOptionLabel(label);
  if (dashed) return dashed;
  const yearMatch = label.match(/\b(20\d{2})\b/);
  const monthMatch = label.match(/(\d{1,2})\s*월/);
  const month = monthMatch ? Number(monthMatch[1]) : NaN;
  if (!Number.isFinite(month) || month < 1 || month > 12) return null;
  const year = yearMatch ? Number(yearMatch[1]) : fallbackYear;
  if (year === undefined || !Number.isFinite(year)) return null;
  return { year, month };
};
