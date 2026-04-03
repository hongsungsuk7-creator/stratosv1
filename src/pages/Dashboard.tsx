import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserGroup } from '../types';
import { useExcelData } from '@/context/ExcelDataContext';
import { DashboardFilters } from '../components/dashboard/DashboardFilters';
import { StratosKPIOverview } from '../components/dashboard/StratosKPIOverview';
import { PerformanceMatrix } from '../components/dashboard/PerformanceMatrix';
import { DistributionAndAverages } from '../components/dashboard/DistributionAndAverages';
import { AlertsAndRankings, type CampusRankChange } from '../components/dashboard/AlertsAndRankings';
import { CourseAnalysisCharts } from '../components/dashboard/CourseAnalysisCharts';
import { mockData as campusRankingMockData, NationalCampusRanking } from '../components/dashboard/NationalCampusRanking';
import { DashboardCollapsibleSection } from '../components/dashboard/DashboardCollapsibleSection';
import { getExamCohortCampusCount } from '@/utils/examCohortCampusCount';

import { examData_2025_09 } from '../data/examData';
import { CAMPUS_LIST } from '../constants';

const DEFAULT_TEST_OPTIONS = [
  'December 2025 Monthly Test (ELE) (12월)',
  '시험 4016 (12월)',
  '시험 3985 (10월)',
  'October 2025 Monthly Test (ELE) (10월)',
  'September 2025 Monthly Test (ELE) (09월)',
  '시험 3982 (09월)',
  'July 2025 Monthly Test (ELE) (07월)',
  'June 2025 Monthly Test (ELE) (06월)',
  'April 2025 Monthly Test (ELE) (04월)',
  'March 2025 Monthly Test (ELE) (03월)',
];

export function Dashboard({ userGroup }: { userGroup: UserGroup }) {
  const { savedDatasets, activeDataset, tryActivateByFilters } = useExcelData();

  // Filter states
  const [testType, setTestType] = useState('MT');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [includeUnder10, setIncludeUnder10] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Eng. Foundations', 'English', 'Speech Building']);
  const [selectedTests, setSelectedTests] = useState<string[]>(['December 2025 Monthly Test (ELE) (12월)']);
  const [matrixSelectedCampusName, setMatrixSelectedCampusName] = useState('');
  const [campusLookup, setCampusLookup] = useState('');

  const testOptions = useMemo(() => {
    const fromStore = savedDatasets.map((d) => d.examLabel);
    const merged = [...fromStore, ...DEFAULT_TEST_OPTIONS];
    return [...new Set(merged)];
  }, [savedDatasets]);

  const nationalRankingExamCohortCount = useMemo(
    () =>
      getExamCohortCampusCount(selectedTests, selectedYear, campusRankingMockData.length),
    [selectedTests, selectedYear],
  );

  useEffect(() => {
    if (!activeDataset) return;
    setSelectedYear(activeDataset.year);
    setTestType(activeDataset.testKind);
    setSelectedTests([activeDataset.examLabel]);
  }, [activeDataset]);

  const handleSearch = useCallback(async () => {
    const exam = selectedTests[0]?.trim();
    if (!exam) return;
    await tryActivateByFilters(selectedYear, testType, exam);
  }, [selectedTests, selectedYear, testType, tryActivateByFilters]);

  const subjectOptions = ['Eng. Foundations', 'English', 'Speech Building', 'Cultural Conn.'];

  const courseOptions = [
    'GT1', 'GT2', 'GT3', 'GT4', 
    'MGT1', 'MGT2', 'MGT3', 'MGT4', 
    'S1', 'S2', 'S3', 'S4', 
    'R1', 'R2', 'R3', 'R4', 
    'MAG1', 'MAG1+', 'MAG2', 'MAG2+', 'MAG3', 'MAG4'
  ];

  const campusOptions = CAMPUS_LIST;

  /** 데모: 순위 변동은 실데이터 연동 시 이전 기간 대비 계산값으로 대체 */
  const demoRankChanges: CampusRankChange[] = [
    { kind: 'none' },
    { kind: 'up', delta: 2.1 },
    { kind: 'same' },
    { kind: 'up', delta: 0.5 },
    { kind: 'down', delta: 1.5 },
    { kind: 'same' },
    { kind: 'up', delta: 3.0 },
    { kind: 'none' },
    { kind: 'down', delta: 0.5 },
    { kind: 'same' },
  ];

  const topCampuses = examData_2025_09.slice(0, 10).map((c, i) => ({
    rank: c.rank,
    name: c.campus,
    type: c.type,
    pScore: c.totalAvg,
    rankChange: demoRankChanges[i] ?? { kind: 'none' },
  }));

  const bottomCampuses = [...examData_2025_09].reverse().slice(0, 10).map((c, i) => ({
    rank: c.rank,
    name: c.campus,
    type: c.type,
    pScore: c.totalAvg,
    rankChange: demoRankChanges[i] ?? { kind: 'none' },
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">HQ Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">전국 캠퍼스의 핵심 지표와 운영 현황을 한눈에 모니터링하는 본사 교육사업본부용 통합 대시보드입니다.</p>
        </div>
      </div>

      {/* Search & Filter Area */}
      <DashboardFilters
        userGroup={userGroup}
        testType={testType}
        setTestType={setTestType}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        includeUnder10={includeUnder10}
        setIncludeUnder10={setIncludeUnder10}
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
        selectedCampuses={selectedCampuses}
        setSelectedCampuses={setSelectedCampuses}
        selectedSubjects={selectedSubjects}
        setSelectedSubjects={setSelectedSubjects}
        selectedTests={selectedTests}
        setSelectedTests={setSelectedTests}
        testOptions={testOptions}
        subjectOptions={subjectOptions}
        courseOptions={courseOptions}
        campusOptions={campusOptions}
        campusLookup={campusLookup}
        setCampusLookup={setCampusLookup}
        onSearch={handleSearch}
      />

      <DashboardCollapsibleSection title="요약">
        <StratosKPIOverview />
      </DashboardCollapsibleSection>

      <DashboardCollapsibleSection title="Performance Matrix" titleSuffix="점 클릭 시 캠퍼스 표 이동">
        <PerformanceMatrix hideHeading onCampusSelect={setMatrixSelectedCampusName} />
      </DashboardCollapsibleSection>

      <DashboardCollapsibleSection title="과정별·캠퍼스별 분석">
        <CourseAnalysisCharts
          testType={testType}
          selectedYear={selectedYear}
          selectedTests={selectedTests}
        />
      </DashboardCollapsibleSection>

      <DashboardCollapsibleSection title="순위 분포 및 과목 평균">
        <DistributionAndAverages />
      </DashboardCollapsibleSection>

      <DashboardCollapsibleSection title="캠퍼스 Top / Bottom Ranking">
        <AlertsAndRankings topCampuses={topCampuses} bottomCampuses={bottomCampuses} />
      </DashboardCollapsibleSection>

      <DashboardCollapsibleSection
        title="전국 캠퍼스 랭킹"
        contentClassName="px-3 pb-3 pt-0"
        titleAccessory={
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-normal text-slate-500 dark:bg-slate-700 dark:text-slate-400">
            응시 {nationalRankingExamCohortCount}개 캠퍼스
          </span>
        }
      >
        <NationalCampusRanking
          highlightedCampusName={matrixSelectedCampusName}
          selectedYear={selectedYear}
          selectedTests={selectedTests}
          selectedSubjects={selectedSubjects}
          selectedCampuses={selectedCampuses}
          filterCampusName={campusLookup.trim() || undefined}
          omitTitleHeading
          omitOuterCard
          hideExamCohortBadge
        />
      </DashboardCollapsibleSection>
    </div>
  );
}
