import type { CIInput } from '../types';

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance = values.reduce((acc, value) => {
    const diff = value - m;
    return acc + diff * diff;
  }, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * CI (Caution Index): 성적 안정성(변동성) 지표.
 * 본 구현은 표준편차 기반 정규화(CV 형태)로 계산합니다.
 */
export function calculateCI(input: CIInput): number {
  const { scores, stdDev: providedStdDev, mean: providedMean } = input;

  if (Array.isArray(scores) && scores.length > 0) {
    const m = mean(scores);
    if (m === 0) return 0;
    return stdDev(scores) / m;
  }

  if (
    Number.isFinite(providedStdDev) &&
    Number.isFinite(providedMean) &&
    providedMean !== 0
  ) {
    return (providedStdDev as number) / (providedMean as number);
  }

  return 0;
}
