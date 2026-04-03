import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp, AlertTriangle, Building2, Award, ShieldAlert, Target, ArrowUpDown } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Line, ComposedChart, Cell, LabelList, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  PCRAM_KPI_DATA, TOTAL_OPERATION_TYPE_DATA, REGION_DATA, STUDENT_SIZE_DATA, 
  CLASS_SIZE_DATA, OPERATION_PERIOD_DATA, PCRAM_RANKING_DATA, MATRIX_DATA
} from '../../data/pcramMockData';
import { calculateCI, calculatePScore, calculateZScore, getRiskLevel } from '@/core';
import { PCRAM_CAMPUS_2025_MT_DATA } from '@/data/pcramCampus2025MtData';
import { parseExamOptionLabel, toExamPeriodKey } from '@/utils/examPeriod';

const renderCustomBarLabel = (props: any, data: any[]) => {
  const { x, y, width, value, index } = props;
  const delta = data[index]?.delta || 0;
  return (
    <g transform={`translate(${x + width / 2},${y - 20})`}>
      <text x={0} y={0} dy={0} textAnchor="middle" className="fill-slate-800 dark:fill-slate-200" fontSize={11} fontWeight="bold">
        {value.toFixed(1)}%
      </text>
      <text x={0} y={12} dy={0} textAnchor="middle" className="fill-slate-800 dark:fill-slate-200" fontSize={10}>
        ({delta > 0 ? '+' : ''}{delta.toFixed(1)}%p)
      </text>
    </g>
  );
};

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'S': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    case 'A': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    case 'B': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
    case 'C': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20';
  }
};

const getGradeDotColor = (grade: string) => {
  switch (grade) {
    case 'S': return '#22c55e'; // green-500
    case 'A': return '#3b82f6'; // blue-500
    case 'B': return '#f97316'; // orange-500
    case 'C': return '#ef4444'; // red-500
    default: return '#64748b'; // slate-500
  }
};

const CustomTooltip = ({ active, payload, label, formatter, labelFormatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        {label && <p className="text-sm font-bold text-slate-800 dark:text-white mb-2">{labelFormatter ? labelFormatter(label) : label}</p>}
        {payload.map((entry: any, index: number) => {
          const formatted = formatter ? formatter(entry.value, entry.name, entry) : [entry.value, entry.name];
          return (
            <div key={index} className="flex items-center gap-2 text-sm mt-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600 dark:text-slate-300">{formatted[1]}:</span>
              <span className="font-bold text-slate-800 dark:text-white">{formatted[0]}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

// Reusable Section Component
const AnalysisSection = ({ title, data, showChart = true, sideBySide = false, displaySubjects = [], subjectMap = {} }: any) => {
  const [isOpen, setIsOpen] = useState(true);

  const chartTitle = `${title.replace(/^\d+\.\s*/, '')}별 Z-SCORE / CI`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
      <div 
        className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-200 dark:border-slate-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </div>
      
      {isOpen && (
        <div className="p-3">
          <div className={sideBySide ? "grid grid-cols-1 xl:grid-cols-3 gap-3" : ""}>
            <div className={`${sideBySide ? "xl:col-span-2" : "mb-4"} overflow-x-auto`}>
              <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full">
                <div className="overflow-x-auto h-full">
                  <table className="w-full text-sm text-center">
                    <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400 uppercase">
                      <tr>
                        <th className="px-1.5 py-1 font-medium rounded-tl-md border-b border-slate-200 dark:border-slate-700" rowSpan={2}>
                          {title.includes('전체/직영/분원') || title.includes('선택 캠퍼스')
                            ? '운영'
                            : title.includes('지역권역')
                              ? '구분'
                              : title.includes('운영 기간 기준')
                                ? '운영 기간'
                                : title.replace(/^\d+\.\s*/, '').replace(' 기준', '')}
                        </th>
                        <th className="px-1.5 py-1 font-medium text-right border-b border-slate-200 dark:border-slate-700" rowSpan={2}>캠퍼스수</th>
                        <th className="px-1.5 py-1 font-medium text-right border-b border-slate-200 dark:border-slate-700" rowSpan={2}>학급수</th>
                        <th className="px-1.5 py-1 font-medium text-right border-b border-slate-200 dark:border-slate-700" rowSpan={2}>학생수</th>
                        <th className="px-1.5 py-1 font-medium text-right border-b border-slate-200 dark:border-slate-700" rowSpan={2}>급당 평균학생수</th>
                        <th className="px-1.5 py-1 font-medium text-right text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-700" rowSpan={2}>점검Z</th>
                        <th className="px-1.5 py-1 font-medium text-right text-orange-500 dark:text-orange-400 border-b border-slate-200 dark:border-slate-700" rowSpan={2}>신뢰CI</th>
                        <th className="px-1.5 py-1 font-medium text-center border-l border-b border-slate-200 dark:border-slate-700" colSpan={2}>등급</th>
                        <th className="px-1.5 py-1 font-medium text-center border-l border-b border-slate-200 dark:border-slate-700" colSpan={displaySubjects.length + 1}>P-SCORE</th>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="px-1.5 py-1 font-medium text-center border-l border-slate-200 dark:border-slate-700">CI</th>
                        <th className="px-1.5 py-1 font-medium text-center">최종</th>
                        <th className="px-1.5 py-1 font-medium text-right border-l border-slate-200 dark:border-slate-700">총평균</th>
                        {displaySubjects.map((sub: string) => (
                          <th key={sub} className="px-1.5 py-1 font-medium text-right">{subjectMap[sub]?.label || sub}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-slate-600 dark:text-slate-300">
                      {data.map((row: any, idx: number) => (
                        <tr key={idx} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-1.5 py-1 font-medium text-slate-900 dark:text-white">{row.group}</td>
                          <td className="px-1.5 py-1 text-right">{row.campuses.toLocaleString()}</td>
                          <td className="px-1.5 py-1 text-right">{row.classes.toLocaleString()}</td>
                          <td className="px-1.5 py-1 text-right">{row.students.toLocaleString()}</td>
                          <td className="px-1.5 py-1 text-right">{row.avgPerClass.toFixed(1)}</td>
                          <td className="px-1.5 py-1 text-right text-blue-600 dark:text-blue-400 font-medium">{row.zScore.toFixed(1)}</td>
                          <td className="px-1.5 py-1 text-right text-orange-500 dark:text-orange-400 font-medium">{row.ci.toFixed(2)}</td>
                          <td className="px-1.5 py-1 text-center border-l border-slate-200 dark:border-slate-700">{row.ciGrade}</td>
                          <td className="px-1.5 py-1 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${getGradeColor(row.finalGrade)}`}>
                              {row.finalGrade}
                            </span>
                          </td>
                          <td className="px-1.5 py-1 text-right font-semibold text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-slate-700">
                            {row.pScore.toFixed(1)}%
                          </td>
                          {displaySubjects.map((sub: string) => (
                            <td key={sub} className="px-1.5 py-1 text-right">{row[subjectMap[sub]?.key || '']?.toFixed(1)}%</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {showChart && (
              <div className={`${sideBySide ? "xl:col-span-1" : "mt-4 w-full h-[280px]"}`}>
                {sideBySide && <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">{chartTitle}</h3>}
                <div className={sideBySide ? "bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm p-3 h-[calc(100%-2rem)] min-h-[200px]" : "h-full w-full"}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 30, right: 20, bottom: 20, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                      <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                      <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} ticks={[0, 50, 100]} tickFormatter={(val) => `${val}%`} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[-2, 3]} ticks={[-2, 0, 3]} />
                      <RechartsTooltip 
                        content={<CustomTooltip formatter={(value: number, name: string) => [name === 'pScore' ? `${value.toFixed(1)}%` : value.toFixed(2), name === 'pScore' ? 'P-SCORE' : 'Z-SCORE']} />}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar yAxisId="left" dataKey="pScore" name="P-SCORE" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={24} label={(props) => renderCustomBarLabel(props, data)}>
                        {data.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill="#94a3b8" />
                        ))}
                      </Bar>
                      <Line yAxisId="right" type="monotone" dataKey="zScore" name="Z-SCORE" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export function PcRamAnalysis({ 
  showAlert = true,
  selectedSubjects = ['English', 'Speech Building', 'Eng. Foundations'],
  selectedCampuses = [],
  showAllCampuses = true,
  selectedYear,
  selectedTests = []
}: { 
  showAlert?: boolean,
  selectedSubjects?: string[],
  selectedCampuses?: string[],
  showAllCampuses?: boolean,
  selectedYear?: number,
  selectedTests?: string[]
}) {
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const [isMatrixOpen, setIsMatrixOpen] = useState(true);

  const [sortCriteria, setSortCriteria] = useState<string>('rank');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('asc');
  const [typeFilter, setTypeFilter] = useState<string>('전체');
  const [gradeFilter, setGradeFilter] = useState<string>('전체 등급');

  const SUBJECT_MAP: { [key: string]: { label: string, key: string } } = {
    'English': { label: 'English', key: 'pScoreEng' },
    'Speech Building': { label: 'Sp. Build.', key: 'pScoreSpeech' },
    'Eng. Foundations': { label: 'Eng. Found.', key: 'pScoreFound' },
    'Cultural Conn.': { label: 'Cult. Connect.', key: 'pScoreCult' }
  };

  const displaySubjects = ['English', 'Speech Building', 'Eng. Foundations', 'Cultural Conn.'].filter(s => selectedSubjects.includes(s));
  const nationalMean = PCRAM_KPI_DATA.nationalAverage;
  const pScoreStd =
    Math.sqrt(
      MATRIX_DATA.reduce((acc, row) => {
        const match = PCRAM_RANKING_DATA.find((campus) => campus.name === row.name);
        const pScore = match?.pScore ?? nationalMean;
        const diff = pScore - nationalMean;
        return acc + diff * diff;
      }, 0) / Math.max(MATRIX_DATA.length, 1),
    ) || 1;
  const riskCampusCount = MATRIX_DATA.filter((row) => getRiskLevel(row.zScore) !== '정상군').length;
  const samplePScore = calculatePScore({ correct: 398, total: 500 });
  const sampleZ = calculateZScore({ score: samplePScore, mean: nationalMean, std: pScoreStd });
  const sampleCI = calculateCI({ scores: [72, 77, 80, 84, 79] });

  // TODO: 인증 사용자 정보가 연결되면 실제 로그인 캠퍼스로 치환
  const loginCampusKeyword = '분당';
  const normalizeCampusName = (name: string) =>
    name.replace('폴리어학원(', '').replace(')', '').trim();

  const selectedPeriodKeys = selectedTests
    .map(parseExamOptionLabel)
    .filter((period): period is { year: number; month: number } => Boolean(period))
    .map(toExamPeriodKey);
  const periodKeySet = new Set(selectedPeriodKeys);

  const pcramRows = PCRAM_CAMPUS_2025_MT_DATA.filter((row) => row.section === 'PC-RAM');
  const candidateRows =
    periodKeySet.size > 0
      ? pcramRows.filter((row) => periodKeySet.has(toExamPeriodKey({ year: row.year, month: row.month })))
      : selectedYear
        ? pcramRows.filter((row) => row.year === selectedYear)
        : pcramRows;
  const targetRows = candidateRows.length > 0 ? candidateRows : pcramRows;
  const latestPeriodKey = targetRows.reduce((max, row) => Math.max(max, toExamPeriodKey({ year: row.year, month: row.month })), 0);
  const periodRows = targetRows.filter((row) => toExamPeriodKey({ year: row.year, month: row.month }) === latestPeriodKey);

  const periodRankingData = periodRows.map((row) => {
    const base = PCRAM_RANKING_DATA.find((item) => normalizeCampusName(item.name).includes(row.campus));
    const avgPerClass = row.classes > 0 ? Number((row.students / row.classes).toFixed(1)) : base?.avgPerClass ?? 0;
    return {
      rank: row.rank,
      name: row.campus,
      type: row.operationType || base?.type || '직영',
      region: row.region || base?.region || '',
      years: base?.years ?? 0,
      classes: row.classes,
      students: row.students,
      avgPerClass,
      zScore: row.zScore,
      ci: row.ciMedian,
      grade: row.finalGrade || base?.grade || 'B',
      testType: 'MT',
      pScore: base?.pScore ?? 0,
      pScoreEng: base?.pScoreEng ?? 0,
      pScoreSpeech: base?.pScoreSpeech ?? 0,
      pScoreFound: base?.pScoreFound ?? 0,
      pScoreCult: base?.pScoreCult ?? 0,
    };
  });

  const rankingSource = periodRankingData.length > 0 ? periodRankingData : PCRAM_RANKING_DATA;
  const loginCampusRankingRow =
    rankingSource.find((row) => normalizeCampusName(row.name).includes(loginCampusKeyword)) ?? rankingSource[0];

  const section1Data = TOTAL_OPERATION_TYPE_DATA;

  const regionBenchmarkGroups = ['서울권', '경인권', '강원권', '충청권', '전라권'];
  const section2Data = regionBenchmarkGroups
    .map((g) => REGION_DATA.find((row) => row.group === g))
    .filter((row): row is (typeof REGION_DATA)[number] => row != null);

  const section3Data = STUDENT_SIZE_DATA;

  const section4Data = CLASS_SIZE_DATA;

  const operationPeriodSectionGroups = ['전체', '16년 이상', '11~15년', '6~10년', '3~5년'];
  const section5Data = operationPeriodSectionGroups
    .map((g) => OPERATION_PERIOD_DATA.find((row) => row.group === g))
    .filter((row): row is (typeof OPERATION_PERIOD_DATA)[number] => row != null);

  const section6Data = [
    { type: '직영', r1: '8(53.3%)', r2: '4(26.7%)', r3: '2(13.3%)', r4: '1(6.7%)', total: '15(100%)' },
    { type: '분원', r1: '12(28.6%)', r2: '18(42.9%)', r3: '8(19.0%)', r4: '4(9.5%)', total: '42(100%)' },
    { type: '계', r1: '20(35.1%)', r2: '22(38.6%)', r3: '10(17.5%)', r4: '5(8.8%)', total: '57(100%)' },
  ];

  const handleSortClick = (criteria: string) => {
    if (sortCriteria === criteria) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortCriteria(criteria);
      setSortDirection('desc');
    }
  };

  const filteredRankingData = showAllCampuses
    ? rankingSource
    : selectedCampuses.length > 0
      ? rankingSource.filter((row) => selectedCampuses.some((campus) => normalizeCampusName(row.name).includes(campus)))
      : [loginCampusRankingRow];

  const sortedRankingData = [...filteredRankingData].sort((a, b) => {
    const valA = (a as any)[sortCriteria];
    const valB = (b as any)[sortCriteria];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'desc' 
        ? valB.localeCompare(valA) 
        : valA.localeCompare(valB);
    }
    
    const numA = valA as number;
    const numB = valB as number;
    return sortDirection === 'desc' ? numB - numA : numA - numB;
  });

  const SortButton = ({ criteria, label, align = 'center' }: { criteria: string, label: string, align?: 'center' | 'right' | 'left' }) => {
    const isActive = sortCriteria === criteria;
    
    return (
      <button 
        onClick={() => handleSortClick(criteria)}
        className={`group flex items-center gap-1 w-full transition-colors ${
          align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
        } ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400'}`}
      >
        <span className="font-semibold whitespace-nowrap">{label}</span>
        {isActive ? (
          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />
        ) : (
          <ArrowUpDown className="w-3 h-3 shrink-0 opacity-40 group-hover:opacity-100" />
        )}
      </button>
    );
  };

  return (
    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            분석 결과
          </h2>
          {showAlert && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800/50 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              위험/주의 캠퍼스 {riskCampusCount}개 (룰: Z&lt;-1.5 위험군, Z&lt;-0.5 주의군)
            </div>
          )}
        </div>
        <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm">
          <Download className="w-4 h-4" />
          <span>Excel 다운로드</span>
        </button>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 px-1">
        Core 엔진 샘플 계산: P-SCORE {samplePScore.toFixed(1)} / Z {sampleZ.toFixed(2)} / CI {sampleCI.toFixed(2)}
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-xs font-medium">전체 캠퍼스</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {PCRAM_KPI_DATA.totalCampuses}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">개</span>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-800/30 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium">S등급 (상향 완성형)</span>
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300 flex items-baseline">
            {PCRAM_KPI_DATA.sGradeCount}
            <span className="text-sm font-normal ml-1">개</span>
            <span className="text-xs font-normal text-green-600/70 dark:text-green-400/70 ml-2">전체의 {PCRAM_KPI_DATA.sGradePercentage}%</span>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-800/30 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-medium">C등급 (관리 부재형)</span>
          </div>
          <div className="text-2xl font-bold text-red-700 dark:text-red-300 flex items-baseline">
            {PCRAM_KPI_DATA.cGradeCount}
            <span className="text-sm font-normal ml-1">개</span>
            <span className="text-xs font-normal text-red-600/70 dark:text-red-400/70 ml-2">이상 없음</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center md:col-span-2">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <Award className="w-4 h-4" />
            <span className="text-xs font-medium">전국 평균 정답률</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white flex items-baseline">
            {PCRAM_KPI_DATA.nationalAverage.toFixed(1)}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">%</span>
            <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-2">응시생 {PCRAM_KPI_DATA.totalStudents}명</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <AnalysisSection title="1. 전체/직영/분원 기준" data={section1Data} sideBySide={true} displaySubjects={displaySubjects} subjectMap={SUBJECT_MAP} />
      <AnalysisSection title="2. 지역권역 기준" data={section2Data} sideBySide={true} displaySubjects={displaySubjects} subjectMap={SUBJECT_MAP} />
      <AnalysisSection title="3. 학생수 기준" data={section3Data} sideBySide={true} displaySubjects={displaySubjects} subjectMap={SUBJECT_MAP} />
      <AnalysisSection title="4. 학급수 기준" data={section4Data} sideBySide={true} displaySubjects={displaySubjects} subjectMap={SUBJECT_MAP} />
      <AnalysisSection title="5. 운영 기간 기준" data={section5Data} sideBySide={true} displaySubjects={displaySubjects} subjectMap={SUBJECT_MAP} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Section 6: 순위 */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">6. 순위</h3>
          </div>
          <div className="p-3 flex-1 flex flex-col">
            <div className="overflow-x-auto mt-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-600 bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-1.5 py-1 font-semibold">구분</th>
                    <th className="px-1.5 py-1 font-semibold text-center">1위-10위</th>
                    <th className="px-1.5 py-1 font-semibold text-center">11위-20위</th>
                    <th className="px-1.5 py-1 font-semibold text-center">21위-30위</th>
                    <th className="px-1.5 py-1 font-semibold text-center">31위-40위</th>
                    <th className="px-1.5 py-1 font-bold text-center text-blue-600 dark:text-blue-400">계</th>
                  </tr>
                </thead>
                <tbody>
                  {section6Data.map((row, idx) => (
                    <tr 
                      key={idx} 
                      className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                    >
                      <td className="px-1.5 py-1 text-slate-700 dark:text-slate-300">
                        {row.type}
                      </td>
                      <td className="px-1.5 py-1 text-center text-slate-600 dark:text-slate-400">{row.r1}</td>
                      <td className="px-1.5 py-1 text-center text-slate-600 dark:text-slate-400">{row.r2}</td>
                      <td className="px-1.5 py-1 text-center text-slate-600 dark:text-slate-400">{row.r3}</td>
                      <td className="px-1.5 py-1 text-center text-slate-600 dark:text-slate-400">{row.r4}</td>
                      <td className="px-1.5 py-1 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 7: 과목별 전국 평균 정답률 */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">7. 과목별 전국 평균 정답률</h3>
          </div>
          <div className="p-3 flex-1 min-h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displaySubjects.map(sub => {
                const mockData: any = {
                  'English': { value: 75.6, color: '#3b82f6' },
                  'Speech Building': { value: 85.2, color: '#22c55e' },
                  'Eng. Foundations': { value: 78.6, color: '#f97316' },
                  'Cultural Conn.': { value: 82.1, color: '#8b5cf6' }
                };
                return {
                  subject: SUBJECT_MAP[sub]?.label || sub,
                  value: mockData[sub]?.value || 0,
                  color: mockData[sub]?.color || '#6366f1'
                };
              })} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis 
                  dataKey="subject" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  domain={[0, 100]} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#94a3b8', opacity: 0.1 }} 
                  content={<CustomTooltip formatter={(value: number) => [`${value}%`, '정답률']} />}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                  {displaySubjects.map((sub: string, index: number) => {
                    const colors: any = {
                      'English': '#3b82f6',
                      'Speech Building': '#22c55e',
                      'Eng. Foundations': '#f97316',
                      'Cultural Conn.': '#8b5cf6'
                    };
                    return <Cell key={`cell-${index}`} fill={colors[sub] || '#6366f1'} />;
                  })}
                  <LabelList dataKey="value" position="top" formatter={(val: number) => `${val}%`} className="fill-slate-600 dark:fill-slate-300" fontSize={12} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section 8: 등급 분포 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">8. 등급 분포</h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border border-green-100 dark:border-green-800/30">
            <div className="flex justify-between items-start mb-2">
              <div className="text-2xl font-black text-green-600 dark:text-green-400">S</div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-800 dark:text-green-300">상향 완성형</div>
                <div className="text-xs text-green-600/80 dark:text-green-400/80">Z &gt; 0, CI A+</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-green-200/50 dark:border-green-800/50 flex justify-between items-end">
              <div className="text-xs text-green-700 dark:text-green-400">이번 시험:</div>
              <div className="text-lg font-bold text-green-700 dark:text-green-300">13개</div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
            <div className="flex justify-between items-start mb-2">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">A</div>
              <div className="text-right">
                <div className="text-sm font-bold text-blue-800 dark:text-blue-300">상향 불안형</div>
                <div className="text-xs text-blue-600/80 dark:text-blue-400/80">Z &gt; 0, CI B</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200/50 dark:border-blue-800/50 flex justify-between items-end">
              <div className="text-xs text-blue-700 dark:text-blue-400">이번 시험:</div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">0개</div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4 border border-orange-100 dark:border-orange-800/30">
            <div className="flex justify-between items-start mb-2">
              <div className="text-2xl font-black text-orange-600 dark:text-orange-400">B</div>
              <div className="text-right">
                <div className="text-sm font-bold text-orange-800 dark:text-orange-300">하향 평준형</div>
                <div className="text-xs text-orange-600/80 dark:text-orange-400/80">Z ≤ 0, CI A+/B</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-orange-200/50 dark:border-orange-800/50 flex justify-between items-end">
              <div className="text-xs text-orange-700 dark:text-orange-400">이번 시험:</div>
              <div className="text-lg font-bold text-orange-700 dark:text-orange-300">14개</div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-100 dark:border-red-800/30">
            <div className="flex justify-between items-start mb-2">
              <div className="text-2xl font-black text-red-600 dark:text-red-400">C</div>
              <div className="text-right">
                <div className="text-sm font-bold text-red-800 dark:text-red-300">관리 부재형</div>
                <div className="text-xs text-red-600/80 dark:text-red-400/80">CI C (≥0.80)</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-red-200/50 dark:border-red-800/50 flex justify-between items-end">
              <div className="text-xs text-red-700 dark:text-red-400">이번 시험:</div>
              <div className="text-lg font-bold text-red-700 dark:text-red-300">0개</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 9: Performance Matrix */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
        <div 
          className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-200 dark:border-slate-700"
          onClick={() => setIsMatrixOpen(!isMatrixOpen)}
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">9. Performance Matrix</h3>
          {isMatrixOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
        
        {isMatrixOpen && (
          <div className="p-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis 
                    type="number" 
                    dataKey="zScore" 
                    name="Z-SCORE" 
                    domain={[-3, 3]} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    label={{ value: 'Z-SCORE', position: 'bottom', fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="ci" 
                    name="CI" 
                    domain={[0.4, 0.9]} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    label={{ value: 'CI', angle: -90, position: 'left', fill: '#64748b', fontSize: 12 }}
                    reversed
                  />
                  <ZAxis type="category" dataKey="name" name="캠퍼스" />
                  <RechartsTooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={<CustomTooltip 
                      formatter={(value: any, name: string) => {
                        if (name === 'Z-SCORE') return [value.toFixed(2), 'Z-SCORE'];
                        if (name === 'CI') return [value.toFixed(2), 'CI'];
                        return [value, name];
                      }}
                      labelFormatter={(label: any) => `캠퍼스: ${label}`}
                    />}
                  />
                  <Scatter name="Campuses" data={MATRIX_DATA}>
                    {MATRIX_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getGradeDotColor(entry.grade)} />
                    ))}
                  </Scatter>
                  {/* Quadrant Lines */}
                  <line x1={0} y1={0.4} x2={0} y2={0.9} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                  <line x1={-3} y1={0.65} x2={3} y2={0.65} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                  <line x1={-3} y1={0.80} x2={3} y2={0.80} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Section 10: PC-RAM 분석 가이드 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
        <div 
          className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-200 dark:border-slate-700"
          onClick={() => setIsGuideOpen(!isGuideOpen)}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">10. PC-RAM 분석 가이드</h3>
          </div>
          {isGuideOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
        
        {isGuideOpen && (
          <div className="p-6 bg-slate-50/50 dark:bg-slate-900/20 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
              <p className="text-base">
                📊 <strong className="text-slate-800 dark:text-white">PC-RAM 캠퍼스 대시보드 개요</strong> — 전국 직영 캠퍼스의 성과(Z-Score)와 학습 신뢰도(CI)를 결합하여 운영 품질을 S/A/B/C 4등급으로 정량 진단하는 대시보드입니다. 성취도가 높아도 학습 패턴이 불안정하면 위험 캠퍼스로 분류하여, 단순 점수 순위로는 발견할 수 없는 잠재 위기를 조기에 탐지합니다. ESC는 직영 캠퍼스만을 대상으로 합니다.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">1. 핵심 지표 정의 및 계산식</h4>
              <div className="space-y-3 pl-2">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">① Z-Score (점검Z, 2단계 표준화 성취지수)</p>
                  <p>캠퍼스 전체 학생의 평균 성취 수준을 전국 기준으로 표준화한 점수입니다. STRATOS v1.2 §1 정의.</p>
                  <div className="text-xs text-slate-500 space-y-1 mt-1">
                    <p>Step 1 — 과목별 표준화: zik = (xik − μk) / σk</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>xik: 학생 i의 과목 k 정답률 (0~1)</li>
                      <li>μk, σk: 과목 k 전국 평균/표준편차 (ddof=0)</li>
                      <li>기준 모집단: 전체 캠퍼스(직영+분원)로 μk, σk 산출 — ESC는 표시만 직영 필터링</li>
                      <li>소규모 캠퍼스(≤5명)는 전국 기준값 산출에서 제외 (SMALL_CAMPUS_THRESHOLD=5)</li>
                    </ul>
                    <p className="mt-2">Step 2 — 복합 표준화: Si = mean(zik), Zicomp = (Si − μS) / σS</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Si: 학생 i의 응시 과목 Z평균 (v1.2: sum→mean 변경, 선택과목 편향 보정)</li>
                      <li>μS, σS: 전국 Si 분포의 평균/표준편차 (ddof=0, 대규모 캠퍼스 기준)</li>
                    </ul>
                  </div>
                  <p className="mt-2">캠퍼스 Z: ZC = mean(Zicomp for i ∈ C)</p>
                  <ul className="list-disc pl-5 text-xs space-y-1 mt-1">
                    <li>양수(+): 전국 평균 초과 → 성취 우수</li>
                    <li>음수(−): 전국 평균 미달</li>
                  </ul>
                  <p className="text-xs italic mt-1">예) Z=+0.486 → 전국 평균보다 0.486σ 우수</p>
                </div>

                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">② CI (Caution Index, 신뢰도 지수)</p>
                  <p>S-P분석(Student-Problem Analysis) 기반 학습 응답 패턴의 일관성을 측정합니다. STRATOS v1.2 §6.4 정의.</p>
                  <p className="text-xs text-slate-500">학생별 CI 계산: CIi = 1 − Cov(ui, P) / Cov(ui*, P)</p>
                  <ul className="list-disc pl-5 text-xs space-y-1 mt-1">
                    <li>ui: 학생 i의 실제 응답 벡터 (정답=1, 오답=0)</li>
                    <li>ui*: 이상적 응답 벡터 (문항 난이도 순으로 학생 점수만큼 정답 배치)</li>
                    <li>P: 문항별 전국 정답률 벡터 (pj)</li>
                  </ul>
                  <div className="mt-2 p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs">
                    <p className="font-bold mb-1">BigQuery 5-CTE 파이프라인:</p>
                    <p>① campus_student_counts: 캠퍼스별 학생수 (소규모 제외용)</p>
                    <p>② item_pvalues: 문항별 pj + item_rank (pj 내림차순, 대규모 캠퍼스만)</p>
                    <p>③ student_scores: 학생별 총점</p>
                    <p>④ responses: sum_p, sum_xp, sum_xp_star 중간값</p>
                    <p>⑤ Python CI: cov_real = mean_xp − mean_x·mean_p, cov_star = mean_xp_star − mean_x·mean_p, CI = 1 − cov_real/cov_star, [0,1] 클램프</p>
                  </div>
                  <p className="mt-2">캠퍼스 CI: CĨC = Median({"{CIi | i ∈ C}"})</p>
                  <ul className="list-disc pl-5 text-xs space-y-1 mt-1">
                    <li>중앙값 사용 (이상치에 강건)</li>
                    <li>0에 가까울수록 안정적 학습 패턴, 1에 가까울수록 불규칙 패턴</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">③ CI 등급 — 캠퍼스 복합 규칙 (§6.4)</p>
                  <p>캠퍼스 CI 등급은 CI Median + CI Risk Ratio 두 지표의 복합 규칙으로 판정합니다.</p>
                  <ul className="list-disc pl-5 text-xs space-y-1 mt-1">
                    <li><strong>C (불안정):</strong> CImedian ≥ 0.75 OR RC ≥ 30% — 어느 한 조건이라도 해당</li>
                    <li><strong>A+ (안정):</strong> CImedian ≤ 0.65 AND RC ≤ 10% — 두 조건 모두 충족</li>
                    <li><strong>B (보통):</strong> 나머지 — A+도 C도 아닌 영역</li>
                  </ul>
                  <p className="text-xs text-slate-500 mt-1">임계값: CI_GRADE_THRESHOLD_A=0.65, CI_GRADE_THRESHOLD_B=0.75, CI_RISK_RATIO_A_THRESHOLD=10%, CI_RISK_RATIO_C_THRESHOLD=30%</p>
                </div>

                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">④ CI Risk Ratio (위험 비율)</p>
                  <p>캠퍼스 내 CI가 위험 수준을 초과하는 학생의 비율입니다.</p>
                  <p className="text-xs text-slate-500">계산식: RC = |{"{i ∈ C | CIi > 0.5}"}| / |C| × 100 (%)</p>
                  <ul className="list-disc pl-5 text-xs space-y-1 mt-1">
                    <li>위험 임계치: CI_STUDENT_RISK_THRESHOLD=0.5 (MCI)</li>
                    <li>RC ≤ 10%: 양호, 10~30%: 주의, ≥ 30%: 위기(C등급 트리거)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">⑤ Final Grade (최종등급, 4분면 진단)</p>
                  <p>Z-Score × CI등급 2차원 조합으로 캠퍼스를 4개 유형으로 분류합니다.</p>
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full text-xs border-collapse border border-slate-200 dark:border-slate-700">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800">
                          <th className="border border-slate-200 dark:border-slate-700 p-1"></th>
                          <th className="border border-slate-200 dark:border-slate-700 p-1">CI A+ (안정)</th>
                          <th className="border border-slate-200 dark:border-slate-700 p-1">CI B (보통)</th>
                          <th className="border border-slate-200 dark:border-slate-700 p-1">CI C (불안정)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-200 dark:border-slate-700 p-1 font-bold">Z &gt; 0</td>
                          <td className="border border-slate-200 dark:border-slate-700 p-1 text-emerald-600 dark:text-emerald-400 font-bold">S 상향완성형</td>
                          <td className="border border-slate-200 dark:border-slate-700 p-1 text-blue-600 dark:text-blue-400 font-bold">A 상향불안형</td>
                          <td className="border border-slate-200 dark:border-slate-700 p-1 text-rose-600 dark:text-rose-400 font-bold">C 관리부재형</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-200 dark:border-slate-700 p-1 font-bold">Z ≤ 0</td>
                          <td className="border border-slate-200 dark:border-slate-700 p-1 text-amber-600 dark:text-amber-400 font-bold">B 하향평준형</td>
                          <td className="border border-slate-200 dark:border-slate-700 p-1 text-amber-600 dark:text-amber-400 font-bold">B 하향평준형</td>
                          <td className="border border-slate-200 dark:border-slate-700 p-1 text-rose-600 dark:text-rose-400 font-bold">C 관리부재형</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <ul className="list-disc pl-5 text-xs space-y-1 mt-2">
                    <li><strong>S (상향완성형):</strong> 성과 우수 + 신뢰도 높음 → 모범 캠퍼스, 벤치마크 대상</li>
                    <li><strong>A (상향불안형):</strong> 성과 우수이나 신뢰도 보통 → 일부 학생 응답 패턴 불안정, 모니터링</li>
                    <li><strong>B (하향평준형):</strong> 성과 미달이나 신뢰도 양호 → 커리큘럼 보강으로 향상 가능</li>
                    <li><strong>C (관리부재형):</strong> CI등급 C → 학습 신뢰도 위기, 즉각 개입 필요</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">⑥ P-Score (총평균 정답률)</p>
                  <p>캠퍼스 전체 학생의 평균 정답률(%).</p>
                  <p className="text-xs text-slate-500">계산식: P-Score = SUM(CORRECT_YN='Y') / COUNT(*) × 100</p>
                  <ul className="list-disc pl-5 text-xs space-y-1 mt-1">
                    <li>Z-Score와 CI가 상대적 위치와 신뢰도를 측정한다면, P-Score는 절대적 성취 수준을 나타냄</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">2. KPI 카드 (5개) 상세 해설</h4>
              <ul className="space-y-2 pl-2">
                <li>❶ <strong>S등급 캠퍼스:</strong> S(상향완성형) 등급 캠퍼스 수. Z &gt; 0 + CI A+. 성과와 신뢰도 모두 우수한 모범 캠퍼스.</li>
                <li>❷ <strong>A등급 캠퍼스:</strong> A(상향불안형) 등급 캠퍼스 수. Z &gt; 0 + CI B. 성과는 우수하나 신뢰도 보통 — 잠재 위험 모니터링.</li>
                <li>❸ <strong>B등급 캠퍼스:</strong> B(하향평준형) 등급 캠퍼스 수. Z ≤ 0 + CI A+/B. 성과 미달이나 학습 태도 양호 — 성취 향상 잠재력.</li>
                <li>❹ <strong>C등급 캠퍼스:</strong> C(관리부재형) 등급 캠퍼스 수. CI C. 즉각적 관리 대상. 이 수가 0이어야 이상적.</li>
                <li>❺ <strong>소규모 캠퍼스 경고:</strong> 응시 인원 ≤ 5명인 캠퍼스 수. 전국 기준값(μk, σk) 산출에서 제외되며, Z-Score 신뢰도가 낮아 해석에 주의가 필요합니다.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">3. 차트 및 테이블 해설</h4>
              <div className="space-y-3 pl-2">
                <p>📋 <strong>전체/직영/분원 기준 (상세표):</strong> 직영 캠퍼스를 P-Score 내림차순으로 나열. 캠퍼스명, 운영주체, 지역, 운영기간, 학급수, 학생수, 급당평균, Z-Score, CI(Median), CI등급, 최종등급, 진단유형, 총평균(%), 과목별 정답률을 모두 표시. 등급별 행 배경 색상으로 직관적 구분.</p>
                <p>📊 <strong>벤치마크 기준표 5종:</strong> 동일 조건 캠퍼스끼리 공정한 비교를 제공합니다 (지역권역별, 학생수별, 학급수별, 운영기간별, 순위구간별). 각 테이블 옆에 ComposedChart(Bar=Z-Score, Line=CI) 차트가 페어링됩니다.</p>
                <p>📋 <strong>순위구간별 지역권역 분포 (크로스탭):</strong> Z-Score 순위를 구간으로 분류하고 각 구간에서 지역권역 비중을 크로스탭 표시. 어느 지역이 상위/하위 구간에 집중되는지 파악.</p>
                <p>🎯 <strong>과목별 전국 평균 정답률 (게이지):</strong> 전국 직영 캠퍼스의 과목별 평균 정답률을 반원형 게이지로 시각화. 과목 간 성취 격차를 한눈에 확인.</p>
                <p>🔵 <strong>Performance Matrix (Z-Score × CI 산점도):</strong> X축=Z-Score, Y축=CI(0~1). 최종등급별 색상(S=초록, A=파랑, B=노랑, C=빨강)으로 4분면 시각화. 가로 기준선: CI=0.65(A+/B 경계), CI=0.75(B/C 경계). 세로 기준선: Z=0 (전국 평균).</p>
                <p>📑 <strong>전국 캠퍼스 랭킹 테이블:</strong> 2단 헤더 구조로 상세 지표 및 P-SCORE 그룹을 표시. 검색, 필터, 정렬 기능을 지원하며 지표별 색상 강조가 적용됩니다.</p>
                <p>🏷️ <strong>등급 범례 카드:</strong> S/A/B/C 4등급별 조건·설명·캠퍼스 수를 카드 형태로 표시하여 전체 등급 분포를 한눈에 파악할 수 있습니다.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">4. 데이터 산출 파이프라인</h4>
              <div className="pl-2 space-y-2 text-xs">
                <p><strong>에이전트 실행 흐름:</strong> ESC PC-RAM 에이전트 → PCRamAgent 위임 → Z-Score 산출 → CI 데이터 조회 및 계산 → 등급 판정 → 직영 필터 및 재순위 → 전국 요약 및 집계</p>
                <p><strong>필터 조건:</strong> YEAR_CODE, EXAM_CODE, COURSE_NAME, SUBJECT_NAME, 제외 옵션이 실시간 반영됩니다.</p>
                <p><strong>수치 정밀도:</strong> 모든 지표 소수점 3자리(DECIMAL_PRECISION=3). 표준편차 ddof=0. CI는 [0,1] 클램프. Z-Score 기준 모집단은 전체 캠퍼스(직영+분원).</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">5. 활용 가이드</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>4분면 기반 캠퍼스 운영 진단:</strong> S(모범), A(상향불안), B(하향평준), C(관리부재) 유형별 맞춤형 개입 전략을 수립합니다.</li>
                <li><strong>CI Risk Ratio 모니터링:</strong> RC ≥ 30%인 경우 즉각적인 학습 신뢰도 위기로 판단하고 개입합니다.</li>
                <li><strong>벤치마크 활용:</strong> 동일 지역·규모·연차 캠퍼스 대비 상대적 성과와 신뢰도를 비교하여 공정한 평가를 수행합니다.</li>
                <li><strong>드릴다운 활용:</strong> 캠퍼스 선택 시 수강반 또는 학생 레벨로 전환하여 문제의 근본 원인을 분석합니다.</li>
              </ul>
            </div>
          </div>
        )}
      </div>



      {/* Section 11: CAMPUS RANKING TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex flex-col xl:flex-row items-center justify-between gap-3">
          <div className="flex-1 flex justify-start w-full xl:w-auto">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              11. 전국 캠퍼스 PC-RAM 랭킹 <span className="text-sm font-normal text-slate-500 ml-1">(총 {filteredRankingData.length}개)</span>
            </h3>
          </div>
          
          <div className="flex-none flex justify-center items-center gap-3 flex-wrap w-full xl:w-auto">
            <div className="flex gap-1">
              {['전체', '직영', '분원'].map(type => (
                <button 
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    typeFilter === type 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
            <div className="flex gap-1">
              {['전체 등급', 'S등급', 'A등급', 'B등급', 'C등급'].map(grade => {
                const isActive = gradeFilter === grade;
                let activeClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
                if (grade === 'S등급') activeClass = 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
                if (grade === 'A등급') activeClass = 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
                if (grade === 'B등급') activeClass = 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
                if (grade === 'C등급') activeClass = 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
                
                return (
                  <button 
                    key={grade}
                    onClick={() => setGradeFilter(grade)}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      isActive 
                        ? activeClass 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {grade}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 flex justify-end w-full xl:w-auto">
            <button className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md transition-colors text-xs font-medium shadow-sm">
              <Download className="w-3.5 h-3.5" />
              <span>Excel 다운로드</span>
            </button>
          </div>
        </div>
        
        <div className="max-h-[min(520px,65vh)] overflow-auto">
          <table className="w-full text-sm text-center whitespace-nowrap">
            <thead className="sticky top-0 z-10 text-xs text-slate-500 bg-slate-50 shadow-sm dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th className="px-2 py-2 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>
                  <SortButton criteria="rank" label="순위" />
                </th>
                <th className="px-2 py-2 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>
                  <SortButton criteria="name" label="캠퍼스명" align="left" />
                </th>
                <th className="px-2 py-2 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>
                  <SortButton criteria="type" label="운영주체" />
                </th>
                <th className="px-2 py-2 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>
                  <SortButton criteria="region" label="지역권역" />
                </th>
                <th className="px-2 py-2 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>
                  <SortButton criteria="years" label="운영 연수" align="right" />
                </th>
                <th className="px-2 py-2 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>
                  <SortButton criteria="classes" label="학급수" align="right" />
                </th>
                <th className="px-2 py-2 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>
                  <SortButton criteria="students" label="학생수" align="right" />
                </th>
                <th className="px-2 py-2 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>
                  <SortButton criteria="avgPerClass" label="급당 평균학생수" align="right" />
                </th>
                <th className="px-2 py-2 font-medium text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-700" rowSpan={2}>
                  <SortButton criteria="zScore" label="점검Z" align="right" />
                </th>
                <th className="px-2 py-2 font-medium text-orange-500 dark:text-orange-400 border-b border-slate-200 dark:border-slate-700" rowSpan={2}>
                  <SortButton criteria="ci" label="신뢰CI" align="right" />
                </th>
                <th className="px-2 py-2 font-medium border-b border-slate-200 dark:border-slate-700 border-l" colSpan={2}>등급</th>
                <th className="px-2 py-2 font-medium border-b border-slate-200 dark:border-slate-700 border-l" colSpan={displaySubjects.length + 1}>P-SCORE</th>
              </tr>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-2 py-2 font-medium border-l border-slate-200 dark:border-slate-700">
                  <SortButton criteria="ci" label="CI" />
                </th>
                <th className="px-2 py-2 font-medium">
                  <SortButton criteria="grade" label="최종" />
                </th>
                <th className="px-2 py-2 font-medium border-l border-slate-200 dark:border-slate-700">
                  <SortButton criteria="pScore" label="총평균" align="right" />
                </th>
                {displaySubjects.map((sub: string) => (
                  <th key={sub} className="px-2 py-2 font-medium">
                    <SortButton criteria={SUBJECT_MAP[sub]?.key || ''} label={SUBJECT_MAP[sub]?.label || sub} align="right" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              {sortedRankingData.map((row, idx) => (
                <tr key={idx} className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${idx < 3 ? 'bg-orange-50/30 dark:bg-orange-900/10' : ''}`}>
                  <td className="px-2 py-2 font-medium">{row.rank}</td>
                  <td className="px-2 py-2 font-bold text-slate-800 dark:text-white">{row.name}</td>
                  <td className="px-2 py-2">{row.type}</td>
                  <td className="px-2 py-2">{row.region}</td>
                  <td className="px-2 py-2">{row.years}</td>
                  <td className="px-2 py-2">{row.classes}</td>
                  <td className="px-2 py-2">{row.students}</td>
                  <td className="px-2 py-2">{row.avgPerClass.toFixed(1)}</td>
                  <td className="px-2 py-2 font-bold text-blue-600 dark:text-blue-400">{row.zScore.toFixed(1)}</td>
                  <td className="px-2 py-2 font-bold text-orange-500 dark:text-orange-400">{row.ci.toFixed(2)}</td>
                  <td className="px-2 py-2 border-l border-slate-200 dark:border-slate-700">{row.ci < 0.65 ? 'A+' : row.ci < 0.80 ? 'B' : 'C'}</td>
                  <td className="px-2 py-2">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${getGradeColor(row.grade)}`}>
                      {row.grade}
                    </span>
                  </td>
                  <td className="px-2 py-2 font-semibold text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-slate-700">{row.pScore.toFixed(1)}%</td>
                  {displaySubjects.map((sub: string) => (
                    <td key={sub} className="px-2 py-2">{row[SUBJECT_MAP[sub]?.key || '']?.toFixed(1)}%</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
