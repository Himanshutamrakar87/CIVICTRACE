import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Merge,
  Filter,
  Search,
  Download,
  Building,
  Star,
  ExternalLink,
  Shield,
  FileCheck,
} from 'lucide-react';
import { CivicReport, DepartmentStats, IncidentCluster } from '../../types/civic';
import { StatusLabel, SeverityBadge } from '../common/StarkBadge';
import { api } from '../../services/api';
import { starkSound } from '../../services/sound';

interface AdminCommandCenterProps {
  reports: CivicReport[];
  departments: DepartmentStats[];
  clusters: IncidentCluster[];
  onSelectReport: (reportId: string) => void;
  onReportsUpdated: () => void;
}

export const AdminCommandCenter: React.FC<AdminCommandCenterProps> = ({
  reports,
  departments,
  clusters,
  onSelectReport,
  onReportsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'duplicates' | 'departments' | 'feedback'>('all');
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isMerging, setIsMerging] = useState(false);

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.location.address.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || r.category === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Suspected or confirmed duplicates
  const duplicateCandidates = reports.filter(
    (r) => (r.aiAnalysis?.isDuplicateSuspected && !r.isDuplicate) || r.duplicateReportIds?.length
  );

  // Resolved reports with citizen feedback
  const feedbackReports = reports.filter(
    (r) => r.status === 'Resolved' && r.resolution?.citizenFeedback
  );

  // Export CSV function
  const handleExportCSV = () => {
    starkSound.playClick();
    const headers = [
      'Report ID',
      'Title',
      'Category',
      'Severity',
      'Status',
      'Ward / Area',
      'Address',
      'Reported By',
      'Date Logged',
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
    link.setAttribute('download', `CIVICTRACE_Satna_Municipal_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    starkSound.playSuccess();
  };

  const handleMergeCluster = async (cluster: IncidentCluster) => {
    if (!cluster.reportIds || cluster.reportIds.length < 2) return;
    setIsMerging(true);
    starkSound.playScan();
    try {
      const primaryId = cluster.primaryReportId;
      const duplicates = cluster.reportIds.filter((id) => id !== primaryId);
      await api.mergeReports({
        primaryReportId: primaryId,
        duplicateReportIds: duplicates,
        mergeReason: `S.T.A.R.K. Multi-Sensor Duplicate Detection Cluster: ${cluster.name} (${cluster.reasoning})`,
      });
      starkSound.playSuccess();
      onReportsUpdated();
      alert(`Successfully merged ${duplicates.length} duplicate incident(s) into Master Docket [${primaryId}].`);
    } catch (err: any) {
      alert(`Error merging cluster: ${err.message}`);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-blue-100 dark:border-cyan-900/30">
        <div>
          <h2 className="text-xl font-bold font-tech tracking-wide text-slate-900 dark:text-slate-100 uppercase flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            Administrator Command Center & Governance Workbench
          </h2>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            Department dispatch, spatial-semantic duplicate merger, and municipal accountability audits
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/40 text-blue-600 dark:text-cyan-300 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono overflow-x-auto">
        <button
          onClick={() => {
            starkSound.playClick();
            setActiveTab('all');
          }}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
            activeTab === 'all'
              ? 'bg-white dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          All Complaints ({reports.length})
        </button>

        <button
          onClick={() => {
            starkSound.playClick();
            setActiveTab('duplicates');
          }}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 font-medium ${
            activeTab === 'duplicates'
              ? 'bg-white dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <Merge className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Duplicate Detection Matrix ({clusters.length})</span>
        </button>

        <button
          onClick={() => {
            starkSound.playClick();
            setActiveTab('departments');
          }}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
            activeTab === 'departments'
              ? 'bg-white dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Department Performance ({departments.length})
        </button>

        <button
          onClick={() => {
            starkSound.playClick();
            setActiveTab('feedback');
          }}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
            activeTab === 'feedback'
              ? 'bg-white dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Citizen Verification Audit ({feedbackReports.length})
        </button>
      </div>

      {/* TAB 1: ALL COMPLAINTS TABLE */}
      {activeTab === 'all' && (
        <div className="stark-panel rounded-2xl p-5 border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by ID, keywords, address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Road Maintenance">Road Maintenance</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Water Department">Water Department</option>
              <option value="Electricity">Electricity</option>
              <option value="Drainage">Drainage</option>
              <option value="Public Infrastructure">Public Infrastructure</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Report ID</th>
                  <th className="py-2.5 px-3">Title & Location</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-blue-50/50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group"
                    onClick={() => {
                      starkSound.playClick();
                      onSelectReport(report.id);
                    }}
                  >
                    <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-cyan-400 whitespace-nowrap">
                      {report.id}
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="font-semibold text-slate-900 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                        {report.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {report.location.area} · {report.location.address}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-medium">{report.category}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <SeverityBadge severity={report.severity} />
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusLabel status={report.status} />
                    </td>
                    <td className="py-2.5 px-3 font-bold tabular-nums text-slate-900 dark:text-slate-200 whitespace-nowrap">
                      {report.priorityScore}/100
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-blue-600 dark:text-cyan-400 group-hover:border-blue-400 font-semibold shadow-xs">
                        Inspect Docket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DUPLICATE DETECTION MATRIX */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 text-xs font-mono space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold uppercase">
              <Merge className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>S.T.A.R.K. SPATIAL-SEMANTIC DUPLICATE DETECTION WORKBENCH</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-xs">
              Autonomous algorithms correlate GPS coordinates (&lt; 350m proximity), category alignment, photo features, and natural language descriptions to group duplicate citizen complaints. Merging links duplicate tickets to a primary master docket while combining citizen upvotes and public impact weighting.
            </p>
          </div>

          {clusters.map((cluster) => (
            <div key={cluster.id} className="stark-panel rounded-2xl p-6 border border-amber-200 dark:border-amber-500/30 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400 uppercase">
                      {cluster.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 font-bold">
                      Impact: {cluster.combinedPublicImpact}/10
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Spatial Radius: {cluster.radiusMeters}m · Category: {cluster.category}
                  </p>
                </div>

                <button
                  onClick={() => handleMergeCluster(cluster)}
                  disabled={isMerging}
                  className="px-4 py-2 text-xs font-mono font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Merge className="w-3.5 h-3.5" />
                  <span>Execute Merge to Master Docket [{cluster.primaryReportId}]</span>
                </button>
              </div>

              {/* Rationale */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                <span className="text-amber-800 dark:text-amber-400 font-bold block mb-0.5">AI Correlation Rationale:</span>
                {cluster.reasoning}
              </div>

              {/* Clustered Incident Rows */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                  Flagged Incident Reports in Cluster ({cluster.reportIds.length}):
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {cluster.reportIds.map((repId) => {
                    const r = reports.find((item) => item.id === repId);
                    if (!r) return null;
                    const isPrimary = repId === cluster.primaryReportId;
                    return (
                      <div
                        key={repId}
                        onClick={() => {
                          starkSound.playClick();
                          onSelectReport(repId);
                        }}
                        className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                          isPrimary
                            ? 'bg-blue-50/70 border-blue-300 dark:bg-cyan-950/20 dark:border-cyan-500/50'
                            : 'bg-white border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className={isPrimary ? 'text-blue-700 dark:text-cyan-400 font-bold' : 'text-slate-700 dark:text-slate-300 font-semibold'}>
                            {repId} {isPrimary ? '(Master)' : ''}
                          </span>
                          <StatusLabel status={r.status} />
                        </div>
                        <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-200 line-clamp-2 mb-1">
                          {r.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 truncate">
                          by {r.reportedBy.name} ({r.location.address})
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: DEPARTMENT PERFORMANCE */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.name} className="stark-panel rounded-2xl p-5 border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{dept.name}</h4>
                  <p className="text-xs font-mono text-blue-600 dark:text-cyan-400 font-semibold mt-0.5">Head: {dept.headOfficer}</p>
                </div>
                <Building className="w-5 h-5 text-blue-600/70 dark:text-cyan-500/60" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Active Backlog</span>
                  <span className="text-lg font-bold text-amber-700 dark:text-amber-400 tabular-nums">{dept.activeCases}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Resolved to Date</span>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{dept.resolvedCases}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Avg Response</span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200 tabular-nums">{dept.avgResolutionHours} hrs</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Satisfaction</span>
                  <span className="text-base font-bold text-blue-600 dark:text-cyan-300 tabular-nums">{dept.satisfactionRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CITIZEN VERIFICATION AUDIT */}
      {activeTab === 'feedback' && (
        <div className="stark-panel rounded-2xl p-5 border border-emerald-200 dark:border-emerald-500/20 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase pb-2 border-b border-slate-100 dark:border-slate-800">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>CITIZEN RESOLUTION CONFIRMATION LOGS</span>
          </div>

          <div className="space-y-3">
            {feedbackReports.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  starkSound.playClick();
                  onSelectReport(r.id);
                }}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition-colors cursor-pointer space-y-2 text-xs font-mono shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-cyan-400 font-bold">{r.id}</span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-slate-900 dark:text-slate-200 font-sans font-semibold">{r.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(r.resolution?.citizenSatisfactionRating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 italic font-sans text-xs bg-white dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80">
                  "{r.resolution?.citizenFeedback}"
                </p>

                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Verified by {r.reportedBy.name}</span>
                  <span>{r.resolution?.citizenVerificationDate ? new Date(r.resolution.citizenVerificationDate).toLocaleDateString() : 'Verified'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
