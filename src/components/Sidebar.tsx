import React, { useState } from 'react';
import { 
  LayoutDashboard, BarChart3, AlertTriangle, ShieldCheck, Database,
  Microscope, FileText, Target, Sliders, Archive,
  ChevronLeft, ChevronRight, ChevronDown,
  Settings, PlayCircle
} from 'lucide-react';
import { TutorialModal } from './TutorialModal';
import { SidebarExamDataPanel } from './SidebarExamDataPanel';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'HQ Management System': true,
    'Research System': false,
    'Campus Teaching System': true,
  });
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'calibration': false,
  });
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const menuGroups = [
    {
      title: 'HQ Management System',
      shortTitle: 'HQ',
      items: [
        { id: 'dashboard', label: 'HQ Dashboard', icon: LayoutDashboard },
        { id: 'pscore', label: 'P-Score', icon: BarChart3 },
        { id: 'pcram', label: 'PC-RAM', icon: AlertTriangle },
        { id: 'peqm', label: 'PEQM', icon: ShieldCheck },
      ]
    },
    {
      title: 'Campus Teaching System',
      shortTitle: 'Campus',
      items: [
        { id: 'campus-dashboard', label: 'Campus Dashboard', icon: LayoutDashboard },
        { id: 'campus-pscore', label: 'P-Score', icon: BarChart3 },
        { id: 'campus-pcram', label: 'PC-RAM', icon: AlertTriangle },
        { id: 'campus-peqm', label: 'PEQM', icon: ShieldCheck },
      ]
    },
    {
      title: 'Research System',
      shortTitle: 'RS',
      items: [
        { id: 'rs-dashboard', label: 'RS Dashboard', icon: LayoutDashboard },
        { id: 'rs-pscore', label: 'P-Score', icon: BarChart3 },
        { id: 'rs-pcram', label: 'PC-RAM', icon: AlertTriangle },
        { id: 'rs-peqm', label: 'PEQM', icon: ShieldCheck },
        { id: 'test-analytics', label: 'Test Analytics', icon: FileText },
        { id: 'item-analytics', label: 'Item Analytics', icon: Target },
        { id: 'irt-model', label: 'IRT Model', icon: Microscope },
        { 
          id: 'calibration', 
          label: 'Calibration', 
          icon: Sliders,
          subItems: [
            { id: 'item-calibration', label: 'Item Calibration' },
            { id: 'anchor-item', label: 'Anchor Item' },
            { id: 'scale-linking', label: 'Scale Linking' },
            { id: 'difficulty-standardization', label: '시험 난이도' }
          ]
        },
        { 
          id: 'item-bank', 
          label: 'Item Bank', 
          icon: Archive,
          subItems: [
            { id: 'item-repository', label: '문항 Repository' },
            { id: 'item-performance', label: '문항 성능 분석' },
            { id: 'item-usage', label: '문항 사용 기록' },
            { id: 'test-composition', label: '시험지 구성' }
          ]
        },
      ]
    }
  ];

  return (
    <div 
      className={`${isCollapsed ? 'w-20' : 'w-64'} relative flex h-full min-h-0 flex-col overflow-visible transition-all duration-300 ease-in-out
        bg-[#f8f9fb] text-slate-900 border-r border-slate-200/90
        dark:bg-slate-900 dark:text-white dark:border-slate-800`}
    >
      <div className={`flex shrink-0 items-center p-6 min-h-[88px]
        bg-[#f8f9fb] dark:bg-slate-900 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
        <Database className="w-8 h-8 text-indigo-600 shrink-0 dark:text-indigo-400" strokeWidth={1.75} />
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap min-w-0">
            <h1 className="text-xl font-bold tracking-wide text-slate-900 dark:text-white">STRATOS</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-0.5">
              L.A.B.S. Analytics
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
        className="absolute left-full top-5 z-[80] flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-colors hover:border-slate-300 hover:text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
      
      <div className="mt-2 min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-6 space-y-6">
        {menuGroups.map((group, idx) => {
          const isGroupExpanded = expandedGroups[group.title];
          return (
            <div key={idx}>
              <button 
                onClick={() => toggleGroup(group.title)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-2 ${isCollapsed ? 'px-0' : 'px-2'} hover:text-slate-700 transition-colors dark:text-slate-400 dark:hover:text-slate-200`}
              >
                <span className="text-left leading-snug">{isCollapsed ? group.shortTitle : group.title}</span>
                {!isCollapsed && (
                  isGroupExpanded ? <ChevronDown className="w-4 h-4 shrink-0 opacity-70" /> : <ChevronRight className="w-4 h-4 shrink-0 opacity-70" />
                )}
              </button>
              
              {isGroupExpanded && (
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const isActive = activeTab === item.id || (hasSubItems && item.subItems.some((sub: any) => sub.id === activeTab));
                    const isExpanded = expandedMenus[item.id];

                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => {
                            if (hasSubItems) {
                              toggleMenu(item.id);
                            } else {
                              setActiveTab(item.id);
                            }
                          }}
                          title={isCollapsed ? item.label : undefined}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-sm ${
                            isActive && !hasSubItems
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-700 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
                            <Icon className={`w-5 h-5 shrink-0 ${
                              isActive && !hasSubItems ? 'text-white' : isActive && hasSubItems ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'
                            }`} />
                            {!isCollapsed && (
                              <span className={`font-medium whitespace-nowrap overflow-hidden text-ellipsis ${
                                isActive && hasSubItems ? 'text-slate-900 dark:text-white' : ''
                              }`}>{item.label}</span>
                            )}
                          </div>
                          {!isCollapsed && hasSubItems && (
                            isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          )}
                        </button>
                        
                        {!isCollapsed && hasSubItems && isExpanded && (
                          <div className="mt-1 mb-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700 space-y-1">
                            {item.subItems.map((subItem: any) => (
                              <button
                                key={subItem.id}
                                onClick={() => setActiveTab(subItem.id)}
                                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                                  activeTab === subItem.id
                                    ? 'bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-600/20 dark:text-indigo-400'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
                                }`}
                              >
                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{subItem.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="shrink-0 space-y-4 border-t border-slate-200 bg-[#f8f9fb] p-4 dark:border-slate-800 dark:bg-slate-900">
        {/* Tutorial Button */}
        <button 
          onClick={() => setIsTutorialOpen(true)}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2 px-3'} py-2 rounded-lg transition-colors text-sm
            bg-slate-200/80 hover:bg-slate-200 text-slate-700
            dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300`}
          title={isCollapsed ? "튜토리얼 보기" : undefined}
        >
          <PlayCircle className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="font-medium whitespace-nowrap">튜토리얼 보기</span>}
        </button>

        <SidebarExamDataPanel isCollapsed={isCollapsed} />

        {/* User Profile */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} group cursor-pointer relative`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0 text-sm">
              K
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900 dark:text-white">김폴리</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">poly.kim</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-slate-200 dark:text-slate-500 dark:hover:text-white dark:hover:bg-slate-800">
              <Settings className="w-4 h-4" />
            </button>
          )}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-white border border-slate-200 text-slate-800 text-xs rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              김폴리 (poly.kim)
            </div>
          )}
        </div>
      </div>

      <TutorialModal 
        isOpen={isTutorialOpen} 
        onClose={() => setIsTutorialOpen(false)} 
      />
    </div>
  );
}
