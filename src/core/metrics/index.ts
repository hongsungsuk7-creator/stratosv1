import { calculateCI, calculatePScore, calculateZScore } from '../calculations';
import { getRiskLevel } from '../rules';
import type { CIInput, PScoreInput, RiskLevel, ScoreDistributionInput } from '../types';

export interface StudentMetricBundleInput {
  pScore: PScoreInput;
  zScore: ScoreDistributionInput;
  ci: CIInput;
}

export interface StudentMetricBundle {
  pScore: number;
  zScore: number;
  ci: number;
  riskLevel: RiskLevel;
}

/**
 * 화면/스토어에서 바로 쓸 수 있도록 핵심 지표를 한 번에 계산합니다.
 */
export function buildStudentMetrics(input: StudentMetricBundleInput): StudentMetricBundle {
  const pScore = calculatePScore(input.pScore);
  const zScore = calculateZScore(input.zScore);
  const ci = calculateCI(input.ci);
  const riskLevel = getRiskLevel(zScore);

  return { pScore, zScore, ci, riskLevel };
}
