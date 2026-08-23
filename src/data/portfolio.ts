// ─────────────────────────────────────────────────────────────────────────
// All portfolio content lives here. Edit this file to update the site —
// no component needs to be touched to change text, links, or data.
//
// PLACEHOLDER marks anything that needs a real value before launch.
// ─────────────────────────────────────────────────────────────────────────

export const profile = {
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
  // PLACEHOLDER: full URLs were not supplied — only the handle "Hassan-Aljeshi".
  socials: {
    portfolio: { label: 'Hassan-Aljeshi', url: '#' },
    linkedin: { label: 'Hassan-Aljeshi', url: '#' },
  },
}

export const stats = [
  { value: '3+', label: 'Years in design' },
  { value: '3', label: 'Studios & product teams' },
  { value: '4', label: 'Disciplines directed' },
  { value: '100h', label: 'UI/UX training, DTC' },
]

export type Discipline = { name: string; note: string }

// The four practices the role actually spans — the hero's thesis.
export const disciplines: Discipline[] = [
  { name: 'Digital products', note: 'Web and mobile interfaces, end to end' },
  { name: 'Branding', note: 'Visual identity and design guidelines' },
  { name: 'Marketing', note: 'Campaign art direction and assets' },
  { name: 'Multimedia', note: 'Motion graphics oversight and review' },
]

export type Project = {
  title: string
  client: string
  year: string
  discipline: string
  description: string
  contribution: string[]
  images?: string[]
  url?: string
  placeholder?: boolean
}

// PLACEHOLDER: no case studies were supplied. These four slots carry the right
// shape and disciplines — replace title / client / description / images with real
// work and remove `placeholder: true` to drop the "slot open" marker.
export const projects: Project[] = [
  {
    title: 'Case study one',
    client: 'Digidia',
    year: '2025',
    discipline: 'Digital product',
    images: [
      '/hassan-/images/Pulsey.webp',
      '/hassan-/images/Thumbnails%20(1).webp',
      '/hassan-/images/Thumbnails-1%20(1).webp',
      '/hassan-/images/Thumbnails-2%20(1).webp',
    ],
    description:
      'A product design engagement led end to end — research, flows, high-fidelity interface, and the design system behind it.',
    contribution: ['User research', 'Wireframes', 'UI design', 'Design system'],
    placeholder: true,
  },
  {
    title: 'Case study two',
    client: 'Client name',
    year: '2025',
    discipline: 'Brand identity',
    description:
      'A visual identity programme: mark, type system, colour, and the guidelines that keep it consistent across every touchpoint.',
    contribution: ['Creative direction', 'Identity design', 'Guidelines'],
    placeholder: true,
  },
  {
    title: 'Case study three',
    client: 'Ys Lootah Tech',
    year: '2024',
    discipline: 'Mobile app',
    description:
      'A user-centred mobile experience shaped by research and usability testing, delivered as interactive prototypes and production-ready UI.',
    contribution: ['User flows', 'Prototyping', 'Usability testing'],
    placeholder: true,
  },
  {
    title: 'Case study four',
    client: 'JoyBox',
    year: '2023',
    discipline: 'Design system',
    description:
      'A component library and style guide built to hold visual consistency as the product team and its surface area grew.',
    contribution: ['Component library', 'Style guide', 'Documentation'],
    placeholder: true,
  },
]

export type Role = {
  title: string
  company: string
  location: string
  period: string
  current?: boolean
  points: string[]
}

export const experience: Role[] = [
  {
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
]

export type SkillGroup = { category: string; items: string[] }

export const skills: SkillGroup[] = [
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
]

export const languages = [
  { name: 'Arabic', level: 'Native' },
  { name: 'English', level: 'Professional working proficiency' },
]

export const education = {
  degree: 'BSc, Software Engineering and Information Systems',
  school: 'Syrian Private University',
  period: '2018 — 2024',
  detail: 'Overall grade 71%',
}

export type Certification = {
  title: string
  issuer: string
  description: string
  modules?: string[]
}

export const certifications: Certification[] = [
  {
    title: 'UI/UX Design Training',
    issuer: 'DTC (UNRWA)',
    description:
      '100 hours of hands-on training focused on designing intuitive user interfaces and delivering high-quality user experiences, applying creativity and innovation to practical design challenges.',
  },
  {
    title: 'Google UX Design Professional Certificate',
    issuer: 'Coursera — Google',
    description:
      'Comprehensive training in user research, wireframing, prototyping, usability testing, interaction design, and high-fidelity interface design in Figma.',
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
]

export const sections = [
  { id: 'work', label: 'Selected work' },
  { id: 'profile', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
]
