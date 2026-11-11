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
  accent = 'blue',
  icon,
  trend,
  onClick,
}) => {
  const accentBorder = {
    cyan: 'border-blue-200 hover:border-blue-400 dark:border-cyan-500/20 dark:hover:border-cyan-500/40 text-blue-600 dark:text-cyan-400',
    rose: 'border-rose-200 hover:border-rose-400 dark:border-rose-500/30 dark:hover:border-rose-500/50 text-rose-600 dark:text-rose-400',
    amber: 'border-amber-200 hover:border-amber-400 dark:border-amber-500/25 dark:hover:border-amber-500/45 text-amber-600 dark:text-amber-400',
    emerald: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-500/25 dark:hover:border-emerald-500/45 text-emerald-600 dark:text-emerald-400',
    blue: 'border-blue-200 hover:border-blue-400 dark:border-blue-500/20 dark:hover:border-blue-500/40 text-blue-600 dark:text-blue-400',
  }[accent];

  return (
    <div
      onClick={onClick}
      className={`stark-panel stark-panel-glow rounded-xl p-4 transition-all duration-200 border bg-white dark:bg-slate-900/60 ${accentBorder} ${
        onClick ? 'cursor-pointer hover:bg-blue-50/50 dark:hover:bg-slate-900/80 shadow-sm hover:shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
        <span className="font-semibold tracking-wide uppercase text-[11px] text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">{unit}</span>}
      </div>

      {(subtext || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {subtext && <span className="truncate">{subtext}</span>}
          {trend && <span className="font-mono text-xs font-semibold text-blue-600 dark:text-cyan-400 ml-auto shrink-0">{trend}</span>}
        </div>
      )}
    </div>
  );
};
