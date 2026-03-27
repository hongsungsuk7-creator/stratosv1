import * as XLSX from 'xlsx'
import type { CampusData, CampusRankingData } from '@/types'

function normalizeHeader(key: string): string {
  return key.replace(/\s+/g, '').toLowerCase()
}

function buildCellMap(row: Record<string, unknown>): Map<string, unknown> {
  const m = new Map<string, unknown>()
  for (const [k, v] of Object.entries(row)) {
    m.set(normalizeHeader(k), v)
  }
  return m
}

function getCell(m: Map<string, unknown>, aliases: string[]): unknown {
  for (const a of aliases) {
    const v = m.get(normalizeHeader(a))
    if (v !== undefined && v !== '') return v
  }
  return undefined
}

function num(v: unknown, fallback = 0): number {
  if (v === null || v === undefined || v === '') return fallback
  const n = typeof v === 'number' ? v : Number(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : fallback
}

function str(v: unknown, fallback = ''): string {
  if (v === null || v === undefined) return fallback
  return String(v).trim()
}

function parseRankingRow(m: Map<string, unknown>, index: number): CampusRankingData {
  const idRaw = getCell(m, ['id', '순번', 'no', 'no.', '번호'])
  const id = idRaw !== undefined && idRaw !== '' ? Math.round(num(idRaw)) : index + 1

  return {
    id,
    campus: str(getCell(m, ['campus', '캠퍼스', '캠퍼스명', '학원명'])),
    type: str(getCell(m, ['type', '운영유형', '유형', '운영주체'])),
    region: str(getCell(m, ['region', '지역', '지역권역', '권역'])),
    operationPeriod: num(getCell(m, ['operationPeriod', '운영기간', '개월', 'months'])),
    classes: Math.round(num(getCell(m, ['classes', '클래스수', '반수']))),
    students: Math.round(num(getCell(m, ['students', '학생수', '인원']))),
    avgPerClass: num(getCell(m, ['avgPerClass', '반당평균', '평균인원/반'])),
    scCv: (() => {
      const v = getCell(m, ['scCv', 'sccv', 'sc_cv'])
      return v === undefined || v === '' ? undefined : num(v)
    })(),
    pScore: num(getCell(m, ['pScore', 'pscore', 'p-score', 'p_score', 'P-Score'])),
    tpiGrade: str(getCell(m, ['tpiGrade', 'tpigrade', 'TPI등급', 'tpi등급'])),
    tpiScore: num(getCell(m, ['tpiScore', 'tpiscore', 'TPI점수', 'tpi점수'])),
    balanceCv: num(getCell(m, ['balanceCv', 'balancecv', 'Balance CV', '밸런스cv'])),
    zScore: num(getCell(m, ['zScore', 'zscore', 'Z-Score', 'z_score'])),
    confidenceCi: num(getCell(m, ['confidenceCi', 'confidenceci', 'CI', '신뢰구간', 'trustci'])),
    coreGrade: str(getCell(m, ['coreGrade', 'coregrade', '핵심등급', '핵심 등급'])),
    eliteZ: num(getCell(m, ['eliteZ', 'elitez', 'Elite Z', 'elite_z'])),
    eliteCv: num(getCell(m, ['eliteCv', 'elitecv', 'Elite CV', 'elite_cv'])),
    emiGrade: str(getCell(m, ['emiGrade', 'emigrade', 'EMI등급', 'emi등급'])),
  }
}

function parseSummaryRow(m: Map<string, unknown>, index: number): CampusData | null {
  const name = str(getCell(m, ['name', '캠퍼스', '캠퍼스명', 'campus']))
  if (!name) return null

  const statusRaw = str(getCell(m, ['status', '유형', '진단유형']))
  const statusSet = new Set(['상향 평준형', '성과 편중형', '하향 평준형', '관리 부재형'])
  const status = statusSet.has(statusRaw) ? (statusRaw as CampusData['status']) : '상향 평준형'

  const idRaw = str(getCell(m, ['id', '코드']), '')
  const id = idRaw || `C${String(index + 1).padStart(3, '0')}`

  return {
    id,
    name,
    pScore: num(getCell(m, ['pScore', 'pscore', 'P-Score'])),
    zScore: num(getCell(m, ['zScore', 'zscore'])),
    cv: num(getCell(m, ['cv', 'balanceCv', 'balancecv'])),
    eqs: num(getCell(m, ['eqs', 'EQS', 'tpiScore', 'tpiscore'])),
    ci: num(getCell(m, ['ci', 'confidenceCi', 'confidenceci'])),
    eliteDensity: Math.round(num(getCell(m, ['eliteDensity', '엘리트밀도', 'elite_density']))),
    status,
  }
}

function deriveCampusDataFromRanking(rows: CampusRankingData[]): CampusData[] {
  const gradeToStatus = (g: string): CampusData['status'] => {
    if (g === 'S' || g === 'A') return '상향 평준형'
    if (g === 'B') return '성과 편중형'
    if (g === 'C') return '하향 평준형'
    return '관리 부재형'
  }

  return rows.map((r) => ({
    id: `C${String(r.id).padStart(3, '0')}`,
    name: r.campus,
    pScore: r.pScore,
    zScore: r.zScore,
    cv: r.balanceCv,
    eqs: r.tpiScore,
    ci: r.confidenceCi,
    eliteDensity: Math.min(100, Math.max(0, Math.round(Math.abs(r.eliteZ) * 20))),
    status: gradeToStatus(r.coreGrade),
  }))
}

function findSheetName(sheetNames: string[], candidates: string[]): string | null {
  const lower = sheetNames.map((n) => n.toLowerCase().trim())
  for (const c of candidates) {
    const lc = c.toLowerCase()
    const i = lower.findIndex((n) => n === lc || n.includes(lc))
    if (i >= 0) return sheetNames[i]
  }
  return null
}

function sheetToRows(sheet: XLSX.WorkSheet): Record<string, unknown>[] {
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
}

export interface ParseStratosExcelResult {
  campusRanking: CampusRankingData[]
  campusSummary: CampusData[]
  sheetNames: string[]
  usedRankingSheet: string
  usedSummarySheet: string | null
}

/**
 * 기대 워크북 구조:
 * - 시트 `CampusRanking` (또는 이름에 "전국캠퍼스" / "ranking" 포함): 1행 헤더, 본문은 CampusRankingData 열과 매핑
 * - 선택 시트 `CampusSummary`: id, name, pScore, zScore, cv, eqs, ci, eliteDensity, status
 * CampusSummary가 없으면 랭킹 행에서 CampusData를 유도합니다.
 */
export function parseStratosExcel(buffer: ArrayBuffer): ParseStratosExcelResult {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetNames = workbook.SheetNames
  if (sheetNames.length === 0) {
    throw new Error('워크시트가 비어 있습니다.')
  }

  const rankingName =
    findSheetName(sheetNames, [
      'campusranking',
      'campus_ranking',
      'campus ranking',
      '전국캠퍼스',
      '전국 캠퍼스',
      'ranking',
      'performance',
    ]) ?? sheetNames[0]

  const rankingSheet = workbook.Sheets[rankingName]
  if (!rankingSheet) {
    throw new Error(`시트를 찾을 수 없습니다: ${rankingName}`)
  }

  const rawRows = sheetToRows(rankingSheet).filter((row) => {
    const m = buildCellMap(row)
    const campus = str(getCell(m, ['campus', '캠퍼스', '캠퍼스명']))
    return campus.length > 0
  })

  if (rawRows.length === 0) {
    throw new Error(`"${rankingName}" 시트에 유효한 데이터 행이 없습니다. (캠퍼스 열 필요)`)
  }

  const campusRanking = rawRows.map((row, index) => parseRankingRow(buildCellMap(row), index))

  const summaryName = findSheetName(sheetNames, [
    'campussummary',
    'campus_summary',
    'hq_campus',
    '캠퍼스요약',
    'campus',
  ])

  let campusSummary: CampusData[] = []
  let usedSummarySheet: string | null = null

  if (summaryName && summaryName !== rankingName) {
    const sh = workbook.Sheets[summaryName]
    if (sh) {
      const sumRows = sheetToRows(sh)
      campusSummary = sumRows
        .map((r, i) => parseSummaryRow(buildCellMap(r), i))
        .filter((x): x is CampusData => x !== null)
      if (campusSummary.length > 0) {
        usedSummarySheet = summaryName
      }
    }
  }

  if (campusSummary.length === 0) {
    campusSummary = deriveCampusDataFromRanking(campusRanking)
  }

  return {
    campusRanking,
    campusSummary,
    sheetNames,
    usedRankingSheet: rankingName,
    usedSummarySheet,
  }
}
