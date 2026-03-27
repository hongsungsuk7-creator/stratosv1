import type { RiskLevel } from '../types';

/**
 * 룰 정의
 * - Z < -1.5 => 위험군
 * - Z < -0.5 => 주의군
 * - 그 외 => 정상군
 */
export function getRiskLevel(zScore: number): RiskLevel {
  if (zScore < -1.5) return '위험군';
  if (zScore < -0.5) return '주의군';
  return '정상군';
}
