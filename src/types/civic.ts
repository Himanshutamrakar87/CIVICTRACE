export type IssueCategory = 
  | 'Road Maintenance'
  | 'Sanitation'
  | 'Water Department'
  | 'Electricity'
  | 'Drainage'
  | 'Public Infrastructure'
  | 'Other Community';

export type IssueStatus = 
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Reopened';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface LocationData {
  address: string;
  area: string; // e.g. "Civil Lines", "Birla Road", "Raghuraj Nagar", "Station Road"
  city: string; // "Satna"
  state: string; // "Madhya Pradesh"
  latitude: number;
  longitude: number;
  landmark?: string;
}

export interface AIAnalysis {
  categoryRecommendation: IssueCategory;
  categoryConfidence: number; // 0 - 100
  urgencyScore: number; // 1 - 10
  publicImpactScore: number; // 1 - 10
  severity: SeverityLevel;
  safetyHazardRisks: string[];
  estimatedFixHours: number;
  reasoning: string;
  conciseSummary: string;
  isDuplicateSuspected: boolean;
  duplicateConfidence?: number;
  suspectedDuplicateIds?: string[];
  analyzedAt: string;
  modelUsed: string; // e.g. 'gemini-3.8-flash' or 'stark-heuristic-v1'
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  status: IssueStatus;
  actorName: string;
  actorRole: 'Citizen' | 'Admin' | 'AI Intelligence' | 'Department Staff';
  note: string;
  badgeLabel?: string;
}

export interface ResolutionData {
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  afterImageUrl?: string;
  citizenVerified?: boolean;
  citizenVerificationDate?: string;
  citizenFeedback?: string;
  citizenSatisfactionRating?: number; // 1 to 5
  isDisputed?: boolean;
  disputeReason?: string;
}

export interface CivicReport {
  id: string; // e.g. 'STARK-SATNA-2026-0101'
  title: string;
  description: string;
  category: IssueCategory;
  severity: SeverityLevel;
  status: IssueStatus;
  location: LocationData;
  imageUrl?: string;
  reportedBy: {
    name: string;
    phone?: string;
    email?: string;
    role: 'Citizen' | 'Admin';
    citizenId: string;
  };
  createdAt: string;
  updatedAt: string;
  assignedDepartment?: string;
  assignedOfficer?: string;
  priorityScore: number; // 1 - 100
  aiAnalysis?: AIAnalysis;
  resolution?: ResolutionData;
  timeline: TimelineEvent[];
  isDuplicate?: boolean;
  mergedIntoReportId?: string;
  duplicateReportIds?: string[];
  clusterId?: string;
  upvotes: number;
}

export interface IncidentCluster {
  id: string;
  name: string;
  primaryReportId: string;
  reportIds: string[];
  category: IssueCategory;
  centerCoordinates: { latitude: number; longitude: number };
  radiusMeters: number;
  severity: SeverityLevel;
  combinedPublicImpact: number; // 1 - 10
  status: IssueStatus;
  reasoning: string;
}

export interface DepartmentStats {
  name: string;
  category: IssueCategory;
  headOfficer: string;
  activeCases: number;
  resolvedCases: number;
  avgResolutionHours: number;
  satisfactionRate: number; // percentage
}

export interface DashboardStats {
  totalReports: number;
  activeIssues: number;
  criticalIssues: number;
  resolvedIssues: number;
  averageResolutionTimeHours: number;
  resolutionRatePercent: number;
  duplicateClustersCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Citizen' | 'Admin';
  department?: string;
  avatarUrl?: string;
}
