import React from 'react';
import { UserGroup } from '../types';
import { DashboardFilters } from '../components/dashboard/DashboardFilters';
import { PcRamAnalysis } from '../components/pcram/PcRamAnalysis';
import { CAMPUS_LIST } from '../constants';
import { useCampusStore } from '../stores/campusStore';
import { PCRAM_CAMPUS_2025_MT_DATA } from '../data/pcramCampus2025MtData';
import { toExamOptionLabel, toExamPeriodKey } from '../utils/examPeriod';

export function PcRam({ userGroup }: { userGroup: UserGroup }) {
  const filter = useCampusStore((state) => state.filtersByModule.pcram);
  const setFilter = useCampusStore((state) => state.setFilter);
  const markAnalyzed = useCampusStore((state) => state.markAnalyzed);

  const pcramPeriods = Array.from(
    new Map(
      PCRAM_CAMPUS_2025_MT_DATA
        .filter((row) => row.section === 'PC-RAM')
        .map((row) => [toExamPeriodKey({ year: row.year, month: row.month }), { year: row.year, month: row.month }]),
    ).values(),
  ).sort((a, b) => toExamPeriodKey(b) - toExamPeriodKey(a));

  const yearOptions = Array.from(new Set(pcramPeriods.map((period) => period.year))).sort((a, b) => b - a);
  const testOptions = pcramPeriods
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">PC-RAM</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">전국 캠퍼스의 성과지표 (Z-Score)와 신뢰도 지표(Caution Index)를 조합해 객관적으로 등급화화여 분석합니다.</p>
        </div>
      </div>

      {/* Search & Filter Area */}
      <DashboardFilters
        userGroup={userGroup}
        testType={filter.testType}
        setTestType={(value) => setFilter('pcram', 'testType', value)}
        selectedYear={filter.selectedYear}
        setSelectedYear={(value) => {
          setFilter('pcram', 'selectedYear', value);
          setFilter('pcram', 'selectedTests', []);
        }}
        includeUnder10={filter.includeUnder10}
        setIncludeUnder10={(value) => setFilter('pcram', 'includeUnder10', value)}
        selectedCourses={filter.selectedCourses}
        setSelectedCourses={(value) => setFilter('pcram', 'selectedCourses', value)}
        selectedCampuses={filter.selectedCampuses}
        setSelectedCampuses={(value) => setFilter('pcram', 'selectedCampuses', value)}
        selectedSubjects={filter.selectedSubjects}
        setSelectedSubjects={(value) => setFilter('pcram', 'selectedSubjects', value)}
        selectedTests={filter.selectedTests}
        setSelectedTests={(value) => setFilter('pcram', 'selectedTests', value)}
        testOptions={testOptions}
        yearOptions={yearOptions}
        subjectOptions={subjectOptions}
        courseOptions={courseOptions}
        campusOptions={campusOptions}
        onSearch={() => markAnalyzed('pcram')}
      />
      
      {/* Analysis Results */}
      <PcRamAnalysis
        selectedSubjects={filter.selectedSubjects}
        selectedCampuses={filter.selectedCampuses}
        showAllCampuses={showAllCampuses}
        selectedYear={filter.selectedYear}
        selectedTests={filter.selectedTests}
      />
    </div>
  );
}
