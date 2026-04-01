import React, { useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { mockData } from './NationalCampusRanking';
import type { CampusRankingData } from '@/types';
import { useExcelData } from '@/context/ExcelDataContext';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

export function PerformanceMatrix({
  onCampusSelect,
  hideHeading = false,
}: {
  onCampusSelect?: (campusName: string) => void;
  /** 상위(대시보드 접기 섹션 등)에 제목이 있을 때 상단 제목 행만 숨김 */
  hideHeading?: boolean;
}) {
  const { campusRankingData } = useExcelData();
  const sourceRows = campusRankingData ?? mockData;

  const [selectedCampus, setSelectedCampus] = useState<CampusRankingData | null>(null);

  type RankStat = { rank: number; total: number };

  const buildRankStatMap = (
    rows: CampusRankingData[],
    getValue: (row: CampusRankingData) => number,
    direction: 'asc' | 'desc' = 'desc',
  ) => {
    const sorted = [...rows].sort((a, b) =>
      direction === 'desc' ? getValue(b) - getValue(a) : getValue(a) - getValue(b),
    );
    const total = sorted.length;
    const rankMap = new Map<number, RankStat>();
    sorted.forEach((row, index) => {
      rankMap.set(row.id, { rank: index + 1, total });
    });
    return rankMap;
  };

  const pScoreOverallRankMap = buildRankStatMap(sourceRows, (row) => row.pScore, 'desc');
  const pScoreDirectRankMap = buildRankStatMap(
    sourceRows.filter((row) => row.type === '직영'),
    (row) => row.pScore,
    'desc',
  );
  const pScoreBranchRankMap = buildRankStatMap(
    sourceRows.filter((row) => row.type === '분원'),
    (row) => row.pScore,
    'desc',
  );
  const pScoreRegionRankMaps = new Map<string, Map<number, RankStat>>();
  [...new Set(sourceRows.map((row) => row.region))].forEach((region) => {
    pScoreRegionRankMaps.set(
      region,
      buildRankStatMap(
        sourceRows.filter((row) => row.region === region),
        (row) => row.pScore,
        'desc',
      ),
    );
  });

  const zScoreOverallRankMap = buildRankStatMap(sourceRows, (row) => row.zScore, 'desc');
  const zScoreDirectRankMap = buildRankStatMap(
    sourceRows.filter((row) => row.type === '직영'),
    (row) => row.zScore,
    'desc',
  );
  const zScoreBranchRankMap = buildRankStatMap(
    sourceRows.filter((row) => row.type === '분원'),
    (row) => row.zScore,
    'desc',
  );
  const zScoreRegionRankMaps = new Map<string, Map<number, RankStat>>();
  [...new Set(sourceRows.map((row) => row.region))].forEach((region) => {
    zScoreRegionRankMaps.set(
      region,
      buildRankStatMap(
        sourceRows.filter((row) => row.region === region),
        (row) => row.zScore,
        'desc',
      ),
    );
  });

  const eliteZOverallRankMap = buildRankStatMap(sourceRows, (row) => row.eliteZ, 'desc');
  const eliteZDirectRankMap = buildRankStatMap(
    sourceRows.filter((row) => row.type === '직영'),
    (row) => row.eliteZ,
    'desc',
  );
  const eliteZBranchRankMap = buildRankStatMap(
    sourceRows.filter((row) => row.type === '분원'),
    (row) => row.eliteZ,
    'desc',
  );
  const eliteZRegionRankMaps = new Map<string, Map<number, RankStat>>();
  [...new Set(sourceRows.map((row) => row.region))].forEach((region) => {
    eliteZRegionRankMaps.set(
      region,
      buildRankStatMap(
        sourceRows.filter((row) => row.region === region),
        (row) => row.eliteZ,
        'desc',
      ),
    );
  });

  const eliteCvOverallRankMap = buildRankStatMap(sourceRows, (row) => row.eliteCv, 'asc');

  const EMI_GRADE_LABEL: Record<string, string> = {
    P: 'Perfect',
    G: 'Growth',
    U: 'Unbalanced',
    L: 'Lack',
  };
  const EMI_GRADE_MEANING_KO: Record<string, string> = {
    P: '완벽모델 / 완전 무결점 모델',
    G: '성장 단계',
    U: '편차 과다',
    L: '구조적 개선 필요',
  };

  const formatEmiTooltipLine = (grade: string) => {
    const g = (grade || '').trim().toUpperCase();
    const label = EMI_GRADE_LABEL[g];
    const meaning = EMI_GRADE_MEANING_KO[g];
    if (label && meaning) {
      return `EMI : ${g} (${label} - ${meaning})`;
    }
    return `EMI : ${grade || '-'}`;
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event: any, elements: any[], chart: any) => {
      if (elements.length > 0) {
        const element = elements[0];
        const datasetIndex = element.datasetIndex;
        const index = element.index;
        const dataPoint = chart.data.datasets[datasetIndex].data[index];
        
        if (dataPoint && dataPoint.data) {
          setSelectedCampus(dataPoint.data);
          if (onCampusSelect) {
            onCampusSelect(dataPoint.data.campus);
          }
          // Scroll to the ranking table
          const element = document.getElementById('national-campus-ranking');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#64748b', // slate-500
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.25)', // slate-400 with opacity
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.25)', // slate-400 with opacity
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
    },
  };

  // Panel 1 Data: P-SCORE
  const pScoreData = {
    datasets: [
      {
        label: '직영',
        data: sourceRows.filter(d => d.type === '직영').map(d => ({ x: d.pScore, y: d.balanceCv, campus: d.campus, data: d })),
        backgroundColor: 'rgba(99, 102, 241, 0.8)', // indigo-500
        borderColor: 'rgba(99, 102, 241, 1)',
        pointRadius: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 8 : 4,
        pointBorderWidth: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 2 : 1,
        pointBorderColor: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? '#fff' : 'rgba(99, 102, 241, 1)',
      },
      {
        label: '분원',
        data: sourceRows.filter(d => d.type === '분원').map(d => ({ x: d.pScore, y: d.balanceCv, campus: d.campus, data: d })),
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald-500
        borderColor: 'rgba(16, 185, 129, 1)',
        pointRadius: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 8 : 4,
        pointBorderWidth: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 2 : 1,
        pointBorderColor: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? '#fff' : 'rgba(16, 185, 129, 1)',
      },
    ],
  };

  const createTooltipHandler = (
    tooltipClass: string,
    formatLabel: (dataPoint: any, datasetLabel: string) => string[],
    boxOptions?: { wrapText?: boolean; maxWidthPx?: number },
  ) => {
    return (context: any) => {
      const {chart, tooltip} = context;
      let tooltipEl = chart.canvas.parentNode.querySelector(`div.${tooltipClass}`);

      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.classList.add(tooltipClass);
        tooltipEl.style.background = '#1e293b';
        tooltipEl.style.borderRadius = '8px';
        tooltipEl.style.color = 'white';
        tooltipEl.style.opacity = '1';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'fixed';
        tooltipEl.style.transform = 'none';
        tooltipEl.style.transition = 'all .1s ease';
        tooltipEl.style.border = '1px solid #334155';
        tooltipEl.style.padding = '12px';
        tooltipEl.style.zIndex = '9999';
        tooltipEl.style.whiteSpace = boxOptions?.wrapText ? 'normal' : 'nowrap';
        tooltipEl.style.maxWidth = boxOptions?.wrapText
          ? `min(${boxOptions.maxWidthPx ?? 420}px, calc(100vw - 24px))`
          : '';
        tooltipEl.style.lineHeight = '1.45';
        tooltipEl.style.boxSizing = 'border-box';
        tooltipEl.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        
        chart.canvas.parentNode.appendChild(tooltipEl);
      }

      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = '0';
        return;
      }

      if (tooltip.body) {
        const titleLines = tooltip.title || [];
        const colors = tooltip.labelColors[0];
        const bgColor = colors ? colors.backgroundColor : '#fff';
        const dataPoint = tooltip.dataPoints[0].raw;
        const datasetLabel = tooltip.dataPoints[0].dataset.label;

        let innerHtml = '<div style="margin-bottom: 6px; display: flex; align-items: center;">';

        titleLines.forEach((title: string) => {
          const match = title.match(/^(.*?)\s*(\(.*?\))$/);
          const colorIndicator = `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:${bgColor}; margin-right:6px; flex-shrink:0;"></span>`;
          if (match) {
            innerHtml += `<div style="font-size: 14px; font-weight: bold; color: #f1f5f9; display: flex; align-items: center;">${colorIndicator}${match[1]} <span style="font-size: 11px; font-weight: normal; color: #94a3b8; margin-left: 4px;">${match[2]}</span></div>`;
          } else {
            innerHtml += `<div style="font-size: 14px; font-weight: bold; color: #f1f5f9; display: flex; align-items: center;">${colorIndicator}${title}</div>`;
          }
        });
        innerHtml += '</div><div style="display: flex; flex-direction: column; gap: 4px;">';

        const lines = formatLabel(dataPoint, datasetLabel);
        lines.forEach((line: string) => {
          innerHtml += `<div style="font-size: 13px; color: #cbd5e1;">${line}</div>`;
        });
        innerHtml += '</div>';

        tooltipEl.innerHTML = innerHtml;
      }

      if (boxOptions?.wrapText) {
        tooltipEl.style.whiteSpace = 'normal';
        tooltipEl.style.maxWidth = `min(${boxOptions.maxWidthPx ?? 420}px, calc(100vw - 24px))`;
      }

      const canvasRect = chart.canvas.getBoundingClientRect();
      const tooltipWidth = tooltipEl.offsetWidth;
      const tooltipHeight = tooltipEl.offsetHeight;
      const padding = 8;
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 768;

      let left = canvasRect.left + tooltip.caretX - tooltipWidth / 2;
      left = Math.max(padding, Math.min(left, vw - tooltipWidth - padding));

      let top = canvasRect.top + tooltip.caretY + 12;
      if (top + tooltipHeight > vh - padding) {
        top = canvasRect.top + tooltip.caretY - tooltipHeight - 12;
      }
      top = Math.max(padding, Math.min(top, vh - tooltipHeight - padding));

      tooltipEl.style.opacity = '1';
      tooltipEl.style.position = 'fixed';
      tooltipEl.style.left = `${left}px`;
      tooltipEl.style.top = `${top}px`;
    };
  };

  const formatRankWithTotal = (rankStat?: RankStat) =>
    rankStat ? `${rankStat.rank}/${rankStat.total}` : '-';

  const balanceCvOverallRankMap = buildRankStatMap(sourceRows, (row) => row.balanceCv, 'asc');
  const confidenceCiOverallRankMap = buildRankStatMap(sourceRows, (row) => row.confidenceCi, 'asc');

  const pScoreOptions = {
    ...commonOptions,
    scales: {
      x: { ...commonOptions.scales.x, title: { display: true, text: 'P-SCORE', color: '#94a3b8' } },
      y: { ...commonOptions.scales.y, title: { display: true, text: 'Balance CV', color: '#94a3b8' } },
    },
    plugins: {
      ...commonOptions.plugins,
      referenceLine: { x: 80, y: 6.0 },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        enabled: false,
        external: createTooltipHandler('chartjs-tooltip-pscore', (dataPoint) => {
          const campus = dataPoint.data as CampusRankingData;
          const balanceCvOverallRank = balanceCvOverallRankMap.get(campus.id);
          const pScoreOverallRank = pScoreOverallRankMap.get(campus.id);
          const pScoreTypeRank =
            campus.type === '직영'
              ? pScoreDirectRankMap.get(campus.id)
              : pScoreBranchRankMap.get(campus.id);
          const pScoreRegionRank = pScoreRegionRankMaps.get(campus.region)?.get(campus.id);
          return [
            `P-SCORE : ${dataPoint.x.toFixed(1)}%`,
            `Balance CV : ${dataPoint.y.toFixed(2)} (${formatRankWithTotal(balanceCvOverallRank)})`,
            `학생수 : ${campus.students}명`,
            'P-SCORE 순위',
            `- 전체 : ${formatRankWithTotal(pScoreOverallRank)}`,
            `- ${campus.type} : ${formatRankWithTotal(pScoreTypeRank)}`,
            `- ${campus.region} : ${formatRankWithTotal(pScoreRegionRank)}`,
          ];
        }),
        callbacks: {
          title: (context: any) => {
            const dataPoint = context[0].raw;
            if (dataPoint.campus) {
              const shortName = dataPoint.campus.replace('폴리어학원(', '').replace(')', '');
              return `${shortName} (${dataPoint.data.type}ㆍ${dataPoint.data.region})`;
            }
            return context[0].dataset.label;
          }
        }
      }
    }
  };

  // Panel 2 Data: PC-RAM
  const pcRamData = {
    datasets: [
      {
        label: '상향 완성형',
        data: sourceRows.filter(d => d.zScore >= 0 && d.confidenceCi <= 0.60).map(d => ({ x: d.zScore, y: d.confidenceCi, campus: d.campus, data: d })),
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
        pointRadius: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 8 : 4,
        pointBorderWidth: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 2 : 1,
        pointBorderColor: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? '#fff' : 'rgba(59, 130, 246, 1)',
      },
      {
        label: '상향 불안형',
        data: sourceRows.filter(d => d.zScore >= 0 && d.confidenceCi > 0.60).map(d => ({ x: d.zScore, y: d.confidenceCi, campus: d.campus, data: d })),
        backgroundColor: 'rgba(245, 158, 11, 0.8)', // amber-500
        pointRadius: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 8 : 4,
        pointBorderWidth: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 2 : 1,
        pointBorderColor: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? '#fff' : 'rgba(245, 158, 11, 1)',
      },
      {
        label: '하향 평준형',
        data: sourceRows.filter(d => d.zScore < 0 && d.confidenceCi <= 0.60).map(d => ({ x: d.zScore, y: d.confidenceCi, campus: d.campus, data: d })),
        backgroundColor: 'rgba(139, 92, 246, 0.8)', // violet-500
        pointRadius: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 8 : 4,
        pointBorderWidth: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 2 : 1,
        pointBorderColor: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? '#fff' : 'rgba(139, 92, 246, 1)',
      },
      {
        label: '관리 부재형',
        data: sourceRows.filter(d => d.zScore < 0 && d.confidenceCi > 0.60).map(d => ({ x: d.zScore, y: d.confidenceCi, campus: d.campus, data: d })),
        backgroundColor: 'rgba(244, 63, 94, 0.8)', // rose-500
        pointRadius: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 8 : 4,
        pointBorderWidth: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 2 : 1,
        pointBorderColor: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? '#fff' : 'rgba(244, 63, 94, 1)',
      },
    ],
  };

  const pcRamOptions = {
    ...commonOptions,
    scales: {
      x: { ...commonOptions.scales.x, title: { display: true, text: 'Z-Score', color: '#94a3b8' } },
      y: { ...commonOptions.scales.y, title: { display: true, text: '신뢰 CI', color: '#94a3b8' } },
    },
    plugins: {
      ...commonOptions.plugins,
      referenceLine: { x: 0, y: 0.60 },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        enabled: false,
        external: createTooltipHandler('chartjs-tooltip-pcram', (dataPoint, datasetLabel) => {
          const campus = dataPoint.data as CampusRankingData;
          const confidenceCiOverallRank = confidenceCiOverallRankMap.get(campus.id);
          const zOverall = zScoreOverallRankMap.get(campus.id);
          const zType =
            campus.type === '직영'
              ? zScoreDirectRankMap.get(campus.id)
              : zScoreBranchRankMap.get(campus.id);
          const zRegion = zScoreRegionRankMaps.get(campus.region)?.get(campus.id);
          return [
            `Z-SCORE : ${dataPoint.x.toFixed(2)}`,
            `신뢰 CI : ${dataPoint.y.toFixed(3)} (${formatRankWithTotal(confidenceCiOverallRank)})`,
            `등급 : ${campus.coreGrade} ${datasetLabel}`,
            'Z-SCORE 순위',
            `- 전체 : ${formatRankWithTotal(zOverall)}`,
            `- ${campus.type} : ${formatRankWithTotal(zType)}`,
            `- ${campus.region} : ${formatRankWithTotal(zRegion)}`,
          ];
        }),
        callbacks: {
          title: (context: any) => {
            const dataPoint = context[0].raw;
            if (dataPoint.campus) {
              const shortName = dataPoint.campus.replace('폴리어학원(', '').replace(')', '');
              return `${shortName} (${dataPoint.data.type}ㆍ${dataPoint.data.region})`;
            }
            return context[0].dataset.label;
          }
        }
      }
    }
  };

  // Panel 3 Data: PEQM
  const peqmData = {
    datasets: [
      {
        label: 'EMI G',
        data: sourceRows.filter(d => d.emiGrade === 'G').map(d => ({ x: d.eliteZ, y: d.eliteCv, campus: d.campus, data: d })),
        backgroundColor: 'rgba(6, 182, 212, 0.8)', // cyan-500
        pointRadius: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 8 : 4,
        pointBorderWidth: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 2 : 1,
        pointBorderColor: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? '#fff' : 'rgba(6, 182, 212, 1)',
      },
      {
        label: 'EMI L',
        data: sourceRows.filter(d => d.emiGrade === 'L').map(d => ({ x: d.eliteZ, y: d.eliteCv, campus: d.campus, data: d })),
        backgroundColor: 'rgba(217, 70, 239, 0.8)', // fuchsia-500
        pointRadius: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 8 : 4,
        pointBorderWidth: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 2 : 1,
        pointBorderColor: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? '#fff' : 'rgba(217, 70, 239, 1)',
      },
    ],
  };

  const peqmOptions = {
    ...commonOptions,
    scales: {
      x: { ...commonOptions.scales.x, title: { display: true, text: 'Elite Z', color: '#94a3b8' } },
      y: { ...commonOptions.scales.y, title: { display: true, text: 'Elite CV', color: '#94a3b8' } },
    },
    plugins: {
      ...commonOptions.plugins,
      referenceLine: { x: 0, y: 5.5 },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        enabled: false,
        external: createTooltipHandler(
          'chartjs-tooltip-peqm',
          (dataPoint) => {
            const campus = dataPoint.data as CampusRankingData;
            const eliteCvOverall = eliteCvOverallRankMap.get(campus.id);
            const eliteZOverall = eliteZOverallRankMap.get(campus.id);
            const eliteZType =
              campus.type === '직영'
                ? eliteZDirectRankMap.get(campus.id)
                : eliteZBranchRankMap.get(campus.id);
            const eliteZRegion = eliteZRegionRankMaps.get(campus.region)?.get(campus.id);
            return [
              `Elite Z : ${dataPoint.x.toFixed(2)}`,
              `Elite CV : ${dataPoint.y.toFixed(1)}% (${formatRankWithTotal(eliteCvOverall)})`,
              formatEmiTooltipLine(campus.emiGrade),
              'Elite Z 순위',
              `- 전체 : ${formatRankWithTotal(eliteZOverall)}`,
              `- ${campus.type} : ${formatRankWithTotal(eliteZType)}`,
              `- ${campus.region} : ${formatRankWithTotal(eliteZRegion)}`,
            ];
          },
          { wrapText: true, maxWidthPx: 440 },
        ),
        callbacks: {
          title: (context: any) => {
            const dataPoint = context[0].raw;
            if (dataPoint.campus) {
              const shortName = dataPoint.campus.replace('폴리어학원(', '').replace(')', '');
              return `${shortName} (${dataPoint.data.type}ㆍ${dataPoint.data.region})`;
            }
            return context[0].dataset.label;
          }
        }
      }
    }
  };

  // Custom plugin to draw reference lines
  const referenceLinePlugin = {
    id: 'referenceLine',
    beforeDraw: (chart: any) => {
      const { ctx, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
      const refX = chart.config.options.plugins.referenceLine?.x;
      const refY = chart.config.options.plugins.referenceLine?.y;

      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);

      // Draw vertical line at refX
      if (refX !== undefined) {
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.8)'; // orange-500
        const xPos = x.getPixelForValue(refX);
        if (xPos >= left && xPos <= right) {
          ctx.beginPath();
          ctx.moveTo(xPos, top);
          ctx.lineTo(xPos, bottom);
          ctx.stroke();
        }
      }

      // Draw horizontal line at refY
      if (refY !== undefined) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)'; // sky-400
        const yPos = y.getPixelForValue(refY);
        if (yPos >= top && yPos <= bottom) {
          ctx.beginPath();
          ctx.moveTo(left, yPos);
          ctx.lineTo(right, yPos);
          ctx.stroke();
        }
      }

      ctx.restore();
    }
  };

  const getDiagnosticType = (zScore: number, confidenceCi: number) => {
    if (zScore >= 0) {
      return confidenceCi <= 0.60 ? '상향 완성형' : '상향 불안형';
    } else {
      return confidenceCi <= 0.60 ? '하향 평준형' : '관리 부재형';
    }
  };

  const selectedPScoreOverallRank = selectedCampus ? pScoreOverallRankMap.get(selectedCampus.id) : undefined;
  const selectedBalanceCvOverallRank = selectedCampus ? balanceCvOverallRankMap.get(selectedCampus.id) : undefined;
  const selectedPScoreTypeRank = selectedCampus
    ? (selectedCampus.type === '직영'
      ? pScoreDirectRankMap.get(selectedCampus.id)
      : pScoreBranchRankMap.get(selectedCampus.id))
    : undefined;
  const selectedPScoreRegionRank = selectedCampus
    ? pScoreRegionRankMaps.get(selectedCampus.region)?.get(selectedCampus.id)
    : undefined;
  const selectedZScoreOverallRank = selectedCampus ? zScoreOverallRankMap.get(selectedCampus.id) : undefined;
  const selectedConfidenceCiOverallRank = selectedCampus ? confidenceCiOverallRankMap.get(selectedCampus.id) : undefined;
  const selectedEliteZOverallRank = selectedCampus ? eliteZOverallRankMap.get(selectedCampus.id) : undefined;
  const selectedEliteCvOverallRank = selectedCampus ? eliteCvOverallRankMap.get(selectedCampus.id) : undefined;

  return (
    <div className={hideHeading ? '' : 'mb-6'}>
      {!hideHeading ? (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Performance Matrix</h2>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: P-SCORE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-slate-800 dark:text-white font-semibold">P-SCORE</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded-md font-medium border border-slate-200 dark:border-slate-700">X · P-SCORE</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded-md font-medium border border-slate-200 dark:border-slate-700">Y · Balance CV</span>
            </div>
          </div>
          <div className="h-64 relative z-10">
            <Scatter data={pScoreData} options={pScoreOptions} plugins={[referenceLinePlugin]} />
          </div>
        </div>

        {/* Panel 2: PC-RAM */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-slate-800 dark:text-white font-semibold">PC-RAM</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded-md font-medium border border-slate-200 dark:border-slate-700">X · Z-Score</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded-md font-medium border border-slate-200 dark:border-slate-700">Y · 신뢰 CI</span>
            </div>
          </div>
          <div className="h-64 relative z-10">
            <Scatter data={pcRamData} options={pcRamOptions} plugins={[referenceLinePlugin]} />
          </div>
        </div>

        {/* Panel 3: PEQM */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] hover:border-fuchsia-300 dark:hover:border-fuchsia-500/50 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-slate-800 dark:text-white font-semibold">PEQM</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded-md font-medium border border-slate-200 dark:border-slate-700">X · Elite Z</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded-md font-medium border border-slate-200 dark:border-slate-700">Y · Elite CV</span>
            </div>
          </div>
          <div className="h-64 relative z-10">
            <Scatter data={peqmData} options={peqmOptions} plugins={[referenceLinePlugin]} />
          </div>
        </div>
      </div>

      {/* Selected Campus Panel */}
      {selectedCampus && (
        <div className="mt-4 bg-white dark:bg-[#0f172a] border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 shadow-lg dark:shadow-[0_0_20px_rgba(99,102,241,0.1)] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">선택 캠퍼스</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Left Area: Basic Info */}
            <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
              <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center flex-wrap gap-x-2 gap-y-1">
                <span>{selectedCampus.campus.replace('폴리어학원(', '').replace(')', '')}</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  ({selectedCampus.type} · {selectedCampus.region})
                </span>
              </h4>
              <div className="space-y-2">
                <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-5">
                  <span className="font-medium">P-SCORE 순위 :</span>{' '}
                  <span className="mr-4">전체 <span className="font-bold">{formatRankWithTotal(selectedPScoreOverallRank)}</span> {selectedPScoreOverallRank?.rank === 1 ? '🥇' : ''}</span>
                  <span className="mr-4">{selectedCampus.type} 내 <span className="font-bold">{formatRankWithTotal(selectedPScoreTypeRank)}</span></span>
                  <span>{selectedCampus.region} <span className="font-bold">{formatRankWithTotal(selectedPScoreRegionRank)}</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">TPI 등급 / 순위</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">
                    {selectedCampus.coreGrade}
                    <span className="ml-1 text-xs font-medium text-indigo-500 dark:text-indigo-300">
                      ({formatRankWithTotal(selectedZScoreOverallRank)})
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">EMI 등급 / 순위</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                    {selectedCampus.emiGrade}
                    <span className="ml-1 text-xs font-medium text-emerald-500 dark:text-emerald-300">
                      ({formatRankWithTotal(selectedEliteZOverallRank)})
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Area: Performance Metrics */}
            <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700 flex items-center">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 w-full">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">P-SCORE</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {selectedCampus.pScore.toFixed(1)}%
                    <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      (<span className="font-bold text-slate-600 dark:text-slate-300">{formatRankWithTotal(selectedPScoreOverallRank)}</span>)
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Balance CV</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {selectedCampus.balanceCv.toFixed(1)}
                    <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      (<span className="font-bold text-slate-600 dark:text-slate-300">{formatRankWithTotal(selectedBalanceCvOverallRank)}</span>)
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Z-Score / CI</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedCampus.zScore.toFixed(2)} / {selectedCampus.confidenceCi.toFixed(3)}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Z: <span className="font-bold text-slate-600 dark:text-slate-300">{formatRankWithTotal(selectedZScoreOverallRank)}</span> · CI: <span className="font-bold text-slate-600 dark:text-slate-300">{formatRankWithTotal(selectedConfidenceCiOverallRank)}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">진단 유형</div>
                  <div className="text-base font-bold text-slate-800 dark:text-white">
                    {getDiagnosticType(selectedCampus.zScore, selectedCampus.confidenceCi)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Elite Z / CV</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedCampus.eliteZ.toFixed(2)} / {selectedCampus.eliteCv.toFixed(1)}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Elite Z: <span className="font-bold text-slate-600 dark:text-slate-300">{formatRankWithTotal(selectedEliteZOverallRank)}</span> · Elite CV: <span className="font-bold text-slate-600 dark:text-slate-300">{formatRankWithTotal(selectedEliteCvOverallRank)}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">학생수 / 학급수</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedCampus.students}명 / {selectedCampus.classes}학급</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
