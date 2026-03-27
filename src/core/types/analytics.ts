export interface StudentRawRecord {
  student_id: string;
  campus_id: string;
  subject: string;
  score: number;
  is_correct: boolean;
  item_id: string;
  test_id: string;
}

export interface StudentCleanRecord extends StudentRawRecord {
  score: number;
  is_correct: boolean;
}

export interface AnalyticsConfig {
  ci: {
    gradeAPlusMax: number;
    gradeBMax: number;
    studentRiskThreshold: number;
    pValueSortOrder: 'asc' | 'desc';
  };
  pcRam: {
    zCutoff: number;
  };
  peqm: {
    eliteScoreThreshold: number;
    emi: {
      zHigh: number;
      zLow: number;
      eliteCvPerfectMax: number;
    };
  };
  tpi: {
    weights: {
      zp: number;
      zram: number;
      zeqm: number;
    };
    riskPenalty: number;
    riskBuckets: {
      ne4Min: number;
      ne5MaxExclusive: number;
    };
  };
  governance: {
    decimalPlaces: number;
    smallCampusExcludeThreshold: number;
  };
}

export interface CampusMetricsOutput {
  campus_id: string;
  metrics: {
    P_score: number;
    ZP: number;
    ZRAM: number;
    CI: number;
    CV: number;
    Elite_Z: number;
    Elite_CV: number;
    ED_ratio: number;
    NE1_ratio: number;
  };
  grades: {
    PC_RAM_grade: 'S' | 'A' | 'B' | 'C';
    EMI_grade: 'P' | 'G' | 'L' | 'U';
  };
  final: {
    TPI_score: number;
    rank: number;
    risk_flag: boolean;
  };
}

export interface StudentDrillDown {
  student_id: string;
  campus_id: string;
  pScore: number;
  zScore: number;
  ci: number;
  isElite: boolean;
  bucket: 'ED' | 'NE1' | 'NE2' | 'NE3' | 'NE4' | 'NE5';
}
