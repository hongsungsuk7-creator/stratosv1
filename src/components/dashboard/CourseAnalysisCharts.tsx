import React from 'react';
import { TrendingUp, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { peqmData_2025_09 } from '../../data/examData';
import { CAMPUS_INFO } from '../../constants';

interface CourseAnalysisChartsProps {
  testType: string;
  selectedYear: number;
  selectedTests: string[];
}

export function CourseAnalysisCharts({ testType, selectedYear: _selectedYear, selectedTests }: CourseAnalysisChartsProps) {
  const MT_MONTHS = [1, 3, 4, 6, 7, 9, 10, 12];
  const LT_MONTHS = [2, 5, 8, 11];

  const getSelectedMonth = () => {
    if (!selectedTests || selectedTests.length === 0) return testType === 'MT' ? 12 : 11;
    const match = selectedTests[0].match(/\((\d+)월\)/);
    return match ? parseInt(match[1], 10) : (testType === 'MT' ? 12 : 11);
  };

  const generateTrendData = () => {
    const selectedMonth = getSelectedMonth();
    const months = testType === 'MT' ? MT_MONTHS : LT_MONTHS;
    const count = testType === 'MT' ? 8 : 4;
    
    let currentIndex = months.indexOf(selectedMonth);
    if (currentIndex === -1) {
      const availableMonths = months.filter(m => m <= selectedMonth);
      currentIndex = availableMonths.length > 0 ? months.indexOf(availableMonths[availableMonths.length - 1]) : months.length - 1;
    }

    const data = [];
    let monthIdx = currentIndex;

    for (let i = 0; i < count; i++) {
      const m = months[monthIdx];
      data.unshift({
        session: `${m}월 ${testType}`,
        'LX A': Math.floor(Math.random() * 15) + 75,
        'GT1': Math.floor(Math.random() * 15) + 70,
        'MAG1': Math.floor(Math.random() * 15) + 80,
      });

      monthIdx--;
      if (monthIdx < 0) {
        monthIdx = months.length - 1;
      }
    }

    return data;
  };

  const dynamicTrendData = generateTrendData();

  // Transform PEQM data for the scatter chart
  const courseDifficultyData = peqmData_2025_09.map(item => ({
    course: item.campus, // Using campus as a proxy for course/class for now
    score: item.edNe1Ratio, // Using ED+NE1 ratio as a proxy for score
    difficulty: item.eliteZScore + 3, // Shifting Z-score to a positive difficulty scale (approx 2-6)
    size: item.students * 10, // Scaling up students for bubble size
    emiGrade: item.emiGrade
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center dark:text-white">
          <TrendingUp className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"/> 과정별 성과 추이
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dynamicTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700"/>
              <XAxis dataKey="session" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}}/>
              <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}}/>
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
              <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}}/>
              <Line type="monotone" dataKey="LX A" stroke="#4f46e5" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}}/>
              <Line type="monotone" dataKey="GT1" stroke="#0ea5e9" strokeWidth={2} dot={{r: 4}}/>
              <Line type="monotone" dataKey="MAG1" stroke="#f59e0b" strokeWidth={2} dot={{r: 4}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center dark:text-white">
          <Target className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"/> 캠퍼스별 난이도(Z-Score) vs 우수학생 비율
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700"/>
              <XAxis type="number" dataKey="difficulty" name="Z-Score (조정)" domain={[2, 4]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} label={{ value: '난이도 (Z-Score 기반)', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#94a3b8' }}/>
              <YAxis type="number" dataKey="score" name="우수비율" domain={[30, 100]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}}/>
              <ZAxis type="number" dataKey="size" range={[50, 400]} name="학생수" />
              <Tooltip 
                cursor={{strokeDasharray: '3 3'}} 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const campusInfo = CAMPUS_INFO.find(c => c.name === data.course);
                    const shortName = data.course.replace('폴리어학원(', '').replace(')', '');
                    const typeAndRegion = campusInfo && campusInfo.type && campusInfo.region 
                      ? `(${campusInfo.type}ㆍ${campusInfo.region})` 
                      : '';
                    const bgColor = data.emiGrade === 'G' ? '#10b981' : '#ef4444';

                    return (
                      <div className="bg-slate-800 p-3 rounded-lg shadow-md border border-slate-700 text-white">
                        <div className="mb-2 flex items-center">
                          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: bgColor, marginRight: '6px', flexShrink: 0 }}></span>
                          <span className="font-bold text-[14px] text-slate-100">{shortName}</span>
                          {typeAndRegion && <span className="text-[11px] text-slate-400 ml-1 font-normal">{typeAndRegion}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-[13px] text-slate-300">
                            난이도 (Z-Score 기반): {typeof data.difficulty === 'number' ? data.difficulty.toFixed(2) : data.difficulty}
                          </div>
                          <div className="text-[13px] text-slate-300">
                            우수비율: {typeof data.score === 'number' ? data.score.toFixed(1) : data.score}%
                          </div>
                          <div className="text-[13px] text-slate-300">
                            학생수: {data.size / 10}명
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="캠퍼스" data={courseDifficultyData} fill="#8b5cf6">
                {courseDifficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.emiGrade === 'G' ? '#10b981' : '#ef4444'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
