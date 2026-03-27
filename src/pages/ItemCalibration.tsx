import React, { useState } from 'react';
import { UI_FILTER_CONTROL_CLASS } from '../constants/uiClasses';
import { Search, RotateCcw, Download, Info, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { UserGroup } from '../types';
import { COURSES, COURSE_LEVEL_MAP } from '../constants';

interface ItemCalibrationProps {
  userGroup: UserGroup;
}

export function ItemCalibration({ userGroup: _userGroup }: ItemCalibrationProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState({
    year: '2024',
    month: '3',
    course: 'MAG',
    level: 'MAG1',
    testId: '',
    form: 'A',
    itemNo: '',
    minExaminees: '100',
    irtModel: '3PL'
  });

  const mockData = [
    { item: 'Q01', a: 1.45, b: -0.6, c: 0.21, d: 0.95, se: 0.03, pValue: 0.78, status: '정상' },
    { item: 'Q02', a: 0.38, b: 1.2, c: 0.19, d: 0.92, se: 0.05, pValue: 0.35, status: '낮은 변별' },
    { item: 'Q03', a: 1.88, b: 0.4, c: 0.22, d: 0.97, se: 0.02, pValue: 0.61, status: '우수' },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      year: '2024',
      month: '3',
      course: 'MAG',
      level: 'MAG1',
      testId: '',
      form: 'A',
      itemNo: '',
      minExaminees: '100',
      irtModel: '3PL'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '정상':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3 h-3 mr-1" />정상</span>;
      case '낮은 변별':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><AlertCircle className="w-3 h-3 mr-1" />낮은 변별</span>;
      case '우수':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"><CheckCircle2 className="w-3 h-3 mr-1" />우수</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Item Calibration (문항 보정)</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">문항 파라미터 추정 (a: 변별도, b: 난이도, c: 추측도, d: 상위점근선)</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 연도</label>
              <div className="relative">
                <select 
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 월(MT 회차)</label>
              <div className="relative">
                <select 
                  value={filters.month}
                  onChange={(e) => handleFilterChange('month', e.target.value)}
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="3">3월 (MT1)</option>
                  <option value="6">6월 (MT2)</option>
                  <option value="9">9월 (MT3)</option>
                  <option value="12">12월 (MT4)</option>
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
                placeholder="시험지 코드 입력"
                className={UI_FILTER_CONTROL_CLASS}
              />
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 Form</label>
              <div className="relative">
                <select 
                  value={filters.form}
                  onChange={(e) => handleFilterChange('form', e.target.value)}
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">문항 번호</label>
              <input 
                type="text"
                value={filters.itemNo}
                onChange={(e) => handleFilterChange('itemNo', e.target.value)}
                placeholder="특정 문항 조회"
                className={UI_FILTER_CONTROL_CLASS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">최소 응시자 수</label>
              <input 
                type="number"
                value={filters.minExaminees}
                onChange={(e) => handleFilterChange('minExaminees', e.target.value)}
                placeholder="100"
                className={UI_FILTER_CONTROL_CLASS}
              />
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">IRT Model</label>
              <div className="relative">
                <select 
                  value={filters.irtModel}
                  onChange={(e) => handleFilterChange('irtModel', e.target.value)}
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="1PL">1PL</option>
                  <option value="2PL">2PL</option>
                  <option value="3PL">3PL</option>
                  <option value="4PL">4PL</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-1 flex items-end justify-end gap-2 mt-2 xl:mt-0">
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
            Calibration Results
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">Total: {mockData.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">문항 번호</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">변별도 (a)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">난이도 (b)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">추측도 (c)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">상위점근선 (d)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">표준오차</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">P-value</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{row.item}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.a.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.b.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.c.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.d.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.se.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.pValue.toFixed(2)}</td>
                  <td className="p-4 text-sm">{getStatusBadge(row.status)}</td>
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
