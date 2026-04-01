import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openTabs: string[];
  closeTab: (e: React.MouseEvent, tabId: string) => void;
  tabLabels: Record<string, string>;
}

export function Layout({ children, activeTab, setActiveTab, openTabs, closeTab, tabLabels }: LayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`flex h-screen bg-slate-50 text-slate-900 font-sans ${isDarkMode ? 'dark' : ''}`}>
      <div className="relative z-30 shrink-0 h-full min-h-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        
        {/* Tab Bar */}
        <div className="flex items-center px-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-x-auto hide-scrollbar transition-colors duration-200">
          {openTabs.map((tabId) => (
            <div
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`group flex items-center space-x-1.5 px-3 py-1.5 border-b-2 text-xs font-medium cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === tabId
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 bg-slate-50 dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>{tabLabels[tabId] || tabId}</span>
              <button
                onClick={(e) => closeTab(e, tabId)}
                className={`p-0.5 rounded-full transition-colors ${
                  activeTab === tabId
                    ? 'hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300'
                    : 'opacity-0 group-hover:opacity-100 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
