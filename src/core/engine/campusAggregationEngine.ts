import { DEFAULT_ANALYTICS_CONFIG, TPI_PRESET_BY_MONTH, TPI_WEIGHT_PRESETS } from '../config/defaultAnalyticsConfig';
import type { AnalyticsConfig, CampusMetricsOutput, StudentCleanRecord } from '../types/analytics';
import { buildStudentDrillDown } from './kpiEngine';
import { coefficientOfVariation, mean } from '../metrics/statHelpers';

function round(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

function getCiGrade(ci: number, config: AnalyticsConfig): 'A+' | 'B' | 'C' {
  if (ci < config.ci.gradeAPlusMax) return 'A+';
  if (ci < config.ci.gradeBMax) return 'B';
  return 'C';
}

function getPcRamGrade(z: number, ci: number, config: AnalyticsConfig): 'S' | 'A' | 'B' | 'C' {
  const zPositive = z > config.pcRam.zCutoff;
  const ciGrade = getCiGrade(ci, config);
  if (zPositive && ciGrade === 'A+') return 'S';
  if (zPositive && ciGrade === 'B') return 'A';
  if (!zPositive && (ciGrade === 'A+' || ciGrade === 'B')) return 'B';
  return 'C';
}

function getEmiGrade(eliteZ: number, eliteCv: number, config: AnalyticsConfig): 'P' | 'G' | 'L' | 'U' {
  if (eliteZ >= config.peqm.emi.zHigh && eliteCv <= config.peqm.emi.eliteCvPerfectMax) return 'P';
  if (eliteZ >= config.peqm.emi.zHigh && eliteCv > config.peqm.emi.eliteCvPerfectMax) return 'U';
  if (eliteZ < config.peqm.emi.zLow) return 'L';
  return 'G';
}

function rankByTpi(campuses: CampusMetricsOutput[]): CampusMetricsOutput[] {
  const sorted = [...campuses].sort((a, b) => b.final.TPI_score - a.final.TPI_score);
  return sorted.map((campus, index) => ({
    ...campus,
    final: { ...campus.final, rank: index + 1 },
  }));
}

export function runCampusAggregation(
  records: StudentCleanRecord[],
  config: AnalyticsConfig = DEFAULT_ANALYTICS_CONFIG,
  options?: { examMonth?: number },
): CampusMetricsOutput[] {
  const students = buildStudentDrillDown(records, config);
  const presetKey =
    options?.examMonth && TPI_PRESET_BY_MONTH[options.examMonth]
      ? TPI_PRESET_BY_MONTH[options.examMonth]
      : 'standard';
  const weights = TPI_WEIGHT_PRESETS[presetKey];
  const byCampus: Record<string, typeof students> = {};
  for (const student of students) {
    if (!byCampus[student.campus_id]) byCampus[student.campus_id] = [];
    byCampus[student.campus_id].push(student);
  }

  const campusRows = Object.entries(byCampus).map(([campusId, campusStudents]) => {
    const pScores = campusStudents.map((row) => row.pScore);
    const zScores = campusStudents.map((row) => row.zScore);
    const ciScores = campusStudents.map((row) => row.ci);
    const elite = campusStudents.filter((row) => row.isElite);
    const eliteZ = elite.length ? mean(elite.map((row) => row.zScore)) : 0;
    const eliteCv = elite.length ? coefficientOfVariation(elite.map((row) => row.pScore)) : 0;

    const edCount = campusStudents.filter((row) => row.bucket === 'ED').length;
    const ne1Count = campusStudents.filter((row) => row.bucket === 'NE1').length;
    const ne4OrNe5 = campusStudents.some(
      (row) => row.bucket === 'NE4' || row.bucket === 'NE5',
    );

    const P_score = mean(pScores);
    const ZP = mean(zScores);
    const ZRAM = mean(zScores);
    const CI = median(ciScores);
    const CV = coefficientOfVariation(pScores);
    const ED_ratio = (edCount / Math.max(1, campusStudents.length)) * 100;
    const NE1_ratio = (ne1Count / Math.max(1, campusStudents.length)) * 100;

    const PC_RAM_grade = getPcRamGrade(ZRAM, CI, config);
    const ciRiskRatio =
      (campusStudents.filter((row) => row.ci > config.ci.studentRiskThreshold).length /
        Math.max(1, campusStudents.length)) *
      100;
    const EMI_grade = getEmiGrade(eliteZ, eliteCv, config);
    // TPI formula sync (3P-EQS): M1/M2/M3 weighted sum + NE penalty.
    const M1 = P_score; // P-Score module
    const M2 = P_score; // PC-RAM module score definition (avg_correct_rate × 100)
    const M3 = P_score; // PEQM module score definition (campus_avg MT total)
    let tpiScore = M1 * weights.w1 + M2 * weights.w2 + M3 * weights.w3;
    if (ne4OrNe5) tpiScore -= config.tpi.riskPenalty;

    const decimals = config.governance.decimalPlaces;
    return {
      campus_id: campusId,
      metrics: {
        P_score: round(P_score, decimals),
        ZP: round(ZP, decimals),
        ZRAM: round(ZRAM, decimals),
        CI: round(CI, decimals),
        CV: round(CV, decimals),
        Elite_Z: round(eliteZ, decimals),
        Elite_CV: round(eliteCv, decimals),
        ED_ratio: round(ED_ratio, decimals),
        NE1_ratio: round(NE1_ratio, decimals),
      },
      grades: {
        PC_RAM_grade,
        EMI_grade,
      },
      final: {
        TPI_score: round(tpiScore, decimals),
        rank: 0,
        risk_flag: ne4OrNe5 || ciRiskRatio >= 30,
      },
    } satisfies CampusMetricsOutput;
  });

  return rankByTpi(campusRows);
}
