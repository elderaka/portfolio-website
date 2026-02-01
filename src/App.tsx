import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Cpu,
  Gamepad2,
  Code2,
  Database,
  Layers,
  ExternalLink,
  Mail,
  Github,
  BrainCircuit,
  Workflow,
  Sparkles,
  DatabaseZap,
  Info,
  Linkedin,
  FolderOpen,
  Lightbulb,
} from 'lucide-react'
import personalData from './personal-data.json'
import { FullstackLab } from './components/labs/FullstackLab'
import { GamedevLab } from './components/labs/GamedevLab'
import { MultiAgentLab } from './components/labs/MultiAgentLab'
import { AILab } from './components/labs/AILab'
import { SQLiteLab } from './components/labs/SQLiteLab'
import { MLLab } from './components/labs/MLLab'
import { AutomationLab } from './components/labs/AutomationLab'
import { CareerHistory } from './components/CareerHistory'
import { OrganizationHistory } from './components/OrganizationHistory'
import { Publications } from './components/Publications'
import { ContactMe } from './components/ContactMe'

type LabKey = 'fullstack' | 'gamedev' | 'mas' | 'ai' | 'sqlite' | 'ml' | 'n8n'

const PROFILE_CONTEXT = {
  name: 'Lauda Dhia Raka',
  role: 'Informatics Enthusiast / System Architect',
  specialties: ['Multi-Agent Systems', 'Applied AI', 'Full-stack Dev', 'System Architecture'],
  experience: [
    'PT. Elnusa Fabrikasi Konstruksi (Fullstack)',
    'Humic Lab (Backend)',
    'Sintesa Inti Prestasi (Fullstack)',
    'Advanced Software Engineering Lab',
  ],
  projects: ['LMS EFK (Agentic AI)', 'UK Cobenefit (GIS)', 'HireIT AI (IBM watsonx)', 'MASONRY (Minecraft NPC Sim)'],
  contact: {
    email: 'laudadraka@gmail.com',
    github: 'https://github.com/elderaka',
    linkedin: 'https://linkedin.com/in/laudadraka',
    location: 'Indonesia',
  },
}

const ProjectCard = ({
  project,
  animationClass = '',
}: {
  project: { title: string; category: string; tech: string; description: string; url?: string }
  animationClass?: string
}) => {
  const content = (
    <>
      {project.url && (
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
          <ExternalLink size={16} />
        </div>
      )}
      <div className="flex justify-between items-start mb-2 md:mb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">{project.category}</span>
        <span className="text-[10px] font-mono text-amber-600">{project.tech}</span>
      </div>
      <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter group-hover:text-amber-700">{project.title}</h3>
      <p className="text-sm text-stone-600 leading-relaxed mb-4">{project.description}</p>
    </>
  )

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        className={`group border border-stone-300 p-4 md:p-6 bg-[#EBE7DF]/40 hover:border-[#FFB000] transition-all duration-300 relative overflow-hidden ${animationClass}`}
      >
        {content}
      </a>
    )
  }

  return (
    <div className={`group border border-stone-300 p-4 md:p-6 bg-[#EBE7DF]/40 hover:border-[#FFB000] transition-all duration-300 relative overflow-hidden ${animationClass}`}>
      {content}
    </div>
  )
}

function App() {
  const [booted, setBooted] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const [activeLab, setActiveLab] = useState<LabKey>('fullstack')
  const [activeProjectTag, setActiveProjectTag] = useState<'web-dev' | 'mobile-dev' | 'game-dev' | 'ml-ai' | 'all'>(
    'all'
  )
  const [projectPage, setProjectPage] = useState(1)
  const [wheelAngle, setWheelAngle] = useState(0)
  const [wheelDragging, setWheelDragging] = useState(false)
  const [wheelWobble, setWheelWobble] = useState(0)
  const [heroTextIndex, setHeroTextIndex] = useState(0)
  const [heroDisplayIndex, setHeroDisplayIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLabTransitioning, setIsLabTransitioning] = useState(false)
  const [isProjectTransitioning, setIsProjectTransitioning] = useState(false)
  const animationsEnabled = import.meta.env.VITE_ANIMATIONS_ENABLED !== 'false'
  const [heroMaxWidths, setHeroMaxWidths] = useState<number[]>([0, 0, 0])
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [currentSection, setCurrentSection] = useState<string>('hero')
  const wheelRef = useRef<HTMLDivElement | null>(null)
  const heroLine1Ref = useRef<HTMLSpanElement>(null)
  const heroLine2Ref = useRef<HTMLSpanElement>(null)
  const heroLine3Ref = useRef<HTMLSpanElement>(null)
  const dragStartAngleRef = useRef(0)
  const dragStartRotationRef = useRef(0)
  const velocityRef = useRef(0)
  const lastAngleRef = useRef(0)
  const lastTimeRef = useRef(0)
  const inertiaRef = useRef<number | null>(null)
  const wobblePhaseRef = useRef(0)
  const wobbleAmplitudeRef = useRef(0)
  const dragMovedRef = useRef(false)
  const resetAnimRef = useRef<number | null>(null)
  const resetStartTimeRef = useRef(0)
  const autoAdjustTimeoutRef = useRef<number | null>(null)

  const wheelItems = useMemo(() => [
    { icon: Layers, label: 'Fullstack Dev' },
    { icon: Gamepad2, label: 'Game Engines' },
    { icon: Database, label: 'Project Ops' },
    { icon: Cpu, label: 'Agentic AI' },
  ], [])

  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!booted) return
    const timer = setTimeout(() => setShowLoader(false), 600)
    return () => clearTimeout(timer)
  }, [booted])

  // Section intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
            entry.target.classList.add('section-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    // Observer for tracking current section in viewport
    const currentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    const sections = document.querySelectorAll('section[id]')
    sections.forEach((section) => {
      observer.observe(section)
      currentObserver.observe(section)
    })

    return () => {
      observer.disconnect()
      currentObserver.disconnect()
    }
  }, [])

  // Custom cursor tracking
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const ripple = document.createElement('div')
      ripple.className = 'click-ripple'
      ripple.style.left = `${e.clientX}px`
      ripple.style.top = `${e.clientY}px`
      document.body.appendChild(ripple)
      
      setTimeout(() => ripple.remove(), 600)
    }

    window.addEventListener('click', handleClick)
    
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [])

  const heroTexts = useMemo(() => [
    ['Fullstack', 'Engineer', '& Architect'],
    ['Development', 'Security', '& Operation'],
    ['Machine', 'Learning', '& Applied AI'],
    ['Game', 'Development', '& Ideation'],
  ], [])

  useEffect(() => {
    if (!animationsEnabled) return
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        const nextIndex = (heroTextIndex + 1) % heroTexts.length
        setHeroTextIndex(nextIndex)
        setHeroDisplayIndex(nextIndex)
        setIsTransitioning(false)
        
        // Rotate wheel using reset animation logic
        if (inertiaRef.current !== null) {
          cancelAnimationFrame(inertiaRef.current)
          inertiaRef.current = null
        }
        if (resetAnimRef.current !== null) {
          cancelAnimationFrame(resetAnimRef.current)
        }

        velocityRef.current = 0
        wobbleAmplitudeRef.current = 0
        setWheelWobble(0)

        // Calculate target angle: 0° (Fullstack), 90° (Game), 180° (DevSecOps), 270° (ML/AI)
        const targetOffset = nextIndex * 90
        const baseTarget = Math.floor(wheelAngle / 360) * 360 + targetOffset
        const candidates = [baseTarget, baseTarget + 360, baseTarget - 360]
        
        let targetAngle = baseTarget
        let minDistance = Infinity
        for (const candidate of candidates) {
          const distance = Math.abs(wheelAngle - candidate)
          if (distance < minDistance) {
            minDistance = distance
            targetAngle = candidate
          }
        }

        const startAngle = wheelAngle
        resetStartTimeRef.current = performance.now()

        const animateReset = (time: number) => {
          const elapsed = time - resetStartTimeRef.current
          const duration = 600
          const progress = Math.min(elapsed / duration, 1)

          const easeOutCubic = 1 - Math.pow(1 - progress, 3)
          const newAngle = startAngle + (targetAngle - startAngle) * easeOutCubic
          setWheelAngle(newAngle)

          if (progress < 1) {
            resetAnimRef.current = requestAnimationFrame(animateReset)
          } else {
            resetAnimRef.current = null
            setWheelAngle(targetAngle)
          }
        }

        resetAnimRef.current = requestAnimationFrame(animateReset)
      }, 500)
    }, 3000)
    return () => clearInterval(interval)
  }, [heroTexts.length, heroTextIndex, wheelAngle, animationsEnabled])

  useEffect(() => {
    const measureWidths = () => {
      if (!heroLine1Ref.current || !heroLine2Ref.current || !heroLine3Ref.current) return

      const currentIndex = heroDisplayIndex
      const nextIndex = heroTextIndex

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.font = getComputedStyle(heroLine1Ref.current).font

      const maxWidths: number[] = []
      for (let lineIdx = 0; lineIdx < 3; lineIdx++) {
        const currentText = heroTexts[currentIndex][lineIdx]
        const nextText = heroTexts[nextIndex][lineIdx]
        const currentWidth = ctx.measureText(currentText).width
        const nextWidth = ctx.measureText(nextText).width
        maxWidths.push(Math.max(currentWidth, nextWidth))
      }

      setHeroMaxWidths(maxWidths)
    }

    measureWidths()
    window.addEventListener('resize', measureWidths)
    return () => window.removeEventListener('resize', measureWidths)
  }, [heroDisplayIndex, heroTextIndex, heroTexts])

  useEffect(() => {
    return () => {
      if (inertiaRef.current !== null) {
        cancelAnimationFrame(inertiaRef.current)
      }
      if (autoAdjustTimeoutRef.current !== null) {
        clearTimeout(autoAdjustTimeoutRef.current)
      }
    }
  }, [])

  const startResetAnimation = () => {
    if (inertiaRef.current !== null) {
      cancelAnimationFrame(inertiaRef.current)
      inertiaRef.current = null
    }
    if (resetAnimRef.current !== null) {
      cancelAnimationFrame(resetAnimRef.current)
    }

    velocityRef.current = 0
    wobbleAmplitudeRef.current = 0
    setWheelWobble(0)

    // Find nearest 90-degree position in full rotation history
    const cardinalOffsets = [0, 90, 180, 270]
    
    let targetAngle = wheelAngle
    let minDistance = Infinity

    for (const offset of cardinalOffsets) {
      // Generate candidate angles (current rotation + offset, and full rotations around it)
      const baseTarget = Math.floor(wheelAngle / 360) * 360 + offset
      const candidates = [baseTarget, baseTarget + 360, baseTarget - 360]
      
      for (const candidate of candidates) {
        const distance = Math.abs(wheelAngle - candidate)
        if (distance < minDistance) {
          minDistance = distance
          targetAngle = candidate
        }
      }
    }

    const startAngle = wheelAngle
    resetStartTimeRef.current = performance.now()

    const animateReset = (time: number) => {
      const elapsed = time - resetStartTimeRef.current
      const duration = 600
      const progress = Math.min(elapsed / duration, 1)

      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const newAngle = startAngle + (targetAngle - startAngle) * easeOutCubic
      setWheelAngle(newAngle)

      if (progress < 1) {
        resetAnimRef.current = requestAnimationFrame(animateReset)
      } else {
        resetAnimRef.current = null
        setWheelAngle(targetAngle)
      }
    }

    resetAnimRef.current = requestAnimationFrame(animateReset)
  }

  const getPointerAngle = (clientX: number, clientY: number) => {
    if (!wheelRef.current) return 0
    const rect = wheelRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI
  }

  const startInertia = () => {
    if (inertiaRef.current !== null) {
      cancelAnimationFrame(inertiaRef.current)
    }
    if (autoAdjustTimeoutRef.current !== null) {
      clearTimeout(autoAdjustTimeoutRef.current)
    }

    let lastTime = performance.now()
    const step = (time: number) => {
      const dt = time - lastTime
      lastTime = time

      let velocity = velocityRef.current
      velocity *= Math.pow(0.94, dt / 16.67)
      if (Math.abs(velocity) < 0.002) {
        velocityRef.current = 0
        inertiaRef.current = null
        setWheelWobble(0)
        
        // Auto-adjust after 1 second to match current hero text angle
        autoAdjustTimeoutRef.current = window.setTimeout(() => {
          if (resetAnimRef.current !== null) {
            cancelAnimationFrame(resetAnimRef.current)
          }

          // Calculate target angle based on current hero text
          const targetOffset = heroTextIndex * 90
          const baseTarget = Math.floor(wheelAngle / 360) * 360 + targetOffset
          const candidates = [baseTarget, baseTarget + 360, baseTarget - 360]
          
          let targetAngle = baseTarget
          let minDistance = Infinity
          for (const candidate of candidates) {
            const distance = Math.abs(wheelAngle - candidate)
            if (distance < minDistance) {
              minDistance = distance
              targetAngle = candidate
            }
          }

          const startAngle = wheelAngle
          resetStartTimeRef.current = performance.now()

          const animateReset = (time: number) => {
            const elapsed = time - resetStartTimeRef.current
            const duration = 600
            const progress = Math.min(elapsed / duration, 1)

            const easeOutCubic = 1 - Math.pow(1 - progress, 3)
            const newAngle = startAngle + (targetAngle - startAngle) * easeOutCubic
            setWheelAngle(newAngle)

            if (progress < 1) {
              resetAnimRef.current = requestAnimationFrame(animateReset)
            } else {
              resetAnimRef.current = null
              setWheelAngle(targetAngle)
            }
          }

          resetAnimRef.current = requestAnimationFrame(animateReset)
        }, 1000)
        return
      }

      setWheelAngle((prev) => prev + velocity * dt)

      const wobbleDecay = Math.pow(0.9, dt / 16.67)
      wobbleAmplitudeRef.current *= wobbleDecay
      wobblePhaseRef.current += (dt / 1000) * 6
      const wobbleValue = wobbleAmplitudeRef.current * Math.sin(wobblePhaseRef.current)
      setWheelWobble(wobbleValue)

      velocityRef.current = velocity
      inertiaRef.current = requestAnimationFrame(step)
    }

    inertiaRef.current = requestAnimationFrame(step)
  }

  const expertiseData = useMemo<Record<LabKey, { title: string; description: string; stack: string }>>(
    () => ({
      fullstack: {
        title: 'Fullstack Systems',
        description:
          "I build end-to-end architectures with a focus on stability and clarity. My stack leans on Node.js and Golang with frontends in React/Vue, backed by Postgres for data that has to last. Demo includes an admin dashboard for game analytics.",
        stack:
          'Node.js, Golang, TypeScript, JavaScript, React, Next.js, Remix, Vue, Nuxt, Svelte, SvelteKit, Astro, Tailwind CSS, Vite, Webpack, Storybook, REST, GraphQL, tRPC, Prisma, Drizzle, PostgreSQL, MySQL, MongoDB, Redis, Supabase, Firebase, Docker, Kubernetes, CI/CD',
      },
      gamedev: {
        title: 'Game Engineering',
        description:
          "I craft interactive experiences across multiple engines and frameworks, from 2D browser games to full 3D environments. I adapt quickly to new game engines and tooling, whether it's Unity, Unreal, or web-based solutions. Demo showcases a dungeon management roguelike.",
        stack:
          'Canvas API, WebGL, TypeScript, C#, C++, Unity, Unreal Engine, Godot, GameMaker Studio, Phaser, PIXI.js, Three.js, ECS, Pathfinding, Finite State Machines, Physics',
      },
      mas: {
        title: 'Multi-Agent Systems',
        description:
          "I design autonomous agent architectures with emergent behaviors and coordination patterns. My approach balances complexity with maintainability, and I'm comfortable learning new frameworks or implementing custom solutions as projects demand. Demo features intelligent dungeon explorers.",
        stack:
          'Agent Logic, Behavior Trees, State Machines, Utility AI, BDI, Monte Carlo Tree Search, GOAP, Simulation, Planning, Coordination Protocols',
      },
      ai: {
        title: 'Applied AI (RAG + LLM Ops)',
        description:
          "I design AI systems that can actually be shipped: strict input handling, realistic performance, and outputs users can trust. The goal is always usable intelligence, not just a demo.",
        stack:
          'Python, TypeScript, Gemini, OpenAI, Anthropic, LangChain, LlamaIndex, RAG, Vector DBs (Pinecone, Weaviate, Qdrant), Embeddings, Prompt Engineering, Tooling, Guardrails, Evaluations, Observability',
      },
      n8n: {
        title: 'System Automation',
        description:
          "I build workflow automations that connect systems and reduce manual overhead. Whether it's no-code platforms like n8n and Zapier or custom scripting, I quickly adapt to whatever tooling best fits the use case. Demo automates dungeon management logic.",
        stack: 'n8n, Zapier, Make, Webhooks, Cron, Event Queues, API Integration, OAuth, WebSockets',
      },
      sqlite: {
        title: 'SQLite Ops',
        description:
          "I work with data storage solutions ranging from embedded SQLite to full-scale relational databases. I'm comfortable with schema design, query optimization, and adapting to different database paradigms as needed. Demo features in-browser SQLite with real-time queries.",
        stack: 'SQLite, SQL.js, WASM, IndexedDB, DuckDB, Postgres, SQL, Query Optimization, Schema Design',
      },
      ml: {
        title: 'Machine Learning',
        description:
          "I develop practical ML models focused on real-world deployment and measurable outcomes. My experience spans classical ML to neural networks, and I adapt quickly to new libraries and frameworks as the field evolves. Demo includes XGBoost predictor trained on 2,500+ runs.",
        stack:
          'XGBoost, LightGBM, Sklearn, TensorFlow, PyTorch, TensorFlow.js, Feature Engineering, Time Series, Model Serving, MLOps, Experiment Tracking',
      },
    }),
    []
  )

  const projects = personalData.projects ?? []
  const visibleProjects = activeProjectTag === 'all'
    ? projects
    : projects.filter((project) => project.tags?.includes(activeProjectTag))
  const projectsPerPage = typeof window !== 'undefined' && window.innerWidth >= 768 ? 6 : 3
  const totalProjectPages = Math.max(1, Math.ceil(visibleProjects.length / projectsPerPage))
  const clampedProjectPage = Math.min(projectPage, totalProjectPages)
  const pagedProjects = visibleProjects.slice(
    (clampedProjectPage - 1) * projectsPerPage,
    clampedProjectPage * projectsPerPage
  )
  const projectCounts = {
    all: projects.length,
    'web-dev': projects.filter((project) => project.tags?.includes('web-dev')).length,
    'mobile-dev': projects.filter((project) => project.tags?.includes('mobile-dev')).length,
    'game-dev': projects.filter((project) => project.tags?.includes('game-dev')).length,
    'ml-ai': projects.filter((project) => project.tags?.includes('ml-ai')).length,
  }

  useEffect(() => {
    setProjectPage(1)
  }, [activeProjectTag])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#2C2C2C] font-sans selection:bg-amber-400 scroll-smooth">
      {showLoader && (
        <div className={`loader-screen${booted ? ' loader-fade' : ''}`} role="status" aria-live="polite">
          <div className="loader-diamond">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <rect x="15" y="15" width="70" height="70" />
            </svg>
            <span className="loader-text-reveal">
              <span className="loader-text">LDR</span>
            </span>
          </div>
        </div>
      )}
      <nav className="border-b border-stone-300 p-4 sm:p-6 flex justify-between items-center bg-[#F4F1EA]/80 backdrop-blur sticky top-0 z-50">
        <a href="#hero" onClick={(e) => handleSmoothScroll(e, 'hero')} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold">LR</div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest">Lauda Dhia Raka</h1>
            <p className="text-[10px] font-mono opacity-50 underline decoration-amber-500">Informatics Enthusiast</p>
          </div>
        </a>
        <div className="hidden sm:flex gap-3 font-mono text-[10px] uppercase font-bold">
          <a 
            href="#lab" 
            onClick={(e) => handleSmoothScroll(e, 'lab')}
            className={`px-3 py-2 transition-all cursor-pointer ${
              currentSection === 'lab' 
                ? 'bg-black !text-white' 
                : 'text-stone-900 hover:text-amber-600'
            }`}
          >
            Expertise
          </a>
          <a 
            href="#projects" 
            onClick={(e) => handleSmoothScroll(e, 'projects')}
            className={`px-3 py-2 transition-all cursor-pointer ${
              currentSection === 'projects' 
                ? 'bg-black !text-white' 
                : 'text-stone-900 hover:text-amber-600'
            }`}
          >
            Archive
          </a>
          <a 
            href="#career" 
            onClick={(e) => handleSmoothScroll(e, 'career')}
            className={`px-3 py-2 transition-all cursor-pointer ${
              currentSection === 'career' 
                ? 'bg-black !text-white' 
                : 'text-stone-900 hover:text-amber-600'
            }`}
          >
            Career
          </a>
          <a 
            href="#organizations" 
            onClick={(e) => handleSmoothScroll(e, 'organizations')}
            className={`px-3 py-2 transition-all cursor-pointer ${
              currentSection === 'organizations' 
                ? 'bg-black !text-white' 
                : 'text-stone-900 hover:text-amber-600'
            }`}
          >
            Organizations
          </a>
          <a 
            href="#publications" 
            onClick={(e) => handleSmoothScroll(e, 'publications')}
            className={`px-3 py-2 transition-all cursor-pointer ${
              currentSection === 'publications' 
                ? 'bg-black !text-white' 
                : 'text-stone-900 hover:text-amber-600'
            }`}
          >
            Publications
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleSmoothScroll(e, 'contact')}
            className={`px-3 py-2 transition-all cursor-pointer ${
              currentSection === 'contact' 
                ? 'bg-black !text-white' 
                : 'text-stone-900 hover:text-amber-600'
            }`}
          >
            Contact
          </a>
        </div>
      </nav>

      <main className="w-full sm:max-w-6xl sm:mx-auto px-4 sm:px-6 pb-12">
        <section id="hero" className={`grid grid-cols-12 lg:gap-12 items-center min-h-[calc(100svh-6rem)] scroll-snap-align-start transition-all duration-700 ${visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="col-span-12 lg:col-span-7 order-1 flex flex-col justify-center text-center lg:text-left items-center lg:items-start min-w-0">
            <div className="hidden sm:inline-block px-2 py-1 bg-stone-200 font-mono text-[10px] uppercase mb-6">An aspiring Informatics Enthusiast with high Ambition</div>
            <h2 className="text-5xl pt-5 sm:pt-0 sm:text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-8 break-words max-w-full relative">
              <span className="hero-text-wrapper">
                {isTransitioning && (
                  <>
                    <span className="slide-out-text">{heroTexts[heroTextIndex][0]}</span> <br />
                    <span className="text-stone-400 slide-out-text slide-delay-1">{heroTexts[heroTextIndex][1]}</span> <br />
                    <span className="slide-out-text slide-delay-2">{heroTexts[heroTextIndex][2]}</span>
                  </>
                )}
                {!isTransitioning && (
                  <>
                    <span key={`line1-${heroTextIndex}`} className="slide-in-text">
                      {heroTexts[heroTextIndex][0]}
                    </span> <br />
                    <span key={`line2-${heroTextIndex}`} className="text-stone-400 slide-in-text slide-delay-1">
                      {heroTexts[heroTextIndex][1]}
                    </span> <br />
                    <span key={`line3-${heroTextIndex}`} className="slide-in-text slide-delay-2">
                      {heroTexts[heroTextIndex][2]}
                    </span>
                  </>
                )}
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-stone-600 max-w-xl leading-relaxed mb-8">
              I design full-stack systems where AI, data, and gameplay logic meet. My work is practical, fast, and tuned for real users.
            </p>
            <div className="flex gap-4">
              <a
                href="/pdf/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2C2C2C] !text-[#F4F1EA] px-8 py-4 font-bold uppercase tracking-widest hover:bg-amber-600 hover:text-[#2C2C2C] transition-all flex items-center justify-center"
                download
              >
                Download CV
              </a>
              <div className="flex items-center gap-4 px-6 border border-stone-300">
                <a href={PROFILE_CONTEXT.contact.github} aria-label="Github" className="hover:text-amber-600">
                  <Github size={20} />
                </a>
                <a href={`mailto:${PROFILE_CONTEXT.contact.email}`} aria-label="Email" className="hover:text-amber-600">
                  <Mail size={20} />
                </a>
                <a href={PROFILE_CONTEXT.contact.linkedin} aria-label="LinkedIn" className="hover:text-amber-600">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 order-2 mt-10 lg:mt-0 w-full max-w-md lg:max-w-none mx-auto">
            <div className="hidden lg:block">
              <div
                ref={wheelRef}
                className={`wheel-wrap${wheelDragging ? ' wheel-dragging' : ''}`}
                role="group"
                aria-label="Drag to rotate ferris wheel"
                onClick={() => {
                  if (dragMovedRef.current) {
                    dragMovedRef.current = false
                    return
                  }
                  startResetAnimation()
                }}
                onPointerDown={(event) => {
                  event.preventDefault()
                  setWheelDragging(true)
                  if (inertiaRef.current !== null) {
                    cancelAnimationFrame(inertiaRef.current)
                    inertiaRef.current = null
                  }
                  if (autoAdjustTimeoutRef.current !== null) {
                    clearTimeout(autoAdjustTimeoutRef.current)
                    autoAdjustTimeoutRef.current = null
                  }
                  const startAngle = getPointerAngle(event.clientX, event.clientY)
                  dragStartAngleRef.current = getPointerAngle(event.clientX, event.clientY)
                  dragStartRotationRef.current = wheelAngle
                  lastAngleRef.current = startAngle
                  lastTimeRef.current = performance.now()
                  velocityRef.current = 0
                  dragMovedRef.current = false
                  wobbleAmplitudeRef.current = 0
                  setWheelWobble(0)
                  wheelRef.current?.setPointerCapture(event.pointerId)
                }}
                onPointerMove={(event) => {
                  if (!wheelDragging) return
                  const currentAngle = getPointerAngle(event.clientX, event.clientY)
                  const delta = currentAngle - dragStartAngleRef.current
                  setWheelAngle(dragStartRotationRef.current + delta)

                  if (Math.abs(delta) > 0.5) {
                    dragMovedRef.current = true
                  }

                  const now = performance.now()
                  const angleDelta = currentAngle - lastAngleRef.current
                  const timeDelta = now - lastTimeRef.current
                  if (timeDelta > 0) {
                    velocityRef.current = angleDelta / timeDelta
                  }
                  lastAngleRef.current = currentAngle
                  lastTimeRef.current = now
                }}
                onPointerUp={(event) => {
                  setWheelDragging(false)
                  wheelRef.current?.releasePointerCapture(event.pointerId)
                  const velocityMagnitude = Math.min(Math.abs(velocityRef.current) * 120, 6)
                  wobbleAmplitudeRef.current = velocityMagnitude
                  wobblePhaseRef.current = 0
                  startInertia()
                }}
                onPointerCancel={() => setWheelDragging(false)}
                onPointerLeave={() => setWheelDragging(false)}
              >
                {/* Static highlight layer - DOES NOT ROTATE, clip-path stays at top-left */}
                <div className="wheel-static-highlight">
                  <div className="wheel-static-rotor" style={{ transform: `rotate(${wheelAngle + wheelWobble}deg)` }}>
                    {wheelItems.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <div key={`static-${index}`} className="wheel-item" style={{ transform: `rotate(${-wheelAngle - wheelWobble}deg)` }}>
                          <div className="wheel-item-inner border border-stone-300 p-6 flex flex-col justify-between" style={{ background: '#2C2C2C', color: '#F4F1EA' }}>
                            <Icon size={32} className="text-amber-500" />
                            <span className="font-bold text-lg uppercase leading-none">{item.label}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Rotating wheel layer - normal colors */}
                <div className="wheel-rotor" style={{ transform: `rotate(${wheelAngle + wheelWobble}deg)` }}>
                  {wheelItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={index} className="wheel-item" style={{ transform: `rotate(${-wheelAngle - wheelWobble}deg)` }}>
                        <div className="wheel-item-inner border border-stone-300 p-6 flex flex-col justify-between">
                          <Icon size={32} className="text-stone-400" />
                          <span className="font-bold text-lg uppercase leading-none">{item.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="lg:hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {wheelItems.map((item, index) => {
                  const Icon = item.icon
                  const isHighlighted = animationsEnabled && index === heroTextIndex
                  return (
                    <div
                      key={index}
                      className={`border border-stone-300 p-4 flex flex-col justify-between transition-all duration-500 ${
                        isHighlighted ? 'bg-[#2C2C2C]' : 'bg-white/40'
                      }`}
                    >
                      <Icon size={24} className={`transition-colors duration-500 ${isHighlighted ? 'text-amber-500' : 'text-stone-400'}`} />
                      <span className={`font-bold text-xs uppercase leading-tight transition-colors duration-500 ${isHighlighted ? 'text-[#F4F1EA]' : 'text-[#2C2C2C]'}`}>
                        {item.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="lab" className={`mt-20 mb-24 scroll-snap-align-start transition-all duration-700 ${visibleSections.has('lab') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-stone-900 text-amber-500">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-4xl font-bold uppercase tracking-tight">My Expertise</h3>
            </div>
            <p className="text-stone-500 font-mono text-xs uppercase tracking-widest">
              Technical Capabilities
            </p>
          </div>
{/* <div className="grid grid-cols-12 border border-stone-300 bg-white min-h-[720px] shadow-2xl overflow-hidden">
            <div className="col-span-12 md:col-span-3 border-r border-stone-300 bg-[#EBE7DF]/50 flex flex-col"> */}
          <div className="grid grid-cols-12 border border-stone-300 bg-white shadow-2xl overflow-hidden" style={{ minHeight: 'calc(7 * 4rem)' }}>
            <div className="col-span-12 md:col-span-3 md:border-r border-stone-300 bg-[#EBE7DF]/50 grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-col">
              {[
                { id: 'fullstack' as LabKey, icon: <Code2 size={16} />, label: 'Fullstack Dev' },
                { id: 'gamedev' as LabKey, icon: <Gamepad2 size={16} />, label: 'Game Design' },
                { id: 'mas' as LabKey, icon: <Cpu size={16} />, label: 'Multi-Agent' },
                { id: 'ai' as LabKey, icon: <Sparkles size={16} />, label: 'Applied AI' },
                { id: 'sqlite' as LabKey, icon: <DatabaseZap size={16} />, label: 'Database Engineering' },
                { id: 'ml' as LabKey, icon: <BrainCircuit size={16} />, label: 'Machine Learning' },
                { id: 'n8n' as LabKey, icon: <Workflow size={16} />, label: 'Automation' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === activeLab) return
                    setIsLabTransitioning(true)
                    setTimeout(() => {
                      setActiveLab(item.id)
                      setIsLabTransitioning(false)
                    }, 250)
                  }}
                  className={`flex items-center gap-3 p-4 text-left border-b border-stone-300 transition-all uppercase font-mono text-[10px] font-bold ${
                    activeLab === item.id ? 'bg-white text-amber-600' : 'hover:bg-white/50'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-9 p-6 md:p-10 bg-stone-50 overflow-y-auto flex flex-col">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="p-2 bg-amber-500 text-black"><Info size={16} /></span>
                  <h4 className={` text-xl md:text-2xl font-bold uppercase tracking-tighter ${isLabTransitioning ? 'slide-out-text' : 'slide-in-text'}`} key={`title-${activeLab}`}>
                    {expertiseData[activeLab].title}
                  </h4>
                </div>
                <p className={`text-stone-600 text-md md:text-lg leading-relaxed max-w-2xl mb-4 italic ${isLabTransitioning ? 'slide-out-text slide-delay-1' : 'slide-in-text slide-delay-1'}`} key={`desc-${activeLab}`}>
                  "{expertiseData[activeLab].description}"
                </p>
                <div className="flex gap-2">
                  <span className={`text-[10px] font-mono bg-stone-200 px-2 py-1 uppercase font-bold tracking-widest text-stone-500 inline-block ${isLabTransitioning ? 'slide-out-text slide-delay-2' : 'slide-in-text slide-delay-2'}`} key={`stack-${activeLab}`}>
                    STACK: {expertiseData[activeLab].stack}
                  </span>
                </div>
              </div>

              {/* {(
                <div className="flex-1 border-t border-stone-200 pt-10">
                  {activeLab === 'fullstack' && <FullstackLab />}
                  {activeLab === 'gamedev' && <GamedevLab />}
                  {activeLab === 'mas' && <MultiAgentLab />}
                  {activeLab === 'ai' && <AILab />}
                  {activeLab === 'sqlite' && <SQLiteLab />}
                  {activeLab === 'ml' && <MLLab />}
                  {activeLab === 'n8n' && <AutomationLab />}
                </div>
              )} */}
            </div>
          </div>
        </section>

        <section id="projects" className={`mb-24 scroll-snap-align-start transition-all duration-700 ${visibleSections.has('projects') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-stone-900 text-amber-500">
                <FolderOpen size={24} />
              </div>
              <h3 className="text-4xl font-bold uppercase tracking-tight">Project Archive</h3>
            </div>
            <p className="text-stone-500 font-mono text-xs uppercase tracking-widest">
              Portfolio Showcase // Full-Stack, AI, Game Dev &amp; Research Projects
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mb-8">
            {
              [
                { id: 'all', label: 'All' },
                { id: 'web-dev', label: 'Web Development' },
                { id: 'mobile-dev', label: 'Mobile Development' },
                { id: 'game-dev', label: 'Game Development' },
                { id: 'ml-ai', label: 'Machine Learning/Artificial Intelligence' },
              ].map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setActiveProjectTag(tag.id as typeof activeProjectTag)}
                  className={`px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all ${
                    activeProjectTag === tag.id
                      ? 'bg-black text-amber-500 border-black'
                      : 'bg-white border-stone-300 text-stone-500 hover:border-black hover:text-black'
                  }`}
                >
                  {tag.label} ({projectCounts[tag.id as keyof typeof projectCounts]})
                </button>
              ))
            }
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedProjects.map((project) => (
              <ProjectCard 
                key={project.title} 
                project={project}
                animationClass={isProjectTransitioning ? 'slide-out-text' : 'slide-in-text'}
              />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => {
                setIsProjectTransitioning(true)
                setTimeout(() => {
                  setProjectPage((prev) => Math.max(1, prev - 1))
                  setIsProjectTransitioning(false)
                }, 150)
              }}
              disabled={clampedProjectPage === 1}
              className={`px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all ${
                clampedProjectPage === 1
                  ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                  : 'bg-white border-stone-300 text-stone-500 hover:border-black hover:text-black'
              }`}
            >
              Prev
            </button>
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
              Page {clampedProjectPage} / {totalProjectPages}
            </span>
            <button
              onClick={() => {
                setIsProjectTransitioning(true)
                setTimeout(() => {
                  setProjectPage((prev) => Math.min(totalProjectPages, prev + 1))
                  setIsProjectTransitioning(false)
                }, 150)
              }}
              disabled={clampedProjectPage === totalProjectPages}
              className={`px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all ${
                clampedProjectPage === totalProjectPages
                  ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                  : 'bg-white border-stone-300 text-stone-500 hover:border-black hover:text-black'
              }`}
            >
              Next
            </button>
          </div>
        </section>

        <CareerHistory />
        <OrganizationHistory />
        <Publications />
        <ContactMe />
      </main>

      <footer className="py-12 bg-stone-200 border-t border-stone-300 px-4 sm:px-6">
        <div className="w-full flex justify-between items-center font-mono text-[10px] uppercase opacity-40">
          <span>© 2026 Made with ❤️ by Lauda Dhia Raka </span>
          <div className="flex gap-6">
            <a href={PROFILE_CONTEXT.contact.github} className="hover:text-black">Github</a>
            <a href={`mailto:${PROFILE_CONTEXT.contact.email}`} className="hover:text-black">Email</a>
            <a href={PROFILE_CONTEXT.contact.linkedin} className="hover:text-black">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
