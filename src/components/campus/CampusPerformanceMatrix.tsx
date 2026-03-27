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
        tooltipEl.style.transform = 'translate(-50%, 10px)';
        tooltipEl.style.transition = 'all .1s ease';
        tooltipEl.style.border = '1px solid #334155';
        tooltipEl.style.padding = '12px';
        tooltipEl.style.zIndex = '50';
        tooltipEl.style.whiteSpace = 'nowrap';
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
          innerHtml += `<div style="font-size: 14px; font-weight: bold; color: #f1f5f9; display: flex; align-items: center;">${colorIndicator}${title}</div>`;
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
      tooltipEl.style.left = positionX + tooltip.caretX + 'px';
      tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    };
  };

  const pScoreOptions = {
    ...commonOptions,
    scales: {
      x: { ...commonOptions.scales.x, title: { display: true, text: 'P-SCORE', color: '#94a3b8' } },
      y: { ...commonOptions.scales.y, title: { display: true, text: 'AR (성취도)', color: '#94a3b8' } },
    },
    plugins: {
      ...commonOptions.plugins,
      referenceLine: { x: NATIONAL_AVERAGES.pScore, y: NATIONAL_AVERAGES.ar },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        enabled: false,
        external: createTooltipHandler('chartjs-tooltip-pscore', (dataPoint) => [
          `P-SCORE : ${dataPoint.x.toFixed(1)}%`,
          `AR : ${dataPoint.y.toFixed(1)}%`,
          `학생수 : ${dataPoint.data.studentCount}명`
        ]),
        callbacks: {
          title: (context: any) => {
            const dataPoint = context[0].raw;
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
      y: { ...commonOptions.scales.y, title: { display: true, text: 'CV (변동계수)', color: '#94a3b8' } },
    },
    plugins: {
      ...commonOptions.plugins,
      referenceLine: { x: NATIONAL_AVERAGES.zScore, y: NATIONAL_AVERAGES.cv },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        enabled: false,
        external: createTooltipHandler('chartjs-tooltip-pcram', (dataPoint) => [
          `Z-SCORE : ${dataPoint.x.toFixed(2)}`,
          `CV : ${dataPoint.y.toFixed(1)}%`,
          `상태 : ${dataPoint.data.pcramStatus}`
        ]),
        callbacks: {
          title: (context: any) => {
            const dataPoint = context[0].raw;
            return dataPoint.name;
          }
        }
      }
    }
  };

  const peqmOptions = {
    ...commonOptions,
    scales: {
      x: { ...commonOptions.scales.x, title: { display: true, text: 'P-SCORE', color: '#94a3b8' } },
      y: { ...commonOptions.scales.y, title: { display: true, text: 'PEQM Score', color: '#94a3b8' } },
    },
    plugins: {
      ...commonOptions.plugins,
      referenceLine: { x: NATIONAL_AVERAGES.pScore, y: NATIONAL_AVERAGES.peqm },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        enabled: false,
        external: createTooltipHandler('chartjs-tooltip-peqm', (dataPoint) => [
          `P-SCORE : ${dataPoint.x.toFixed(1)}%`,
          `PEQM : ${dataPoint.y.toFixed(1)}`,
          `EMI : ${dataPoint.data.peqm}`
        ]),
        callbacks: {
          title: (context: any) => {
            const dataPoint = context[0].raw;
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
        data: CLASSES_DATA.filter(c => c.course === 'ECP').map(c => ({ x: c.pScore, y: c.ar, name: c.name, data: c })),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: 'ELE',
        data: CLASSES_DATA.filter(c => c.course === 'ELE').map(c => ({ x: c.pScore, y: c.ar, name: c.name, data: c })),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: 'GRAD',
        data: CLASSES_DATA.filter(c => c.course === 'GRAD').map(c => ({ x: c.pScore, y: c.ar, name: c.name, data: c })),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: '전국 평균',
        data: [{ x: NATIONAL_AVERAGES.pScore, y: NATIONAL_AVERAGES.ar, name: '전국 평균' }],
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
        data: CLASSES_DATA.filter(c => c.pcramStatus === '상향완성').map(c => ({ x: c.zScore, y: c.cv, name: c.name, data: c })),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: '상향 불안형',
        data: CLASSES_DATA.filter(c => c.pcramStatus === '상향불안').map(c => ({ x: c.zScore, y: c.cv, name: c.name, data: c })),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: '하향 평준형',
        data: CLASSES_DATA.filter(c => c.pcramStatus === '하향평준').map(c => ({ x: c.zScore, y: c.cv, name: c.name, data: c })),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: '관리 부재형',
        data: CLASSES_DATA.filter(c => c.pcramStatus === '관리부재').map(c => ({ x: c.zScore, y: c.cv, name: c.name, data: c })),
        backgroundColor: 'rgba(244, 63, 94, 0.8)',
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

  const peqmData = {
    datasets: [
      {
        label: 'EMI G',
        data: CLASSES_DATA.filter(c => c.peqm === 'G').map(c => ({ x: c.pScore, y: c.peqmScore, name: c.name, data: c })),
        backgroundColor: 'rgba(6, 182, 212, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: 'EMI L',
        data: CLASSES_DATA.filter(c => c.peqm === 'L').map(c => ({ x: c.pScore, y: c.peqmScore, name: c.name, data: c })),
        backgroundColor: 'rgba(217, 70, 239, 0.8)',
        pointRadius: (ctx: any) => ctx.raw?.name === selectedClass?.name ? 8 : 4,
      },
      {
        label: '전국 평균',
        data: [{ x: NATIONAL_AVERAGES.pScore, y: NATIONAL_AVERAGES.peqm, name: '전국 평균' }],
        backgroundColor: '#ef4444',
        pointRadius: 10,
        pointStyle: 'rectRot',
      }
    ]
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Performance Matrix</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">학급별 성과 분석 (전국 평균 대비)</p>
        </div>
      </div>

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
