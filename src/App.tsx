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
  role: 'Informatics Undergraduate / System Architect',
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
}: {
  project: { title: string; category: string; tech: string; description: string; url?: string }
}) => {
  const content = (
    <>
      {project.url && (
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
          <ExternalLink size={16} />
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
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
        className="group border border-stone-300 p-6 bg-[#EBE7DF]/40 hover:border-[#FFB000] transition-all duration-300 relative overflow-hidden"
      >
        {content}
      </a>
    )
  }

  return (
    <div className="group border border-stone-300 p-6 bg-[#EBE7DF]/40 hover:border-[#FFB000] transition-all duration-300 relative overflow-hidden">
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
  const wheelRef = useRef<HTMLDivElement | null>(null)
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
  const resetStartAngleRef = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!booted) return
    const timer = setTimeout(() => setShowLoader(false), 600)
    return () => clearTimeout(timer)
  }, [booted])

  useEffect(() => {
    return () => {
      if (inertiaRef.current !== null) {
        cancelAnimationFrame(inertiaRef.current)
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
    const normalizedAngle = ((wheelAngle % 360) + 360) % 360
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
          'I build end-to-end architectures with a focus on stability and clarity. My stack leans on Node.js and Golang with frontends in React/Vue, backed by Postgres for data that has to last. Demo includes an admin dashboard for game analytics.',
        stack:
          'Node.js, Golang, TypeScript, JavaScript, React, Next.js, Remix, Vue, Nuxt, Svelte, SvelteKit, Astro, Tailwind CSS, Vite, Webpack, Storybook, REST, GraphQL, tRPC, Prisma, Drizzle, PostgreSQL, MySQL, MongoDB, Redis, Supabase, Firebase, Docker, Kubernetes, CI/CD',
      },
      gamedev: {
        title: 'Game Engineering',
        description:
          'Build and manage your dungeon. Place traps, spawn monsters, and watch adventurers attempt to survive your gauntlet. A roguelike from the dungeon master perspective.',
        stack:
          'Canvas API, WebGL, TypeScript, C#, C++, Unity, Unreal Engine, Godot, GameMaker Studio, Phaser, PIXI.js, Three.js, ECS, Pathfinding, Finite State Machines, Physics',
      },
      mas: {
        title: 'Multi-Agent Systems',
        description:
          'Watch adventurer agents navigate the dungeon with different behaviors: solo explorers, team coordinators, and murder hobos. Each agent makes autonomous decisions.',
        stack:
          'Agent Logic, Behavior Trees, State Machines, Utility AI, BDI, Monte Carlo Tree Search, GOAP, Simulation, Planning, Coordination Protocols',
      },
      ai: {
        title: 'Applied AI (RAG + LLM Ops)',
        description:
          'I design AI systems that can actually be shipped: strict input handling, realistic performance, and outputs users can trust. The goal is always usable intelligence, not just a demo.',
        stack:
          'Python, TypeScript, Gemini, OpenAI, Anthropic, LangChain, LlamaIndex, RAG, Vector DBs (Pinecone, Weaviate, Qdrant), Embeddings, Prompt Engineering, Tooling, Guardrails, Evaluations, Observability',
      },
      n8n: {
        title: 'System Automation',
        description:
          'As the Dungeon Master, automation manages spawn timers, trap repairs, difficulty scaling, and resource allocation. Rule-based triggers keep the dungeon running autonomously.',
        stack: 'n8n, Zapier, Make, Webhooks, Cron, Event Queues, API Integration, OAuth, WebSockets',
      },
      sqlite: {
        title: 'SQLite Ops',
        description:
          'Query dungeon data directly. Fetch adventurer stats, room configurations, monster statuses, and run history. All data lives in an in-browser SQLite database.',
        stack: 'SQLite, SQL.js, WASM, IndexedDB, DuckDB, Postgres, SQL, Query Optimization, Schema Design',
      },
      ml: {
        title: 'Machine Learning',
        description:
          'XGBoost model trained on 2,500+ dungeon runs predicts adventurer survival probability, expected gold collection, and risk assessment with actionable recommendations.',
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
  const projectsPerPage = 6
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

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#2C2C2C] font-sans selection:bg-amber-400">
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold">LR</div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest">Lauda Dhia Raka</h1>
            <p className="text-[10px] font-mono opacity-50 underline decoration-amber-500">Informatics Undergraduate</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-6 font-mono text-[10px] uppercase font-bold">
          <a href="#lab" className="hover:text-amber-600">Expertise</a>
          <a href="#career" className="hover:text-amber-600">Career</a>
          <a href="#organizations" className="hover:text-amber-600">Organizations</a>
          <a href="#publications" className="hover:text-amber-600">Publications</a>
          <a href="#projects" className="hover:text-amber-600">Archive</a>
          <a href="#contact" className="hover:text-amber-600">Contact</a>
        </div>
      </nav>

      <main className="w-full sm:max-w-6xl sm:mx-auto px-4 sm:px-6 pb-12">
        <section className="grid grid-cols-12 lg:gap-12 items-center min-h-[calc(100svh-6rem)] scroll-snap-align-start ">
          <div className="col-span-12 lg:col-span-7 order-1 flex flex-col justify-center text-center lg:text-left items-center lg:items-start min-w-0">
            <div className="inline-block px-2 py-1 bg-stone-200 font-mono text-[10px] uppercase mb-6">An aspiring Informatic Fresh Graduate</div>
            <h2 className="text-5xl sm:text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-8 break-words max-w-full">
              System <br />
              <span className="text-stone-400 reveal-text reveal-delay-1">Architecture</span> <br />
              <span className="reveal-text reveal-delay-2">&amp; Intelligence</span>
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
                <div className="wheel-rotor" style={{ transform: `rotate(${wheelAngle + wheelWobble}deg)` }}>
                  <div className="wheel-item" style={{ transform: `rotate(${-wheelAngle - wheelWobble}deg)` }}>
                    <div className="wheel-item-inner border border-stone-300 p-6 bg-white/40 flex flex-col justify-between">
                      <Database size={32} className="text-stone-400" /><span className="font-bold text-lg uppercase leading-none">Backend Ops</span>
                    </div>
                  </div>
                  <div className="wheel-item" style={{ transform: `rotate(${-wheelAngle - wheelWobble}deg)` }}>
                    <div className="wheel-item-inner border border-stone-300 p-6 bg-white/40 flex flex-col justify-between">
                      <Layers size={32} className="text-stone-400" /><span className="font-bold text-lg uppercase leading-none">Front Systems</span>
                    </div>
                  </div>
                  <div className="wheel-item" style={{ transform: `rotate(${-wheelAngle - wheelWobble}deg)` }}>
                    <div className="wheel-item-inner border border-stone-300 p-6 bg-white/40 flex flex-col justify-between">
                      <Gamepad2 size={32} className="text-stone-400" /><span className="font-bold text-lg uppercase leading-none">Game Engines</span>
                    </div>
                  </div>
                  <div className="wheel-item" style={{ transform: `rotate(${-wheelAngle - wheelWobble}deg)` }}>
                    <div className="wheel-item-inner border border-stone-300 p-6 bg-[#2C2C2C] text-amber-500 flex flex-col justify-between">
                      <Cpu size={32} /><span className="font-bold text-lg uppercase leading-none text-[#F4F1EA]">Agentic AI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-stone-300 p-4 bg-white/40 flex flex-col justify-between">
                  <Database size={24} className="text-stone-400" />
                  <span className="font-bold text-xs uppercase leading-tight">Backend Ops</span>
                </div>
                <div className="border border-stone-300 p-4 bg-white/40 flex flex-col justify-between">
                  <Layers size={24} className="text-stone-400" />
                  <span className="font-bold text-xs uppercase leading-tight">Front Systems</span>
                </div>
                <div className="border border-stone-300 p-4 bg-white/40 flex flex-col justify-between">
                  <Gamepad2 size={24} className="text-stone-400" />
                  <span className="font-bold text-xs uppercase leading-tight">Game Engines</span>
                </div>
                <div className="border border-stone-300 p-4 bg-white/40 text-stone-700 flex flex-col justify-between sm:bg-[#2C2C2C] sm:text-amber-500">
                  <Cpu size={24} className="text-stone-400 sm:text-current" />
                  <span className="font-bold text-xs uppercase leading-tight sm:text-[#F4F1EA]">Agentic AI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="lab" className="mt-20 mb-24 scroll-snap-align-start">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-stone-900 text-amber-500">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-4xl font-bold uppercase tracking-tight">My Expertise</h3>
            </div>
            <p className="text-stone-500 font-mono text-xs uppercase tracking-widest">
              Technical Capabilities // Interactive Lab Demonstrations
            </p>
          </div>
{/* <div className="grid grid-cols-12 border border-stone-300 bg-white min-h-[720px] shadow-2xl overflow-hidden">
            <div className="col-span-12 md:col-span-3 border-r border-stone-300 bg-[#EBE7DF]/50 flex flex-col"> */}
          <div className="grid grid-cols-12 border border-stone-300 bg-white min-h-[720px] shadow-2xl overflow-hidden">
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
                    setActiveLab(item.id)
                  }}
                  className={`flex items-center gap-3 p-4 text-left border-b border-stone-300 transition-all uppercase font-mono text-[10px] font-bold ${
                    activeLab === item.id ? 'bg-white text-amber-600' : 'hover:bg-white/50'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-9 p-10 bg-stone-50 overflow-y-auto flex flex-col">
              <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3 mb-2">
                  <span className="p-2 bg-amber-500 text-black"><Info size={16} /></span>
                  <h4 className="text-2xl font-bold uppercase tracking-tighter">{expertiseData[activeLab].title}</h4>
                </div>
                <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mb-4 italic">
                  “{expertiseData[activeLab].description}”
                </p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-mono bg-stone-200 px-2 py-1 uppercase font-bold tracking-widest text-stone-500">
                    STACK: {expertiseData[activeLab].stack}
                  </span>
                </div>
              </div>

              <div className="flex-1 border-t border-stone-200 pt-10">
                {activeLab === 'fullstack' && <FullstackLab />}
                {activeLab === 'gamedev' && <GamedevLab />}
                {activeLab === 'mas' && <MultiAgentLab />}
                {activeLab === 'ai' && <AILab />}
                {activeLab === 'sqlite' && <SQLiteLab />}
                {activeLab === 'ml' && <MLLab />}
                {activeLab === 'n8n' && <AutomationLab />}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="mb-24 scroll-snap-align-start">
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
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setProjectPage((prev) => Math.max(1, prev - 1))}
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
              onClick={() => setProjectPage((prev) => Math.min(totalProjectPages, prev + 1))}
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
