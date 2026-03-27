import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { CampusData, CampusRankingData } from '@/types'
import { parseStratosExcel } from '@/utils/excelParser'
import {
  type ExamDatasetMeta,
  type ExamDatasetPayload,
  type ResearchFileSnapshot,
  type ThreePModuleSlice,
  deleteExamDataset as dbDelete,
  getExamDatasetPayload,
  listExamDatasetMetas,
  putExamDataset,
} from '@/storage/examDatasetDb'
import {
  buildResearchExamLabel,
  buildThreePExamLabel,
  detectThreePModule,
  parseResearchExcelFile,
  type ThreePModuleKey,
} from '@/utils/excelUploadHelpers'

const LAST_ACTIVE_KEY = 'stratos-active-exam-dataset-id'

export interface RegisterThreePBundleInput {
  year: number
  testKind: 'MT' | 'LT'
  month: number
  scopeType: 'all' | 'campus'
  campusName?: string
  files: File[]
}

export interface RegisterResearchBundleInput {
  year: number
  testKind: 'MT' | 'LT'
  month?: number
  note?: string
  files: File[]
}

export interface ExcelDataContextValue {
  fileName: string | null
  parseError: string | null
  campusRankingData: CampusRankingData[] | null
  campusSummaryData: CampusData[] | null
  lastMeta: { usedRankingSheet: string; usedSummarySheet: string | null; sheetNames: string[] } | null
  /** 연구·문항결과 등록 시 시트 JSON (RS 화면 확장용) */
  researchItemData: ResearchFileSnapshot[] | null
  threePModuleData: ExamDatasetPayload['threePModules'] | null
  savedDatasets: ExamDatasetMeta[]
  activeDataset: ExamDatasetMeta | null
  isSampleMode: boolean
  registerThreePBundle: (input: RegisterThreePBundleInput) => Promise<boolean>
  registerResearchBundle: (input: RegisterResearchBundleInput) => Promise<boolean>
  selectExamDataset: (id: string) => Promise<void>
  deleteExamDataset: (id: string) => Promise<void>
  refreshSavedDatasets: () => Promise<void>
  clearToSampleData: () => void
  tryActivateByFilters: (year: number, testKind: string, examLabel: string) => Promise<boolean>
}

const ExcelDataContext = createContext<ExcelDataContextValue | null>(null)

function pickUnifiedRanking(payload: ExamDatasetPayload): CampusRankingData[] {
  const m = payload.threePModules
  if (m?.pScore?.campusRanking?.length) return m.pScore.campusRanking
  if (m?.peqm?.campusRanking?.length) return m.peqm.campusRanking
  if (m?.pcRam?.campusRanking?.length) return m.pcRam.campusRanking
  return payload.campusRanking
}

function pickUnifiedSummary(payload: ExamDatasetPayload): CampusData[] {
  const m = payload.threePModules
  if (m?.pScore?.campusSummary?.length) return m.pScore.campusSummary
  if (m?.peqm?.campusSummary?.length) return m.peqm.campusSummary
  if (m?.pcRam?.campusSummary?.length) return m.pcRam.campusSummary
  return payload.campusSummary
}

function mergeSheetNames(payload: ExamDatasetPayload): string[] {
  const set = new Set<string>()
  if (payload.threePModules) {
    Object.values(payload.threePModules).forEach((s) => {
      s?.sheetNames.forEach((n) => set.add(n))
    })
  }
  if (payload.researchFiles?.length) {
    payload.researchFiles.forEach((r) => r.sheetNames.forEach((n) => set.add(n)))
  }
  return [...set]
}

function formatFileSummary(files: File[]): string {
  if (files.length === 0) return ''
  if (files.length === 1) return files[0]!.name
  return `${files[0]!.name} 외 ${files.length - 1}건`
}

export function ExcelDataProvider({ children }: { children: React.ReactNode }) {
  const [savedDatasets, setSavedDatasets] = useState<ExamDatasetMeta[]>([])
  const [activeDataset, setActiveDataset] = useState<ExamDatasetMeta | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [campusRankingData, setCampusRankingData] = useState<CampusRankingData[] | null>(null)
  const [campusSummaryData, setCampusSummaryData] = useState<CampusData[] | null>(null)
  const [lastMeta, setLastMeta] = useState<ExcelDataContextValue['lastMeta']>(null)
  const [researchItemData, setResearchItemData] = useState<ResearchFileSnapshot[] | null>(null)
  const [threePModuleData, setThreePModuleData] = useState<ExamDatasetPayload['threePModules'] | null>(null)

  const applyPayload = useCallback((meta: ExamDatasetMeta, payload: ExamDatasetPayload) => {
    setActiveDataset(meta)
    setFileName(meta.fileName)
    setThreePModuleData(payload.threePModules ?? null)
    setResearchItemData(payload.researchFiles?.length ? payload.researchFiles : null)

    const ranking = pickUnifiedRanking(payload)
    const summary = pickUnifiedSummary(payload)
    const kind = meta.datasetKind ?? '3P_OPERATION'

    if (kind === 'RESEARCH_ITEM') {
      setCampusRankingData(null)
      setCampusSummaryData(null)
      setLastMeta({
        usedRankingSheet: meta.usedRankingSheet,
        usedSummarySheet: meta.usedSummarySheet,
        sheetNames: mergeSheetNames(payload),
      })
    } else {
      setCampusRankingData(ranking.length ? ranking : null)
      setCampusSummaryData(summary.length ? summary : null)
      setLastMeta({
        usedRankingSheet: meta.usedRankingSheet,
        usedSummarySheet: meta.usedSummarySheet,
        sheetNames: mergeSheetNames(payload),
      })
    }

    setParseError(null)
    try {
      localStorage.setItem(LAST_ACTIVE_KEY, meta.id)
    } catch {
      /* ignore */
    }
  }, [])

  const clearMemoryToSample = useCallback(() => {
    setActiveDataset(null)
    setFileName(null)
    setCampusRankingData(null)
    setCampusSummaryData(null)
    setLastMeta(null)
    setResearchItemData(null)
    setThreePModuleData(null)
    setParseError(null)
    try {
      localStorage.removeItem(LAST_ACTIVE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const refreshSavedDatasets = useCallback(async () => {
    const list = await listExamDatasetMetas()
    setSavedDatasets(list)
  }, [])

  const selectExamDataset = useCallback(
    async (id: string) => {
      setParseError(null)
      const meta = savedDatasets.find((d) => d.id === id)
      const load = async (m: ExamDatasetMeta) => {
        const payload = await getExamDatasetPayload(id)
        if (!payload) {
          setParseError('데이터 본문을 불러오지 못했습니다.')
          return
        }
        applyPayload(m, payload)
      }

      if (!meta) {
        const list = await listExamDatasetMetas()
        setSavedDatasets(list)
        const m = list.find((d) => d.id === id)
        if (!m) {
          setParseError('저장된 시험 자료를 찾을 수 없습니다.')
          return
        }
        await load(m)
        return
      }
      await load(meta)
    },
    [savedDatasets, applyPayload],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const list = await listExamDatasetMetas()
        if (cancelled) return
        setSavedDatasets(list)
        const lastId = localStorage.getItem(LAST_ACTIVE_KEY)
        if (lastId) {
          const meta = list.find((d) => d.id === lastId)
          if (meta) {
            const payload = await getExamDatasetPayload(lastId)
            if (!cancelled && payload) {
              applyPayload(meta, payload)
            }
          }
        }
      } catch {
        if (!cancelled) setParseError('로컬 저장소(IndexedDB)를 열 수 없습니다.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [applyPayload])

  const registerThreePBundle = useCallback(
    async (input: RegisterThreePBundleInput): Promise<boolean> => {
      setParseError(null)
      if (input.files.length === 0) {
        setParseError('엑셀 파일을 1개 이상 추가해 주세요.')
        return false
      }
      if (input.scopeType === 'campus' && !(input.campusName ?? '').trim()) {
        setParseError('특정 캠퍼스명을 입력해 주세요.')
        return false
      }

      try {
        const slots: Partial<Record<ThreePModuleKey, ThreePModuleSlice>> = {}
        const unknown: string[] = []
        const duplicate: string[] = []

        for (const file of input.files) {
          const mod = detectThreePModule(file.name)
          if (mod === 'unknown') {
            unknown.push(file.name)
            continue
          }
          if (slots[mod]) {
            duplicate.push(file.name)
            continue
          }
          const buf = await file.arrayBuffer()
          const result = parseStratosExcel(buf)
          slots[mod] = {
            fileName: file.name,
            campusRanking: result.campusRanking,
            campusSummary: result.campusSummary,
            usedRankingSheet: result.usedRankingSheet,
            usedSummarySheet: result.usedSummarySheet,
            sheetNames: result.sheetNames,
          }
        }

        if (Object.keys(slots).length === 0) {
          setParseError(
            `PC-RAM / PEQM / P-Score 가 파일명에서 식별되지 않았습니다. 미인식: ${unknown.join(', ') || '(없음)'}`,
          )
          return false
        }

        const warnParts: string[] = []
        if (unknown.length) warnParts.push(`식별 불가(건너뜀): ${unknown.join(', ')}`)
        if (duplicate.length) warnParts.push(`동일 모듈 중복(건너뜀): ${duplicate.join(', ')}`)
        if (!slots.pScore || !slots.peqm || !slots.pcRam) {
          warnParts.push('일부 모듈만 등록되었습니다. 누락 시 화면은 업로드된 모듈 기준으로 표시됩니다.')
        }
        if (warnParts.length) {
          console.warn('[STRATOS 3P 업로드]', warnParts.join(' | '))
        }

        const examLabel = buildThreePExamLabel({
          year: input.year,
          testKind: input.testKind,
          month: input.month,
          scopeType: input.scopeType,
          campusName: input.campusName,
        })

        const id = crypto.randomUUID()
        const createdAt = Date.now()
        const primary = slots.pScore ?? slots.peqm ?? slots.pcRam
        const meta: ExamDatasetMeta = {
          id,
          year: input.year,
          testKind: input.testKind,
          examLabel,
          fileName: formatFileSummary(input.files),
          createdAt,
          usedRankingSheet: primary?.usedRankingSheet ?? '',
          usedSummarySheet: primary?.usedSummarySheet ?? null,
          sheetNames: primary?.sheetNames ?? [],
          datasetKind: '3P_OPERATION',
          scopeType: input.scopeType,
          scopeCampusName: input.scopeType === 'campus' ? input.campusName?.trim() : undefined,
          periodMonth: input.month,
          fileCount: input.files.length,
        }

        const ranking = pickUnifiedRanking({
          id,
          campusRanking: [],
          campusSummary: [],
          threePModules: slots,
        })
        const summary = pickUnifiedSummary({
          id,
          campusRanking: [],
          campusSummary: [],
          threePModules: slots,
        })

        const payload: ExamDatasetPayload = {
          id,
          campusRanking: ranking,
          campusSummary: summary,
          threePModules: slots,
        }

        await putExamDataset(meta, payload)
        await refreshSavedDatasets()
        applyPayload(meta, payload)
        return true
      } catch (e) {
        setParseError(e instanceof Error ? e.message : String(e))
        return false
      }
    },
    [applyPayload, refreshSavedDatasets],
  )

  const registerResearchBundle = useCallback(
    async (input: RegisterResearchBundleInput): Promise<boolean> => {
      setParseError(null)
      if (input.files.length === 0) {
        setParseError('엑셀 파일을 1개 이상 추가해 주세요.')
        return false
      }
      try {
        const researchFiles: ResearchFileSnapshot[] = []
        for (const f of input.files) {
          researchFiles.push(await parseResearchExcelFile(f))
        }

        const examLabel = buildResearchExamLabel({
          year: input.year,
          testKind: input.testKind,
          month: input.month,
          note: input.note,
        })

        const id = crypto.randomUUID()
        const createdAt = Date.now()
        const meta: ExamDatasetMeta = {
          id,
          year: input.year,
          testKind: input.testKind,
          examLabel,
          fileName: formatFileSummary(input.files),
          createdAt,
          usedRankingSheet: researchFiles[0]?.sheetNames[0] ?? '',
          usedSummarySheet: null,
          sheetNames: researchFiles.flatMap((r) => r.sheetNames),
          datasetKind: 'RESEARCH_ITEM',
          fileCount: input.files.length,
        }

        const payload: ExamDatasetPayload = {
          id,
          campusRanking: [],
          campusSummary: [],
          researchFiles,
        }

        await putExamDataset(meta, payload)
        await refreshSavedDatasets()
        applyPayload(meta, payload)
        return true
      } catch (e) {
        setParseError(e instanceof Error ? e.message : String(e))
        return false
      }
    },
    [applyPayload, refreshSavedDatasets],
  )

  const deleteExamDataset = useCallback(
    async (id: string) => {
      await dbDelete(id)
      await refreshSavedDatasets()
      if (activeDataset?.id === id) {
        clearMemoryToSample()
      }
      if (localStorage.getItem(LAST_ACTIVE_KEY) === id) {
        localStorage.removeItem(LAST_ACTIVE_KEY)
      }
    },
    [activeDataset?.id, refreshSavedDatasets, clearMemoryToSample],
  )

  const clearToSampleData = useCallback(() => {
    clearMemoryToSample()
  }, [clearMemoryToSample])

  const tryActivateByFilters = useCallback(
    async (year: number, testKind: string, examLabel: string) => {
      const kind = testKind === 'LT' ? 'LT' : 'MT'
      const label = examLabel.trim()
      const list = savedDatasets.length ? savedDatasets : await listExamDatasetMetas()
      if (!savedDatasets.length) setSavedDatasets(list)
      const hit = list.find((d) => d.year === year && d.testKind === kind && d.examLabel === label)
      if (!hit) return false
      await selectExamDataset(hit.id)
      return true
    },
    [savedDatasets, selectExamDataset],
  )

  const isSampleMode = !activeDataset

  const value = useMemo<ExcelDataContextValue>(
    () => ({
      fileName,
      parseError,
      campusRankingData,
      campusSummaryData,
      lastMeta,
      researchItemData,
      threePModuleData,
      savedDatasets,
      activeDataset,
      isSampleMode,
      registerThreePBundle,
      registerResearchBundle,
      selectExamDataset,
      deleteExamDataset,
      refreshSavedDatasets,
      clearToSampleData,
      tryActivateByFilters,
    }),
    [
      fileName,
      parseError,
      campusRankingData,
      campusSummaryData,
      lastMeta,
      researchItemData,
      threePModuleData,
      savedDatasets,
      activeDataset,
      isSampleMode,
      registerThreePBundle,
      registerResearchBundle,
      selectExamDataset,
      deleteExamDataset,
      refreshSavedDatasets,
      clearToSampleData,
      tryActivateByFilters,
    ],
  )

  return <ExcelDataContext.Provider value={value}>{children}</ExcelDataContext.Provider>
}

const noopContext: ExcelDataContextValue = {
  fileName: null,
  parseError: null,
  campusRankingData: null,
  campusSummaryData: null,
  lastMeta: null,
  researchItemData: null,
  threePModuleData: null,
  savedDatasets: [],
  activeDataset: null,
  isSampleMode: true,
  registerThreePBundle: async () => false,
  registerResearchBundle: async () => false,
  selectExamDataset: async () => {},
  deleteExamDataset: async () => {},
  refreshSavedDatasets: async () => {},
  clearToSampleData: () => {},
  tryActivateByFilters: async () => false,
}

// eslint-disable-next-line react-refresh/only-export-components -- context hook, not a UI component
export function useExcelData(): ExcelDataContextValue {
  return useContext(ExcelDataContext) ?? noopContext
}
