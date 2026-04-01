import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type DashboardCollapsibleSectionProps = {
  title: string;
  /** 제목 직후 · 접미 앞에 표시 (예: 응시 N개 캠퍼스 배지) */
  titleAccessory?: React.ReactNode;
  /** 제목·titleAccessory 뒤 회색 접미 설명 (예: ` - …` 형태로 렌더) */
  titleSuffix?: string;
  defaultOpen?: boolean;
  /** 본문 래퍼 패딩 (기본 `p-3`). 상단만 줄이려면 `px-3 pb-3 pt-0` 등 */
  contentClassName?: string;
  children: React.ReactNode;
};

export function DashboardCollapsibleSection({
  title,
  titleAccessory,
  titleSuffix,
  defaultOpen = true,
  contentClassName,
  children,
}: DashboardCollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/40"
        aria-expanded={open}
      >
        <h2 className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-left text-sm font-semibold text-slate-900 dark:text-white">
          <span className="min-w-0 truncate">{title}</span>
          {titleAccessory}
          {titleSuffix ? (
            <span className="shrink-0 font-normal text-slate-500 dark:text-slate-400">
              - {titleSuffix}
            </span>
          ) : null}
        </h2>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-400 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="border-t border-slate-200 dark:border-slate-700">
          <div className={contentClassName ?? 'p-3'}>{children}</div>
        </div>
      ) : null}
    </section>
  );
}
