import React, { useState } from 'react';
import { UI_FILTER_CONTROL_CLASS } from '../constants/uiClasses';
import { Search, RotateCcw, ChevronUp, ChevronDown, Download, Plus } from 'lucide-react';
import { UserGroup } from '../types';
import { COURSES, COURSE_LEVEL_MAP } from '../constants';

interface ItemRepositoryProps {
  userGroup: UserGroup;
}

// Mock Data for the table
const mockItems = [
  { id: 'ITM-2023-001', skill: 'Reading', topic: 'Main Idea', course: 'MAG', level: 'L3', diff: 0.85, disc: 1.24, guess: 0.15, type: '객관식', status: 'Active', date: '2023-01-15' },
  { id: 'ITM-2023-002', skill: 'Grammar', topic: 'Relative Pronouns', course: 'GT', level: 'L4', diff: 1.12, disc: 0.95, guess: 0.20, type: '객관식', status: 'Active', date: '2023-02-20' },
  { id: 'ITM-2023-003', skill: 'Vocabulary', topic: 'Academic Words', course: 'ECP', level: 'L5', diff: 1.50, disc: 1.45, guess: 0.18, type: '객관식', status: 'Active', date: '2023-03-10' },
  { id: 'ITM-2023-004', skill: 'Listening', topic: 'Detail Inference', course: 'MAG', level: 'L3', diff: 0.45, disc: 0.88, guess: 0.25, type: '객관식', status: 'Retired', date: '2023-04-05' },
  { id: 'ITM-2023-005', skill: 'Reading', topic: 'Inference', course: 'GT', level: 'L4', diff: 1.80, disc: 1.60, guess: 0.10, type: '서술형', status: 'Active', date: '2023-05-12' },
  { id: 'ITM-2023-006', skill: 'Grammar', topic: 'Tense', course: 'ECP', level: 'L2', diff: -0.50, disc: 0.75, guess: 0.22, type: '객관식', status: 'Active', date: '2023-06-18' },
  { id: 'ITM-2023-007', skill: 'Vocabulary', topic: 'Synonyms', course: 'MAG', level: 'L4', diff: 0.95, disc: 1.10, guess: 0.19, type: '객관식', status: 'Active', date: '2023-07-22' },
  { id: 'ITM-2023-008', skill: 'Listening', topic: 'Main Purpose', course: 'GT', level: 'L5', diff: 1.25, disc: 1.35, guess: 0.15, type: '서술형', status: 'Active', date: '2023-08-30' },
];

export function ItemRepository({ userGroup: _userGroup }: ItemRepositoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter States
  const [filters, setFilters] = useState({
    itemId: '',
    skill: '',
    topic: '',
    course: '',
    level: '',
    diffMin: '',
    diffMax: '',
    discMin: '',
    discMax: '',
    itemType: '',
    status: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      itemId: '', skill: '', topic: '', course: '', level: '',
      diffMin: '', diffMax: '', discMin: '', discMax: '', itemType: '', status: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">문항 Repository</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">개발된 문항을 체계적으로 저장하고 검색하는 데이터베이스입니다.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </button>
          <button className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            새 문항 등록
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Item ID */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Item ID</label>
              <input 
                type="text" 
                value={filters.itemId} 
                onChange={(e) => handleFilterChange('itemId', e.target.value)} 
                placeholder="e.g. ITM-2023..." 
                className={UI_FILTER_CONTROL_CLASS} 
              />
            </div>

            {/* Skill */}
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

            {/* Topic */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Topic</label>
              <input 
                type="text" 
                value={filters.topic} 
                onChange={(e) => handleFilterChange('topic', e.target.value)} 
                placeholder="주제 검색" 
                className={UI_FILTER_CONTROL_CLASS} 
              />
            </div>

            {/* Course */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Course</label>
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
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Level</label>
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

            {/* Difficulty Range */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Difficulty (b) 범위</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  value={filters.diffMin} 
                  onChange={(e) => handleFilterChange('diffMin', e.target.value)} 
                  placeholder="Min" 
                  step="0.1" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
                <span className="text-slate-400">~</span>
                <input 
                  type="number" 
                  value={filters.diffMax} 
                  onChange={(e) => handleFilterChange('diffMax', e.target.value)} 
                  placeholder="Max" 
                  step="0.1" 
                  className={UI_FILTER_CONTROL_CLASS} 
                />
              </div>
            </div>

            {/* Discrimination Range */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Discrimination (a) 범위</label>
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

            {/* Item Type */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">문항 유형</label>
              <div className="relative">
                <select 
                  value={filters.itemType} 
                  onChange={(e) => handleFilterChange('itemType', e.target.value)} 
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="">전체</option>
                  <option value="객관식">객관식</option>
                  <option value="서술형">서술형</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>

            {/* Item Status */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Item Status</label>
              <div className="relative">
                <select 
                  value={filters.status} 
                  onChange={(e) => handleFilterChange('status', e.target.value)} 
                  className={UI_FILTER_CONTROL_CLASS}
                >
                  <option value="">전체</option>
                  <option value="Active">Active (활성)</option>
                  <option value="Retired">Retired (폐기)</option>
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
            검색 결과 <span className="text-indigo-600 dark:text-indigo-400 text-sm ml-2">{mockItems.length}건</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">문항 ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skill</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topic</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">과정</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">레벨</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">난이도 (b)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">변별도 (a)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">추측도 (c)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">문항 유형</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">상태</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">등록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <td className="p-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{item.id}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.skill}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.topic}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">{item.course}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.level}</td>
                  <td className="p-4 text-sm text-slate-900 dark:text-white text-right font-mono whitespace-nowrap">{item.diff.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-900 dark:text-white text-right font-mono whitespace-nowrap">{item.disc.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-900 dark:text-white text-right font-mono whitespace-nowrap">{item.guess.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 text-center whitespace-nowrap">{item.type}</td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{item.date}</td>
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
