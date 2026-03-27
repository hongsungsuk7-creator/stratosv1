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
}: {
  onCampusSelect?: (campusName: string) => void;
}) {
  const { campusRankingData } = useExcelData();
  const sourceRows = campusRankingData ?? mockData;

  const [selectedCampus, setSelectedCampus] = useState<CampusRankingData | null>(null);

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
        label: '본원',
        data: sourceRows.filter(d => d.type === '분원').map(d => ({ x: d.pScore, y: d.balanceCv, campus: d.campus, data: d })),
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald-500
        borderColor: 'rgba(16, 185, 129, 1)',
        pointRadius: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 8 : 4,
        pointBorderWidth: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? 2 : 1,
        pointBorderColor: (ctx: any) => ctx.raw?.data?.id === selectedCampus?.id ? '#fff' : 'rgba(16, 185, 129, 1)',
      },
    ],
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
      y: { ...commonOptions.scales.y, title: { display: true, text: 'Balance CV', color: '#94a3b8' } },
    },
    plugins: {
      ...commonOptions.plugins,
      referenceLine: { x: 80, y: 6.0 },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        enabled: false,
        external: createTooltipHandler('chartjs-tooltip-pscore', (dataPoint) => [
          `P-SCORE : ${dataPoint.x.toFixed(1)}%`,
          `Balance CV : ${dataPoint.y.toFixed(2)}`,
          `학생수 : ${dataPoint.data.students}명`
        ]),
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
        external: createTooltipHandler('chartjs-tooltip-pcram', (dataPoint, datasetLabel) => [
          `Z-SCORE : ${dataPoint.x.toFixed(2)}`,
          `신뢰 CI : ${dataPoint.y.toFixed(3)}`,
          `등급 : ${dataPoint.data.coreGrade} ${datasetLabel}`
        ]),
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
        external: createTooltipHandler('chartjs-tooltip-peqm', (dataPoint) => [
          `Elite Z : ${dataPoint.x.toFixed(2)}`,
          `Elite CV : ${dataPoint.y.toFixed(1)}%`,
          `EMI : ${dataPoint.data.emiGrade}`
        ]),
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

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Performance Matrix</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">점 클릭 시 캠퍼스 표 이동 및 상세 정보 확인</p>
        </div>
      </div>

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
        <div className="mt-4 bg-white dark:bg-[#0f172a] border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 shadow-lg dark:shadow-[0_0_20px_rgba(99,102,241,0.1)] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">선택 캠퍼스</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Area: Basic Info */}
            <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
              <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                {selectedCampus.campus.replace('폴리어학원(', '').replace(')', '')}
              </h4>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">운영주체</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{selectedCampus.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">TPI 등급</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">{selectedCampus.coreGrade}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">EMI 등급</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">{selectedCampus.emiGrade}</span>
                </div>
              </div>
            </div>

            {/* Right Area: Performance Metrics */}
            <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex items-center">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-4 w-full">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">P-SCORE</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedCampus.pScore.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Balance CV</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedCampus.balanceCv.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Z-Score / CI</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedCampus.zScore.toFixed(2)} / {selectedCampus.confidenceCi.toFixed(3)}</div>
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
