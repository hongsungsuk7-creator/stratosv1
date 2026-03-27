import React, { useState } from 'react';
import { UI_FILTER_CONTROL_CLASS } from '../constants/uiClasses';
import { Search, RotateCcw, ChevronUp, ChevronDown, Download, BarChart2 } from 'lucide-react';
import { UserGroup } from '../types';
import { COURSES, COURSE_LEVEL_MAP } from '../constants';

interface ItemPerformanceProps {
  userGroup: UserGroup;
}

// Mock Data for the table
const mockItems = [
  { id: 'ITM-2023-001', skill: 'Reading', course: 'MAG', level: 'L3', pValue: 0.85, disc: 1.24, guess: 0.15, slip: 0.05, grade: 'A', examinees: 1250, avgScore: 85.4 },
  { id: 'ITM-2023-002', skill: 'Grammar', course: 'GT', level: 'L4', pValue: 0.45, disc: 0.95, guess: 0.20, slip: 0.12, grade: 'C', examinees: 980, avgScore: 45.2 },
  { id: 'ITM-2023-003', skill: 'Vocabulary', course: 'ECP', level: 'L5', pValue: 0.65, disc: 1.45, guess: 0.18, slip: 0.08, grade: 'B', examinees: 850, avgScore: 65.8 },
  { id: 'ITM-2023-004', skill: 'Listening', course: 'MAG', level: 'L3', pValue: 0.25, disc: 0.45, guess: 0.25, slip: 0.15, grade: 'D', examinees: 1250, avgScore: 25.4 },
  { id: 'ITM-2023-005', skill: 'Reading', course: 'GT', level: 'L4', pValue: 0.72, disc: 1.10, guess: 0.10, slip: 0.06, grade: 'A', examinees: 980, avgScore: 72.1 },
  { id: 'ITM-2023-006', skill: 'Grammar', course: 'ECP', level: 'L2', pValue: 0.88, disc: 0.85, guess: 0.22, slip: 0.04, grade: 'B', examinees: 1100, avgScore: 88.5 },
  { id: 'ITM-2023-007', skill: 'Vocabulary', course: 'MAG', level: 'L4', pValue: 0.55, disc: 1.30, guess: 0.19, slip: 0.09, grade: 'B', examinees: 1250, avgScore: 55.0 },
  { id: 'ITM-2023-008', skill: 'Listening', course: 'GT', level: 'L5', pValue: 0.35, disc: 0.65, guess: 0.15, slip: 0.18, grade: 'C', examinees: 980, avgScore: 35.5 },
];

export function ItemPerformance({ userGroup: _userGroup }: ItemPerformanceProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter States
  const [filters, setFilters] = useState({
    year: '',
    mt: '',
    course: '',
    level: '',
    itemId: '',
    skill: '',
    pValMin: '',
    pValMax: '',
    discMin: '',
    discMax: '',
    guessMin: '',
    guessMax: '',
    slipMin: '',
    slipMax: '',
    grade: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      year: '', mt: '', course: '', level: '', itemId: '', skill: '',
      pValMin: '', pValMax: '', discMin: '', discMax: '',
      guessMin: '', guessMax: '', slipMin: '', slipMax: '', grade: ''
    });
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">A (우수)</span>;
      case 'B':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">B (양호)</span>;
      case 'C':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">C (보통)</span>;
      case 'D':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">D (주의)</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">{grade}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">문항 성능 분석</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">실제 시험 결과를 기반으로 문항의 통계적 성능을 분석합니다.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Year & MT */}
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

            {/* Course & Level */}
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

            {/* Item ID & Skill */}
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
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Skill 영역</label>
              <div className="relative">
                <select 
                  value={filters.skill} 
                  onChange={(e) => handleFilterChange('skill', e.target.value)} 
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="">전체</option>
                  <option value="Reading">Reading</option>
                  <option value="Grammar">Grammar</option>
                  <option value="Vocabulary">Vocabulary</option>
                  <option value="Listening">Listening</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>

            {/* P-value Range */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">P-value 범위</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  value={filters.pValMin} 
                  onChange={(e) => handleFilterChange('pValMin', e.target.value)} 
                  placeholder="Min" 
                  step="0.01" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
                <span className="text-slate-400">~</span>
                <input 
                  type="number" 
                  value={filters.pValMax} 
                  onChange={(e) => handleFilterChange('pValMax', e.target.value)} 
                  placeholder="Max" 
                  step="0.01" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
              </div>
            </div>

            {/* Discrimination Range */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Discrimination 범위</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  value={filters.discMin} 
                  onChange={(e) => handleFilterChange('discMin', e.target.value)} 
                  placeholder="Min" 
                  step="0.1" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
                <span className="text-slate-400">~</span>
                <input 
                  type="number" 
                  value={filters.discMax} 
                  onChange={(e) => handleFilterChange('discMax', e.target.value)} 
                  placeholder="Max" 
                  step="0.1" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
              </div>
            </div>

            {/* Guessing Range */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Guessing 범위</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  value={filters.guessMin} 
                  onChange={(e) => handleFilterChange('guessMin', e.target.value)} 
                  placeholder="Min" 
                  step="0.01" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
                <span className="text-slate-400">~</span>
                <input 
                  type="number" 
                  value={filters.guessMax} 
                  onChange={(e) => handleFilterChange('guessMax', e.target.value)} 
                  placeholder="Max" 
                  step="0.01" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
              </div>
            </div>

            {/* Slip Range */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Slip 범위</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  value={filters.slipMin} 
                  onChange={(e) => handleFilterChange('slipMin', e.target.value)} 
                  placeholder="Min" 
                  step="0.01" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
                <span className="text-slate-400">~</span>
                <input 
                  type="number" 
                  value={filters.slipMax} 
                  onChange={(e) => handleFilterChange('slipMax', e.target.value)} 
                  placeholder="Max" 
                  step="0.01" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
              </div>
            </div>

            {/* Quality Grade */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">문항 품질 등급</label>
              <div className="relative">
                <select 
                  value={filters.grade} 
                  onChange={(e) => handleFilterChange('grade', e.target.value)} 
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="">전체</option>
                  <option value="A">A (우수)</option>
                  <option value="B">B (양호)</option>
                  <option value="C">C (보통)</option>
                  <option value="D">D (주의)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-1 flex items-end justify-end gap-2 mt-2">
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
            <BarChart2 className="w-5 h-5 text-indigo-500 mr-2" />
            문항 분석 결과 <span className="text-indigo-600 dark:text-indigo-400 text-sm ml-2">{mockItems.length}건</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">문항 ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skill</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">과정</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">레벨</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">P-value</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">변별도</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">추측도</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Slip (실수)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">품질 등급</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">응시자 수</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">평균 점수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <td className="p-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{item.id}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.skill}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">{item.course}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.level}</td>
                  <td className="p-4 text-sm text-slate-900 dark:text-white text-right font-mono whitespace-nowrap">{item.pValue.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-900 dark:text-white text-right font-mono whitespace-nowrap">{item.disc.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-900 dark:text-white text-right font-mono whitespace-nowrap">{item.guess.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-900 dark:text-white text-right font-mono whitespace-nowrap">{item.slip.toFixed(2)}</td>
                  <td className="p-4 text-center whitespace-nowrap">
                    {getGradeBadge(item.grade)}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 text-right font-mono whitespace-nowrap">{item.examinees.toLocaleString()}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 text-right font-mono whitespace-nowrap">{item.avgScore.toFixed(1)}</td>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of <span className="font-medium">1,245</span> results
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
