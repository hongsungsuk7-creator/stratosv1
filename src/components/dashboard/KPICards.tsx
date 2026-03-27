import React from 'react';
import { TrendingUp, AlertTriangle, Award, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { UserGroup } from '../../types';
import { examData_2025_09, pcRamData_2025_09 } from '../../data/examData';

interface KPICardsProps {
  userGroup: UserGroup;
}

export function KPICards({ userGroup: _userGroup }: KPICardsProps) {
  // Calculate averages from data
  const totalPScore = examData_2025_09.reduce((acc, curr) => acc + curr.totalAvg, 0) / examData_2025_09.length;
  const totalZScore = pcRamData_2025_09.reduce((acc, curr) => acc + curr.checkZ, 0) / pcRamData_2025_09.length;
  const totalCV = examData_2025_09.reduce((acc, curr) => acc + curr.balanceCV, 0) / examData_2025_09.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-500 text-sm font-medium dark:text-slate-400">평균 P-Score</h3>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-500/10 dark:text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800 dark:text-white">
          {totalPScore.toFixed(1)}
        </div>
        <div className="text-emerald-500 text-xs font-medium flex items-center mt-2"><ArrowUpRight className="w-3 h-3 mr-1"/> +1.2 from last exam</div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-500 text-sm font-medium dark:text-slate-400">평균 Z-Score</h3>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg dark:bg-amber-500/10 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800 dark:text-white">
          {totalZScore.toFixed(2)}
        </div>
        <div className="text-emerald-500 text-xs font-medium flex items-center mt-2"><ArrowUpRight className="w-3 h-3 mr-1"/> +0.05 from last exam</div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-500 text-sm font-medium dark:text-slate-400">평균 AR (성취도)</h3>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg dark:bg-indigo-500/10 dark:text-indigo-400">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800 dark:text-white">
          {totalPScore.toFixed(1)}%
        </div>
        <div className="text-rose-500 text-xs font-medium flex items-center mt-2"><ArrowDownRight className="w-3 h-3 mr-1"/> -1.5% from last exam</div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-500 text-sm font-medium dark:text-slate-400">평균 CV (변동계수)</h3>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg dark:bg-emerald-500/10 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800 dark:text-white">
          {totalCV.toFixed(1)}%
        </div>
        <div className="text-emerald-500 text-xs font-medium flex items-center mt-2"><ArrowDownRight className="w-3 h-3 mr-1"/> -2.1% (편차 감소)</div>
      </div>
    </div>
  );
}
