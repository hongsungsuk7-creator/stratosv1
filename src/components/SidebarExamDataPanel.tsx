import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Upload, X, ChevronDown, ChevronUp, Trash2, CheckCircle2, FileSpreadsheet } from 'lucide-react'
import { useExcelData, type RegisterResearchBundleInput, type RegisterThreePBundleInput } from '@/context/ExcelDataContext'

interface SidebarExamDataPanelProps {
  isCollapsed: boolean
}

const YEARS = [2026, 2025, 2024, 2023, 2022]
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export function SidebarExamDataPanel({ isCollapsed }: SidebarExamDataPanelProps) {
  const {
    savedDatasets,
    activeDataset,
    parseError,
    registerThreePBundle,
    registerResearchBundle,
    selectExamDataset,
    deleteExamDataset,
    clearToSampleData,
  } = useExcelData()

  const [modalOpen, setModalOpen] = useState(false)
  const [listOpen, setListOpen] = useState(true)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  /* 사이드바 보조 액션 — Sidebar.tsx 튜토리얼 버튼과 동일 톤 */
  const panelBtnClass = `w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2 px-3'} py-2 rounded-lg transition-colors text-sm bg-slate-200/80 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300`

  const listSection = (
    <>
      <button
        type="button"
        onClick={() => setListOpen(!listOpen)}
        className="w-full flex items-center justify-between px-2 py-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <span>등록된 자료 ({savedDatasets.length})</span>
        {listOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {listOpen && (
        <ul className="max-h-40 overflow-y-auto space-y-1 pr-0.5 hide-scrollbar">
          {savedDatasets.length === 0 && (
            <li className="text-[11px] text-slate-500 dark:text-slate-500 px-1">브라우저에 저장된 자료가 없습니다.</li>
          )}
          {savedDatasets.map((d) => {
            const active = activeDataset?.id === d.id
            const tag =
              d.datasetKind === 'RESEARCH_ITEM' ? (
                <span className="text-[10px] px-1 rounded bg-amber-900/60 text-amber-200 mr-1">RS</span>
              ) : (
                <span className="text-[10px] px-1 rounded bg-indigo-900/60 text-indigo-200 mr-1">3P</span>
              )
            return (
              <li
                key={d.id}
                className={`rounded-md border text-[11px] leading-tight ${
                  active
                    ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/40'
                    : 'border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start gap-1 p-1.5">
                  <button
                    type="button"
                    className="flex-1 text-left text-slate-700 hover:text-slate-900 min-w-0 dark:text-slate-200 dark:hover:text-white"
                    onClick={() => selectExamDataset(d.id)}
                  >
                    {active && <CheckCircle2 className="w-3 h-3 inline text-indigo-400 mr-0.5 align-middle" />}
                    {tag}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-300">{d.year}</span>{' '}
                    <span className="text-slate-500 dark:text-slate-400">{d.testKind}</span>
                    <span className="block text-slate-600 dark:text-slate-300 truncate" title={d.examLabel}>
                      {d.examLabel}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="p-1 text-slate-400 hover:text-rose-500 shrink-0 dark:text-slate-500 dark:hover:text-rose-400"
                    title="삭제"
                    onClick={() => {
                      if (window.confirm(`이 자료를 삭제할까요?\n${d.examLabel}`)) {
                        void deleteExamDataset(d.id)
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {activeDataset && (
        <button
          type="button"
          onClick={clearToSampleData}
          className="w-full text-[11px] text-slate-500 hover:text-slate-800 py-1 dark:hover:text-slate-300"
        >
          샘플 데이터로 보기
        </button>
      )}
    </>
  )

  if (isCollapsed) {
    return (
      <>
        <button type="button" onClick={openModal} className={panelBtnClass} title="엑셀 자료 업로드">
          <Upload className="w-5 h-5 shrink-0" />
        </button>
        {modalOpen && <ExcelUploadModal onClose={closeModal} registerThreePBundle={registerThreePBundle} registerResearchBundle={registerResearchBundle} parseError={parseError} />}
      </>
    )
  }

  return (
    <>
      <div className="space-y-2">
        <button type="button" onClick={openModal} className={panelBtnClass}>
          <Upload className="w-5 h-5 shrink-0" />
          <span className="font-medium whitespace-nowrap">엑셀 자료 업로드</span>
        </button>
        {listSection}
      </div>
      {modalOpen && <ExcelUploadModal onClose={closeModal} registerThreePBundle={registerThreePBundle} registerResearchBundle={registerResearchBundle} parseError={parseError} />}
    </>
  )
}

type TabId = '3p' | 'research'

function ExcelUploadModal({
  onClose,
  registerThreePBundle,
  registerResearchBundle,
  parseError,
}: {
  onClose: () => void
  registerThreePBundle: (input: RegisterThreePBundleInput) => Promise<boolean>
  registerResearchBundle: (input: RegisterResearchBundleInput) => Promise<boolean>
  parseError: string | null
}) {
  const [tab, setTab] = useState<TabId>('3p')
  const [year, setYear] = useState(2025)
  const [testKind, setTestKind] = useState<'MT' | 'LT'>('MT')
  const [month, setMonth] = useState(3)
  const [scopeType, setScopeType] = useState<'all' | 'campus'>('all')
  const [campusName, setCampusName] = useState('')
  const [researchMonth, setResearchMonth] = useState<number | ''>('')
  const [researchNote, setResearchNote] = useState('')
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [localHint, setLocalHint] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const addFiles = useCallback((list: FileList | File[]) => {
    const arr = Array.from(list).filter((f) => /\.(xlsx|xls)$/i.test(f.name))
    if (arr.length === 0) {
      setLocalHint('.xlsx / .xls 파일만 추가됩니다.')
      return
    }
    setLocalHint(null)
    setPendingFiles((prev) => {
      const next = [...prev]
      const names = new Set(next.map((f) => f.name))
      for (const f of arr) {
        if (!names.has(f.name)) {
          next.push(f)
          names.add(f.name)
        }
      }
      return next
    })
  }, [])

  const removeFile = (idx: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  const handleSubmit = async () => {
    setLocalHint(null)
    if (pendingFiles.length === 0) {
      setLocalHint('파일을 드래그하거나 선택해 주세요.')
      return
    }
    setBusy(true)
    try {
      if (tab === '3p') {
        const ok = await registerThreePBundle({
          year,
          testKind,
          month,
          scopeType,
          campusName: scopeType === 'campus' ? campusName : undefined,
          files: pendingFiles,
        })
        if (ok) {
          setPendingFiles([])
          onClose()
        }
      } else {
        const ok = await registerResearchBundle({
          year,
          testKind,
          month: researchMonth === '' ? undefined : Number(researchMonth),
          note: researchNote,
          files: pendingFiles,
        })
        if (ok) {
          setPendingFiles([])
          onClose()
        }
      }
    } finally {
      setBusy(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="presentation" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700 relative z-[201]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="excel-upload-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h3 id="excel-upload-title" className="text-sm font-semibold text-slate-900 dark:text-white">
            엑셀 자료 업로드
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => setTab('3p')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              tab === '3p'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            A. 3P 운영 분석 (HQ / 캠퍼스)
          </button>
          <button
            type="button"
            onClick={() => setTab('research')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              tab === 'research'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            B. Research System (문항)
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm overflow-y-auto flex-1 min-h-0">
          {tab === '3p' ? (
            <>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PC-RAM / PEQM / P-Score 파일명이 포함된 엑셀을 한꺼번에 올리면 모듈별로 나누어 저장합니다. (예: ESC-PC-RAM_…, ESC-PEQM_…, ESC-P-Score_…)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">연도</span>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm text-slate-900 dark:text-white"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}년
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">시험 월</span>
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm text-slate-900 dark:text-white"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}월
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">시험 구분</span>
                <div className="flex gap-2">
                  {(['MT', 'LT'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setTestKind(k)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${
                        testKind === k
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">분석 범위</span>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 cursor-pointer">
                    <input type="radio" checked={scopeType === 'all'} onChange={() => setScopeType('all')} className="rounded-full border-slate-400 text-indigo-600" />
                    전체 캠퍼스 · 수강반 전체
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 cursor-pointer">
                    <input type="radio" checked={scopeType === 'campus'} onChange={() => setScopeType('campus')} className="rounded-full border-slate-400 text-indigo-600" />
                    특정 캠퍼스 1곳
                  </label>
                  {scopeType === 'campus' && (
                    <input
                      value={campusName}
                      onChange={(e) => setCampusName(e.target.value)}
                      placeholder="예: 목동캠퍼스"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm"
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                문항결과 등 연구용 엑셀을 여러 개 한꺼번에 등록합니다. 각 파일의 첫 번째 시트를 읽어 저장합니다.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">연도</span>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}년
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">기준 월 (선택)</span>
                  <select
                    value={researchMonth === '' ? '' : researchMonth}
                    onChange={(e) => setResearchMonth(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm"
                  >
                    <option value="">미지정</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}월
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">시험 구분</span>
                <div className="flex gap-2">
                  {(['MT', 'LT'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setTestKind(k)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${
                        testKind === k
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">메모 (라벨에 포함, 선택)</span>
                <input
                  value={researchNote}
                  onChange={(e) => setResearchNote(e.target.value)}
                  placeholder="예: GT2_추가"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm"
                />
              </label>
            </>
          )}

          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">파일 (복수 선택 · 드래그 앤 드롭)</span>
            <input ref={inputRef} type="file" accept=".xlsx,.xls" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
            <div
              onDragEnter={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'copy'
              }}
              onDrop={onDrop}
              className={`rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                dragOver ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40' : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50'
              }`}
            >
              <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">여기로 파일을 놓거나 아래에서 선택하세요.</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                파일 선택 (복수)
              </button>
            </div>
            {pendingFiles.length > 0 && (
              <ul className="max-h-32 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-600 divide-y divide-slate-200 dark:divide-slate-600 text-xs">
                {pendingFiles.map((f, idx) => (
                  <li key={`${f.name}-${idx}`} className="flex items-center justify-between gap-2 px-2 py-1.5 text-slate-700 dark:text-slate-200">
                    <span className="truncate" title={f.name}>
                      {f.name}
                    </span>
                    <button type="button" onClick={() => removeFile(idx)} className="text-rose-500 shrink-0 p-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {(localHint || parseError) && <p className="text-xs text-red-600 dark:text-red-400">{localHint || parseError}</p>}
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t border-slate-200 dark:border-slate-700 shrink-0">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            취소
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleSubmit()}
            className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {busy ? '처리 중…' : '등록 및 불러오기'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
