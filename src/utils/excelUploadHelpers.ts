import * as XLSX from 'xlsx'

export type ThreePModuleKey = 'pcRam' | 'peqm' | 'pScore'

/** 파일명으로 3P 모듈 추정 (ESC-PC-RAM_..., ESC-PEQM_..., ESC-P-Score_... 등) */
export function detectThreePModule(fileName: string): ThreePModuleKey | 'unknown' {
  const n = fileName.toUpperCase().replace(/\s/g, '')
  if (n.includes('PC-RAM') || n.includes('PCRAM')) return 'pcRam'
  if (n.includes('PEQM')) return 'peqm'
  if (n.includes('P-SCORE') || n.includes('P_SCORE') || n.includes('PSCORE')) return 'pScore'
  return 'unknown'
}

export function buildThreePExamLabel(params: {
  year: number
  testKind: 'MT' | 'LT'
  month: number
  scopeType: 'all' | 'campus'
  campusName?: string
}): string {
  const mm = String(params.month).padStart(2, '0')
  const scope =
    params.scopeType === 'all' ? '전체캠퍼스_수강반전체' : `${(params.campusName ?? '').trim() || '캠퍼스'}_수강반전체`
  return `${params.year}.${mm}_${params.testKind}_${scope}`
}

export function buildResearchExamLabel(params: {
  year: number
  testKind: 'MT' | 'LT'
  month?: number
  note?: string
}): string {
  const m = params.month != null ? `${params.month}월` : '기간미지정'
  const tail = params.note?.trim() ? `_${params.note.trim()}` : ''
  return `${params.year}년_${params.testKind}_${m}_문항결과${tail}`
}

export async function parseResearchExcelFile(file: File): Promise<{
  fileName: string
  sheetNames: string[]
  rows: Record<string, unknown>[]
}> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  if (wb.SheetNames.length === 0) {
    throw new Error(`시트가 없습니다: ${file.name}`)
  }
  const first = wb.SheetNames[0]!
  const sheet = wb.Sheets[first]
  if (!sheet) throw new Error(`시트를 읽을 수 없습니다: ${file.name}`)
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  return { fileName: file.name, sheetNames: wb.SheetNames, rows }
}
