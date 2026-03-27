import React, { useState } from 'react';
import { UI_FILTER_CONTROL_CLASS } from '../constants/uiClasses';
import { Search, RotateCcw, Download, Info, ArrowRight, Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { UserGroup } from '../types';
import { COURSES, COURSE_LEVEL_MAP } from '../constants';

interface ScaleLinkingProps {
  userGroup: UserGroup;
}

export function ScaleLinking({ userGroup: _userGroup }: ScaleLinkingProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState({
    baseTest: '2026-03',
    targetTest: '2026-04',
    course: 'MAG',
    level: 'MAG1',
    method: 'Stocking-Lord'
  });

  const mockData = [
    { baseTest: '2026-03', targetTest: '2026-04', constantA: 1.03, constantB: -0.12, anchorCount: 15 },
    { baseTest: '2026-04', targetTest: '2026-05', constantA: 0.98, constantB: 0.08, anchorCount: 12 },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      baseTest: '2026-03',
      targetTest: '2026-04',
      course: 'MAG',
      level: 'MAG1',
      method: 'Stocking-Lord'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Scale Linking (척도 연계)</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">시험 난이도 및 능력척도 연결</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Purpose Visualization Card */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30 p-6 flex flex-col md:flex-row items-center justify-center gap-8 shadow-sm">
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Base Test</span>
          <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200">
            2026-03 MT
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center text-indigo-500 dark:text-indigo-400">
            <div className="h-px w-8 bg-indigo-300 dark:bg-indigo-600"></div>
            <LinkIcon className="w-5 h-5 mx-2" />
            <ArrowRight className="w-5 h-5" />
            <div className="h-px w-8 bg-indigo-300 dark:bg-indigo-600"></div>
          </div>
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-2 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded-full">
            능력척도 연결
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Target Test</span>
          <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200">
            2026-04 MT
          </div>
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
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Base Test (기준 시험)</label>
              <div className="relative">
                <select 
                  value={filters.baseTest}
                  onChange={(e) => handleFilterChange('baseTest', e.target.value)}
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="2026-03">2026-03</option>
                  <option value="2026-04">2026-04</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Target Test (비교 시험)</label>
              <div className="relative">
                <select 
                  value={filters.targetTest}
                  onChange={(e) => handleFilterChange('targetTest', e.target.value)}
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="2026-04">2026-04</option>
                  <option value="2026-05">2026-05</option>
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
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Linking Method</label>
              <div className="relative">
                <select 
                  value={filters.method}
                  onChange={(e) => handleFilterChange('method', e.target.value)}
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="Mean-Mean">Mean-Mean</option>
                  <option value="Stocking-Lord">Stocking-Lord</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
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
            Linking Results
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">Total: {mockData.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">기준 시험</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">비교 시험</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Linking Constant A</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Linking Constant B</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Anchor Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{row.baseTest}</td>
                  <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{row.targetTest}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.constantA.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                    <span className={row.constantB > 0 ? 'text-blue-600 dark:text-blue-400' : row.constantB < 0 ? 'text-red-600 dark:text-red-400' : ''}>
                      {row.constantB > 0 ? '+' : ''}{row.constantB.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.anchorCount}</td>
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
