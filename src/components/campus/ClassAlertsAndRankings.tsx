import React from 'react';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';
import { CLASSES_DATA } from '../../data/campusMockData';

export function ClassAlertsAndRankings() {
  const sortedClasses = [...CLASSES_DATA].sort((a, b) => b.pScore - a.pScore);
  const topClasses = sortedClasses.slice(0, 5);
  const bottomClasses = sortedClasses.slice(-5).reverse();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 flex shrink-0 items-center text-base font-bold text-slate-800 dark:text-white">
          <Award className="w-5 h-5 mr-2 text-amber-500 dark:text-amber-400"/> 학급 Top / Bottom Ranking
        </h3>
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2 dark:border-slate-700">
              <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">🏆 Top 5 학급 (Best Practice)</h4>
            </div>
            <div className="space-y-2">
              {topClasses.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm p-2 hover:bg-slate-50 rounded dark:hover:bg-slate-700/50">
                  <div className="flex items-center">
                    <span className="w-5 font-bold text-slate-400 dark:text-slate-500">{idx + 1}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 w-24">{c.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">{c.teacherKr}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-800 dark:text-white">{c.pScore.toFixed(1)}</span>
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2 dark:border-slate-700">
              <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">🚨 Bottom 5 학급 (집중 관리 대상)</h4>
            </div>
            <div className="space-y-2">
              {bottomClasses.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm p-2 hover:bg-slate-50 rounded dark:hover:bg-slate-700/50">
                  <div className="flex items-center">
                    <span className="w-5 font-bold text-slate-400 dark:text-slate-500">{CLASSES_DATA.length - idx}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 w-24">{c.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">{c.teacherKr}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-800 dark:text-white">{c.pScore.toFixed(1)}</span>
                    <TrendingDown className="w-3 h-3 text-rose-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
