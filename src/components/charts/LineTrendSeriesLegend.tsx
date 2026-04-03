import React from 'react';

export type LineTrendLegendItem = { label: string; color: string };

/** 산점도 `ScatterDiagnosisDotLegend`와 동일한 하단 스트립 레이아웃 */
export function LineTrendSeriesLegend({
  items,
  className = '',
}: {
  items: LineTrendLegendItem[];
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-[2.75rem] flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3 dark:border-slate-700 ${className}`}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400"
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
