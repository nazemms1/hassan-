// ─────────────────────────────────────────────────────────────────────────
// Portfolio Data Definitions & Default Seed Dataset
// ─────────────────────────────────────────────────────────────────────────

export interface Stat {
  value: string
  label: string
}

export interface Discipline {
  name: string
  note: string
}

export interface Project {
  id?: string
  title: string
  client: string
  year: string
  discipline: string
  description: string
  contribution: string[]
  images?: string[]
  url?: string
  hidden?: boolean
  placeholder?: boolean
}

export interface Role {
  id?: string
  title: string
  company: string
  location: string
  period: string
  current?: boolean
  points: string[]
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface Language {
  name: string
  level: string
}

export interface Education {
  degree: string
  school: string
  period: string
  detail: string
}

export interface Certification {
  id?: string
  title: string
  issuer: string
  description: string
  date: string
  modules?: string[]
  image?: string
  imageAlt?: string
}

export interface SocialLink {
  label: string
  url: string
}

export interface Profile {
  name: string
  role: string
  tagline: string
  location: string
  email: string
  phone: string
  whatsapp: string
  summary: string
  longBio: string
  cvUrl?: string
  socials: {
    portfolio: SocialLink
    linkedin: SocialLink
  }
}

export interface PortfolioData {
  profile: Profile
  stats: Stat[]
  disciplines: Discipline[]
  projects: Project[]
  experience: Role[]
  skills: SkillGroup[]
  languages: Language[]
  education: Education
  certifications: Certification[]
}

export const initialPortfolio: PortfolioData = {
  profile: {
    name: 'Mohamad Hassan Aljeshi',
    role: 'Art Director & UI/UX Designer',
    tagline: 'Creative direction for digital products, brands, and the work around them',
    location: 'Damascus, Syria',
    email: 'jeshe2013@hotmail.com',
    phone: '+963 9333 543 42',
    whatsapp: '+963 9333 543 42',
    summary:
      'Creative professional with 3+ years of experience in UI/UX design, digital product design, branding, and visual communication. Currently working as an Art Director & UI/UX Designer, leading multidisciplinary creative projects across digital products, branding, marketing, and multimedia.',
    longBio:
      'Skilled in creative direction, user research, wireframing, prototyping, design systems, visual identity, and cross-functional collaboration. Focused on transforming business objectives into intuitive, engaging, and visually compelling digital experiences.',
    cvUrl: '#',
    socials: {
      portfolio: { label: 'Hassan-Aljeshi', url: '#' },
      linkedin: { label: 'Hassan-Aljeshi', url: 'https://linkedin.com' },
    },
  },
  stats: [
    { value: '3+', label: 'Years in design' },
    { value: '3', label: 'Studios & product teams' },
    { value: '4', label: 'Disciplines directed' },
    { value: '100h', label: 'UI/UX training, DTC' },
  ],
  disciplines: [
    { name: 'Digital products', note: 'Web and mobile interfaces, end to end' },
    { name: 'Branding', note: 'Visual identity and design guidelines' },
    { name: 'Marketing', note: 'Campaign art direction and assets' },
    { name: 'Multimedia', note: 'Motion graphics oversight and review' },
  ],
  projects: [
    {
      id: 'p1',
      title: 'Pulsey',
      client: 'Yslootahetech',
      year: '2025',
      discipline: 'Mobile health app',
      images: [
        '/hassan-/images/project-1/Pulsey.webp',
        '/hassan-/images/project-1/Thumbnails.webp',
        '/hassan-/images/project-1/Thumbnails-1.webp',
        '/hassan-/images/project-1/Thumbnails-2.webp',
        '/hassan-/images/project-1/Thumbnails-3.webp',
        '/hassan-/images/project-1/Thumbnails-4.webp',
      ],
      description:
        'Pulsey is a mobile health monitoring app designed to make personal health tracking simple and intuitive. The experience covers heart rate, blood pressure, blood sugar, weight, and BMI monitoring. I designed clear user flows for measurements, health records, statistics, and historical data. Interactive charts and visual indicators help users understand their health data at a glance. The app also includes an AI Doctor experience for accessible health-related consultations. The design focuses on simplicity, consistency, usability, and clear health data visualization.',
      contribution: [
        'User flows',
        'Health records',
        'Data visualization',
        'Interactive charts',
        'AI Doctor experience',
      ],
    },
    {
      id: 'p2',
      title: 'Marah',
      client: 'Yslootahetech',
      year: '2026',
      discipline: 'Farm management & marketplace platform',
      images: [
        '/hassan-/images/marah/ChatGPT Image Aug 27, 2026, 02_56_05 PM.webp',
        '/hassan-/images/marah/Thumbnails.webp',
        '/hassan-/images/marah/Thumbnails-1.webp',
        '/hassan-/images/marah/Thumbnails-2.webp',
        '/hassan-/images/marah/Thumbnails-3.webp',
        '/hassan-/images/marah/Thumbnails-4.webp',
      ],
      description:
        'Marah is an integrated farm management and multi-vendor marketplace platform designed to connect livestock management, veterinary care, daily farm operations, and agricultural commerce within one unified digital ecosystem. The platform supports multiple user roles, including livestock owners, veterinarians, workers, and vendors, with dedicated experiences and permissions tailored to each role. I designed the experience to simplify complex farm operations, from managing livestock records, medical history, vaccinations, tasks, and daily activities to monitoring reports and important updates. The platform also extends into a multi-vendor marketplace where users can discover agricultural products, browse categories, manage orders, and interact with different sellers. Vendor-focused experiences provide tools for product management, orders, sales insights, and marketplace operations. Throughout the project, I focused on clear information architecture, role-based user flows, intuitive dashboards, and reusable design patterns to maintain consistency across a large and feature-rich ecosystem. The final experience brings farm management and agricultural commerce together in a simple, scalable, and accessible digital product.',
      contribution: [
        'User flows',
        'Role-based experiences',
        'Farm management dashboard',
        'Livestock & health records',
        'Multi-vendor marketplace',
      ],
    },
    {
      id: 'p3',
      title: 'Billionaire Signal',
      client: 'Yslootahetech',
      year: '2026',
      discipline: 'Social trading platform',
      images: [
        '/hassan-/images/signals/ChatGPT Image Aug 27, 2026, 02_49_08 PM.webp',
        '/hassan-/images/signals/Thumbnails.webp',
        '/hassan-/images/signals/Thumbnails-1.webp',
        '/hassan-/images/signals/Thumbnails-2.webp',
        '/hassan-/images/signals/Thumbnails-3.webp',
        '/hassan-/images/signals/Thumbnails-4.webp',
      ],
      description:
        'Billionaire Signal is a social trading platform designed to create a seamless connection between investors and professional signal providers within one unified ecosystem. The platform supports two distinct user journeys: investors can discover and compare traders, explore their performance and trading history, subscribe to signal providers, and follow trading opportunities, while signal providers can create and publish signals, manage their activity, monitor subscribers, and track their overall performance. I designed the experience around simplifying complex financial information and making key trading data easy to scan, compare, and understand. Performance dashboards combine metrics such as win rate, profit, trading activity, and historical results with clear data visualizations to support faster decision-making. The experience also includes trader discovery, filtering and sorting, subscription management, signal creation, marketplace interactions, notifications, and detailed performance analytics. Throughout the project, I focused on building clear user flows, strong information hierarchy, reusable UI patterns, and a consistent visual system across both investor and signal provider experiences. The final design balances the data-heavy nature of a trading platform with a clean, intuitive interface that keeps important actions and insights accessible throughout the user journey.',
      contribution: [
        'User flows',
        'Investor & trader experience',
        'Trading dashboards',
        'Data visualization',
        'Signal management',
      ],
    },
    {
      id: 'p4',
      title: 'Case study four',
      client: 'JoyBox',
      year: '2023',
      discipline: 'Design system',
      description:
        'A component library and style guide built to hold visual consistency as the product team and its surface area grew.',
      contribution: ['Component library', 'Style guide', 'Documentation'],
      placeholder: true,
    },
  ],
  experience: [
    {
      id: 'e1',
      title: 'Art Director & UI/UX Designer',
      company: 'Digidia',
      location: 'Damascus, Syria',
      period: 'June 2025 — Present',
      current: true,
      points: [
        'Lead the creative vision and artistic direction across digital products, branding initiatives, marketing campaigns, and multimedia content.',
        'Manage and mentor multidisciplinary teams, including UI/UX Designers, Graphic Designers, and Motion Designers.',
        'Ensure high-quality creative output while supporting team development and professional growth.',
        'Define and maintain visual standards, design guidelines, and brand consistency across all projects and client deliverables.',
        'Collaborate with stakeholders, project managers, and development teams to translate business objectives into impactful creative solutions.',
        'Review, approve, and provide constructive feedback on design concepts, user interfaces, visual assets, and motion graphics.',
        'Oversee the end-to-end creative workflow, ensuring projects are delivered on time, within scope, and aligned with strategic goals.',
        'Research emerging design trends, technologies, and industry best practices to drive innovation and improve creative performance.',
        'Integrate branding, user experience, and visual communication to create cohesive and engaging digital experiences.',
      ],
    },
    {
      id: 'e2',
      title: 'UI/UX Designer — Remote, part-time',
      company: 'Ys Lootah Tech',
      location: 'Dubai, UAE',
      period: 'September 2024 — May 2026',
      points: [
        'Designed user-centered digital experiences based on user needs, behaviors, and business requirements.',
        'Conducted user research and translated insights into wireframes, user flows, and interactive prototypes.',
        'Created high-fidelity UI designs and prototypes for web and mobile digital products.',
        'Collaborated remotely with clients and stakeholders to align design solutions with project goals, timelines, and requirements.',
        'Conducted usability testing and iterated on designs based on user feedback and project insights.',
        'Maintained visual consistency and strengthened brand identity across digital interfaces and design deliverables.',
      ],
    },
    {
      id: 'e3',
      title: 'UI/UX Designer',
      company: 'JoyBox',
      location: 'Damascus, Syria',
      period: 'March 2023 — May 2025',
      points: [
        'Conducted user research and usability testing to gather insights and inform design decisions.',
        'Developed wireframes, prototypes, and high-fidelity mockups to effectively communicate design ideas.',
        'Collaborated with cross-functional teams, including product managers and developers, to ensure design feasibility and alignment with business goals.',
        'Created and maintained design systems and style guides to ensure consistency across digital products.',
        'Stayed up to date with design trends and industry best practices to continuously improve the user experience.',
      ],
    },
  ],
  skills: [
    {
      category: 'Design',
      items: [
        'Creative Direction',
        'UI/UX Design',
        'User Research',
        'Interaction Design',
        'Wireframing',
        'Prototyping',
        'Usability Testing',
        'Design Systems',
        'Visual Identity & Branding',
      ],
    },
    {
      category: 'Tools',
      items: [
        'Figma',
        'Adobe XD',
        'Adobe Photoshop',
        'Adobe Illustrator',
        'Adobe After Effects',
        'Stitch',
      ],
    },
    {
      category: 'Working with people',
      items: [
        'Leadership',
        'Communication',
        'Team Management',
        'Problem Solving',
        'Critical Thinking',
        'Time Management',
      ],
    },
  ],
  languages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'English', level: 'Professional working proficiency' },
  ],
  education: {
    degree: 'BSc, Software Engineering and Information Systems',
    school: 'Syrian Private University',
    period: '2018 — 2024',
    detail: 'Overall grade 71%',
  },
  certifications: [
    {
      id: 'c1',
      title: 'UI/UX Design Training',
      issuer: 'DTC — UI/UX TRAINING',
      description:
        '100 hours of hands-on training focused on designing intuitive user interfaces and delivering high-quality user experiences, applying creativity and innovation to practical design challenges.',
      date: 'December 2023',
      image: '/hassan-/images/DCT.webp',
      imageAlt: 'UI/UX Design Training certificate from DTC (UNRWA)',
    },
    {
      id: 'c2',
      title: 'Google UX Design Professional Certificate',
      issuer: 'GOOGLE — PROFESSIONAL CERTIFICATE',
      description:
        'Comprehensive training in user research, wireframing, prototyping, usability testing, interaction design, and high-fidelity interface design in Figma.',
      date: 'February 2024',
      image: '/hassan-/images/Google.webp',
      imageAlt: 'Google UX Design Professional Certificate issued to Mohamad Hassan Aljeshi',
      modules: [
        'Foundations of User Experience (UX) Design',
        'Start the UX Design Process: Empathize, Define, and Ideate',
        'Build Wireframes and Low-Fidelity Prototypes',
        'Conduct UX Research and Test Early Concepts',
        'Create High-Fidelity Designs and Prototypes in Figma',
        'Build Dynamic User Interfaces (UI) for Websites',
        'Design a User Experience for Social Good & Prepare for Jobs',
      ],
    },
    {
      id: 'c3',
      title: 'Certificate of Appreciation',
      issuer: 'LOOTAH TECH — RECOGNITION',
      description:
        'Recognized for dedication, valuable contributions, and consistent commitment to the timely and successful completion of assigned tasks.',
      date: 'July 2025',
      image: '/hassan-/images/new.webp',
      imageAlt: 'Certificate of Appreciation from Ys Lootah Tech',
    },
  ],
}

// Legacy named exports for fallback compatibility
export const profile = initialPortfolio.profile
export const stats = initialPortfolio.stats
export const disciplines = initialPortfolio.disciplines
export const projects = initialPortfolio.projects
export const experience = initialPortfolio.experience
export const skills = initialPortfolio.skills
export const languages = initialPortfolio.languages
export const education = initialPortfolio.education
export const certifications = initialPortfolio.certifications

export const sections = [
  { id: 'work', label: 'Selected work' },
  { id: 'profile', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
]
