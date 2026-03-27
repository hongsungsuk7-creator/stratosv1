import { DEFAULT_ANALYTICS_CONFIG } from '../config/defaultAnalyticsConfig';
import { calculatePScore, calculateZScore } from '../calculations';
import type { AnalyticsConfig, StudentCleanRecord, StudentDrillDown } from '../types/analytics';
import { calculateStudentCI } from '../metrics/ci';
import { buildItemPValueMap } from '../metrics/pValue';
import { mean, std } from '../metrics/statHelpers';

function bucketByScore(score: number): StudentDrillDown['bucket'] {
  if (score >= 90) return 'ED';
  if (score >= 80) return 'NE1';
  if (score >= 70) return 'NE2';
  if (score >= 60) return 'NE3';
  if (score >= 50) return 'NE4';
  return 'NE5';
}

export function buildStudentDrillDown(
  cleanedRecords: StudentCleanRecord[],
  config: AnalyticsConfig = DEFAULT_ANALYTICS_CONFIG,
): StudentDrillDown[] {
  const rowsByStudent: Record<string, StudentCleanRecord[]> = {};
  for (const row of cleanedRecords) {
    if (!rowsByStudent[row.student_id]) rowsByStudent[row.student_id] = [];
    rowsByStudent[row.student_id].push(row);
  }

  const itemPValueMap = buildItemPValueMap(cleanedRecords);
  const pScores: number[] = [];

  const temp: Array<Omit<StudentDrillDown, 'zScore'>> = [];
  for (const [studentId, rows] of Object.entries(rowsByStudent)) {
    const correct = rows.filter((row) => row.is_correct).length;
    const total = rows.length;
    const pScore = calculatePScore({ correct, total });
    const ci = calculateStudentCI(rows, itemPValueMap, config.ci.pValueSortOrder);
    const avgScore = rows.reduce((acc, row) => acc + row.score, 0) / Math.max(1, rows.length);
    temp.push({
      student_id: studentId,
      campus_id: rows[0].campus_id,
      pScore,
      ci,
      isElite: avgScore >= config.peqm.eliteScoreThreshold,
      bucket: bucketByScore(avgScore),
    });
    pScores.push(pScore);
  }

  const campusStudentCount: Record<string, number> = {};
  for (const student of temp) {
    campusStudentCount[student.campus_id] = (campusStudentCount[student.campus_id] ?? 0) + 1;
  }
  const baselineScores = temp
    .filter((student) => (campusStudentCount[student.campus_id] ?? 0) > config.governance.smallCampusExcludeThreshold)
    .map((student) => student.pScore);
  const baseline = baselineScores.length > 1 ? baselineScores : pScores;
  const meanP = mean(baseline);
  const stdP = std(baseline);

  return temp.map((row) => ({
    ...row,
    zScore: calculateZScore({ score: row.pScore, mean: meanP, std: stdP || 1 }),
  }));
}
