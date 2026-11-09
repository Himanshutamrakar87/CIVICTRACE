import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  Search,
  Filter,
  ExternalLink,
  ShieldAlert,
  Radio,
  Eye,
} from 'lucide-react';
import { CivicReport, IncidentCluster, IssueCategory, IssueStatus } from '../../types/civic';
import { StatusLabel, SeverityBadge } from '../common/StarkBadge';
import { starkSound } from '../../services/sound';

interface CivicIntelligenceMapProps {
  reports: CivicReport[];
  clusters: IncidentCluster[];
  onSelectReport: (reportId: string) => void;
}

export const CivicIntelligenceMap: React.FC<CivicIntelligenceMapProps> = ({
  reports,
  clusters,
  onSelectReport,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeReportDetail, setActiveReportDetail] = useState<CivicReport | null>(null);
  const [radarSweepEnabled, setRadarSweepEnabled] = useState(true);

  // Filtered reports for map display
  const filteredReports = reports.filter((r) => {
    const matchesArea = selectedArea === 'ALL' || r.location.area.toLowerCase() === selectedArea.toLowerCase();
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchesArea && matchesCategory && matchesStatus;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Satna, MP coordinates: 24.582, 80.828
      const map = L.map(mapContainerRef.current, {
        center: [24.582, 80.828],
        zoom: 14,
        zoomControl: true,
      });

      // CartoDB Dark Matter or OpenStreetMap with dark tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Keep instance intact across subtle tab toggles if needed, or clean up
    };
  }, []);

  // Update Markers & Clusters when filtered reports change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Render Incident Clusters as pulsing warning zones
    clusters.forEach((cluster) => {
      const circle = L.circle([cluster.centerCoordinates.latitude, cluster.centerCoordinates.longitude], {
        radius: cluster.radiusMeters || 60,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.18,
        weight: 1.5,
        dashArray: '4, 4',
      });

      circle.bindTooltip(
        `<div style="font-family: monospace; font-size: 11px; color: #f87171; background: #020617; border: 1px solid #ef4444; padding: 4px 8px; border-radius: 4px;">
          <strong>${cluster.name}</strong><br/>
          ${cluster.reportIds.length} Linked Reports · Impact: ${cluster.combinedPublicImpact}/10
        </div>`,
        { permanent: false, direction: 'top' }
      );

      markersLayer.addLayer(circle);
    });

    // Render Markers for each report
    filteredReports.forEach((report) => {
      const isCritical = report.severity === 'CRITICAL';
      const isResolved = report.status === 'Resolved';
      const color = isResolved ? '#10b981' : isCritical ? '#ef4444' : report.severity === 'HIGH' ? '#f59e0b' : '#06b6d4';

      const customIcon = L.divIcon({
        className: 'custom-stark-marker',
        html: `
          <div style="
            position: relative;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            ${
              isCritical
                ? `<div style="
                    position: absolute;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid ${color};
                    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                    opacity: 0.75;
                  "></div>`
                : ''
            }
            <div style="
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #020617;
              border: 2px solid ${color};
              box-shadow: 0 0 10px ${color};
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="width: 6px; height: 6px; border-radius: 50%; background: ${color};"></div>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([report.location.latitude, report.location.longitude], {
        icon: customIcon,
      });

      marker.on('click', () => {
        starkSound.playClick();
        setActiveReportDetail(report);
      });

      markersLayer.addLayer(marker);
    });
  }, [filteredReports, clusters]);

  const areas = ['ALL', 'Birla Road', 'Civil Lines', 'Station Road', 'Dhawari', 'Bharhut Nagar'];
  const categories: IssueCategory[] = [
    'Road Maintenance',
    'Sanitation',
    'Water Department',
    'Electricity',
    'Drainage',
    'Public Infrastructure',
  ];

  return (
    <div className="space-y-4">
      {/* Top Map Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg stark-panel border border-cyan-500/20">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold text-slate-100 uppercase">
            SATNA CIVIC INTELLIGENCE GIS MAP
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs font-mono text-cyan-400 tabular-nums">
            {filteredReports.length} Active Nodes Plotted
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Area Filter */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2.5 py-1 focus:outline-none focus:border-cyan-500/40 text-xs"
          >
            <option value="ALL">All Satna Wards</option>
            {areas.filter((a) => a !== 'ALL').map((a) => (
              <option key={a} value={a}>Ward: {a}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2.5 py-1 focus:outline-none focus:border-cyan-500/40 text-xs"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2.5 py-1 focus:outline-none focus:border-cyan-500/40 text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Radar Sweep Toggle */}
          <button
            onClick={() => setRadarSweepEnabled(!radarSweepEnabled)}
            className={`p-1.5 rounded border transition-colors ${
              radarSweepEnabled
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="Toggle S.T.A.R.K. Radar Sweep Overlay"
          >
            <Radio className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-2 relative h-[520px] rounded-lg overflow-hidden border border-cyan-500/20 stark-panel">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Holographic Radar Sweep Animation Overlay */}
          {radarSweepEnabled && (
            <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden stark-scanline opacity-40" />
          )}

          {/* Map Legend Floating Dock */}
          <div className="absolute bottom-3 left-3 z-20 p-2.5 rounded bg-slate-950/85 backdrop-blur border border-cyan-500/20 text-[10px] font-mono space-y-1.5 shadow-xl">
            <div className="text-cyan-400 font-bold uppercase tracking-wider">MAP TELEMETRY KEY</div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Critical
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                High
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Medium
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Resolved
              </span>
            </div>
            <div className="text-slate-400 text-[9px] pt-1 border-t border-slate-800">
              Red Dashed Ring: Spatial Duplicate Cluster Zone
            </div>
          </div>
        </div>

        {/* Selected Issue Preview / Inspector Card */}
        <div className="space-y-4">
          {activeReportDetail ? (
            <div className="stark-panel rounded-lg p-4 border border-cyan-500/30 space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {activeReportDetail.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <StatusLabel status={activeReportDetail.status} />
                  <SeverityBadge severity={activeReportDetail.severity} />
                </div>
              </div>

              {/* Photo */}
              {activeReportDetail.imageUrl && (
                <div className="relative aspect-video rounded overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={activeReportDetail.imageUrl}
                    alt={activeReportDetail.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-cyan-400 border border-slate-800">
                    {activeReportDetail.category}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-100">
                  {activeReportDetail.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-3">
                  {activeReportDetail.description}
                </p>
              </div>

              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{activeReportDetail.location.address}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Ward: {activeReportDetail.location.area} · Reported by {activeReportDetail.reportedBy.name}
                </div>
                {activeReportDetail.assignedDepartment && (
                  <div className="text-[11px] text-cyan-300">
                    Dept: {activeReportDetail.assignedDepartment}
                  </div>
                )}
              </div>

              {activeReportDetail.aiAnalysis && (
                <div className="p-2.5 rounded bg-cyan-950/20 border border-cyan-500/20 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-cyan-400 font-semibold">
                    <span>AI Urgency Assessment</span>
                    <span>{activeReportDetail.aiAnalysis.urgencyScore}/10</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {activeReportDetail.aiAnalysis.reasoning}
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  starkSound.playClick();
                  onSelectReport(activeReportDetail.id);
                }}
                className="w-full py-2 text-xs font-mono font-bold rounded bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <span>Open Full Investigation Docket</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="stark-panel rounded-lg p-6 border border-cyan-500/20 text-center space-y-3 flex flex-col items-center justify-center h-full min-h-[300px]">
              <Eye className="w-10 h-10 text-cyan-500/40" />
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase">
                  GEO-TELEMETRY INSPECTOR
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Click on any glowing radar marker or cluster on the map to review the civic docket and launch triage.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
