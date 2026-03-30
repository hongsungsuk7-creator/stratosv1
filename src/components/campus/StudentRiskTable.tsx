import React from 'react';
import { Users } from 'lucide-react';
import { CLASSES_DATA } from '../../data/campusMockData';

const COLOR_EXCELLENT = '#00C281';
const COLOR_NORMAL = '#FBB000';
const COLOR_RISK = '#FF3366';

type RiskRow = {
  name: string;
  studentCount: number;
  excellent: number;
  normal: number;
  risk: number;
  excellentPct: number;
  normalPct: number;
  riskPct: number;
};

/** 합이 100이 되도록 정규화(부동소수점 보정). 실제 표시 비율은 원본 값을 그대로 사용. */
function normalizeWidths(ex: number, no: number, ri: number): { wEx: number; wNo: number; wRi: number } {
  const sum = ex + no + ri;
  if (sum <= 0) return { wEx: 0, wNo: 0, wRi: 0 };
  return {
    wEx: (ex / sum) * 100,
    wNo: (no / sum) * 100,
    wRi: (ri / sum) * 100,
  };
}

function RiskStackedBar({ row }: { row: RiskRow }) {
  const { wEx, wNo, wRi } = normalizeWidths(row.excellentPct, row.normalPct, row.riskPct);

  const seg = (
    key: 'ex' | 'no' | 'ri',
    widthPct: number,
    label: string,
    color: string,
    count: number,
    rawPct: number,
  ) => {
    if (widthPct <= 0) return null;
    const title = `${label}: ${rawPct.toFixed(2)}% (${count}명) · 학급 ${row.studentCount}명 기준`;
    return (
      <div
        key={key}
        className="h-full min-w-0"
        style={{ flex: `0 0 ${widthPct}%` }}
      >
        <div
          className="h-3 w-full min-h-[12px] cursor-help transition-opacity hover:opacity-90"
          style={{ backgroundColor: color }}
          title={title}
          role="img"
          aria-label={title}
        />
      </div>
    );
  };

  return (
    <div className="min-w-[140px] max-w-[220px]">
      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/80"
        role="presentation"
      >
        {seg('ex', wEx, '우수', COLOR_EXCELLENT, row.excellent, row.excellentPct)}
        {seg('no', wNo, '정상', COLOR_NORMAL, row.normal, row.normalPct)}
        {seg('ri', wRi, '위험', COLOR_RISK, row.risk, row.riskPct)}
      </div>
      <div className="mt-1 flex w-full text-[10px] leading-tight text-slate-500 dark:text-slate-400">
        <div className="min-w-0 truncate text-center" style={{ flex: `0 0 ${wEx}%` }} title={`우수 ${row.excellentPct.toFixed(2)}%`}>
          {wEx > 0 ? '우수' : ''}
        </div>
        <div className="min-w-0 truncate text-center" style={{ flex: `0 0 ${wNo}%` }} title={`정상 ${row.normalPct.toFixed(2)}%`}>
          {wNo > 0 ? '정상' : ''}
        </div>
        <div className="min-w-0 truncate text-center" style={{ flex: `0 0 ${wRi}%` }} title={`위험 ${row.riskPct.toFixed(2)}%`}>
          {wRi > 0 ? '위험' : ''}
        </div>
      </div>
    </div>
  );
}

export function StudentRiskTable() {
  const riskData: RiskRow[] = CLASSES_DATA.map((c) => {
    const excellent = Math.floor(c.studentCount * (c.pScore > 80 ? 0.4 : 0.2));
    const risk = Math.floor(c.studentCount * (c.pScore < 70 ? 0.3 : 0.1));
    const normal = c.studentCount - excellent - risk;

    const excellentPct = (excellent / c.studentCount) * 100;
    const normalPct = (normal / c.studentCount) * 100;
    const riskPct = (risk / c.studentCount) * 100;

    return {
      ...c,
      excellent,
      normal,
      risk,
      excellentPct,
      normalPct,
      riskPct,
    };
  }).slice(0, 5);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 flex shrink-0 flex-col justify-between gap-4 text-base font-bold text-slate-800 sm:flex-row sm:items-center dark:text-white">
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"/> 학급 리스크 분석 (신호등)
        </div>
        <button className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors shrink-0 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20">
          AI 분석 연동
        </button>
      </h3>
      <div className="min-h-0 flex-1 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700">
            <tr>
              <th className="py-3 px-4">학급명</th>
              <th className="py-3 px-4">학생수</th>
              <th className="py-3 px-4">우수</th>
              <th className="py-3 px-4">정상</th>
              <th className="py-3 px-4">위험</th>
              <th className="py-3 px-4 min-w-[160px]">학생 리스크 (신호등)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {riskData.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{item.name}</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{item.studentCount}명</td>
                <td className="py-3 px-4 font-bold" style={{ color: COLOR_EXCELLENT }}>
                  {item.excellentPct.toFixed(1)}%
                </td>
                <td className="py-3 px-4 font-bold" style={{ color: COLOR_NORMAL }}>
                  {item.normalPct.toFixed(1)}%
                </td>
                <td className="py-3 px-4 font-bold" style={{ color: COLOR_RISK }}>
                  {item.riskPct.toFixed(1)}%
                </td>
                <td className="py-3 px-4 align-middle">
                  <RiskStackedBar row={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
