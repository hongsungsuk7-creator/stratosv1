import React from 'react';
import { TrendingUp, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { CLASSES_DATA, CAMPUS_DATA } from '../../data/campusMockData';
import {
  ScatterDiagnosisDotLegend,
  dotFillForPcramStatus,
} from '../charts/ScatterDiagnosisDotLegend';

interface ClassAnalysisChartsProps {
  testType?: string;
  selectedYear?: number;
  selectedMonth?: number;
}

export function ClassAnalysisCharts({ 
  testType = 'MT', 
  selectedYear: _selectedYear = 2025, 
  selectedMonth = 12 
}: ClassAnalysisChartsProps) {
  const match = CAMPUS_DATA.name.match(/\((.*?)\)/);
  const campusName = match ? `${match[1]} 캠퍼스` : '우리 캠퍼스';

  const scatterData = CLASSES_DATA.map(c => ({
    name: c.name,
    zScore: c.zScore,
    excellentRatio: c.excellentRatio,
    studentCount: c.studentCount,
    emiGrade: c.peqm, // Using peqm as emiGrade proxy
    pcramStatus: c.pcramStatus,
  }));
  const zMin = Math.min(...scatterData.map((d) => d.zScore));
  const zMax = Math.max(...scatterData.map((d) => d.zScore));
  const zPad = 0.35;
  const zDomain: [number, number] = [zMin - zPad, zMax + zPad];

  const MT_MONTHS = [1, 3, 4, 6, 7, 9, 10, 12];
  const LT_MONTHS = [2, 5, 8, 11];

  const generateTrendData = () => {
    const months = testType === 'MT' ? MT_MONTHS : LT_MONTHS;
    const count = testType === 'MT' ? 8 : 4;
    
    const labels = [];
    let monthIdx = months.indexOf(selectedMonth);
    
    if (monthIdx === -1) {
      monthIdx = months.length - 1; 
    }

    for (let i = 0; i < count; i++) {
      labels.unshift(`${months[monthIdx]}월 ${testType}`);
      monthIdx--;
      if (monthIdx < 0) {
        monthIdx = months.length - 1;
      }
    }

    // Generate deterministic mock data based on the labels
    const mockCampus = [72.1, 73.5, 74.2, 75.8, 75.1, 76.5, 76.8, 77.2];
    const mockNational = [70.5, 71.2, 71.5, 72.1, 71.8, 72.4, 72.4, 72.8];
    
    return labels.map((label, index) => {
      return {
        month: label,
        campus: mockCampus[index % mockCampus.length],
        national: mockNational[index % mockNational.length]
      };
    });
  };

  const dynamicTrendData = generateTrendData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center dark:text-white">
          <TrendingUp className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"/> 성취도 변화 추이 (월별)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dynamicTrendData} margin={{ top: 8, right: 12, left: 22, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700"/>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}}/>
              <YAxis
                domain={[60, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                label={{
                  value: '평균 정답률 (%)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  style: { textAnchor: 'middle' },
                  fontSize: 11,
                  fill: '#64748b',
                }}
              />
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
              <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}}/>
              <Line type="monotone" dataKey="national" name="전국 평균" stroke="#f43f5e" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}}/>
              <Line type="monotone" dataKey="campus" name={campusName} stroke="#4f46e5" strokeWidth={2} dot={{r: 4}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center dark:text-white">
          <Target className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"/> 학급별 난이도(Z-Score) vs 우수학생 비율
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 20, bottom: 28, left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700"/>
              <XAxis
                type="number"
                dataKey="zScore"
                name="난이도(Z-Score)"
                domain={zDomain}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={(v: number) => v.toFixed(2)}
                label={{
                  value: '난이도 (Z-Score)',
                  position: 'insideBottom',
                  offset: -4,
                  fontSize: 11,
                  fill: '#64748b',
                }}
              />
              <YAxis
                type="number"
                dataKey="excellentRatio"
                name="우수비율"
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                label={{
                  value: '우수학생 비율 (%)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 4,
                  style: { textAnchor: 'middle' },
                  fontSize: 11,
                  fill: '#64748b',
                }}
              />
              <ZAxis type="number" dataKey="studentCount" range={[50, 400]} name="학생수" />
              <Tooltip 
                cursor={{strokeDasharray: '3 3'}} 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const bgColor = dotFillForPcramStatus(data.pcramStatus);
                    const ratio = Number(data.excellentRatio);
                    const total = Number(data.studentCount);
                    const edNe1Count = Math.round((total * ratio) / 100);
                    return (
                      <div className="bg-slate-800 p-3 rounded-lg shadow-md border border-slate-700 text-white">
                        <div className="mb-2 flex items-center">
                          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: bgColor, marginRight: '6px', flexShrink: 0 }}></span>
                          <span className="font-bold text-[14px] text-slate-100">{data.name}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-[13px] text-slate-300">
                            난이도 (Z-Score 기반) {Number(data.zScore).toFixed(2)}
                          </div>
                          <div className="text-[13px] text-slate-300">
                            우수비율(ED, NE1) : {ratio}%&nbsp;&nbsp;({edNe1Count}명)
                          </div>
                          <div className="text-[13px] text-slate-300">학급 인원: {total}명</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="학급" data={scatterData} fill="#8b5cf6">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={dotFillForPcramStatus(entry.pcramStatus)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <ScatterDiagnosisDotLegend />
      </div>
    </div>
  );
}
