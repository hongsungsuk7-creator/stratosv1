import React from 'react';
import { Construction } from 'lucide-react';

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-4 bg-indigo-50 rounded-full mb-4">
        <Construction className="w-12 h-12 text-indigo-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500">This module is currently under development.</p>
    </div>
  );
}
