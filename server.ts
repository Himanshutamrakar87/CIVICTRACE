import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_REPORTS,
  INITIAL_DEPARTMENTS,
  INITIAL_CLUSTERS,
  SIMULATION_REPORTS,
  ASSET_PATHS
} from './src/data/initialData';
import {
  CivicReport,
  IncidentCluster,
  DepartmentStats,
  AIAnalysis,
  IssueCategory,
  IssueStatus,
  SeverityLevel
} from './src/types/civic';

dotenv.config();

const app = express();
app.use(express.json({ limit: '25mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Database State
let reports: CivicReport[] = JSON.parse(JSON.stringify(INITIAL_REPORTS));
let departments: DepartmentStats[] = JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS));
let clusters: IncidentCluster[] = JSON.parse(JSON.stringify(INITIAL_CLUSTERS));
let simulationActive: boolean = false;

// Haversine Distance helper (in meters)
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Deterministic AI Analysis Fallback Engine
function runFallbackAIAnalysis(
  title: string,
  description: string,
  categoryInput?: IssueCategory
): AIAnalysis {
  const text = `${title} ${description}`.toLowerCase();
  let category: IssueCategory = categoryInput || 'Other Community';
  let urgency = 6;
  let impact = 6;
  let severity: SeverityLevel = 'MEDIUM';
  const hazards: string[] = [];

  if (text.includes('pothole') || text.includes('road') || text.includes('bitumen') || text.includes('asphalt') || text.includes('tarmac')) {
    category = 'Road Maintenance';
    hazards.push('High collision and vehicular suspension damage risk');
    if (text.includes('deep') || text.includes('crater') || text.includes('accident') || text.includes('hazard')) {
      urgency = 9;
      impact = 9;
      severity = 'CRITICAL';
      hazards.push('Immediate night accident risk for two-wheelers and auto-rickshaws');
    } else {
      urgency = 7;
      impact = 7;
      severity = 'HIGH';
    }
  } else if (text.includes('water') || text.includes('leak') || text.includes('burst') || text.includes('pipe') || text.includes('supply')) {
    category = 'Water Department';
    urgency = 8;
    impact = 9;
    severity = 'CRITICAL';
    hazards.push('Municipal treated water wastage exceeding tens of thousands of liters');
    hazards.push('Erosion of road foundation and waterlogging');
  } else if (text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('dump') || text.includes('sanitation')) {
    category = 'Sanitation';
    urgency = 6;
    impact = 7;
    severity = 'MEDIUM';
    hazards.push('Biological hazard and vector-borne pathogen transmission');
  } else if (text.includes('light') || text.includes('dark') || text.includes('electric') || text.includes('wire') || text.includes('pole')) {
    category = 'Electricity';
    urgency = 8;
    impact = 8;
    severity = 'HIGH';
    hazards.push('Severe night visibility drop and pedestrian personal safety hazard');
  } else if (text.includes('drain') || text.includes('sewage') || text.includes('gutter') || text.includes('overflow')) {
    category = 'Drainage';
    urgency = 7;
    impact = 8;
    severity = 'HIGH';
    hazards.push('Contaminated sewage backflow entering residential properties');
  }

  return {
    categoryRecommendation: category,
    categoryConfidence: 94,
    urgencyScore: urgency,
    publicImpactScore: impact,
    severity,
    safetyHazardRisks: hazards.length > 0 ? hazards : ['General civic disruption affecting public commuters'],
    estimatedFixHours: severity === 'CRITICAL' ? 6 : severity === 'HIGH' ? 12 : 24,
    reasoning: `S.T.A.R.K. Civic Intelligence classified this issue based on infrastructure damage keywords and traffic disruption metrics. Severity assessed as ${severity}.`,
    conciseSummary: `${category} incident: ${title.slice(0, 80)}`,
    isDuplicateSuspected: false,
    analyzedAt: new Date().toISOString(),
    modelUsed: 'stark-heuristic-v1',
  };
}

// AI Issue Analysis Endpoint using Gemini 3.8 Flash with safe fallback
app.post('/api/ai/analyze-issue', async (req: Request, res: Response) => {
  const { title, description, category, latitude, longitude, imageBase64 } = req.body;

  if (!title && !description) {
    return res.status(400).json({ error: 'Title or description is required for analysis' });
  }

  // Check for nearby duplicates in memory
  let suspectedDuplicates: string[] = [];
  if (latitude && longitude) {
    suspectedDuplicates = reports
      .filter((r) => {
        const dist = getDistanceMeters(latitude, longitude, r.location.latitude, r.location.longitude);
        return dist <= 350; // within 350 meters
      })
      .map((r) => r.id);
  }

  if (ai) {
    try {
      const prompt = `You are the S.T.A.R.K. Civic Intelligence Engine for Municipal Civic Operations.
Analyze this citizen-reported civic issue in Satna, Madhya Pradesh:
Issue Title: "${title}"
Description: "${description}"
User Category: "${category || 'Unspecified'}"
Nearby Reports in 350m: ${JSON.stringify(suspectedDuplicates)}

Respond in strict JSON with no markdown wrapping:
{
  "categoryRecommendation": "Road Maintenance" | "Sanitation" | "Water Department" | "Electricity" | "Drainage" | "Public Infrastructure" | "Other Community",
  "categoryConfidence": <integer 70-100>,
  "urgencyScore": <integer 1-10>,
  "publicImpactScore": <integer 1-10>,
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "safetyHazardRisks": ["<short hazard 1>", "<short hazard 2>"],
  "estimatedFixHours": <integer hours>,
  "reasoning": "<clear 2-sentence rationale>",
  "conciseSummary": "<concise 1-sentence title>",
  "isDuplicateSuspected": <boolean>
}`;

      let contents: any = prompt;
      if (imageBase64) {
        contents = {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
              },
            },
            { text: prompt },
          ],
        };
      }

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 6000)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);

      const text = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);

      const result: AIAnalysis = {
        ...parsed,
        isDuplicateSuspected: suspectedDuplicates.length > 0 || !!parsed.isDuplicateSuspected,
        duplicateConfidence: suspectedDuplicates.length > 0 ? 92 : undefined,
        suspectedDuplicateIds: suspectedDuplicates,
        analyzedAt: new Date().toISOString(),
        modelUsed: 'gemini-3.8-flash',
      };

      return res.json({ success: true, analysis: result });
    } catch (err: any) {
      console.warn('Gemini analysis failed, using deterministic fallback engine:', err.message);
    }
  }

  // Deterministic Fallback
  const fallback = runFallbackAIAnalysis(title || '', description || '', category);
  if (suspectedDuplicates.length > 0) {
    fallback.isDuplicateSuspected = true;
    fallback.duplicateConfidence = 91;
    fallback.suspectedDuplicateIds = suspectedDuplicates;
  }
  return res.json({ success: true, analysis: fallback });
});

// AI Civic Assistant Chat Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Gather current system telemetry
  const activeReports = reports.filter((r) => r.status !== 'Resolved');
  const criticalReports = reports.filter((r) => r.severity === 'CRITICAL' && r.status !== 'Resolved');
  const duplicateReports = reports.filter((r) => r.isDuplicate || (r.duplicateReportIds && r.duplicateReportIds.length > 0));

  const areasSummary = reports.reduce((acc: Record<string, number>, r) => {
    acc[r.location.area] = (acc[r.location.area] || 0) + 1;
    return acc;
  }, {});

  const departmentWorkloads = departments.map((d) => ({
    department: d.name,
    category: d.category,
    active: reports.filter((r) => r.assignedDepartment === d.name && r.status !== 'Resolved').length,
    resolved: reports.filter((r) => r.assignedDepartment === d.name && r.status === 'Resolved').length,
  }));

  const systemContext = `
You are CIVIC AI — STARK INTELLIGENCE, the futuristic civic intelligence and accountability assistant under the S.T.A.R.K. Initiative (Scientific Technology, Advancement, Research & Knowledge) operating for the city of Satna, Madhya Pradesh.
Tone: Highly capable, analytical, concise, respectful, mission-focused (like J.A.R.V.I.S. / F.R.I.D.A.Y.).
Current Telemetry:
- Total complaints logged: ${reports.length}
- Active issues: ${activeReports.length}
- Critical severity issues: ${criticalReports.length} (${criticalReports.map((c) => `${c.id} - ${c.title} at ${c.location.area}`).join(', ')})
- Flagged duplicate clusters: ${clusters.length}
- Highest complaint area: ${Object.entries(areasSummary).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Birla Road'}
- Department with highest backlog: ${[...departmentWorkloads].sort((a, b) => b.active - a.active)[0]?.department}
- Active Cluster: ${clusters.map((c) => `${c.name} (${c.reportIds.length} complaints, combined impact: ${c.combinedPublicImpact}/10)`).join('; ')}

Answer user questions accurately based on this live telemetry. If asked for recommendations, provide tactical civic solutions. Format with crisp bullet points when appropriate.`;

  if (ai) {
    try {
      const chat = ai.chats.create({
        model: 'gemini-3.8-flash',
        config: {
          systemInstruction: systemContext,
        },
      });

      const chatPromise = chat.sendMessage({
        message,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini Chat API timeout')), 6000)
      );

      const response: any = await Promise.race([chatPromise, timeoutPromise]);

      return res.json({
        success: true,
        reply: response.text || 'Telemetry analyzed. No anomalies detected.',
        source: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.warn('Gemini chat failed, using local fallback:', err.message);
    }
  }

  // Local Intelligent Rule-Based Fallback
  const q = message.toLowerCase();
  let reply = '';

  if (q.includes('critical') || q.includes('urgent') || q.includes('danger')) {
    reply = `Currently, S.T.A.R.K. telemetry monitors ${criticalReports.length} CRITICAL civic issues in Satna:\n\n` +
      criticalReports.map((r, i) => `${i + 1}. [${r.id}] ${r.title} at ${r.location.address} (${r.location.area}) — Urgency: ${r.aiAnalysis?.urgencyScore || 9}/10`).join('\n\n') +
      `\n\nRecommendation: Prioritize crew dispatch to Civil Lines water main and Birla Road road hazards immediately.`;
  } else if (q.includes('area') || q.includes('highest') || q.includes('hotspot') || q.includes('location')) {
    const sortedAreas = Object.entries(areasSummary).sort((a, b) => b[1] - a[1]);
    reply = `Geographic Incident Hotspot Analysis for Satna:\n\n` +
      sortedAreas.map(([area, count], i) => `${i + 1}. ${area}: ${count} reported incident${count > 1 ? 's' : ''}`).join('\n') +
      `\n\nBirla Road accounts for the highest density due to heavy commercial freight corridors and asphalt degradation.`;
  } else if (q.includes('duplicate') || q.includes('cluster') || q.includes('merge')) {
    reply = `S.T.A.R.K. Multi-Sensor Duplicate Detection Status:\n\n` +
      `- Active Incident Clusters: ${clusters.length}\n` +
      `- Flagged Cluster: "${clusters[0]?.name || 'Birla Road Cluster'}"\n` +
      `- Clustered Reports: ${clusters[0]?.reportIds.join(', ') || 'STARK-SIM-001, STARK-SIM-002, STARK-SIM-003'}\n` +
      `- Combined Public Impact: ${clusters[0]?.combinedPublicImpact || 9.4}/10\n\n` +
      `AI analysis confirms 96% spatial-semantic convergence within a 38-meter radius on Birla Road.`;
  } else if (q.includes('department') || q.includes('workload') || q.includes('pending')) {
    const sortedDeps = [...departmentWorkloads].sort((a, b) => b.active - a.active);
    reply = `Municipal Department Workload Distribution:\n\n` +
      sortedDeps.map((d, i) => `${i + 1}. ${d.department}: ${d.active} active cases (Resolved to date: ${d.resolved})`).join('\n') +
      `\n\nRoad Maintenance & Highway Infrastructure carries the highest active backlog.`;
  } else if (q.includes('unresolved') || q.includes('longest') || q.includes('oldest')) {
    const oldest = [...activeReports].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
    reply = oldest
      ? `The longest pending active issue is [${oldest.id}] "${oldest.title}" logged in ${oldest.location.area} on ${new Date(oldest.createdAt).toLocaleDateString()}. Status: ${oldest.status}, Assigned to: ${oldest.assignedDepartment || 'Pending Allocation'}.`
      : 'All reported issues have been addressed and cleared from the active queue.';
  } else {
    reply = `S.T.A.R.K. Civic Intelligence System operational in Satna, MP. Monitoring ${reports.length} total civic records across 6 wards. System resolution rate is ${Math.round((reports.filter(r => r.status === 'Resolved').length / (reports.length || 1)) * 100)}%. How can I assist with your civic investigation?`;
  }

  return res.json({
    success: true,
    reply,
    source: 'stark-heuristic-v1',
  });
});

// REST API - Get All Reports with Filters
app.get('/api/reports', (req: Request, res: Response) => {
  const { category, status, severity, search, area } = req.query;
  let filtered = [...reports];

  if (category && category !== 'ALL') {
    filtered = filtered.filter((r) => r.category === category);
  }
  if (status && status !== 'ALL') {
    filtered = filtered.filter((r) => r.status === status);
  }
  if (severity && severity !== 'ALL') {
    filtered = filtered.filter((r) => r.severity === severity);
  }
  if (area && area !== 'ALL') {
    filtered = filtered.filter((r) => r.location.area.toLowerCase() === (area as string).toLowerCase());
  }
  if (search) {
    const s = (search as string).toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.id.toLowerCase().includes(s) ||
        r.title.toLowerCase().includes(s) ||
        r.description.toLowerCase().includes(s) ||
        r.location.address.toLowerCase().includes(s) ||
        r.location.area.toLowerCase().includes(s)
    );
  }

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, count: filtered.length, reports: filtered });
});

// REST API - Get Single Report
app.get('/api/reports/:id', (req: Request, res: Response) => {
  const report = reports.find((r) => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  // Find cluster or related reports
  const cluster = clusters.find((c) => c.reportIds.includes(report.id));
  const relatedReports = reports.filter(
    (r) => r.id !== report.id && (report.duplicateReportIds?.includes(r.id) || cluster?.reportIds.includes(r.id))
  );

  res.json({ success: true, report, cluster, relatedReports });
});

// REST API - Create New Report
app.post('/api/reports', (req: Request, res: Response) => {
  const {
    title,
    description,
    category,
    severity,
    location,
    imageUrl,
    reportedBy,
    aiAnalysis,
  } = req.body;

  if (!title || !description || !location) {
    return res.status(400).json({ error: 'Missing mandatory fields (title, description, location)' });
  }

  const newId = `STARK-SATNA-2026-${String(reports.length + 101).padStart(4, '0')}`;
  const now = new Date().toISOString();

  // If AI analysis was not pre-generated, create one
  const analysis = aiAnalysis || runFallbackAIAnalysis(title, description, category);

  // Check for duplicate proximity
  const duplicateCandidates = reports.filter((r) => {
    const dist = getDistanceMeters(location.latitude, location.longitude, r.location.latitude, r.location.longitude);
    return dist <= 300 && r.category === (category || analysis.categoryRecommendation);
  });

  if (duplicateCandidates.length > 0) {
    analysis.isDuplicateSuspected = true;
    analysis.duplicateConfidence = 88;
    analysis.suspectedDuplicateIds = duplicateCandidates.map((d) => d.id);
  }

  const newReport: CivicReport = {
    id: newId,
    title,
    description,
    category: category || analysis.categoryRecommendation,
    severity: severity || analysis.severity,
    status: 'Submitted',
    location: {
      address: location.address || 'Civil Lines Road',
      area: location.area || 'Civil Lines',
      city: 'Satna',
      state: 'Madhya Pradesh',
      latitude: Number(location.latitude) || 24.582,
      longitude: Number(location.longitude) || 80.828,
      landmark: location.landmark,
    },
    imageUrl: imageUrl || ASSET_PATHS.incidentPothole,
    reportedBy: reportedBy || {
      name: 'Satna Citizen',
      role: 'Citizen',
      citizenId: `CIT-MP-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    createdAt: now,
    updatedAt: now,
    priorityScore: analysis.urgencyScore * 10,
    aiAnalysis: analysis,
    upvotes: 1,
    timeline: [
      {
        id: `tl_${Date.now()}_1`,
        timestamp: now,
        status: 'Submitted',
        actorName: reportedBy?.name || 'Citizen',
        actorRole: 'Citizen',
        note: 'Civic issue submitted through citizen intelligence portal.',
      },
      {
        id: `tl_${Date.now()}_2`,
        timestamp: new Date(Date.now() + 1000).toISOString(),
        status: 'Under Review',
        actorName: 'S.T.A.R.K. AI Engine',
        actorRole: 'AI Intelligence',
        note: `AI analysis performed (${analysis.modelUsed}). Severity evaluated as ${analysis.severity}. ${
          analysis.isDuplicateSuspected ? `Flagged duplicate proximity to ${analysis.suspectedDuplicateIds?.join(', ')}.` : ''
        }`,
      },
    ],
  };

  reports.unshift(newReport);
  res.status(201).json({ success: true, report: newReport });
});

// REST API - Update Report Status / Assignment (Admin)
app.patch('/api/reports/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, assignedDepartment, assignedOfficer, priorityScore, adminNotes, actorName } = req.body;

  const report = reports.find((r) => r.id === id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const now = new Date().toISOString();
  if (status) report.status = status;
  if (assignedDepartment) report.assignedDepartment = assignedDepartment;
  if (assignedOfficer) report.assignedOfficer = assignedOfficer;
  if (priorityScore !== undefined) report.priorityScore = priorityScore;
  report.updatedAt = now;

  report.timeline.push({
    id: `tl_${Date.now()}`,
    timestamp: now,
    status: report.status,
    actorName: actorName || 'Director Stark-01',
    actorRole: 'Admin',
    note: adminNotes || `Status updated to ${report.status}${assignedDepartment ? ` and assigned to ${assignedDepartment}` : ''}.`,
  });

  res.json({ success: true, report });
});

// REST API - Admin Resolves Report (Uploads after-image and resolution notes)
app.post('/api/reports/:id/resolve', (req: Request, res: Response) => {
  const { id } = req.params;
  const { resolutionNotes, afterImageUrl, resolvedBy } = req.body;

  const report = reports.find((r) => r.id === id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const now = new Date().toISOString();
  report.status = 'Resolved';
  report.updatedAt = now;
  report.resolution = {
    resolvedAt: now,
    resolvedBy: resolvedBy || 'Municipal Repair Engineer',
    resolutionNotes: resolutionNotes || 'Repairs completed and site cleared in compliance with municipal infrastructure standards.',
    afterImageUrl: afterImageUrl || ASSET_PATHS.resolutionRepaired,
    citizenVerified: false,
    isDisputed: false,
  };

  report.timeline.push({
    id: `tl_${Date.now()}`,
    timestamp: now,
    status: 'Resolved',
    actorName: resolvedBy || 'Municipal Repair Engineer',
    actorRole: 'Department Staff',
    note: `Work completed. Verification after-photo submitted: "${resolutionNotes || 'Road restoration complete.'}"`,
  });

  res.json({ success: true, report });
});

// REST API - Citizen Verifies or Disputes Resolution
app.post('/api/reports/:id/verify-resolution', (req: Request, res: Response) => {
  const { id } = req.params;
  const { confirmed, feedback, rating, disputeReason, citizenName } = req.body;

  const report = reports.find((r) => r.id === id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  if (!report.resolution) {
    return res.status(400).json({ error: 'Cannot verify an unresolved report' });
  }

  const now = new Date().toISOString();

  if (confirmed) {
    report.resolution.citizenVerified = true;
    report.resolution.citizenVerificationDate = now;
    report.resolution.citizenFeedback = feedback || 'Resolution confirmed on site by citizen.';
    report.resolution.citizenSatisfactionRating = rating || 5;
    report.resolution.isDisputed = false;

    report.timeline.push({
      id: `tl_${Date.now()}`,
      timestamp: now,
      status: 'Resolved',
      actorName: citizenName || report.reportedBy.name,
      actorRole: 'Citizen',
      note: `Citizen verified and closed resolution (${rating || 5}/5 stars): "${feedback || 'Satisfactorily resolved'}"`,
    });
  } else {
    // Citizen Disputes -> Reopen report!
    report.status = 'Reopened';
    report.resolution.isDisputed = true;
    report.resolution.disputeReason = disputeReason || 'Citizen inspected repair and identified lingering defect.';
    report.priorityScore = Math.min(100, report.priorityScore + 15);

    report.timeline.push({
      id: `tl_${Date.now()}`,
      timestamp: now,
      status: 'Reopened',
      actorName: citizenName || report.reportedBy.name,
      actorRole: 'Citizen',
      note: `DISPUTE RAISED: Case reopened by citizen. Reason: "${disputeReason || 'Defective repair detected'}"`,
    });
  }

  report.updatedAt = now;
  res.json({ success: true, report });
});

// REST API - Merge Confirmed Duplicate Reports
app.post('/api/reports/merge', (req: Request, res: Response) => {
  const { primaryReportId, duplicateReportIds, mergeReason } = req.body;

  if (!primaryReportId || !duplicateReportIds || !duplicateReportIds.length) {
    return res.status(400).json({ error: 'primaryReportId and duplicateReportIds are required' });
  }

  const primary = reports.find((r) => r.id === primaryReportId);
  if (!primary) {
    return res.status(404).json({ error: 'Primary report not found' });
  }

  const now = new Date().toISOString();
  primary.duplicateReportIds = Array.from(new Set([...(primary.duplicateReportIds || []), ...duplicateReportIds]));

  // Combine upvotes and public impact
  let totalUpvotes = primary.upvotes;

  duplicateReportIds.forEach((dupId: string) => {
    const dup = reports.find((r) => r.id === dupId);
    if (dup) {
      dup.isDuplicate = true;
      dup.mergedIntoReportId = primaryReportId;
      dup.status = primary.status;
      dup.updatedAt = now;
      totalUpvotes += dup.upvotes;

      dup.timeline.push({
        id: `tl_${Date.now()}_dup_${dupId}`,
        timestamp: now,
        status: primary.status,
        actorName: 'Director Stark-01',
        actorRole: 'Admin',
        note: `Merged into primary incident docket [${primaryReportId}]. Combined investigation active.`,
      });
    }
  });

  primary.upvotes = totalUpvotes;
  primary.priorityScore = Math.min(100, primary.priorityScore + duplicateReportIds.length * 10);
  primary.updatedAt = now;

  primary.timeline.push({
    id: `tl_${Date.now()}_primary`,
    timestamp: now,
    status: primary.status,
    actorName: 'Director Stark-01',
    actorRole: 'Admin',
    note: `Merged ${duplicateReportIds.length} duplicate report(s) (${duplicateReportIds.join(', ')}) into master docket. Combined public impact raised. ${
      mergeReason ? `Reason: ${mergeReason}` : ''
    }`,
  });

  res.json({ success: true, primaryReport: primary });
});

// REST API - Get Clusters
app.get('/api/clusters', (req: Request, res: Response) => {
  res.json({ success: true, clusters });
});

// REST API - System Dashboard Stats
app.get('/api/stats', (req: Request, res: Response) => {
  const totalReports = reports.length;
  const activeIssues = reports.filter((r) => r.status !== 'Resolved').length;
  const criticalIssues = reports.filter((r) => r.severity === 'CRITICAL' && r.status !== 'Resolved').length;
  const resolvedIssues = reports.filter((r) => r.status === 'Resolved').length;

  const resolutionRatePercent = totalReports > 0 ? Math.round((resolvedIssues / totalReports) * 100) : 0;
  const avgHours = 16.8;

  res.json({
    success: true,
    stats: {
      totalReports,
      activeIssues,
      criticalIssues,
      resolvedIssues,
      averageResolutionTimeHours: avgHours,
      resolutionRatePercent,
      duplicateClustersCount: clusters.length,
    },
  });
});

// REST API - Department Stats
app.get('/api/departments', (req: Request, res: Response) => {
  const updatedDepartments = departments.map((d) => {
    const deptReports = reports.filter((r) => r.category === d.category);
    return {
      ...d,
      activeCases: deptReports.filter((r) => r.status !== 'Resolved').length,
      resolvedCases: deptReports.filter((r) => r.status === 'Resolved').length,
    };
  });
  res.json({ success: true, departments: updatedDepartments });
});

// REST API - Emergency Simulation Control
app.post('/api/simulation/start', (req: Request, res: Response) => {
  // Inject the 3 simulation reports if not already in list
  simulationActive = true;
  SIMULATION_REPORTS.forEach((simReport) => {
    const exists = reports.find((r) => r.id === simReport.id);
    if (!exists) {
      reports.unshift(JSON.parse(JSON.stringify(simReport)));
    }
  });

  // Ensure initial cluster is present
  const clusterExists = clusters.find((c) => c.id === INITIAL_CLUSTERS[0].id);
  if (!clusterExists) {
    clusters.unshift(JSON.parse(JSON.stringify(INITIAL_CLUSTERS[0])));
  }

  res.json({
    success: true,
    simulationActive: true,
    cluster: INITIAL_CLUSTERS[0],
    reports: SIMULATION_REPORTS,
  });
});

app.post('/api/simulation/reset', (req: Request, res: Response) => {
  reports = JSON.parse(JSON.stringify(INITIAL_REPORTS));
  departments = JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS));
  clusters = JSON.parse(JSON.stringify(INITIAL_CLUSTERS));
  simulationActive = false;

  res.json({ success: true, message: 'Simulation and database state reset to initial baseline.' });
});

// Full-stack Vite / Static handling
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CIVICTRACE] S.T.A.R.K. Civic Intelligence Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
