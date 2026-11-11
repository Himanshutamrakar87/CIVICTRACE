import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  ExternalLink,
  MapPin,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import { CivicReport, DashboardStats, IssueCategory, IssueStatus } from '../../types/civic';
import { StatCard } from '../common/StatCard';
import { StatusLabel, SeverityBadge } from '../common/StarkBadge';
import { starkSound } from '../../services/sound';

interface OverviewDashboardProps {
  stats: DashboardStats;
  reports: CivicReport[];
  onSelectReport: (reportId: string) => void;
  onOpenReportForm: () => void;
  onOpenMap: () => void;
  onStartSimulation: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  stats,
  reports,
  onSelectReport,
  onOpenReportForm,
  onOpenMap,
  onStartSimulation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const categories: IssueCategory[] = [
    'Road Maintenance',
    'Sanitation',
    'Water Department',
    'Electricity',
    'Drainage',
    'Public Infrastructure',
  ];

  // Filtered reports for the feed
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  // Critical urgent issues
  const criticalReports = reports.filter(
    (r) => r.severity === 'CRITICAL' && r.status !== 'Resolved'
  );

  // Category counts
  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: reports.filter((r) => r.category === cat).length,
    active: reports.filter((r) => r.category === cat && r.status !== 'Resolved').length,
  }));

  // Area counts
  const areaCounts = ['Birla Road', 'Civil Lines', 'Station Road', 'Dhawari', 'Bharhut Nagar'].map(
    (area) => ({
      name: area,
      count: reports.filter((r) => r.location.area === area).length,
    })
  );

  // Recent timeline events aggregated
  const allEvents = reports
    .flatMap((r) =>
      r.timeline.map((e) => ({
        ...e,
        reportId: r.id,
        reportTitle: r.title,
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 7);

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-blue-100 dark:border-cyan-900/30">
        <div>
          <h2 className="text-xl font-bold font-tech tracking-wide text-slate-900 dark:text-slate-100 uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse shadow-sm" />
            Civic Intelligence Command Center — Satna Node
          </h2>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time urban telemetry, autonomous incident triage & citizen verification
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              starkSound.playClick();
              onOpenMap();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 text-slate-700 dark:text-cyan-300 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>Map View</span>
          </button>

          <button
            onClick={() => {
              starkSound.playClick();
              onOpenReportForm();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white dark:bg-cyan-500/20 dark:border dark:border-cyan-400/50 dark:text-cyan-300 transition-all shadow-sm"
          >
            <span>+ Report Incident</span>
          </button>
        </div>
      </div>

      {/* Critical Emergency Banner if exists */}
      {criticalReports.length > 0 && (
        <div className="stark-crimson-panel rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/50 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  CRITICAL INCIDENT ALERT
                </span>
                <span className="text-[11px] font-mono text-rose-600/90 dark:text-rose-400/80 font-medium">
                  {criticalReports.length} Active Hazard(s) Requiring Priority Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                {criticalReports[0].title} — {criticalReports[0].location.area} ({criticalReports[0].location.address})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                starkSound.playClick();
                onSelectReport(criticalReports[0].id);
              }}
              className="px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500/20 dark:border dark:border-rose-400/60 dark:text-rose-200 transition-all shadow-xs"
            >
              Inspect Docket
            </button>
          </div>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          label="Total Reports"
          value={stats.totalReports}
          accent="blue"
          subtext="Official ledger"
        />
        <StatCard
          label="Active Issues"
          value={stats.activeIssues}
          accent="cyan"
          subtext="Under workflow"
        />
        <StatCard
          label="Critical Severity"
          value={stats.criticalIssues}
          accent="rose"
          subtext="Immediate action"
        />
        <StatCard
          label="Resolved Cases"
          value={stats.resolvedIssues}
          accent="emerald"
          subtext="Closed to date"
        />
        <StatCard
          label="Resolution Rate"
          value={stats.resolutionRatePercent}
          unit="%"
          accent="emerald"
          trend="+4.2% wk"
        />
        <StatCard
          label="Avg Resolution"
          value={stats.averageResolutionTimeHours}
          unit="hrs"
          accent="amber"
          subtext="S.T.A.R.K. benchmark"
        />
      </div>

      {/* Main Grid: Left 2/3 Content, Right 1/3 Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Incident Feed & Filters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="stark-panel rounded-xl p-5 border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900/60 shadow-sm">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by ID, title, road, or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              {/* Status Segmented Controls */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono overflow-x-auto">
                {['ALL', 'Submitted', 'In Progress', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      starkSound.playClick();
                      setSelectedStatus(st);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap font-medium ${
                      selectedStatus === st
                        ? 'bg-white dark:bg-cyan-500/20 text-blue-600 dark:text-cyan-300 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1.5 py-3 overflow-x-auto text-xs font-mono border-b border-slate-100 dark:border-slate-800/60">
              <button
                onClick={() => {
                  starkSound.playClick();
                  setSelectedCategory('ALL');
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === 'ALL'
                    ? 'bg-blue-50 border border-blue-200 text-blue-700 dark:bg-slate-800 dark:text-cyan-300 dark:border-cyan-500/40 font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                All Departments
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    starkSound.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-50 border border-blue-200 text-blue-700 dark:bg-slate-800 dark:text-cyan-300 dark:border-cyan-500/40 font-bold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Incident Records Feed */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-1">
              {filteredReports.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-mono text-xs">
                  No civic reports matching the specified filter criteria.
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => {
                      starkSound.playClick();
                      onSelectReport(report.id);
                    }}
                    className="py-3 px-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold">{report.id}</span>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <StatusLabel status={report.status} />
                        <SeverityBadge severity={report.severity} />
                        {report.isDuplicate && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-amber-300 text-amber-800 bg-amber-50 dark:border-amber-500/40 dark:text-amber-300 dark:bg-amber-950/40 font-medium">
                            Merged Duplicate
                          </span>
                        )}
                        {report.duplicateReportIds && report.duplicateReportIds.length > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-blue-200 text-blue-700 bg-blue-50 dark:border-cyan-500/40 dark:text-cyan-300 dark:bg-cyan-950/40 flex items-center gap-1 font-medium">
                            <Layers className="w-2.5 h-2.5" />
                            {report.duplicateReportIds.length} Linked Reports
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors truncate">
                        {report.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{report.category}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-600 dark:text-cyan-500" />
                          {report.location.area} ({report.location.address})
                        </span>
                        <span>·</span>
                        <span>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      {report.aiAnalysis && (
                        <div className="text-right hidden sm:block">
                          <div className="text-[10px] font-mono text-slate-400">Urgency Score</div>
                          <div className="text-sm font-mono font-bold text-blue-600 dark:text-cyan-300">
                            {report.aiAnalysis.urgencyScore}/10
                          </div>
                        </div>
                      )}
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 group-hover:text-blue-600 group-hover:border-blue-300 dark:group-hover:text-cyan-300 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Category Distribution & Live Activity Stream */}
        <div className="space-y-4">
          {/* Category Distribution Card */}
          <div className="stark-panel rounded-xl p-5 border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900/60 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono font-bold tracking-wide text-blue-700 dark:text-cyan-400 uppercase">
                DEPARTMENT WORKLOAD ALLOCATION
              </span>
              <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            </div>

            <div className="space-y-3 text-xs font-mono">
              {categoryCounts.map((cat) => {
                const total = reports.length || 1;
                const percent = Math.round((cat.count / total) * 100);
                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-800 dark:text-slate-300 truncate font-medium">{cat.name}</span>
                      <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                        {cat.count} total ({cat.active} active)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Area Density Card */}
          <div className="stark-panel rounded-xl p-5 border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900/60 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono font-bold tracking-wide text-blue-700 dark:text-cyan-400 uppercase">
                SATNA WARD CONCENTRATION
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              {areaCounts.map((area) => (
                <div key={area.name} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-900/60">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{area.name}</span>
                  <span className="text-blue-600 dark:text-cyan-400 font-bold tabular-nums">{area.count} incidents</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline Stream */}
          <div className="stark-panel rounded-xl p-5 border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900/60 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono font-bold tracking-wide text-blue-700 dark:text-cyan-400 uppercase">
                GLOBAL ACTIVITY AUDIT LOG
              </span>
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            </div>

            <div className="space-y-3 text-xs font-mono">
              {allEvents.map((evt) => (
                <div key={evt.id} className="relative pl-3 border-l-2 border-blue-500 dark:border-cyan-500/30 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-blue-600 dark:text-cyan-400 font-bold">{evt.actorName}</span>
                    <span>{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">{evt.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
