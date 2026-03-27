import React from 'react';
import { UserGroup } from '../types';
import { DashboardFilters } from '../components/dashboard/DashboardFilters';
import { CAMPUS_LIST } from '../constants';
import { PeqmAnalysis } from '../components/peqm/PeqmAnalysis';
import { useCampusStore } from '../stores/campusStore';
import { PEQM_CAMPUS_2025_MT_DATA } from '../data/peqmCampus2025MtData';
import { toExamOptionLabel, toExamPeriodKey } from '../utils/examPeriod';

export function Peqm({ userGroup }: { userGroup: UserGroup }) {
  const filter = useCampusStore((state) => state.filtersByModule.peqm);
  const setFilter = useCampusStore((state) => state.setFilter);
  const markAnalyzed = useCampusStore((state) => state.markAnalyzed);

  const peqmPeriods = Array.from(
    new Map(
      PEQM_CAMPUS_2025_MT_DATA
        .filter((row) => row.section === 'PEQM')
        .map((row) => [toExamPeriodKey({ year: row.year, month: row.month }), { year: row.year, month: row.month }]),
    ).values(),
  ).sort((a, b) => toExamPeriodKey(b) - toExamPeriodKey(a));

  const yearOptions = Array.from(new Set(peqmPeriods.map((period) => period.year))).sort((a, b) => b - a);
  const testOptions = peqmPeriods
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">PEQM</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">전국 캠퍼스의 엘리트 학생 비율과 점수 안정성을 분석해 캠퍼스의 교육품질(POLY Elite Quality) 모니터링 및 분석합니다.</p>
        </div>
      </div>

      {/* Search & Filter Area */}
      <DashboardFilters
        userGroup={userGroup}
        testType={filter.testType}
        setTestType={(value) => setFilter('peqm', 'testType', value)}
        selectedYear={filter.selectedYear}
        setSelectedYear={(value) => {
          setFilter('peqm', 'selectedYear', value);
          setFilter('peqm', 'selectedTests', []);
        }}
        includeUnder10={filter.includeUnder10}
        setIncludeUnder10={(value) => setFilter('peqm', 'includeUnder10', value)}
        selectedCourses={filter.selectedCourses}
        setSelectedCourses={(value) => setFilter('peqm', 'selectedCourses', value)}
        selectedCampuses={filter.selectedCampuses}
        setSelectedCampuses={(value) => setFilter('peqm', 'selectedCampuses', value)}
        selectedSubjects={filter.selectedSubjects}
        setSelectedSubjects={(value) => setFilter('peqm', 'selectedSubjects', value)}
        selectedTests={filter.selectedTests}
        setSelectedTests={(value) => setFilter('peqm', 'selectedTests', value)}
        testOptions={testOptions}
        yearOptions={yearOptions}
        subjectOptions={subjectOptions}
        courseOptions={courseOptions}
        campusOptions={campusOptions}
        onSearch={() => markAnalyzed('peqm')}
      />
      
      {/* Analysis Content */}
      <PeqmAnalysis
        selectedCampuses={filter.selectedCampuses}
        showAllCampuses={showAllCampuses}
        selectedYear={filter.selectedYear}
        selectedTests={filter.selectedTests}
      />
    </div>
  );
}
