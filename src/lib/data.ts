// Portfolio Data Structure
// Structured data for Lauda Dhia Raka's portfolio

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  technologies: string[];
  type: "fulltime" | "internship" | "teaching";
}

export interface Project {
  id: string;
  title: string;
  category: "ai-agents" | "game-dev" | "web" | "other";
  description: string;
  longDescription: string;
  highlights: string[];
  technologies: string[];
  image?: string;
  links?: {
    github?: string;
    demo?: string;
    video?: string;
  };
  featured: boolean;
}

export interface Skill {
  name: string;
  category: "languages" | "frameworks" | "tools" | "concepts";
  level: number; // 1-5
}

export interface NavItem {
  id: string;
  label: string;
  codeName: string;
  href: string;
  icon: string;
}

// Navigation Items
export const navItems: NavItem[] = [
  {
    id: "about",
    label: "About",
    codeName: "Intelligence",
    href: "#intelligence",
    icon: "◈",
  },
  {
    id: "experience",
    label: "Experience",
    codeName: "Architecture",
    href: "#architecture",
    icon: "◇",
  },
  {
    id: "projects",
    label: "Projects",
    codeName: "Archives",
    href: "#archives",
    icon: "◆",
  },
  {
    id: "contact",
    label: "Contact",
    codeName: "Synapse",
    href: "#synapse",
    icon: "◉",
  },
];

// Personal Info
export const personalInfo = {
  name: "Lauda Dhia Raka",
  title: "Systems Architect & Creative Developer",
  taglines: [
    "Multi-Agent Orchestration",
    "Full-Stack Engineering",
    "Game Development",
    "Applied AI Systems",
  ],
  bio: `A Full-Stack Engineer specializing in Multi-Agent Systems, Applied AI, and Game Development. 
        Passionate about building intelligent systems that push the boundaries of what's possible 
        with modern technology.`,
  email: "contact@laudadhiaraka.dev",
  location: "Indonesia",
  social: {
    github: "https://github.com/laudadhiaraka",
    linkedin: "https://linkedin.com/in/laudadhiaraka",
    twitter: "https://twitter.com/laudadhiaraka",
  },
};

// Experience Data
export const experiences: Experience[] = [
  {
    id: "elnusa",
    company: "PT. Elnusa Tbk",
    role: "Fullstack Developer",
    period: "September 2025 - December 2025",
    location: "Indonesia",
    description:
      "Developed enterprise-grade assessment engine powered by Google Gemini AI with comprehensive security implementation.",
    highlights: [
      "Gemini-powered AI Assessment Engine",
      "Multi-Factor Authentication (MFA) Security",
      "Enterprise Vue.js + Express Architecture",
      "Real-time Assessment Analytics Dashboard",
    ],
    technologies: [
      "Vue.js",
      "Express.js",
      "Google Gemini AI",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
    type: "fulltime",
  },
  {
    id: "humic",
    company: "Humic Engineering Lab",
    role: "Backend Developer",
    period: "September 2024 - November 2024",
    location: "Telkom University",
    description:
      "Architected and developed the Content Management System for ICICYTA (International Conference on ICT for Youth and Technology Advancement).",
    highlights: [
      "CMS Architecture for ICICYTA Conference",
      "Scalable Laravel Backend System",
      "RESTful API Design & Implementation",
      "Database Optimization Strategies",
    ],
    technologies: [
      "Laravel",
      "PHP",
      "MySQL",
      "Redis",
      "REST API",
      "AWS",
    ],
    type: "internship",
  },
  {
    id: "telkom",
    company: "Telkom University",
    role: "Teaching Assistant - Discrete Mathematics",
    period: "2024",
    location: "Bandung, Indonesia",
    description:
      "Mentored students in Discrete Mathematics, focusing on algorithmic thinking and mathematical foundations for computer science.",
    highlights: [
      "Discrete Mathematics Mentorship",
      "Algorithm Design Fundamentals",
      "Graph Theory & Combinatorics",
      "Student Performance Analytics",
    ],
    technologies: [
      "Python",
      "LaTeX",
      "Jupyter Notebooks",
      "Mathematical Modeling",
    ],
    type: "teaching",
  },
];

// Projects Data
export const projects: Project[] = [
  // AI & Agents Category
  {
    id: "hireit",
    title: "HireIT AI",
    category: "ai-agents",
    description: "Multi-agent recruitment automation platform",
    longDescription:
      "An intelligent recruitment platform leveraging multi-agent systems to automate and optimize the hiring process. Built with IBM watsonx Orchestrate for agent coordination and natural language processing.",
    highlights: [
      "Multi-Agent Recruitment Automation",
      "IBM watsonx Orchestrate Integration",
      "Natural Language Processing Pipeline",
      "Automated Candidate Screening",
      "Interview Scheduling Automation",
    ],
    technologies: [
      "Python",
      "IBM watsonx",
      "LangChain",
      "FastAPI",
      "PostgreSQL",
      "React",
    ],
    featured: true,
    links: {
      github: "https://github.com/laudadhiaraka/hireit-ai",
    },
  },
  {
    id: "masonry",
    title: "MASONRY",
    category: "ai-agents",
    description: "Minecraft ecosystem simulation with collective NPC behaviors",
    longDescription:
      "A sophisticated Minecraft ecosystem simulation featuring emergent collective NPC behaviors. Agents exhibit swarm intelligence, resource gathering, and collaborative construction patterns.",
    highlights: [
      "Minecraft Ecosystem Simulation",
      "Collective NPC Behaviors",
      "Swarm Intelligence Algorithms",
      "Emergent Construction Patterns",
      "Resource Management AI",
    ],
    technologies: [
      "Java",
      "Python",
      "TensorFlow",
      "Reinforcement Learning",
      "Minecraft Forge",
    ],
    featured: true,
    links: {
      github: "https://github.com/laudadhiaraka/masonry",
    },
  },
  {
    id: "book-classification",
    title: "Book Genre Classification",
    category: "ai-agents",
    description: "CNN-based book genre classifier with custom dataset",
    longDescription:
      "A deep learning system for automated book genre classification using Convolutional Neural Networks trained on a custom-curated dataset of book covers and metadata.",
    highlights: [
      "Convolutional Neural Network Architecture",
      "Custom Dataset Curation & Processing",
      "Multi-label Classification",
      "Data Augmentation Pipeline",
      "Model Optimization & Deployment",
    ],
    technologies: [
      "Python",
      "TensorFlow/Keras",
      "CNN",
      "OpenCV",
      "NumPy",
      "Flask",
    ],
    featured: false,
    links: {
      github: "https://github.com/laudadhiaraka/book-classifier",
    },
  },
  // Game Development Category
  {
    id: "nirwana",
    title: "Nirwana Pancarona",
    category: "game-dev",
    description: "Intense bullet hell with complex enemy patterns",
    longDescription:
      "A visually stunning bullet hell game featuring intricate enemy patterns, multiple boss encounters, and precise hitbox mechanics. Developed in GameMaker with custom shader effects.",
    highlights: [
      "Bullet Hell Mechanics",
      "Complex Enemy Pattern Design",
      "Custom Shader Effects",
      "Precise Hitbox System",
      "Progressive Difficulty Scaling",
    ],
    technologies: [
      "GameMaker Studio 2",
      "GML",
      "GLSL Shaders",
      "Aseprite",
      "FMOD",
    ],
    featured: true,
    links: {
      demo: "https://laudadhiaraka.itch.io/nirwana",
    },
  },
  {
    id: "horeg",
    title: "Need for Horeg",
    category: "game-dev",
    description: "Rhythm-roguelike hybrid experience",
    longDescription:
      "An innovative rhythm-roguelike hybrid that combines procedurally generated dungeons with rhythm-based combat mechanics. Players must move and attack to the beat while navigating through challenging levels.",
    highlights: [
      "Rhythm/Roguelike Hybrid Gameplay",
      "Procedural Level Generation",
      "Beat-synced Combat System",
      "Dynamic Difficulty Adjustment",
      "Original Soundtrack Integration",
    ],
    technologies: [
      "Unity",
      "C#",
      "FMOD",
      "Procedural Generation",
      "Shader Graph",
    ],
    featured: true,
    links: {
      demo: "https://laudadhiaraka.itch.io/horeg",
    },
  },
];

// Skills Data
export const skills: Skill[] = [
  // Languages
  { name: "TypeScript", category: "languages", level: 5 },
  { name: "Python", category: "languages", level: 5 },
  { name: "JavaScript", category: "languages", level: 5 },
  { name: "Java", category: "languages", level: 4 },
  { name: "C#", category: "languages", level: 4 },
  { name: "PHP", category: "languages", level: 4 },
  { name: "GML", category: "languages", level: 4 },
  { name: "SQL", category: "languages", level: 4 },

  // Frameworks
  { name: "Next.js", category: "frameworks", level: 5 },
  { name: "React", category: "frameworks", level: 5 },
  { name: "Vue.js", category: "frameworks", level: 4 },
  { name: "Express.js", category: "frameworks", level: 4 },
  { name: "Laravel", category: "frameworks", level: 4 },
  { name: "FastAPI", category: "frameworks", level: 4 },
  { name: "Unity", category: "frameworks", level: 4 },
  { name: "Three.js", category: "frameworks", level: 3 },

  // Tools
  { name: "Git", category: "tools", level: 5 },
  { name: "Docker", category: "tools", level: 4 },
  { name: "PostgreSQL", category: "tools", level: 4 },
  { name: "Redis", category: "tools", level: 4 },
  { name: "AWS", category: "tools", level: 3 },
  { name: "GameMaker", category: "tools", level: 5 },
  { name: "Figma", category: "tools", level: 3 },

  // Concepts
  { name: "Multi-Agent Systems", category: "concepts", level: 5 },
  { name: "Machine Learning", category: "concepts", level: 4 },
  { name: "System Design", category: "concepts", level: 4 },
  { name: "API Design", category: "concepts", level: 5 },
  { name: "Game Design", category: "concepts", level: 4 },
  { name: "CI/CD", category: "concepts", level: 4 },
];

// Terminal Commands
export interface TerminalCommand {
  command: string;
  description: string;
  response: string | object;
}

export const terminalCommands: TerminalCommand[] = [
  {
    command: "help",
    description: "List all available commands",
    response: `Available commands:
  help      - Display this help message
  about     - About Lauda Dhia Raka
  skills    - List technical skills
  contact   - Get contact information
  projects  - List featured projects
  exp       - Work experience summary
  clear     - Clear terminal
  sudo      - [RESTRICTED ACCESS]`,
  },
  {
    command: "about",
    description: "About information",
    response: JSON.stringify(
      {
        name: personalInfo.name,
        role: personalInfo.title,
        specialization: [
          "Multi-Agent Systems",
          "Applied AI",
          "Game Development",
        ],
        status: "Open to opportunities",
      },
      null,
      2
    ),
  },
  {
    command: "skills",
    description: "Technical skills",
    response: JSON.stringify(
      {
        languages: ["TypeScript", "Python", "Java", "C#", "PHP"],
        frameworks: ["Next.js", "React", "Vue.js", "Laravel", "Unity"],
        ai_ml: ["LangChain", "TensorFlow", "IBM watsonx", "Multi-Agent Systems"],
        tools: ["Docker", "PostgreSQL", "Redis", "AWS", "Git"],
      },
      null,
      2
    ),
  },
  {
    command: "contact",
    description: "Contact information",
    response: JSON.stringify(
      {
        email: personalInfo.email,
        github: personalInfo.social.github,
        linkedin: personalInfo.social.linkedin,
        location: personalInfo.location,
      },
      null,
      2
    ),
  },
  {
    command: "projects",
    description: "Featured projects",
    response: JSON.stringify(
      {
        ai_agents: ["HireIT AI", "MASONRY", "Book Genre Classification"],
        game_dev: ["Nirwana Pancarona", "Need for Horeg"],
        total: 5,
      },
      null,
      2
    ),
  },
  {
    command: "exp",
    description: "Work experience",
    response: JSON.stringify(
      {
        current: "PT. Elnusa Tbk - Fullstack Developer",
        previous: [
          "Humic Lab - Backend Developer",
          "Telkom University - Teaching Assistant",
        ],
      },
      null,
      2
    ),
  },
  {
    command: "sudo",
    description: "Restricted command",
    response: "ACCESS_DENIED",
  },
  {
    command: "clear",
    description: "Clear terminal",
    response: "CLEAR",
  },
];

// Get projects by category
export const getProjectsByCategory = (category: Project["category"]) =>
  projects.filter((p) => p.category === category);

// Get featured projects
export const getFeaturedProjects = () => projects.filter((p) => p.featured);

// Get skills by category
export const getSkillsByCategory = (category: Skill["category"]) =>
  skills.filter((s) => s.category === category);
