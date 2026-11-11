import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Building,
  FileText,
  X,
} from 'lucide-react';
import { CivicReport, DepartmentStats, DashboardStats } from '../../types/civic';
import { StatCard } from '../common/StatCard';
import { starkSound } from '../../services/sound';

interface AnalyticsReportsProps {
  reports: CivicReport[];
  departments: DepartmentStats[];
  stats: DashboardStats;
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({
  reports,
  departments,
  stats,
}) => {
  const [showPrintReport, setShowPrintReport] = useState(false);

  // Category counts
  const categories = [
    'Road Maintenance',
    'Sanitation',
    'Water Department',
    'Electricity',
    'Drainage',
    'Public Infrastructure',
  ];

  const categoryBreakdown = categories.map((cat) => {
    const total = reports.filter((r) => r.category === cat).length;
    const resolved = reports.filter((r) => r.category === cat && r.status === 'Resolved').length;
    return {
      name: cat,
      total,
      resolved,
      active: total - resolved,
      rate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    };
  });

  // Area distribution
  const areas = ['Birla Road', 'Civil Lines', 'Station Road', 'Dhawari', 'Bharhut Nagar'];
  const areaBreakdown = areas.map((area) => ({
    name: area,
    count: reports.filter((r) => r.location.area === area).length,
    critical: reports.filter((r) => r.location.area === area && r.severity === 'CRITICAL').length,
  }));

  // CSV Export
  const handleExportCSV = () => {
    starkSound.playClick();
    const headers = [
      'Incident ID',
      'Title',
      'Category',
      'Severity',
      'Status',
      'Ward Area',
      'Full Address',
      'Reported Date',
      'Priority Score',
      'Assigned Department',
      'Citizen Verified',
    ];

    const rows = reports.map((r) => [
      `"${r.id}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${r.severity}"`,
      `"${r.status}"`,
      `"${r.location.area}"`,
      `"${r.location.address.replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toISOString()}"`,
      r.priorityScore,
      `"${r.assignedDepartment || 'Unassigned'}"`,
      r.resolution?.citizenVerified ? 'Yes' : 'No',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `S.T.A.R.K._Satna_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    starkSound.playSuccess();
  };

  const handleTriggerPrint = () => {
    starkSound.playClick();
    setShowPrintReport(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-blue-100 dark:border-cyan-900/30">
        <div>
          <h2 className="text-xl font-bold font-tech tracking-wide text-slate-900 dark:text-slate-100 uppercase flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            Civic Intelligence Analytics & Accountability Reports
          </h2>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            Operational KPIs, department velocity, geographic risk concentrations, and official audits
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handleTriggerPrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white dark:bg-cyan-500/20 dark:border dark:border-cyan-400/50 dark:text-cyan-300 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <StatCard
          label="Resolution Velocity"
          value={stats.averageResolutionTimeHours}
          unit="hrs"
          accent="blue"
          subtext="Mean Time to Repair (MTTR)"
        />
        <StatCard
          label="Citizen Verification"
          value={stats.resolutionRatePercent}
          unit="%"
          accent="emerald"
          subtext="Verified closed without dispute"
        />
        <StatCard
          label="Duplicate Elimination"
          value={stats.duplicateClustersCount * 3}
          unit="tickets"
          accent="cyan"
          subtext="Redundant crew dispatches avoided"
        />
        <StatCard
          label="Critical Hazard Load"
          value={stats.criticalIssues}
          unit="cases"
          accent="rose"
          subtext="Requiring urgent intervention"
        />
      </div>

      {/* 2-Column Analytic Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance Breakdown */}
        <div className="stark-panel rounded-2xl p-5 border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-mono font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-wider">
              DEPARTMENT CATEGORY RESOLUTION RATE
            </span>
            <Building className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          </div>

          <div className="space-y-3.5 text-xs font-mono">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{cat.name}</span>
                  <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                    {cat.resolved} / {cat.total} resolved ({cat.rate}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${cat.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Ward Incident Concentrations */}
        <div className="stark-panel rounded-2xl p-5 border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-mono font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-wider">
              SATNA WARD INCIDENT CONCENTRATION
            </span>
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          </div>

          <div className="space-y-3 text-xs font-mono">
            {areaBreakdown.map((area) => {
              const maxCount = Math.max(...areaBreakdown.map((a) => a.count), 1);
              const percentage = Math.round((area.count / maxCount) * 100);
              return (
                <div key={area.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{area.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                      {area.count} incidents {area.critical > 0 && <span className="text-rose-600 font-bold">({area.critical} critical)</span>}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        area.critical > 0 ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Official Audit Dossier Modal for Printing */}
      {showPrintReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/40 rounded-2xl p-6 max-w-2xl w-full text-slate-900 dark:text-slate-100 space-y-6 shadow-2xl">
            {/* Header for print */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="text-sm font-mono font-bold text-blue-600 dark:text-cyan-400">
                  CIVICTRACE — EXECUTIVE AUDIT DOSSIER
                </div>
                <h3 className="text-lg font-bold font-tech text-slate-900 dark:text-slate-100">
                  SATNA MUNICIPAL CIVIC INTELLIGENCE REPORT
                </h3>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Generated: {new Date().toLocaleDateString()} · S.T.A.R.K. Open Innovation Initiative
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold hover:bg-blue-700 shadow-xs"
                >
                  Trigger Browser Print
                </button>
                <button
                  onClick={() => setShowPrintReport(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Ingested</span>
                <span className="text-lg font-bold text-blue-700 dark:text-cyan-300">{stats.totalReports}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Active Backlog</span>
                <span className="text-lg font-bold text-amber-700 dark:text-amber-300">{stats.activeIssues}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Verified Closed</span>
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{stats.resolvedIssues}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Resolution Rate</span>
                <span className="text-lg font-bold text-blue-600 dark:text-cyan-400">{stats.resolutionRatePercent}%</span>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="space-y-2 text-xs font-mono">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase block">
                Municipal Department Workload Summary:
              </span>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl p-2 border border-slate-200 dark:border-slate-800">
                {departments.map((d) => (
                  <div key={d.name} className="py-2 flex justify-between text-[11px]">
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{d.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Active: {d.activeCases} · Resolved: {d.resolvedCases} · MTTR: {d.avgResolutionHours}h
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              Official digital record verified under the S.T.A.R.K. Civic Intelligence System for Satna Municipal Corporation.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
