import type { AnalyticsConfig } from '../types/analytics';

/**
 * TPI (Total Performance Index) formula reference
 * Source: STRATOS_formulas_2026.03.26.html (§15.1~§15.4)
 *
 * Step 1) Module scores (0-100 scale)
 * - M1 (P-Score) = avg_correct_rate * 100
 * - M2 (PC-RAM)  = avg_correct_rate * 100
 * - M3 (PEQM)    = campus_avg (MT total score)
 *
 * Step 2) Weighted sum
 * - TPI_raw = M1*w1 + M2*w2 + M3*w3
 *
 * Step 3) NE penalty
 * - If NE4+NE5 >= 1 student, TPI = TPI_raw - 5.0
 * - Else, TPI = TPI_raw
 */
export const TPI_WEIGHT_PRESETS = {
  standard: { w1: 0.3, w2: 0.4, w3: 0.3 },
  adaptation: { w1: 0.25, w2: 0.35, w3: 0.4 },
  performance: { w1: 0.45, w2: 0.3, w3: 0.25 },
} as const;

export const TPI_PRESET_BY_MONTH: Record<number, keyof typeof TPI_WEIGHT_PRESETS> = {
  1: 'performance',
  2: 'standard',
  3: 'adaptation',
  4: 'adaptation',
  5: 'standard',
  6: 'performance',
  7: 'performance',
  8: 'standard',
  9: 'adaptation',
  10: 'adaptation',
  11: 'standard',
  12: 'performance',
};

export const TPI_GRADE_BANDS = [
  { minInclusive: 95, grade: 'Grand Master', meaning: '완전무결' },
  { minInclusive: 90, grade: 'Master', meaning: '미세 보완 필요' },
  { minInclusive: 80, grade: 'Standard', meaning: '평균 운영 수준' },
  { minInclusive: Number.NEGATIVE_INFINITY, grade: 'Intensive Care', meaning: '시스템 재구축 필요' },
] as const;

export const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = {
  ci: {
    gradeAPlusMax: 0.65,
    gradeBMax: 0.8,
    studentRiskThreshold: 0.5,
    pValueSortOrder: 'desc',
  },
  pcRam: {
    zCutoff: 0,
  },
  peqm: {
    eliteScoreThreshold: 80,
    emi: {
      zHigh: 1,
      zLow: -0.5,
      eliteCvPerfectMax: 5,
    },
  },
  tpi: {
    weights: {
      // Current default preset: standard
      zp: 0.3,
      zram: 0.4,
      zeqm: 0.3,
    },
    // Step 3 NE penalty
    riskPenalty: 5,
    riskBuckets: {
      ne4Min: 50,
      ne5MaxExclusive: 50,
    },
  },
  governance: {
    decimalPlaces: 3,
    smallCampusExcludeThreshold: 5,
  },
};
