import React, { useState } from 'react';
import { UI_FILTER_CONTROL_CLASS } from '../constants/uiClasses';
import { Search, RotateCcw, Download, Info, BarChart2, ArrowRight, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { UserGroup } from '../types';
import { COURSES, COURSE_LEVEL_MAP } from '../constants';

interface DifficultyStandardizationProps {
  userGroup: UserGroup;
}

export function DifficultyStandardization({ userGroup: _userGroup }: DifficultyStandardizationProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState({
    examYear: '2026',
    mtMonth: '03',
    course: 'MAG',
    level: 'MAG1',
    testId: ''
  });

  const mockData = [
    { test: '2026-03', meanDiff: -0.15, adjDiff: -0.10, avgTheta: 0.05, stdTheta: 0.95 },
    { test: '2026-04', meanDiff: 0.22, adjDiff: 0.05, avgTheta: 0.02, stdTheta: 0.91 },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      examYear: '2026',
      mtMonth: '03',
      course: 'MAG',
      level: 'MAG1',
      testId: ''
    });
  };

  const formatNumber = (num: number) => {
    const formatted = num.toFixed(2);
    return num > 0 ? `+${formatted}` : formatted;
  };

  const getColorClass = (num: number) => {
    if (num > 0) return 'text-blue-600 dark:text-blue-400';
    if (num < 0) return 'text-red-600 dark:text-red-400';
    return 'text-slate-600 dark:text-slate-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Test Equating (시험 난이도 보정)</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">시험 난이도 표준화</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Purpose Visualization Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30 p-6 flex flex-col md:flex-row items-center justify-center gap-8 shadow-sm">
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-3">
            <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-white mb-1">시험 난이도 변동 보정</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">월별/회차별로 달라지는 시험의 난이도 차이를 통계적으로 보정합니다.</p>
        </div>
        
        <div className="flex items-center text-emerald-500 dark:text-emerald-400 hidden md:flex">
          <ArrowRight className="w-6 h-6" />
        </div>

        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mb-3">
            <BarChart2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-white mb-1">학생 능력 비교 가능</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">보정된 난이도를 통해 서로 다른 시험을 치른 학생들의 능력을 객관적으로 비교합니다.</p>
        </div>
      </div>

      {/* Search Area */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
        <div className={`flex items-center ${isExpanded ? 'mb-4' : ''}`}>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm font-semibold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none w-full text-left"
          >
            <Search className="w-5 h-5 text-indigo-500 mr-2" />
            검색 조건
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 ml-2 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 ml-2 text-slate-400" />
            )}
          </button>
        </div>
        
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 연도</label>
              <div className="relative">
                <select 
                  value={filters.examYear}
                  onChange={(e) => handleFilterChange('examYear', e.target.value)}
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 월</label>
              <div className="relative">
                <select 
                  value={filters.mtMonth}
                  onChange={(e) => handleFilterChange('mtMonth', e.target.value)}
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">과정</label>
              <div className="relative">
                <select value={filters.course} onChange={(e) => handleFilterChange('course', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="">전체</option>
                  {COURSES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">레벨</label>
              <div className="relative">
                <select value={filters.level} onChange={(e) => handleFilterChange('level', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="">전체</option>
                  {filters.course && COURSE_LEVEL_MAP[filters.course] ? (
                    COURSE_LEVEL_MAP[filters.course].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))
                  ) : (
                    <option value="" disabled>과정을 먼저 선택하세요</option>
                  )}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 ID</label>
              <input 
                type="text"
                value={filters.testId}
                onChange={(e) => handleFilterChange('testId', e.target.value)}
                placeholder="Test ID 입력"
                className={UI_FILTER_CONTROL_CLASS}
              />
            </div>
            
            <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-5 flex items-end justify-end gap-2 mt-2">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors">
                <Search className="w-4 h-4 mr-2" />
                분석
              </button>
              <button 
                onClick={handleReset}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium flex items-center transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                초기화
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
            <Info className="w-5 h-5 text-indigo-500 mr-2" />
            Equated Test Results
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">Total: {mockData.length} tests</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">시험</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">평균 난이도</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">보정 난이도</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">평균 능력치 (Theta)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">능력치 표준편차</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{row.test}</td>
                  <td className="p-4 text-sm">
                    <span className={getColorClass(row.meanDiff)}>{formatNumber(row.meanDiff)}</span>
                  </td>
                  <td className="p-4 text-sm font-medium">
                    <span className={getColorClass(row.adjDiff)}>{formatNumber(row.adjDiff)}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{formatNumber(row.avgTheta)}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.stdTheta.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of <span className="font-medium">245</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 bg-indigo-50 dark:bg-indigo-900/30 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
