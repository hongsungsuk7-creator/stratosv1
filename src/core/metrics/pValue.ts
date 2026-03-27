import type { StudentCleanRecord } from '../types/analytics';

export function buildItemPValueMap(records: StudentCleanRecord[]): Record<string, number> {
  const bucket: Record<string, { correct: number; total: number }> = {};

  for (const record of records) {
    if (!bucket[record.item_id]) {
      bucket[record.item_id] = { correct: 0, total: 0 };
    }
    bucket[record.item_id].total += 1;
    if (record.is_correct) bucket[record.item_id].correct += 1;
  }

  const result: Record<string, number> = {};
  for (const [itemId, stat] of Object.entries(bucket)) {
    result[itemId] = stat.total > 0 ? stat.correct / stat.total : 0;
  }

  return result;
}
