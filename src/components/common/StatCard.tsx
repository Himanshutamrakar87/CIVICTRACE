import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  accent?: 'cyan' | 'rose' | 'amber' | 'emerald' | 'blue';
  icon?: React.ReactNode;
  trend?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  subtext,
  accent = 'cyan',
  icon,
  trend,
  onClick,
}) => {
  const accentBorder = {
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400',
    rose: 'border-rose-500/30 hover:border-rose-500/50 text-rose-400',
    amber: 'border-amber-500/25 hover:border-amber-500/45 text-amber-400',
    emerald: 'border-emerald-500/25 hover:border-emerald-500/45 text-emerald-400',
    blue: 'border-blue-500/20 hover:border-blue-500/40 text-blue-400',
  }[accent];

  return (
    <div
      onClick={onClick}
      className={`stark-panel stark-panel-glow rounded-lg p-4 transition-all duration-200 border ${accentBorder} ${
        onClick ? 'cursor-pointer hover:bg-slate-900/60' : ''
      }`}
    >
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span className="font-medium tracking-wide uppercase text-[11px] text-slate-400">{label}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold font-mono tabular-nums text-slate-100 tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>

      {(subtext || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          {subtext && <span className="truncate">{subtext}</span>}
          {trend && <span className="font-mono text-xs text-cyan-400 ml-auto shrink-0">{trend}</span>}
        </div>
      )}
    </div>
  );
};
