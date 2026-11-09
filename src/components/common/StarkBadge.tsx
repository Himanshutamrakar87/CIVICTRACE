import React from 'react';
import { IssueStatus, SeverityLevel } from '../../types/civic';

interface StatusLabelProps {
  status: IssueStatus;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {
  let colorClass = 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';

  switch (status) {
    case 'Submitted':
      colorClass = 'text-slate-300 border-slate-700 bg-slate-900/60';
      break;
    case 'Under Review':
      colorClass = 'text-amber-400 border-amber-500/30 bg-amber-950/40';
      break;
    case 'Verified':
      colorClass = 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';
      break;
    case 'Assigned':
      colorClass = 'text-blue-400 border-blue-500/30 bg-blue-950/40';
      break;
    case 'In Progress':
      colorClass = 'text-indigo-300 border-indigo-500/30 bg-indigo-950/40';
      break;
    case 'Resolved':
      colorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
      break;
    case 'Reopened':
      colorClass = 'text-rose-400 border-rose-500/30 bg-rose-950/40';
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
  let style = 'text-slate-400 border-slate-800 bg-slate-900/40';

  switch (severity) {
    case 'CRITICAL':
      style = 'text-rose-400 border-rose-500/40 bg-rose-950/50 shadow-[0_0_12px_rgba(244,63,94,0.2)] font-semibold';
      break;
    case 'HIGH':
      style = 'text-amber-400 border-amber-500/30 bg-amber-950/40';
      break;
    case 'MEDIUM':
      style = 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';
      break;
    case 'LOW':
      style = 'text-slate-400 border-slate-800 bg-slate-900/40';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono rounded border ${style}`}>
      {severity}
    </span>
  );
};
