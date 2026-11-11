import React, { useState } from 'react';
import {
  Upload,
  Sparkles,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info,
  Shield,
  Layers,
} from 'lucide-react';
import { IssueCategory, SeverityLevel, AIAnalysis, CivicReport } from '../../types/civic';
import { api } from '../../services/api';
import { ASSET_PATHS } from '../../data/initialData';
import { starkSound } from '../../services/sound';

interface CitizenReportFormProps {
  onSuccess: (newReport: CivicReport) => void;
  onCancel: () => void;
}

export const CitizenReportForm: React.FC<CitizenReportFormProps> = ({ onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Road Maintenance');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('Civil Lines');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState(24.5752);
  const [longitude, setLongitude] = useState(80.8214);
  const [severity, setSeverity] = useState<SeverityLevel>('MEDIUM');
  const [reporterName, setReporterName] = useState('Aarav Sharma');
  const [reporterPhone, setReporterPhone] = useState('+91 98261 44520');

  // Photo state
  const [selectedImage, setSelectedImage] = useState<string>(ASSET_PATHS.incidentPothole);
  const [imagePreview, setImagePreview] = useState<string>(ASSET_PATHS.incidentPothole);

  // AI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<CivicReport | null>(null);

  const satnaAreas = [
    { name: 'Civil Lines', lat: 24.5752, lng: 80.8214, defaultAddress: 'Collectorate Road, Civil Lines' },
    { name: 'Birla Road', lat: 24.5886, lng: 80.8348, defaultAddress: 'Birla Road, Near Railway Crossing' },
    { name: 'Station Road', lat: 24.5862, lng: 80.8319, defaultAddress: 'Station Road, Opp Bus Stand Corridor' },
    { name: 'Dhawari', lat: 24.5841, lng: 80.8122, defaultAddress: 'Dhawari Chowk, Near Public School' },
    { name: 'Bharhut Nagar', lat: 24.5718, lng: 80.8402, defaultAddress: 'Gali 4, Bharhut Nagar Extension' },
  ];

  const handleAreaChange = (selectedAreaName: string) => {
    setArea(selectedAreaName);
    const found = satnaAreas.find((a) => a.name === selectedAreaName);
    if (found) {
      setLatitude(found.lat);
      setLongitude(found.lng);
      if (!address) setAddress(found.defaultAddress);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        setImagePreview(result);
        starkSound.playScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerAI = async () => {
    if (!title && !description) {
      setAnalysisError('Please enter an issue title or description for the AI engine to evaluate.');
      return;
    }
    setAnalysisError(null);
    setIsAnalyzing(true);
    starkSound.playScan();

    try {
      const analysis = await api.analyzeIssue({
        title,
        description,
        category,
        latitude,
        longitude,
        imageBase64: selectedImage.startsWith('data:') ? selectedImage : undefined,
      });

      setAiAnalysis(analysis);
      setCategory(analysis.categoryRecommendation);
      setSeverity(analysis.severity);
      if (!description && analysis.conciseSummary) {
        setDescription(analysis.conciseSummary);
      }
      starkSound.playAlert();
    } catch (err: any) {
      setAnalysisError('AI analysis service temporarily offline. You can proceed with manual classification.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim()) {
      alert('Please fill in the required fields (Title and Address).');
      return;
    }

    setIsSubmitting(true);
    starkSound.playClick();

    try {
      const report = await api.createReport({
        title,
        description: description || title,
        category,
        severity,
        location: {
          address,
          area,
          city: 'Satna',
          state: 'Madhya Pradesh',
          latitude,
          longitude,
          landmark,
        },
        imageUrl: selectedImage,
        reportedBy: {
          name: reporterName,
          phone: reporterPhone,
          role: 'Citizen',
          citizenId: `CIT-MP-${Math.floor(1000 + Math.random() * 9000)}`,
        },
        aiAnalysis: aiAnalysis || undefined,
      });

      setSubmittedReport(report);
      starkSound.playSuccess();
    } catch (err: any) {
      alert(`Error submitting report: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Confirmation Modal */}
      {submittedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="stark-panel rounded-2xl p-6 max-w-md w-full border border-blue-200 dark:border-cyan-400/50 bg-white dark:bg-slate-900 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 dark:bg-cyan-950 border-2 border-blue-600 dark:border-cyan-400 flex items-center justify-center text-blue-600 dark:text-cyan-400 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-tech tracking-wide text-slate-900 dark:text-slate-100 uppercase">
                CIVIC INCIDENT LOGGED
              </h3>
              <p className="text-xs font-mono text-blue-600 dark:text-cyan-400 font-semibold">
                Tracking ID: <span className="underline">{submittedReport.id}</span>
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Your report has been successfully ingested into the Satna Municipal intelligence network. S.T.A.R.K. AI has dispatched telemetry to the{' '}
              <strong className="text-blue-700 dark:text-cyan-300">{submittedReport.category}</strong> department.
            </p>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-left text-xs font-mono space-y-1">
              <div className="text-slate-500 dark:text-slate-400">Status: <span className="text-blue-700 dark:text-cyan-300 font-bold">{submittedReport.status}</span></div>
              <div className="text-slate-500 dark:text-slate-400">Assigned Ward: <span className="text-slate-800 dark:text-slate-200 font-medium">{submittedReport.location.area}</span></div>
              <div className="text-slate-500 dark:text-slate-400">Severity: <span className="text-amber-700 dark:text-amber-400 font-bold">{submittedReport.severity}</span></div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onSuccess(submittedReport);
                }}
                className="flex-1 py-2 text-xs font-mono font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950 rounded-lg transition-all shadow-sm"
              >
                Track Investigation Docket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-blue-100 dark:border-cyan-900/30">
        <div>
          <h2 className="text-xl font-bold font-tech tracking-wide text-slate-900 dark:text-slate-100 uppercase flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            Citizen Civic Reporting Portal
          </h2>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            Submit public infrastructure defects with AI damage verification & GPS geotagging
          </p>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors shadow-xs"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Form Details */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Deep Pothole Threatening Two-Wheelers on Birla Road"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none shadow-xs"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-200 focus:outline-none shadow-xs"
              >
                <option value="Road Maintenance">Road Maintenance & Highway</option>
                <option value="Sanitation">Sanitation & Garbage Management</option>
                <option value="Water Department">Water Supply & Leakage</option>
                <option value="Electricity">Electricity & Streetlights</option>
                <option value="Drainage">Drainage & Sewage Overflow</option>
                <option value="Public Infrastructure">Public Infrastructure & Parks</option>
                <option value="Other Community">Other Community Issue</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400">Provide exact physical hazards</span>
              </div>
              <textarea
                required
                rows={3}
                placeholder="Describe size, depth, duration, hazards, and exact landmark..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none shadow-xs"
              />
            </div>

            {/* Area & Location */}
            <div className="space-y-3 p-4 rounded-xl bg-blue-50/40 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-800 shadow-xs">
              <div className="text-xs font-mono font-bold text-blue-700 dark:text-cyan-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Geographic Pinpoint (Satna, MP)</span>
              </div>

              {/* Quick Area Pre-fills */}
              <div className="flex flex-wrap gap-1.5">
                {satnaAreas.map((a) => (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => handleAreaChange(a.name)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-colors ${
                      area === a.name
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-1">
                  Street Address / Landmark
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Railway Crossing Gate No. 3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500">Latitude</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-800 dark:text-slate-300"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">Longitude</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-800 dark:text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Severity Radio Group */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Observed Severity Level
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as SeverityLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      starkSound.playClick();
                      setSeverity(lvl);
                    }}
                    className={`py-1.5 rounded-lg border text-center transition-all ${
                      severity === lvl
                        ? lvl === 'CRITICAL'
                          ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold shadow-xs dark:bg-rose-950/60 dark:border-rose-500 dark:text-rose-300'
                          : lvl === 'HIGH'
                          ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold shadow-xs dark:bg-amber-950/60 dark:border-amber-500 dark:text-amber-300'
                          : 'bg-blue-50 border-blue-300 text-blue-700 font-bold shadow-xs dark:bg-cyan-950/60 dark:border-cyan-500 dark:text-cyan-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Photo Evidence & AI Analysis Engine */}
          <div className="space-y-4">
            {/* Photo Evidence Box */}
            <div className="stark-panel rounded-xl p-5 border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900/60 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300">
                <span className="font-bold text-blue-700 dark:text-cyan-400 uppercase">PHOTOGRAPHIC EVIDENCE</span>
                <span className="text-[10px] text-slate-400">GEO-STAMPED</span>
              </div>

              {/* Photo Preview Container */}
              <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Defect preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-slate-400 text-xs font-mono p-4">
                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <span>No photo uploaded</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-white/90 dark:bg-slate-950/80 backdrop-blur border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-blue-700 dark:text-cyan-400 font-medium">
                  SATNA GPS: {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
                </div>
              </div>

              {/* Choose Preset Photo or Upload File */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <label className="cursor-pointer px-3 py-1.5 text-xs font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload Local File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(ASSET_PATHS.incidentPothole);
                    setImagePreview(ASSET_PATHS.incidentPothole);
                    setTitle('Deep Pothole Hazard on Birla Road');
                    setCategory('Road Maintenance');
                    starkSound.playClick();
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                >
                  Preset: Pothole
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(ASSET_PATHS.incidentWater);
                    setImagePreview(ASSET_PATHS.incidentWater);
                    setTitle('Ruptured Municipal Water Main');
                    setCategory('Water Department');
                    starkSound.playClick();
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                >
                  Preset: Water Leak
                </button>
              </div>
            </div>

            {/* S.T.A.R.K. AI Analysis Trigger & Insights Dock */}
            <div className="stark-panel rounded-xl p-5 border border-blue-200 dark:border-cyan-500/30 bg-blue-50/50 dark:bg-cyan-950/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono text-blue-700 dark:text-cyan-400 font-bold">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <span>S.T.A.R.K. AI CIVIC CLASSIFIER</span>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerAI}
                  disabled={isAnalyzing}
                  className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white dark:bg-cyan-500/20 dark:border dark:border-cyan-400/50 dark:text-cyan-300 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span>Run AI Analysis</span>
                    </>
                  )}
                </button>
              </div>

              {analysisError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                  {analysisError}
                </div>
              )}

              {aiAnalysis ? (
                <div className="space-y-2.5 text-xs font-mono border-t border-blue-200 dark:border-cyan-900/40 pt-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">AI Category (Confidence)</span>
                      <span className="text-blue-700 dark:text-cyan-300 font-bold">{aiAnalysis.categoryRecommendation}</span>
                      <span className="text-slate-500 text-[10px] ml-1">({aiAnalysis.categoryConfidence}%)</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Urgency / Public Impact</span>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">{aiAnalysis.urgencyScore}/10</span>
                      <span className="text-slate-500 text-[10px]"> · Impact: {aiAnalysis.publicImpactScore}/10</span>
                    </div>
                  </div>

                  {aiAnalysis.isDuplicateSuspected && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-500/40 dark:text-amber-300 flex items-start gap-2 text-xs shadow-xs">
                      <Layers className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <div>
                        <strong className="block font-semibold">Potential Duplicate Incident Detected</strong>
                        <span className="text-[11px] text-slate-600 dark:text-slate-300">
                          AI identified matching spatial-semantic patterns within 350m of {aiAnalysis.suspectedDuplicateIds?.join(', ')}.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300 space-y-1 shadow-xs">
                    <div className="text-blue-700 dark:text-cyan-400 font-semibold">AI Rationale ({aiAnalysis.modelUsed}):</div>
                    <p>{aiAnalysis.reasoning}</p>
                  </div>

                  {aiAnalysis.safetyHazardRisks.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Identified Safety Risks:</span>
                      <ul className="list-disc list-inside text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5">
                        {aiAnalysis.safetyHazardRisks.map((risk, idx) => (
                          <li key={idx}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-slate-500 text-xs font-mono flex items-center justify-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-500/60" />
                  <span>Click "Run AI Analysis" to evaluate severity and check for duplicates.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors shadow-xs"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-mono font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-sm disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Ingesting to Municipal Core...</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span>Submit Civic Complaint</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
