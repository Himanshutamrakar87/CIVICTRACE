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
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-cyan-900/30 px-6 py-3">
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
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Zap className="w-4 h-4 fill-cyan-400/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold font-mono tracking-wider text-slate-100 whitespace-nowrap group-hover:text-cyan-300 transition-colors">
                CIVICTRACE
              </span>
              <span className="text-[10px] font-mono tracking-widest text-cyan-500/80 uppercase">
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
                    ? 'text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action and utility controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Emergency Simulation Quick Trigger */}
          <button
            onClick={() => {
              starkSound.playAlert();
              onStartSimulation();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 transition-colors whitespace-nowrap shadow-[0_0_12px_rgba(244,63,94,0.2)]"
            title="Launch Stark Civic Emergency Simulation"
          >
            <Play className="w-3 h-3 fill-rose-400" />
            <span>Simulation</span>
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={() => {
              starkSound.playScan();
              onOpenAssistant();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50 transition-colors whitespace-nowrap"
            title="Open Civic AI Assistant"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Civic AI</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleSoundToggle}
            className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors rounded hover:bg-slate-900 border border-transparent hover:border-slate-800"
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                starkSound.playClick();
                setShowNotifications(!showNotifications);
              }}
              className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors rounded hover:bg-slate-900 border border-transparent hover:border-slate-800 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {activeCriticalCount > 0 && (
                <span className="absolute 1 top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-lg shadow-2xl p-3 z-50 stark-grid-bg">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-cyan-400">
                  <span>S.T.A.R.K. TELEMETRY FEED</span>
                  <span className="text-[10px] text-slate-500">LIVE</span>
                </div>
                <div className="space-y-2.5 my-2.5 max-h-64 overflow-y-auto pr-1 text-xs">
                  <div className="p-2 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <div>
                      <p className="font-semibold">Critical Water Main Burst</p>
                      <p className="text-[11px] text-slate-300">Civil Lines crossing: municipal crew deployed.</p>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 flex items-start gap-2">
                    <Zap className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                    <div>
                      <p className="font-semibold">AI Cluster Detected</p>
                      <p className="text-[11px] text-slate-300">3 reports within 38m on Birla Road merged.</p>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <p className="font-semibold">Resolution Verified</p>
                      <p className="text-[11px] text-slate-300">Station Road pothole repair verified by citizen.</p>
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
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 transition-colors whitespace-nowrap"
            title="Toggle between Citizen and Administrator Mode"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-semibold text-cyan-400">{userRole}</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              starkSound.playClick();
              onOpenReportForm();
            }}
            className="px-3.5 py-1.5 text-xs font-mono font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all whitespace-nowrap shrink-0"
          >
            + Report Issue
          </button>
        </div>
      </div>
    </header>
  );
};
