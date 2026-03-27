export type RiskLevel = '위험군' | '주의군' | '정상군';

export interface ScoreDistributionInput {
  score: number;
  mean: number;
  std: number;
}

export interface PScoreInput {
  correct: number;
  total: number;
}

export interface CIInput {
  /**
   * 학생 점수 분포(표준편차 계산용). 전달 시 stdDev보다 우선 적용됩니다.
   */
  scores?: number[];
  /**
   * 이미 계산된 표준편차를 직접 전달할 때 사용합니다.
   */
  stdDev?: number;
  /**
   * 평균 점수. stdDev 기반 CI 계산에 사용됩니다.
   */
  mean?: number;
}

export * from './analytics';
