import type { ScoreDistributionInput } from '../types';

/**
 * Z-SCORE: 전국 대비 상대 위치
 * 공식: (score - mean) / std
 */
export function calculateZScore(input: ScoreDistributionInput): number {
  const { score, mean, std } = input;
  if (!Number.isFinite(score) || !Number.isFinite(mean) || !Number.isFinite(std) || std <= 0) {
    return 0;
  }
  return (score - mean) / std;
}
