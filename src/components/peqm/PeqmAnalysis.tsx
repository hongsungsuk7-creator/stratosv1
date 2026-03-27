import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';
import { 
  TOTAL_OPERATION_TYPE_DATA, REGION_DATA, STUDENT_SIZE_DATA, 
  CLASS_SIZE_DATA, OPERATION_PERIOD_DATA, MATRIX_DATA, PEQM_RANKING_DATA
} from '../../data/peqmMockData';
import { PEQM_CAMPUS_2025_MT_DATA } from '@/data/peqmCampus2025MtData';
import { parseExamOptionLabel, toExamPeriodKey } from '@/utils/examPeriod';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <p className="text-sm font-bold text-slate-800 dark:text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm mt-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600 dark:text-slate-300">{entry.name}:</span>
            <span className="font-bold text-slate-800 dark:text-white">
              {entry.value.toFixed(1)}{entry.name.includes('Score') || entry.name.includes('CV') ? '' : '%'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AnalysisSection = ({ title, data }: { title: string, data: any[] }) => {
  const [isOpen, setIsOpen] = useState(true);
  const chartTitle = `${title.replace(/^\d+\.\s*/, '')}별 분석`;

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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <div className="xl:col-span-2 overflow-x-auto">
              <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full">
                <div className="overflow-x-auto h-full">
                  <table className="w-full text-sm text-center">
                    <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400 uppercase">
                      <tr>
                        <th className="px-1.5 py-1 font-medium border-b border-slate-200 dark:border-slate-700" rowSpan={2}>
                          {title.includes('선택 캠퍼스') ? '운영' : title.replace(/^\d+\.\s*/, '').replace(' 기준', '')}
                        </th>
                        <th className="px-1.5 py-1 font-medium text-right border-b border-slate-200 dark:border-slate-700" rowSpan={2}>캠퍼스수</th>
                        <th className="px-1.5 py-1 font-medium text-right border-b border-slate-200 dark:border-slate-700" rowSpan={2}>학급수</th>
                        <th className="px-1.5 py-1 font-medium text-right border-b border-slate-200 dark:border-slate-700" rowSpan={2}>학생수</th>
                        <th className="px-1.5 py-1 font-medium text-right border-b border-slate-200 dark:border-slate-700" rowSpan={2}>급당 평균</th>
                        <th className="px-1.5 py-1 font-medium text-center border-b border-slate-200 dark:border-slate-700" rowSpan={2}>EMI</th>
                        <th className="px-1.5 py-1 font-medium text-right text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-700" rowSpan={2}>점검Z</th>
                        <th className="px-1.5 py-1 font-medium text-right text-orange-500 dark:text-orange-400 border-b border-slate-200 dark:border-slate-700" rowSpan={2}>Elite CV</th>
                        <th className="px-1.5 py-1 font-medium text-center border-l border-b border-slate-200 dark:border-slate-700" colSpan={5}>Level Distribution (%)</th>
                        <th className="px-1.5 py-1 font-medium text-center border-l border-b border-slate-200 dark:border-slate-700" colSpan={3}>Group Distribution (%)</th>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="px-1.5 py-1 font-medium text-right border-l border-slate-200 dark:border-slate-700">ED</th>
                        <th className="px-1.5 py-1 font-medium text-right">NE1</th>
                        <th className="px-1.5 py-1 font-medium text-right">NE2</th>
                        <th className="px-1.5 py-1 font-medium text-right">NE3</th>
                        <th className="px-1.5 py-1 font-medium text-right">NE4+NE5</th>
                        <th className="px-1.5 py-1 font-medium text-right border-l border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">ED+NE1</th>
                        <th className="px-1.5 py-1 font-medium text-right">NE2+NE3</th>
                        <th className="px-1.5 py-1 font-medium text-right text-rose-600 dark:text-rose-400">NE4+NE5</th>
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
                          <td className="px-1.5 py-1 text-center font-bold">{row.emi}</td>
                          <td className="px-1.5 py-1 text-right text-blue-600 dark:text-blue-400 font-medium">{row.zScore.toFixed(1)}</td>
                          <td className="px-1.5 py-1 text-right text-orange-500 dark:text-orange-400 font-medium">{row.eliteCv.toFixed(1)}</td>
                          <td className="px-1.5 py-1 text-right border-l border-slate-200 dark:border-slate-700">{row.ed.percent.toFixed(1)}</td>
                          <td className="px-1.5 py-1 text-right">{row.ne1.percent.toFixed(1)}</td>
                          <td className="px-1.5 py-1 text-right">{row.ne2.percent.toFixed(1)}</td>
                          <td className="px-1.5 py-1 text-right">{row.ne3.percent.toFixed(1)}</td>
                          <td className="px-1.5 py-1 text-right">{(row.ne4.percent + row.ne5.percent).toFixed(1)}</td>
                          <td className="px-1.5 py-1 text-right font-semibold text-emerald-600 dark:text-emerald-400 border-l border-slate-200 dark:border-slate-700">{row.edNe1.percent.toFixed(1)}</td>
                          <td className="px-1.5 py-1 text-right">{row.ne2Ne3.percent.toFixed(1)}</td>
                          <td className="px-1.5 py-1 text-right font-semibold text-rose-600 dark:text-rose-400">{row.ne4Ne5.percent.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="xl:col-span-1 mt-4 xl:mt-0 w-full h-[280px]">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">{chartTitle}</h3>
              <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm p-3 h-[calc(100%-2rem)] min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                    <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar yAxisId="left" dataKey="edNe1.percent" name="ED+NE1" fill="#10b981" radius={[2, 2, 0, 0]} barSize={20} />
                    <Bar yAxisId="left" dataKey="ne4Ne5.percent" name="NE4+NE5" fill="#ef4444" radius={[2, 2, 0, 0]} barSize={20} />
                    <Line yAxisId="right" type="monotone" dataKey="zScore" name="Z-Score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="eliteCv" name="Elite CV" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PerformanceMatrixSection = () => {
  const [isOpen, setIsOpen] = useState(true);

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-bold text-slate-800 dark:text-white mb-2">{data.name}</p>
          <div className="flex items-center gap-2 text-sm mt-1">
            <span className="text-slate-600 dark:text-slate-300">Z-Score:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{data.zScore.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <span className="text-slate-600 dark:text-slate-300">Elite CV:</span>
            <span className="font-bold text-orange-500 dark:text-orange-400">{data.cv.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <span className="text-slate-600 dark:text-slate-300">EMI:</span>
            <span className="font-bold text-slate-800 dark:text-white">{data.emi}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
      <div 
        className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-200 dark:border-slate-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">9. Performance Matrix</h3>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </div>
      
      {isOpen && (
        <div className="p-3">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
            <div className="xl:col-span-1 overflow-x-auto h-[400px]">
              <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full">
                <div className="overflow-y-auto h-full">
                  <table className="w-full text-sm text-center">
                    <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400 uppercase sticky top-0 z-10">
                      <tr>
                        <th className="px-1.5 py-2 font-medium border-b border-slate-200 dark:border-slate-700">캠퍼스명</th>
                        <th className="px-1.5 py-2 font-medium text-right text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-700">Z-Score</th>
                        <th className="px-1.5 py-2 font-medium text-right text-orange-500 dark:text-orange-400 border-b border-slate-200 dark:border-slate-700">Elite CV</th>
                        <th className="px-1.5 py-2 font-medium text-center border-b border-slate-200 dark:border-slate-700">EMI</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600 dark:text-slate-300">
                      {MATRIX_DATA.map((row: any, idx: number) => (
                        <tr key={idx} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-1.5 py-2 font-medium text-slate-900 dark:text-white">{row.name}</td>
                          <td className="px-1.5 py-2 text-right text-blue-600 dark:text-blue-400 font-medium">{row.zScore.toFixed(2)}</td>
                          <td className="px-1.5 py-2 text-right text-orange-500 dark:text-orange-400 font-medium">{row.cv.toFixed(2)}</td>
                          <td className="px-1.5 py-2 text-center font-bold">
                            <span className={`px-2 py-0.5 rounded text-xs text-white ${row.emi === 'G' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                              {row.emi}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="xl:col-span-3 mt-4 xl:mt-0 w-full h-[400px]">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Performance Matrix 분포</h3>
              <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm p-3 h-[calc(100%-2rem)] min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                    <XAxis 
                      type="number" 
                      dataKey="zScore" 
                      name="Z-Score" 
                      domain={[-2, 2]} 
                      label={{ value: 'Z-Score', position: 'bottom', offset: 0 }}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="cv" 
                      name="Elite CV" 
                      domain={[0, 10]} 
                      label={{ value: 'Elite CV', angle: -90, position: 'left' }}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                    />
                    <ZAxis type="category" dataKey="name" name="Campus" />
                    <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Campuses" data={MATRIX_DATA} fill="#8884d8">
                      {MATRIX_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.emi === 'G' ? '#10b981' : '#ef4444'} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="mt-2 flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-600 dark:text-slate-300">EMI: G</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="text-slate-600 dark:text-slate-300">EMI: L</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GuideSection = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
      <div 
        className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-200 dark:border-slate-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          10. PEQM 분석 가이드
        </h3>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </div>
      
      {isOpen && (
        <div className="p-6 space-y-8 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Overview */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
            <p className="text-slate-700 dark:text-slate-200">
              <span className="text-lg mr-2">📊</span>
              <strong>PEQM 캠퍼스 대시보드 개요</strong> — 전국 직영 캠퍼스의 엘리트 품질(NE Band 분포)과 교육 균일도(Elite CV)를 결합하여 운영 안정성을 정량 진단하는 대시보드입니다. 캠퍼스별 상위권(ED+NE1) 비율, 하위권(NE4+NE5) 이탈 위험, EMI 등급을 종합하여 품질을 P/G/U/L 4등급으로 분류합니다. P-Score가 '얼마나 잘했는가', PC-RAM이 '얼마나 신뢰할 수 있는가'를 측정한다면, PEQM은 '품질이 얼마나 균일하게 유지되는가'를 측정합니다. ESC는 직영 캠퍼스만을 대상으로 합니다.
            </p>
          </div>

          {/* 1. 핵심 지표 */}
          <section className="space-y-4">
            <h4 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
              1. 핵심 지표 정의 및 계산식
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h5 className="font-bold text-blue-600 dark:text-blue-400">① NE Band (성취 구간 분류, 6단계)</h5>
                <p>학생의 총점(정답률 × 100)을 기준으로 6개 성취 구간으로 분류합니다.</p>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800">
                      <tr>
                        <th className="px-2 py-1.5 text-left">구간</th>
                        <th className="px-2 py-1.5 text-left">기준</th>
                        <th className="px-2 py-1.5 text-left">설명</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr><td className="px-2 py-1.5 font-bold text-emerald-600">ED</td><td className="px-2 py-1.5">≥ 90점</td><td className="px-2 py-1.5 text-slate-500">최상위 엘리트 — 심화·경시 대상</td></tr>
                      <tr><td className="px-2 py-1.5 font-bold text-emerald-500">NE1</td><td className="px-2 py-1.5">80 ~ 89점</td><td className="px-2 py-1.5 text-slate-500">우수 — Elite 그룹(ED+NE1) 포함</td></tr>
                      <tr><td className="px-2 py-1.5 font-bold text-blue-500">NE2</td><td className="px-2 py-1.5">70 ~ 79점</td><td className="px-2 py-1.5 text-slate-500">양호 — 상위 진입 가능</td></tr>
                      <tr><td className="px-2 py-1.5 font-bold text-slate-500">NE3</td><td className="px-2 py-1.5">60 ~ 69점</td><td className="px-2 py-1.5 text-slate-500">보통 — 기본 역량 보유</td></tr>
                      <tr><td className="px-2 py-1.5 font-bold text-orange-500">NE4</td><td className="px-2 py-1.5">50 ~ 59점</td><td className="px-2 py-1.5 text-slate-500">주의 — 학습 결손 누적 가능</td></tr>
                      <tr><td className="px-2 py-1.5 font-bold text-rose-500">NE5</td><td className="px-2 py-1.5">&lt; 50점</td><td className="px-2 py-1.5 text-slate-500">위기 — 기초학력 미달, 즉각 개입</td></tr>
                    </tbody>
                  </table>
                </div>
                <ul className="text-xs space-y-1 text-slate-500 list-disc pl-4">
                  <li>총점 계산: total_score = SUM(정답='Y') / COUNT(*) × 100 (BigQuery SAFE_DIVIDE)</li>
                  <li>PEQMAgent가 GROUP BY CLIENT_NAME, MEMBER_CODE로 학생별 점수 산출 후 NE 분류</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h5 className="font-bold text-blue-600 dark:text-blue-400">② ED+NE1% (엘리트 비율)</h5>
                  <p>캠퍼스 내 80점 이상 학생(ED + NE1)의 비율입니다.</p>
                  <p className="text-xs font-mono bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-200 dark:border-slate-700">
                    계산식: ED+NE1% = (ED수 + NE1수) / 전체학생수 × 100
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h5 className="font-bold text-blue-600 dark:text-blue-400">③ NE4+NE5% (이탈 위험 비율) + Retention Alert</h5>
                  <p>캠퍼스 내 60점 미만 학생(NE4 + NE5)의 비율입니다.</p>
                  <p className="text-xs font-mono bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-200 dark:border-slate-700">
                    계산식: NE4+NE5% = (NE4수 + NE5수) / 전체학생수 × 100
                  </p>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium italic">
                    * Retention Alert: NE4+NE5% &gt; 10% 시 경고 플래그 활성화 및 즉시 개입 필요
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="space-y-3">
                <h5 className="font-bold text-blue-600 dark:text-blue-400">④ Elite Z-Score (2단계 표준화 성취지수)</h5>
                <p>캠퍼스 학생들의 성취 수준을 전국 기준으로 표준화한 점수입니다.</p>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                  <p className="text-xs font-mono leading-relaxed">
                    Step 1: zik = (xik − μk) / σk (과목별 표준화)<br />
                    Step 2: Si = mean(zik) → Zi = (Si − μS) / σS (복합 표준화)<br />
                    캠퍼스 Z: ZC = mean(Zi)
                  </p>
                </div>
                <ul className="text-xs space-y-1 text-slate-500 list-disc pl-4">
                  <li>기준 모집단: 전체 캠퍼스(직영+분원)로 μk, σk 산출, ESC는 직영만 표시</li>
                  <li>소규모 캠퍼스(≤5명)는 전국 기준값 산출에서 제외</li>
                  <li>양수(+): 전국 평균 초과, 음수(−): 미달</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-blue-600 dark:text-blue-400">⑤ Elite CV [ED+NE1] (엘리트 변동계수)</h5>
                <p>ED+NE1(80점 이상) 학생들의 점수 균일도를 측정합니다.</p>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-mono">
                    계산식: CVED,NE1 = σ(엘리트 점수) / μ(엘리트 점수) × 100
                  </p>
                </div>
                <ul className="text-xs space-y-1 text-slate-500 list-disc pl-4">
                  <li>낮을수록 상위권 학생 간 성취가 균일하고 안정적</li>
                  <li>EMI 등급 판별: CV ≤ 5% → P (Perfect), &gt; 5% → U (Unbalanced)</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="space-y-3">
                <h5 className="font-bold text-blue-600 dark:text-blue-400">⑥ 전체 CV (전체 변동계수)</h5>
                <p>캠퍼스 전체 학생 점수의 변동계수입니다. Elite CV와 비교하여 하위권 격차 수준을 파악합니다.</p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-blue-600 dark:text-blue-400">⑦ EMI Grade (Elite Mastery Index, 4등급)</h5>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800">
                      <tr>
                        <th className="px-2 py-1.5 text-left">등급</th>
                        <th className="px-2 py-1.5 text-left">판정 기준</th>
                        <th className="px-2 py-1.5 text-left">의미</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr><td className="px-2 py-1.5 font-bold text-emerald-600">P (Perfect)</td><td className="px-2 py-1.5">Z ≥ 1 AND CV ≤ 5%</td><td className="px-2 py-1.5">최상위 성취 + 균일한 엘리트</td></tr>
                      <tr><td className="px-2 py-1.5 font-bold text-orange-500">U (Unbalanced)</td><td className="px-2 py-1.5">Z ≥ 1 AND CV &gt; 5%</td><td className="px-2 py-1.5">최상위 성취이나 엘리트 간 편차 큼</td></tr>
                      <tr><td className="px-2 py-1.5 font-bold text-blue-500">G (Growth)</td><td className="px-2 py-1.5">-0.5 ≤ Z &lt; 1</td><td className="px-2 py-1.5">표준 운영 범위 → 성장 잠재력</td></tr>
                      <tr><td className="px-2 py-1.5 font-bold text-rose-500">L (Lack)</td><td className="px-2 py-1.5">Z &lt; -0.5</td><td className="px-2 py-1.5">성취 부족 → 위기, 긴급 개입 필요</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* 2. KPI 카드 */}
          <section className="space-y-4">
            <h4 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
              2. KPI 카드 상세 해설
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: "❶", title: "전국 평균", desc: "모든 직영 캠퍼스 학생 총점의 전국 산술평균(점). 벤치마크 기준선." },
                { id: "❷", title: "분석 캠퍼스", desc: "직영 캠퍼스 총 개수 + 전체 학생 수." },
                { id: "❸", title: "EMI P등급", desc: "P(Perfect) 등급 캠퍼스 수. 성취와 균일도 모두 최상위." },
                { id: "❹", title: "EMI L등급", desc: "L(Lack) 등급 캠퍼스 수. 성취 부족 위기 캠퍼스." },
                { id: "❺", title: "Retention Alert", desc: "NE4+NE5% > 10% 캠퍼스 수. 이탈 위험 학생 과다." }
              ].map((kpi) => (
                <div key={kpi.id} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">{kpi.id}</span>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white mb-1">{kpi.title}</div>
                    <div className="text-xs text-slate-500 leading-normal">{kpi.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. 차트 및 테이블 */}
          <section className="space-y-4">
            <h4 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
              3. 차트 및 테이블 해설
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <h5 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                  <span className="text-blue-500">📋</span> 선택 캠퍼스 기준 (NE 분포 + 상세표)
                </h5>
                <p className="text-xs text-slate-500">직영 캠퍼스의 NE Band 분포를 6구간 스택바로 시각화. 상세표에서 EMI등급, Elite Z, Elite CV, NE구간별 비중, Retention Alert 등을 확인.</p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                  <span className="text-blue-500">📊</span> 벤치마크 기준표 5종
                </h5>
                <p className="text-xs text-slate-500">지역권역, 학생수, 학급수, 운영기간, 순위구간별로 동일 조건 캠퍼스끼리 공정한 비교를 제공하며 Z-Score와 Elite CV 차트를 페어링합니다.</p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                  <span className="text-blue-500">📋</span> 순위구간별 지역권역 분포 (크로스탭)
                </h5>
                <p className="text-xs text-slate-500">Z-Score 순위 구간별로 어느 지역이 상위/하위 구간에 집중되는지 파악합니다.</p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                  <span className="text-blue-500">🎯</span> 과목별 전국 평균 정답률 (게이지)
                </h5>
                <p className="text-xs text-slate-500">직영 캠퍼스 전체의 과목별 평균을 반원형 게이지로 시각화하여 과목 간 수준 차이를 파악합니다.</p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                  <span className="text-blue-500">📊</span> NE Waterfall (워터폴 차트)
                </h5>
                <p className="text-xs text-slate-500">ED→NE5 순서로 각 구간 학생수를 연속 막대로 표시. 상위 구간에 집중된 '역삼각형' 형태가 이상적입니다.</p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                  <span className="text-blue-500">🏷️</span> EMI 등급 분포 (스택바 + 카드)
                </h5>
                <p className="text-xs text-slate-500">P/G/U/L 4등급의 비율을 시각화. P+G 비율이 높을수록 전체 운영 품질이 우수함을 의미합니다.</p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                  <span className="text-blue-500">🔵</span> Performance Matrix (Z-Score × CV 산점도)
                </h5>
                <p className="text-xs text-slate-500">X축(Z-Score)과 Y축(Elite CV)을 기준으로 캠퍼스 위치를 진단. 우하단(P등급)이 가장 이상적인 위치입니다.</p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                  <span className="text-blue-500">📑</span> 전국 캠퍼스 랭킹 테이블
                </h5>
                <p className="text-xs text-slate-500">모든 직영 캠퍼스의 종합 순위 테이블로 상세 필터링과 정렬을 지원하며 EMI 배지와 Retention Alert 아이콘을 표시합니다.</p>
              </div>
            </div>
          </section>

          {/* 4. 데이터 파이프라인 */}
          <section className="space-y-4">
            <h4 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
              4. 데이터 산출 파이프라인
            </h4>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <ol className="text-xs space-y-2 list-decimal pl-4">
                <li><strong>ESC PEQM 에이전트:</strong> PEQMAgent에 위임하여 처리</li>
                <li><strong>학생별 점수 산출:</strong> total_score 조회 및 NE Band 6단계 분류</li>
                <li><strong>표준화 지수 계산:</strong> 학생×과목 raw_score 기반 2단계 Z-Score(ZC) 산출</li>
                <li><strong>캠퍼스 집계:</strong> NE 분포, Elite CV, 전체 CV 산출</li>
                <li><strong>등급 및 경고 판정:</strong> EMI 등급 분류 및 Retention Alert(NE4+NE5% &gt; 10%) 체크</li>
                <li><strong>최종 가공:</strong> 직영 필터링, Z-Score 재순위화, 워터폴 및 요약 데이터 생성</li>
              </ol>
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-400 italic">
                * NF Studies/Cultural Conn. 제외 옵션 지원, 수치 정밀도 소수점 3자리(Z-Score) 및 2자리(NE %) 적용
              </div>
            </div>
          </section>

          {/* 5. 활용 가이드 */}
          <section className="space-y-4">
            <h4 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
              5. 활용 가이드
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h5 className="font-bold text-slate-800 dark:text-white">EMI 등급별 운영 진단</h5>
                <ul className="space-y-2 text-xs">
                  <li><strong className="text-emerald-600">P (Perfect):</strong> 모범 캠퍼스. 교수법 및 반 구성 벤치마크 대상.</li>
                  <li><strong className="text-blue-500">G (Growth):</strong> 표준 운영. NE2→NE1 전환을 위한 커리큘럼 보강 권장.</li>
                  <li><strong className="text-orange-500">U (Unbalanced):</strong> 성과는 높으나 엘리트 간 편차 큼. 중위권 강화 전략 필요.</li>
                  <li><strong className="text-rose-600">L (Lack):</strong> 성취 부족 위기. 교수법 재검토 및 밀착 관리 시급.</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h5 className="font-bold text-slate-800 dark:text-white">Retention Alert 대응</h5>
                <ul className="space-y-2 text-xs">
                  <li className="flex justify-between"><span>≤ 10%: 양호</span><span className="text-emerald-500">하위권 소수</span></li>
                  <li className="flex justify-between"><span>10% ~ 20%: 주의</span><span className="text-orange-500">이탈 위험 증가</span></li>
                  <li className="flex justify-between"><span>&gt; 20%: 위기</span><span className="text-rose-500">즉각 보충 프로그램 필요</span></li>
                </ul>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-xs text-slate-500 italic">
              * 벤치마크 및 드릴다운(수강반/학생 레벨)을 활용하여 공정한 평가와 구체적인 개선안을 수립하십시오.
            </div>
          </section>

          {/* 6. 활용 예시 */}
          <section className="space-y-4">
            <h4 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
              6. 활용 예시
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border-l-4 border-blue-500">
                <p className="font-medium text-slate-800 dark:text-white">"A캠퍼스 Z=0.3, ED+NE1=65%, CV=12%"</p>
                <p className="text-xs mt-1">→ <strong>G등급</strong>. Elite 학생 간 점수 편차가 크므로 하위 Elite(NE1 하단) 보강에 집중</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border-l-4 border-orange-500">
                <p className="font-medium text-slate-800 dark:text-white">"B캠퍼스 NE4+NE5=15%, Retention Alert"</p>
                <p className="text-xs mt-1">→ 전체 학생의 15%가 60점 미만. 기초학력 보충 프로그램 즉시 도입 권장</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border-l-4 border-rose-500">
                <p className="font-medium text-slate-800 dark:text-white">"C캠퍼스 Z=-0.8, L등급"</p>
                <p className="text-xs mt-1">→ 전국 평균 대비 큰 폭 하회. 교육과정 점검 및 학생 개별 맞춤 지도 필요</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const CampusRankingSection = ({ rankingRows }: { rankingRows: any[] }) => {
  const [typeFilter, setTypeFilter] = useState('전체');
  const [gradeFilter, setGradeFilter] = useState('전체 등급');
  const [sortCriteria, setSortCriteria] = useState('zRank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSortClick = (criteria: string) => {
    if (sortCriteria === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortDirection('asc');
    }
  };

  const filteredData = rankingRows.filter(item => {
    const matchType = typeFilter === '전체' || item.type === typeFilter;
    const matchGrade = gradeFilter === '전체 등급' || item.emi === gradeFilter.replace('등급', '');
    return matchType && matchGrade;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let valA = a[sortCriteria as keyof typeof a] as any;
    let valB = b[sortCriteria as keyof typeof b] as any;
    
    if (sortCriteria.includes('.')) {
      const parts = sortCriteria.split('.');
      valA = (a as any)[parts[0]][parts[1]];
      valB = (b as any)[parts[0]][parts[1]];
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
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
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex flex-col xl:flex-row items-center justify-between gap-3">
        <div className="flex-1 flex justify-start w-full xl:w-auto">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            11. 전국 캠퍼스 PEQM 랭킹 <span className="text-sm font-normal text-slate-500 ml-1">(총 {filteredData.length}개)</span>
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
            {['전체 등급', 'P등급', 'G등급', 'U등급', 'L등급'].map(grade => {
              const isActive = gradeFilter === grade;
              let activeClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
              if (grade === 'P등급') activeClass = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400';
              if (grade === 'G등급') activeClass = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
              if (grade === 'U등급') activeClass = 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
              if (grade === 'L등급') activeClass = 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400';
              
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center whitespace-nowrap">
          <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400">
            <tr>
              <th className="px-2 py-2 font-medium border-b border-r border-slate-200 dark:border-slate-700" rowSpan={2}>
                <SortButton criteria="zRank" label="Z 순위" />
              </th>
              <th className="px-2 py-2 font-medium border-b border-r border-slate-200 dark:border-slate-700" rowSpan={2}>
                <SortButton criteria="gradeRank" label="등급 순위" />
              </th>
              <th className="px-2 py-2 font-medium border-b border-r border-slate-200 dark:border-slate-700" rowSpan={2}>
                <SortButton criteria="type" label="운영구분" />
              </th>
              <th className="px-2 py-2 font-medium border-b border-r border-slate-200 dark:border-slate-700" rowSpan={2}>
                <SortButton criteria="name" label="캠퍼스명" align="left" />
              </th>
              <th className="px-2 py-2 font-medium border-b border-r border-slate-200 dark:border-slate-700" rowSpan={2}>
                <SortButton criteria="classes" label="학급수" align="right" />
              </th>
              <th className="px-2 py-2 font-medium border-b border-r border-slate-200 dark:border-slate-700" rowSpan={2}>
                <SortButton criteria="students" label="학생수" align="right" />
              </th>
              <th className="px-2 py-2 font-medium border-b border-r border-slate-200 dark:border-slate-700" rowSpan={2}>
                <SortButton criteria="avgPerClass" label="급당 평균학생수" align="right" />
              </th>
              <th className="px-2 py-2 font-medium border-b border-r border-slate-200 dark:border-slate-700" rowSpan={2}>
                <SortButton criteria="emi" label="EMI 등급" />
              </th>
              <th className="px-2 py-2 font-medium border-b border-r border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400" rowSpan={2}>
                <SortButton criteria="eliteZ" label="Elite Z-Score" align="right" />
              </th>
              <th className="px-2 py-2 font-medium border-b border-r border-slate-200 dark:border-slate-700 text-orange-500 dark:text-orange-400" rowSpan={2}>
                <SortButton criteria="eliteCv" label="Elite CV(ED+NE1)" align="right" />
              </th>
              <th className="px-2 py-2 font-medium border-b border-r border-slate-200 dark:border-slate-700 text-orange-500 dark:text-orange-400" rowSpan={2}>
                <SortButton criteria="eliteCvTotal" label="Elite CV(전체)" align="right" />
              </th>
              
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700" colSpan={2}>ED (90↑)%</th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700" colSpan={2}>NE 1 (80-89)%</th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700" colSpan={2}>NE 2 (70-79)%</th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700" colSpan={2}>NE 3 (60-69)%</th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700" colSpan={2}>NE 4 (50-59)%</th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700" colSpan={2}>NE 5 (50 미만)%</th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400" colSpan={2}>ED+NE1</th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700" colSpan={2}>NE2+NE3</th>
              <th className="px-2 py-1 font-medium border-b border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400" colSpan={2}>NE4+NE5</th>
            </tr>
            <tr>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ed.count" label="학생수" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ed.percent" label="비율" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ne1.count" label="학생수" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ne1.percent" label="비율" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ne2.count" label="학생수" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ne2.percent" label="비율" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ne3.count" label="학생수" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ne3.percent" label="비율" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ne4.count" label="학생수" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ne4.percent" label="비율" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ne5.count" label="학생수" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ne5.percent" label="비율" align="right" /></th>
              
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400"><SortButton criteria="edNe1.count" label="학생수" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400"><SortButton criteria="edNe1.percent" label="비율" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ne2Ne3.count" label="학생수" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700"><SortButton criteria="ne2Ne3.percent" label="비율" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-r border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400"><SortButton criteria="ne4Ne5.count" label="학생수" align="right" /></th>
              <th className="px-2 py-1 font-medium border-b border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400"><SortButton criteria="ne4Ne5.percent" label="비율" align="right" /></th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-300">
            {sortedData.length > 0 ? sortedData.map((row: any, idx: number) => (
              <tr key={idx} className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${idx < 3 ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 font-medium">{row.zRank}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50">{row.gradeRank}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50">{row.type}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 font-bold text-slate-900 dark:text-white text-left">{row.name}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.classes}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.students}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.avgPerClass.toFixed(1)}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 font-bold">
                  <span className={`px-2 py-0.5 rounded text-xs text-white ${row.emi === 'G' ? 'bg-emerald-500' : row.emi === 'P' ? 'bg-indigo-500' : row.emi === 'U' ? 'bg-amber-500' : 'bg-rose-500'}`}>
                    {row.emi}
                  </span>
                </td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right font-medium text-blue-600 dark:text-blue-400">{row.eliteZ.toFixed(2)}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right font-medium text-orange-500 dark:text-orange-400">{row.eliteCv.toFixed(2)}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right font-medium text-orange-500 dark:text-orange-400">{row.eliteCvTotal.toFixed(2)}</td>
                
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ed.count}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ed.percent.toFixed(1)}%</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ne1.count}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ne1.percent.toFixed(1)}%</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ne2.count}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ne2.percent.toFixed(1)}%</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ne3.count}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ne3.percent.toFixed(1)}%</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ne4.count}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ne4.percent.toFixed(1)}%</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ne5.count}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ne5.percent.toFixed(1)}%</td>
                
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right font-medium text-emerald-600 dark:text-emerald-400">{row.edNe1.count}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right font-medium text-emerald-600 dark:text-emerald-400">{row.edNe1.percent.toFixed(1)}%</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ne2Ne3.count}</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right">{row.ne2Ne3.percent.toFixed(1)}%</td>
                <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-700/50 text-right font-medium text-rose-600 dark:text-rose-400">{row.ne4Ne5.count}</td>
                <td className="px-2 py-2 text-right font-medium text-rose-600 dark:text-rose-400">{row.ne4Ne5.percent.toFixed(1)}%</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={29} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export function PeqmAnalysis({
  showAlert = true,
  selectedCampuses = [],
  showAllCampuses = true,
  selectedYear,
  selectedTests = [],
}: {
  showAlert?: boolean;
  selectedCampuses?: string[];
  showAllCampuses?: boolean;
  selectedYear?: number;
  selectedTests?: string[];
}) {
  const normalizeCampusName = (name: string) =>
    name.replace('폴리어학원(', '').replace(')', '').trim();

  const selectedPeriodKeys = selectedTests
    .map(parseExamOptionLabel)
    .filter((period): period is { year: number; month: number } => Boolean(period))
    .map(toExamPeriodKey);
  const periodKeySet = new Set(selectedPeriodKeys);

  const peqmRows = PEQM_CAMPUS_2025_MT_DATA.filter((row) => row.section === 'PEQM');
  const candidateRows =
    periodKeySet.size > 0
      ? peqmRows.filter((row) => periodKeySet.has(toExamPeriodKey({ year: row.year, month: row.month })))
      : selectedYear
        ? peqmRows.filter((row) => row.year === selectedYear)
        : peqmRows;
  const targetRows = candidateRows.length > 0 ? candidateRows : peqmRows;
  const latestPeriodKey = targetRows.reduce((max, row) => Math.max(max, toExamPeriodKey({ year: row.year, month: row.month })), 0);
  const periodRows = targetRows.filter((row) => toExamPeriodKey({ year: row.year, month: row.month }) === latestPeriodKey);

  const rankingSource = periodRows.map((row) => {
    const base = PEQM_RANKING_DATA.find((item) => normalizeCampusName(item.name).includes(row.campus));
    const ne2Ne3Count = row.ne2 + row.ne3;
    const ne4Ne5Count = row.ne4 + row.ne5;
    const edNe1Count = row.ed + row.ne1;

    return {
      zRank: row.rank,
      gradeRank: row.rank,
      type: row.operationType || base?.type || '직영',
      name: row.campus,
      classes: base?.classes ?? 0,
      students: row.students,
      avgPerClass: base?.avgPerClass ?? 0,
      emi: row.emiGrade || base?.emi || 'G',
      eliteZ: row.eliteZ,
      eliteCv: row.eliteCv,
      eliteCvTotal: row.eliteCv,
      ed: { count: row.ed, percent: row.students > 0 ? (row.ed / row.students) * 100 : 0 },
      ne1: { count: row.ne1, percent: row.students > 0 ? (row.ne1 / row.students) * 100 : 0 },
      ne2: { count: row.ne2, percent: row.students > 0 ? (row.ne2 / row.students) * 100 : 0 },
      ne3: { count: row.ne3, percent: row.students > 0 ? (row.ne3 / row.students) * 100 : 0 },
      ne4: { count: row.ne4, percent: row.students > 0 ? (row.ne4 / row.students) * 100 : 0 },
      ne5: { count: row.ne5, percent: row.students > 0 ? (row.ne5 / row.students) * 100 : 0 },
      edNe1: { count: edNe1Count, percent: row.edNe1Pct },
      ne2Ne3: { count: ne2Ne3Count, percent: row.ne2Ne3Pct },
      ne4Ne5: { count: ne4Ne5Count, percent: row.ne4Ne5Pct },
    };
  });

  const campusFilteredRows = showAllCampuses
    ? rankingSource
    : selectedCampuses.length > 0
      ? rankingSource.filter((row) => selectedCampuses.some((campus) => normalizeCampusName(row.name).includes(campus)))
      : rankingSource;

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
              캠퍼스 5개 미만 - 통계 신뢰도 주의
            </div>
          )}
        </div>
        <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm">
          <Download className="w-4 h-4" />
          <span>Excel 다운로드</span>
        </button>
      </div>

      <AnalysisSection title="1. 선택 캠퍼스 기준" data={TOTAL_OPERATION_TYPE_DATA} />
      <AnalysisSection title="2. 지역권역 기준" data={REGION_DATA} />
      <AnalysisSection title="3. 학생수 기준" data={STUDENT_SIZE_DATA} />
      <AnalysisSection title="4. 학급수 기준" data={CLASS_SIZE_DATA} />
      <AnalysisSection title="5. 운영 기간 기준" data={OPERATION_PERIOD_DATA} />
      <PerformanceMatrixSection />
      <GuideSection />
      <CampusRankingSection rankingRows={campusFilteredRows.length > 0 ? campusFilteredRows : rankingSource} />
    </div>
  );
}
