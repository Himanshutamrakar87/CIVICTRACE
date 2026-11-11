import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Layers,
  MapPin,
  Shield,
  ArrowRight,
  Merge,
  Sparkles,
  X,
  Radio,
  FileCheck,
} from 'lucide-react';
import { SIMULATION_REPORTS, ASSET_PATHS, INITIAL_CLUSTERS } from '../../data/initialData';
import { CivicReport } from '../../types/civic';
import { StatusLabel, SeverityBadge } from '../common/StarkBadge';
import { starkSound } from '../../services/sound';

interface EmergencySimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySimulationToSystem: () => void;
  onOpenReportDetail: (reportId: string) => void;
  onOpenMap: () => void;
}

export const EmergencySimulationModal: React.FC<EmergencySimulationModalProps> = ({
  isOpen,
  onClose,
  onApplySimulationToSystem,
  onOpenReportDetail,
  onOpenMap,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCinematicAlertShowing, setIsCinematicAlertShowing] = useState<boolean>(true);
  const [isMerged, setIsMerged] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsCinematicAlertShowing(true);
      setIsMerged(false);
      setIsResolved(false);
      setIsVerified(false);
      starkSound.playAlert();

      // Clear alert animation after 3.2s
      const timer = setTimeout(() => {
        setIsCinematicAlertShowing(false);
      }, 3200);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Citizen Aarav Reports Road Hazard',
      desc: 'First citizen reports a 1.8m deep pothole on Birla Road causing commercial truck swerving.',
      actor: 'Aarav Sharma (Citizen)',
      report: SIMULATION_REPORTS[0],
    },
    {
      num: 2,
      title: 'Citizen Priya Reports Surface Breakage',
      desc: 'Second citizen reports damaged road surface and bitumen cave-in within 28 meters.',
      actor: 'Priya Patel (Citizen)',
      report: SIMULATION_REPORTS[1],
    },
    {
      num: 3,
      title: 'Citizen Rohan Flags Imminent Collision Risk',
      desc: 'Third citizen reports two-wheelers nearly colliding dodging the deep crater in the same corridor.',
      actor: 'Rohan Verma (Citizen)',
      report: SIMULATION_REPORTS[2],
    },
    {
      num: 4,
      title: 'S.T.A.R.K. Multi-Sensor Spatial-Semantic Correlation',
      desc: 'AI detects 3 complaints within a 38-meter radius on Birla Road with 96% linguistic-hazard convergence.',
      actor: 'S.T.A.R.K. AI Engine',
    },
    {
      num: 5,
      title: 'Incident Cluster Synthesized (Impact 9.4/10)',
      desc: 'Cluster CLUSTER-SATNA-BIRLA-01 generated. Priority escalated to CRITICAL with combined public impact 9.4/10.',
      actor: 'Autonomous Triage',
    },
    {
      num: 6,
      title: 'GIS Telemetry Plotting on Satna Map',
      desc: 'Incident plotted on OpenStreetMap with pulsing red warning radius and traffic hazard advisory.',
      actor: 'GIS Engine',
    },
    {
      num: 7,
      title: 'Administrator Verification & Multi-Docket Merge',
      desc: 'Admin confirms the 3 complaints are identical and merges them into Master Docket [STARK-SIM-001].',
      actor: 'Director Stark-01 (Admin)',
    },
    {
      num: 8,
      title: 'Department Allocation & Urgent Dispatch',
      desc: 'Assigned to Satna Municipal Road Maintenance Division. Roller & hot-mix asphalt team dispatched.',
      actor: 'Municipal Dispatch',
    },
    {
      num: 9,
      title: 'Asphalt Restoration & After-Photo Upload',
      desc: 'Contractor excises damaged base, compacts stone aggregate, and lays fresh asphalt patch flush with road.',
      actor: 'Eng. Rajesh Verma',
    },
    {
      num: 10,
      title: 'Citizen Verification & Confetti Closure',
      desc: 'Citizen Aarav inspects the finished repair on-site, rates 5/5 stars, and verifies case closure.',
      actor: 'Aarav Sharma (Verified Citizen)',
    },
  ];

  const handleNext = () => {
    starkSound.playClick();
    if (currentStep === 6) {
      setIsMerged(true);
    }
    if (currentStep === 8) {
      setIsResolved(true);
    }
    if (currentStep === 9) {
      setIsVerified(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#ef4444', '#10b981', '#f59e0b'],
      });
      starkSound.playSuccess();
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    starkSound.playClick();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteSimulation = () => {
    onApplySimulationToSystem();
    starkSound.playSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xl overflow-y-auto">
      {/* Cinematic AI INCIDENT DETECTED HUD Animation Screen */}
      {isCinematicAlertShowing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-950/95 stark-grid-bg animate-fadeIn">
          <div className="relative flex items-center justify-center">
            {/* Pulsing Concentric Warning Rings */}
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-rose-500/30 animate-ping [animation-duration:2s] absolute" />
            <div className="w-52 h-52 md:w-64 md:h-64 rounded-full border border-dashed border-rose-400/50 animate-spin [animation-duration:8s] absolute" />
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-500 flex flex-col items-center justify-center shadow-[0_4px_30px_rgba(244,63,94,0.3)] z-10">
              <AlertTriangle className="w-14 h-14 text-rose-600 dark:text-rose-300 animate-bounce" />
            </div>
          </div>

          <div className="text-center space-y-2 mt-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/60 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold tracking-widest uppercase shadow-xs">
              <span>S.T.A.R.K. THREAT PROTOCOL ACTIVE</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold font-tech tracking-wider text-slate-900 dark:text-rose-100 uppercase">
              AI INCIDENT CLUSTER DETECTED
            </h2>
            <p className="text-xs md:text-sm font-mono text-rose-600 dark:text-rose-300/90 max-w-md mx-auto font-medium">
              3 Concurrent Road Hazard Reports Converging on Birla Road (Satna Grid Node 04)
            </p>
          </div>

          <button
            onClick={() => setIsCinematicAlertShowing(false)}
            className="mt-8 px-6 py-2.5 rounded-xl bg-rose-600 text-white font-mono text-xs font-bold shadow-md hover:bg-rose-700 transition-all"
          >
            Enter Interactive Emergency Investigation →
          </button>
        </div>
      )}

      {/* Main Interactive Simulation Workbench */}
      <div className="stark-panel rounded-2xl max-w-4xl w-full border border-rose-200 dark:border-rose-500/40 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-b border-rose-200 dark:border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-500/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono tracking-wider text-slate-900 dark:text-slate-100 uppercase">
                STARK CIVIC EMERGENCY SIMULATION
              </div>
              <div className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-medium">
                Scenario: 3-Citizen Concurrent Pothole Cluster & Verification
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Step <span className="text-blue-600 dark:text-cyan-300 font-bold">{currentStep + 1}</span> of {steps.length}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 flex">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx <= currentStep ? 'bg-gradient-to-r from-rose-500 to-blue-600' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step Content Viewport */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-slate-900">
          {/* Step Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-600 dark:text-rose-400 font-bold uppercase">
              <span>Protocol Phase {currentStep + 1}</span>
              <span>·</span>
              <span>Actor: {steps[currentStep].actor}</span>
            </div>
            <h3 className="text-xl font-bold font-tech text-slate-900 dark:text-slate-100">
              {steps[currentStep].title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
              {steps[currentStep].desc}
            </p>
          </div>

          {/* Dynamic Content by Step */}
          {currentStep <= 2 && (
            <div className="stark-panel rounded-2xl p-5 border border-blue-200 dark:border-cyan-500/30 space-y-3 bg-slate-50/70 dark:bg-slate-950/60 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">
                  {SIMULATION_REPORTS[currentStep].id}
                </span>
                <StatusLabel status={SIMULATION_REPORTS[currentStep].status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-xs">
                  <img
                    src={ASSET_PATHS.incidentPothole}
                    alt="Road Hazard"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-950/80 text-[10px] font-mono text-blue-700 dark:text-cyan-400 font-medium">
                    GPS: {SIMULATION_REPORTS[currentStep].location.latitude}°N
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="text-slate-900 dark:text-slate-200 font-bold">{SIMULATION_REPORTS[currentStep].title}</div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">
                    {SIMULATION_REPORTS[currentStep].description}
                  </p>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5 shadow-xs">
                    <div>Reporter: {SIMULATION_REPORTS[currentStep].reportedBy.name}</div>
                    <div>Location: {SIMULATION_REPORTS[currentStep].location.address}</div>
                    <div className="text-rose-600 dark:text-rose-400 font-bold">
                      Severity: {SIMULATION_REPORTS[currentStep].severity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="stark-panel rounded-2xl p-5 border border-blue-200 dark:border-cyan-500/40 bg-blue-50/50 dark:bg-cyan-950/20 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-700 dark:text-cyan-300 uppercase">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>AUTONOMOUS MULTI-SENSOR SIMILARITY MATRIX</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Spatial Distance</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-cyan-400 font-mono">28 meters</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">High Proximity (&lt; 350m threshold)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Semantic Convergence</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-cyan-400 font-mono">96.4%</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">Identical asphalt crater descriptors</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Category Alignment</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-cyan-400 font-mono">100% Match</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">Road Maintenance & Highway</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-blue-200 dark:border-cyan-500/30 text-xs font-mono text-slate-700 dark:text-slate-200 shadow-xs">
                <strong className="text-blue-700 dark:text-cyan-300">AI Diagnostic:</strong> The 3 independent citizen reports (Aarav, Priya, Rohan) reference the identical bitumen structural failure at Birla Road / Cement Depot Crossing. Merging recommended to eliminate duplicate contractor dispatch.
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="stark-panel rounded-2xl p-5 border border-rose-200 dark:border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/20 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200 dark:border-rose-500/30">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-700 dark:text-rose-300 uppercase">
                  <Layers className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>INCIDENT CLUSTER FORMATION: {INITIAL_CLUSTERS[0].name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-lg border border-rose-300 dark:border-rose-500/50">
                  Combined Impact: 9.4 / 10
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                By aggregating 3 citizen reports, S.T.A.R.K. elevates the public hazard rating from Moderate to Critical. Collective report density signals an imminent high-fatality risk for night commuters.
              </p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-slate-500 text-[10px]">Combined Upvotes</div>
                  <div className="text-lg font-bold text-blue-600 dark:text-cyan-300">61 Citizens</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-slate-500 text-[10px]">Triage Priority</div>
                  <div className="text-lg font-bold text-rose-600 dark:text-rose-400">94 / 100</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-slate-500 text-[10px]">Recommended Action</div>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-300">Rapid Paving</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="stark-panel rounded-2xl p-5 border border-blue-200 dark:border-cyan-500/40 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-mono">
                <span className="text-blue-700 dark:text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  GIS SPATIAL CORRIDOR PLOTTED (SATNA)
                </span>
                <button
                  onClick={onOpenMap}
                  className="text-blue-600 dark:text-cyan-300 font-bold underline hover:text-blue-700"
                >
                  Inspect in Live GIS Map
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Coordinates:</span>
                  <span className="text-blue-600 dark:text-cyan-300 font-bold">24.5891°N, 80.8354°E</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Corridor Landmark:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">Birla Road, Opp Truck Weigh Scale</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Traffic Congestion Index:</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">Severe (Freight bottleneck)</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="stark-panel rounded-2xl p-5 border border-amber-200 dark:border-amber-500/40 bg-amber-50/40 dark:bg-transparent space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 uppercase">
                <Merge className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>ADMINISTRATOR ACTION: MERGE DUPLICATES</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                Administrator Director Stark-01 reviews the 3 reports side-by-side, verifies physical overlap, and merges reports STARK-SIM-002 and STARK-SIM-003 into Primary Master Docket [STARK-SIM-001].
              </p>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Tickets merged. Duplicate contractor assignments averted. Master docket active.</span>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="stark-panel rounded-2xl p-5 border border-blue-200 dark:border-cyan-500/30 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-700 dark:text-cyan-300 uppercase">
                <Shield className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>MUNICIPAL CREW DISPATCH</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Department:</span>
                  <span className="text-blue-700 dark:text-cyan-300 font-bold">Road Maintenance & Highway Infrastructure</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Officer in Charge:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">Eng. Rajesh Verma</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status Update:</span>
                  <StatusLabel status="In Progress" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="stark-panel rounded-2xl p-5 border border-emerald-200 dark:border-emerald-500/40 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ROADWORK RESTORATION & AFTER-PHOTO VERIFICATION</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Before Repair</span>
                  <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img src={ASSET_PATHS.incidentPothole} alt="Before" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 uppercase font-bold">After Repair (Hot-Mix Paved)</span>
                  <div className="aspect-video rounded-xl overflow-hidden border-2 border-emerald-400">
                    <img src={ASSET_PATHS.resolutionRepaired} alt="After" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <p className="text-xs font-mono text-slate-600 dark:text-slate-300">
                Engineer Rajesh Verma uploads official site photo with timestamped compaction verification.
              </p>
            </div>
          )}

          {currentStep === 9 && (
            <div className="stark-panel rounded-2xl p-6 border border-emerald-200 dark:border-emerald-500/50 bg-emerald-50/70 dark:bg-emerald-950/20 space-y-4 text-center shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold font-tech text-emerald-800 dark:text-emerald-300 uppercase">
                  CITIZEN ACCOUNTABILITY CONFIRMED
                </h4>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Citizen Aarav Sharma confirms the repair is complete and safe. Incident docket successfully closed with full audit history!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-emerald-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 max-w-sm mx-auto shadow-xs">
                <span className="text-amber-500 font-bold">5/5 Stars Verified</span> · "Clean asphalt patch flush with street level. Hazard completely eliminated."
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-colors shadow-xs"
          >
            ← Previous Phase
          </button>

          <div className="flex items-center gap-2">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 text-xs font-mono font-bold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Advance Simulation Phase</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleCompleteSimulation}
                className="px-6 py-2.5 text-xs font-mono font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply Simulation to Live Application</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
