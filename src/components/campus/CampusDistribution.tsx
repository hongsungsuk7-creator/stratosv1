import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { BarChart2 } from 'lucide-react';
import { SUBJECT_ACCURACY } from '../../data/campusMockData';

export function CampusDistribution() {
  const distributionData = [
    { type: 'ECP', r1: '2(25.0%)', r2: '1(12.5%)', r3: '2(25.0%)', r4: '1(12.5%)', r5: '2(25.0%)', total: '8(100.0%)' },
    { type: 'ELE', r1: '4(26.7%)', r2: '3(20.0%)', r3: '3(20.0%)', r4: '2(13.3%)', r5: '3(20.0%)', total: '15(100.0%)' },
    { type: 'GRAD', r1: '1(20.0%)', r2: '1(20.0%)', r3: '1(20.0%)', r4: '1(20.0%)', r5: '1(20.0%)', total: '5(100.0%)' },
    { type: '계', r1: '7(25.0%)', r2: '5(17.9%)', r3: '6(21.4%)', r4: '4(14.3%)', r5: '6(21.4%)', total: '28(100.0%)', isTotal: true },
  ];

  const gaugeData = SUBJECT_ACCURACY.map(item => ({
    subject: item.subject,
    value: item.campus,
    color: item.subject === 'English' ? '#3b82f6' : item.subject === 'Eng. Foundations' ? '#10b981' : '#f97316'
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center dark:text-white">
            <BarChart2 className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            순위구간별 학급 분포
          </h3>
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full dark:bg-indigo-500/10 dark:text-indigo-400">
            총 28개 학급
          </span>
        </div>
        <div className="overflow-x-auto mt-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-600 bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">과정</th>
                <th className="px-4 py-3 font-semibold text-center">상위 10%</th>
                <th className="px-4 py-3 font-semibold text-center">11-30%</th>
                <th className="px-4 py-3 font-semibold text-center">31-50%</th>
                <th className="px-4 py-3 font-semibold text-center">51-70%</th>
                <th className="px-4 py-3 font-semibold text-center">하위 30%</th>
                <th className="px-4 py-3 font-bold text-center text-indigo-600 dark:text-indigo-400">계</th>
              </tr>
            </thead>
            <tbody>
              {distributionData.map((row, idx) => (
                <tr 
                  key={idx} 
                  className={`border-b border-slate-100 dark:border-slate-700/50 last:border-0 ${
                    row.isTotal ? 'bg-slate-50/50 dark:bg-slate-800/50 font-medium' : ''
                  }`}
                >
                  <td className={`px-4 py-3 ${row.isTotal ? 'font-bold text-slate-800 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {row.type}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{row.r1}</td>
                  <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{row.r2}</td>
                  <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{row.r3}</td>
                  <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{row.r4}</td>
                  <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{row.r5}</td>
                  <td className={`px-4 py-3 text-center ${row.isTotal ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 flex flex-col">
        <div className="flex items-center mb-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center dark:text-white">
            <BarChart2 className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            과목별 캠퍼스 평균 정답률
          </h3>
        </div>
        
        <div className="w-full h-64 mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gaugeData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
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
              <Tooltip 
                cursor={{ fill: '#f1f5f9', opacity: 0.5 }} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${value}%`, '정답률']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                {gaugeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList dataKey="value" position="top" formatter={(val: number) => `${val}%`} fill="#475569" fontSize={12} fontWeight={600} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
