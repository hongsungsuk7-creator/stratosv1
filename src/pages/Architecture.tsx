import React from 'react';
import { Database, Layers, Activity, BrainCircuit, LineChart } from 'lucide-react';

export function Architecture() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Data Architecture & Statistical Models</h2>
        <p className="text-slate-500 mt-2">STRATOS 5-Layer Data Structure and 4 Core Analytical Models</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* 5 Layer Data Architecture */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <Layers className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">5-Layer Data Architecture</h3>
          </div>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            
            {/* Layer 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800">Raw Data</h4>
                  <Database className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 mb-2">MT 응답 데이터</p>
                <div className="flex flex-wrap gap-1">
                  {['student_id', 'campus_id', 'class_id', 'test_id', 'item_id', 'answer', 'correct', 'score'].map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-mono">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Layer 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800">Item Metadata</h4>
                  <Database className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {['item_id', 'difficulty', 'discrimination', 'guessing', 'upper_limit', 'domain', 'skill'].map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-mono">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Layer 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-indigo-100 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-indigo-200 bg-indigo-50 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-indigo-900">Statistical Data</h4>
                  <Activity className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {['z_score', 'percentile', 'theta', 'ci', 'p_value'].map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white border border-indigo-100 rounded text-[10px] text-indigo-700 font-mono">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Layer 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-emerald-200 bg-emerald-50 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-emerald-900">Aggregated Data</h4>
                  <LineChart className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {['campus_avg', 'class_avg', 'student_growth', 'domain_accuracy', 'skill_accuracy'].map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white border border-emerald-100 rounded text-[10px] text-emerald-700 font-mono">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Layer 5 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-amber-100 text-amber-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                5
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-amber-200 bg-amber-50 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-amber-900">Insight Data</h4>
                  <BrainCircuit className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {['strength', 'weakness', 'risk', 'recommendation'].map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white border border-amber-100 rounded text-[10px] text-amber-700 font-mono">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Statistical Models */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-800">4 Statistical Models</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Model 1 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-blue-100 text-blue-700 font-bold text-xs">1</span>
                  <h4 className="font-bold text-slate-800">CTT 분석 (Classical Test Theory)</h4>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-white px-3 py-2 rounded border border-slate-100 text-sm text-slate-600"><span className="font-mono text-xs text-slate-400 block mb-1">Metric</span>difficulty</div>
                <div className="bg-white px-3 py-2 rounded border border-slate-100 text-sm text-slate-600"><span className="font-mono text-xs text-slate-400 block mb-1">Metric</span>discrimination</div>
                <div className="bg-white px-3 py-2 rounded border border-slate-100 text-sm text-slate-600"><span className="font-mono text-xs text-slate-400 block mb-1">Metric</span>z-score</div>
                <div className="bg-white px-3 py-2 rounded border border-slate-100 text-sm text-slate-600"><span className="font-mono text-xs text-slate-400 block mb-1">Metric</span>percentile</div>
              </div>
            </div>

            {/* Model 2 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-indigo-100 text-indigo-700 font-bold text-xs">2</span>
                  <h4 className="font-bold text-slate-800">IRT 분석 (Item Response Theory)</h4>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-white px-3 py-2 rounded border border-slate-100 text-sm text-slate-600"><span className="font-mono text-xs text-slate-400 block mb-1">Metric</span>theta (θ)</div>
                <div className="bg-white px-3 py-2 rounded border border-slate-100 text-sm text-slate-600"><span className="font-mono text-xs text-slate-400 block mb-1">Metric</span>item parameter (a,b,c,d)</div>
                <div className="bg-white px-3 py-2 rounded border border-slate-100 text-sm text-slate-600 col-span-2"><span className="font-mono text-xs text-slate-400 block mb-1">Metric</span>test information</div>
              </div>
            </div>

            {/* Model 3 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:border-rose-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-rose-100 text-rose-700 font-bold text-xs">3</span>
                  <h4 className="font-bold text-slate-800">Pattern 분석</h4>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-white px-3 py-2 rounded border border-slate-100 text-sm text-slate-600"><span className="font-mono text-xs text-slate-400 block mb-1">Method</span>S-P analysis</div>
                <div className="bg-white px-3 py-2 rounded border border-slate-100 text-sm text-slate-600"><span className="font-mono text-xs text-slate-400 block mb-1">Metric</span>Caution Index (CI)</div>
              </div>
            </div>

            {/* Model 4 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-100 text-emerald-700 font-bold text-xs">4</span>
                  <h4 className="font-bold text-slate-800">Learning Diagnosis</h4>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-white px-3 py-2 rounded border border-slate-100 text-sm text-slate-600"><span className="font-mono text-xs text-slate-400 block mb-1">Metric</span>skill mastery</div>
                <div className="bg-white px-3 py-2 rounded border border-slate-100 text-sm text-slate-600"><span className="font-mono text-xs text-slate-400 block mb-1">Metric</span>domain weakness</div>
                <div className="bg-white px-3 py-2 rounded border border-slate-100 text-sm text-slate-600 col-span-2"><span className="font-mono text-xs text-slate-400 block mb-1">Metric</span>growth trajectory</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
