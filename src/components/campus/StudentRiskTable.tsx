import React from 'react';
import { Users } from 'lucide-react';
import { CLASSES_DATA } from '../../data/campusMockData';

export function StudentRiskTable() {
  const riskData = CLASSES_DATA.map(c => {
    const excellent = Math.floor(c.studentCount * (c.pScore > 80 ? 0.4 : 0.2));
    const risk = Math.floor(c.studentCount * (c.pScore < 70 ? 0.3 : 0.1));
    const normal = c.studentCount - excellent - risk;
    
    return {
      ...c,
      excellent,
      normal,
      risk,
      excellentPct: (excellent / c.studentCount) * 100,
      normalPct: (normal / c.studentCount) * 100,
      riskPct: (risk / c.studentCount) * 100,
    };
  }).slice(0, 5);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 h-full">
      <h3 className="text-base font-bold text-slate-800 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:text-white">
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"/> 학급 리스크 분석 (신호등)
        </div>
        <button className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors shrink-0 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20">
          AI 분석 연동
        </button>
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700">
            <tr>
              <th className="py-3 px-4">학급명</th>
              <th className="py-3 px-4">학생수</th>
              <th className="py-3 px-4">우수</th>
              <th className="py-3 px-4">정상</th>
              <th className="py-3 px-4">위험</th>
              <th className="py-3 px-4">학생 리스크 (신호등)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {riskData.map((item, index) => {
              const excellentDots = Math.round(item.excellentPct / 10);
              const normalDots = Math.round(item.normalPct / 10);
              const riskDots = Math.round(item.riskPct / 10);

              return (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{item.name}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{item.studentCount}명</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">{item.excellentPct.toFixed(1)}%</td>
                  <td className="py-3 px-4 font-bold text-amber-500 dark:text-amber-400">{item.normalPct.toFixed(1)}%</td>
                  <td className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">{item.riskPct.toFixed(1)}%</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-1 flex-wrap gap-y-1">
                      {Array.from({ length: excellentDots }).map((_, i) => (
                        <div key={`e-${i}`} className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      ))}
                      {Array.from({ length: normalDots }).map((_, i) => (
                        <div key={`n-${i}`} className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      ))}
                      {Array.from({ length: riskDots }).map((_, i) => (
                        <div key={`r-${i}`} className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
