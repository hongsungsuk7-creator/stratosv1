import React, { useState } from 'react';
import { UI_FILTER_CONTROL_CLASS } from '../constants/uiClasses';
import { Search, RotateCcw, ChevronUp, ChevronDown, AlertTriangle, Activity, Target, ShieldAlert, CheckCircle, BarChart2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { UserGroup } from '../types';
import { COURSES, COURSE_LEVEL_MAP, CAMPUS_LIST } from '../constants';

interface ResearchDashboardProps {
  userGroup: UserGroup;
}

// Mock Data for Charts
const diffData = [
  { range: '0.0-0.2', count: 2 },
  { range: '0.2-0.4', count: 8 },
  { range: '0.4-0.6', count: 15 },
  { range: '0.6-0.8', count: 10 },
  { range: '0.8-1.0', count: 5 },
];

const qualityData = [
  { name: '우수 (Good)', value: 65, color: '#10b981' },
  { name: '검토 (Review)', value: 25, color: '#f59e0b' },
  { name: '불량 (Reject)', value: 10, color: '#ef4444' },
];

const abilityData = [
  { theta: '-3.0', count: 5 }, { theta: '-2.0', count: 15 }, { theta: '-1.0', count: 45 },
  { theta: '0.0', count: 80 }, { theta: '1.0', count: 50 }, { theta: '2.0', count: 20 },
  { theta: '3.0', count: 5 },
];

const tifData = [
  { theta: '-3.0', info: 2 }, { theta: '-2.0', info: 5 }, { theta: '-1.0', info: 12 },
  { theta: '0.0', info: 18 }, { theta: '1.0', info: 14 }, { theta: '2.0', info: 6 },
  { theta: '3.0', info: 2 },
];

// Mock Data for Tables
const mockTestSummary = [
  { testId: 'TST-2603-MAG3-A', year: '2026', mt: 'MT1', course: 'MAG', level: 'L3', takers: 1250, avgCorrect: '68.5%', difficulty: 0.65, discrimination: 1.25, reliability: 0.88, grade: 'A' },
  { testId: 'TST-2603-GT4-B', year: '2026', mt: 'MT1', course: 'GT', level: 'L4', takers: 840, avgCorrect: '62.1%', difficulty: 0.72, discrimination: 1.15, reliability: 0.85, grade: 'B' },
  { testId: 'TST-2512-ECP5-A', year: '2025', mt: 'MT4', course: 'ECP', level: 'L5', takers: 420, avgCorrect: '55.4%', difficulty: 0.81, discrimination: 1.40, reliability: 0.91, grade: 'A' },
];

const mockAlerts = [
  { itemId: 'ITM-2023-045', pValue: 0.15, discrimination: 0.25, type: '과도한 난이도 / 낮은 변별도', level: 'Critical' },
  { itemId: 'ITM-2023-082', pValue: 0.88, discrimination: 0.15, type: '변별력 상실 (너무 쉬움)', level: 'Warning' },
  { itemId: 'ITM-2023-104', pValue: 0.45, discrimination: -0.10, type: '음수 변별도 (오류 의심)', level: 'Critical' },
  { itemId: 'ITM-2023-112', pValue: 0.50, discrimination: 0.45, type: '경계선 변별도', level: 'Notice' },
];

export function ResearchDashboard({ userGroup: _userGroup }: ResearchDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter States
  const [filters, setFilters] = useState({
    year: '', mt: '', course: '', level: '', testId: '', form: '', campus: '', basis: 'National'
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      year: '', mt: '', course: '', level: '', testId: '', form: '', campus: '', basis: 'National'
    });
  };

  const getAlertBadge = (level: string) => {
    switch (level) {
      case 'Critical': return <span className="px-2.5 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium border border-red-200 dark:border-red-800">Critical</span>;
      case 'Warning': return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-medium border border-amber-200 dark:border-amber-800">Warning</span>;
      case 'Notice': return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800">Notice</span>;
      default: return <span className="px-2.5 py-1 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 rounded-full text-xs font-medium">{level}</span>;
    }
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A': return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md text-xs font-bold">A</span>;
      case 'B': return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-md text-xs font-bold">B</span>;
      case 'C': return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-md text-xs font-bold">C</span>;
      default: return <span className="px-2.5 py-1 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 rounded-md text-xs font-bold">{grade}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Research Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">시험 품질과 평가 모델 상태를 한눈에 모니터링하는 통합 대시보드입니다.</p>
        </div>
      </div>

      {/* 1. Search Area */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
        <div className={`flex items-center ${isExpanded ? 'mb-4' : ''}`}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 연도 (Exam Year)</label>
              <div className="relative">
                <select value={filters.year} onChange={(e) => handleFilterChange('year', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="">전체</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 회차 (Monthly Test)</label>
              <div className="relative">
                <select value={filters.mt} onChange={(e) => handleFilterChange('mt', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="">전체</option>
                  <option value="MT1">MT1</option>
                  <option value="MT2">MT2</option>
                  <option value="MT3">MT3</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">과정 (Course)</label>
              <div className="relative">
                <select value={filters.course} onChange={(e) => handleFilterChange('course', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="">전체</option>
                  {COURSES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">레벨 (Level)</label>
              <div className="relative">
                <select value={filters.level} onChange={(e) => handleFilterChange('level', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="">전체</option>
                  {filters.course && COURSE_LEVEL_MAP[filters.course] ? (
                    COURSE_LEVEL_MAP[filters.course].map(l => (
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
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 ID (Test ID)</label>
              <input type="text" value={filters.testId} onChange={(e) => handleFilterChange('testId', e.target.value)} placeholder="e.g. TST-2603..." className={UI_FILTER_CONTROL_CLASS} />
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">시험 Form</label>
              <div className="relative">
                <select value={filters.form} onChange={(e) => handleFilterChange('form', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="">전체</option>
                  <option value="A">Form A</option>
                  <option value="B">Form B</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">캠퍼스 (Campus)</label>
              <div className="relative">
                <select value={filters.campus} onChange={(e) => handleFilterChange('campus', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="">전체 (All)</option>
                  {CAMPUS_LIST.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">분석 기준</label>
              <div className="relative">
                <select value={filters.basis} onChange={(e) => handleFilterChange('basis', e.target.value)} className={UI_FILTER_CONTROL_CLASS}>
                  <option value="National">전국 (National)</option>
                  <option value="Campus">캠퍼스 (Campus)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-4 flex items-end justify-end gap-2 mt-2">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors">
                <Search className="w-4 h-4 mr-2" />
                검색
              </button>
              <button onClick={handleReset} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium flex items-center transition-colors">
                <RotateCcw className="w-4 h-4 mr-2" />
                초기화
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Dashboard Panels (6 Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel 1: 시험 품질 요약 */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex flex-col">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
            <ShieldAlert className="w-5 h-5 text-indigo-500 mr-2" />
            시험 품질 요약
          </h3>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">시험 난이도 (Difficulty)</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">0.65</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">시험 변별도 (Discrimination)</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">1.25</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">시험 신뢰도 (Reliability)</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">0.88</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: 시험 난이도 분포 */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 text-indigo-500 mr-2" />
            시험 난이도 분포
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diffData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: '#f1f5f9', opacity: 0.1 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 3: 문항 품질 상태 */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 text-indigo-500 mr-2" />
            문항 품질 상태
          </h3>
          <div className="h-64 flex flex-col">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={qualityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {qualityData.map((item, idx) => (
                <div key={idx} className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: item.color }}></span>
                  {item.name} ({item.value}%)
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 4: 능력 분포 (θ Distribution) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 text-indigo-500 mr-2" />
            능력 분포 (θ Distribution)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={abilityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="theta" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 5: 시험 정보 함수 */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
            <LineChart className="w-5 h-5 text-indigo-500 mr-2" />
            시험 정보 함수 (TIF)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tifData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="theta" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="info" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 6: 문항 품질 Alert 요약 */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex flex-col">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            문항 품질 Alert 요약
          </h3>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Critical Alerts</span>
              </div>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">2건</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Warning Alerts</span>
              </div>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">1건</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notice Alerts</span>
              </div>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">1건</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. 검색 결과 테이블 (시험 분석 요약) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
            시험 분석 요약 테이블
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Test ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">시험 연도</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">시험 회차</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">과정</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">레벨</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">응시자 수</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">평균 정답률</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">시험 난이도</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">시험 변별도</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">시험 신뢰도</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">품질 등급</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockTestSummary.map((test, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{test.testId}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap text-center">{test.year}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap text-center">{test.mt}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap text-center">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">{test.course}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap text-center">{test.level}</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap text-right font-mono">{test.takers.toLocaleString()}</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap text-right font-mono">{test.avgCorrect}</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap text-right font-mono">{test.difficulty.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap text-right font-mono">{test.discrimination.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap text-right font-mono">{test.reliability.toFixed(2)}</td>
                  <td className="p-4 text-sm text-center whitespace-nowrap">{getGradeBadge(test.grade)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. 문항 품질 Alert 테이블 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            문항 품질 Alert
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Item ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">난이도 (P-value)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">변별도 (Discrimination)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">문제 유형</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Alert Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockAlerts.map((alert, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{alert.itemId}</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap text-right font-mono">{alert.pValue.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap text-right font-mono">{alert.discrimination.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">{alert.type}</td>
                  <td className="p-4 text-sm text-center whitespace-nowrap">{getAlertBadge(alert.level)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
