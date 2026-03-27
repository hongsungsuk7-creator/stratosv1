import React from 'react';
import { UserGroup } from '../types';
import { Users, Building, GraduationCap, Sun, Moon, FileSpreadsheet } from 'lucide-react';
import { useExcelData } from '@/context/ExcelDataContext';

interface HeaderProps {
  userGroup: UserGroup;
  setUserGroup: (group: UserGroup) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export function Header({ userGroup, setUserGroup, isDarkMode, setIsDarkMode }: HeaderProps) {
  const { activeDataset, isSampleMode, parseError } = useExcelData();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 min-h-12 flex flex-wrap items-center justify-between gap-2 py-1.5 px-6 transition-colors duration-200">
      <div className="flex items-center gap-2 min-w-0 flex-1 text-xs text-slate-600 dark:text-slate-300">
        <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
        {isSampleMode ? (
          <span className="text-slate-400 dark:text-slate-500">활성 데이터: 내장 샘플 (사이드바에서 시험 자료를 등록하세요)</span>
        ) : activeDataset ? (
          <span className="truncate" title={`${activeDataset.examLabel} · ${activeDataset.fileName}`}>
            <span className="mr-1.5 text-[10px] font-semibold px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {activeDataset.datasetKind === 'RESEARCH_ITEM' ? 'RS' : '3P'}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{activeDataset.year}년</span>
            <span className="mx-1 text-slate-400">·</span>
            <span>{activeDataset.testKind}</span>
            <span className="mx-1 text-slate-400">·</span>
            <span>{activeDataset.examLabel}</span>
          </span>
        ) : null}
        {parseError && (
          <span className="text-red-600 dark:text-red-400 truncate max-w-[240px] ml-2" title={parseError}>
            {parseError}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-4 shrink-0">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">권한 시뮬레이션:</span>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setUserGroup('GROUP_HQ')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              userGroup === 'GROUP_HQ' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>본부</span>
          </button>
          <button
            onClick={() => setUserGroup('GROUP_CAMPUS')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              userGroup === 'GROUP_CAMPUS' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>캠퍼스</span>
          </button>
          <button
            onClick={() => setUserGroup('GROUP_TEACHER')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              userGroup === 'GROUP_TEACHER' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>강사</span>
          </button>
        </div>
      </div>
    </header>
  );
}
