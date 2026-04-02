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
import { CLASSES_DATA, NATIONAL_AVERAGES } from '../../data/campusMockData';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

export function CampusPerformanceMatrix() {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  // Mock campus data does not include CI/Elite fields yet, so derive them for matrix visualization.
  const toConfidenceCi = (cv: number) => Number(Math.max(0.2, Math.min(0.95, 1 - cv / 100)).toFixed(3));
  const formatPercentile = (rank: number, total: number) => (((total - rank + 1) / total) * 100).toFixed(1);

  const buildRankMap = (
    rows: typeof CLASSES_DATA,
    getValue: (row: (typeof CLASSES_DATA)[number]) => number,
    direction: 'asc' | 'desc' = 'desc',
  ) => {
    const sorted = [...rows].sort((a, b) =>
      direction === 'desc' ? getValue(b) - getValue(a) : getValue(a) - getValue(b),
    );
    const rankMap = new Map<string, number>();
    let prevValue: number | null = null;
    let prevRank = 0;

    sorted.forEach((row, index) => {
      const value = getValue(row);
      const rank = prevValue !== null && value === prevValue ? prevRank : index + 1;
      rankMap.set(row.id, rank);
      prevValue = value;
      prevRank = rank;
    });

    return rankMap;
  };

  const pScoreRankMap = buildRankMap(CLASSES_DATA, (row) => row.pScore);
  const balanceCvRankMap = buildRankMap(CLASSES_DATA, (row) => row.cv, 'asc');
  const zScoreRankMap = buildRankMap(CLASSES_DATA, (row) => row.zScore);
  const eliteCvRankMap = buildRankMap(CLASSES_DATA, (row) => row.cv, 'asc');
  const confidenceCiRankMap = buildRankMap(CLASSES_DATA, (row) => toConfidenceCi(row.cv));
  const getCoreGrade = (pScore: number) => (pScore >= 85 ? 'S' : pScore >= 75 ? 'A' : pScore >= 65 ? 'B' : 'C');
  const getPcRamStatusLabel = (status: string) =>
    status === '상향완성'
      ? '상향 완성형'
      : status === '상향불안'
        ? '상향 불안형'
        : status === '하향평준'
          ? '하향 평준형'
          : '관리 부재형';
  const getEmiDescription = (peqm: string) =>
    peqm === 'G' ? 'Growth - 성장 단계' : peqm === 'L' ? 'Lagging - 관리 필요' : 'Unknown';

  const getLevelComparison = (
    classData: (typeof CLASSES_DATA)[number],
    getValue: (row: (typeof CLASSES_DATA)[number]) => number,
  ) => {
    const sameLevelRows = CLASSES_DATA.filter((row) => row.level === classData.level);
    const sameLevelRankMap = buildRankMap(sameLevelRows, getValue);
    const levelRank = sameLevelRankMap.get(classData.id) ?? 1;
    const levelTotal = sameLevelRows.length || 1;
    const percentile = formatPercentile(levelRank, levelTotal);
    return { levelRank, levelTotal, percentile };
  };

  const buildClassDetailLines = ({
    data,
    xLabel,
    xValueText,
    yLabel,
    yValueText,
    campusRankText,
    levelComparisonText,
  }: {
    data: (typeof CLASSES_DATA)[number];
    xLabel: string;
    xValueText: string;
    yLabel: string;
    yValueText: string;
    campusRankText: string;
    levelComparisonText: string;
  }) => [
    `Class명 : ${data.name}`,
    `레벨 : ${data.level}`,
    `담임 : ${data.teacherKr}`,
    `학생수 : ${data.studentCount}명`,
    `${xLabel} : ${xValueText}`,
    `${yLabel} : ${yValueText}`,
    `캠퍼스 내 순위 : ${campusRankText}`,
    `동일 레벨 전국 비교 : ${levelComparisonText}`,
  ];

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
          setSelectedClass(dataPoint.data);
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#64748b',
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
          color: 'rgba(148, 163, 184, 0.25)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.25)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
    },
  };

  const createTooltipHandler = (tooltipClass: string, formatLabel: (dataPoint: any, datasetLabel: string) => string[]) => {
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
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'none';
        tooltipEl.style.transition = 'all .1s ease';
        tooltipEl.style.border = '1px solid #334155';
        tooltipEl.style.padding = '12px';
        tooltipEl.style.zIndex = '50';
        tooltipEl.style.whiteSpace = 'normal';
        tooltipEl.style.wordBreak = 'keep-all';
        tooltipEl.style.maxWidth = '320px';
        tooltipEl.style.lineHeight = '1.35';
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
          const colorIndicator = `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:${bgColor}; margin-right:6px; flex-shrink:0;"></span>`;
          const match = title.match(/^(.*?)(\s*\([^)]*\))$/);
          if (match) {
            const mainTitle = match[1];
            const levelSuffix = match[2];
            innerHtml += `<div style="font-size: 14px; color: #f1f5f9; display: flex; align-items: center;">${colorIndicator}<span style="font-weight:700;">${mainTitle}</span><span style="font-weight:400; color:#94a3b8; margin-left:4px;">${levelSuffix}</span></div>`;
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

      const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

      tooltipEl.style.opacity = '1';
      // Keep tooltip fully visible inside the chart container.
      const containerRect = chart.canvas.parentNode.getBoundingClientRect();
      const tooltipRect = tooltipEl.getBoundingClientRect();
      const padding = 10;
      const preferredLeft = positionX + tooltip.caretX + 14;
      const preferredTop = positionY + tooltip.caretY - tooltipRect.height - 14;

      const maxLeft = Math.max(padding, containerRect.width - tooltipRect.width - padding);
      const clampedLeft = Math.min(Math.max(preferredLeft, padding), maxLeft);

      const topWithFallback = preferredTop < padding ? positionY + tooltip.caretY + 14 : preferredTop;
      const maxTop = Math.max(padding, containerRect.height - tooltipRect.height - padding);
      const clampedTop = Math.min(Math.max(topWithFallback, padding), maxTop);

      tooltipEl.style.left = `${clampedLeft}px`;
      tooltipEl.style.top = `${clampedTop}px`;
    };
  };

  const pScoreOptions = {
    ...commonOptions,
    scales: {
      x: { ...commonOptions.scales.x, title: { display: true, text: 'P-SCORE', color: '#94a3b8' } },
      y: { ...commonOptions.scales.y, title: { display: true, text: 'Balance CV', color: '#94a3b8' } },
    },
    plugins: {
      ...commonOptions.plugins,
      referenceLine: { x: NATIONAL_AVERAGES.pScore, y: NATIONAL_AVERAGES.cv },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        enabled: false,
        external: createTooltipHandler('chartjs-tooltip-pscore', (dataPoint, datasetLabel) => {
          const classData = dataPoint.data;
          if (!classData) {
            return [`구분 : ${datasetLabel}`, `P-Score : ${dataPoint.x.toFixed(1)}%`, `Blance CV : ${dataPoint.y.toFixed(1)}%`];
          }
          const campusRank = pScoreRankMap.get(classData.id) ?? 1;
          const balanceCvRank = balanceCvRankMap.get(classData.id) ?? 1;
          const { levelRank, levelTotal } = getLevelComparison(classData, (row) => row.pScore);
          return [
            `담임 : ${classData.teacherKr}`,
            `학생수 : ${classData.studentCount}명`,
            `P-Score : ${dataPoint.x.toFixed(1)}%`,
            `Balance CV : ${dataPoint.y.toFixed(2)} (${balanceCvRank}/${CLASSES_DATA.length})`,
            `P-Score 순위`,
            `- 캠퍼스 내 순위 : ${campusRank}/${CLASSES_DATA.length}`,
            `- 동일 레벨 전국 순위 : ${levelRank}/${levelTotal}`,
          ];
        }),
        callbacks: {
          title: (context: any) => {
            const dataPoint = context[0].raw;
            if (dataPoint?.data) {
              return `${dataPoint.name} (${dataPoint.data.level})`;
            }
            return dataPoint.name;
          }
        }
      }
    }
  };

  const pcRamOptions = {
    ...commonOptions,
    scales: {
      x: { ...commonOptions.scales.x, title: { display: true, text: 'Z-Score', color: '#94a3b8' } },
      y: { ...commonOptions.scales.y, title: { display: true, text: '신뢰 CI', color: '#94a3b8' } },
    },
    plugins: {
      ...commonOptions.plugins,
      referenceLine: { x: NATIONAL_AVERAGES.zScore, y: toConfidenceCi(NATIONAL_AVERAGES.cv) },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        enabled: false,
        external: createTooltipHandler('chartjs-tooltip-pcram', (dataPoint, datasetLabel) => {
          const classData = dataPoint.data;
          if (!classData) {
            return [`구분 : ${datasetLabel}`, `Z-Score : ${dataPoint.x.toFixed(2)}`, `신뢰 CI : ${dataPoint.y.toFixed(3)}`];
          }
          const campusRank = zScoreRankMap.get(classData.id) ?? 1;
          const confidenceCiRank = confidenceCiRankMap.get(classData.id) ?? 1;
          const { levelRank, levelTotal } = getLevelComparison(classData, (row) => row.zScore);
          return [
            `담임 : ${classData.teacherKr}`,
            `학생수 : ${classData.studentCount}명`,
            `Z-Score : ${dataPoint.x.toFixed(2)}`,
            `신뢰 CI : ${dataPoint.y.toFixed(3)} (${confidenceCiRank}/${CLASSES_DATA.length})`,
            `등급 : ${getCoreGrade(classData.pScore)} ${getPcRamStatusLabel(classData.pcramStatus)}`,
            `Z-Score 순위`,
            `- 캠퍼스 내 순위 : ${campusRank}/${CLASSES_DATA.length}`,
            `- 동일 레벨 전국 순위 : ${levelRank}/${levelTotal}`,
          ];
        }),
        callbacks: {
          title: (context: any) => {
            const dataPoint = context[0].raw;
            if (dataPoint?.data) {
              return `${dataPoint.name} (${dataPoint.data.level})`;
            }
            return dataPoint.name;
          }
        }
      }
    }
  };

  const peqmOptions = {
    ...commonOptions,
    scales: {
      x: { ...commonOptions.scales.x, title: { display: true, text: 'Elite Z', color: '#94a3b8' } },
      y: { ...commonOptions.scales.y, title: { display: true, text: 'Elite CV', color: '#94a3b8' } },
    },
    plugins: {
      ...commonOptions.plugins,
      referenceLine: { x: NATIONAL_AVERAGES.zScore, y: NATIONAL_AVERAGES.cv },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        enabled: false,
        external: createTooltipHandler('chartjs-tooltip-peqm', (dataPoint, datasetLabel) => {
          const classData = dataPoint.data;
          if (!classData) {
            return [`구분 : ${datasetLabel}`, `Elite Z : ${dataPoint.x.toFixed(2)}`, `Elite CV : ${dataPoint.y.toFixed(1)}%`];
          }
          const campusRank = zScoreRankMap.get(classData.id) ?? 1;
          const eliteCvRank = eliteCvRankMap.get(classData.id) ?? 1;
          const { levelRank, levelTotal } = getLevelComparison(classData, (row) => row.zScore);
          return [
            `담임 : ${classData.teacherKr}`,
            `학생수 : ${classData.studentCount}명`,
            `Elite Z : ${dataPoint.x.toFixed(2)}`,
            `Elite CV : ${dataPoint.y.toFixed(1)}% (${eliteCvRank}/${CLASSES_DATA.length})`,
            `EMI : ${classData.peqm} (${getEmiDescription(classData.peqm)})`,
            `Elite Z 순위`,
            `- 캠퍼스 내 순위 : ${campusRank}/${CLASSES_DATA.length}`,
            `- 동일 레벨 전국 순위 : ${levelRank}/${levelTotal}`,
          ];
        }),
        callbacks: {
          title: (context: any) => {
            const dataPoint = context[0].raw;
            if (dataPoint?.data) {
              return `${dataPoint.name} (${dataPoint.data.level})`;
            }
            return dataPoint.name;
          }
        }
      }
    }
  };

  const referenceLinePlugin = {
    id: 'referenceLine',
    beforeDraw: (chart: any) => {
      const { ctx, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
      const refX = chart.config.options.plugins.referenceLine?.x;
      const refY = chart.config.options.plugins.referenceLine?.y;

      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);

      if (refX !== undefined) {
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.8)';
        const xPos = x.getPixelForValue(refX);
        if (xPos >= left && xPos <= right) {
          ctx.beginPath();
          ctx.moveTo(xPos, top);
          ctx.lineTo(xPos, bottom);
          ctx.stroke();
        }
      }

      if (refY !== undefined) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
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

  const pScoreData = {
    datasets: [
      {
        label: 'ECP',
        data: CLASSES_DATA.filter(c => c.course === 'ECP').map(c => ({ x: c.pScore, y: c.cv, name: c.name, data: c })),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: 'ELE',
        data: CLASSES_DATA.filter(c => c.course === 'ELE').map(c => ({ x: c.pScore, y: c.cv, name: c.name, data: c })),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: 'GRAD',
        data: CLASSES_DATA.filter(c => c.course === 'GRAD').map(c => ({ x: c.pScore, y: c.cv, name: c.name, data: c })),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: '전국 평균',
        data: [{ x: NATIONAL_AVERAGES.pScore, y: NATIONAL_AVERAGES.cv, name: '전국 평균' }],
        backgroundColor: '#ef4444',
        pointRadius: 10,
        pointStyle: 'rectRot',
      }
    ]
  };

  const pcRamData = {
    datasets: [
      {
        label: '상향 완성형',
        data: CLASSES_DATA.filter(c => c.pcramStatus === '상향완성').map(c => ({ x: c.zScore, y: toConfidenceCi(c.cv), name: c.name, data: c })),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: '상향 불안형',
        data: CLASSES_DATA.filter(c => c.pcramStatus === '상향불안').map(c => ({ x: c.zScore, y: toConfidenceCi(c.cv), name: c.name, data: c })),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: '하향 평준형',
        data: CLASSES_DATA.filter(c => c.pcramStatus === '하향평준').map(c => ({ x: c.zScore, y: toConfidenceCi(c.cv), name: c.name, data: c })),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: '관리 부재형',
        data: CLASSES_DATA.filter(c => c.pcramStatus === '관리부재').map(c => ({ x: c.zScore, y: toConfidenceCi(c.cv), name: c.name, data: c })),
        backgroundColor: 'rgba(244, 63, 94, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: '전국 평균',
        data: [{ x: NATIONAL_AVERAGES.zScore, y: toConfidenceCi(NATIONAL_AVERAGES.cv), name: '전국 평균' }],
        backgroundColor: '#ef4444',
        pointRadius: 10,
        pointStyle: 'rectRot',
      }
    ]
  };

  const peqmData = {
    datasets: [
      {
        label: 'EMI G',
        data: CLASSES_DATA.filter(c => c.peqm === 'G').map(c => ({ x: c.zScore, y: c.cv, name: c.name, data: c })),
        backgroundColor: 'rgba(6, 182, 212, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: 'EMI L',
        data: CLASSES_DATA.filter(c => c.peqm === 'L').map(c => ({ x: c.zScore, y: c.cv, name: c.name, data: c })),
        backgroundColor: 'rgba(217, 70, 239, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: '전국 평균',
        data: [{ x: NATIONAL_AVERAGES.zScore, y: NATIONAL_AVERAGES.cv, name: '전국 평균' }],
        backgroundColor: '#ef4444',
        pointRadius: 10,
        pointStyle: 'rectRot',
      }
    ]
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-slate-800 dark:text-white font-semibold">P-SCORE Matrix</h3>
          </div>
          <div className="h-64 relative z-10">
            <Scatter data={pScoreData} options={pScoreOptions} plugins={[referenceLinePlugin]} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-slate-800 dark:text-white font-semibold">PC-RAM Matrix</h3>
          </div>
          <div className="h-64 relative z-10">
            <Scatter data={pcRamData} options={pcRamOptions} plugins={[referenceLinePlugin]} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-slate-800 dark:text-white font-semibold">PEQM Matrix</h3>
          </div>
          <div className="h-64 relative z-10">
            <Scatter data={peqmData} options={peqmOptions} plugins={[referenceLinePlugin]} />
          </div>
        </div>
      </div>

      {selectedClass && (
        <div className="mt-4 bg-white dark:bg-[#0f172a] border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">선택 학급: {selectedClass.name}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] text-slate-500 mb-0.5">P-SCORE</div>
              <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedClass.pScore}%</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 mb-0.5">Z-SCORE</div>
              <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedClass.zScore.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 mb-0.5">CV</div>
              <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedClass.cv}%</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 mb-0.5">학생수</div>
              <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedClass.studentCount}명</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
