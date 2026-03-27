import React from 'react';
import { Users } from 'lucide-react';
import { peqmData_2025_09 } from '../../data/examData';

export function ClassRiskTable() {
  // Sort by risk (highest NE4+NE5 ratio first) and take top 5
  const riskData = [...peqmData_2025_09]
    .sort((a, b) => b.ne4Ne5Ratio - a.ne4Ne5Ratio)
    .slice(0, 5);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
      <h3 className="text-base font-bold text-slate-800 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:text-white">
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"/> Section 5. 캠퍼스 리스크 분석 (신호등 시스템)
        </div>
        <button className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors shrink-0 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20">
          AI 튜터 (i-LENS L-IO) 연동 분석
        </button>
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700">
            <tr>
              <th className="py-3 px-4">캠퍼스</th>
              <th className="py-3 px-4">학생수</th>
              <th className="py-3 px-4">우수 (ED+NE1)</th>
              <th className="py-3 px-4">정상 (NE2+NE3)</th>
              <th className="py-3 px-4">위험 (NE4+NE5)</th>
              <th className="py-3 px-4">학생 리스크 (신호등)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {riskData.map((campus, index) => {
              // Calculate dots based on percentages (1 dot = 10%)
              const excellentDots = Math.round(campus.edNe1Ratio / 10);
              const normalDots = Math.round(campus.ne2Ne3Ratio / 10);
              const riskDots = Math.round(campus.ne4Ne5Ratio / 10);

              return (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{campus.campus}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{campus.students}명</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">{campus.edNe1Ratio.toFixed(1)}%</td>
                  <td className="py-3 px-4 font-bold text-amber-500 dark:text-amber-400">{campus.ne2Ne3Ratio.toFixed(1)}%</td>
                  <td className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">{campus.ne4Ne5Ratio.toFixed(1)}%</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-1 flex-wrap gap-y-1">
                      {Array.from({ length: excellentDots }).map((_, i) => (
                        <div key={`e-${i}`} className="w-3 h-3 rounded-full bg-emerald-500" title={`우수: ${campus.edNe1Count}명`}></div>
                      ))}
                      {Array.from({ length: normalDots }).map((_, i) => (
                        <div key={`n-${i}`} className="w-3 h-3 rounded-full bg-amber-400" title={`정상: ${campus.ne2Ne3Count}명`}></div>
                      ))}
                      {Array.from({ length: riskDots }).map((_, i) => (
                        <div key={`r-${i}`} className="w-3 h-3 rounded-full bg-rose-500" title={`위험: ${campus.ne4Ne5Count}명`}></div>
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
