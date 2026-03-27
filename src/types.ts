export type UserGroup = 'GROUP_HQ' | 'GROUP_CAMPUS' | 'GROUP_TEACHER';

export interface CampusData {
  id: string;
  name: string;
  pScore: number;
  zScore: number;
  cv: number;
  eqs: number;
  ci: number;
  eliteDensity: number;
  status: '상향 평준형' | '성과 편중형' | '하향 평준형' | '관리 부재형';
}

/** 전국 캠퍼스 랭킹 / Performance Matrix 공통 행 (엑셀 시트와 동일 구조) */
export interface CampusRankingData {
  id: number;
  campus: string;
  type: string;
  region: string;
  operationPeriod: number;
  classes: number;
  students: number;
  avgPerClass: number;
  scCv?: number;
  pScore: number;
  tpiGrade: string;
  tpiScore: number;
  balanceCv: number;
  zScore: number;
  confidenceCi: number;
  coreGrade: string;
  eliteZ: number;
  eliteCv: number;
  emiGrade: string;
}

// --- 5 Layer Data Architecture ---

// 1. Raw Data
export interface RawData {
  student_id: string;
  campus_id: string;
  class_id: string;
  test_id: string;
  item_id: string;
  answer: string;
  correct: boolean;
  score: number;
}

// 2. Item Metadata
export interface ItemMetadata {
  item_id: string;
  difficulty: number;
  discrimination: number;
  guessing: number;
  upper_limit: number;
  domain: string;
  skill: string;
}

// 3. Statistical Data
export interface StatisticalData {
  z_score: number;
  percentile: number;
  theta: number;
  ci: number;
  p_value: number;
}

// 4. Aggregated Data
export interface AggregatedData {
  campus_avg: number;
  class_avg: number;
  student_growth: number;
  domain_accuracy: number;
  skill_accuracy: number;
}

// 5. Insight Data
export interface InsightData {
  strength: string[];
  weakness: string[];
  risk: string[];
  recommendation: string[];
}
