import type { AnalyticsConfig } from '../types/analytics';

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
      zp: 0.3,
      zram: 0.4,
      zeqm: 0.3,
    },
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
