import React, { useState } from 'react';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Bell,
  Play,
  UserCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-react';
import { starkSound } from '../../services/sound';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'Citizen' | 'Admin';
  onRoleToggle: () => void;
  onStartSimulation: () => void;
  onOpenReportForm: () => void;
  onOpenAssistant: () => void;
  activeCriticalCount: number;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  userRole,
  onRoleToggle,
  onStartSimulation,
  onOpenReportForm,
  onOpenAssistant,
  activeCriticalCount,
  theme = 'light',
  onThemeToggle,
}) => {
  const [muted, setMuted] = useState(starkSound.isMuted());
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSoundToggle = () => {
    const isNowMuted = starkSound.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) starkSound.playClick();
  };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'issues', label: 'Live Issues' },
    { id: 'map', label: 'Civic Map' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'admin', label: 'Command Center' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-blue-100 dark:border-cyan-900/30 px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-8 max-w-7xl mx-auto">
        {/* Zone 1: Brand title, one line */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => {
              starkSound.playClick();
              onTabChange('overview');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              <Zap className="w-4 h-4 fill-white/30" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold font-mono tracking-wider text-slate-900 dark:text-slate-100 whitespace-nowrap group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                CIVICTRACE
              </span>
              <span className="text-[10px] font-mono tracking-widest text-blue-600 dark:text-cyan-400 font-semibold uppercase">
                S.T.A.R.K. Initiative
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: 4–5 nav links, 1–2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  starkSound.playClick();
                  onTabChange(item.id);
                }}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative text-xs tracking-wide uppercase font-mono ${
                  isActive
                    ? 'text-blue-600 dark:text-cyan-400 font-bold'
                    : 'text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-500 shadow-sm" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action and utility controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Emergency Simulation Quick Trigger */}
          <button
            onClick={() => {
              starkSound.playAlert();
              onStartSimulation();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-300 transition-colors whitespace-nowrap shadow-xs"
            title="Launch Stark Civic Emergency Simulation"
          >
            <Play className="w-3 h-3 fill-rose-600 dark:fill-rose-400 text-rose-600 dark:text-rose-400" />
            <span>Simulation</span>
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={() => {
              starkSound.playScan();
              onOpenAssistant();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-cyan-950/50 dark:border-cyan-500/30 dark:text-cyan-300 transition-colors whitespace-nowrap"
            title="Open Civic AI Assistant"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span className="hidden lg:inline">Civic AI</span>
          </button>

          {/* Theme Toggle Button (Light / Dark) */}
          {onThemeToggle && (
            <button
              onClick={() => {
                starkSound.playClick();
                onThemeToggle();
              }}
              className="p-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          )}

          {/* Sound Mute Toggle */}
          <button
            onClick={handleSoundToggle}
            className="p-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800"
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />}
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                starkSound.playClick();
                setShowNotifications(!showNotifications);
              }}
              className="p-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {activeCriticalCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 rounded-xl shadow-2xl p-3 z-50 stark-grid-bg">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-mono text-blue-600 dark:text-cyan-400 font-bold">
                  <span>S.T.A.R.K. TELEMETRY FEED</span>
                  <span className="text-[10px] text-slate-500">LIVE</span>
                </div>
                <div className="space-y-2.5 my-2.5 max-h-64 overflow-y-auto pr-1 text-xs">
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-500/30 dark:text-rose-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                    <div>
                      <p className="font-semibold">Critical Water Main Burst</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">Civil Lines crossing: municipal crew deployed.</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 dark:bg-cyan-950/40 dark:border-cyan-500/30 dark:text-cyan-300 flex items-start gap-2">
                    <Zap className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-cyan-400" />
                    <div>
                      <p className="font-semibold">AI Cluster Detected</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">3 reports within 38m on Birla Road merged.</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-semibold">Resolution Verified</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">Station Road pothole repair verified by citizen.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <button
            onClick={() => {
              starkSound.playClick();
              onRoleToggle();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 transition-colors whitespace-nowrap shadow-xs"
            title="Toggle between Citizen and Administrator Mode"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span className="hidden sm:inline text-slate-500 dark:text-slate-400">Role:</span>
            <span className="font-bold text-blue-600 dark:text-cyan-400">{userRole}</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              starkSound.playClick();
              onOpenReportForm();
            }}
            className="px-3.5 py-1.5 text-xs font-mono font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-cyan-400 dark:to-blue-400 dark:text-slate-950 rounded shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
          >
            + Report Issue
          </button>
        </div>
      </div>
    </header>
  );
};
