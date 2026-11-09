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
    <div className="relative min-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden stark-grid-bg">
      {/* Background Hero Asset with Scrim Overlay */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src={ASSET_PATHS.heroCommandCenter}
          alt="S.T.A.R.K. Civic Intelligence Center"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter contrast-125 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
      </div>

      {/* Top HUD Status Bar */}
      <div className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-cyan-900/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Zap className="w-5 h-5 fill-cyan-400/20" />
          </div>
          <div>
            <div className="text-sm font-bold font-mono tracking-widest text-slate-100">CIVICTRACE</div>
            <div className="text-[10px] font-mono text-cyan-400/80">S.T.A.R.K. CIVIC INTELLIGENCE PLATFORM</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span className="hidden sm:inline">SATNA SEC-04 MUNICIPAL GRID</span>
          <span className="text-slate-400">·</span>
          <span className="text-emerald-400 font-semibold">STATUS: OPTIMAL</span>
        </div>
      </div>

      {/* Central Visual & Hero Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        {/* Holographic Arc-Reactor AI Scanner Visualization */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Outer Pulsing Radar Rings */}
          <div className="w-48 h-48 md:w-60 md:h-60 rounded-full border border-cyan-500/20 animate-spin [animation-duration:20s] absolute" />
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border border-dashed border-blue-500/30 animate-spin [animation-duration:14s] [animation-direction:reverse] absolute" />
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border border-cyan-400/40 animate-hud-pulse absolute shadow-[0_0_30px_rgba(6,182,212,0.25)]" />

          {/* Central Reactor Core Icon */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-950/90 border-2 border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.6)] z-10">
            <Zap className="w-8 h-8 text-cyan-300 fill-cyan-400/30 animate-pulse" />
            <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-400 mt-1">CORE AI</span>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-3 mt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider">
            <span>OPEN INNOVATION</span>
            <span className="text-cyan-500">/</span>
            <span>S.T.A.R.K. INITIATIVE</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 font-tech uppercase max-w-3xl">
            CIVICTRACE — AI-POWERED CIVIC INTELLIGENCE & ACCOUNTABILITY
          </h1>

          <p className="text-lg md:text-xl text-cyan-300/90 font-mono tracking-wide">
            "Report. Connect. Resolve."
          </p>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Autonomous multi-sensor complaint classification, spatial-semantic duplicate detection, real-time incident clustering, and citizen-verified resolution tracking.
          </p>
        </div>

        {/* Live Statistics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 w-full max-w-3xl mt-8">
          <div className="stark-panel rounded-lg p-3 text-center border border-cyan-500/20">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Total Reports</div>
            <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums">{stats.totalReports}</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">Municipal Ledger</div>
          </div>

          <div className="stark-panel rounded-lg p-3 text-center border border-blue-500/20">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Active Issues</div>
            <div className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">{stats.activeIssues}</div>
            <div className="text-[10px] text-blue-400 mt-0.5">Under Investigation</div>
          </div>

          <div className="stark-panel rounded-lg p-3 text-center border border-rose-500/30 bg-rose-950/20">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Critical Severity</div>
            <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">{stats.criticalIssues}</div>
            <div className="text-[10px] text-rose-400/80 mt-0.5">Priority Response</div>
          </div>

          <div className="stark-panel rounded-lg p-3 text-center border border-emerald-500/20">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Resolved Rate</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{stats.resolutionRatePercent}%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Citizen-Verified</div>
          </div>
        </div>

        {/* Primary Command Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={() => {
              starkSound.playClick();
              onInitialize();
            }}
            className="flex items-center gap-2.5 px-6 py-3 text-sm font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-0.5"
          >
            <span>INITIALIZE SYSTEM DASHBOARD</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              starkSound.playAlert();
              onStartSimulation();
            }}
            className="flex items-center gap-2 px-5 py-3 text-sm font-mono font-semibold text-rose-300 bg-rose-950/70 border border-rose-500/50 hover:bg-rose-900/80 rounded shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all"
          >
            <Play className="w-4 h-4 fill-rose-400" />
            <span>LAUNCH EMERGENCY SIMULATION</span>
          </button>
        </div>

        {/* Citizen vs Admin Portal Portals */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-900 text-xs font-mono">
          <button
            onClick={() => {
              starkSound.playClick();
              onEnterCitizen();
            }}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-200 transition-colors"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Citizen Portal (Report & Track)</span>
          </button>

          <span className="text-slate-400">·</span>

          <button
            onClick={() => {
              starkSound.playClick();
              onEnterAdmin();
            }}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-200 transition-colors"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Administrator Command Center</span>
          </button>

          <span className="text-slate-400">·</span>

          <span className="flex items-center gap-1.5 text-slate-400">
            <Database className="w-3.5 h-3.5" />
            <span>Satna Municipal Core: Online</span>
          </span>
        </div>
      </div>

      {/* Bottom Legal / Initiative Footer */}
      <div className="relative z-10 w-full px-6 py-3 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400">
        <div>
          CIVICTRACE © 2026 S.T.A.R.K. Initiative — Scientific Technology, Advancement, Research & Knowledge
        </div>
        <div className="text-cyan-400/80 mt-1 sm:mt-0">
          Powered by Gemini AI Multi-Sensor Civic Intelligence
        </div>
      </div>
    </div>
  );
};
