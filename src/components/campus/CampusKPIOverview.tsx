import React, { useState } from 'react';
import { CAMPUS_DATA, CLASSES_DATA, LEVELS, NATIONAL_AVERAGES } from '../../data/campusMockData';

type TypeFilter = '전체' | 'ECP' | 'ELE' | 'GRAD';
type GradeFilter = '전체 등급' | '즉시관리군' | '우수군';

interface CampusKPIOverviewProps {
  /** 상위 섹션 카드와 중복될 때 내부 바깥 카드(배경/테두리/라운딩) 제거 */
  omitOuterCard?: boolean;
}

export function CampusKPIOverview({ omitOuterCard = false }: CampusKPIOverviewProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('전체');
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('전체 등급');
  const [filterCategory, setFilterCategory] = useState('레벨별');
  const [filterValue, setFilterValue] = useState('전체 레벨');

  const levelOptions = ['전체 레벨', ...LEVELS];
  const periodOptions = ['1년 미만', '2년 미만', '2년 이상'];

  const filteredData = CLASSES_DATA.filter(item => {
    if (typeFilter !== '전체' && item.course !== typeFilter) return false;
    if (filterCategory === '레벨별' && filterValue !== '전체 레벨' && item.level !== filterValue) return false;
    // Grade filter logic (mocked)
    if (gradeFilter === '우수군' && item.pScore < 90) return false;
    if (gradeFilter === '즉시관리군' && item.pScore > 80) return false;
    return true;
  });

  const totalClasses = filteredData.length;
  const totalStudents = filteredData.reduce((sum, item) => sum + item.studentCount, 0);
  const avgPerClass = totalClasses > 0 ? (totalStudents / totalClasses).toFixed(1) : '0.0';
  
  const ecpCount = filteredData.filter(item => item.course === 'ECP').length;
  const eleCount = filteredData.filter(item => item.course === 'ELE').length;
  const getGradeStats = (grade: string) => {
    // Mocking grade stats for classes
    const count = filteredData.filter(item => {
      if (grade === 'S') return item.pScore >= 90;
      if (grade === 'A') return item.pScore >= 85 && item.pScore < 90;
      if (grade === 'B') return item.pScore >= 80 && item.pScore < 85;
      if (grade === 'C') return item.pScore < 80;
      return false;
    }).length;
    const ratio = totalClasses > 0 ? ((count / totalClasses) * 100).toFixed(1) : '0.0';
    return { count, ratio };
  };

  const sGrade = getGradeStats('S');
  const aGrade = getGradeStats('A');
  const bGrade = getGradeStats('B');
  const cGrade = getGradeStats('C');

  const avgPScore = totalClasses > 0 ? (filteredData.reduce((sum, item) => sum + item.pScore, 0) / totalClasses).toFixed(1) : '0.0';
  const maxPScore = totalClasses > 0 ? Math.max(...filteredData.map(item => item.pScore)).toFixed(1) : '0.0';
  
  const avgZScore = totalClasses > 0 ? (filteredData.reduce((sum, item) => sum + item.zScore, 0) / totalClasses).toFixed(2) : '0.00';
  const upwardCount = filteredData.filter(item => item.zScore > 0).length;

  const emiLCount = filteredData.filter(item => item.pScore < 75).length; // Mocked EMI L

  return (
    <div
      className={
        omitOuterCard
          ? 'relative overflow-hidden p-3 text-slate-800 transition-colors duration-200 dark:text-white'
          : 'relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-[#0f172a] dark:text-white dark:shadow-2xl'
      }
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-500/5 dark:from-indigo-500/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
          {/* Left Filter Area */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
              {(['전체', 'ECP', 'ELE', 'GRAD'] as TypeFilter[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    typeFilter === type
                      ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent'
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
                setFilterValue(e.target.value === '레벨별' ? levelOptions[0] : periodOptions[0]);
              }}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md focus:ring-indigo-500 focus:border-indigo-500 block py-1 px-2 h-8 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
            >
              <option value="레벨별">레벨별</option>
              <option value="수강기간별">수강기간별</option>
            </select>

            <select 
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md focus:ring-indigo-500 focus:border-indigo-500 block py-1 px-2 h-8 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 min-w-[128px]"
            >
              {filterCategory === '레벨별' ? (
                levelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
              ) : (
                periodOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
              )}
            </select>
          </div>
          
          {/* Right Filter Area */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
            {(['전체 등급', '즉시관리군', '우수군'] as GradeFilter[]).map((grade) => (
              <button
                key={grade}
                onClick={() => setGradeFilter(grade)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  gradeFilter === grade
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-transparent'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent'
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
            { label: '학급수', value: totalClasses.toString() },
            { label: '학생수', value: totalStudents.toString() },
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
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">캠퍼스 운영 현황</h3>
            <div className="text-3xl font-bold text-slate-800 dark:text-white mt-2 mb-3 tracking-tight">{totalClasses}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">ECP</span><span className="text-slate-700 dark:text-slate-300">{ecpCount}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">ELE</span><span className="text-slate-700 dark:text-slate-300">{eleCount}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">학생수</span><span className="text-indigo-600 dark:text-indigo-300 font-medium">{totalStudents}</span></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">학급 S 등급</h3>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 mb-3 tracking-tight">{sGrade.count}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">비중</span><span className="text-emerald-600 dark:text-emerald-300 font-medium">{sGrade.ratio}%</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">전국 평균</span><span className="text-slate-700 dark:text-slate-300">{NATIONAL_AVERAGES.sGradeRatio}%</span></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">학급 A 등급</h3>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2 mb-3 tracking-tight">{aGrade.count}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">비중</span><span className="text-blue-600 dark:text-blue-300 font-medium">{aGrade.ratio}%</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">전국 평균</span><span className="text-slate-700 dark:text-slate-300">{(NATIONAL_AVERAGES as any).aGradeRatio}%</span></div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">학급 B 등급</h3>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2 mb-3 tracking-tight">{bGrade.count}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">비중</span><span className="text-amber-600 dark:text-amber-300 font-medium">{bGrade.ratio}%</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">전국 평균</span><span className="text-slate-700 dark:text-slate-300">{(NATIONAL_AVERAGES as any).bGradeRatio}%</span></div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-rose-300 dark:hover:border-rose-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">학급 C 등급</h3>
            <div className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-2 mb-3 tracking-tight">{cGrade.count}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">비중</span><span className="text-rose-600 dark:text-rose-300 font-medium">{cGrade.ratio}%</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">전국 평균</span><span className="text-slate-700 dark:text-slate-300">{(NATIONAL_AVERAGES as any).cGradeRatio}%</span></div>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-cyan-300 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">P-SCORE</h3>
            <div className="text-3xl font-bold text-slate-800 dark:text-white mt-2 mb-3 tracking-tight">{avgPScore}<span className="text-lg text-slate-500 dark:text-slate-400 font-normal">%</span></div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">최고</span><span className="text-slate-700 dark:text-slate-300">{maxPScore}%</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">전국 평균</span><span className="text-cyan-600 dark:text-cyan-300 font-medium">{NATIONAL_AVERAGES.pScore}%</span></div>
            </div>
          </div>

          {/* Card 7 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-fuchsia-300 dark:hover:border-fuchsia-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(217,70,239,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">PC-RAM</h3>
            <div className="text-3xl font-bold text-slate-800 dark:text-white mt-2 mb-3 tracking-tight">{avgZScore}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">상향군</span><span className="text-slate-700 dark:text-slate-300">{upwardCount}</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">전국 평균</span><span className="text-fuchsia-600 dark:text-fuchsia-300 font-medium">{NATIONAL_AVERAGES.zScore}</span></div>
            </div>
          </div>

          {/* Card 8 */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 relative group overflow-hidden hover:border-violet-300 dark:hover:border-violet-500/50 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">PEQM</h3>
            <div className="text-3xl font-bold text-slate-800 dark:text-white mt-2 mb-3 tracking-tight">{CAMPUS_DATA.peqm}</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-500">EMI 등급</span><span className="text-slate-700 dark:text-slate-300">G</span></div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-700/50"><span className="text-slate-500">전국 평균</span><span className="text-violet-600 dark:text-violet-300 font-medium">{NATIONAL_AVERAGES.peqm}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
