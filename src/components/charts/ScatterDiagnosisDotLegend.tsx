import React from 'react';

/** PC-RAM 4분면 유형 — 샘플 대시보드와 동일 색상 체계 */
export const SCATTER_DIAGNOSIS_DOT_COLORS = {
  상향완성: '#2563eb',
  상향불안: '#f97316',
  하향평준: '#a855f7',
  관리부재: '#ef4444',
} as const;

export type ScatterDiagnosisKind = keyof typeof SCATTER_DIAGNOSIS_DOT_COLORS;

export const SCATTER_DIAGNOSIS_LEGEND_ITEMS: { kind: ScatterDiagnosisKind; label: string }[] = [
  { kind: '상향완성', label: '상향 완성형' },
  { kind: '상향불안', label: '상향 불안형' },
  { kind: '하향평준', label: '하향 평준형' },
  { kind: '관리부재', label: '관리 부재형' },
];

/** `ClassData.pcramStatus` 코드 */
export function dotFillForPcramStatus(
  status: '상향완성' | '상향불안' | '하향평준' | '관리부재' | string,
): string {
  switch (status) {
    case '상향완성':
      return SCATTER_DIAGNOSIS_DOT_COLORS.상향완성;
    case '상향불안':
      return SCATTER_DIAGNOSIS_DOT_COLORS.상향불안;
    case '하향평준':
      return SCATTER_DIAGNOSIS_DOT_COLORS.하향평준;
    case '관리부재':
      return SCATTER_DIAGNOSIS_DOT_COLORS.관리부재;
    default:
      return SCATTER_DIAGNOSIS_DOT_COLORS.하향평준;
  }
}

/** PC-RAM 표 등 `상향 완성형` 형태 문자열 */
export function diagnosisTypeLabelToKind(raw: string | undefined): ScatterDiagnosisKind {
  if (!raw) return '하향평준';
  const compact = raw.replace(/\s/g, '');
  if (compact.includes('관리부재')) return '관리부재';
  if (compact.includes('상향') && compact.includes('불안')) return '상향불안';
  if (compact.includes('상향') && compact.includes('완성')) return '상향완성';
  if (compact.includes('하향') && (compact.includes('평준') || compact.includes('표준'))) return '하향평준';
  return '하향평준';
}

export function dotFillForDiagnosisLabel(raw: string | undefined): string {
  return SCATTER_DIAGNOSIS_DOT_COLORS[diagnosisTypeLabelToKind(raw)];
}

export function ScatterDiagnosisDotLegend({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex min-h-[2.75rem] flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3 dark:border-slate-700 ${className}`}
    >
      {SCATTER_DIAGNOSIS_LEGEND_ITEMS.map((item) => (
        <div
          key={item.kind}
          className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400"
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: SCATTER_DIAGNOSIS_DOT_COLORS[item.kind] }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
