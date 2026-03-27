import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp, Sparkles, Trophy, Building2, Users, GraduationCap, Award } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Line, ComposedChart, Cell, LabelList
} from 'recharts';
import { 
  PSCORE_KPI_DATA, PSCORE_AWARD_DATA, REGION_DATA, STUDENT_SIZE_DATA, 
  CLASS_SIZE_DATA, OPERATION_PERIOD_DATA 
} from '../../data/pscoreMockData';
import { NationalCampusRanking } from '../dashboard/NationalCampusRanking';

const TOTAL_OPERATION_TYPE_DATA = [
  { group: '전체', campuses: 27, classes: 65, students: 511, avgPerClass: 7.9, scCv: 0.15, balanceCV: 5.8, checkZ: 0.8, trustCI: 95.2, gradeCI: 'A', gradeFinal: 'A', pScore: 79.8, pScoreEng: 75.6, pScoreSpeech: 85.2, pScoreFound: 78.6, pScoreCult: 80.1, delta: 0 },
  { group: '직영', campuses: 2, classes: 13, students: 129, avgPerClass: 9.9, scCv: 0.12, balanceCV: 5.4, checkZ: 1.2, trustCI: 98.5, gradeCI: 'A+', gradeFinal: 'A+', pScore: 86.0, pScoreEng: 82.2, pScoreSpeech: 92.5, pScoreFound: 83.4, pScoreCult: 85.8, delta: 3.4 },
  { group: '분원', campuses: 25, classes: 52, students: 382, avgPerClass: 7.3, scCv: 0.16, balanceCV: 6.0, checkZ: 0.7, trustCI: 94.8, gradeCI: 'A', gradeFinal: 'A', pScore: 79.3, pScoreEng: 75.1, pScoreSpeech: 84.6, pScoreFound: 78.2, pScoreCult: 79.5, delta: -3.4 },
];

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

// Reusable Section Component
const AnalysisSection = ({ title, data, showChart = true, isHorizontalChart: _isHorizontalChart = false, sideBySide = false, displaySubjects = [], subjectMap = {} }: any) => {
  const [isOpen, setIsOpen] = useState(true);

  const chartTitle = `${title.replace(/^\d+\.\s*/, '')}별 P-SCORE / Balance CV`;

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
              {sideBySide ? (
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full">
                  <div className="overflow-x-auto h-full">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400 uppercase">
                        <tr>
                          <th className="px-1.5 py-1 font-medium rounded-tl-md">구분</th>
                          <th className="px-1.5 py-1 font-medium text-right">캠퍼스수</th>
                          <th className="px-1.5 py-1 font-medium text-right">학급수</th>
                          <th className="px-1.5 py-1 font-medium text-right">학생수</th>
                          <th className="px-1.5 py-1 font-medium text-right">학급당 평균</th>
                          <th className="px-1.5 py-1 font-medium text-right text-orange-500 dark:text-orange-400">SC-CV</th>
                          <th className="px-1.5 py-1 font-medium text-right text-orange-500 dark:text-orange-400">Balance CV</th>
                          <th className="px-1.5 py-1 font-medium text-center border-l border-slate-200 dark:border-slate-700" colSpan={displaySubjects.length + 1}>P-SCORE</th>
                        </tr>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="px-1.5 py-1"></th>
                          <th className="px-1.5 py-1"></th>
                          <th className="px-1.5 py-1"></th>
                          <th className="px-1.5 py-1"></th>
                          <th className="px-1.5 py-1"></th>
                          <th className="px-1.5 py-1"></th>
                          <th className="px-1.5 py-1"></th>
                          <th className="px-1.5 py-1 font-medium text-right border-l border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400">총평균</th>
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
                            <td className="px-1.5 py-1 text-right">{row.avgPerClass?.toFixed(1) || '0.0'}</td>
                            <td className="px-1.5 py-1 text-right text-orange-500 dark:text-orange-400">{row.scCv?.toFixed(2) || '0.00'}</td>
                            <td className="px-1.5 py-1 text-right text-orange-500 dark:text-orange-400">{row.balanceCV?.toFixed(2) || '0.00'}</td>
                            <td className="px-1.5 py-1 text-right font-semibold text-indigo-600 dark:text-indigo-400 border-l border-slate-200 dark:border-slate-700">
                              {row.pScore?.toFixed(1) || '0.0'}
                              <span className={`ml-1 text-xs ${(row.delta || 0) > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                ({(row.delta || 0) > 0 ? '+' : ''}{(row.delta || 0).toFixed(1)}%p)
                              </span>
                            </td>
                            {displaySubjects.map((sub: string) => (
                              <td key={sub} className="px-1.5 py-1 text-right">{row[subjectMap[sub]?.key]?.toFixed(1) || '0.0'}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400 uppercase">
                    <tr>
                      <th className="px-1.5 py-1 font-medium rounded-tl-md">구분</th>
                      <th className="px-1.5 py-1 font-medium text-right">캠퍼스수</th>
                      <th className="px-1.5 py-1 font-medium text-right">학급수</th>
                      <th className="px-1.5 py-1 font-medium text-right">학생수</th>
                      <th className="px-1.5 py-1 font-medium text-right">학급당 평균</th>
                      <th className="px-1.5 py-1 font-medium text-right text-orange-500 dark:text-orange-400">Balance CV</th>
                      <th className="px-1.5 py-1 font-medium text-center border-l border-slate-200 dark:border-slate-700" colSpan={displaySubjects.length + 1}>P-SCORE</th>
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-1.5 py-1"></th>
                      <th className="px-1.5 py-1"></th>
                      <th className="px-1.5 py-1"></th>
                      <th className="px-1.5 py-1"></th>
                      <th className="px-1.5 py-1"></th>
                      <th className="px-1.5 py-1"></th>
                      <th className="px-1.5 py-1 font-medium text-right border-l border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400">총평균</th>
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
                        <td className="px-1.5 py-1 text-right">{row.avgPerClass?.toFixed(1) || '0.0'}</td>
                        <td className="px-1.5 py-1 text-right text-orange-500 dark:text-orange-400">{row.balanceCV?.toFixed(2) || '0.00'}</td>
                        <td className="px-1.5 py-1 text-right font-semibold text-indigo-600 dark:text-indigo-400 border-l border-slate-200 dark:border-slate-700">
                          {row.pScore?.toFixed(1) || '0.0'}
                          <span className={`ml-1 text-xs ${(row.delta || 0) > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            ({(row.delta || 0) > 0 ? '+' : ''}{(row.delta || 0).toFixed(1)}%p)
                          </span>
                        </td>
                        {displaySubjects.map((sub: string) => (
                          <td key={sub} className="px-1.5 py-1 text-right">{row[subjectMap[sub]?.key]?.toFixed(1) || '0.0'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          {showChart && (
            <div className={`${sideBySide ? "xl:col-span-1" : "mt-4 w-full h-[280px]"}`}>
              {sideBySide && <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">{chartTitle}</h3>}
              <div className={sideBySide ? "bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm p-3 h-[calc(100%-2rem)] min-h-[200px]" : "h-full w-full"}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 30, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={['auto', 'auto']} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number, name: string) => [value.toFixed(1), name === 'pScore' ? 'P-SCORE (%)' : 'Balance CV']}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar yAxisId="left" dataKey="pScore" name="P-SCORE (%)" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} label={(props) => renderCustomBarLabel(props, data)}>
                    {data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.delta > 0 ? '#6366f1' : '#94a3b8'} />
                    ))}
                  </Bar>
                  <Line yAxisId="right" type="monotone" dataKey="balanceCV" name="Balance CV" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
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

export function PScoreAnalysis({ 
  showAwardAlert = true, 
  isCampusView = false,
  selectedSubjects = ['English', 'Speech Building', 'Eng. Foundations'],
  selectedCampuses = [],
  showAllCampuses = true,
  selectedYear,
  selectedTests = []
}: { 
  showAwardAlert?: boolean, 
  isCampusView?: boolean,
  selectedSubjects?: string[],
  selectedCampuses?: string[],
  showAllCampuses?: boolean,
  selectedYear?: number,
  selectedTests?: string[]
}) {
  const [isLlmOpen, setIsLlmOpen] = useState(false);
  const [isSection1Open, setIsSection1Open] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(true);

  const SUBJECT_MAP: { [key: string]: { label: string, key: string } } = {
    'English': { label: 'English', key: 'pScoreEng' },
    'Speech Building': { label: 'Sp. Build.', key: 'pScoreSpeech' },
    'Eng. Foundations': { label: 'Eng. Found.', key: 'pScoreFound' },
    'Cultural Conn.': { label: 'Cult. Connect.', key: 'pScoreCult' }
  };

  const displaySubjects = ['English', 'Speech Building', 'Eng. Foundations', 'Cultural Conn.'].filter(s => selectedSubjects.includes(s));

  const loginCampus = {
    name: "분당",
    region: "서울권",
    studentSizeGroup: "51명 이상 (XL)",
    classSizeGroup: "6학급 이상",
    operationPeriodGroup: "16년 이상",
    rank: 12
  };

  const section1Data = [
    TOTAL_OPERATION_TYPE_DATA[0], // "전체"
    { ...TOTAL_OPERATION_TYPE_DATA[1], group: loginCampus.name } // Mocking user campus data
  ];

  const section2Data = [
    { ...TOTAL_OPERATION_TYPE_DATA[0], group: '전체' },
    REGION_DATA.find(r => r.group === loginCampus.region) || REGION_DATA[0]
  ];

  const section3Data = [
    { ...(STUDENT_SIZE_DATA.find(s => s.group === loginCampus.studentSizeGroup) || STUDENT_SIZE_DATA[1]), group: loginCampus.name }
  ];

  const section4Data = [
    { ...(CLASS_SIZE_DATA.find(c => c.group === loginCampus.classSizeGroup) || CLASS_SIZE_DATA[1]), group: loginCampus.name }
  ];

  const section5Data = [
    { ...(OPERATION_PERIOD_DATA.find(o => o.group === loginCampus.operationPeriodGroup) || OPERATION_PERIOD_DATA[1]), group: loginCampus.name }
  ];

  const section6Data = [
    { type: loginCampus.name, r1: '1(100%)', r2: '0(0.0%)', r3: '0(0.0%)', r4: '0(0.0%)', total: '1(100%)' }
  ];

  return (
    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            분석 결과
          </h2>
          {showAwardAlert && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              응시 인원 10명 미만 캠퍼스는 Award 제외
            </p>
          )}
        </div>
        <button className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm">
          <Download className="w-4 h-4" />
          <span>Excel 다운로드</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <Award className="w-4 h-4" />
            <span className="text-xs font-medium">전국 평균 P-Score</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{PSCORE_KPI_DATA.nationalAverage.toFixed(1)}<span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">%</span></div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-xs font-medium">{isCampusView ? '분석 캠퍼스 수' : '전체 캠퍼스 수'}</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {isCampusView ? '1' : PSCORE_KPI_DATA.totalCampuses.toLocaleString()}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">개</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">{isCampusView ? '분석 캠퍼스 학생 수' : '전체 학생 수'}</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {isCampusView ? '120' : PSCORE_KPI_DATA.totalStudents.toLocaleString()}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">명</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <GraduationCap className="w-4 h-4" />
            <span className="text-xs font-medium">{isCampusView ? 'Academic Excellence' : 'Academic Excellence 수'}</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white flex items-baseline">
            {isCampusView ? '1' : PSCORE_KPI_DATA.excellenceCount}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">개</span>
            <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-2">(전국 상위 5% 수상 캠퍼스)</span>
          </div>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-medium">전국 1위 P-Score 캠퍼스</span>
          </div>
          <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
            {PSCORE_KPI_DATA.topCampus}
            <span className="ml-2 text-lg">90.7%</span>
          </div>
        </div>
      </div>

      {!isCampusView && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Award Panel */}
          <div className="lg:col-span-1 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/30 shadow-sm p-3">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-500">Academic Excellence Award - 학업 수월성 대상</h3>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              전국 P-Score 상위 5% (2개 캠퍼스) ·응시 인원 10명 미만 포함 분석 · NF Studies 제외 · Cultural Conn. 제외
            </div>
            <div className="space-y-3">
              {PSCORE_AWARD_DATA.map((award, idx) => (
                <div key={idx} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-amber-100 dark:border-amber-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      award.rank === 1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {award.rank}위
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-slate-800 dark:text-white">{award.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{award.type}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {award.score.toFixed(1)}<span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-0.5">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LLM Analysis Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
            <div 
              className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-200 dark:border-slate-700"
              onClick={() => setIsLlmOpen(!isLlmOpen)}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">AI 인사이트 분석</h3>
                {!isLlmOpen && <span className="ml-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-full">미실행</span>}
              </div>
              {isLlmOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
            
            {isLlmOpen && (
              <div className="p-3 flex-1 bg-indigo-50/30 dark:bg-indigo-900/10">
                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p>현재 데이터셋 기반 분석 결과입니다:</p>
                  <ul className="space-y-3 list-disc pl-5">
                    <li>
                      <strong className="text-slate-900 dark:text-white">High performing region:</strong> 서울 강남 권역이 P-Score 88.5%로 가장 우수한 성취도를 보이고 있으며, 전국 평균 대비 6.1%p 높습니다.
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">Low balance stability group:</strong> 학생수 15명 이하(S그룹) 및 학급수 1개 그룹에서 Balance CV가 0.21 이상으로 높게 나타나, 학생 간 성취도 편차가 큰 편입니다.
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">Risk insight:</strong> 운영 기간 2년 이하 신규 캠퍼스의 P-Score가 79.5%로 가장 낮아, 초기 정착을 위한 본사 차원의 아카데믹 지원 강화가 필요합니다.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 1: 선택 캠퍼스 기준 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
        <div 
          className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-200 dark:border-slate-700"
          onClick={() => setIsSection1Open(!isSection1Open)}
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">1. 선택 캠퍼스 기준</h3>
          {isSection1Open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
        
        {isSection1Open && (
          <div className="p-3">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
              {/* Left Table */}
              <div className="xl:col-span-2">
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full">
                  <div className="overflow-x-auto h-full">
              <table className="w-full text-sm text-center">
                <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400">
                  <tr>
                    <th className="px-1.5 py-1 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>캠퍼스명</th>
                    <th className="px-1.5 py-1 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>캠퍼스수</th>
                    <th className="px-1.5 py-1 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>학급수</th>
                    <th className="px-1.5 py-1 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>학생수</th>
                    <th className="px-1.5 py-1 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>급당 평균학생수</th>
                    <th className="px-1.5 py-1 font-medium border-b border-slate-200 dark:border-slate-700 text-orange-500 dark:text-orange-400" rowSpan={2}>SC-CV</th>
                    <th className="px-1.5 py-1 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>점검Z</th>
                    <th className="px-1.5 py-1 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>신뢰CI</th>
                    <th className="px-1.5 py-1 font-medium border-b border-slate-200 dark:border-slate-700 border-l" colSpan={2}>등급</th>
                    <th className="px-1.5 py-1 font-medium border-b border-slate-200 dark:border-slate-700 border-l" colSpan={displaySubjects.length + 1}>P-SCORE</th>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-1.5 py-1 font-medium border-l border-slate-200 dark:border-slate-700">CI</th>
                    <th className="px-1.5 py-1 font-medium">최종</th>
                    <th className="px-1.5 py-1 font-medium text-indigo-600 dark:text-indigo-400 border-l border-slate-200 dark:border-slate-700">총평균</th>
                    {displaySubjects.map(sub => (
                      <th key={sub} className="px-1.5 py-1 font-medium">{SUBJECT_MAP[sub].label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-300">
                  {section1Data.map((row: any, idx: number) => (
                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-1.5 py-1 font-medium text-slate-900 dark:text-white">{row.group}</td>
                      <td className="px-1.5 py-1">{row.campuses}</td>
                      <td className="px-1.5 py-1">{row.classes}</td>
                      <td className="px-1.5 py-1">{row.students}</td>
                      <td className="px-1.5 py-1">{row.avgPerClass?.toFixed(1) || '0.0'}</td>
                      <td className="px-1.5 py-1 text-orange-500 dark:text-orange-400">{row.scCv?.toFixed(2) || '0.00'}</td>
                      <td className="px-1.5 py-1">{row.checkZ?.toFixed(1) || '0.0'}</td>
                      <td className="px-1.5 py-1">{row.trustCI?.toFixed(1) || '0.0'}</td>
                      <td className="px-1.5 py-1 border-l border-slate-200 dark:border-slate-700">{row.gradeCI}</td>
                      <td className="px-1.5 py-1">{row.gradeFinal}</td>
                      <td className="px-1.5 py-1 text-indigo-600 dark:text-indigo-400 font-medium border-l border-slate-200 dark:border-slate-700">{row.pScore?.toFixed(1) || '0.0'}%</td>
                      {displaySubjects.map(sub => (
                        <td key={sub} className="px-1.5 py-1">{row[SUBJECT_MAP[sub].key]?.toFixed(1) || '0.0'}%</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Right Chart */}
        <div className="xl:col-span-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">운영 구분별 P-SCORE / Balance CV</h3>
          <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm p-3 h-[calc(100%-2rem)] min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={section1Data} margin={{ top: 30, right: 20, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} ticks={[0, 50, 100]} tickFormatter={(val) => `${val}%`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[4.9, 6.5]} ticks={[4.9, 5.8, 6.5]} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number, name: string) => [name === 'pScore' ? `${value.toFixed(1)}%` : value.toFixed(1), name === 'pScore' ? 'P-SCORE' : 'Balance CV']}
                />
                <Bar yAxisId="left" dataKey="pScore" name="P-SCORE" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} label={(props) => renderCustomBarLabel(props, section1Data)}>
                  {section1Data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" />
                  ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="balanceCV" name="Balance CV" stroke="#ea580c" strokeWidth={2} dot={{ r: 4, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
            </div>
          </div>
        )}
      </div>

      {/* Sections */}
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
                    <th className="px-1.5 py-1 font-bold text-center text-indigo-600 dark:text-indigo-400">계</th>
                  </tr>
                </thead>
                <tbody>
                  {section6Data.map((row, idx) => (
                    <tr 
                      key={idx} 
                      className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                    >
                      <td className="px-1.5 py-1 text-slate-700 dark:text-slate-300 font-bold">
                        {row.type}
                      </td>
                      <td className="px-1.5 py-1 text-center text-slate-600 dark:text-slate-400">{row.r1}</td>
                      <td className="px-1.5 py-1 text-center text-slate-600 dark:text-slate-400">{row.r2}</td>
                      <td className="px-1.5 py-1 text-center text-slate-600 dark:text-slate-400">{row.r3}</td>
                      <td className="px-1.5 py-1 text-center text-slate-600 dark:text-slate-400">{row.r4}</td>
                      <td className="px-1.5 py-1 text-center font-bold text-indigo-600 dark:text-indigo-400">
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
              <BarChart data={displaySubjects.map(sub => ({
                subject: SUBJECT_MAP[sub].label,
                value: sub === 'English' ? 75.6 : sub === 'Speech Building' ? 85.2 : sub === 'Eng. Foundations' ? 78.6 : 80.1,
                color: sub === 'English' ? '#3b82f6' : sub === 'Speech Building' ? '#10b981' : sub === 'Eng. Foundations' ? '#f97316' : '#8b5cf6'
              }))} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
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
                  cursor={{ fill: '#f1f5f9', opacity: 0.5 }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value}%`, '정답률']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                  {displaySubjects.map((sub, index) => (
                    <Cell key={`cell-${index}`} fill={sub === 'English' ? '#3b82f6' : sub === 'Speech Building' ? '#10b981' : sub === 'Eng. Foundations' ? '#f97316' : '#8b5cf6'} />
                  ))}
                  <LabelList dataKey="value" position="top" formatter={(val: number) => `${val}%`} className="fill-slate-600 dark:fill-slate-300" fontSize={12} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* P-SCORE 분석 가이드 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div 
          className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-200 dark:border-slate-700"
          onClick={() => setIsGuideOpen(!isGuideOpen)}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">P-SCORE 분석 가이드</h3>
          </div>
          {isGuideOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
        
        {isGuideOpen && (
          <div className="p-6 bg-slate-50/50 dark:bg-slate-900/20 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
              <p className="text-base">
                📊 <strong className="text-slate-800 dark:text-white">P-SCORE 캠퍼스 분석</strong> — 캠퍼스의 학습 성취도를 P-Score(정답률)와 SC-CV(학생 균일도)를 결합하여 정량 비교·평가하는 화면입니다. 캠퍼스 성취 격차, 지역·규모별 벤치마크, 과목 균형도를 종합 분석하여 교육과정 이행 수준을 진단합니다.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">1. 핵심 지표 정의 및 계산식</h4>
              <div className="space-y-3 pl-2">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">① P-Score (Performance Score, 캠퍼스 정답률)</p>
                  <p>캠퍼스 전체 학생의 평균 정답률(%)입니다.</p>
                  <p className="text-xs text-slate-500">계산식: P-Score = SUM(CORRECT_YN='Y') / COUNT(*) × 100</p>
                  <ul className="list-disc pl-5 text-xs space-y-1 mt-1">
                    <li>BigQuery SAFE_DIVIDE로 0 나누기 방지</li>
                    <li>캠퍼스 단위: PScoreAgent가 GROUP BY CLIENT_NAME으로 집계</li>
                    <li>ESC 에이전트가 campus_gbn == '직영'으로 필터링 후 AR 내림차순 재순위</li>
                    <li>높을수록 교육과정 이행 수준이 우수</li>
                  </ul>
                  <p className="text-xs italic mt-1">예) 캠퍼스 학생 50명, 총 3,000문항 중 2,520문항 정답 → P-Score = 84.0%</p>
                </div>
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">② Balance CV (과목 균형 변동계수)</p>
                  <p>캠퍼스 내 과목별 정답률의 편차를 측정합니다.</p>
                  <p className="text-xs text-slate-500">계산식: Balance CV = σ(과목별 정답률) / μ(과목별 정답률) × 100</p>
                  <ul className="list-disc pl-5 text-xs space-y-1 mt-1">
                    <li>σ: 모 표준편차 (ddof=0)</li>
                    <li>과목별 정답률: GROUP BY CLIENT_NAME, SUBJECT_NAME으로 산출</li>
                    <li>낮을수록 과목 간 균형이 양호 (특정 과목 편중 없음)</li>
                  </ul>
                  <p className="text-xs italic mt-1">예) English=85%, Sp.Build=80%, Eng.Found=78%, NF St.=72% → μ=78.8%, σ=4.6 → CV=5.9</p>
                </div>
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">③ SC-CV (Student Cohesion CV, 학생 균일도)</p>
                  <p>캠퍼스 내 학생 간 성취 격차를 측정하는 핵심 지표입니다.</p>
                  <p className="text-xs text-slate-500">계산식: SC-CV = σ(학생별 총점) / μ(학생별 총점) × 100</p>
                  <ul className="list-disc pl-5 text-xs space-y-1 mt-1">
                    <li>학생별 총점: 각 학생의 전체 정답률 × 100 (0~100 스케일)</li>
                    <li>σ: 모 표준편차 (ddof=0), 학생 2명 미만 시 0.0 반환</li>
                    <li>|μ| &lt; 1e-9 시 0.0 반환 (Division by Zero 방지)</li>
                    <li>math.isfinite() 검증 후 소수점 3자리 반올림</li>
                  </ul>
                  <div className="mt-2 p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs">
                    <p className="font-bold mb-1">캠퍼스 SC-CV 등급 (수강반보다 완화 기준):</p>
                    <p>• ≤10: <span className="text-emerald-500 font-bold">우수</span> — 학생 간 성취가 균일</p>
                    <p>• 10~15: <span className="text-blue-500 font-bold">양호</span> — 일반적 수준</p>
                    <p>• 15~25: <span className="text-amber-500 font-bold">주의</span> — 상·하위 학생 간 격차 발생</p>
                    <p>• &gt;25: <span className="text-rose-500 font-bold">관리</span> — 심각한 성취 격차, 수강반 구성 재검토 필요</p>
                  </div>
                  <p className="text-xs italic mt-1">예) 학생 40명, μ=75.0, σ=15.0 → SC-CV=20.0 (주의)</p>
                </div>
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">④ Percentile Rank (백분위 순위)</p>
                  <p>전국 캠퍼스 중 해당 캠퍼스의 상대적 위치를 백분율로 표시합니다.</p>
                  <p className="text-xs text-slate-500">계산식: Percentile = (n − rank) / n × 100</p>
                  <ul className="list-disc pl-5 text-xs space-y-1 mt-1">
                    <li>n: 전체 캠퍼스 수, rank: P-Score 내림차순 순위</li>
                    <li>높을수록 상위권 (1위 캠퍼스 → 약 93% 등)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">2. KPI 카드 (4개) 상세 해설</h4>
              <ul className="space-y-2 pl-2">
                <li>❶ <strong>전국 평균 P-Score:</strong> 모든 캠퍼스 P-Score의 산술평균(%). 전국 벤치마크 기준선 역할. 하단 설명: "전체 캠퍼스 평균 정답률".</li>
                <li>❷ <strong>분석 캠퍼스:</strong> 캠퍼스 총 개수 + 전체 학생 수. 예) "14개 / 전체 학생 596명".</li>
                <li>❸ <strong>Academic Excellence:</strong> 전국 P-Score 상위 5%(ceil 올림) 수상 캠퍼스 수. 응시 인원 10명 이상 캠퍼스만 대상. EXCELLENCE_PCT=5.0, MIN_STUDENT_COUNT=10 상수 적용.</li>
                <li>❹ <strong>전국 1위 P-Score:</strong> P-Score 최고 점수(%) + 해당 캠퍼스명. 전국 캠퍼스 중 최우수 성취 캠퍼스.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">3. 차트 및 테이블 해설</h4>
              <div className="space-y-3 pl-2">
                <p>📋 <strong>선택 캠퍼스 기준 (가로형 바차트 + 상세표):</strong> 캠퍼스를 P-Score 내림차순으로 나열. 상단 표에 캠퍼스명, 운영주체, 지역, 학급수, 학생수, 급당평균, SC-CV, P-Score 총평균, 과목별 정답률 표시. 우측 가로 Bar에서 캠퍼스 간 시각적 비교. 점선은 전국 평균 P-Score 기준선.</p>
                <p>📊 <strong>벤치마크 기준표 4종:</strong> 동일 조건 캠퍼스끼리 그룹핑하여 공정한 비교를 제공합니다 (지역권역별, 학생수별, 학급수별, 운영기간별). 각 테이블 옆에 ComposedChart(Bar=P-Score, Line=SC-CV)가 페어링됩니다.</p>
                <p>📋 <strong>순위구간별 지역권역 분포 (크로스탭):</strong> P-Score 순위를 10위 단위 구간으로 분류. 행=지역권역, 열=순위 구간. 특정 지역의 교육 품질 집중도를 파악합니다.</p>
                <p>🎯 <strong>과목별 전국 평균 정답률 (반원형 게이지):</strong> 캠퍼스 전체의 과목별 평균 정답률을 40%~100% 범위의 반원형 게이지로 시각화하여 과목 간 수준 차이를 파악합니다.</p>
                <p>🔵 <strong>Performance Matrix (성과-균일도 산점도):</strong> X축=P-Score(%), Y축=SC-CV(학생균일도), 버블 크기=학생 수. 4분면 진단을 통해 이상적 위치부터 긴급 관리 대상까지 구분합니다.</p>
                <p>🔴 <strong>관리 필요 캠퍼스:</strong> P-Score 하위 10% 또는 SC-CV 상위 10% 캠퍼스를 강조 표시하여 즉각적 관리 포인트를 제시합니다.</p>
                <p>📑 <strong>전국 캠퍼스 랭킹 테이블:</strong> 모든 캠퍼스의 종합 순위 테이블로 검색 및 필터 기능을 제공하며 지표별 색상 강조가 적용됩니다.</p>
                <p>🏆 <strong>Academic Excellence Award:</strong> 캠퍼스 중 P-Score 상위 5% 캠퍼스를 수상 배지로 표시합니다. (10명 미만 제외)</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">4. 데이터 산출 파이프라인</h4>
              <div className="pl-2 space-y-2 text-xs">
                <p><strong>BigQuery 쿼리 흐름:</strong> PScoreAgent 집계 → ESC 직영 필터 및 재순위 → 학생별 총점 조회 → SC-CV 계산 → Excellence 및 Percentile 산출</p>
                <p><strong>필터 조건:</strong> 연도, 시험코드, 과정, 과목, 제외 옵션이 전체 결과에 실시간 반영됩니다.</p>
                <p><strong>수치 정밀도:</strong> 모든 지표 소수점 3자리(DECIMAL_PRECISION=3). P-Score % 표시는 소수점 1자리.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">5. 활용 가이드</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>캠퍼스 운영 품질 진단:</strong> Performance Matrix 4분면을 통해 성과와 균일도를 동시에 관리합니다.</li>
                <li><strong>벤치마크 활용:</strong> 동일 조건 캠퍼스 대비 자신의 위치를 파악하여 공정한 평가를 수행합니다.</li>
                <li><strong>드릴다운 활용:</strong> 캠퍼스 선택 시 수강반 또는 학생 레벨로 전환하여 미시적 원인을 분석합니다.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 전국 캠퍼스 P-Score 랭킹 */}
      <NationalCampusRanking 
        title="전국 캠퍼스 P-Score 랭킹" 
        showOnlyPScore={true} 
        selectedSubjects={selectedSubjects} 
        subjectMap={SUBJECT_MAP}
        filterCampusName={showAllCampuses ? undefined : loginCampus.name}
        selectedCampuses={showAllCampuses ? [] : selectedCampuses}
        selectedYear={selectedYear}
        selectedTests={selectedTests}
      />

    </div>
  );
}
