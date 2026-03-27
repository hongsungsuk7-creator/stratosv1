import React from 'react';
import { UserGroup } from '../types';
import { DashboardFilters } from '../components/dashboard/DashboardFilters';
import { PScoreAnalysis } from '../components/pscore/PScoreAnalysis';
import { CAMPUS_LIST } from '../constants';
import { useCampusStore } from '../stores/campusStore';
import { PSCORE_CAMPUS_2025_MT_DATA } from '../data/pscoreCampus2025MtData';
import { toExamOptionLabel, toExamPeriodKey } from '../utils/examPeriod';

export function PScore({ userGroup }: { userGroup: UserGroup }) {
  const filter = useCampusStore((state) => state.filtersByModule.pscore);
  const setFilter = useCampusStore((state) => state.setFilter);
  const markAnalyzed = useCampusStore((state) => state.markAnalyzed);

  const pscorePeriods = Array.from(
    new Map(
      PSCORE_CAMPUS_2025_MT_DATA
        .filter((row) => row.section === 'P-Score')
        .map((row) => [toExamPeriodKey({ year: row.year, month: row.month }), { year: row.year, month: row.month }]),
    ).values(),
  ).sort((a, b) => toExamPeriodKey(b) - toExamPeriodKey(a));

  const yearOptions = Array.from(new Set(pscorePeriods.map((period) => period.year))).sort((a, b) => b - a);
  const testOptions = pscorePeriods
    .filter((period) => period.year === filter.selectedYear)
    .map((period) => toExamOptionLabel(period));

  const subjectOptions = ['Eng. Foundations', 'English', 'Speech Building', 'Cultural Conn.'];

  const courseOptions = [
    'GT1', 'GT2', 'GT3', 'GT4', 
    'MGT1', 'MGT2', 'MGT3', 'MGT4', 
    'S1', 'S2', 'S3', 'S4', 
    'R1', 'R2', 'R3', 'R4', 
    'MAG1', 'MAG1+', 'MAG2', 'MAG2+', 'MAG3', 'MAG4'
  ];

  const campusOptions = CAMPUS_LIST;
  const showAllCampuses =
    filter.selectedCampuses.length === 0 || filter.selectedCampuses.length === campusOptions.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">P-Score</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">캠퍼스별 전체 정답율(P-Score)을 산출하고 과목간 균형을 다각적으로 분석합니다.</p>
        </div>
      </div>

      {/* Search & Filter Area */}
      <DashboardFilters
        userGroup={userGroup}
        testType={filter.testType}
        setTestType={(value) => setFilter('pscore', 'testType', value)}
        selectedYear={filter.selectedYear}
        setSelectedYear={(value) => {
          setFilter('pscore', 'selectedYear', value);
          setFilter('pscore', 'selectedTests', []);
        }}
        includeUnder10={filter.includeUnder10}
        setIncludeUnder10={(value) => setFilter('pscore', 'includeUnder10', value)}
        selectedCourses={filter.selectedCourses}
        setSelectedCourses={(value) => setFilter('pscore', 'selectedCourses', value)}
        selectedCampuses={filter.selectedCampuses}
        setSelectedCampuses={(value) => setFilter('pscore', 'selectedCampuses', value)}
        selectedSubjects={filter.selectedSubjects}
        setSelectedSubjects={(value) => setFilter('pscore', 'selectedSubjects', value)}
        selectedTests={filter.selectedTests}
        setSelectedTests={(value) => setFilter('pscore', 'selectedTests', value)}
        testOptions={testOptions}
        yearOptions={yearOptions}
        subjectOptions={subjectOptions}
        courseOptions={courseOptions}
        campusOptions={campusOptions}
        onSearch={() => markAnalyzed('pscore')}
      />
      
      {filter.showAnalysis ? (
        <PScoreAnalysis
          selectedSubjects={filter.selectedSubjects}
          selectedCampuses={filter.selectedCampuses}
          showAllCampuses={showAllCampuses}
          selectedYear={filter.selectedYear}
          selectedTests={filter.selectedTests}
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center min-h-[400px]">
          <p className="text-slate-500 dark:text-slate-400">검색 조건을 선택한 후 조회 버튼을 클릭해주세요.</p>
        </div>
      )}
    </div>
  );
}
