/**
 * ---------------------------------------------------------------------------
 * PORTFOLIO CONFIGURATION
 * ---------------------------------------------------------------------------
 * Everything personal lives in this file. Update `site` with your real name,
 * email, social URLs, résumé, and portrait. Anything left as an empty string
 * is hidden from the interface rather than rendered as a dead link.
 *
 * To replace the illustrated portrait, set `site.portrait` to a public path
 * (for example "/assets/portrait.webp") and update `portraitAlt`.
 *
 * Project screenshots: set `image` on a project to use a real screenshot.
 * Otherwise the project renders its original procedural artwork, keyed by
 * `artwork` (see components/projects/ProjectArtwork.tsx).
 */

export type ArtworkKey =
  | 'vaidhya'
  | 'heatguard'
  | 'bidlens'
  | 'kgb'
  | 'hearth'
  | 'orbit'
  | 'type'
  | 'portfolio';

export interface ProjectLinks {
  github?: string;
  live?: string;
  caseStudy?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  /** One or two sentences. Shown on the showcase and in project details. */
  description: string;
  role: string;
  /** Concrete, honest descriptions of what exists in the project. */
  contributions: string[];
  stack: string[];
  status: string;
  artwork: ArtworkKey;
  /** Optional real screenshot, e.g. "/assets/projects/vaidhya.webp". */
  image?: string;
  /** Accent used by the orbital cards and project chrome. */
  accent: string;
  links: ProjectLinks;
  /** Project selection metadata retained for the hero and project archive. */
  featured: boolean;
  kind: 'project' | 'experiment';
}

export const site = {
  name: 'Yadav Kumaran',
  monogram: 'YK',
  role: 'Computer Science Student · Full-Stack & AI Developer',
  eyebrow: 'Computer Science · Full-stack · Applied AI',
  /** Two lines; the second gets the serif italic treatment. */
  headline: ['Software', 'with depth.'],
  intro:
    'Full-stack engineering, applied AI, and data-driven products — built with care for the people using them.',
  /** Leave empty to hide the corresponding action. */
  email: 'yadavkumaran222008@gmail.com',
  github: 'https://github.com/yadavkumaran',
  linkedin: 'https://www.linkedin.com/in/yadavkumaran/',
  resume: '',
  /** Optional real portrait path. Leave empty to show the original illustration. */
  portrait: '/images/yadav-kumaran-portrait.png',
  portraitAlt:
    'Yadav Kumaran in a dark suit and tie, wearing sunglasses, lit by warm orange light against a dark background.',
  portraitQuote: 'Still learning. Always building.',
  location: 'Coimbatore, India',
  phone: '+91 98426 47947',
  year: new Date().getFullYear(),
} as const;

export const about = {
  intro:
    'I am a computer science student who likes the whole shape of a problem: the data behind it, the system that carries it, and the interface that makes it legible.',
  paragraphs: [
    'My work sits between full-stack engineering and applied intelligence. I build with Java and Spring Boot on the server, React and TypeScript in the interface, and Python wherever data or models need room to think. Recent builds include an AI-assisted telemedicine prototype, an urban heat mitigation platform, and a document verification workflow for procurement.',
    'I care about systems that explain themselves — software where the model, the numbers, and the reasoning are visible enough to trust. Prototype or production, the goal is the same: something clear, useful, and honest about what it does.',
  ],
  principles: [
    'Start with the decision the user needs to make.',
    'Make the model explain itself.',
    'Ship the honest version, label the prototype.',
  ],
} as const;

export const expertise: {
  label: string;
  technologies: string[];
  note?: string;
}[] = [
  {
    label: 'AI / Machine Learning',
    technologies: ['Python', 'Machine learning', 'Local model integration', 'OCR & extraction'],
  },
  {
    label: 'Backend Engineering',
    technologies: ['Java', 'Spring Boot', 'API workflows'],
  },
  {
    label: 'Frontend Engineering',
    technologies: ['React', 'TypeScript', 'Interface systems'],
  },
  {
    label: 'Databases & Infrastructure',
    technologies: [],
    note: 'No database or infrastructure tools are listed in the verified portfolio content.',
  },
  {
    label: 'Developer Tools',
    technologies: ['Three.js', 'GSAP', 'Vite'],
  },
];

export const projects: Project[] = [
  {
    id: 'vaidhya',
    title: 'Vaidhya',
    subtitle: 'AI-assisted telemedicine',
    category: 'Health · AI · Full-stack',
    description:
      'A telemedicine prototype connecting patients, doctors, and pharmacies, with an AI clinical assistant and a locally run medical model.',
    role: 'Full-stack development · AI integration',
    contributions: [
      'Patient, doctor, and pharmacy flows connected around one consultation record.',
      'An AI clinical assistant backed by a locally hosted medical model.',
      'Designed as a prototype: decision support, not autonomous diagnosis.',
    ],
    stack: ['React', 'TypeScript', 'Spring Boot', 'Python', 'Local medical model'],
    status: 'Prototype',
    artwork: 'vaidhya',
    accent: '#8FE3C8',
    links: {},
    featured: true,
    kind: 'project',
  },
  {
    id: 'heatguard',
    title: 'HeatGuard AI',
    subtitle: 'Urban heat mitigation',
    category: 'Climate · Geospatial · ML',
    description:
      'An urban heat platform built on satellite-derived indicators, land surface temperature modeling, explainability, and mitigation optimization.',
    role: 'Data modeling · Explainability · Interface',
    contributions: [
      'Satellite-derived environmental indicators assembled into a city-scale view.',
      'Land surface temperature modeling paired with feature-level explanations.',
      'Mitigation scenarios compared so interventions can be prioritized.',
    ],
    stack: ['Python', 'Geospatial data', 'Machine learning', 'React', 'TypeScript'],
    status: 'Research prototype',
    artwork: 'heatguard',
    accent: '#FF7A45',
    links: {},
    featured: true,
    kind: 'project',
  },
  {
    id: 'bidlens',
    title: 'BidLens',
    subtitle: 'Procurement document verification',
    category: 'Documents · OCR · Workflow',
    description:
      'A verification workflow for procurement documents: parsing, OCR, extraction of business identifiers, and structured checks.',
    role: 'Document pipeline · Verification workflow',
    contributions: [
      'Parsing and OCR pipeline that normalizes scanned procurement documents.',
      'Extraction of business identifiers into a structured, reviewable record.',
      'Verification workflow that surfaces mismatches instead of silently passing them.',
    ],
    stack: ['Python', 'OCR', 'Document parsing', 'TypeScript'],
    status: 'Work in progress',
    artwork: 'bidlens',
    accent: '#A9C7FF',
    links: {},
    featured: true,
    kind: 'project',
  },
  {
    id: 'kgb',
    title: 'KGB',
    subtitle: 'Yadav Kumaran Gold Bullion',
    category: 'Markets · Data · Bilingual UX',
    description:
      'A gold and currency intelligence concept: bullion prices, foreign exchange, INR forecasting, alerts, and bilingual market context.',
    role: 'Product concept · Data & interface design',
    contributions: [
      'Bullion and foreign-exchange information composed into a single market view.',
      'INR forecasting and threshold alerts explored as a decision aid.',
      'Bilingual market intelligence treated as a first-class interface requirement.',
    ],
    stack: ['React', 'TypeScript', 'Python', 'Forecasting', 'Market data'],
    status: 'Concept',
    artwork: 'kgb',
    accent: '#E5C170',
    links: {},
    featured: true,
    kind: 'project',
  },
  {
    id: 'hearth',
    title: 'Hearth',
    subtitle: 'Household finance, quietly',
    category: 'Consumer · Finance · Voice',
    description:
      'A household expense tracker with clear transaction management, useful insights, and voice-driven interaction.',
    role: 'Product design · Full-stack development',
    contributions: [
      'Transaction management designed around a household rather than an individual.',
      'Spending insights that stay legible without a dashboard of charts.',
      'Voice-driven entry explored as a low-friction alternative to forms.',
    ],
    stack: ['React', 'TypeScript', 'Spring Boot', 'Speech interface'],
    status: 'In progress',
    artwork: 'hearth',
    accent: '#FFB38A',
    links: {},
    featured: true,
    kind: 'project',
  },
  {
    id: 'orbit-study',
    title: 'Orbit Study',
    subtitle: 'A shader and a composition',
    category: 'WebGL · Motion',
    description:
      'The orbital gallery and GPU particle field behind this page: art-directed placement, one shared pointer response, and scroll-linked motion.',
    role: 'Design · WebGL · Motion',
    contributions: [
      'A responsive arc of project cards, art-directed per breakpoint rather than randomly scattered.',
      'One pointer response shared by the portrait, the smoke, and the orbit.',
      'A GPU particle field driven by scroll progress, with a static composition under reduced motion.',
    ],
    stack: ['Three.js', 'GLSL', 'GSAP', 'React'],
    status: 'Experiment',
    artwork: 'orbit',
    accent: '#9F91FF',
    links: {},
    featured: false,
    kind: 'experiment',
  },
  {
    id: 'type-study',
    title: 'Type Study',
    subtitle: 'Editorial systems',
    category: 'Typography · Art direction',
    description:
      'A small typographic study behind the editorial scenes: scale contrast, serif accents, and tight, deliberate spacing.',
    role: 'Art direction',
    contributions: [
      'A three-typeface system used across the cinematic and editorial scenes.',
      'Oversized numbering and compact technical labels as a shared language.',
      'Layouts that remain readable when motion is switched off.',
    ],
    stack: ['Space Grotesk', 'Inter', 'Instrument Serif'],
    status: 'Experiment',
    artwork: 'type',
    accent: '#F3F0EB',
    links: {},
    featured: false,
    kind: 'experiment',
  },
  {
    id: 'this-portfolio',
    title: 'Portfolio OS',
    subtitle: 'This site',
    category: 'Design engineering',
    description:
      'The site you are reading: a scroll-driven narrative with a cinematic opening shot, GPU particles, editorial project scenes, and a working project archive.',
    role: 'Design · Engineering · Writing',
    contributions: [
      'A modular scene system coordinated by GSAP timelines and scroll progress.',
      'Project content kept in one typed configuration file.',
      'Accessible fallbacks for reduced motion, WebGL, and small screens.',
    ],
    stack: ['React', 'TypeScript', 'Three.js', 'GSAP', 'Tailwind CSS'],
    status: 'Live',
    artwork: 'portfolio',
    accent: '#FF612F',
    links: {},
    featured: false,
    kind: 'experiment',
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const selectedProjects = projects.filter((project) =>
  ['vaidhya', 'heatguard', 'bidlens', 'hearth'].includes(project.id),
);

export const redFeatureProject =
  featuredProjects.find((project) => project.id === 'heatguard') ?? featuredProjects[0];

export const experiments = projects.filter((project) => project.kind === 'experiment');

export const heroProjects = projects;

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Contact', href: '#contact' },
];

export const hasLink = (value?: string): value is string =>
  Boolean(value && value.trim().length > 0);
