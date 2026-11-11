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
  const tileLayerRef = useRef<L.TileLayer | null>(null);

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

      const isDark = document.documentElement.classList.contains('dark');
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tiles = L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      tileLayerRef.current = tiles;
      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }
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
        color: '#dc2626',
        fillColor: '#dc2626',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '5, 5',
      });

      circle.bindTooltip(
        `<div style="font-family: monospace; font-size: 11px; color: #991b1b; background: #ffffff; border: 1px solid #f87171; padding: 4px 8px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
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
      const color = isResolved ? '#059669' : isCritical ? '#dc2626' : report.severity === 'HIGH' ? '#d97706' : '#2563eb';

      const customIcon = L.divIcon({
        className: 'custom-stark-marker',
        html: `
          <div style="
            position: relative;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            ${
              isCritical
                ? `<div style="
                    position: absolute;
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    border: 2px solid ${color};
                    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                    opacity: 0.6;
                  "></div>`
                : ''
            }
            <div style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #ffffff;
              border: 2.5px solid ${color};
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="width: 7px; height: 7px; border-radius: 50%; background: ${color};"></div>
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl stark-panel border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 uppercase">
            SATNA CIVIC INTELLIGENCE GIS MAP
          </span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="text-xs font-mono text-blue-600 dark:text-cyan-400 font-bold tabular-nums">
            {filteredReports.length} Active Nodes Plotted
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Area Filter */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-xs shadow-xs"
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
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-xs shadow-xs"
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
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-xs shadow-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Radar Sweep Toggle */}
          <button
            onClick={() => setRadarSweepEnabled(!radarSweepEnabled)}
            className={`p-1.5 rounded-lg border transition-colors shadow-xs ${
              radarSweepEnabled
                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-cyan-500/20 dark:border-cyan-500/40 dark:text-cyan-300'
                : 'bg-slate-50 border-slate-200 text-slate-400'
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
        <div className="lg:col-span-2 relative h-[520px] rounded-xl overflow-hidden border border-slate-200 dark:border-cyan-500/20 stark-panel shadow-sm">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Holographic Radar Sweep Animation Overlay */}
          {radarSweepEnabled && (
            <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden stark-scanline opacity-30 dark:opacity-40" />
          )}

          {/* Map Legend Floating Dock */}
          <div className="absolute bottom-3 left-3 z-20 p-3 rounded-xl bg-white/95 dark:bg-slate-950/85 backdrop-blur border border-slate-200 dark:border-cyan-500/20 text-[10px] font-mono space-y-1.5 shadow-lg">
            <div className="text-blue-700 dark:text-cyan-400 font-bold uppercase tracking-wider">MAP TELEMETRY KEY</div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                Critical
              </span>
              <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                High
              </span>
              <span className="flex items-center gap-1.5 text-blue-700 dark:text-cyan-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Medium
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Resolved
              </span>
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-[9px] pt-1 border-t border-slate-100 dark:border-slate-800">
              Red Dashed Ring: Spatial Duplicate Cluster Zone
            </div>
          </div>
        </div>

        {/* Selected Issue Preview / Inspector Card */}
        <div className="space-y-4">
          {activeReportDetail ? (
            <div className="stark-panel rounded-xl p-5 border border-blue-200 dark:border-cyan-500/30 bg-white dark:bg-slate-900 shadow-sm space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-mono font-bold text-blue-700 dark:text-cyan-400">
                  {activeReportDetail.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <StatusLabel status={activeReportDetail.status} />
                  <SeverityBadge severity={activeReportDetail.severity} />
                </div>
              </div>

              {/* Photo */}
              {activeReportDetail.imageUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                  <img
                    src={activeReportDetail.imageUrl}
                    alt={activeReportDetail.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-white/90 dark:bg-slate-950/80 text-[10px] font-mono text-blue-700 dark:text-cyan-400 font-semibold border border-slate-200 dark:border-slate-800">
                    {activeReportDetail.category}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {activeReportDetail.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                  {activeReportDetail.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-700 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                  <span>{activeReportDetail.location.address}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Ward: {activeReportDetail.location.area} · Reported by {activeReportDetail.reportedBy.name}
                </div>
                {activeReportDetail.assignedDepartment && (
                  <div className="text-[11px] text-blue-700 dark:text-cyan-300 font-medium">
                    Dept: {activeReportDetail.assignedDepartment}
                  </div>
                )}
              </div>

              {activeReportDetail.aiAnalysis && (
                <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-cyan-950/20 border border-blue-200 dark:border-cyan-500/20 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-blue-800 dark:text-cyan-400 font-bold">
                    <span>AI Urgency Assessment</span>
                    <span>{activeReportDetail.aiAnalysis.urgencyScore}/10</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">
                    {activeReportDetail.aiAnalysis.reasoning}
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  starkSound.playClick();
                  onSelectReport(activeReportDetail.id);
                }}
                className="w-full py-2.5 text-xs font-mono font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white dark:bg-cyan-400 dark:text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Open Full Investigation Docket</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="stark-panel rounded-xl p-6 border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-900 text-center space-y-3 flex flex-col items-center justify-center h-full min-h-[300px] shadow-sm">
              <Eye className="w-10 h-10 text-blue-500/50 dark:text-cyan-500/40" />
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300 uppercase">
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
