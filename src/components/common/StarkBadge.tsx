import React from 'react';
import { IssueStatus, SeverityLevel } from '../../types/civic';

interface StatusLabelProps {
  status: IssueStatus;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {
  let colorClass = 'text-blue-700 border-blue-200 bg-blue-50 dark:text-cyan-400 dark:border-cyan-500/30 dark:bg-cyan-950/40';

  switch (status) {
    case 'Submitted':
      colorClass = 'text-slate-700 border-slate-200 bg-slate-100 dark:text-slate-300 dark:border-slate-700 dark:bg-slate-900/60';
      break;
    case 'Under Review':
      colorClass = 'text-amber-800 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-500/30 dark:bg-amber-950/40';
      break;
    case 'Verified':
      colorClass = 'text-blue-700 border-blue-200 bg-blue-50 dark:text-cyan-400 dark:border-cyan-500/30 dark:bg-cyan-950/40';
      break;
    case 'Assigned':
      colorClass = 'text-indigo-700 border-indigo-200 bg-indigo-50 dark:text-blue-400 dark:border-blue-500/30 dark:bg-blue-950/40';
      break;
    case 'In Progress':
      colorClass = 'text-sky-700 border-sky-200 bg-sky-50 dark:text-indigo-300 dark:border-indigo-500/30 dark:bg-indigo-950/40';
      break;
    case 'Resolved':
      colorClass = 'text-emerald-700 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/30 dark:bg-emerald-950/40';
      break;
    case 'Reopened':
      colorClass = 'text-rose-700 border-rose-200 bg-rose-50 dark:text-rose-400 dark:border-rose-500/30 dark:bg-rose-950/40';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium rounded border ${colorClass} tracking-wide`}>
      {status}
    </span>
  );
};

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  let style = 'text-slate-600 border-slate-200 bg-slate-100 dark:text-slate-400 dark:border-slate-800 dark:bg-slate-900/40';

  switch (severity) {
    case 'CRITICAL':
      style = 'text-rose-700 border-rose-200 bg-rose-50 shadow-sm font-semibold dark:text-rose-400 dark:border-rose-500/40 dark:bg-rose-950/50';
      break;
    case 'HIGH':
      style = 'text-amber-800 border-amber-200 bg-amber-50 font-semibold dark:text-amber-400 dark:border-amber-500/30 dark:bg-amber-950/40';
      break;
    case 'MEDIUM':
      style = 'text-blue-700 border-blue-200 bg-blue-50 font-medium dark:text-cyan-400 dark:border-cyan-500/30 dark:bg-cyan-950/40';
      break;
    case 'LOW':
      style = 'text-slate-600 border-slate-200 bg-slate-100 dark:text-slate-400 dark:border-slate-800 dark:bg-slate-900/40';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono rounded border ${style}`}>
      {severity}
    </span>
  );
};
