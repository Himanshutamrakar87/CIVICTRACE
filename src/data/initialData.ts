import { CivicReport, DepartmentStats, IncidentCluster, UserProfile } from '../types/civic';

export const ASSET_PATHS = {
  heroCommandCenter: '/src/assets/images/hero_command_center_1794236700578.jpg',
  incidentPothole: '/src/assets/images/incident_pothole_hazard_1794236701341.jpg',
  incidentWater: '/src/assets/images/incident_water_pipeline_1794236701963.jpg',
  resolutionRepaired: '/src/assets/images/resolution_road_repaired_1794236703401.jpg',
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_citizen_01',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@satna-citizens.org',
    role: 'Citizen',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav'
  },
  {
    id: 'usr_admin_01',
    name: 'Director Stark-01 (Vikram Patel)',
    email: 'commissioner@satna.municipal.gov.in',
    role: 'Admin',
    department: 'S.T.A.R.K. Civic Operations Command',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=StarkDirector'
  }
];

export const INITIAL_DEPARTMENTS: DepartmentStats[] = [
  {
    name: 'Road Maintenance & Highway Infrastructure',
    category: 'Road Maintenance',
    headOfficer: 'Eng. Rajesh Verma',
    activeCases: 7,
    resolvedCases: 42,
    avgResolutionHours: 19.5,
    satisfactionRate: 88
  },
  {
    name: 'Sanitation & Solid Waste Management',
    category: 'Sanitation',
    headOfficer: 'Dr. Sunita Dwivedi',
    activeCases: 4,
    resolvedCases: 56,
    avgResolutionHours: 12.0,
    satisfactionRate: 91
  },
  {
    name: 'Municipal Water Works & Supply',
    category: 'Water Department',
    headOfficer: 'Chief Tech. Arvind Gupta',
    activeCases: 3,
    resolvedCases: 38,
    avgResolutionHours: 14.2,
    satisfactionRate: 85
  },
  {
    name: 'City Power Grid & Street Lighting',
    category: 'Electricity',
    headOfficer: 'Eng. Meera Tiwari',
    activeCases: 5,
    resolvedCases: 49,
    avgResolutionHours: 10.5,
    satisfactionRate: 94
  },
  {
    name: 'Storm Drainage & Sewage Control',
    category: 'Drainage',
    headOfficer: 'Inspector Manoj Singh',
    activeCases: 3,
    resolvedCases: 31,
    avgResolutionHours: 24.0,
    satisfactionRate: 82
  },
  {
    name: 'Public Infrastructure & Parks',
    category: 'Public Infrastructure',
    headOfficer: 'Officer Alok Srivastava',
    activeCases: 2,
    resolvedCases: 27,
    avgResolutionHours: 28.5,
    satisfactionRate: 89
  }
];

export const INITIAL_REPORTS: CivicReport[] = [
  {
    id: 'STARK-SATNA-2026-0101',
    title: 'Severe High-Pressure Water Main Burst Flooding Tarmac',
    description: 'Underground feeder water pipe ruptured near Civil Lines crossing. Clean municipal water is gushing across 60 meters of road, creating deep pooling and weakening road sub-base.',
    category: 'Water Department',
    severity: 'CRITICAL',
    status: 'In Progress',
    location: {
      address: 'Main Collectorate Road, Opp. District Court',
      area: 'Civil Lines',
      city: 'Satna',
      state: 'Madhya Pradesh',
      latitude: 24.5752,
      longitude: 80.8214,
      landmark: 'Near District Collectorate Gate'
    },
    imageUrl: ASSET_PATHS.incidentWater,
    reportedBy: {
      name: 'Dr. Ananya Mishra',
      phone: '+91 98261 44520',
      email: 'ananya.mishra@satna.org',
      role: 'Citizen',
      citizenId: 'CIT-MP-0914'
    },
    createdAt: '2026-11-09T03:15:00.000Z',
    updatedAt: '2026-11-09T05:30:00.000Z',
    assignedDepartment: 'Municipal Water Works & Supply',
    assignedOfficer: 'Chief Tech. Arvind Gupta',
    priorityScore: 92,
    upvotes: 28,
    aiAnalysis: {
      categoryRecommendation: 'Water Department',
      categoryConfidence: 98,
      urgencyScore: 9,
      publicImpactScore: 9,
      severity: 'CRITICAL',
      safetyHazardRisks: [
        'Major loss of treated drinking water (est. 12,000L/hr)',
        'Erosion of bitumen asphalt foundation risking road subsidence',
        'Hydroplaning collision risk for two-wheelers'
      ],
      estimatedFixHours: 6,
      reasoning: 'Image and telemetry confirm high-velocity potable water release directly beneath arterial carriageway. Urgent valve isolation required.',
      conciseSummary: 'Pressurized water main rupture causing street flooding and asphalt sub-base erosion.',
      isDuplicateSuspected: false,
      analyzedAt: '2026-11-09T03:16:12.000Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      {
        id: 'tl_101_1',
        timestamp: '2026-11-09T03:15:00.000Z',
        status: 'Submitted',
        actorName: 'Dr. Ananya Mishra',
        actorRole: 'Citizen',
        note: 'Complaint registered with high-resolution photo.'
      },
      {
        id: 'tl_101_2',
        timestamp: '2026-11-09T03:16:15.000Z',
        status: 'Under Review',
        actorName: 'S.T.A.R.K. AI Engine',
        actorRole: 'AI Intelligence',
        note: 'AI classified as Water Department (98% confidence). Flagged as CRITICAL safety hazard.'
      },
      {
        id: 'tl_101_3',
        timestamp: '2026-11-09T04:00:00.000Z',
        status: 'Assigned',
        actorName: 'Director Stark-01',
        actorRole: 'Admin',
        note: 'Dispatched emergency excavation crew under Chief Tech. Arvind Gupta.'
      },
      {
        id: 'tl_101_4',
        timestamp: '2026-11-09T05:30:00.000Z',
        status: 'In Progress',
        actorName: 'Chief Tech. Arvind Gupta',
        actorRole: 'Department Staff',
        note: 'Zone sluice valve shut. Heavy excavation in progress to replace ruptured 8-inch cast iron pipe section.'
      }
    ]
  },
  {
    id: 'STARK-SATNA-2026-0102',
    title: 'Cracked Road Carriageway and Bitumen Collapse Near Railway Crossing',
    description: 'Heavy truck traffic has caused complete fracture of the road surface. Multiple deep asphalt cavities threatening two-wheelers and night traffic.',
    category: 'Road Maintenance',
    severity: 'HIGH',
    status: 'Resolved',
    location: {
      address: 'Birla Road, Junction with Station Access Way',
      area: 'Birla Road',
      city: 'Satna',
      state: 'Madhya Pradesh',
      latitude: 24.5886,
      longitude: 80.8348,
      landmark: 'Near Birla Cement Siding Gate'
    },
    imageUrl: ASSET_PATHS.incidentPothole,
    reportedBy: {
      name: 'Rohan Verma',
      phone: '+91 94251 88319',
      email: 'rohan.verma@email.com',
      role: 'Citizen',
      citizenId: 'CIT-MP-4481'
    },
    createdAt: '2026-11-08T09:00:00.000Z',
    updatedAt: '2026-11-09T02:00:00.000Z',
    assignedDepartment: 'Road Maintenance & Highway Infrastructure',
    assignedOfficer: 'Eng. Rajesh Verma',
    priorityScore: 86,
    upvotes: 43,
    aiAnalysis: {
      categoryRecommendation: 'Road Maintenance',
      categoryConfidence: 96,
      urgencyScore: 8,
      publicImpactScore: 8,
      severity: 'HIGH',
      safetyHazardRisks: [
        'Vehicle suspension damage',
        'High rollover probability for heavy auto-rickshaws at night'
      ],
      estimatedFixHours: 12,
      reasoning: 'Severe alligator cracking and deep crater located on high-volume commercial route.',
      conciseSummary: 'Deep asphalt road crater on Birla Road commercial artery.',
      isDuplicateSuspected: false,
      analyzedAt: '2026-11-08T09:02:00.000Z',
      modelUsed: 'gemini-3.8-flash'
    },
    resolution: {
      resolvedAt: '2026-11-08T22:30:00.000Z',
      resolvedBy: 'Eng. Rajesh Verma (Road Works)',
      resolutionNotes: 'Excavated 150mm damaged base, re-compacted stone aggregate, and hot-mix asphalt laid and roller-compacted. Restored to highway standards.',
      afterImageUrl: ASSET_PATHS.resolutionRepaired,
      citizenVerified: true,
      citizenVerificationDate: '2026-11-09T02:00:00.000Z',
      citizenFeedback: 'Verified in person this morning. The road is completely smooth and repaired properly. Excellent accountability!',
      citizenSatisfactionRating: 5,
      isDisputed: false
    },
    timeline: [
      {
        id: 'tl_102_1',
        timestamp: '2026-11-08T09:00:00.000Z',
        status: 'Submitted',
        actorName: 'Rohan Verma',
        actorRole: 'Citizen',
        note: 'Reported with photos of dangerous crater.'
      },
      {
        id: 'tl_102_2',
        timestamp: '2026-11-08T09:05:00.000Z',
        status: 'Verified',
        actorName: 'S.T.A.R.K. AI Engine',
        actorRole: 'AI Intelligence',
        note: 'Verified with HIGH severity and queued for rapid asphalt patching.'
      },
      {
        id: 'tl_102_3',
        timestamp: '2026-11-08T11:00:00.000Z',
        status: 'In Progress',
        actorName: 'Eng. Rajesh Verma',
        actorRole: 'Department Staff',
        note: 'Road repair team mobilized with roller machine.'
      },
      {
        id: 'tl_102_4',
        timestamp: '2026-11-08T22:30:00.000Z',
        status: 'Resolved',
        actorName: 'Eng. Rajesh Verma',
        actorRole: 'Department Staff',
        note: 'Asphalt paving completed. Official after-photo uploaded.'
      },
      {
        id: 'tl_102_5',
        timestamp: '2026-11-09T02:00:00.000Z',
        status: 'Resolved',
        actorName: 'Rohan Verma',
        actorRole: 'Citizen',
        note: 'Citizen verified resolution on-site with 5-star rating.'
      }
    ]
  },
  {
    id: 'STARK-SATNA-2026-0103',
    title: 'Overflowing Municipal Garbage Dump Blocking Pedestrian Walkway',
    description: 'Community garbage dumpster has not been cleared for 4 days. Waste spilled onto street, creating foul odor, stray cattle hazard, and blocking school walking path.',
    category: 'Sanitation',
    severity: 'MEDIUM',
    status: 'Assigned',
    location: {
      address: 'Near Government High School, Dhawari Chowk',
      area: 'Dhawari',
      city: 'Satna',
      state: 'Madhya Pradesh',
      latitude: 24.5841,
      longitude: 80.8122,
      landmark: 'Next to Dhawari Community Park'
    },
    reportedBy: {
      name: 'Pooja Tiwari',
      phone: '+91 97551 22910',
      email: 'pooja.tiwari@gmail.com',
      role: 'Citizen',
      citizenId: 'CIT-MP-7721'
    },
    createdAt: '2026-11-09T01:30:00.000Z',
    updatedAt: '2026-11-09T04:10:00.000Z',
    assignedDepartment: 'Sanitation & Solid Waste Management',
    assignedOfficer: 'Dr. Sunita Dwivedi',
    priorityScore: 68,
    upvotes: 19,
    aiAnalysis: {
      categoryRecommendation: 'Sanitation',
      categoryConfidence: 99,
      urgencyScore: 6,
      publicImpactScore: 7,
      severity: 'MEDIUM',
      safetyHazardRisks: [
        'Biological contamination and stray animal hazards near school zone',
        'Pedestrian diversion into moving vehicle lane'
      ],
      estimatedFixHours: 4,
      reasoning: 'Solid waste accumulation blocking public right-of-way adjacent to educational institution.',
      conciseSummary: 'Uncollected community dumpster overflowing into public road.',
      isDuplicateSuspected: false,
      analyzedAt: '2026-11-09T01:32:00.000Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      {
        id: 'tl_103_1',
        timestamp: '2026-11-09T01:30:00.000Z',
        status: 'Submitted',
        actorName: 'Pooja Tiwari',
        actorRole: 'Citizen',
        note: 'Reported garbage obstruction.'
      },
      {
        id: 'tl_103_2',
        timestamp: '2026-11-09T04:10:00.000Z',
        status: 'Assigned',
        actorName: 'Director Stark-01',
        actorRole: 'Admin',
        note: 'Assigned to Ward 14 sanitation truck route.'
      }
    ]
  },
  {
    id: 'STARK-SATNA-2026-0104',
    title: 'Series of 6 Dead Streetlights Creating Dark Hazard Corridor',
    description: 'Six consecutive LED poles are non-functional on Station Road between Bus Stand and Main Station roundabout. Complete blackout at night has caused multiple vehicle collisions.',
    category: 'Electricity',
    severity: 'HIGH',
    status: 'Verified',
    location: {
      address: 'Station Road, Corridor Between Bus Stand and Railway Station',
      area: 'Station Road',
      city: 'Satna',
      state: 'Madhya Pradesh',
      latitude: 24.5862,
      longitude: 80.8319,
      landmark: 'Near Railway Goods Yard'
    },
    reportedBy: {
      name: 'Mohit Agrawal',
      phone: '+91 91112 34455',
      email: 'mohit.a@satna.org',
      role: 'Citizen',
      citizenId: 'CIT-MP-3890'
    },
    createdAt: '2026-11-08T18:45:00.000Z',
    updatedAt: '2026-11-09T02:15:00.000Z',
    assignedDepartment: 'City Power Grid & Street Lighting',
    assignedOfficer: 'Eng. Meera Tiwari',
    priorityScore: 81,
    upvotes: 35,
    aiAnalysis: {
      categoryRecommendation: 'Electricity',
      categoryConfidence: 97,
      urgencyScore: 8,
      publicImpactScore: 8,
      severity: 'HIGH',
      safetyHazardRisks: [
        'Total blackout on dense transit artery',
        'Pedestrian mugging and hit-and-run risk',
        'Faulty line phase possibly short-circuiting'
      ],
      estimatedFixHours: 5,
      reasoning: 'Cluster failure of multiple luminaires indicates underground feeder cable fault rather than individual bulb burnout.',
      conciseSummary: 'Multiple consecutive streetlights failed along Station Road transit artery.',
      isDuplicateSuspected: false,
      analyzedAt: '2026-11-08T18:46:30.000Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      {
        id: 'tl_104_1',
        timestamp: '2026-11-08T18:45:00.000Z',
        status: 'Submitted',
        actorName: 'Mohit Agrawal',
        actorRole: 'Citizen',
        note: 'Reported total corridor blackout.'
      },
      {
        id: 'tl_104_2',
        timestamp: '2026-11-09T02:15:00.000Z',
        status: 'Verified',
        actorName: 'S.T.A.R.K. AI Engine',
        actorRole: 'AI Intelligence',
        note: 'Phase diagnostic flagged feeder line fault; severity verified as HIGH.'
      }
    ]
  },
  {
    id: 'STARK-SATNA-2026-0105',
    title: 'Clogged Monsoon Drain Causing Sewage Overflow in Residential Colony',
    description: 'Main concrete storm drain is choked with construction debris and plastic. Black sewage water has backed up and flooded residential basements.',
    category: 'Drainage',
    severity: 'MEDIUM',
    status: 'In Progress',
    location: {
      address: 'Gali No. 4, Bharhut Nagar Extension',
      area: 'Bharhut Nagar',
      city: 'Satna',
      state: 'Madhya Pradesh',
      latitude: 24.5718,
      longitude: 80.8402,
      landmark: 'Behind Shiv Mandir'
    },
    reportedBy: {
      name: 'Sunil Sen',
      phone: '+91 93005 66781',
      email: 'sunil.sen@yahoo.com',
      role: 'Citizen',
      citizenId: 'CIT-MP-6211'
    },
    createdAt: '2026-11-08T14:20:00.000Z',
    updatedAt: '2026-11-09T04:45:00.000Z',
    assignedDepartment: 'Storm Drainage & Sewage Control',
    assignedOfficer: 'Inspector Manoj Singh',
    priorityScore: 74,
    upvotes: 16,
    aiAnalysis: {
      categoryRecommendation: 'Drainage',
      categoryConfidence: 95,
      urgencyScore: 7,
      publicImpactScore: 7,
      severity: 'MEDIUM',
      safetyHazardRisks: [
        'Pathogen spread and dengue mosquito breeding ground',
        'Structural water seepage into adjacent masonry'
      ],
      estimatedFixHours: 8,
      reasoning: 'Drain blockage preventing storm drainage egress, posing public health threat.',
      conciseSummary: 'Monsoon drain blocked by silt and plastics causing local sewage backup.',
      isDuplicateSuspected: false,
      analyzedAt: '2026-11-08T14:22:00.000Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      {
        id: 'tl_105_1',
        timestamp: '2026-11-08T14:20:00.000Z',
        status: 'Submitted',
        actorName: 'Sunil Sen',
        actorRole: 'Citizen',
        note: 'Complaint filed with video footage of backed-up drain.'
      },
      {
        id: 'tl_105_2',
        timestamp: '2026-11-09T04:45:00.000Z',
        status: 'In Progress',
        actorName: 'Inspector Manoj Singh',
        actorRole: 'Department Staff',
        note: 'Suction jetting tanker and suction pipe deployed on site.'
      }
    ]
  }
];

// The 3 Reports of the "STARK CIVIC EMERGENCY SIMULATION"
// All 3 report the same critical pothole near Birla Road / Railway crossing:
export const SIMULATION_REPORTS: CivicReport[] = [
  {
    id: 'STARK-SIM-001',
    title: 'Deep Hazardous Asphalt Pothole on Birla Road Arterial Way',
    description: 'Extremely deep pothole measuring approx 1.8 meters across and 15cm deep right in the central traffic lane of Birla Road. Heavy commercial trucks are swerving into oncoming traffic.',
    category: 'Road Maintenance',
    severity: 'HIGH',
    status: 'Submitted',
    location: {
      address: 'Birla Road, 50m North of Cement Depot Crossing',
      area: 'Birla Road',
      city: 'Satna',
      state: 'Madhya Pradesh',
      latitude: 24.5891,
      longitude: 80.8354,
      landmark: 'Opposite Truck Weighing Scale'
    },
    imageUrl: ASSET_PATHS.incidentPothole,
    reportedBy: {
      name: 'Aarav Sharma',
      phone: '+91 98261 10001',
      email: 'aarav.sharma@satna-citizens.org',
      role: 'Citizen',
      citizenId: 'CIT-MP-1001'
    },
    createdAt: '2026-11-09T06:05:00.000Z',
    updatedAt: '2026-11-09T06:05:00.000Z',
    priorityScore: 84,
    upvotes: 18,
    aiAnalysis: {
      categoryRecommendation: 'Road Maintenance',
      categoryConfidence: 98,
      urgencyScore: 8,
      publicImpactScore: 8,
      severity: 'HIGH',
      safetyHazardRisks: ['Severe vehicle axle damage', 'High risk of head-on collisions due to sudden lane veering'],
      estimatedFixHours: 8,
      reasoning: 'Major structural pavement breach on high-load transit corridor.',
      conciseSummary: 'Deep asphalt crater causing hazardous vehicular swerving on Birla Road.',
      isDuplicateSuspected: false,
      analyzedAt: '2026-11-09T06:05:30.000Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      {
        id: 'tl_sim_1_1',
        timestamp: '2026-11-09T06:05:00.000Z',
        status: 'Submitted',
        actorName: 'Aarav Sharma',
        actorRole: 'Citizen',
        note: 'Reported primary pothole incident with photo evidence.'
      }
    ]
  },
  {
    id: 'STARK-SIM-002',
    title: 'Severe Damaged Road Surface and Cave-in on Birla Highway',
    description: 'Road surface broken apart near the cement siding. Deep pit in the tarmac is breaking car tires. Requires urgent repair before evening peak traffic.',
    category: 'Road Maintenance',
    severity: 'HIGH',
    status: 'Submitted',
    location: {
      address: 'Birla Road, near Cement Depot Gate',
      area: 'Birla Road',
      city: 'Satna',
      state: 'Madhya Pradesh',
      latitude: 24.5893,
      longitude: 80.8356,
      landmark: 'Near Cement Siding'
    },
    imageUrl: ASSET_PATHS.incidentPothole,
    reportedBy: {
      name: 'Priya Patel',
      phone: '+91 98261 10002',
      email: 'priya.patel@gmail.com',
      role: 'Citizen',
      citizenId: 'CIT-MP-1002'
    },
    createdAt: '2026-11-09T06:12:00.000Z',
    updatedAt: '2026-11-09T06:12:00.000Z',
    priorityScore: 85,
    upvotes: 14,
    aiAnalysis: {
      categoryRecommendation: 'Road Maintenance',
      categoryConfidence: 97,
      urgencyScore: 8,
      publicImpactScore: 8,
      severity: 'HIGH',
      safetyHazardRisks: ['Tire blowouts', 'Traffic deadlock'],
      estimatedFixHours: 8,
      reasoning: 'Broken road surface within 28m of prior report STARK-SIM-001. High probability of duplicate.',
      conciseSummary: 'Broken bitumen crater on Birla Road near cement siding.',
      isDuplicateSuspected: true,
      duplicateConfidence: 94,
      suspectedDuplicateIds: ['STARK-SIM-001'],
      analyzedAt: '2026-11-09T06:12:20.000Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      {
        id: 'tl_sim_2_1',
        timestamp: '2026-11-09T06:12:00.000Z',
        status: 'Submitted',
        actorName: 'Priya Patel',
        actorRole: 'Citizen',
        note: 'Filed second complaint on the same road section.'
      }
    ]
  },
  {
    id: 'STARK-SIM-003',
    title: 'Dangerous Deep Crater Creating Extreme Traffic Bottleneck & Near Misses',
    description: 'Two motorbikes almost crashed dodging a huge crater in the road right in front of the weigh scale on Birla Road. Water and loose gravel scattered across the lane.',
    category: 'Road Maintenance',
    severity: 'CRITICAL',
    status: 'Submitted',
    location: {
      address: 'Birla Road, Opp Weigh Scale',
      area: 'Birla Road',
      city: 'Satna',
      state: 'Madhya Pradesh',
      latitude: 24.5890,
      longitude: 80.8353,
      landmark: 'Opp Truck Weighing Scale'
    },
    imageUrl: ASSET_PATHS.incidentPothole,
    reportedBy: {
      name: 'Rohan Verma',
      phone: '+91 98261 10003',
      email: 'rohan.verma@satna.org',
      role: 'Citizen',
      citizenId: 'CIT-MP-1003'
    },
    createdAt: '2026-11-09T06:20:00.000Z',
    updatedAt: '2026-11-09T06:20:00.000Z',
    priorityScore: 94,
    upvotes: 29,
    aiAnalysis: {
      categoryRecommendation: 'Road Maintenance',
      categoryConfidence: 99,
      urgencyScore: 10,
      publicImpactScore: 9,
      severity: 'CRITICAL',
      safetyHazardRisks: ['Imminent fatal two-wheeler skidding risk', 'Commercial truck axle fracture'],
      estimatedFixHours: 8,
      reasoning: 'Third report within 35 meters in 15 minutes describing the same road pit. Multi-citizen incident cluster detected.',
      conciseSummary: 'Critical road crater causing near-miss collisions on Birla Road.',
      isDuplicateSuspected: true,
      duplicateConfidence: 96,
      suspectedDuplicateIds: ['STARK-SIM-001', 'STARK-SIM-002'],
      analyzedAt: '2026-11-09T06:20:25.000Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      {
        id: 'tl_sim_3_1',
        timestamp: '2026-11-09T06:20:00.000Z',
        status: 'Submitted',
        actorName: 'Rohan Verma',
        actorRole: 'Citizen',
        note: 'Urgent third report filed with danger warning.'
      }
    ]
  }
];

export const INITIAL_CLUSTERS: IncidentCluster[] = [
  {
    id: 'CLUSTER-SATNA-BIRLA-01',
    name: 'Birla Road Pothole Emergency Cluster',
    primaryReportId: 'STARK-SIM-001',
    reportIds: ['STARK-SIM-001', 'STARK-SIM-002', 'STARK-SIM-003'],
    category: 'Road Maintenance',
    centerCoordinates: { latitude: 24.5891, longitude: 80.8354 },
    radiusMeters: 38,
    severity: 'CRITICAL',
    combinedPublicImpact: 9.4,
    status: 'Under Review',
    reasoning: '3 independent citizen reports within 38m radius spanning 15 minutes, with matching visual indicators and traffic hazard descriptors.'
  }
];
