import React from 'react';
import { Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';

/** 순위 변동: 전월·전기 등 이전 기간 대비 캠퍼스 순위 변화 */
export type CampusRankChange =
  | { kind: 'up'; delta: number }
  | { kind: 'down'; delta: number }
  | { kind: 'same' }
  | { kind: 'none' };

export interface CampusRankingRow {
  rank: number;
  name: string;
  type?: string;
  pScore: number;
  rankChange: CampusRankChange;
}

interface AlertsAndRankingsProps {
  topCampuses: CampusRankingRow[];
  bottomCampuses: CampusRankingRow[];
}

function RankChangeIndicator({ rankChange }: { rankChange: CampusRankChange }) {
  if (rankChange.kind === 'up') {
    return (
      <span
        className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tabular-nums"
        title={`순위 ${rankChange.delta.toFixed(1)}계단 상승`}
      >
        <TrendingUp className="w-3.5 h-3.5 shrink-0" aria-hidden />
        {rankChange.delta.toFixed(1)}
      </span>
    );
  }
  if (rankChange.kind === 'down') {
    return (
      <span
        className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400 text-xs font-semibold tabular-nums"
        title={`순위 ${rankChange.delta.toFixed(1)}계단 하락`}
      >
        <TrendingDown className="w-3.5 h-3.5 shrink-0" aria-hidden />
        {rankChange.delta.toFixed(1)}
      </span>
    );
  }

  const sameOrNoneTitle =
    rankChange.kind === 'same' ? '순위 변동 없음' : '비교 데이터 없음';
  return (
    <span
      className="inline-flex items-center justify-center min-w-[2.25rem] text-xs font-bold tabular-nums text-slate-500 dark:text-slate-400"
      title={sameOrNoneTitle}
    >
      <Minus className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden />
    </span>
  );
}

export function AlertsAndRankings({ topCampuses, bottomCampuses }: AlertsAndRankingsProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center dark:text-white">
          <Award className="w-5 h-5 mr-2 text-amber-500 dark:text-amber-400" /> 캠퍼스 Top / Bottom Ranking
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2 dark:border-slate-700">
              <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">🏆 Top 10 캠퍼스 (Best Practice)</h4>
            </div>
            <div className="space-y-2">
              {topCampuses.slice(0, 10).map((c) => (
                <div key={c.rank} className="flex items-center justify-between text-sm p-2 hover:bg-slate-50 rounded dark:hover:bg-slate-700/50">
                  <div className="flex items-center min-w-0">
                    <span className="w-5 font-bold text-slate-400 dark:text-slate-500 shrink-0">{c.rank}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 w-24 truncate">{c.name}</span>
                    {c.type && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          c.type === '직영'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                            : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
                        }`}
                      >
                        {c.type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-slate-800 dark:text-white tabular-nums">{c.pScore}</span>
                    <RankChangeIndicator rankChange={c.rankChange} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2 dark:border-slate-700">
              <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">🚨 Bottom 10 캠퍼스 (감사/컨설팅 대상)</h4>
            </div>
            <div className="space-y-2">
              {bottomCampuses.slice(0, 10).map((c) => (
                <div key={c.rank} className="flex items-center justify-between text-sm p-2 hover:bg-slate-50 rounded dark:hover:bg-slate-700/50">
                  <div className="flex items-center min-w-0">
                    <span className="w-5 font-bold text-slate-400 dark:text-slate-500 shrink-0">{c.rank}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 w-24 truncate">{c.name}</span>
                    {c.type && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          c.type === '직영'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                            : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
                        }`}
                      >
                        {c.type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-slate-800 dark:text-white tabular-nums">{c.pScore}</span>
                    <RankChangeIndicator rankChange={c.rankChange} />
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
