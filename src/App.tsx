/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { CommandEntryScreen } from './components/landing/CommandEntryScreen';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { CitizenReportForm } from './components/report/CitizenReportForm';
import { CivicIntelligenceMap } from './components/map/CivicIntelligenceMap';
import { IssueInvestigation } from './components/investigation/IssueInvestigation';
import { AdminCommandCenter } from './components/admin/AdminCommandCenter';
import { EmergencySimulationModal } from './components/simulation/EmergencySimulationModal';
import { CivicAIAssistant } from './components/assistant/CivicAIAssistant';
import { AnalyticsReports } from './components/analytics/AnalyticsReports';
import { api } from './services/api';
import { CivicReport, DepartmentStats, DashboardStats, IncidentCluster } from './types/civic';
import { INITIAL_REPORTS, INITIAL_DEPARTMENTS, INITIAL_CLUSTERS } from './data/initialData';
import { starkSound } from './services/sound';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [userRole, setUserRole] = useState<'Citizen' | 'Admin'>('Citizen');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Data states
  const [reports, setReports] = useState<CivicReport[]>(INITIAL_REPORTS);
  const [departments, setDepartments] = useState<DepartmentStats[]>(INITIAL_DEPARTMENTS);
  const [clusters, setClusters] = useState<IncidentCluster[]>(INITIAL_CLUSTERS);
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: INITIAL_REPORTS.length,
    activeIssues: INITIAL_REPORTS.filter((r) => r.status !== 'Resolved').length,
    criticalIssues: INITIAL_REPORTS.filter((r) => r.severity === 'CRITICAL' && r.status !== 'Resolved').length,
    resolvedIssues: INITIAL_REPORTS.filter((r) => r.status === 'Resolved').length,
    averageResolutionTimeHours: 16.8,
    resolutionRatePercent: 85,
    duplicateClustersCount: INITIAL_CLUSTERS.length,
  });

  // Modals & Panels
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Load live data from API
  const refreshData = async () => {
    try {
      const [fetchedReports, fetchedStats, fetchedDepts, fetchedClusters] = await Promise.all([
        api.getReports(),
        api.getStats(),
        api.getDepartments(),
        api.getClusters(),
      ]);
      setReports(fetchedReports);
      setStats(fetchedStats);
      setDepartments(fetchedDepts);
      setClusters(fetchedClusters);
    } catch (err) {
      console.warn('API sync fallback to client state:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleRoleToggle = () => {
    const nextRole = userRole === 'Citizen' ? 'Admin' : 'Citizen';
    setUserRole(nextRole);
    if (nextRole === 'Admin' && currentTab !== 'admin') {
      setCurrentTab('admin');
    }
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setCurrentTab('investigation');
  };

  const handleReportCreated = (newReport: CivicReport) => {
    setReports((prev) => [newReport, ...prev]);
    setSelectedReportId(newReport.id);
    setCurrentTab('investigation');
    refreshData();
  };

  const handleReportUpdated = (updated: CivicReport) => {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    refreshData();
  };

  const handleApplySimulation = async () => {
    try {
      await api.startSimulation();
      await refreshData();
      setSelectedReportId('STARK-SIM-001');
      setCurrentTab('investigation');
    } catch {
      // client-side apply
      refreshData();
    }
  };

  // Selected report for investigation view
  const currentReport = reports.find((r) => r.id === selectedReportId) || reports[0];
  const activeCluster = clusters.find((c) => c.reportIds.includes(currentReport?.id));
  const relatedReports = reports.filter(
    (r) =>
      r.id !== currentReport?.id &&
      (currentReport?.duplicateReportIds?.includes(r.id) || activeCluster?.reportIds.includes(r.id))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 antialiased stark-grid-bg">
      {viewMode === 'landing' ? (
        <CommandEntryScreen
          stats={stats}
          onInitialize={() => {
            setViewMode('app');
            setCurrentTab('overview');
          }}
          onEnterCitizen={() => {
            setUserRole('Citizen');
            setViewMode('app');
            setCurrentTab('overview');
          }}
          onEnterAdmin={() => {
            setUserRole('Admin');
            setViewMode('app');
            setCurrentTab('admin');
          }}
          onStartSimulation={() => {
            setViewMode('app');
            setIsSimulationOpen(true);
          }}
        />
      ) : (
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <Header
            currentTab={currentTab}
            onTabChange={(tab) => {
              setCurrentTab(tab);
              if (tab !== 'investigation') setSelectedReportId(null);
            }}
            userRole={userRole}
            onRoleToggle={handleRoleToggle}
            onStartSimulation={() => setIsSimulationOpen(true)}
            onOpenReportForm={() => setCurrentTab('report_form')}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            activeCriticalCount={stats.criticalIssues}
          />

          {/* Main Body Layout: Sidebar + Viewport */}
          <div className="flex-1 flex overflow-hidden">
            <Sidebar
              currentTab={currentTab}
              onTabChange={(tab) => {
                setCurrentTab(tab);
                if (tab !== 'investigation') setSelectedReportId(null);
              }}
              userRole={userRole}
              onStartSimulation={() => setIsSimulationOpen(true)}
              onOpenAssistant={() => setIsAssistantOpen(true)}
              activeCount={stats.activeIssues}
              criticalCount={stats.criticalIssues}
            />

            {/* Viewport Content */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl mx-auto w-full">
              {currentTab === 'overview' && (
                <OverviewDashboard
                  stats={stats}
                  reports={reports}
                  onSelectReport={handleSelectReport}
                  onOpenReportForm={() => setCurrentTab('report_form')}
                  onOpenMap={() => setCurrentTab('map')}
                  onStartSimulation={() => setIsSimulationOpen(true)}
                />
              )}

              {currentTab === 'issues' && (
                <OverviewDashboard
                  stats={stats}
                  reports={reports}
                  onSelectReport={handleSelectReport}
                  onOpenReportForm={() => setCurrentTab('report_form')}
                  onOpenMap={() => setCurrentTab('map')}
                  onStartSimulation={() => setIsSimulationOpen(true)}
                />
              )}

              {currentTab === 'map' && (
                <CivicIntelligenceMap
                  reports={reports}
                  clusters={clusters}
                  onSelectReport={handleSelectReport}
                />
              )}

              {currentTab === 'report_form' && (
                <CitizenReportForm
                  onSuccess={handleReportCreated}
                  onCancel={() => setCurrentTab('overview')}
                />
              )}

              {currentTab === 'investigation' && currentReport && (
                <IssueInvestigation
                  report={currentReport}
                  cluster={activeCluster}
                  relatedReports={relatedReports}
                  userRole={userRole}
                  onBack={() => setCurrentTab('overview')}
                  onReportUpdated={handleReportUpdated}
                  onSelectReport={handleSelectReport}
                />
              )}

              {currentTab === 'admin' && (
                <AdminCommandCenter
                  reports={reports}
                  departments={departments}
                  clusters={clusters}
                  onSelectReport={handleSelectReport}
                  onReportsUpdated={refreshData}
                />
              )}

              {(currentTab === 'analytics' || currentTab === 'reports') && (
                <AnalyticsReports
                  reports={reports}
                  departments={departments}
                  stats={stats}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* S.T.A.R.K. Emergency Simulation Modal */}
      <EmergencySimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        onApplySimulationToSystem={handleApplySimulation}
        onOpenReportDetail={handleSelectReport}
        onOpenMap={() => {
          setIsSimulationOpen(false);
          setCurrentTab('map');
        }}
      />

      {/* Floating CIVIC AI Assistant */}
      <CivicAIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
}
