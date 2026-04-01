import React, { useState } from 'react';
import { CampusDashboardFilters } from '../components/campus/CampusDashboardFilters';
import { CampusKPIOverview } from '../components/campus/CampusKPIOverview';
import { CampusPerformanceMatrix } from '../components/campus/CampusPerformanceMatrix';
import { CampusClassRankingTable } from '../components/campus/CampusClassRankingTable';
import { ClassAlertsAndRankings } from '../components/campus/ClassAlertsAndRankings';
import { StudentRiskTable } from '../components/campus/StudentRiskTable';
import { ClassAnalysisCharts } from '../components/campus/ClassAnalysisCharts';
import { CampusDistribution } from '../components/campus/CampusDistribution';
import { DashboardCollapsibleSection } from '../components/dashboard/DashboardCollapsibleSection';
import { CLASSES_DATA, STUDENTS_DATA } from '../data/campusMockData';
import { UserGroup } from '../types';

interface CampusDashboardProps {
  userGroup: UserGroup;
}

export function CampusDashboard({ userGroup: _userGroup }: CampusDashboardProps) {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isStudentView, setIsStudentView] = useState(false);
  const [testType, setTestType] = useState('MT');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(12);
  const [includeUnder10, setIncludeUnder10] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState(['English', 'Speech Building', 'Eng. Foundations']);

  const subjectOptions = ['English', 'Speech Building', 'Eng. Foundations', 'Cultural Conn.'];

  const handleSearch = () => {
    if (selectedClass !== 'all') {
      setIsStudentView(true);
    } else {
      setIsStudentView(false);
    }
  };

  const classRankingCount = isStudentView
    ? STUDENTS_DATA.filter((s) => selectedClass === 'all' || s.classId === selectedClass).length
    : CLASSES_DATA.filter((c) => selectedLevel === 'all' || c.level === selectedLevel).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Campus Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">캠퍼스의 핵심 지표와 반별/학생별 성취도를 한눈에 모니터링하는 통합 대시보드입니다.</p>
        </div>
      </div>

      {/* Search & Filter Area */}
      <CampusDashboardFilters 
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        classes={CLASSES_DATA}
        onSearch={handleSearch}
        testType={testType}
        setTestType={setTestType}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        includeUnder10={includeUnder10}
        setIncludeUnder10={setIncludeUnder10}
        selectedSubjects={selectedSubjects}
        setSelectedSubjects={setSelectedSubjects}
        subjectOptions={subjectOptions}
      />

      <DashboardCollapsibleSection title="요약">
        <CampusKPIOverview omitOuterCard />
      </DashboardCollapsibleSection>

      <DashboardCollapsibleSection
        title="Performance Matrix"
        titleAccessory={
          <span className="shrink-0 pl-3 text-sm font-normal text-slate-500 sm:pl-5 dark:text-slate-400">
            학급별 성과 분석 (전국 평균 대비)
          </span>
        }
      >
        <CampusPerformanceMatrix />
      </DashboardCollapsibleSection>

      <DashboardCollapsibleSection title="과정별·학급별 분석">
        <ClassAnalysisCharts 
          testType={testType}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      </DashboardCollapsibleSection>

      <DashboardCollapsibleSection title="순위 분포 및 과목 평균">
        <CampusDistribution />
      </DashboardCollapsibleSection>

      <DashboardCollapsibleSection title="학급 Top / Bottom Ranking 및 학생 리스크">
        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
          <ClassAlertsAndRankings />
          <StudentRiskTable />
        </div>
      </DashboardCollapsibleSection>

      <DashboardCollapsibleSection
        title={isStudentView ? '학생별 성취도 상세' : '캠퍼스 학급별 랭킹'}
        contentClassName="px-3 pb-3 pt-0"
        titleAccessory={
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-normal text-slate-500 dark:bg-slate-700 dark:text-slate-400">
            {classRankingCount}개 {isStudentView ? '학생' : '학급'}
          </span>
        }
      >
        <CampusClassRankingTable 
          selectedLevel={selectedLevel}
          selectedClass={selectedClass}
          isStudentView={isStudentView}
        />
      </DashboardCollapsibleSection>

      {/* Footer Info */}
      <div className="pt-8 pb-4 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-400">
          © 2024 STRATOS Analytics System. 본 화면의 데이터는 해당 캠퍼스 및 전국 평균 데이터만을 포함하며, 타 캠퍼스의 개별 정보는 보호됩니다.
        </p>
      </div>
    </div>
  );
}
