import type { PScoreInput } from '../types';

/**
 * P-SCORE: 정답률 기반 성취도
 * 공식: correct / total * 100
 */
export function calculatePScore(input: PScoreInput): number {
  const { correct, total } = input;
  if (!Number.isFinite(correct) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }
  return (correct / total) * 100;
}
