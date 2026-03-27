import React from 'react';
import { TrendingUp, AlertTriangle, Award, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CAMPUS_DATA, NATIONAL_AVERAGES } from '../../data/campusMockData';

export function CampusKPICards() {
  const cards = [
    {
      title: '평균 P-Score',
      value: CAMPUS_DATA.pScore,
      national: NATIONAL_AVERAGES.pScore,
      icon: TrendingUp,
      color: 'blue',
      unit: '',
      change: '+1.2',
      changeType: 'up'
    },
    {
      title: '평균 Z-Score',
      value: CAMPUS_DATA.zScore,
      national: NATIONAL_AVERAGES.zScore,
      icon: AlertTriangle,
      color: 'amber',
      unit: '',
      change: '+0.05',
      changeType: 'up'
    },
    {
      title: '평균 AR (성취도)',
      value: CAMPUS_DATA.pScore, // Mocked as P-Score for now
      national: NATIONAL_AVERAGES.pScore,
      icon: Award,
      color: 'indigo',
      unit: '%',
      change: '-1.5%',
      changeType: 'down'
    },
    {
      title: '평균 CV (변동계수)',
      value: CAMPUS_DATA.cv,
      national: NATIONAL_AVERAGES.cv,
      icon: ShieldCheck,
      color: 'emerald',
      unit: '%',
      change: '-2.1%',
      changeType: 'down'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm font-medium dark:text-slate-400">{card.title}</h3>
            <div className={`p-2 bg-${card.color}-50 text-${card.color}-600 rounded-lg dark:bg-${card.color}-500/10 dark:text-${card.color}-400`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">
            {card.value.toFixed(card.title.includes('Z-Score') ? 2 : 1)}{card.unit}
          </div>
          <div className={`${card.changeType === 'up' ? 'text-emerald-500' : 'text-rose-500'} text-xs font-medium flex items-center mt-2`}>
            {card.changeType === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1"/> : <ArrowDownRight className="w-3 h-3 mr-1"/>}
            {card.change} from last exam
          </div>
        </div>
      ))}
    </div>
  );
}
