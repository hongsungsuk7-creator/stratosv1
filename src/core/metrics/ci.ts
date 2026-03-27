import type { StudentCleanRecord } from '../types/analytics';

/**
 * CI via S-P inversion logic
 * 1) item difficulty(P-value) 오름차순 정렬
 * 2) easy wrong / hard correct inversion count
 * 3) inversion / pair count 정규화 (0~1)
 */
export function calculateStudentCI(
  studentRows: StudentCleanRecord[],
  itemPValueMap: Record<string, number>,
  sortOrder: 'asc' | 'desc' = 'desc',
): number {
  if (studentRows.length < 2) return 0;

  const sorted = [...studentRows].sort((a, b) => {
    const pa = itemPValueMap[a.item_id] ?? 0;
    const pb = itemPValueMap[b.item_id] ?? 0;
    return sortOrder === 'asc' ? pa - pb : pb - pa;
  });

  let inversions = 0;
  let pairs = 0;

  for (let i = 0; i < sorted.length; i += 1) {
    for (let j = i + 1; j < sorted.length; j += 1) {
      pairs += 1;
      const easyWrong = sorted[i].is_correct && !sorted[j].is_correct;
      if (easyWrong) inversions += 1;
    }
  }

  if (pairs === 0) return 0;
  return inversions / pairs;
}
