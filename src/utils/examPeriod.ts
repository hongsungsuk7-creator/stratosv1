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
