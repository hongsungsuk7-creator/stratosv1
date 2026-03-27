import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { BarChart2 } from 'lucide-react';

export function DistributionAndAverages() {
  const distributionData = [
    { type: '직영', r1: '6(10.3%)', r2: '3(5.2%)', r3: '2(3.4%)', r4: '2(3.4%)', r5: '1(1.7%)', total: '14(24.1%)' },
    { type: '분원', r1: '4(6.9%)', r2: '7(12.1%)', r3: '8(13.8%)', r4: '8(13.8%)', r5: '17(29.3%)', total: '44(75.9%)' },
    { type: '계', r1: '10(17.2%)', r2: '10(17.2%)', r3: '10(17.2%)', r4: '10(17.2%)', r5: '18(31.0%)', total: '58(100.0%)', isTotal: true },
  ];

  const gaugeData = [
    { subject: 'English', value: 79.7, color: '#3b82f6' }, // blue-500
    { subject: 'English Foundations', value: 74.2, color: '#10b981' }, // emerald-500
    { subject: 'Speech Building', value: 91.7, color: '#f97316' }, // orange-500
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Distribution Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-slate-800 flex items-center dark:text-white">
            <BarChart2 className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            순위구간별 직영/분원 분포
          </h3>
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full dark:bg-indigo-500/10 dark:text-indigo-400">
            총 58개
          </span>
        </div>
        <div className="overflow-x-auto mt-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-600 bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">학원수</th>
                <th className="px-4 py-3 font-semibold text-center">1위-10위</th>
                <th className="px-4 py-3 font-semibold text-center">11위-20위</th>
                <th className="px-4 py-3 font-semibold text-center">21위-30위</th>
                <th className="px-4 py-3 font-semibold text-center">31위-40위</th>
                <th className="px-4 py-3 font-semibold text-center">41위-58위</th>
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

      {/* Right: Bar Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 flex flex-col">
        <div className="flex items-center mb-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center dark:text-white">
            <BarChart2 className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            과목별 전국 평균 정답률
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
