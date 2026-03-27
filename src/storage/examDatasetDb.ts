import type { CampusData, CampusRankingData } from '@/types'

const DB_NAME = 'stratos-exam-data'
const DB_VERSION = 2
const STORE_META = 'datasetMeta'
const STORE_PAYLOAD = 'datasetPayload'

export type ExamTestKind = 'MT' | 'LT'

export type DatasetKind = '3P_OPERATION' | 'RESEARCH_ITEM'

/** 모듈별 파싱 결과 (3P 다중 파일) */
export interface ThreePModuleSlice {
  fileName: string
  campusRanking: CampusRankingData[]
  campusSummary: CampusData[]
  usedRankingSheet: string
  usedSummarySheet: string | null
  sheetNames: string[]
}

/** 목록·필터용 (IndexedDB meta 스토어) */
export interface ExamDatasetMeta {
  id: string
  year: number
  testKind: ExamTestKind
  examLabel: string
  /** 대표 파일명 또는 "파일1.xlsx 외 2건" */
  fileName: string
  createdAt: number
  usedRankingSheet: string
  usedSummarySheet: string | null
  sheetNames: string[]
  /** v2: 구분 (없으면 3P 단일로 간주) */
  datasetKind?: DatasetKind
  scopeType?: 'all' | 'campus'
  scopeCampusName?: string
  periodMonth?: number
  fileCount?: number
}

export interface ResearchFileSnapshot {
  fileName: string
  sheetNames: string[]
  rows: Record<string, unknown>[]
}

export interface ExamDatasetPayload {
  id: string
  campusRanking: CampusRankingData[]
  campusSummary: CampusData[]
  /** 3P: 모듈별 원본 */
  threePModules?: Partial<Record<'pcRam' | 'peqm' | 'pScore', ThreePModuleSlice>>
  /** 연구: 문항결과 등 시트 JSON */
  researchFiles?: ResearchFileSnapshot[]
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'))
    req.onsuccess = () => resolve(req.result)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_META)) {
        const meta = db.createObjectStore(STORE_META, { keyPath: 'id' })
        meta.createIndex('byYear', 'year', { unique: false })
        meta.createIndex('byCreated', 'createdAt', { unique: false })
      }
      if (!db.objectStoreNames.contains(STORE_PAYLOAD)) {
        db.createObjectStore(STORE_PAYLOAD, { keyPath: 'id' })
      }
    }
  })
}

export async function listExamDatasetMetas(): Promise<ExamDatasetMeta[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_META, 'readonly')
    const req = tx.objectStore(STORE_META).getAll()
    req.onsuccess = () => {
      const rows = (req.result ?? []) as ExamDatasetMeta[]
      rows.sort((a, b) => b.createdAt - a.createdAt)
      resolve(rows)
    }
    req.onerror = () => reject(req.error)
  })
}

export async function getExamDatasetPayload(id: string): Promise<ExamDatasetPayload | null> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PAYLOAD, 'readonly')
    const req = tx.objectStore(STORE_PAYLOAD).get(id)
    req.onsuccess = () => resolve((req.result as ExamDatasetPayload) ?? null)
    req.onerror = () => reject(req.error)
  })
}

export async function putExamDataset(meta: ExamDatasetMeta, payload: Omit<ExamDatasetPayload, 'id'>): Promise<void> {
  const db = await openDb()
  const fullPayload: ExamDatasetPayload = { id: meta.id, ...payload }
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_META, STORE_PAYLOAD], 'readwrite')
    tx.objectStore(STORE_META).put(meta)
    tx.objectStore(STORE_PAYLOAD).put(fullPayload)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function deleteExamDataset(id: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_META, STORE_PAYLOAD], 'readwrite')
    tx.objectStore(STORE_META).delete(id)
    tx.objectStore(STORE_PAYLOAD).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
