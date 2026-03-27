import React, { useState } from 'react';
import { CampusDashboardFilters } from '../components/campus/CampusDashboardFilters';
import { CampusKPIOverview } from '../components/campus/CampusKPIOverview';
import { CampusPerformanceMatrix } from '../components/campus/CampusPerformanceMatrix';
import { CampusClassRankingTable } from '../components/campus/CampusClassRankingTable';
import { ClassAlertsAndRankings } from '../components/campus/ClassAlertsAndRankings';
import { StudentRiskTable } from '../components/campus/StudentRiskTable';
import { ClassAnalysisCharts } from '../components/campus/ClassAnalysisCharts';
import { CampusDistribution } from '../components/campus/CampusDistribution';
import { CLASSES_DATA } from '../data/campusMockData';
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

      {/* STRATOS KPI Overview */}
      <CampusKPIOverview />

      {/* Performance Matrix */}
      <CampusPerformanceMatrix />

      {/* Course Analysis Charts */}
      <ClassAnalysisCharts 
        testType={testType}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />

      {/* Distribution and Averages */}
      <CampusDistribution />

      {/* Alerts & Rankings */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ClassAlertsAndRankings />
        <StudentRiskTable />
      </div>

      {/* Class Ranking Table */}
      <CampusClassRankingTable 
        selectedLevel={selectedLevel}
        selectedClass={selectedClass}
        isStudentView={isStudentView}
      />

      {/* Footer Info */}
      <div className="pt-8 pb-4 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-400">
          © 2024 STRATOS Analytics System. 본 화면의 데이터는 해당 캠퍼스 및 전국 평균 데이터만을 포함하며, 타 캠퍼스의 개별 정보는 보호됩니다.
        </p>
      </div>
    </div>
  );
}
