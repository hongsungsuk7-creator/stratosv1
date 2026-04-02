import React, { useEffect, useState } from 'react';
import { CampusDashboardFilters } from '../components/campus/CampusDashboardFilters';
import { PcRamAnalysis } from '../components/pcram/PcRamAnalysis';
import { CLASSES_DATA, PRINCIPAL_MANAGED_CAMPUSES } from '../data/campusMockData';
import { UserGroup } from '../types';

interface CampusPcRamProps {
  userGroup: UserGroup;
}

export function CampusPcRam({ userGroup: _userGroup }: CampusPcRamProps) {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [testType, setTestType] = useState('MT');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(12);
  const [includeUnder10, setIncludeUnder10] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState(['English', 'Speech Building', 'Eng. Foundations']);
  const [selectedManagedCampusId, setSelectedManagedCampusId] = useState(
    () => PRINCIPAL_MANAGED_CAMPUSES[0]?.id ?? '',
  );

  const subjectOptions = ['English', 'Speech Building', 'Eng. Foundations', 'Cultural Conn.'];

  useEffect(() => {
    const first = PRINCIPAL_MANAGED_CAMPUSES[0];
    if (!first) return;
    if (!PRINCIPAL_MANAGED_CAMPUSES.some((c) => c.id === selectedManagedCampusId)) {
      setSelectedManagedCampusId(first.id);
    }
  }, [selectedManagedCampusId]);

  const handleSearch = () => {
    setShowAnalysis(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">PC-RAM</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">전국 캠퍼스의 성과지표 (Z-Score)와 신뢰도 지표(Caution Index)를 조합해 객관적으로 등급화화여 분석합니다.</p>
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
        managedCampuses={PRINCIPAL_MANAGED_CAMPUSES}
        selectedManagedCampusId={selectedManagedCampusId}
        setSelectedManagedCampusId={setSelectedManagedCampusId}
      />

      {/* Content Area */}
      {showAnalysis ? (
        <PcRamAnalysis showAlert={false} selectedSubjects={selectedSubjects} />
      ) : (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">PC-RAM 상세 분석</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center">
            검색 조건을 선택한 후 조회 버튼을 클릭해주세요.
          </p>
        </div>
      )}
    </div>
  );
}
