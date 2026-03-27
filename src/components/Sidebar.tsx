import React, { useState } from 'react';
import { 
  LayoutDashboard, BarChart3, AlertTriangle, ShieldCheck, Trophy, Database,
  Microscope, FileText, Target, Sliders, Archive,
  Users, UserCircle, Lightbulb, ChevronLeft, ChevronRight, ChevronDown,
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
    'Research System': true,
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
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'pscore', label: 'P-Score', icon: BarChart3 },
        { id: 'pcram', label: 'PC-RAM', icon: AlertTriangle },
        { id: 'peqm', label: 'PEQM', icon: ShieldCheck },
        { id: 'eqs', label: '3P-EQS', icon: Trophy },
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
        { id: 'class-analysis', label: 'Class Analysis', icon: Users },
        { id: 'student-analysis', label: 'Student Analysis', icon: UserCircle },
        { id: 'teaching-insight', label: 'Teaching Insight', icon: Lightbulb },
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
      className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white flex flex-col h-full overflow-y-auto transition-all duration-300 ease-in-out relative`}
    >
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} sticky top-0 bg-slate-900 z-10 min-h-[88px]`}>
        <Database className="w-8 h-8 text-indigo-400 shrink-0" />
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <h1 className="text-xl font-bold tracking-wider">STRATOS</h1>
            <p className="text-xs text-slate-400">L.A.B.S. Analytics</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-7 right-[-12px] bg-slate-800 text-slate-300 hover:text-white p-1 rounded-full border border-slate-700 z-50 transition-colors"
        style={{ right: '12px' }}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
      
      <div className="flex-1 px-4 pb-6 space-y-6 mt-2">
        {menuGroups.map((group, idx) => {
          const isGroupExpanded = expandedGroups[group.title];
          return (
            <div key={idx}>
              <button 
                onClick={() => toggleGroup(group.title)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ${isCollapsed ? 'px-0' : 'px-2'} hover:text-slate-300 transition-colors`}
              >
                <span>{isCollapsed ? group.shortTitle : group.title}</span>
                {!isCollapsed && (
                  isGroupExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
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
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm ${
                            isActive && !hasSubItems ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
                            <Icon className={`w-5 h-5 shrink-0 ${isActive && hasSubItems ? 'text-indigo-400' : ''}`} />
                            {!isCollapsed && (
                              <span className={`font-medium whitespace-nowrap overflow-hidden text-ellipsis ${isActive && hasSubItems ? 'text-white' : ''}`}>{item.label}</span>
                            )}
                          </div>
                          {!isCollapsed && hasSubItems && (
                            isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        
                        {!isCollapsed && hasSubItems && isExpanded && (
                          <div className="mt-1 mb-2 ml-4 pl-4 border-l border-slate-700 space-y-1">
                            {item.subItems.map((subItem: any) => (
                              <button
                                key={subItem.id}
                                onClick={() => setActiveTab(subItem.id)}
                                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                                  activeTab === subItem.id ? 'bg-indigo-600/20 text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
      
      <div className="p-4 border-t border-slate-800 sticky bottom-0 bg-slate-900 space-y-4">
        {/* Tutorial Button */}
        <button 
          onClick={() => setIsTutorialOpen(true)}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2 px-3'} py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm`}
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
                <span className="text-sm font-medium text-white">김폴리</span>
                <span className="text-xs text-slate-400">poly.kim</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-slate-800">
              <Settings className="w-4 h-4" />
            </button>
          )}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
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
