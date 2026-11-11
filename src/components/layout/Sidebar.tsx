import React from 'react';
import {
  LayoutDashboard,
  ListFilter,
  MapPin,
  BarChart3,
  SlidersHorizontal,
  Bot,
  PlayCircle,
  FileText,
  Radio,
} from 'lucide-react';
import { starkSound } from '../../services/sound';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'Citizen' | 'Admin';
  onStartSimulation: () => void;
  onOpenAssistant: () => void;
  activeCount: number;
  criticalCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  userRole,
  onStartSimulation,
  onOpenAssistant,
  activeCount,
  criticalCount,
}) => {
  const mainNav = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'issues', label: 'Live Issues', icon: ListFilter, count: activeCount },
    { id: 'map', label: 'Civic Map', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Dossier Reports', icon: FileText },
    ...(userRole === 'Admin'
      ? [{ id: 'admin', label: 'Command Center', icon: SlidersHorizontal }]
      : []),
  ];

  return (
    <aside className="w-64 shrink-0 bg-white/90 dark:bg-slate-950/70 border-r border-blue-100 dark:border-cyan-900/20 p-4 hidden md:flex flex-col justify-between stark-grid-bg transition-colors">
      <div className="space-y-6">
        {/* Satna Telemetry Node Box */}
        <div className="p-3 rounded-xl border border-blue-200 dark:border-cyan-500/20 bg-blue-50/70 dark:bg-cyan-950/20 text-xs font-mono space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-blue-700 dark:text-cyan-400">
            <span className="font-bold tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 animate-pulse" />
              SATNA NODE 01
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
              ONLINE
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">Division: Rewa / MP</p>
          <div className="pt-1.5 border-t border-blue-200/60 dark:border-cyan-900/40 flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
            <span>Critical Queue:</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold tabular-nums">{criticalCount}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 font-semibold">
            INTELLIGENCE MODULES
          </p>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  starkSound.playClick();
                  onTabChange(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-cyan-500/15 border border-blue-200 dark:border-cyan-500/40 text-blue-700 dark:text-cyan-300 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border tabular-nums font-semibold ${
                    isActive 
                      ? 'bg-white border-blue-200 text-blue-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                      : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Special Mission Triggers */}
        <div className="pt-2 space-y-2">
          <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold">
            S.T.A.R.K. PROTOCOLS
          </p>

          <button
            onClick={() => {
              starkSound.playAlert();
              onStartSimulation();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-rose-800 bg-rose-50 border border-rose-200 hover:bg-rose-100 dark:text-rose-300 dark:bg-rose-950/40 dark:border-rose-500/30 dark:hover:bg-rose-900/50 transition-all shadow-xs"
          >
            <PlayCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <div className="text-left">
              <span className="block font-bold">Civic Emergency Sim</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">3-Pothole Cluster Test</span>
            </div>
          </button>

          <button
            onClick={() => {
              starkSound.playScan();
              onOpenAssistant();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-blue-800 bg-blue-50 border border-blue-200 hover:bg-blue-100 dark:text-cyan-300 dark:bg-cyan-950/40 dark:border-cyan-500/30 dark:hover:bg-cyan-900/50 transition-all shadow-xs"
          >
            <Bot className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
            <div className="text-left">
              <span className="block font-bold">Civic AI Assistant</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Stark Intelligence Q&A</span>
            </div>
          </button>
        </div>
      </div>

      {/* S.T.A.R.K. Footer Attribution */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-900 text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
        <div className="text-slate-800 dark:text-slate-300 font-bold tracking-wider">CIVICTRACE v2.6</div>
        <p className="text-[10px]">Open Innovation — S.T.A.R.K. Initiative</p>
        <p className="text-[9px] text-slate-400">Scientific Tech, Advancement, Research & Knowledge</p>
      </div>
    </aside>
  );
};
