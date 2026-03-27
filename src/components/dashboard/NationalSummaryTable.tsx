import React from 'react';
import { Activity } from 'lucide-react';

interface NationalSummaryTableProps {
  nationalSummary: {
    type: string;
    pScore: number;
    zScore: number;
    excellent: number;
    normal: number;
    risk: number;
  }[];
}

export function NationalSummaryTable({ nationalSummary }: NationalSummaryTableProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center dark:text-white">
        <Activity className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"/> Section 1. 전국 교육 상태 (전체 과정 종합)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600">
            <tr>
              <th className="py-3 px-4">구분</th>
              <th className="py-3 px-4">P-Score (평균)</th>
              <th className="py-3 px-4">Z-Score</th>
              <th className="py-3 px-4">우수군 (Green)</th>
              <th className="py-3 px-4">정상군 (Yellow)</th>
              <th className="py-3 px-4">즉시관리군 (Red)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {nationalSummary.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
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
