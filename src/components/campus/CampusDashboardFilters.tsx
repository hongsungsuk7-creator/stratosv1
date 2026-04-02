import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { UI_FILTER_CONTROL_COMPACT_CLASS } from '../../constants/uiClasses';
import { LEVELS, type PrincipalManagedCampus } from '../../data/campusMockData';

interface CampusDashboardFiltersProps {
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedClass: string;
  setSelectedClass: (id: string) => void;
  classes: { id: string, name: string, level: string }[];
  onSearch: () => void;
  testType: string;
  setTestType: (type: string) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  includeUnder10?: boolean;
  setIncludeUnder10?: (val: boolean) => void;
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  subjectOptions: string[];
  managedCampuses: PrincipalManagedCampus[];
  selectedManagedCampusId: string;
  setSelectedManagedCampusId: (id: string) => void;
}

export function CampusDashboardFilters({
  selectedLevel,
  setSelectedLevel,
  selectedClass,
  setSelectedClass,
  classes,
  onSearch,
  testType,
  setTestType,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  includeUnder10,
  setIncludeUnder10,
  selectedSubjects,
  setSelectedSubjects,
  subjectOptions,
  managedCampuses,
  selectedManagedCampusId,
  setSelectedManagedCampusId,
}: CampusDashboardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const subjectTriggerRef = useRef<HTMLDivElement>(null);
  const [subjectMenuPos, setSubjectMenuPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const updateSubjectMenuPos = useCallback(() => {
    const el = subjectTriggerRef.current;
    if (!el || !isSubjectDropdownOpen) return;
    const r = el.getBoundingClientRect();
    setSubjectMenuPos({
      top: r.bottom + 4,
      left: r.left,
      width: Math.max(r.width, 192),
    });
  }, [isSubjectDropdownOpen]);

  useLayoutEffect(() => {
    updateSubjectMenuPos();
  }, [updateSubjectMenuPos]);

  useEffect(() => {
    if (!isSubjectDropdownOpen) {
      setSubjectMenuPos(null);
      return;
    }
    const onScrollOrResize = () => updateSubjectMenuPos();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isSubjectDropdownOpen, updateSubjectMenuPos]);

  useEffect(() => {
    if (!isSubjectDropdownOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSubjectDropdownOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSubjectDropdownOpen]);

  const MT_MONTHS = [1, 3, 4, 6, 7, 9, 10, 12];
  const LT_MONTHS = [2, 5, 8, 11];
  const availableMonths = testType === 'MT' ? MT_MONTHS : LT_MONTHS;

  const handleTestTypeChange = (type: string) => {
    setTestType(type);
    // When switching test types, set to the latest available month for that type
    if (type === 'MT') {
      setSelectedMonth(12);
    } else {
      setSelectedMonth(11);
    }
  };

  const filteredClasses = selectedLevel === 'all' 
    ? classes 
    : classes.filter(c => c.level === selectedLevel);

  const activeCampusLabel =
    managedCampuses.find((c) => c.id === selectedManagedCampusId)?.label ??
    managedCampuses[0]?.label ??
    '';

  return (
    <div className="sticky -top-1 z-[120] isolate">
      <div className="pointer-events-none absolute -inset-x-4 -top-4 inset-y-0 bg-white dark:bg-slate-900" />
      <div className="relative p-4 rounded-xl border border-slate-200 shadow-lg mb-6 transition-all duration-300 bg-white dark:border-[3px] dark:border-slate-50 dark:bg-slate-800">
      <div className={`flex items-center justify-between ${isExpanded ? 'mb-4' : ''}`}>
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
          <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-white">{activeCampusLabel}</span>
          </div>
        </div>
        <button 
          onClick={onSearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-bold flex items-center transition-all shadow-md active:scale-95"
        >
          <Search className="w-4 h-4 mr-2" />
          조회
        </button>
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
          {/* 1. 시험 연도 */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 dark:text-white uppercase tracking-wider">시험 연도</label>
            <div className="relative">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className={UI_FILTER_CONTROL_COMPACT_CLASS}
              >
                <option value={2025}>2025년</option>
                <option value={2024}>2024년</option>
                <option value={2023}>2023년</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none dark:text-slate-500" />
            </div>
          </div>

          {/* 2. 시험유형 */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 dark:text-white uppercase tracking-wider">시험유형</label>
            <div className="flex items-center space-x-4 h-9 px-1">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="testType" 
                  value="MT" 
                  checked={testType === 'MT'} 
                  onChange={() => handleTestTypeChange('MT')}
                  className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600" 
                />
                <span className="ml-2 text-xs text-slate-700 font-medium dark:text-white">MT</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="testType" 
                  value="LT" 
                  checked={testType === 'LT'} 
                  onChange={() => handleTestTypeChange('LT')}
                  className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600" 
                />
                <span className="ml-2 text-xs text-slate-700 font-medium dark:text-white">LT</span>
              </label>
            </div>
          </div>

          {/* 3. 시험선택 */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 dark:text-white uppercase tracking-wider">시험선택</label>
            <div className="relative">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className={UI_FILTER_CONTROL_COMPACT_CLASS}
              >
                {availableMonths.map(month => (
                  <option key={month} value={month}>{month}월 {testType}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none dark:text-slate-500" />
            </div>
          </div>

          {/* 4. 과정 선택 */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 dark:text-white uppercase tracking-wider">과정 선택</label>
            <div className="relative">
              <select className={UI_FILTER_CONTROL_COMPACT_CLASS}>
                <option>전체 과정</option>
                <option>ECP</option>
                <option>ELE</option>
                <option>GRAD</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none dark:text-slate-500" />
            </div>
          </div>

          {/* 5. 레벨 선택 */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 dark:text-white uppercase tracking-wider">레벨 선택</label>
            <div className="relative">
              <select 
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setSelectedClass('all');
                }}
                className={UI_FILTER_CONTROL_COMPACT_CLASS}
              >
                <option value="all">전체 레벨</option>
                {LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none dark:text-slate-500" />
            </div>
          </div>

          {/* 6. 수강반 선택 */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 dark:text-white uppercase tracking-wider">수강반 선택</label>
            <div className="relative">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className={UI_FILTER_CONTROL_COMPACT_CLASS}
              >
                <option value="all">전체 수강반</option>
                {filteredClasses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none dark:text-slate-500" />
            </div>
          </div>

          {/* 7. 과목 선택 (Multi-select) — portal로 렌더해 스크롤/overflow 영역에 잘리지 않게 함 */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 dark:text-white uppercase tracking-wider">과목 선택</label>
            <div
              ref={subjectTriggerRef}
              className="flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              onClick={() => setIsSubjectDropdownOpen((o) => !o)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsSubjectDropdownOpen((o) => !o);
                }
              }}
            >
              <span className="truncate">
                {selectedSubjects.length === subjectOptions.length ? '전체' : `${selectedSubjects.length}개 선택`}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
            </div>

            {isSubjectDropdownOpen &&
              subjectMenuPos &&
              createPortal(
                <>
                  <div
                    className="fixed inset-0 z-[199]"
                    aria-hidden
                    onClick={() => setIsSubjectDropdownOpen(false)}
                  />
                  <div
                    className="fixed z-[200] max-h-60 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
                    style={{
                      top: subjectMenuPos.top,
                      left: subjectMenuPos.left,
                      width: subjectMenuPos.width,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
                      <label className="flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-indigo-500"
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
                        type="button"
                        className="text-[10px] font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400"
                        onClick={() => setSelectedSubjects([])}
                      >
                        초기화
                      </button>
                    </div>
                    <div className="p-1">
                      {subjectOptions.map((subject) => (
                        <label
                          key={subject}
                          className="flex cursor-pointer items-center rounded px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <input
                            type="checkbox"
                            className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-indigo-500"
                            checked={selectedSubjects.includes(subject)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubjects([...selectedSubjects, subject]);
                              } else {
                                setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
                              }
                            }}
                          />
                          <span className="ml-2 text-xs text-slate-700 dark:text-slate-300">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>,
                document.body,
              )}
          </div>

          {/* 8. 캠퍼스 선택 (원장 관리 캠퍼스만 표시) */}
          {managedCampuses.length > 0 && (
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white">
                캠퍼스 선택
              </label>
              <div className="relative">
                <select
                  value={selectedManagedCampusId}
                  onChange={(e) => setSelectedManagedCampusId(e.target.value)}
                  className={UI_FILTER_CONTROL_COMPACT_CLASS}
                >
                  {managedCampuses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400 dark:text-slate-500" />
              </div>
            </div>
          )}

          {/* 9. 분석대상 조건 */}
          {setIncludeUnder10 !== undefined && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 dark:text-white uppercase tracking-wider">분석대상 조건</label>
              <div className="flex items-center h-9 px-1">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeUnder10}
                    onChange={(e) => setIncludeUnder10(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600" 
                  />
                  <span className="ml-2 text-xs text-slate-700 font-medium dark:text-white">응시 10명 미만 포함</span>
                </label>
              </div>
            </div>
          )}

        </div>
      )}
      </div>
    </div>
  );
}
