import type { CampusMetricsOutput } from '../types/analytics';

export interface PerformanceMatrixPoint {
  campus_id: string;
  x: number;
  y: number;
  grade: string;
  risk: boolean;
}

export function toPerformanceMatrix(
  rows: CampusMetricsOutput[],
  xMetric: 'P_score' | 'ZP' | 'ZRAM' = 'ZRAM',
  yMetric: 'CV' | 'CI' = 'CI',
): PerformanceMatrixPoint[] {
  return rows.map((row) => ({
    campus_id: row.campus_id,
    x: row.metrics[xMetric],
    y: row.metrics[yMetric],
    grade: row.grades.PC_RAM_grade,
    risk: row.final.risk_flag,
  }));
}

export function toRankingTable(rows: CampusMetricsOutput[]): CampusMetricsOutput[] {
  return [...rows].sort((a, b) => a.final.rank - b.final.rank);
}

export function toRiskAlerts(rows: CampusMetricsOutput[]) {
  return rows.filter((row) => row.final.risk_flag).map((row) => ({
    campus_id: row.campus_id,
    message: `Risk alert: ${row.campus_id} has NE4/NE5 students`,
    tpi: row.final.TPI_score,
  }));
}

export function toEliteDensity(rows: CampusMetricsOutput[]) {
  return rows.map((row) => ({
    campus_id: row.campus_id,
    ed_ratio: row.metrics.ED_ratio,
    ne1_ratio: row.metrics.NE1_ratio,
    elite_total_ratio: row.metrics.ED_ratio + row.metrics.NE1_ratio,
  }));
}
