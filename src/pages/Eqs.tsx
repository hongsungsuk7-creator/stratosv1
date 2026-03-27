import React from 'react';
import { UserGroup } from '../types';
import { campusData } from '../data/mockData';
import { useExcelData } from '@/context/ExcelDataContext';
import { Trophy, Award, AlertCircle } from 'lucide-react';

export function Eqs({ userGroup }: { userGroup: UserGroup }) {
  const { campusSummaryData } = useExcelData();
  const campusSource = campusSummaryData ?? campusData;
  const data =
    userGroup === 'GROUP_HQ'
      ? campusSource
      : campusSource.filter((c) => c.id === 'C001').length > 0
        ? campusSource.filter((c) => c.id === 'C001')
        : campusSource.slice(0, 1);
  const sortedData = [...data].sort((a, b) => b.eqs - a.eqs);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">3P-EQS (POLY Performance Excellence Score)</h2>
        <p className="text-slate-500 mt-2">"P-Score로 성과를 읽고, PC-RAM으로 위기를 막고, PEQM으로 품질을 만든다"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-center">
          <div className="text-blue-600 font-bold text-xl mb-2">40%</div>
          <div className="text-blue-800 font-medium">P-Score (성취도)</div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl text-center">
          <div className="text-amber-600 font-bold text-xl mb-2">30%</div>
          <div className="text-amber-800 font-medium">PC-RAM (리스크 관리)</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl text-center">
          <div className="text-emerald-600 font-bold text-xl mb-2">30%</div>
          <div className="text-emerald-800 font-medium">PEQM (교육 품질)</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">3P-EQS 종합 랭킹 및 시상 대상</h3>
          {userGroup === 'GROUP_HQ' && (
            <span className="text-sm text-slate-500">전국 캠퍼스 기준</span>
          )}
        </div>
        <div className="divide-y divide-slate-200">
          {sortedData.map((campus, index) => (
            <div key={campus.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-lg">
                  #{index + 1}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{campus.name}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                    <span>P-Score: {campus.pScore}</span>
                    <span>Z-Score: {campus.zScore}</span>
                    <span>CV: {campus.cv}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="text-right">
                  <div className="text-3xl font-black text-indigo-600">{campus.eqs}</div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Score</div>
                </div>
                
                <div className="w-48 flex flex-col items-end space-y-2">
                  {index === 0 && (
                    <div className="flex items-center space-x-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold">
                      <Trophy className="w-3 h-3" />
                      <span>Grand Master</span>
                    </div>
                  )}
                  {campus.pScore >= 90 && (
                    <div className="flex items-center space-x-1 text-blue-500 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold">
                      <Award className="w-3 h-3" />
                      <span>Academic Excellence</span>
                    </div>
                  )}
                  {campus.status === '관리 부재형' && (
                    <div className="flex items-center space-x-1 text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-bold">
                      <AlertCircle className="w-3 h-3" />
                      <span>Intensive Care 대상</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
