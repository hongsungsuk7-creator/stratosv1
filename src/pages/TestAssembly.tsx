import React, { useState } from 'react';
import { UI_FILTER_CONTROL_CLASS } from '../constants/uiClasses';
import { Search, RotateCcw, ChevronUp, ChevronDown, CheckSquare, Layers } from 'lucide-react';
import { UserGroup } from '../types';
import { COURSES, COURSE_LEVEL_MAP } from '../constants';

interface TestAssemblyProps {
  userGroup: UserGroup;
}

// Mock Data for the table
const mockItems = [
  { id: 'ITM-2023-001', skill: 'Reading', difficulty: 0.65, discrimination: 1.25, guessing: 0.15, status: 'Active', usageCount: 3 },
  { id: 'ITM-2023-002', skill: 'Listening', difficulty: 0.45, discrimination: 0.95, guessing: 0.20, status: 'Active', usageCount: 5 },
  { id: 'ITM-2023-003', skill: 'Grammar', difficulty: 0.82, discrimination: 1.50, guessing: 0.10, status: 'Draft', usageCount: 0 },
  { id: 'ITM-2023-004', skill: 'Vocabulary', difficulty: 0.55, discrimination: 1.10, guessing: 0.18, status: 'Active', usageCount: 2 },
  { id: 'ITM-2023-005', skill: 'Reading', difficulty: 0.30, discrimination: 0.80, guessing: 0.25, status: 'Archived', usageCount: 12 },
  { id: 'ITM-2023-006', skill: 'Listening', difficulty: 0.75, discrimination: 1.40, guessing: 0.12, status: 'Active', usageCount: 1 },
  { id: 'ITM-2023-007', skill: 'Grammar', difficulty: 0.50, discrimination: 1.05, guessing: 0.22, status: 'Active', usageCount: 4 },
  { id: 'ITM-2023-008', skill: 'Vocabulary', difficulty: 0.90, discrimination: 1.80, guessing: 0.05, status: 'Draft', usageCount: 0 },
];

export function TestAssembly({ userGroup: _userGroup }: TestAssemblyProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Filter States
  const [filters, setFilters] = useState({
    course: '',
    level: '',
    skill: '',
    diffMin: '',
    diffMax: '',
    discMin: '',
    discMax: '',
    guessMin: '',
    guessMax: '',
    status: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      course: '', level: '', skill: '', diffMin: '', diffMax: '', discMin: '', discMax: '', guessMin: '', guessMax: '', status: ''
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(mockItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-medium border border-emerald-200 dark:border-emerald-800">Active</span>;
      case 'Draft':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-medium border border-amber-200 dark:border-amber-800">Draft</span>;
      case 'Archived':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700">Archived</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">시험지 구성</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">문항 난이도와 변별도를 고려하여 시험 문항을 선택하고 시험지를 설계합니다.</p>
        </div>
        <div className="flex gap-2">
          <button 
            disabled={selectedItems.length === 0}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedItems.length > 0 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' 
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            <Layers className="w-4 h-4 mr-2" />
            선택 문항으로 시험지 생성 ({selectedItems.length})
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
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none dark:text-slate-500" />
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
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>

            {/* Skill */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Skill</label>
              <div className="relative">
                <select 
                  value={filters.skill} 
                  onChange={(e) => handleFilterChange('skill', e.target.value)} 
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="">전체</option>
                  <option value="Reading">Reading</option>
                  <option value="Listening">Listening</option>
                  <option value="Grammar">Grammar</option>
                  <option value="Vocabulary">Vocabulary</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>

            {/* Item Status */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Item 상태</label>
              <div className="relative">
                <select 
                  value={filters.status} 
                  onChange={(e) => handleFilterChange('status', e.target.value)} 
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="">전체</option>
                  <option value="Active">Active (활성)</option>
                  <option value="Draft">Draft (초안)</option>
                  <option value="Archived">Archived (보관)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>

            {/* Difficulty Range */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Difficulty 범위</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  step="0.01"
                  value={filters.diffMin} 
                  onChange={(e) => handleFilterChange('diffMin', e.target.value)} 
                  placeholder="Min" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
                <span className="text-slate-400">~</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={filters.diffMax} 
                  onChange={(e) => handleFilterChange('diffMax', e.target.value)} 
                  placeholder="Max" 
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
                  step="0.01"
                  value={filters.discMin} 
                  onChange={(e) => handleFilterChange('discMin', e.target.value)} 
                  placeholder="Min" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
                <span className="text-slate-400">~</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={filters.discMax} 
                  onChange={(e) => handleFilterChange('discMax', e.target.value)} 
                  placeholder="Max" 
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
                  step="0.01"
                  value={filters.guessMin} 
                  onChange={(e) => handleFilterChange('guessMin', e.target.value)} 
                  placeholder="Min" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
                <span className="text-slate-400">~</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={filters.guessMax} 
                  onChange={(e) => handleFilterChange('guessMax', e.target.value)} 
                  placeholder="Max" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-3 xl:col-span-1 flex items-end justify-end gap-2 mt-2">
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
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
            <CheckSquare className="w-5 h-5 text-indigo-500 mr-2" />
            문항 선택 목록 <span className="text-indigo-600 dark:text-indigo-400 text-sm ml-2">{mockItems.length}건 검색됨</span>
          </h2>
          {selectedItems.length > 0 && (
            <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
              {selectedItems.length}개 선택됨
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
                    checked={selectedItems.length === mockItems.length && mockItems.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">문항 ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">영역</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">난이도</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">변별도</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">추측도</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Item 상태</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">사용 횟수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockItems.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${selectedItems.includes(item.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}
                  onClick={() => handleSelectItem(item.id)}
                >
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </td>
                  <td className="p-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{item.id}</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">{item.skill}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap text-right font-mono">{item.difficulty.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap text-right font-mono">{item.discrimination.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap text-right font-mono">{item.guessing.toFixed(2)}</td>
                  <td className="p-4 text-sm text-center whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="p-4 text-sm text-slate-900 dark:text-white text-right font-mono whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs">
                      {item.usageCount}
                    </span>
                  </td>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of <span className="font-medium">45</span> results
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
