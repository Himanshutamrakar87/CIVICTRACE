import {
  CivicReport,
  DepartmentStats,
  DashboardStats,
  IncidentCluster,
  AIAnalysis,
  IssueCategory,
  IssueStatus,
  SeverityLevel
} from '../types/civic';

export interface ReportFilterOptions {
  category?: IssueCategory | 'ALL';
  status?: IssueStatus | 'ALL';
  severity?: SeverityLevel | 'ALL';
  search?: string;
  area?: string | 'ALL';
}

export const api = {
  // Fetch reports with filters
  async getReports(filters?: ReportFilterOptions): Promise<CivicReport[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.category && filters.category !== 'ALL') params.append('category', filters.category);
      if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
      if (filters.severity && filters.severity !== 'ALL') params.append('severity', filters.severity);
      if (filters.search) params.append('search', filters.search);
      if (filters.area && filters.area !== 'ALL') params.append('area', filters.area);
    }
    const res = await fetch(`/api/reports?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    const data = await res.json();
    return data.reports || [];
  },

  // Fetch single report by ID
  async getReport(id: string): Promise<{ report: CivicReport; cluster?: IncidentCluster; relatedReports?: CivicReport[] }> {
    const res = await fetch(`/api/reports/${id}`);
    if (!res.ok) throw new Error('Report not found');
    return res.json();
  },

  // Submit new report
  async createReport(reportData: Partial<CivicReport>): Promise<CivicReport> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit report');
    }
    const data = await res.json();
    return data.report;
  },

  // S.T.A.R.K. AI Analysis
  async analyzeIssue(payload: {
    title: string;
    description: string;
    category?: IssueCategory;
    latitude?: number;
    longitude?: number;
    imageBase64?: string;
  }): Promise<AIAnalysis> {
    const res = await fetch('/api/ai/analyze-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('AI analysis failed');
    const data = await res.json();
    return data.analysis;
  },

  // S.T.A.R.K. AI Civic Assistant Chat
  async chatAssistant(message: string): Promise<{ reply: string; source: string }> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error('Assistant communication failed');
    return res.json();
  },

  // Update Status / Assignment
  async updateStatus(
    id: string,
    payload: {
      status?: IssueStatus;
      assignedDepartment?: string;
      assignedOfficer?: string;
      priorityScore?: number;
      adminNotes?: string;
      actorName?: string;
    }
  ): Promise<CivicReport> {
    const res = await fetch(`/api/reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update status');
    const data = await res.json();
    return data.report;
  },

  // Upload Resolution (Admin)
  async resolveReport(
    id: string,
    payload: {
      resolutionNotes: string;
      afterImageUrl?: string;
      resolvedBy?: string;
    }
  ): Promise<CivicReport> {
    const res = await fetch(`/api/reports/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to mark report as resolved');
    const data = await res.json();
    return data.report;
  },

  // Verify Resolution (Citizen Confirm or Dispute)
  async verifyResolution(
    id: string,
    payload: {
      confirmed: boolean;
      feedback?: string;
      rating?: number;
      disputeReason?: string;
      citizenName?: string;
    }
  ): Promise<CivicReport> {
    const res = await fetch(`/api/reports/${id}/verify-resolution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit resolution verification');
    const data = await res.json();
    return data.report;
  },

  // Merge Duplicates
  async mergeReports(payload: {
    primaryReportId: string;
    duplicateReportIds: string[];
    mergeReason?: string;
  }): Promise<CivicReport> {
    const res = await fetch('/api/reports/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to merge reports');
    const data = await res.json();
    return data.primaryReport;
  },

  // Get System Stats
  async getStats(): Promise<DashboardStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch system stats');
    const data = await res.json();
    return data.stats;
  },

  // Get Departments
  async getDepartments(): Promise<DepartmentStats[]> {
    const res = await fetch('/api/departments');
    if (!res.ok) throw new Error('Failed to fetch department telemetry');
    const data = await res.json();
    return data.departments;
  },

  // Get Incident Clusters
  async getClusters(): Promise<IncidentCluster[]> {
    const res = await fetch('/api/clusters');
    if (!res.ok) throw new Error('Failed to fetch incident clusters');
    const data = await res.json();
    return data.clusters;
  },

  // Simulation Controls
  async startSimulation(): Promise<{ cluster: IncidentCluster; reports: CivicReport[] }> {
    const res = await fetch('/api/simulation/start', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to trigger emergency simulation');
    return res.json();
  },

  async resetSimulation(): Promise<void> {
    const res = await fetch('/api/simulation/reset', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset simulation');
  },
};
