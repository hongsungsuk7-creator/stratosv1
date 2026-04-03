import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { UI_FILTER_CONTROL_COMPACT_SLATE_CLASS } from '../../constants/uiClasses';
import { UserGroup } from '../../types';

interface DashboardFiltersProps {
  userGroup: UserGroup;
  testType: string;
  setTestType: (val: string) => void;
  selectedYear: number;
  setSelectedYear: (val: number) => void;
  includeUnder10: boolean;
  setIncludeUnder10: (val: boolean) => void;
  selectedCourses: string[];
  setSelectedCourses: (val: string[]) => void;
  selectedCampuses: string[];
  setSelectedCampuses: (val: string[]) => void;
  selectedSubjects: string[];
  setSelectedSubjects: (val: string[]) => void;
  selectedTests: string[];
  setSelectedTests: (val: string[]) => void;
  testOptions: string[];
  subjectOptions: string[];
  courseOptions: string[];
  campusOptions: string[];
  /** HQ Dashboard 등: 캠퍼스명 일부 입력으로 랭킹 등에서 필터 */
  campusLookup?: string;
  setCampusLookup?: (val: string) => void;
  onSearch?: () => void;
  yearOptions?: number[];
}

export function DashboardFilters({
  userGroup,
  testType,
  setTestType,
  selectedYear,
  setSelectedYear,
  includeUnder10,
  setIncludeUnder10,
  selectedCourses,
  setSelectedCourses,
  selectedCampuses,
  setSelectedCampuses,
  selectedSubjects,
  setSelectedSubjects,
  selectedTests,
  setSelectedTests,
  testOptions,
  subjectOptions,
  courseOptions,
  campusOptions,
  campusLookup,
  setCampusLookup,
  onSearch,
  yearOptions = [2026, 2025, 2024, 2023],
}: DashboardFiltersProps) {
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isCampusDropdownOpen, setIsCampusDropdownOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const hasCampusLookup = campusLookup !== undefined && setCampusLookup !== undefined;

  return (
    <div className="sticky -top-1 z-[120] isolate">
      <div className="pointer-events-none absolute -inset-x-4 -top-4 inset-y-0 bg-white dark:bg-slate-900" />
      <div className="relative p-4 rounded-b-xl rounded-t-none border-x border-b border-slate-200 shadow-lg mb-6 transition-all duration-300 bg-white dark:rounded-xl dark:border-[3px] dark:border-slate-50 dark:bg-slate-800 overflow-visible">
      <div className={`flex items-center justify-between ${isExpanded ? 'mb-3' : ''}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm font-semibold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
          >
            <Search className="w-5 h-5 text-indigo-500 mr-2" />
            검색 조건
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 ml-1.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1.5 text-slate-400" />
            )}
          </button>
        </div>
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-xs font-medium flex items-center transition-colors shadow-sm dark:bg-indigo-500 dark:hover:bg-indigo-600"
          onClick={onSearch}
        >
          <Search className="w-3.5 h-3.5 mr-1.5" />
          조회
        </button>
      </div>
      
      {isExpanded && (
        <div
          className={`grid grid-cols-2 gap-3 md:grid-cols-4 ${hasCampusLookup ? 'xl:grid-cols-9' : 'xl:grid-cols-8'}`}
        >
          {/* 1. 시험 연도 (Combo) */}
        <div className="relative">
          <label className="block text-[11px] font-medium text-slate-500 mb-1 dark:text-slate-400">시험 연도</label>
          <div className="relative">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={UI_FILTER_CONTROL_COMPACT_SLATE_CLASS}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
          </div>
        </div>

        {/* 2. 시험유형 (Radio) */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1 dark:text-slate-400">시험유형</label>
          <div className="flex items-center space-x-3 h-8 px-1">
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="testType" 
                value="MT" 
                checked={testType === 'MT'} 
                onChange={() => setTestType('MT')}
                className="w-3.5 h-3.5 text-indigo-600 bg-slate-100 border-slate-300 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500" 
              />
              <span className="ml-1.5 text-xs text-slate-700 font-medium dark:text-slate-300">MT</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="testType" 
                value="LT" 
                checked={testType === 'LT'} 
                onChange={() => setTestType('LT')}
                className="w-3.5 h-3.5 text-indigo-600 bg-slate-100 border-slate-300 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500" 
              />
              <span className="ml-1.5 text-xs text-slate-700 font-medium dark:text-slate-300">LT</span>
            </label>
          </div>
        </div>

        {/* 3. 시험선택 (Multi-select) */}
        <div className="relative">
          <label className="block text-[11px] font-medium text-slate-500 mb-1 dark:text-slate-400">시험선택</label>
          <div 
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md py-1.5 px-2 h-8 flex items-center justify-between cursor-pointer dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
            onClick={() => setIsTestDropdownOpen(!isTestDropdownOpen)}
          >
            <span className="truncate">
              {selectedTests.length === testOptions.length ? '전체' : selectedTests.length === 0 ? '선택' : `${selectedTests.length}개 선택`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </div>
          
          {isTestDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsTestDropdownOpen(false)}
              />
              <div className="absolute z-20 w-64 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto left-0 dark:bg-slate-800 dark:border-slate-700">
                <div className="p-2 sticky top-0 bg-white border-b border-slate-100 flex justify-between items-center z-10 dark:bg-slate-800 dark:border-slate-700">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500"
                      checked={selectedTests.length === testOptions.length && testOptions.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTests([...testOptions]);
                        } else {
                          setSelectedTests([]);
                        }
                      }}
                    />
                    <span className="ml-2 text-xs font-semibold text-slate-800 dark:text-slate-200">전체 선택</span>
                  </label>
                  <button 
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-medium dark:text-slate-500 dark:hover:text-slate-400"
                    onClick={() => setSelectedTests([])}
                  >
                    초기화
                  </button>
                </div>
                <div className="p-1">
                  {testOptions.map(test => (
                    <label key={test} className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer dark:hover:bg-slate-700/50">
                      <input 
                        type="checkbox" 
                        className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500"
                        checked={selectedTests.includes(test)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTests([...selectedTests, test]);
                          } else {
                            setSelectedTests(selectedTests.filter(t => t !== test));
                          }
                        }}
                      />
                      <span className="ml-2 text-xs text-slate-700 truncate dark:text-slate-300" title={test}>
                        {test}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 4. 과정 선택 (Multi-select) */}
        <div className="relative">
          <label className="block text-[11px] font-medium text-slate-500 mb-1 dark:text-slate-400">과정 선택</label>
          <div 
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md py-1.5 px-2 h-8 flex items-center justify-between cursor-pointer dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
            onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
          >
            <span className="truncate">
              {selectedCourses.length === 0 ? '전체 과정' : `${selectedCourses.length}개 선택됨`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </div>
          
          {isCourseDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsCourseDropdownOpen(false)}
              />
              <div className="absolute z-20 w-48 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto left-0 dark:bg-slate-800 dark:border-slate-700">
                <div className="p-2 sticky top-0 bg-white border-b border-slate-100 flex justify-between items-center z-10 dark:bg-slate-800 dark:border-slate-700">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500"
                      checked={selectedCourses.length === courseOptions.length && courseOptions.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCourses([...courseOptions]);
                        } else {
                          setSelectedCourses([]);
                        }
                      }}
                    />
                    <span className="ml-2 text-xs font-semibold text-slate-800 dark:text-slate-200">전체 선택</span>
                  </label>
                  <button 
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-medium dark:text-slate-500 dark:hover:text-slate-400"
                    onClick={() => setSelectedCourses([])}
                  >
                    초기화
                  </button>
                </div>
                <div className="p-1">
                  {courseOptions.map(course => (
                    <label key={course} className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer dark:hover:bg-slate-700/50">
                      <input 
                        type="checkbox" 
                        className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500"
                        checked={selectedCourses.includes(course)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCourses([...selectedCourses, course]);
                          } else {
                            setSelectedCourses(selectedCourses.filter(c => c !== course));
                          }
                        }}
                      />
                      <span className="ml-2 text-xs text-slate-700 dark:text-slate-300">{course}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 5. 과목 선택 (Multi-select) */}
        <div className="relative">
          <label className="block text-[11px] font-medium text-slate-500 mb-1 dark:text-slate-400">과목 선택</label>
          <div 
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md py-1.5 px-2 h-8 flex items-center justify-between cursor-pointer dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
            onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
          >
            <span className="truncate">
              {selectedSubjects.length === subjectOptions.length ? '전체' : `${selectedSubjects.length}개 선택`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </div>
          
          {isSubjectDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsSubjectDropdownOpen(false)}
              />
              <div className="absolute z-20 w-48 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto left-0 dark:bg-slate-800 dark:border-slate-700">
                <div className="p-2 sticky top-0 bg-white border-b border-slate-100 flex justify-between items-center z-10 dark:bg-slate-800 dark:border-slate-700">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500"
                      checked={selectedSubjects.length === subjectOptions.length && subjectOptions.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubjects([...subjectOptions]);
                        } else {
                          setSelectedSubjects([]);
                        }
                      }}
                    />
                    <span className="ml-2 text-xs font-semibold text-slate-800 dark:text-slate-200">전체 선택</span>
                  </label>
                  <button 
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-medium dark:text-slate-500 dark:hover:text-slate-400"
                    onClick={() => setSelectedSubjects([])}
                  >
                    초기화
                  </button>
                </div>
                <div className="p-1">
                  {subjectOptions.map(subject => (
                    <label key={subject} className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer dark:hover:bg-slate-700/50">
                      <input 
                        type="checkbox" 
                        className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500"
                        checked={selectedSubjects.includes(subject)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubjects([...selectedSubjects, subject]);
                          } else {
                            setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
                          }
                        }}
                      />
                      <span className="ml-2 text-xs text-slate-700 dark:text-slate-300">
                        {subject}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 6. 캠퍼스 조회 (텍스트, Dashboard 전용) */}
        {hasCampusLookup && (
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1 dark:text-slate-400">캠퍼스 조회</label>
            <input
              type="text"
              value={campusLookup}
              onChange={(e) => setCampusLookup(e.target.value)}
              placeholder={userGroup === 'GROUP_HQ' ? '캠퍼스명 일부 입력' : '본사 전용'}
              disabled={userGroup !== 'GROUP_HQ'}
              className={`${UI_FILTER_CONTROL_COMPACT_SLATE_CLASS} pr-2 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${userGroup !== 'GROUP_HQ' ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
        )}

        {/* 7. 캠퍼스 선택 (Multi-select) */}
        <div className="relative">
          <label className="block text-[11px] font-medium text-slate-500 mb-1 dark:text-slate-400">캠퍼스 선택</label>
          <div 
            className={`w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md py-1.5 px-2 h-8 flex items-center justify-between dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 ${userGroup === 'GROUP_HQ' ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
            onClick={() => userGroup === 'GROUP_HQ' && setIsCampusDropdownOpen(!isCampusDropdownOpen)}
          >
            <span className="truncate">
              {selectedCampuses.length === 0 ? '전국 전체' : `${selectedCampuses.length}개 선택됨`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </div>
          
          {isCampusDropdownOpen && userGroup === 'GROUP_HQ' && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsCampusDropdownOpen(false)}
              />
              <div className="absolute z-20 w-56 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto left-0 dark:bg-slate-800 dark:border-slate-700">
                <div className="p-2 sticky top-0 bg-white border-b border-slate-100 flex justify-between items-center z-10 dark:bg-slate-800 dark:border-slate-700">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500"
                      checked={selectedCampuses.length === campusOptions.length && campusOptions.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCampuses([...campusOptions]);
                        } else {
                          setSelectedCampuses([]);
                        }
                      }}
                    />
                    <span className="ml-2 text-xs font-semibold text-slate-800 dark:text-slate-200">전체 선택</span>
                  </label>
                  <button 
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-medium dark:text-slate-500 dark:hover:text-slate-400"
                    onClick={() => setSelectedCampuses([])}
                  >
                    초기화
                  </button>
                </div>
                <div className="p-1">
                  {campusOptions.map(campus => (
                    <label key={campus} className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer dark:hover:bg-slate-700/50">
                      <input 
                        type="checkbox" 
                        className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500"
                        checked={selectedCampuses.includes(campus)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCampuses([...selectedCampuses, campus]);
                          } else {
                            setSelectedCampuses(selectedCampuses.filter(c => c !== campus));
                          }
                        }}
                      />
                      <span className="ml-2 text-xs text-slate-700 dark:text-slate-300">{campus}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 8. 컬럼 조회 선택 (Combo) */}
        <div className="relative">
          <label className="block text-[11px] font-medium text-slate-500 mb-1 dark:text-slate-400">컬럼 조회 선택</label>
          <div className="relative">
            <select className={UI_FILTER_CONTROL_COMPACT_SLATE_CLASS}>
              <option>기본 조회 (P, Z, CV)</option>
              <option>상세 조회 (파라미터)</option>
              <option>리스크 중심 (CI, 등급)</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
          </div>
        </div>

        {/* 9. 분석대상 조건 (Checkbox) */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1 dark:text-slate-400">분석대상 조건</label>
          <div className="flex items-center h-8 px-1">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={includeUnder10}
                onChange={(e) => setIncludeUnder10(e.target.checked)}
                className="w-3.5 h-3.5 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-indigo-500" 
              />
              <span className="ml-1.5 text-xs text-slate-700 dark:text-slate-300">응시 10명 미만 포함</span>
            </label>
          </div>
        </div>
        </div>
      )}
      </div>
    </div>
  );
}
