import React from 'react';
import {
  Zap,
  Shield,
  Play,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';
import { DashboardStats } from '../../types/civic';
import { ASSET_PATHS } from '../../data/initialData';
import { starkSound } from '../../services/sound';

interface CommandEntryScreenProps {
  stats: DashboardStats;
  onInitialize: () => void;
  onEnterCitizen: () => void;
  onEnterAdmin: () => void;
  onStartSimulation: () => void;
}

export const CommandEntryScreen: React.FC<CommandEntryScreenProps> = ({
  stats,
  onInitialize,
  onEnterCitizen,
  onEnterAdmin,
  onStartSimulation,
}) => {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between overflow-hidden stark-grid-bg transition-colors">
      {/* Background Hero Asset with Scrim Overlay */}
      <div className="absolute inset-0 z-0 opacity-15 dark:opacity-25 pointer-events-none">
        <img
          src={ASSET_PATHS.heroCommandCenter}
          alt="S.T.A.R.K. Civic Intelligence Center"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter contrast-110 brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/85 to-slate-50/70 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/60" />
      </div>

      {/* Top HUD Status Bar */}
      <div className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-blue-100 dark:border-cyan-900/30 backdrop-blur-sm bg-white/70 dark:bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 fill-white/30" />
          </div>
          <div>
            <div className="text-sm font-bold font-mono tracking-widest text-slate-900 dark:text-slate-100">CIVICTRACE</div>
            <div className="text-[10px] font-mono text-blue-600 dark:text-cyan-400 font-semibold">S.T.A.R.K. CIVIC INTELLIGENCE PLATFORM</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="hidden sm:inline font-medium">SATNA SEC-04 MUNICIPAL GRID</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">STATUS: OPTIMAL</span>
        </div>
      </div>

      {/* Central Visual & Hero Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 md:py-14 flex flex-col items-center text-center">
        {/* Holographic Arc-Reactor AI Scanner Visualization */}
        <div className="relative my-4 md:my-6 flex items-center justify-center">
          {/* Outer Pulsing Radar Rings */}
          <div className="w-48 h-48 md:w-60 md:h-60 rounded-full border border-blue-400/30 dark:border-cyan-500/20 animate-spin [animation-duration:20s] absolute" />
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border border-dashed border-indigo-400/40 dark:border-blue-500/30 animate-spin [animation-duration:14s] [animation-direction:reverse] absolute" />
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border border-blue-500/50 dark:border-cyan-400/40 animate-hud-pulse absolute shadow-[0_0_25px_rgba(37,99,235,0.15)] dark:shadow-[0_0_30px_rgba(6,182,212,0.25)]" />

          {/* Central Reactor Core Icon */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white dark:bg-slate-950/90 border-2 border-blue-600 dark:border-cyan-400 flex flex-col items-center justify-center shadow-[0_4px_25px_rgba(37,99,235,0.25)] dark:shadow-[0_0_35px_rgba(6,182,212,0.6)] z-10">
            <Zap className="w-8 h-8 text-blue-600 dark:text-cyan-300 fill-blue-600/20 dark:fill-cyan-400/30 animate-pulse" />
            <span className="text-[9px] font-mono font-bold tracking-widest text-blue-600 dark:text-cyan-400 mt-1">CORE AI</span>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-3 mt-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-cyan-950/60 border border-blue-200 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-300 text-xs font-mono font-semibold tracking-wider shadow-xs">
            <span>OPEN INNOVATION</span>
            <span className="text-blue-400 dark:text-cyan-500">/</span>
            <span>S.T.A.R.K. INITIATIVE</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-tech uppercase max-w-3xl">
            CIVICTRACE — AI-POWERED CIVIC INTELLIGENCE & ACCOUNTABILITY
          </h1>

          <p className="text-lg md:text-xl text-blue-600 dark:text-cyan-300 font-mono font-bold tracking-wide">
            "Report. Connect. Resolve."
          </p>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Autonomous multi-sensor complaint classification, spatial-semantic duplicate detection, real-time incident clustering, and citizen-verified resolution tracking.
          </p>
        </div>

        {/* Live Statistics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 w-full max-w-3xl mt-8">
          <div className="stark-panel rounded-xl p-4 text-center border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900/80 shadow-sm">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Reports</div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">{stats.totalReports}</div>
            <div className="text-[10px] text-blue-600 dark:text-cyan-400 font-medium mt-0.5">Municipal Ledger</div>
          </div>

          <div className="stark-panel rounded-xl p-4 text-center border border-blue-200 dark:border-blue-500/20 bg-white dark:bg-slate-900/80 shadow-sm">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">Active Issues</div>
            <div className="text-2xl font-bold font-mono text-blue-600 dark:text-cyan-300 tabular-nums">{stats.activeIssues}</div>
            <div className="text-[10px] text-blue-500 dark:text-blue-400 font-medium mt-0.5">Under Investigation</div>
          </div>

          <div className="stark-panel rounded-xl p-4 text-center border border-rose-200 dark:border-rose-500/30 bg-rose-50/70 dark:bg-rose-950/20 shadow-sm">
            <div className="text-[11px] font-mono text-rose-700 dark:text-slate-400 uppercase font-semibold">Critical Severity</div>
            <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">{stats.criticalIssues}</div>
            <div className="text-[10px] text-rose-600/80 dark:text-rose-400/80 font-medium mt-0.5">Priority Response</div>
          </div>

          <div className="stark-panel rounded-xl p-4 text-center border border-emerald-200 dark:border-emerald-500/20 bg-white dark:bg-slate-900/80 shadow-sm">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">Resolved Rate</div>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">{stats.resolutionRatePercent}%</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Citizen-Verified</div>
          </div>
        </div>

        {/* Primary Command Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={() => {
              starkSound.playClick();
              onInitialize();
            }}
            className="flex items-center gap-2.5 px-6 py-3 text-sm font-mono font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <span>INITIALIZE SYSTEM DASHBOARD</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              starkSound.playAlert();
              onStartSimulation();
            }}
            className="flex items-center gap-2 px-5 py-3 text-sm font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 dark:text-rose-300 dark:bg-rose-950/70 dark:border-rose-500/50 rounded-xl shadow-xs transition-all"
          >
            <Play className="w-4 h-4 fill-rose-600 dark:fill-rose-400 text-rose-600 dark:text-rose-400" />
            <span>LAUNCH EMERGENCY SIMULATION</span>
          </button>
        </div>

        {/* Citizen vs Admin Portal Access */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-900 text-xs font-mono">
          <button
            onClick={() => {
              starkSound.playClick();
              onEnterCitizen();
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-cyan-400 dark:hover:text-cyan-200 transition-colors font-semibold"
          >
            <Shield className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>Citizen Portal (Report & Track)</span>
          </button>

          <span className="text-slate-300 dark:text-slate-600">·</span>

          <button
            onClick={() => {
              starkSound.playClick();
              onEnterAdmin();
            }}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200 transition-colors font-semibold"
          >
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Administrator Command Center</span>
          </button>

          <span className="text-slate-300 dark:text-slate-600">·</span>

          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Database className="w-3.5 h-3.5" />
            <span>Satna Municipal Core: Online</span>
          </span>
        </div>
      </div>

      {/* Bottom Legal / Initiative Footer */}
      <div className="relative z-10 w-full px-6 py-3 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-transparent">
        <div>
          CIVICTRACE © 2026 S.T.A.R.K. Initiative — Scientific Technology, Advancement, Research & Knowledge
        </div>
        <div className="text-blue-600 dark:text-cyan-400/80 font-medium mt-1 sm:mt-0">
          Powered by Gemini AI Multi-Sensor Civic Intelligence
        </div>
      </div>
    </div>
  );
};
