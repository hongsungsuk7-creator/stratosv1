import React, { useState } from 'react';
import { UI_KPI_INLINE_SELECT_CLASS } from '@/constants/uiClasses';
import { mockData } from './NationalCampusRanking';
import { useExcelData } from '@/context/ExcelDataContext';

type TypeFilter = '전체' | '직영' | '본원';
type GradeFilter = '전체 등급' | '즉시관리군' | '우수군';

export function StratosKPIOverview() {
  const { campusRankingData } = useExcelData();
  const sourceRows = campusRankingData ?? mockData;

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('전체');
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('전체 등급');
  const [filterCategory, setFilterCategory] = useState('권역별');
  const [filterValue, setFilterValue] = useState('서울권 전체');

  const regionOptions = [
    '서울권 전체', '서울권 북부', '서울권 남부', 
    '경기권 전체', '경기도 북부', '경기도 남부',
    '인천권', '충청권', '경상권', '전라권', '제주권'
  ];

  const yearOptions = [
    '3년 미만', '5년 미만', '5년 이상', '10년 이상'
  ];

  const filteredData = sourceRows.filter(item => {
    // Type filter
    if (typeFilter === '직영' && item.type !== '직영') return false;
    if (typeFilter === '본원' && item.type !== '분원') return false;

    // Grade filter
    if (gradeFilter === '우수군' && item.coreGrade !== 'S') return false;
    if (gradeFilter === '즉시관리군' && !(item.emiGrade === 'L' || item.coreGrade === 'C')) return false;

    return true;
  });

  const totalCampuses = filteredData.length;
  const totalStudents = filteredData.reduce((sum, item) => sum + item.students, 0);
  const totalClasses = filteredData.reduce((sum, item) => sum + item.classes, 0);
  const avgPerClass = totalClasses > 0 ? (totalStudents / totalClasses).toFixed(1) : '0.0';
  
  const directCount = filteredData.filter(item => item.type === '직영').length;
  const franchiseCount = filteredData.filter(item => item.type === '분원').length;

  const getGradeStats = (grade: string) => {
    const gradeData = filteredData.filter(item => item.coreGrade === grade);
    const count = gradeData.length;
    const direct = gradeData.filter(item => item.type === '직영').length;
    const franchise = gradeData.filter(item => item.type === '분원').length;
    const ratio = totalCampuses > 0 ? ((count / totalCampuses) * 100).toFixed(1) : '0.0';
    return { count, direct, franchise, ratio };
  };

  const sGrade = getGradeStats('S');
  const aGrade = getGradeStats('A');
  const bGrade = getGradeStats('B');
  const cGrade = getGradeStats('C');

  const avgPScore = totalCampuses > 0 ? (filteredData.reduce((sum, item) => sum + item.pScore, 0) / totalCampuses).toFixed(1) : '0.0';
  const maxPScore = totalCampuses > 0 ? Math.max(...filteredData.map(item => item.pScore)).toFixed(1) : '0.0';
  const avgBalanceCv = totalCampuses > 0 ? (filteredData.reduce((sum, item) => sum + item.balanceCv, 0) / totalCampuses).toFixed(1) : '0.0';

  const avgZScore = totalCampuses > 0 ? (filteredData.reduce((sum, item) => sum + item.zScore, 0) / totalCampuses).toFixed(2) : '0.00';
  const avgConfidenceCi = totalCampuses > 0 ? (filteredData.reduce((sum, item) => sum + item.confidenceCi, 0) / totalCampuses).toFixed(3) : '0.000';
  const upwardCount = filteredData.filter(item => item.zScore > 0).length;

  const avgEliteZ = totalCampuses > 0 ? (filteredData.reduce((sum, item) => sum + item.eliteZ, 0) / totalCampuses).toFixed(2) : '0.00';
  const avgEliteCv = totalCampuses > 0 ? (filteredData.reduce((sum, item) => sum + item.eliteCv, 0) / totalCampuses).toFixed(1) : '0.0';
  const emiLCount = filteredData.filter(item => item.emiGrade === 'L').length;

  return (
    <div className="bg-white dark:bg-[#0f172a] text-slate-800 dark:text-white p-6 rounded-2xl shadow-sm dark:shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-200">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-500/5 dark:from-indigo-500/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
          {/* Left Filter Area */}
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {(['전체', '직영', '본원'] as TypeFilter[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 ${
                    typeFilter === type
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-200 border-slate-200 dark:border-slate-600/40 hover:bg-slate-50 dark:hover:bg-slate-700/90 hover:shadow-sm'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <select 
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setFilterValue(e.target.value === '권역별' ? regionOptions[0] : yearOptions[0]);
              }}
              className={UI_KPI_INLINE_SELECT_CLASS}
            >
              <option value="권역별">권역별</option>
              <option value="연차별">연차별</option>
            </select>

            <select 
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className={`${UI_KPI_INLINE_SELECT_CLASS} min-w-[100px]`}
            >
              {filterCategory === '권역별' ? (
                regionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
              ) : (
                yearOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
              )}
            </select>
          </div>
          
          {/* Right Filter Area */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['전체 등급', '즉시관리군', '우수군'] as GradeFilter[]).map((grade) => (
              <button
                key={grade}
                onClick={() => setGradeFilter(grade)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 ${
                  gradeFilter === grade
                    ? 'bg-slate-800 dark:bg-indigo-500 text-white border-slate-700 dark:border-indigo-400 shadow-md'
                    : 'bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-200 border-slate-200 dark:border-slate-600/40 hover:bg-slate-50 dark:hover:bg-slate-700/90 hover:shadow-sm'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Global KPI Summary (inline text) */}
        <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {[
            { label: '캠퍼스', value: totalCampuses.toString() },
            { label: '학생수', value: totalStudents.toString() },
            { label: '학급수', value: totalClasses.toString() },
            { label: '급당평균', value: avgPerClass },
            { label: '즉시관리', value: emiLCount.toString(), highlight: true },
            { label: '상향군', value: upwardCount.toString(), highlight: true }
          ].map((metric, idx, arr) => (
            <React.Fragment key={metric.label}>
              <span className="inline-flex flex-wrap items-baseline gap-x-1">
                <span className={metric.highlight ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-300'}>
                  {metric.label}
                </span>
                <strong
                  className={
                    metric.highlight
                      ? 'stratos-kpi-inline-metric-value--highlight font-bold text-indigo-800'
                      : 'font-bold text-slate-800 dark:text-slate-50'
                  }
                >
                  {metric.value}
                </strong>
              </span>
              {idx < arr.length - 1 && (
                <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {/* Card 1 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">전체 운영 현황</h3>
            <div className="text-3xl font-bold text-slate-800 dark:text-white mt-2 mb-3 tracking-tight">{totalCampuses}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">직영</span><span className="text-slate-700 dark:text-slate-300">{directCount}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">본원</span><span className="text-slate-700 dark:text-slate-300">{franchiseCount}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">학생수</span><span className="text-indigo-600 dark:text-indigo-300 font-medium">{totalStudents}</span></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">통합 S 등급</h3>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 mb-3 tracking-tight">{sGrade.count}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">직영</span><span className="text-slate-700 dark:text-slate-300">{sGrade.direct}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">본원</span><span className="text-slate-700 dark:text-slate-300">{sGrade.franchise}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">비중</span><span className="text-emerald-600 dark:text-emerald-300 font-medium">{sGrade.ratio}%</span></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">통합 A 등급</h3>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2 mb-3 tracking-tight">{aGrade.count}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">직영</span><span className="text-slate-700 dark:text-slate-300">{aGrade.direct}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">본원</span><span className="text-slate-700 dark:text-slate-300">{aGrade.franchise}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">비중</span><span className="text-blue-600 dark:text-blue-300 font-medium">{aGrade.ratio}%</span></div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">통합 B 등급</h3>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2 mb-3 tracking-tight">{bGrade.count}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">직영</span><span className="text-slate-700 dark:text-slate-300">{bGrade.direct}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">본원</span><span className="text-slate-700 dark:text-slate-300">{bGrade.franchise}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">비중</span><span className="text-amber-600 dark:text-amber-300 font-medium">{bGrade.ratio}%</span></div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-rose-300 dark:hover:border-rose-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">통합 C 등급</h3>
            <div className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-2 mb-3 tracking-tight">{cGrade.count}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">직영</span><span className="text-slate-700 dark:text-slate-300">{cGrade.direct}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">본원</span><span className="text-slate-700 dark:text-slate-300">{cGrade.franchise}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">비중</span><span className="text-rose-600 dark:text-rose-300 font-medium">{cGrade.ratio}%</span></div>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-cyan-300 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">P-SCORE</h3>
            <div className="text-3xl font-bold text-slate-800 dark:text-white mt-2 mb-3 tracking-tight">{avgPScore}<span className="text-lg text-slate-500 dark:text-slate-400 font-normal">%</span></div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">최고</span><span className="text-slate-700 dark:text-slate-300">{maxPScore}%</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">Balance CV</span><span className="text-slate-700 dark:text-slate-300">{avgBalanceCv}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">기준선</span><span className="text-cyan-600 dark:text-cyan-300 font-medium">80 / 6.0</span></div>
            </div>
          </div>

          {/* Card 7 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-fuchsia-300 dark:hover:border-fuchsia-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(217,70,239,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">PC-RAM</h3>
            <div className="text-3xl font-bold text-slate-800 dark:text-white mt-2 mb-3 tracking-tight">{avgZScore}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">평균 CI</span><span className="text-slate-700 dark:text-slate-300">{avgConfidenceCi}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">평균 Z-Score</span><span className="text-slate-700 dark:text-slate-300">{avgZScore}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">기준선</span><span className="text-fuchsia-600 dark:text-fuchsia-300 font-medium">0 / 0.60</span></div>
            </div>
          </div>

          {/* Card 8 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-violet-300 dark:hover:border-violet-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">PEQM</h3>
            <div className="text-3xl font-bold text-slate-800 dark:text-white mt-2 mb-3 tracking-tight">{avgEliteZ}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">Elite CV</span><span className="text-slate-700 dark:text-slate-300">{avgEliteCv}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">Elite Z- Scor</span><span className="text-slate-700 dark:text-slate-300">{avgEliteZ}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">기준선</span><span className="text-violet-600 dark:text-violet-300 font-medium">0 / 5.5</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
