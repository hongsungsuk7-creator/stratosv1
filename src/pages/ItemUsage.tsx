import React, { useState } from 'react';
import { UI_FILTER_CONTROL_CLASS } from '../constants/uiClasses';
import { Search, RotateCcw, ChevronUp, ChevronDown, Download, History } from 'lucide-react';
import { UserGroup } from '../types';
import { COURSES, COURSE_LEVEL_MAP, CAMPUS_LIST } from '../constants';

interface ItemUsageProps {
  userGroup: UserGroup;
}

// Mock Data for the table
const mockUsageHistory = [
  { itemId: 'ITM-2023-001', testId: 'TST-2603-MAG3', year: '2026', mt: 'MT1', course: 'MAG', level: 'L3', campus: 'All', usageCount: 3, lastUsed: '2026-03-15' },
  { itemId: 'ITM-2023-002', testId: 'TST-2603-GT4', year: '2026', mt: 'MT1', course: 'GT', level: 'L4', campus: 'All', usageCount: 5, lastUsed: '2026-03-15' },
  { itemId: 'ITM-2023-003', testId: 'TST-2512-ECP5', year: '2025', mt: 'MT4', course: 'ECP', level: 'L5', campus: 'Seoul', usageCount: 2, lastUsed: '2025-12-10' },
  { itemId: 'ITM-2023-001', testId: 'TST-2509-MAG3', year: '2025', mt: 'MT3', course: 'MAG', level: 'L3', campus: 'All', usageCount: 3, lastUsed: '2025-09-20' },
  { itemId: 'ITM-2023-005', testId: 'TST-2603-GT4', year: '2026', mt: 'MT1', course: 'GT', level: 'L4', campus: 'All', usageCount: 1, lastUsed: '2026-03-15' },
  { itemId: 'ITM-2023-006', testId: 'TST-2506-ECP2', year: '2025', mt: 'MT2', course: 'ECP', level: 'L2', campus: 'Busan', usageCount: 4, lastUsed: '2025-06-18' },
  { itemId: 'ITM-2023-007', testId: 'TST-2603-MAG4', year: '2026', mt: 'MT1', course: 'MAG', level: 'L4', campus: 'All', usageCount: 2, lastUsed: '2026-03-15' },
  { itemId: 'ITM-2023-001', testId: 'TST-2412-MAG3', year: '2024', mt: 'MT4', course: 'MAG', level: 'L3', campus: 'All', usageCount: 3, lastUsed: '2024-12-05' },
];

export function ItemUsage({ userGroup: _userGroup }: ItemUsageProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter States
  const [filters, setFilters] = useState({
    itemId: '',
    testId: '',
    year: '',
    mt: '',
    course: '',
    level: '',
    campus: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      itemId: '', testId: '', year: '', mt: '', course: '', level: '', campus: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">문항 사용 기록</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">문항이 어떤 시험에서 사용되었는지 사용 이력을 관리하고 조회합니다.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Item ID */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">문항 ID</label>
              <input 
                type="text" 
                value={filters.itemId} 
                onChange={(e) => handleFilterChange('itemId', e.target.value)} 
                placeholder="e.g. ITM-2023..." 
                className={UI_FILTER_CONTROL_CLASS} 
              />
            </div>

            {/* Test ID */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 ID</label>
              <input 
                type="text" 
                value={filters.testId} 
                onChange={(e) => handleFilterChange('testId', e.target.value)} 
                placeholder="e.g. TST-2603..." 
                className={UI_FILTER_CONTROL_CLASS} 
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 연도</label>
              <div className="relative">
                <select 
                  value={filters.year} 
                  onChange={(e) => handleFilterChange('year', e.target.value)} 
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="">전체</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>

            {/* MT */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 회차 (MT)</label>
              <div className="relative">
                <select 
                  value={filters.mt} 
                  onChange={(e) => handleFilterChange('mt', e.target.value)} 
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="">전체</option>
                  <option value="MT1">MT1</option>
                  <option value="MT2">MT2</option>
                  <option value="MT3">MT3</option>
                  <option value="MT4">MT4</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>

            {/* Course */}
            <div>
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

            {/* Level */}
            <div>
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

            {/* Campus */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">캠퍼스</label>
              <div className="relative">
                <select 
                  value={filters.campus} 
                  onChange={(e) => handleFilterChange('campus', e.target.value)} 
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="">전체 (All)</option>
                  {CAMPUS_LIST.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-1 flex items-end justify-end gap-2 mt-2">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors">
                <Search className="w-4 h-4 mr-2" />
                검색
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

      {/* Result Table Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
            <History className="w-5 h-5 text-indigo-500 mr-2" />
            사용 이력 <span className="text-indigo-600 dark:text-indigo-400 text-sm ml-2">{mockUsageHistory.length}건</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">문항 ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Test ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">시험 연도</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">시험 회차</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">과정</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">레벨</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">캠퍼스</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">사용 횟수</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">마지막 사용일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockUsageHistory.map((history, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <td className="p-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{history.itemId}</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap font-mono">{history.testId}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap text-center">{history.year}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap text-center">{history.mt}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap text-center">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">{history.course}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap text-center">{history.level}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      history.campus === 'All' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {history.campus}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-900 dark:text-white text-right font-mono whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                      {history.usageCount}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap text-right">{history.lastUsed}</td>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of <span className="font-medium">156</span> results
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
