import React, { useState } from 'react';
import { 
  Search, RotateCcw, Download, 
  Users, Target, Activity, BarChart2, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area
} from 'recharts';
import { UserGroup } from '../types';
import { COURSES, COURSE_LEVEL_MAP } from '../constants';
import { UI_FILTER_CONTROL_IRT_INPUT_CLASS, UI_FILTER_CONTROL_IRT_SELECT_CLASS } from '../constants/uiClasses';

interface IrtModelProps {
  userGroup: UserGroup;
}

export function IrtModel({ userGroup: _userGroup }: IrtModelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Mock Data for Ability Distribution Histogram
  const abilityData = [
    { range: '-3.0', count: 12, percentage: 1.2, avgScore: 15, correctRate: 12 },
    { range: '-2.5', count: 25, percentage: 2.5, avgScore: 22, correctRate: 18 },
    { range: '-2.0', count: 45, percentage: 4.5, avgScore: 35, correctRate: 28 },
    { range: '-1.5', count: 85, percentage: 8.5, avgScore: 48, correctRate: 38 },
    { range: '-1.0', count: 150, percentage: 15.0, avgScore: 62, correctRate: 50 },
    { range: '-0.5', count: 210, percentage: 21.0, avgScore: 75, correctRate: 60 },
    { range: '0.0', count: 250, percentage: 25.0, avgScore: 82, correctRate: 68 },
    { range: '0.5', count: 180, percentage: 18.0, avgScore: 88, correctRate: 75 },
    { range: '1.0', count: 120, percentage: 12.0, avgScore: 92, correctRate: 82 },
    { range: '1.5', count: 75, percentage: 7.5, avgScore: 95, correctRate: 88 },
    { range: '2.0', count: 40, percentage: 4.0, avgScore: 97, correctRate: 92 },
    { range: '2.5', count: 15, percentage: 1.5, avgScore: 99, correctRate: 96 },
    { range: '3.0', count: 5, percentage: 0.5, avgScore: 100, correctRate: 99 },
  ];

  // Mock Data for ICC Curve
  const iccData = Array.from({ length: 61 }, (_, i) => {
    const theta = -3 + i * 0.1;
    const a = 1.5; // discrimination
    const b = 0.5; // difficulty
    const c = 0.2; // guessing
    const p = c + (1 - c) / (1 + Math.exp(-1.7 * a * (theta - b)));
    return { theta: theta.toFixed(1), probability: p };
  });

  // Mock Data for Item Information
  const itemInfoData = Array.from({ length: 61 }, (_, i) => {
    const theta = -3 + i * 0.1;
    const a = 1.5;
    const b = 0.5;
    const c = 0.2;
    const p = c + (1 - c) / (1 + Math.exp(-1.7 * a * (theta - b)));
    const q = 1 - p;
    const info = (2.89 * a * a * q * Math.pow(p - c, 2)) / (p * Math.pow(1 - c, 2));
    return { theta: theta.toFixed(1), information: info };
  });

  // Mock Data for Test Information
  const testInfoData = Array.from({ length: 61 }, (_, i) => {
    const theta = -3 + i * 0.1;
    // Simulating a bell curve for test information
    const info = 15 * Math.exp(-Math.pow(theta, 2) / 2);
    const se = 1 / Math.sqrt(info || 0.01);
    return { theta: theta.toFixed(1), information: info, standardError: se };
  });

  // Mock Data for Item Table
  const itemTableData = [
    { id: 'Q01', a: 1.25, b: -1.50, c: 0.15, d: 1.00, pValue: 0.85, info: 0.45, status: 'Good' },
    { id: 'Q02', a: 0.85, b: -0.50, c: 0.20, d: 1.00, pValue: 0.65, info: 0.32, status: 'Review' },
    { id: 'Q03', a: 1.75, b: 0.20, c: 0.18, d: 1.00, pValue: 0.45, info: 0.85, status: 'Excellent' },
    { id: 'Q04', a: 2.10, b: 1.50, c: 0.22, d: 0.98, pValue: 0.25, info: 1.15, status: 'Excellent' },
    { id: 'Q05', a: 0.45, b: 0.80, c: 0.25, d: 1.00, pValue: 0.35, info: 0.15, status: 'Poor' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">IRT Model 분석</h1>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* SEARCH FILTER AREA */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className={`flex items-center ${isExpanded ? 'mb-4 pb-3 border-b border-slate-100 dark:border-slate-700' : ''}`}>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm font-semibold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none w-full text-left"
          >
            <Search className="w-5 h-5 text-indigo-500 mr-2" />
            검색 조건
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 ml-2 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 ml-2 text-slate-400" />
            )}
          </button>
        </div>
        
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 연도</label>
              <div className="relative">
                <select className={UI_FILTER_CONTROL_IRT_SELECT_CLASS}>
                  <option>2026</option>
                  <option>2025</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 월(MT 회차)</label>
              <div className="relative">
                <select className={UI_FILTER_CONTROL_IRT_SELECT_CLASS}>
                  <option>March (03)</option>
                  <option>February (02)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">과정</label>
              <div className="relative">
                <select 
                  value={selectedCourse} 
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className={UI_FILTER_CONTROL_IRT_SELECT_CLASS}
                >
                  <option value="">전체</option>
                  {COURSES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">레벨</label>
              <div className="relative">
                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className={UI_FILTER_CONTROL_IRT_SELECT_CLASS}
                >
                  <option value="">전체</option>
                  {selectedCourse && COURSE_LEVEL_MAP[selectedCourse] ? (
                    COURSE_LEVEL_MAP[selectedCourse].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))
                  ) : (
                    <option value="" disabled>과정을 먼저 선택하세요</option>
                  )}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 코드(Test ID)</label>
              <input type="text" placeholder="e.g. MT-2603-M1" className={UI_FILTER_CONTROL_IRT_INPUT_CLASS} />
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 버전</label>
              <div className="relative">
                <select className={UI_FILTER_CONTROL_IRT_SELECT_CLASS}>
                  <option>Form A</option>
                  <option>Form B</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">문항 번호</label>
              <div className="relative">
                <select className={UI_FILTER_CONTROL_IRT_SELECT_CLASS}>
                  <option>All Items</option>
                  <option>Q01</option>
                  <option>Q02</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">능력 구간 (θ)</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="-3.0" className={UI_FILTER_CONTROL_IRT_INPUT_CLASS} />
                <span className="text-slate-400">~</span>
                <input type="number" placeholder="3.0" className={UI_FILTER_CONTROL_IRT_INPUT_CLASS} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">문항 난이도 b</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="-3.0" className={UI_FILTER_CONTROL_IRT_INPUT_CLASS} />
                <span className="text-slate-400">~</span>
                <input type="number" placeholder="3.0" className={UI_FILTER_CONTROL_IRT_INPUT_CLASS} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">문항 변별도 a</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="0.0" className={UI_FILTER_CONTROL_IRT_INPUT_CLASS} />
                <span className="text-slate-400">~</span>
                <input type="number" placeholder="3.0" className={UI_FILTER_CONTROL_IRT_INPUT_CLASS} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">추측도 c</label>
              <input type="number" placeholder="e.g. 0.2" className={UI_FILTER_CONTROL_IRT_INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">최소 응시 인원</label>
              <input type="number" placeholder="e.g. 100" className={UI_FILTER_CONTROL_IRT_INPUT_CLASS} />
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">캠퍼스 그룹</label>
              <div className="relative">
                <select className={UI_FILTER_CONTROL_IRT_SELECT_CLASS}>
                  <option>All</option>
                  <option>Direct (직영)</option>
                  <option>Franchise (본원)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-5 flex items-end justify-end gap-2 mt-2">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors">
                <Search className="w-4 h-4 mr-2" />
                분석
              </button>
              <button className="px-6 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium flex items-center transition-colors">
                <RotateCcw className="w-4 h-4 mr-2" />
                초기화
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SUMMARY PANEL */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Total Candidates</span>
          <div className="flex items-end gap-2 mt-auto">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">1,212</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">students</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Average Ability (θ)</span>
          <div className="flex items-end gap-2 mt-auto">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">0.15</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">logits</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Average Difficulty (b)</span>
          <div className="flex items-end gap-2 mt-auto">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">0.22</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">logits</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Test Reliability</span>
          <div className="flex items-end gap-2 mt-auto">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">0.89</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Cronbach's α</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Number of Items</span>
          <div className="flex items-end gap-2 mt-auto">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">45</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">items</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Avg Discrimination (a)</span>
          <div className="flex items-end gap-2 mt-auto">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1.24</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">good</span>
          </div>
        </div>
      </div>

      {/* ANALYSIS SECTIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 1. Ability Estimation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-indigo-500" />
              1. Ability Estimation
            </h3>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="h-64 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={abilityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem', fontSize: '12px' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Student Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto mt-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 uppercase">
                  <tr>
                    <th className="px-4 py-2 font-medium">Ability (θ)</th>
                    <th className="px-4 py-2 font-medium text-right">Count</th>
                    <th className="px-4 py-2 font-medium text-right">%</th>
                    <th className="px-4 py-2 font-medium text-right">Avg Score</th>
                    <th className="px-4 py-2 font-medium text-right">Correct Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {abilityData.slice(3, 8).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">{row.range}</td>
                      <td className="px-4 py-2 text-right text-slate-600 dark:text-slate-400">{row.count}</td>
                      <td className="px-4 py-2 text-right text-slate-600 dark:text-slate-400">{row.percentage}%</td>
                      <td className="px-4 py-2 text-right text-slate-600 dark:text-slate-400">{row.avgScore}</td>
                      <td className="px-4 py-2 text-right text-slate-600 dark:text-slate-400">{row.correctRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. ICC Curve */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-emerald-500" />
              2. ICC Curve (Item Characteristic Curve)
            </h3>
            <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-md px-2 py-1">
              <option>Item Q03</option>
              <option>Item Q04</option>
            </select>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex gap-4 mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Discrimination (a)</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">1.75</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Difficulty (b)</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">0.20</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Guessing (c)</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">0.18</span>
              </div>
            </div>
            <div className="h-72 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={iccData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis 
                    dataKey="theta" 
                    type="number" 
                    domain={[-3, 3]} 
                    tickCount={7}
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    label={{ value: 'Ability (θ)', position: 'bottom', fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 1]} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    label={{ value: 'Probability of Correct Response', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12, style: { textAnchor: 'middle' } }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem', fontSize: '12px' }}
                    labelFormatter={(val) => `Ability (θ): ${val}`}
                    formatter={(val: number) => [val.toFixed(3), 'Probability']}
                  />
                  <ReferenceLine x={0.20} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: 'b = 0.20', fill: '#f59e0b', fontSize: 10 }} />
                  <ReferenceLine y={0.18} stroke="#64748b" strokeDasharray="3 3" label={{ position: 'right', value: 'c = 0.18', fill: '#64748b', fontSize: 10 }} />
                  <Line type="monotone" dataKey="probability" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Item Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-amber-500" />
              3. Item Information
            </h3>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="h-48 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={itemInfoData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorInfo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis 
                    dataKey="theta" 
                    type="number" 
                    domain={[-3, 3]} 
                    tickCount={7}
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    label={{ value: 'Ability (θ)', position: 'bottom', fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    label={{ value: 'Information', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12, style: { textAnchor: 'middle' } }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem', fontSize: '12px' }}
                    labelFormatter={(val) => `Ability (θ): ${val}`}
                    formatter={(val: number) => [val.toFixed(3), 'Information']}
                  />
                  <Area type="monotone" dataKey="information" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorInfo)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto mt-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 uppercase">
                  <tr>
                    <th className="px-3 py-2 font-medium">Item No</th>
                    <th className="px-3 py-2 font-medium text-right">a</th>
                    <th className="px-3 py-2 font-medium text-right">b</th>
                    <th className="px-3 py-2 font-medium text-right">c</th>
                    <th className="px-3 py-2 font-medium text-right">P-value</th>
                    <th className="px-3 py-2 font-medium text-right">Info</th>
                    <th className="px-3 py-2 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {itemTableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">{row.id}</td>
                      <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{row.a.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{row.b.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{row.c.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{row.pValue.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-medium text-indigo-600 dark:text-indigo-400">{row.info.toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                          row.status === 'Good' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                          row.status === 'Review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                          'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. Test Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
              4. Test Information
            </h3>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-slate-600 dark:text-slate-300">Test Information</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <span className="text-xs text-slate-600 dark:text-slate-300">Standard Error (SE)</span>
              </div>
            </div>
            <div className="h-72 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={testInfoData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis 
                    dataKey="theta" 
                    type="number" 
                    domain={[-3, 3]} 
                    tickCount={7}
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    label={{ value: 'Ability (θ)', position: 'bottom', fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    label={{ value: 'Test Information', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12, style: { textAnchor: 'middle' } }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 2]}
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    label={{ value: 'Standard Error', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 12, style: { textAnchor: 'middle' } }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem', fontSize: '12px' }}
                    labelFormatter={(val) => `Ability (θ): ${val}`}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="information" name="Test Information" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="standardError" name="Standard Error" stroke="#fb7185" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
