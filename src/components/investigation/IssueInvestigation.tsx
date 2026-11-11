import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  ThumbsUp,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  Upload,
  User,
  Building,
  Check,
  X,
  Star,
} from 'lucide-react';
import { CivicReport, IncidentCluster, IssueStatus, IssueCategory, SeverityLevel } from '../../types/civic';
import { StatusLabel, SeverityBadge } from '../common/StarkBadge';
import { api } from '../../services/api';
import { ASSET_PATHS } from '../../data/initialData';
import { starkSound } from '../../services/sound';

interface IssueInvestigationProps {
  report: CivicReport;
  cluster?: IncidentCluster;
  relatedReports?: CivicReport[];
  userRole: 'Citizen' | 'Admin';
  onBack: () => void;
  onReportUpdated: (updated: CivicReport) => void;
  onSelectReport: (reportId: string) => void;
}

export const IssueInvestigation: React.FC<IssueInvestigationProps> = ({
  report,
  cluster,
  relatedReports = [],
  userRole,
  onBack,
  onReportUpdated,
  onSelectReport,
}) => {
  // Admin Update States
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>(report.status);
  const [assignedDepartment, setAssignedDepartment] = useState(
    report.assignedDepartment || 'Road Maintenance & Highway Infrastructure'
  );
  const [assignedOfficer, setAssignedOfficer] = useState(report.assignedOfficer || 'Eng. Rajesh Verma');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Admin Resolution States
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [afterImageUrl, setAfterImageUrl] = useState<string>(ASSET_PATHS.resolutionRepaired);

  // Citizen Verification States
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [citizenRating, setCitizenRating] = useState(5);
  const [citizenFeedback, setCitizenFeedback] = useState('Road restored smoothly, inspection passed.');

  // Upvotes
  const [upvotes, setUpvotes] = useState(report.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes(upvotes + 1);
      setHasUpvoted(true);
      starkSound.playClick();
    }
  };

  const handleAdminStatusUpdate = async () => {
    setIsUpdating(true);
    starkSound.playClick();
    try {
      const updated = await api.updateStatus(report.id, {
        status: selectedStatus,
        assignedDepartment,
        assignedOfficer,
        adminNotes: adminNotes || `Admin updated status to ${selectedStatus}`,
      });
      onReportUpdated(updated);
      setAdminNotes('');
      starkSound.playSuccess();
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAdminResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    starkSound.playClick();
    try {
      const updated = await api.resolveReport(report.id, {
        resolutionNotes,
        afterImageUrl,
        resolvedBy: assignedOfficer || 'Municipal Maintenance Division',
      });
      onReportUpdated(updated);
      setShowResolveModal(false);
      starkSound.playSuccess();
    } catch (err: any) {
      alert(`Error resolving report: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCitizenConfirm = async () => {
    starkSound.playSuccess();
    try {
      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#10b981'],
      });

      const updated = await api.verifyResolution(report.id, {
        confirmed: true,
        feedback: citizenFeedback,
        rating: citizenRating,
        citizenName: 'Aarav Sharma (Verified Citizen)',
      });
      onReportUpdated(updated);
    } catch (err: any) {
      alert(`Error verifying resolution: ${err.message}`);
    }
  };

  const handleCitizenDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;
    starkSound.playAlert();
    try {
      const updated = await api.verifyResolution(report.id, {
        confirmed: false,
        disputeReason,
        citizenName: 'Aarav Sharma (Verified Citizen)',
      });
      onReportUpdated(updated);
      setShowDisputeModal(false);
      setDisputeReason('');
    } catch (err: any) {
      alert(`Error recording dispute: ${err.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Nav Back */}
      <div className="flex items-center justify-between pb-3 border-b border-blue-100 dark:border-cyan-900/30">
        <button
          onClick={() => {
            starkSound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleUpvote}
            disabled={hasUpvoted}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors shadow-xs ${
              hasUpvoted
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold dark:bg-cyan-950/60 dark:border-cyan-500/40 dark:text-cyan-300'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Support / Confirm ({upvotes})</span>
          </button>
        </div>
      </div>

      {/* Main Investigation Header */}
      <div className="stark-panel rounded-2xl p-6 border border-slate-200 dark:border-cyan-500/30 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-base font-bold font-mono text-blue-600 dark:text-cyan-300 tracking-wider">
              {report.id}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <StatusLabel status={report.status} />
            <SeverityBadge severity={report.severity} />
            {report.isDuplicate && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg border border-amber-300 text-amber-800 bg-amber-50 dark:border-amber-500/40 dark:text-amber-300 dark:bg-amber-950/40 font-semibold">
                Merged Duplicate Docket
              </span>
            )}
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Reported on {new Date(report.createdAt).toLocaleString()}
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 font-tech">
          {report.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300 font-medium">
            <Building className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            {report.category}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            {report.location.area} ({report.location.address})
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300 font-medium">
            <User className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            {report.reportedBy.name}
          </span>
        </div>
      </div>

      {/* Resolution Verification Banner (Citizen Accountability) */}
      {report.status === 'Resolved' && report.resolution && (
        <div className="stark-panel rounded-2xl p-6 border border-emerald-200 dark:border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/15 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200 dark:border-emerald-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-400 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-mono text-emerald-800 dark:text-emerald-300 uppercase">
                  MUNICIPAL REPAIR COMPLETED — CITIZEN AUDIT REQUIRED
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Resolved by {report.resolution.resolvedBy} on{' '}
                  {report.resolution.resolvedAt ? new Date(report.resolution.resolvedAt).toLocaleDateString() : 'Today'}
                </p>
              </div>
            </div>

            {report.resolution.citizenVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-400 text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold">
                <Check className="w-3.5 h-3.5" />
                Citizen Verified & Closed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-400 text-xs font-mono text-amber-800 dark:text-amber-300 font-bold">
                Awaiting Citizen On-Site Confirmation
              </span>
            )}
          </div>

          {/* Before & After Comparison Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold">Before Photo (Initial Hazard)</span>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-xs">
                {report.imageUrl ? (
                  <img
                    src={report.imageUrl}
                    alt="Before Repair"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs">No image</div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 uppercase font-bold">
                After Photo (Official Municipal Restoration)
              </span>
              <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-emerald-400 dark:border-emerald-500/40 bg-slate-100 dark:bg-slate-950 shadow-xs">
                {report.resolution.afterImageUrl ? (
                  <img
                    src={report.resolution.afterImageUrl}
                    alt="After Repair"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs">No after photo</div>
                )}
              </div>
            </div>
          </div>

          {/* Engineer Notes */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-emerald-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-300 space-y-1 shadow-xs">
            <div className="text-emerald-800 dark:text-slate-400 font-bold">Engineer Resolution Notes:</div>
            <p>{report.resolution.resolutionNotes}</p>
          </div>

          {/* Citizen Verification Action Buttons */}
          {!report.resolution.citizenVerified && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-200 dark:border-emerald-500/20">
              <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Have you inspected this repaired site? Confirm resolution or raise a dispute if defects remain.
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowDisputeModal(true)}
                  className="px-4 py-2 text-xs font-mono font-bold rounded-lg bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-300 transition-colors shadow-xs"
                >
                  Dispute & Reopen Case
                </button>

                <button
                  onClick={handleCitizenConfirm}
                  className="px-5 py-2 text-xs font-mono font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:text-slate-950 transition-all shadow-sm"
                >
                  Confirm Resolution
                </button>
              </div>
            </div>
          )}

          {/* Verified Feedback if already completed */}
          {report.resolution.citizenVerified && (
            <div className="p-3.5 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-xs font-mono text-emerald-900 dark:text-emerald-300 flex items-center justify-between shadow-xs">
              <div>
                <span className="font-bold">Citizen Feedback:</span> "{report.resolution.citizenFeedback}"
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(report.resolution.citizenSatisfactionRating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disputed Reopened Alert Banner if applicable */}
      {report.status === 'Reopened' && report.resolution?.isDisputed && (
        <div className="stark-crimson-panel rounded-xl p-4 border border-rose-300 dark:border-rose-500/50 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-mono text-xs font-bold uppercase">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>CITIZEN DISPUTE ACTIVE — PRIORITY ESCALATED</span>
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-200">
            Citizen Dispute Statement: "{report.resolution.disputeReason}"
          </p>
          <div className="text-[11px] font-mono text-rose-700 dark:text-rose-400 font-semibold">
            Case has been reopened with priority score raised to {report.priorityScore}/100.
          </div>
        </div>
      )}

      {/* 2-Column Split: Details & AI Intel Left, Admin Actions & Timeline Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evidence & AI Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos & Description */}
          <div className="stark-panel rounded-2xl p-5 border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-wider">
              INCIDENT EVIDENCE & PHYSICAL SPECIFICATION
            </h3>

            {/* Photo */}
            {report.imageUrl && report.status !== 'Resolved' && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-xs">
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-950/80 backdrop-blur border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-blue-700 dark:text-cyan-400 font-medium">
                  SATNA GPS: {report.location.latitude}°N, {report.location.longitude}°E
                </div>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <span className="font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold">Description:</span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans text-sm bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                {report.description}
              </p>
            </div>
          </div>

          {/* S.T.A.R.K. AI Civic Analysis Dossier */}
          {report.aiAnalysis && (
            <div className="stark-panel rounded-2xl p-5 border border-blue-200 dark:border-cyan-500/30 bg-blue-50/40 dark:bg-cyan-950/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-blue-800 dark:text-cyan-300 uppercase">
                    S.T.A.R.K. AI INTELLIGENCE EVALUATION
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  Model: {report.aiAnalysis.modelUsed}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Urgency Score</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-cyan-300">{report.aiAnalysis.urgencyScore}/10</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Public Impact</span>
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{report.aiAnalysis.publicImpactScore}/10</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">AI Category Match</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{report.aiAnalysis.categoryConfidence}%</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Est. Repair Time</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{report.aiAnalysis.estimatedFixHours} hrs</span>
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1 shadow-xs">
                <span className="text-blue-700 dark:text-cyan-400 font-bold block">Analytical Assessment:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{report.aiAnalysis.reasoning}</p>
              </div>

              {/* Safety Risks */}
              {report.aiAnalysis.safetyHazardRisks.length > 0 && (
                <div className="space-y-1.5 text-xs font-mono pt-1">
                  <span className="text-rose-700 dark:text-rose-400 font-bold uppercase text-[11px]">
                    Identified Public Safety Threats:
                  </span>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5">
                    {report.aiAnalysis.safetyHazardRisks.map((hazard, i) => (
                      <li key={i}>{hazard}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Related / Duplicate Reports Cluster */}
          {relatedReports.length > 0 && (
            <div className="stark-panel rounded-2xl p-5 border border-amber-200 dark:border-amber-500/30 bg-amber-50/40 dark:bg-transparent shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-amber-500/20">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-800 dark:text-amber-300 font-bold uppercase">
                  <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>CONCURRENT INCIDENT CLUSTER ({relatedReports.length} Reports)</span>
                </div>
                {cluster && (
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    Radius: {cluster.radiusMeters}m · Combined Impact: {cluster.combinedPublicImpact}/10
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {relatedReports.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      starkSound.playClick();
                      onSelectReport(rel.id);
                    }}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-between text-xs font-mono shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 dark:text-cyan-400 font-bold">{rel.id}</span>
                        <StatusLabel status={rel.status} />
                        <span className="text-slate-500 text-[11px]">by {rel.reportedBy.name}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-300 truncate max-w-md mt-0.5 font-sans font-medium">{rel.title}</p>
                    </div>

                    <button className="text-[11px] text-blue-600 dark:text-cyan-400 font-semibold underline">View</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Admin Actions & Activity Timeline */}
        <div className="space-y-6">
          {/* Administrator Command Actions Dock */}
          {userRole === 'Admin' && (
            <div className="stark-panel rounded-2xl p-5 border border-slate-200 dark:border-cyan-500/30 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-700 dark:text-cyan-400 uppercase pb-2 border-b border-slate-100 dark:border-slate-800">
                <Shield className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>ADMINISTRATIVE TRIAGE DOCK</span>
              </div>

              {/* Status Update */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold">Workflow Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as IssueStatus)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Verified">Verified</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Reopened">Reopened</option>
                </select>
              </div>

              {/* Department Assignment */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold">Assign Municipal Department</label>
                <select
                  value={assignedDepartment}
                  onChange={(e) => setAssignedDepartment(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Road Maintenance & Highway Infrastructure">Road Maintenance & Highway</option>
                  <option value="Sanitation & Solid Waste Management">Sanitation & Solid Waste</option>
                  <option value="Municipal Water Works & Supply">Municipal Water Works</option>
                  <option value="City Power Grid & Street Lighting">Power Grid & Street Lighting</option>
                  <option value="Storm Drainage & Sewage Control">Drainage & Sewage Control</option>
                  <option value="Public Infrastructure & Parks">Public Infrastructure</option>
                </select>
              </div>

              {/* Assigned Officer */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold">Assigned Inspection Officer</label>
                <input
                  type="text"
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Admin Log Note */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold">Investigation Note</label>
                <textarea
                  rows={2}
                  placeholder="Add inspection notes or contractor instructions..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAdminStatusUpdate}
                  disabled={isUpdating}
                  className="flex-1 py-2 text-xs font-mono font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white dark:bg-cyan-500/20 dark:border dark:border-cyan-400/50 dark:text-cyan-300 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Update Docket</span>
                </button>

                {report.status !== 'Resolved' && (
                  <button
                    onClick={() => setShowResolveModal(true)}
                    className="px-3.5 py-2 text-xs font-mono font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500/20 dark:border dark:border-emerald-400/50 dark:text-emerald-300 transition-all shadow-xs"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Activity Timeline Audit */}
          <div className="stark-panel rounded-2xl p-5 border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-wider">
                IMMUTABLE AUDIT TIMELINE
              </span>
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            </div>

            <div className="space-y-3.5">
              {report.timeline.map((evt, idx) => (
                <div key={evt.id || idx} className="relative pl-4 border-l-2 border-blue-500 dark:border-cyan-500/30 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{evt.actorName}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusLabel status={evt.status} />
                    <span className="text-[10px] font-mono text-blue-600 dark:text-cyan-500/80 font-medium">({evt.actorRole})</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 pt-0.5 leading-snug">{evt.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="stark-panel rounded-2xl p-6 max-w-lg w-full border border-emerald-300 dark:border-emerald-500/50 bg-white dark:bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold font-mono text-emerald-800 dark:text-emerald-400 uppercase">
                COMPLETE RESOLUTION & UPLOAD EVIDENCE
              </h3>
              <button
                onClick={() => setShowResolveModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdminResolve} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Resolution Work Specification <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the materials used, contractor team, and restoration confirmation..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Restoration After-Photo Evidence
                </label>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                  <img
                    src={afterImageUrl}
                    alt="Restoration Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAfterImageUrl(ASSET_PATHS.resolutionRepaired)}
                    className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    Preset: Repaired Asphalt Pavement
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 text-xs font-mono font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Submit Official Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Citizen Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="stark-crimson-panel rounded-2xl p-6 max-w-md w-full border border-rose-300 dark:border-rose-500/60 bg-white dark:bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rose-200 dark:border-rose-500/30">
              <h3 className="text-sm font-bold font-mono text-rose-700 dark:text-rose-300 uppercase">
                DISPUTE CIVIC RESOLUTION
              </h3>
              <button
                onClick={() => setShowDisputeModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCitizenDispute} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                If the infrastructure defect was not repaired to standard (e.g. temporary patch washed out, trash not cleared, leak recurring), state the issue below. This will reopen the docket immediately.
              </p>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Reason for Dispute <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Pothole was merely filled with loose soil without asphalt compaction, creating mud hazards in rain..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-rose-200 dark:border-rose-500/20">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="px-4 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                >
                  Reopen Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
