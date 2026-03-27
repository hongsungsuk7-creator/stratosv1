import type { StudentCleanRecord, StudentRawRecord } from '../types/analytics';

function toNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

/**
 * raw -> cleaned
 * - score를 0~100으로 clamp
 * - is_correct를 boolean으로 정규화
 */
export function normalizeStudentRecords(records: StudentRawRecord[]): StudentCleanRecord[] {
  return records
    .filter((record) => record.student_id && record.campus_id && record.item_id)
    .map((record) => {
      const normalizedScore = Math.max(0, Math.min(100, toNumber(record.score)));
      const normalizedCorrect = Boolean(record.is_correct);
      return {
        ...record,
        score: normalizedScore,
        is_correct: normalizedCorrect,
      };
    });
}
