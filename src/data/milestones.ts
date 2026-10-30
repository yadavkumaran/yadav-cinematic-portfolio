/**
 * ---------------------------------------------------------------------------
 * VERIFIED RESUME DATA & ACHIEVEMENTS ARCHIVE
 * ---------------------------------------------------------------------------
 * Source of truth: Yadav_Kumaran_Resume_Final(1).pdf + IoT Internship (Emiglitz)
 * No fabricated metrics, dates, or credentials.
 */

export interface EducationData {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  yearStatus: string;
  cgpa: string;
  cgpaMax: string;
  cgpaLabel: string;
  secondary: {
    title: string;
    institution: string;
    board: string;
  };
  coreCompetencies: string[];
  programmingLanguages: string[];
}

export interface InternshipData {
  id: string;
  company: string;
  role: string;
  period: string;
  credential?: {
    id: string;
    issueDate: string;
  };
  domain: string;
  description: string;
  technologies: string[];
  type: 'virtual' | 'industrial';
}

export interface HackathonData {
  id: string;
  title: string;
  rank: 'Winner' | 'Best Innovator' | '3rd Prize' | 'Participant';
  event: string;
  organizer: string;
  date?: string;
  prize?: string;
  team: string;
  projectAssociated?: string;
  isVictory: boolean;
  notes?: string;
}

export interface RealSystemProject {
  id: string;
  title: string;
  category: string;
  year: string;
  affiliation?: string;
  stack: string[];
  summary: string;
  architecturalPillars: {
    label: string;
    description: string;
  }[];
  awards?: string[];
  featured: boolean;
}

export const academicData: EducationData = {
  degree: 'B.E. Computer Science & Engineering',
  field: 'Artificial Intelligence & Machine Learning',
  institution: 'Sri Krishna College of Engineering and Technology (SKCET)',
  location: 'Coimbatore, Tamil Nadu, India',
  period: '2025 – 2029 (Expected)',
  yearStatus: 'Currently in Year II',
  cgpa: '9.55',
  cgpaMax: '10.0',
  cgpaLabel: 'Cumulative GPA (Year II)',
  secondary: {
    title: 'Higher Secondary Certificate (HSC)',
    institution: 'SBOA School Matriculation Higher Secondary School',
    board: 'Tamil Nadu State Board',
  },
  coreCompetencies: [
    'Data Structures & Algorithms',
    'Object-Oriented Programming',
    'Machine Learning & Logistic Regression',
    'Anomaly Detection Systems',
    'Local LLM Integration (Ollama)',
    'Prompt Engineering & Guardrails',
    'REST API Architecture',
    'IoT & Embedded Telemetry (ESP32 / MQTT)',
  ],
  programmingLanguages: ['Java', 'Python', 'JavaScript', 'SQL', 'HTML5 / CSS3'],
};

export const internshipData: InternshipData[] = [
  {
    id: 'codealpha-ai',
    company: 'CodeAlpha',
    role: 'Artificial Intelligence Intern',
    period: '1 – 30 Jun 2026',
    credential: {
      id: 'CA/DF1/110755',
      issueDate: '1 July 2026',
    },
    domain: 'Applied Artificial Intelligence & Machine Learning',
    description:
      'Completed a one-month intensive AI virtual internship program focusing on predictive modeling, machine learning workflows, and intelligent system architectures.',
    technologies: ['Python', 'Machine Learning', 'Data Pipelines', 'Model Evaluation'],
    type: 'virtual',
  },
  {
    id: 'emiglitz-iot',
    company: 'Emiglitz Technologies',
    role: 'IoT Domain Intern',
    period: 'Completed Internship',
    domain: 'Internet of Things & Embedded Hardware Systems',
    description:
      'Completed industrial internship training in the IoT domain, gaining hands-on engineering experience in microcontrollers, sensor interfacing, and hardware-to-cloud communication telemetry.',
    technologies: ['ESP32', 'MQTT Protocol', 'MAX30102 Sensor', 'Hardware Interfacing', 'Embedded C/C++'],
    type: 'industrial',
  },
];

export const hackathonVictories: HackathonData[] = [
  {
    id: 'pec-hacks',
    title: 'Trace Commons AI Partner Track',
    rank: 'Winner',
    event: 'PEC Hacks 4.0',
    organizer: 'Panimalar Engineering College',
    prize: '$100 Prize',
    team: 'Team Cure Cloud',
    projectAssociated: 'Vaidhiya',
    isVictory: true,
    notes: 'Developed AI healthcare and rural telemedicine platform under 24h competitive sprint.',
  },
  {
    id: 'hackathon-360',
    title: 'Open Challenge Solutions Track',
    rank: 'Winner',
    event: 'International Level Hackathon 360° 4.0',
    organizer: 'Narnarayan Shastri Institute of Technology & ECLearnix',
    date: 'June 2026',
    team: 'Open Challenge Solutions',
    isVictory: true,
    notes: 'Secured first place in international technical hackathon competition.',
  },
  {
    id: 'skcet-innovator',
    title: 'Institutional Innovation Award',
    rank: 'Best Innovator',
    event: 'SKCET Innovation Challenge',
    organizer: 'Sri Krishna College of Engineering and Technology',
    team: 'Team Cure Cloud (Team of six)',
    projectAssociated: 'Vaidhiya',
    isVictory: true,
    notes: 'Awarded Best Innovator for offline-first architecture and vital-sign integration.',
  },
  {
    id: 'intellitech-2k25',
    title: "Engineer's Day Project Expo",
    rank: '3rd Prize',
    event: 'Intellitech 2K25',
    organizer: 'Dept. of CSE, SKCET',
    date: 'September 2025',
    team: 'Individual / Team Build',
    isVictory: true,
    notes: 'Recognized for technical excellence and working hardware/software demonstration.',
  },
  {
    id: 'sih-2026',
    title: 'Smart India Hackathon 2026',
    rank: 'Participant',
    event: 'National Hackathon Initiative (Problem Statement SIH26100)',
    organizer: 'Government of India / AICTE',
    date: '2026',
    team: 'National Team',
    projectAssociated: 'BidLens (GeM Procurement Verification)',
    isVictory: false,
    notes: 'Engineered automated compliance verification platform for public procurement bids.',
  },
  {
    id: 'neurobots-hackathon',
    title: 'Neurobots Hackathon',
    rank: 'Participant',
    event: 'Neurobots Hackathon',
    organizer: 'IES College of Engineering, Thrissur',
    date: '2026',
    team: 'Competitive Team',
    isVictory: false,
    notes: 'Advanced intelligent robotics and automation challenge.',
  },
];

export const realSystemProjects: RealSystemProject[] = [
  {
    id: 'vaidhya',
    title: 'Vaidhiya (Cure Cloud)',
    category: 'Rural Telemedicine & Disease Surveillance Platform',
    year: '2026',
    affiliation: 'PEC Hacks 4.0 Winner & SKCET Best Innovator',
    stack: ['Python', 'Next.js', 'Node.js', 'Express', 'SQLite', 'MQTT', 'Ollama', 'ESP32', 'MAX30102'],
    summary:
      'Rural healthcare system combining remote physician consultation, triage appointment scheduling, and AI medical guidance with physical vitals monitoring and village-level epidemiological surveillance.',
    architecturalPillars: [
      {
        label: 'Hardware Telemedicine Unit',
        description:
          'Integrated ESP32 microcontroller with a MAX30102 optical biometric sensor, capturing live pulse and SpO2 readings directly into the patient triage record.',
      },
      {
        label: 'ArogyaMap Disease Surveillance',
        description:
          'Epidemiological intelligence engine using village-level health metrics, rolling-baseline anomaly detection, and logistic regression to identify outbreak risk factors, paired with an interactive Next.js map drill-down for Tamil Nadu.',
      },
      {
        label: 'Offline-First Resilience',
        description:
          'Architected for zero-connectivity rural clinics with Node.js/Express, SQLite, embedded MQTT broker, and local Ollama inference, engineered during a 24-hour sprint as a four-member team.',
      },
    ],
    awards: ['Winner — PEC Hacks 4.0 ($100 Prize)', 'Best Innovator Award — SKCET'],
    featured: true,
  },
  {
    id: 'bidlens',
    title: 'BidLens',
    category: 'AI-Powered Bid Compliance Verification for GeM Procurement',
    year: '2026',
    affiliation: 'Smart India Hackathon 2026 — Problem Statement SIH26100',
    stack: ['Python', 'LLM Pipeline', 'Document Intelligence', 'FastAPI', 'Next.js'],
    summary:
      'AI-powered verification platform that automatically checks vendor bid submissions against complex Government e-Marketplace (GeM) compliance specifications in an integrated workflow, mitigating human auditing errors.',
    architecturalPillars: [
      {
        label: 'Multi-Clause Compliance Audit',
        description:
          'Automated parsing of tender eligibility clauses, technical qualifications, and commercial criteria against submitted vendor dossiers.',
      },
      {
        label: 'Defect & Risk Identification',
        description:
          'Highlights missing mandatory declarations, discrepancies, and validity deadlines to ensure transparent public procurement evaluation.',
      },
    ],
    featured: true,
  },
  {
    id: 'ai-detective',
    title: 'AI Detective Interrogation Game',
    category: 'Stateful Interactive Narrative Game Engine',
    year: '2025 – 2026',
    stack: ['Python', 'LLM Tool Calling', 'State Machine', 'WebSockets'],
    summary:
      'Stateful interactive interrogation game engine featuring a dynamic trust-meter mechanic, structured LLM function calling, and anti-leak prompt guardrails preventing premature confession extraction.',
    architecturalPillars: [
      {
        label: 'Dynamic Trust-Meter Mechanic',
        description:
          'Tracks player conversational demeanor and suspicion thresholds through persistent state vectors during interrogation turns.',
      },
      {
        label: 'Anti-Leak Prompt Guard',
        description:
          'Protects underlying mystery secrets and plot triggers against adversarial jailbreaks or unauthorized prompt leaks.',
      },
    ],
    featured: false,
  },
  {
    id: 'emergency-sos',
    title: 'Emergency SOS Guidance App',
    category: 'Critical Incident Guidance & Rapid Dispatch Interface',
    year: '2025 – 2026',
    stack: ['Mobile / Web', 'Geolocation', 'Real-Time Routing'],
    summary:
      'Emergency assistance protocol interface guiding users through critical situations with step-by-step guidance and fast contact dispatch.',
    architecturalPillars: [
      {
        label: 'Step-by-Step Triage Guidance',
        description:
          'Provides clear, accessible procedural checklists for medical, vehicular, or environmental emergencies.',
      },
      {
        label: 'Rapid Help Connection',
        description:
          'Instant location dispatch to emergency responders and trusted emergency contacts with minimal interactions.',
      },
    ],
    featured: false,
  },
  {
    id: 'face-detector',
    title: 'Face Detector',
    category: 'Real-Time Computer Vision Detection Application',
    year: '2025 – 2026',
    stack: ['Python', 'OpenCV', 'Deep Learning'],
    summary:
      'Computer-vision face-detection pipeline optimized for high-throughput video streams with low-latency facial landmark localisation.',
    architecturalPillars: [
      {
        label: 'Real-Time Landmark Localisation',
        description:
          'Performs multi-face bounding box inference with stable tracking across lighting and orientation changes.',
      },
    ],
    featured: false,
  },
];

export const certificationsData = [
  {
    title: 'Java Full Stack Development Course',
    status: 'Completed',
    issuer: 'Professional Training',
  },
];
