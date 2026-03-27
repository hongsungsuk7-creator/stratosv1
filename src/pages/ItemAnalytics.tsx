import React, { useState } from 'react';
import { UI_FILTER_CONTROL_CLASS } from '../constants/uiClasses';
import { Search, RotateCcw, Download, Target, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { UserGroup } from '../types';
import { COURSES, COURSE_LEVEL_MAP, CAMPUS_LIST } from '../constants';

interface ItemAnalyticsProps {
  userGroup: UserGroup;
}

export function ItemAnalytics({ userGroup }: ItemAnalyticsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCampusDropdownOpen, setIsCampusDropdownOpen] = useState(false);
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  
  const [filters, setFilters] = useState({
    examYear: '2026',
    mtMonth: '03',
    course: 'MAG',
    level: 'MAG1',
    subject: 'Reading',
    testForm: 'A',
    testId: '',
    itemNo: '',
    pValueRange: 'All',
    discriminationRange: 'All',
    guessingRange: 'All',
    slipRange: 'All',
    itemQualityGrade: 'All'
  });

  const campusOptions = CAMPUS_LIST;

  const mockData = [
    { itemNo: 1, itemId: 'ITM-2603-R-001', testId: 'TST-2603-MAG1-RA', course: 'MAG', level: 'MAG1', subject: 'Reading', pValue: 0.85, discrimination: 0.45, guessing: 0.15, slip: 0.05, grade: 'A', examinees: 1250, correctRate: '82%', status: 'Active' },
    { itemNo: 2, itemId: 'ITM-2603-R-002', testId: 'TST-2603-MAG1-RA', course: 'MAG', level: 'MAG1', subject: 'Reading', pValue: 0.15, discrimination: 0.12, guessing: 0.25, slip: 0.10, grade: 'D', examinees: 1250, correctRate: '18%', status: 'Review' },
    { itemNo: 3, itemId: 'ITM-2603-R-003', testId: 'TST-2603-MAG1-RA', course: 'MAG', level: 'MAG1', subject: 'Reading', pValue: 0.65, discrimination: 0.55, guessing: 0.10, slip: 0.02, grade: 'A', examinees: 1250, correctRate: '68%', status: 'Active' },
    { itemNo: 4, itemId: 'ITM-2603-R-004', testId: 'TST-2603-MAG1-RA', course: 'MAG', level: 'MAG1', subject: 'Reading', pValue: 0.45, discrimination: 0.18, guessing: 0.20, slip: 0.08, grade: 'C', examinees: 1250, correctRate: '42%', status: 'Active' },
    { itemNo: 5, itemId: 'ITM-2603-R-005', testId: 'TST-2603-MAG1-RA', course: 'MAG', level: 'MAG1', subject: 'Reading', pValue: 0.92, discrimination: 0.25, guessing: 0.30, slip: 0.01, grade: 'C', examinees: 1250, correctRate: '95%', status: 'Review' },
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
      subject: 'Reading',
      testForm: 'A',
      testId: '',
      itemNo: '',
      pValueRange: 'All',
      discriminationRange: 'All',
      guessingRange: 'All',
      slipRange: 'All',
      itemQualityGrade: 'All'
    });
    setSelectedCampuses([]);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'B': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'D': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const isAbnormalDifficulty = (pValue: number) => pValue < 0.2 || pValue > 0.9;
  const isLowDiscrimination = (dValue: number) => dValue < 0.2;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Item Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">IRT 기반 시험 문항 품질 평가 및 문제 문항 식별</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 연도</label>
              <div className="relative">
                <select value={filters.examYear} onChange={(e) => handleFilterChange('examYear', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 회차 (MT)</label>
              <div className="relative">
                <select value={filters.mtMonth} onChange={(e) => handleFilterChange('mtMonth', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="03">03</option>
                  <option value="04">04</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">과정 (Course)</label>
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
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">레벨 (Level)</label>
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
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">과목</label>
              <div className="relative">
                <select value={filters.subject} onChange={(e) => handleFilterChange('subject', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="Reading">Reading</option>
                  <option value="Listening">Listening</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 Form</label>
              <div className="relative">
                <select value={filters.testForm} onChange={(e) => handleFilterChange('testForm', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="A">Form A</option>
                  <option value="B">Form B</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 ID</label>
              <input type="text" value={filters.testId} onChange={(e) => handleFilterChange('testId', e.target.value)} placeholder="Test ID" className={UI_FILTER_CONTROL_CLASS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">문항 번호</label>
              <input type="text" value={filters.itemNo} onChange={(e) => handleFilterChange('itemNo', e.target.value)} placeholder="Item No" className={UI_FILTER_CONTROL_CLASS} />
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">난이도 (P-value)</label>
              <div className="relative">
                <select value={filters.pValueRange} onChange={(e) => handleFilterChange('pValueRange', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="All">All</option>
                  <option value="High">High (&gt;0.8)</option>
                  <option value="Medium">Medium (0.3~0.8)</option>
                  <option value="Low">Low (&lt;0.3)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">변별도 (Discrimination)</label>
              <div className="relative">
                <select value={filters.discriminationRange} onChange={(e) => handleFilterChange('discriminationRange', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="All">All</option>
                  <option value="Good">Good (&gt;0.3)</option>
                  <option value="Poor">Poor (&lt;0.2)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">추측도 (Guessing)</label>
              <div className="relative">
                <select value={filters.guessingRange} onChange={(e) => handleFilterChange('guessingRange', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="All">All</option>
                  <option value="High">High (&gt;0.2)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">실수도 (Slip)</label>
              <div className="relative">
                <select value={filters.slipRange} onChange={(e) => handleFilterChange('slipRange', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="All">All</option>
                  <option value="High">High (&gt;0.1)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">문항 품질 등급</label>
              <div className="relative">
                <select value={filters.itemQualityGrade} onChange={(e) => handleFilterChange('itemQualityGrade', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="All">All</option>
                  <option value="A">A (Excellent)</option>
                  <option value="B">B (Good)</option>
                  <option value="C">C (Fair)</option>
                  <option value="D">D (Poor)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">캠퍼스</label>
              <div 
                className={`w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg py-2 px-3 h-[38px] flex items-center justify-between dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 ${userGroup === 'GROUP_HQ' ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                onClick={() => userGroup === 'GROUP_HQ' && setIsCampusDropdownOpen(!isCampusDropdownOpen)}
              >
                <span className="truncate">
                  {selectedCampuses.length === 0 ? '전체 캠퍼스' : `${selectedCampuses.length}개 선택됨`}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>
              
              {isCampusDropdownOpen && userGroup === 'GROUP_HQ' && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsCampusDropdownOpen(false)}
                  />
                  <div className="absolute z-20 w-64 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto left-0 dark:bg-slate-800 dark:border-slate-700">
                    <div className="p-2 sticky top-0 bg-white border-b border-slate-100 flex justify-between items-center z-10 dark:bg-slate-800 dark:border-slate-700">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500"
                          checked={selectedCampuses.length === campusOptions.length && campusOptions.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCampuses([...campusOptions]);
                            } else {
                              setSelectedCampuses([]);
                            }
                          }}
                        />
                        <span className="ml-2 text-sm font-semibold text-slate-800 dark:text-slate-200">전체 선택</span>
                      </label>
                      <button 
                        className="text-xs text-slate-400 hover:text-slate-600 font-medium dark:text-slate-500 dark:hover:text-slate-400"
                        onClick={() => setSelectedCampuses([])}
                      >
                        초기화
                      </button>
                    </div>
                    <div className="p-1">
                      {campusOptions.map(campus => (
                        <label key={campus} className="flex items-center px-2 py-2 hover:bg-slate-50 rounded cursor-pointer dark:hover:bg-slate-700/50">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500"
                            checked={selectedCampuses.includes(campus)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCampuses([...selectedCampuses, campus]);
                              } else {
                                setSelectedCampuses(selectedCampuses.filter(c => c !== campus));
                              }
                            }}
                          />
                          <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{campus}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end justify-end gap-2 mt-2">
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

      {/* Results Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
            <Target className="w-5 h-5 text-indigo-500 mr-2" />
            Item Analytics Results
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">Total: {mockData.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">문항 번호</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">문항 ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Test ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">과정</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">레벨</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">과목</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">P-value</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">변별도 (D)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">추측도 (c)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">실수도 (d)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">등급</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">응시자 수</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">정답률</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockData.map((row, idx) => {
                const abnormalDiff = isAbnormalDifficulty(row.pValue);
                const lowDiscrim = isLowDiscrimination(row.discrimination);
                
                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{row.itemNo}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.itemId}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.testId}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.course}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.level}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.subject}</td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center">
                        <span className={`${abnormalDiff ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                          {row.pValue.toFixed(2)}
                        </span>
                        {abnormalDiff && <AlertCircle className="w-3 h-3 text-red-500 ml-1" title="Abnormal Difficulty" />}
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center">
                        <span className={`${lowDiscrim ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                          {row.discrimination.toFixed(2)}
                        </span>
                        {lowDiscrim && <AlertCircle className="w-3 h-3 text-orange-500 ml-1" title="Low Discrimination" />}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.guessing.toFixed(2)}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.slip.toFixed(2)}</td>
                    <td className="p-4 text-sm text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getGradeColor(row.grade)}`}>
                        {row.grade}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300 text-right">{row.examinees.toLocaleString()}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300 text-right">{row.correctRate}</td>
                    <td className="p-4 text-sm text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        row.status === 'Active' 
                          ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
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
