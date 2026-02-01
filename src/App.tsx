import { useEffect, useMemo, useRef, useState } from 'react'
import * as Tone from 'tone'
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
  EggFried,
  Sun,
  Moon,
} from 'lucide-react'
import personalData from './personal-data.json'
// import { FullstackLab } from './components/labs/FullstackLab'
// import { GamedevLab } from './components/labs/GamedevLab'
// import { MultiAgentLab } from './components/labs/MultiAgentLab'
// import { AILab } from './components/labs/AILab'
// import { SQLiteLab } from './components/labs/SQLiteLab'
// import { MLLab } from './components/labs/MLLab'
// import { AutomationLab } from './components/labs/AutomationLab'
import { CareerHistory } from './components/CareerHistory'
import { OrganizationHistory } from './components/OrganizationHistory'
import { Publications } from './components/Publications'
import { ContactMe } from './components/ContactMe'

type LabKey = 'fullstack' | 'gamedev' | 'mas' | 'ai' | 'sqlite' | 'ml' | 'n8n' | 'outofthebox'

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
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--theme-muted)' }}>{project.category}</span>
        <span className="text-[10px] font-mono" style={{ color: 'var(--theme-accent)' }}>{project.tech}</span>
      </div>
      <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter project-card-title">{project.title}</h3>
      <p className="text-sm leading-relaxed mb-4 project-card-desc">{project.description}</p>
    </>
  )

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        className={`group project-card p-4 md:p-6 transition-all duration-300 relative overflow-hidden ${animationClass}`}
      >
        {content}
      </a>
    )
  }

  return (
    <div className={`group project-card p-4 md:p-6 transition-all duration-300 relative overflow-hidden ${animationClass}`}>
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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLabTransitioning, setIsLabTransitioning] = useState(false)
  const [isProjectTransitioning, setIsProjectTransitioning] = useState(false)
  const animationsEnabled = import.meta.env.VITE_ANIMATIONS_ENABLED !== 'false'
  // const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isDesktop, setIsDesktop] = useState(false)
  const [pianoMode, setPianoMode] = useState(false)
  const [keyShift, setKeyShift] = useState(0)
  const [octaveShift, setOctaveShift] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [currentSection, setCurrentSection] = useState<string>('hero')
  const [ambientOrbs, setAmbientOrbs] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    targetX: number
    targetY: number
    targetSize: number
  }>>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [activePianoKeys, setActivePianoKeys] = useState<Set<string>>(new Set());
  const [theme, setTheme] = useState<'' | 'deep-focus'>(() => {
    const saved = localStorage.getItem('portfolio-theme')
    return (saved === 'deep-focus' ? 'deep-focus' : '') as '' | 'deep-focus'
  });
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
  const autoAdjustTimeoutRef = useRef<number | null>(null)
  const pianoRef = useRef<Tone.PolySynth | null>(null)
  const activeKeyNotesRef = useRef<Map<string, string>>(new Map())

  const wheelItems = useMemo(() => [
    { icon: Layers, label: 'Fullstack Dev' },
    { icon: Gamepad2, label: 'Game Engines' },
    { icon: Database, label: 'Project Ops' },
    { icon: Cpu, label: 'Agentic AI' },
  ], [])

  const wheelOrder = useMemo(() => [0, 1, 3, 2], [])

  const labNotes = useMemo<Record<LabKey, string>>(
    () => ({
      fullstack: 'C4',
      gamedev: 'D4',
      mas: 'E4',
      ai: 'F4',
      sqlite: 'G4',
      ml: 'A4',
      n8n: 'B4',
      outofthebox: 'C5',
    }),
    []
  )

  const labKeyLabels = useMemo<Record<LabKey, string>>(
    () => ({
      fullstack: 'Q',
      gamedev: 'W',
      mas: 'E',
      ai: 'R',
      sqlite: 'T',
      ml: 'Y',
      n8n: 'U',
      outofthebox: 'I',
    }),
    []
  )

  const blackKeyLabels = useMemo<(string | null)[]>(
    () => ['2', '3', null, '5', '6', '7', null, null],
    []
  )

  const keyNames = useMemo(() => ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], [])

  const getTransposedNote = (note: string) => {
    const semitoneShift = keyShift + octaveShift * 12
    return Tone.Frequency(note).transpose(semitoneShift).toNote()
  }

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme)
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

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
    const media = window.matchMedia('(min-width: 768px)')
    const handleChange = () => setIsDesktop(media.matches)
    handleChange()

    if (media.addEventListener) {
      media.addEventListener('change', handleChange)
    } else {
      media.addListener(handleChange)
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handleChange)
      } else {
        media.removeListener(handleChange)
      }
    }
  }, [])

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

  // Click ripple effect
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

  // Cursor tracking for orb magnetism
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Ambient Orbs
  useEffect(() => {
    let orbIdCounter = 0

    const spawnOrb = () => {
      const id = orbIdCounter++
      const size = Math.random() * 200 + 100 // 100-300px
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight

      const newOrb = {
        id,
        x,
        y,
        size,
        targetX: x,
        targetY: y,
        targetSize: size,
      }

      setAmbientOrbs((prev) => [...prev, newOrb])

      // Orb lifetime
      const lifetime = Math.random() * 7000 + 8000
      const deathTimer = setTimeout(() => {
        setAmbientOrbs((prev) => prev.filter((o) => o.id !== id))
      }, lifetime)

      return deathTimer
    }

    const spawnInterval = setInterval(() => {
      spawnOrb()
    }, Math.random() * 4000 + 3000)

    const animationFrame = setInterval(() => {
      setAmbientOrbs((prev) =>
        prev.map((orb) => {
          const dx = cursorPos.x - orb.x
          const dy = cursorPos.y - orb.y
          const distToCursor = Math.sqrt(dx * dx + dy * dy)
          const magneticRadius = 300

          // If orb is within magnetic radius, attract it to cursor
          if (distToCursor < magneticRadius) {
            orb.targetX = cursorPos.x + (Math.random() - 0.5) * 50 
            orb.targetY = cursorPos.y + (Math.random() - 0.5) * 50
          } else if (Math.random() < 0.05) {
            // Otherwise, randomly pick new target
            orb.targetX = Math.random() * window.innerWidth
            orb.targetY = Math.random() * window.innerHeight
            orb.targetSize = Math.random() * 200 + 100
          }

          const targetDx = orb.targetX - orb.x
          const targetDy = orb.targetY - orb.y
          const ds = orb.targetSize - orb.size

          return {
            ...orb,
            x: orb.x + targetDx * 0.02,
            y: orb.y + targetDy * 0.02,
            size: orb.size + ds * 0.03,
          }
        })
      )
    }, 50)

    // Initial spawn
    spawnOrb()
    spawnOrb()

    return () => {
      clearInterval(spawnInterval)
      clearInterval(animationFrame)
    }
  }, [])

  const MobileHeroTexts = useMemo(() => [
    ['Fullstack', 'Engineer', '& Architect'],
    ['Game', 'Development', '& Ideation'],
    ['Development', 'Security', '& Operation'],
    ['Machine', 'Learning', '& Applied AI'],
  ], [])

  const DesktopHeroTexts = useMemo(() => [
    ['Fullstack', 'Engineer', '& Architect'],
    ['Machine', 'Learning', '& Applied AI'],
    ['Development', 'Security', '& Operation'],
    ['Game', 'Development', '& Ideation'],
  ], [])

  const heroTexts = useMemo(
    () => (isDesktop ? DesktopHeroTexts : MobileHeroTexts),
    [isDesktop, DesktopHeroTexts, MobileHeroTexts]
  )

  useEffect(() => {
    if (!animationsEnabled) return
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        const nextIndex = (heroTextIndex + 1) % heroTexts.length
        setHeroTextIndex(nextIndex)
        setIsTransitioning(false)
        
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

    const cardinalOffsets = [0, 90, 180, 270]
    
    let targetAngle = wheelAngle
    let minDistance = Infinity

    for (const offset of cardinalOffsets) {
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
        
        autoAdjustTimeoutRef.current = window.setTimeout(() => {
          if (resetAnimRef.current !== null) {
            cancelAnimationFrame(resetAnimRef.current)
          }

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
          "I build end-to-end architectures with a focus on stability and clarity. My stack leans on Node.js, PHP, Java, and Golang with frontends in React/Vue, backed by Postgres for data that has to last. I adapt quickly to new frameworks and tools as project needs evolve.",
        stack:
          'Node.js, Golang, TypeScript, JavaScript, React, Next.js, Vue, Nuxt, Svelte, SvelteKit, Express, FastAPI, Flask, Django, Laravel, SpringBoot, Astro, Tailwind CSS, Vite, Webpack, Storybook, REST, PostgreSQL, MySQL, MongoDB, Redis, Supabase, Firebase, Docker, Kubernetes, CI/CD',
      },
      gamedev: {
        title: 'Game Engineering',
        description:
          "I craft interactive experiences across multiple engines and frameworks, from 2D browser games to full 3D environments. I adapt quickly to new game engines and tooling, whether it's Unity, Godot, or web-based solutions. My favorite game project features procedural dungeon generation and dynamic AI agents.",
        stack:
          'C#, C++, Unity, Unreal Engine, Godot, GameMaker Studio, RenPy, RPGMaker, Three.js, ECS, Pathfinding, Finite State Machines, Physics',
      },
      mas: {
        title: 'Multi-Agent Systems',
        description:
          "I design autonomous agent architectures with emergent behaviors and coordination patterns. My approach balances complexity with maintainability, and I'm comfortable learning new frameworks or implementing custom solutions as projects demand.",
        stack:
          'Agent Logic, Behavior Trees, State Machines, Utility AI, BDI, Monte Carlo Tree Search, GOAP, Simulation, Planning, Coordination Protocols',
      },
      ai: {
        title: 'Applied AI (RAG + LLM Ops)',
        description:
          "I design AI systems that can actually be shipped. Whether it need strict input handling, realistic performance, and outputs users can trust. I build end-to-end AI solutions using RAG, vector databases, and prompt engineering to deliver real value.",
        stack:
          'Gemini, OpenAI, Anthropic, LangChain, LlamaIndex, RAG, Vector DBs (Pinecone, Weaviate, Qdrant), Embeddings, Prompt Engineering',
      },
      n8n: {
        title: 'System Automation',
        description:
          "I build workflow automations that connect systems and reduce manual overhead. Whether it's no-code platforms like n8n and Zapier or custom scripting, I quickly adapt to whatever tooling best fits the use case. My favorite project automated data syncing between multiple SaaS platforms using n8n.",
        stack: 'n8n, Zapier, Make, Webhooks, Cron, Event Queues, API Integration, OAuth, WebSockets',
      },
      sqlite: {
        title: 'Database Engineering',
        description:
          "I work with data storage solutions ranging from embedded SQLite to full-scale relational databases. I'm comfortable with schema design, query optimization, and adapting to different database paradigms as needed. My favorite project involved building a custom data storage layer using SQL.js for offline-first web applications.",
        stack: 'SQLite, SQL.js, WASM, IndexedDB, DuckDB, Postgres, SQL, MongoDB, Redis, VectorDBs',
      },
      ml: {
        title: 'Machine Learning',
        description:
          "I develop practical ML models focused on real-world deployment and measurable outcomes. My experience spans classical ML to neural networks, and I adapt quickly to new libraries and frameworks as the field evolves. My favorite project involved time series forecasting using LSTM networks.",
        stack:
          'XGBoost, LightGBM, Sklearn, TensorFlow, PyTorch, TensorFlow.js, Feature Engineering, Time Series, Model Serving, MLOps, Experiment Tracking',
      },
      outofthebox: {
        title: 'Out of the Box Thinking',
        description:
          "I enjoy exploring unconventional approaches that make work more effective and fun. I look for creative shortcuts, playful prototypes, and unorthodox solutions that still ship cleanly and reliably.",
        stack:
          'Rapid Prototyping, Creative Problem Solving, UX Experiments, Design Sprints, Lightweight Automation, Exploratory Research',
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

  const handleThemeToggle = () => {
    setShowLoader(true)
    setBooted(false)
    
    // Wait for loader to fully cover (fade in)
    setTimeout(() => {
      // Change theme while fully covered
      setTheme(theme === 'deep-focus' ? '' : 'deep-focus')
      
      // Wait a bit to ensure theme fully applied, then start fade out
      setTimeout(() => {
        setBooted(true)
        setTimeout(() => {
          setShowLoader(false)
        }, 600)
      }, 300)
    }, 600)
  }

  const playPianoNote = async (note: string) => {
    if (!isDesktop || !pianoMode) return
    await Tone.start()
    if (!pianoRef.current) {
      pianoRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.8 },
      }).toDestination()
    }
    pianoRef.current.triggerAttackRelease(getTransposedNote(note), '8n')
  }

  useEffect(() => {
    if (!isDesktop || !pianoMode) return

      const keyToNote: Record<string, string> = {
      q: 'C4',
      w: 'D4',
      e: 'E4',
      r: 'F4',
      t: 'G4',
      y: 'A4',
      u: 'B4',
      i: 'C5',
      '2': 'C#4',
      '3': 'D#4',
      '5': 'F#4',
      '6': 'G#4',
      '7': 'A#4',
    }

    const ensureSynth = async () => {
      await Tone.start()
      if (!pianoRef.current) {
        pianoRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.8 },
        }).toDestination()
      }
    }

    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.repeat) return
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return

      const key = event.key.toLowerCase()
      const note = keyToNote[key]
      if (!note) return

      await ensureSynth()
      const transposed = getTransposedNote(note)
      pianoRef.current?.triggerAttack(transposed)
      activeKeyNotesRef.current.set(key, transposed)
      setActivePianoKeys(prev => new Set(prev).add(key))
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const note = activeKeyNotesRef.current.get(key)
      if (!note) return
      pianoRef.current?.triggerRelease(note)
      activeKeyNotesRef.current.delete(key)
      setActivePianoKeys(prev => {
        const updated = new Set(prev)
        updated.delete(key)
        return updated
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      activeKeyNotesRef.current.clear()
    }
  }, [isDesktop, pianoMode, keyShift, octaveShift])

  return (
    <div className="min-h-screen font-sans scroll-smooth" style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)' }}>
      {/* Ambient Orbs */}
      {ambientOrbs.map((orb) => (
        <div
          key={orb.id}
          className="ambient-orb"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: 'var(--theme-orb)',
            left: `${orb.x}px`,
            top: `${orb.y}px`,
            opacity: 0.15,
            transition: 'all 0.1s linear',
          }}
        />
      ))}
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
      <nav className="border-b p-4 sm:p-6 flex justify-between items-center backdrop-blur sticky top-0 z-50" style={{ borderColor: 'var(--theme-border)', backgroundColor: 'rgba(var(--theme-bg-rgb), 0.8)' }}>
        <div className="flex items-center gap-4">
          <a href="#hero" onClick={(e) => handleSmoothScroll(e, 'hero')} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center text-white font-bold" 
              style={{
                backgroundColor: 'var(--theme-nav-active-bg)',
                color: 'var(--theme-nav-active-text)'
              }}>LR</div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-widest">Lauda Dhia Raka</h1>
              <p className="text-[10px] font-mono opacity-50 underline" style={{ textDecorationColor: 'var(--theme-accent)' }}>
                Informatics Enthusiast
              </p>
            </div>
          </a>
          
          {/* Theme Toggle Switch - Desktop Only */}
          <button
            onClick={handleThemeToggle}
            className="relative w-14 h-7 rounded-full transition-colors hidden sm:flex items-center justify-center"
            style={{ 
              backgroundColor: theme === 'deep-focus' ? 'var(--theme-accent)' : 'var(--theme-muted)',
            }}
            aria-label="Toggle theme"
          >
            <span 
              className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
              style={{ 
                backgroundColor: 'var(--theme-bg)',
                transform: theme === 'deep-focus' ? 'translateX(28px)' : 'translateX(0)',
              }}
            >
              {theme === 'deep-focus' ? <Moon size={14} style={{ color: 'var(--theme-accent)' }} /> : <Sun size={14} style={{ color: 'var(--theme-accent)' }} />}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Switch - Mobile Only */}
          <button
            onClick={handleThemeToggle}
            className="relative w-14 h-7 rounded-full transition-colors sm:hidden"
            style={{ 
              backgroundColor: theme === 'deep-focus' ? 'var(--theme-accent)' : 'var(--theme-muted)',
            }}
            aria-label="Toggle theme"
          >
            <span 
              className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
              style={{ 
                backgroundColor: 'var(--theme-bg)',
                transform: theme === 'deep-focus' ? 'translateX(28px)' : 'translateX(0)',
              }}
            >
              {theme === 'deep-focus' ? <Moon size={14} style={{ color: 'var(--theme-accent)' }} /> : <Sun size={14} style={{ color: 'var(--theme-accent)' }} />}
            </span>
          </button>
          
          <div className="hidden sm:flex gap-3 font-mono text-[10px] uppercase font-bold">
            <a 
              href="#lab" 
              onClick={(e) => handleSmoothScroll(e, 'lab')}
              className="px-3 py-2 transition-all cursor-pointer"
              style={{
                backgroundColor: currentSection === 'lab' ? 'var(--theme-nav-active-bg)' : 'transparent',
                color: currentSection === 'lab' ? 'var(--theme-nav-active-text)' : 'var(--theme-text)'
              }}
              onMouseEnter={(e) => {
                if (currentSection !== 'lab') e.currentTarget.style.color = 'var(--theme-accent)'
              }}
              onMouseLeave={(e) => {
                if (currentSection !== 'lab') e.currentTarget.style.color = 'var(--theme-text)'
              }}
            >
              Expertise
            </a>
            <a 
              href="#projects" 
              onClick={(e) => handleSmoothScroll(e, 'projects')}
              className="px-3 py-2 transition-all cursor-pointer"
              style={{
                backgroundColor: currentSection === 'projects' ? 'var(--theme-nav-active-bg)' : 'transparent',
                color: currentSection === 'projects' ? 'var(--theme-nav-active-text)' : 'var(--theme-text)'
              }}
              onMouseEnter={(e) => {
                if (currentSection !== 'projects') e.currentTarget.style.color = 'var(--theme-accent)'
              }}
              onMouseLeave={(e) => {
                if (currentSection !== 'projects') e.currentTarget.style.color = 'var(--theme-text)'
              }}
            >
              Archive
            </a>
            <a 
              href="#career" 
              onClick={(e) => handleSmoothScroll(e, 'career')}
              className="px-3 py-2 transition-all cursor-pointer"
              style={{
                backgroundColor: currentSection === 'career' ? 'var(--theme-nav-active-bg)' : 'transparent',
                color: currentSection === 'career' ? 'var(--theme-nav-active-text)' : 'var(--theme-text)'
              }}
              onMouseEnter={(e) => {
                if (currentSection !== 'career') e.currentTarget.style.color = 'var(--theme-accent)'
              }}
              onMouseLeave={(e) => {
                if (currentSection !== 'career') e.currentTarget.style.color = 'var(--theme-text)'
              }}
            >
              Career
            </a>
            <a 
              href="#organizations" 
              onClick={(e) => handleSmoothScroll(e, 'organizations')}
              className="px-3 py-2 transition-all cursor-pointer"
              style={{
                backgroundColor: currentSection === 'organizations' ? 'var(--theme-nav-active-bg)' : 'transparent',
                color: currentSection === 'organizations' ? 'var(--theme-nav-active-text)' : 'var(--theme-text)'
              }}
              onMouseEnter={(e) => {
                if (currentSection !== 'organizations') e.currentTarget.style.color = 'var(--theme-accent)'
              }}
              onMouseLeave={(e) => {
                if (currentSection !== 'organizations') e.currentTarget.style.color = 'var(--theme-text)'
              }}
            >
              Organizations
            </a>
            <a 
              href="#publications" 
              onClick={(e) => handleSmoothScroll(e, 'publications')}
              className="px-3 py-2 transition-all cursor-pointer"
              style={{
                backgroundColor: currentSection === 'publications' ? 'var(--theme-nav-active-bg)' : 'transparent',
                color: currentSection === 'publications' ? 'var(--theme-nav-active-text)' : 'var(--theme-text)'
              }}
              onMouseEnter={(e) => {
                if (currentSection !== 'publications') e.currentTarget.style.color = 'var(--theme-accent)'
              }}
              onMouseLeave={(e) => {
                if (currentSection !== 'publications') e.currentTarget.style.color = 'var(--theme-accent)'
              }}
            >
              Publications
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleSmoothScroll(e, 'contact')}
              className="px-3 py-2 transition-all cursor-pointer"
              style={{
                backgroundColor: currentSection === 'contact' ? 'var(--theme-nav-active-bg)' : 'transparent',
                color: currentSection === 'contact' ? 'var(--theme-nav-active-text)' : 'var(--theme-text)'
              }}
              onMouseEnter={(e) => {
                if (currentSection !== 'contact') e.currentTarget.style.color = 'var(--theme-accent)'
              }}
              onMouseLeave={(e) => {
                if (currentSection !== 'contact') e.currentTarget.style.color = 'var(--theme-text)'
              }}
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      <main className="w-full sm:max-w-6xl sm:mx-auto px-4 sm:px-6 pb-12 relative z-10">
        <section id="hero" className={`grid grid-cols-12 md:gap-12 items-center min-h-[calc(100svh-6rem)] scroll-snap-align-start transition-all duration-700 ${visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="col-span-12 md:col-span-7 order-1 flex flex-col justify-center text-center md:text-left items-center md:items-start min-w-0">
            <div className="hidden sm:inline-block px-2 py-1 font-mono text-[10px] uppercase mb-6" style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>An aspiring Informatics Enthusiast with high Ambition</div>
            <h2 className="text-6xl pt-5 sm:pt-0 sm:text-5xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-8 break-words max-w-full relative">
              <span className="hero-text-wrapper">
                {isTransitioning && (
                  <>
                    <span className="slide-out-text">{heroTexts[heroTextIndex][0]}</span> <br />
                    <span className="slide-out-text slide-delay-1" style={{ color: 'var(--theme-muted)' }}>{heroTexts[heroTextIndex][1]}</span> <br />
                    <span className="slide-out-text slide-delay-2">{heroTexts[heroTextIndex][2]}</span>
                  </>
                )}
                {!isTransitioning && (
                  <>
                    <span key={`line1-${heroTextIndex}`} className="slide-in-text">
                      {heroTexts[heroTextIndex][0]}
                    </span> <br />
                    <span key={`line2-${heroTextIndex}`} className="slide-in-text slide-delay-1" style={{ color: 'var(--theme-muted)' }}>
                      {heroTexts[heroTextIndex][1]}
                    </span> <br />
                    <span key={`line3-${heroTextIndex}`} className="slide-in-text slide-delay-2">
                      {heroTexts[heroTextIndex][2]}
                    </span>
                  </>
                )}
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed mb-8" style={{ color: 'var(--theme-muted)' }}>
              I design full-stack systems where AI, data, and logic meet. My work is practical, fast, and tuned for real users.
            </p>
            <div className="flex gap-4">
              <a
                href="/pdf/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 font-bold uppercase tracking-widest transition-all flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--theme-nav-active-bg)', 
                  color: 'var(--theme-nav-active-text)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--theme-accent)'
                  e.currentTarget.style.color = 'var(--theme-text)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--theme-nav-active-bg)'
                  e.currentTarget.style.color = 'var(--theme-nav-active-text)'
                }}
                download
              >
                Download CV
              </a>
              <div className="flex items-center gap-4 px-6 border" style={{ borderColor: 'var(--theme-border)' }}>
                <a href={PROFILE_CONTEXT.contact.github} aria-label="Github" className="transition-colors" style={{ color: 'var(--theme-text)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-text)'}>
                  <Github size={20} />
                </a>
                <a href={`mailto:${PROFILE_CONTEXT.contact.email}`} aria-label="Email" className="transition-colors" style={{ color: 'var(--theme-text)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-text)'}>
                  <Mail size={20} />
                </a>
                <a href={PROFILE_CONTEXT.contact.linkedin} aria-label="LinkedIn" className="transition-colors" style={{ color: 'var(--theme-text)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-text)'}>
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 order-2 mt-10 md:mt-0 w-full max-w-md md:max-w-none mx-auto">
            <div className="hidden md:block">
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
                {/* Background layer - clipped to only show in top-left quadrant */}
                <div className="wheel-background"></div>
                
                {/* Static highlight layer - DOES NOT ROTATE, clip-path stays at top-left */}
                <div className="wheel-static-highlight">
                  <div className="wheel-static-rotor" style={{ transform: `rotate(${wheelAngle + wheelWobble}deg)` }}>
                    {wheelOrder.map((itemIndex, index) => {
                      const item = wheelItems[itemIndex]
                      const Icon = item.icon
                      return (
                        <div key={`static-${index}`} className="wheel-item" style={{ transform: `rotate(${-wheelAngle - wheelWobble}deg)` }}>
                          <div className="wheel-item-inner border p-6 flex flex-col justify-between" style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-nav-active-bg)', color: 'var(--theme-nav-active-text)' }}>
                            <Icon size={32} style={{ color: 'var(--theme-accent)' }} />
                            <span className="font-bold text-lg uppercase leading-none">{item.label}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Rotating wheel layer - normal colors */}
                <div className="wheel-rotor" style={{ transform: `rotate(${wheelAngle + wheelWobble}deg)` }}>
                  {wheelOrder.map((itemIndex, index) => {
                    const item = wheelItems[itemIndex]
                    const Icon = item.icon
                    return (
                      <div key={index} className="wheel-item" style={{ transform: `rotate(${-wheelAngle - wheelWobble}deg)` }}>
                        <div className="wheel-item-inner border p-6 flex flex-col justify-between" style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>
                          <Icon size={32} style={{ color: 'var(--theme-muted)' }} />
                          <span className="font-bold text-lg uppercase leading-none">{item.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="md:hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {wheelItems.map((item, index) => {
                  const Icon = item.icon
                  const isHighlighted = animationsEnabled && index === heroTextIndex
                  return (
                    <div
                      key={index}
                      className="border p-4 flex flex-col justify-between transition-all duration-500"
                      style={{
                        borderColor: 'var(--theme-border)',
                        backgroundColor: isHighlighted ? 'var(--theme-nav-active-bg)' : 'var(--theme-surface-hover)'
                      }}
                    >
                      <Icon
                        size={24}
                        className="transition-colors duration-500"
                        style={{ color: isHighlighted ? 'var(--theme-accent)' : 'var(--theme-muted)' }}
                      />
                      <span
                        className="font-bold text-xs uppercase leading-tight transition-colors duration-500"
                        style={{ color: isHighlighted ? 'var(--theme-nav-active-text)' : 'var(--theme-text)' }}
                      >
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
              <div className="p-3" style={{ backgroundColor: 'var(--theme-nav-active-bg)', color: 'var(--theme-accent)' }}>
                <Lightbulb size={24} />
              </div>
              <h3 className="text-4xl font-bold uppercase tracking-tight">My Expertise</h3>
            </div>
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--theme-muted)' }}>
              Technical Capabilities.
            </p>
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--theme-muted)' }}>
              //TODO: Add interactive and integrated demos
            </p>
          </div>
{/* <div className="grid grid-cols-12 border border-stone-300 bg-white min-h-[720px] shadow-2xl overflow-hidden">
            <div className="col-span-12 md:col-span-3 border-r border-stone-300 bg-[#EBE7DF]/50 flex flex-col"> */}
          <div
            className="grid grid-cols-12 border shadow-2xl overflow-hidden"
            style={{ minHeight: 'calc(7 * 4rem)', borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-bg)' }}
          >
            <div
              className={`col-span-12 md:col-span-3 md:border-r grid grid-cols-2 sm:grid-cols-4 md:flex md:flex-col relative${pianoMode && isDesktop ? ' lab-piano' : ''}`}
              style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-surface-hover)' }}
            >
              {[
                { id: 'fullstack' as LabKey, icon: <Code2 size={16} />, label: 'Fullstack Dev' },
                { id: 'gamedev' as LabKey, icon: <Gamepad2 size={16} />, label: 'Game Design' },
                { id: 'mas' as LabKey, icon: <Cpu size={16} />, label: 'Multi-Agent' },
                { id: 'ai' as LabKey, icon: <Sparkles size={16} />, label: 'Applied AI' },
                { id: 'sqlite' as LabKey, icon: <DatabaseZap size={16} />, label: 'Database Engineering' },
                { id: 'ml' as LabKey, icon: <BrainCircuit size={16} />, label: 'Machine Learning' },
                { id: 'n8n' as LabKey, icon: <Workflow size={16} />, label: 'Automation' },
                { id: 'outofthebox' as LabKey, icon: <Lightbulb size={16} />, label: 'Out of the Box' },
              ].map((item) => {
                const whiteKeyLabel = labKeyLabels[item.id]?.toLowerCase() || '';
                const isKeyPressed = activePianoKeys.has(whiteKeyLabel);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      void playPianoNote(labNotes[item.id])
                      if (item.id === activeLab) return
                      if (pianoMode) {
                        setIsLabTransitioning(false)
                        setActiveLab(item.id)
                        return
                      }
                      setIsLabTransitioning(true)
                      setTimeout(() => {
                        setActiveLab(item.id)
                        setIsLabTransitioning(false)
                      }, 250)
                    }}
                    className={`relative flex items-center gap-3 p-4 text-left border-b uppercase font-mono text-[10px] font-bold ${
                      pianoMode ? '' : 'transition-all'
                    } ${pianoMode && isDesktop ? 'lab-key lab-key--piano' : ''} ${
                      pianoMode && isDesktop && isKeyPressed ? 'lab-key--active' : ''
                    }`}
                    style={{
                      borderColor: 'var(--theme-border)',
                      backgroundColor: activeLab === item.id ? 'var(--theme-bg)' : 'transparent',
                      color: activeLab === item.id ? 'var(--theme-accent)' : 'var(--theme-text)',
                    }}
                    onMouseEnter={(event) => {
                      if (activeLab !== item.id) {
                        event.currentTarget.style.backgroundColor = 'var(--theme-surface-hover)'
                      }
                    }}
                    onMouseLeave={(event) => {
                      if (activeLab !== item.id) {
                        event.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <span className="lab-key-swap" aria-hidden="true">
                      <span className="lab-key-icon">{item.icon}</span>
                      <span className="lab-key-label">{isDesktop ? labKeyLabels[item.id] : ''}</span>
                    </span>
                    {item.label}
                    {item.id === 'outofthebox' && (
                      <span className="ml-auto opacity-50" style={{ color: 'var(--theme-text)' }}>
                        <EggFried size={12} />
                      </span>
                    )}
                  </button>
                )
              })}
              {pianoMode && isDesktop && (
                <div className="lab-piano-black-keys">
                  {blackKeyLabels.map((blackKey, tabIndex) => {
                    if (!blackKey) return null;
                    const blackKeyNote = {
                      '2': 'C#4',
                      '3': 'D#4',
                      '4': 'F#4',
                      '5': 'G#4',
                      '6': 'A#4',
                    }[blackKey];
                    return (
                      <div 
                        key={`black-${tabIndex}`} 
                        className="lab-black-key-divider" 
                        style={{ top: `${36+ tabIndex * 49}px` }}
                        onClick={() => blackKeyNote && playPianoNote(blackKeyNote)}
                      >
                        <span className={`lab-black-key ${activePianoKeys.has(blackKey) ? 'lab-black-key--active' : ''}`}>{blackKey}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {pianoMode && isDesktop && (
                <div className="lab-piano-controls">
                  <div className="lab-piano-row">
                    <span className="lab-piano-label">Octave</span>
                    <button
                      type="button"
                      className="lab-piano-btn"
                      onClick={() => setOctaveShift((prev) => Math.max(prev - 1, -2))}
                    >
                      -
                    </button>
                    <span className="lab-piano-value">{octaveShift >= 0 ? `+${octaveShift}` : octaveShift}</span>
                    <button
                      type="button"
                      className="lab-piano-btn"
                      onClick={() => setOctaveShift((prev) => Math.min(prev + 1, 2))}
                    >
                      +
                    </button>
                    <span className="lab-piano-separator">|</span>
                    <button
                      type="button"
                      className="lab-piano-btn"
                      onClick={() => setKeyShift((prev) => prev - 1)}
                    >
                      -
                    </button>
                    <span className="lab-piano-value">{keyNames[(keyShift % 12 + 12) % 12]}</span>
                    <button
                      type="button"
                      className="lab-piano-btn"
                      onClick={() => setKeyShift((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div
              className="col-span-12 md:col-span-9 p-6 md:p-10 overflow-y-auto flex flex-col"
              style={{ backgroundColor: 'var(--theme-surface)' }}
            >
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="p-2" style={{ backgroundColor: 'var(--theme-accent)', color: 'var(--theme-bg)' }}><Info size={16} /></span>
                  <h4
                    className={` text-xl md:text-2xl font-bold uppercase tracking-tighter ${
                      pianoMode ? '' : isLabTransitioning ? 'slide-out-text' : 'slide-in-text'
                    }`}
                    key={`title-${activeLab}`}
                  >
                    {expertiseData[activeLab].title}
                  </h4>
                </div>
                <p
                  className={`text-md md:text-lg leading-relaxed max-w-2xl mb-4 italic ${
                    pianoMode ? '' : isLabTransitioning ? 'slide-out-text slide-delay-1' : 'slide-in-text slide-delay-1'
                  }`}
                  key={`desc-${activeLab}`}
                  style={{ color: 'var(--theme-muted)' }}
                >
                  "{pianoMode ? 'Have fun!' : expertiseData[activeLab].description}"
                </p>
                <div className="flex gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-1 uppercase font-bold tracking-widest inline-block ${
                      pianoMode ? '' : isLabTransitioning ? 'slide-out-text slide-delay-2' : 'slide-in-text slide-delay-2'
                    }`}
                    key={`stack-${activeLab}`}
                    style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-muted)' }}
                  >
                    STACK: {expertiseData[activeLab].stack}
                  </span>
                </div>
                {activeLab === 'outofthebox' && isDesktop && (
                  <label
                    className="mt-6 inline-flex items-center gap-3 text-xs font-mono uppercase tracking-widest"
                    style={{ color: 'var(--theme-muted)' }}
                  >
                    <input
                      type="checkbox"
                      checked={pianoMode}
                      onChange={(event) => {
                        const enabled = event.target.checked
                        setPianoMode(enabled)
                        if (enabled) {
                          setIsLabTransitioning(false)
                        }
                      }}
                    />
                    I want to have fun
                  </label>
                )}
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
              <div className="p-3" style={{ backgroundColor: 'var(--theme-nav-active-bg)', color: 'var(--theme-accent)' }}>
                <FolderOpen size={24} />
              </div>
              <h3 className="text-4xl font-bold uppercase tracking-tight">Project Archive</h3>
            </div>
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--theme-muted)' }}>
              Portfolio Showcase | Full-Stack, AI, Game Dev &amp; Research Projects
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
                  className="px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all"
                  style={{
                    backgroundColor: activeProjectTag === tag.id ? 'var(--theme-nav-active-bg)' : 'var(--theme-bg)',
                    color: activeProjectTag === tag.id ? 'var(--theme-accent)' : 'var(--theme-muted)',
                    borderColor: activeProjectTag === tag.id ? 'var(--theme-nav-active-bg)' : 'var(--theme-border)',
                  }}
                  onMouseEnter={(event) => {
                    if (activeProjectTag !== tag.id) {
                      event.currentTarget.style.borderColor = 'var(--theme-accent)'
                      event.currentTarget.style.color = 'var(--theme-text)'
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (activeProjectTag !== tag.id) {
                      event.currentTarget.style.borderColor = 'var(--theme-border)'
                      event.currentTarget.style.color = 'var(--theme-muted)'
                    }
                  }}
                >
                  {tag.label} ({projectCounts[tag.id as keyof typeof projectCounts]})
                </button>
              ))
            }
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6">
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
              className="px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all"
              style={{
                backgroundColor: clampedProjectPage === 1 ? 'var(--theme-surface)' : 'var(--theme-bg)',
                color: clampedProjectPage === 1 ? 'var(--theme-muted)' : 'var(--theme-muted)',
                borderColor: 'var(--theme-border)',
                cursor: clampedProjectPage === 1 ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(event) => {
                if (clampedProjectPage !== 1) {
                  event.currentTarget.style.borderColor = 'var(--theme-accent)'
                  event.currentTarget.style.color = 'var(--theme-text)'
                }
              }}
              onMouseLeave={(event) => {
                if (clampedProjectPage !== 1) {
                  event.currentTarget.style.borderColor = 'var(--theme-border)'
                  event.currentTarget.style.color = 'var(--theme-muted)'
                }
              }}
            >
              Prev
            </button>
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--theme-muted)' }}>
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
              className="px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all"
              style={{
                backgroundColor: clampedProjectPage === totalProjectPages ? 'var(--theme-surface)' : 'var(--theme-bg)',
                color: clampedProjectPage === totalProjectPages ? 'var(--theme-muted)' : 'var(--theme-muted)',
                borderColor: 'var(--theme-border)',
                cursor: clampedProjectPage === totalProjectPages ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(event) => {
                if (clampedProjectPage !== totalProjectPages) {
                  event.currentTarget.style.borderColor = 'var(--theme-accent)'
                  event.currentTarget.style.color = 'var(--theme-text)'
                }
              }}
              onMouseLeave={(event) => {
                if (clampedProjectPage !== totalProjectPages) {
                  event.currentTarget.style.borderColor = 'var(--theme-border)'
                  event.currentTarget.style.color = 'var(--theme-muted)'
                }
              }}
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

      <footer
        className="py-12 border-t px-4 sm:px-6"
        style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)', color: 'var(--theme-muted)' }}
      >
        <div className="w-full flex justify-between items-center font-mono text-[10px] uppercase opacity-40">
          <span>© 2026 Made with ❤️ by Lauda Dhia Raka </span>
          <div className="flex gap-6">
            <a
              href={PROFILE_CONTEXT.contact.github}
              className="transition-colors"
              onMouseEnter={(event) => { event.currentTarget.style.color = 'var(--theme-text)' }}
              onMouseLeave={(event) => { event.currentTarget.style.color = 'var(--theme-muted)' }}
            >
              Github
            </a>
            <a
              href={`mailto:${PROFILE_CONTEXT.contact.email}`}
              className="transition-colors"
              onMouseEnter={(event) => { event.currentTarget.style.color = 'var(--theme-text)' }}
              onMouseLeave={(event) => { event.currentTarget.style.color = 'var(--theme-muted)' }}
            >
              Email
            </a>
            <a
              href={PROFILE_CONTEXT.contact.linkedin}
              className="transition-colors"
              onMouseEnter={(event) => { event.currentTarget.style.color = 'var(--theme-text)' }}
              onMouseLeave={(event) => { event.currentTarget.style.color = 'var(--theme-muted)' }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
