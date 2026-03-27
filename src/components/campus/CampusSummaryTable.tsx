import React from 'react';
import { Activity } from 'lucide-react';

export function CampusSummaryTable() {
  const campusSummary = [
    { type: 'ECP (Kinder)', pScore: 82.5, zScore: 0.45, excellent: 45, normal: 40, risk: 15 },
    { type: 'ELE (Elementary)', pScore: 78.2, zScore: -0.12, excellent: 38, normal: 42, risk: 20 },
    { type: 'GRAD (Middle)', pScore: 85.7, zScore: 0.88, excellent: 52, normal: 38, risk: 10 },
    { type: '전체 평균', pScore: 81.4, zScore: 0.32, excellent: 44, normal: 41, risk: 15 },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700 mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center dark:text-white">
        <Activity className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"/> Section 1. 캠퍼스 교육 상태 (전체 과정 종합)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600">
            <tr>
              <th className="py-3 px-4">과정</th>
              <th className="py-3 px-4">P-Score (평균)</th>
              <th className="py-3 px-4">Z-Score</th>
              <th className="py-3 px-4">우수군 (Green)</th>
              <th className="py-3 px-4">정상군 (Yellow)</th>
              <th className="py-3 px-4">즉시관리군 (Red)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {campusSummary.map((row, idx) => (
              <tr key={idx} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${row.type === '전체 평균' ? 'bg-slate-50/50 dark:bg-slate-900/50 font-bold' : ''}`}>
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{row.type}</td>
                <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">{row.pScore}</td>
                <td className="py-3 px-4 dark:text-slate-300">{row.zScore}</td>
                <td className="py-3 px-4 dark:text-slate-300">
                  <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>{row.excellent}%</div>
                </td>
                <td className="py-3 px-4 dark:text-slate-300">
                  <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-400 mr-2"></div>{row.normal}%</div>
                </td>
                <td className="py-3 px-4 dark:text-slate-300">
                  <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div>{row.risk}%</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
