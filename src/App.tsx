import { useEffect, useMemo, useRef, useState } from 'react'
import initSqlJs from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import * as tf from '@tensorflow/tfjs'
import {
  Cpu,
  Gamepad2,
  Code2,
  Database,
  Layers,
  ExternalLink,
  Mail,
  Github,
  Monitor,
  RefreshCw,
  ShoppingCart,
  BrainCircuit,
  Bot,
  Workflow,
  Sparkles,
  Send,
  DatabaseZap,
  Info,
} from 'lucide-react'

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
    location: 'Indonesia',
  },
}

const ProjectCard = ({ project }: { project: { title: string; category: string; tech: string; description: string } }) => (
  <div className="group border border-stone-300 p-6 bg-[#EBE7DF]/40 hover:border-[#FFB000] transition-all duration-300 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
      <ExternalLink size={16} />
    </div>
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">{project.category}</span>
      <span className="text-[10px] font-mono text-amber-600">{project.tech}</span>
    </div>
    <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter group-hover:text-amber-700">{project.title}</h3>
    <p className="text-sm text-stone-600 leading-relaxed mb-4">{project.description}</p>
  </div>
)

const CanvasGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let pos = { x: 50, y: 50 }
    let animationId = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = '#222'
      ctx.lineWidth = 0.1
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }
      ctx.fillStyle = '#FFB000'
      ctx.fillRect(pos.x, pos.y, 20, 20)
      ctx.fillStyle = '#000'
      ctx.font = '8px monospace'
      ctx.fillText('LAUDA_BOT', pos.x - 5, pos.y - 5)
      animationId = requestAnimationFrame(draw)
    }

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      pos = { x: e.clientX - rect.left - 10, y: e.clientY - rect.top - 10 }
    }

    canvas.addEventListener('mousemove', handleMove)
    animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
      canvas.removeEventListener('mousemove', handleMove)
    }
  }, [])

  return <canvas ref={canvasRef} width={600} height={350} className="bg-stone-900 w-full h-full cursor-none border border-black" />
}

function App() {
  const [booted, setBooted] = useState(false)
  const [activeLab, setActiveLab] = useState<LabKey>('fullstack')
  const [log, setLog] = useState<string[]>(['Kernel initialized.', 'Awaiting operator input...'])

  // Fullstack State
  const [webCode, setWebCode] = useState(
    '<div class="p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono">\n  <h1 class="text-2xl font-bold">SYSTEM_READY</h1>\n  <p class="mt-2">Service layer online. Editing hot-swaps UI.</p>\n</div>'
  )
  const [isFetching, setIsFetching] = useState(false)
  const [apiProbe, setApiProbe] = useState<{ status: number; payload: { users: number; runtime: string; latency: string } } | null>(null)

  // MAS State
  const [agents, setAgents] = useState([
    { id: 1, x: 20, y: 50, task: 'Browsing', gold: 100 },
    { id: 2, x: 80, y: 30, task: 'Searching', gold: 50 },
  ])

  // Local AI Q&A State
  const [query, setQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Automation Sim State
  const [automationActive, setAutomationActive] = useState(false)

  // SQLite Lab State
  const dbRef = useRef<any>(null)
  const [sqlReady, setSqlReady] = useState(false)
  const [sqlQuery, setSqlQuery] = useState('SELECT name, stack, year FROM projects;')
  const [sqlResult, setSqlResult] = useState<string>('')
  const [sqlError, setSqlError] = useState<string>('')

  // ML Lab State
  const modelRef = useRef<tf.LayersModel | null>(null)
  const [mlInputA, setMlInputA] = useState(6)
  const [mlInputB, setMlInputB] = useState(8)
  const [mlOutput, setMlOutput] = useState<string>('')
  const [mlLoading, setMlLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (activeLab !== 'mas') return
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          x: Math.max(10, Math.min(90, a.x + (Math.random() - 0.5) * 5)),
          y: Math.max(10, Math.min(90, a.y + (Math.random() - 0.5) * 5)),
          task: Math.random() > 0.8 ? ['Buying', 'Refunding', 'Browsing'][Math.floor(Math.random() * 3)] : a.task,
        }))
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [activeLab])

  useEffect(() => {
    let mounted = true
    initSqlJs({ locateFile: () => wasmUrl })
      .then((SQL) => {
        if (!mounted) return
        const db = new SQL.Database()
        db.run('CREATE TABLE projects (name TEXT, stack TEXT, year INTEGER);')
        db.run("INSERT INTO projects VALUES ('LMS EFK', 'Vue / Node / Gemini', 2025);")
        db.run("INSERT INTO projects VALUES ('UK Cobenefit', 'MapLibre / PMTiles', 2024);")
        db.run("INSERT INTO projects VALUES ('MASONRY', 'Unity / C#', 2024);")
        db.run("INSERT INTO projects VALUES ('HireIT AI', 'Watsonx / Python', 2025);")
        dbRef.current = db
        setSqlReady(true)
      })
      .catch(() => {
        setSqlError('SQLite engine failed to load.')
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const model = tf.sequential()
    model.add(tf.layers.dense({ inputShape: [2], units: 1, useBias: true }))
    model.setWeights([
      tf.tensor2d([
        [0.7],
        [0.3],
      ]),
      tf.tensor1d([0.2]),
    ])
    modelRef.current = model
  }, [])

  const expertiseData = useMemo<Record<LabKey, { title: string; description: string; stack: string }>>(
    () => ({
      fullstack: {
        title: 'Fullstack Systems',
        description:
          'I build end-to-end architectures with a focus on stability and clarity. My stack leans on Node.js and Golang with frontends in React/Vue, backed by Postgres for data that has to last.',
        stack: 'Node.js, Golang, React, Vue, PostgreSQL',
      },
      gamedev: {
        title: 'Game Engineering',
        description:
          'My game work is about precise input, readable patterns, and the feeling of flow. I ship small prototypes quickly, then tune the mechanics until they feel sharp and fair.',
        stack: 'Unity (C#), Godot, GameMaker',
      },
      mas: {
        title: 'Multi-Agent Systems',
        description:
          'I enjoy building ecosystems where agents make local decisions and global behavior emerges. Think marketplaces, swarms, and distributed problem-solving.',
        stack: 'C#, Agentic Logic, IBM watsonx',
      },
      ai: {
        title: 'Applied AI (RAG + LLM Ops)',
        description:
          'I design AI systems that can actually be shipped: strict input handling, realistic performance, and outputs users can trust. The goal is always usable intelligence, not just a demo.',
        stack: 'Gemini, LangChain, Python',
      },
      n8n: {
        title: 'System Automation',
        description:
          'Automation is about wiring tools together and removing the boring parts. I build pipelines that move data cleanly from source to insight.',
        stack: 'n8n, Webhooks, API Integration',
      },
      sqlite: {
        title: 'SQLite Ops',
        description:
          'A portable database for quick prototypes, offline tools, and embedded demos. This lab runs SQLite in the browser using WebAssembly.',
        stack: 'SQLite, SQL.js, WASM',
      },
      ml: {
        title: 'Machine Learning',
        description:
          'I use ML when the signal is strong and the metric is clear. This demo uses a lightweight model to estimate a score from two inputs.',
        stack: 'TensorFlow.js, Feature Signals',
      },
    }),
    []
  )

  const projects = [
    { title: 'LMS EFK', category: 'Agentic AI', tech: 'Vue.js / Node.js', description: 'Autonomous course creation and grading engine.' },
    { title: 'UK Cobenefit', category: 'Data Vis', tech: 'MapLibre / PMTiles', description: 'Hierarchical geographic visualization for net-zero advocacy.' },
    { title: 'MASONRY', category: 'Game Sim', tech: 'Unity / C#', description: 'Collective NPC behavior modeling in 3D ecosystems.' },
    { title: 'Nirwana Pancarona', category: 'Indie Game', tech: 'GameMaker', description: 'Bullet hell mechanics with tuned boss state machines.' },
    { title: 'HireIT AI', category: 'Multi-Agent', tech: 'Watsonx', description: 'Recruitment automation pipeline with multi-agent orchestration.' },
    { title: 'Personality CLF', category: 'ML', tech: 'Python / Sklearn', description: 'Text analysis model for personality prediction.' },
  ]

  const handleApiProbe = async () => {
    setIsFetching(true)
    setLog((prev) => [...prev, 'Pinging service layer...'])
    setTimeout(() => {
      setApiProbe({
        status: 200,
        payload: { users: 124, runtime: 'Node 20', latency: '18ms' },
      })
      setIsFetching(false)
      setLog((prev) => [...prev, 'Service responded with healthy payload.'])
    }, 1200)
  }

  const answerFromContext = (q: string) => {
    const lower = q.toLowerCase()
    if (lower.includes('email') || lower.includes('contact')) {
      return `You can reach me at ${PROFILE_CONTEXT.contact.email}.`
    }
    if (lower.includes('experience') || lower.includes('work')) {
      return `Recent experience includes ${PROFILE_CONTEXT.experience.join(', ')}.`
    }
    if (lower.includes('skills') || lower.includes('stack')) {
      return `Specialties: ${PROFILE_CONTEXT.specialties.join(', ')}.`
    }
    if (lower.includes('project')) {
      return `Projects include ${PROFILE_CONTEXT.projects.join(', ')}.`
    }
    return 'Ask me about experience, skills, projects, or contact details.'
  }

  const handleAiAsk = async () => {
    if (!query) return
    setIsAiLoading(true)
    setAiResponse('')
    setTimeout(() => {
      setAiResponse(answerFromContext(query))
      setLog((prev) => [...prev, 'Local intelligence response delivered.'])
      setIsAiLoading(false)
    }, 500)
  }

  const runSql = () => {
    if (!dbRef.current) return
    try {
      setSqlError('')
      const results = dbRef.current.exec(sqlQuery)
      if (!results.length) {
        setSqlResult('Query executed. No rows returned.')
        return
      }
      const [table] = results
      const rows = table.values.map((row: any[]) =>
        Object.fromEntries(table.columns.map((col: string, idx: number) => [col, row[idx]]))
      )
      setSqlResult(JSON.stringify(rows, null, 2))
    } catch (err) {
      setSqlError('Query failed. Check your SQL syntax.')
    }
  }

  const runMlInference = async () => {
    if (!modelRef.current) return
    setMlLoading(true)
    const input = tf.tensor2d([[mlInputA, mlInputB]])
    const output = modelRef.current.predict(input) as tf.Tensor
    const result = await output.data()
    setMlOutput(`Signal score: ${result[0].toFixed(2)} (higher = stronger fit)`) 
    tf.dispose([input, output])
    setMlLoading(false)
  }

  if (!booted) {
    return (
      <div className="h-screen w-full bg-[#2C2C2C] flex items-center justify-center font-mono text-amber-500">
        <p className="animate-pulse tracking-widest uppercase">Booting_Lauda_Core_4.0</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#2C2C2C] font-sans selection:bg-amber-400">
      <nav className="border-b border-stone-300 p-6 flex justify-between items-center bg-[#F4F1EA]/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold">LR</div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest">Lauda Dhia Raka</h1>
            <p className="text-[10px] font-mono opacity-50 underline decoration-amber-500">Informatics Undergraduate</p>
          </div>
        </div>
        <div className="flex gap-6 font-mono text-[10px] uppercase font-bold">
          <a href="#lab" className="hover:text-amber-600">Laboratory</a>
          <a href="#projects" className="hover:text-amber-600">Archive</a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="grid grid-cols-12 gap-12 mb-20 items-center">
          <div className="col-span-12 lg:col-span-7">
            <div className="inline-block px-2 py-1 bg-stone-200 font-mono text-[10px] uppercase mb-6">System Architect // Informatics Specialist</div>
            <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-8">
              System <br /><span className="text-stone-400">Architecture</span> <br />&amp; Intelligence
            </h2>
            <p className="text-lg md:text-xl text-stone-600 max-w-xl leading-relaxed mb-8">
              I design full-stack systems where AI, data, and gameplay logic meet. My work is practical, fast, and tuned for real users.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#2C2C2C] text-[#F4F1EA] px-8 py-4 font-bold uppercase tracking-widest hover:bg-amber-600 transition-all">Download CV</button>
              <div className="flex items-center gap-4 px-6 border border-stone-300">
                <a href={PROFILE_CONTEXT.contact.github} aria-label="Github" className="hover:text-amber-600">
                  <Github size={20} />
                </a>
                <a href={`mailto:${PROFILE_CONTEXT.contact.email}`} aria-label="Email" className="hover:text-amber-600">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="border border-stone-300 p-6 bg-white/40 aspect-square flex flex-col justify-between">
              <Database size={32} className="text-stone-400" /><span className="font-bold text-lg uppercase leading-none">Backend Ops</span>
            </div>
            <div className="border border-stone-300 p-6 bg-white/40 aspect-square flex flex-col justify-between">
              <Layers size={32} className="text-stone-400" /><span className="font-bold text-lg uppercase leading-none">Front Systems</span>
            </div>
            <div className="border border-stone-300 p-6 bg-white/40 aspect-square flex flex-col justify-between">
              <Gamepad2 size={32} className="text-stone-400" /><span className="font-bold text-lg uppercase leading-none">Game Engines</span>
            </div>
            <div className="border border-stone-300 p-6 bg-[#2C2C2C] text-amber-500 aspect-square flex flex-col justify-between">
              <Cpu size={32} /><span className="font-bold text-lg uppercase leading-none text-[#F4F1EA]">Agentic AI</span>
            </div>
          </div>
        </section>

        <section id="lab" className="mb-24">
          <div className="mb-8">
            <h3 className="text-4xl font-bold uppercase tracking-tight flex items-center gap-4">The Laboratory</h3>
          </div>

          <div className="grid grid-cols-12 border border-stone-300 bg-white min-h-[720px] shadow-2xl overflow-hidden">
            <div className="col-span-12 md:col-span-3 border-r border-stone-300 bg-[#EBE7DF]/50 flex flex-col">
              {[
                { id: 'fullstack', icon: <Code2 size={16} />, label: 'Fullstack Dev' },
                { id: 'gamedev', icon: <Gamepad2 size={16} />, label: 'Game Design' },
                { id: 'mas', icon: <Cpu size={16} />, label: 'Multi-Agent' },
                { id: 'ai', icon: <Sparkles size={16} />, label: 'Applied AI' },
                { id: 'sqlite', icon: <DatabaseZap size={16} />, label: 'SQLite Lab' },
                { id: 'ml', icon: <BrainCircuit size={16} />, label: 'Machine Learning' },
                { id: 'n8n', icon: <Workflow size={16} />, label: 'Automation' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveLab(item.id)
                    setLog((prev) => [...prev, `Context shift: ${item.label}`])
                  }}
                  className={`flex items-center gap-3 p-6 text-left border-b border-stone-300 transition-all uppercase font-mono text-xs font-bold ${
                    activeLab === item.id ? 'bg-white text-amber-600' : 'hover:bg-white/50'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
              <div className="mt-auto p-4 bg-stone-900 text-amber-500 font-mono text-[9px] h-32 overflow-y-auto">
                {log.map((l, i) => (
                  <div key={i} className="mb-1">{`> ${l}`}</div>
                ))}
              </div>
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
                {activeLab === 'fullstack' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[420px]">
                    <div className="flex flex-col gap-4">
                      <div className="flex-1 border border-stone-300 p-4 bg-white flex flex-col">
                        <label className="font-mono text-[10px] uppercase opacity-50 block mb-2">Live UI Editor</label>
                        <textarea
                          className="flex-1 font-mono text-xs p-2 bg-stone-100 outline-none resize-none border border-stone-200"
                          value={webCode}
                          onChange={(e) => setWebCode(e.target.value)}
                        />
                        <button
                          onClick={handleApiProbe}
                          className="mt-4 bg-black text-white p-3 font-mono text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-amber-600"
                        >
                          {isFetching ? <RefreshCw className="animate-spin" size={14} /> : <DatabaseZap size={14} />} Probe Service
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex-1 border-2 border-dashed border-stone-300 p-6 flex items-center justify-center bg-white shadow-inner" dangerouslySetInnerHTML={{ __html: webCode }} />
                      {apiProbe && (
                        <div className="h-32 border border-stone-300 bg-stone-900 p-4 font-mono text-[10px] text-green-500 overflow-auto">
                          <pre>{JSON.stringify(apiProbe, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeLab === 'gamedev' && (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 border-4 border-black relative min-h-[420px]"><CanvasGame /></div>
                    <p className="mt-4 font-mono text-[10px] text-stone-400 uppercase tracking-widest">
                      Prototype_01: follow the cursor to stress-test a simple controller.
                    </p>
                  </div>
                )}

                {activeLab === 'mas' && (
                  <div className="h-full bg-white border border-stone-300 p-6 flex flex-col min-h-[420px]">
                    <div className="flex-1 relative bg-stone-100 border border-stone-200 rounded-lg overflow-hidden">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-30">
                        <ShoppingCart size={40} />
                        <span className="text-[10px] font-bold uppercase">Store_Node</span>
                      </div>
                      {agents.map((a) => (
                        <div
                          key={a.id}
                          className="absolute transition-all duration-1000 flex flex-col items-center"
                          style={{ left: `${a.x}%`, top: `${a.y}%` }}
                        >
                          <div className="w-5 h-5 bg-amber-500 rounded-full border-2 border-black flex items-center justify-center">
                            <Bot size={10} />
                          </div>
                          <span className="text-[8px] font-mono mt-1 bg-black text-white px-1 uppercase">{a.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeLab === 'ai' && (
                  <div className="h-full flex flex-col min-h-[420px]">
                    <div className="flex-1 border border-stone-300 bg-[#2C2C2C] p-6 overflow-y-auto space-y-4 font-mono text-sm text-amber-500">
                      {aiResponse ? (
                        <div className="border-l-2 border-amber-600 pl-4 py-2 animate-in fade-in slide-in-from-left-2">{aiResponse}</div>
                      ) : (
                        <div className="text-stone-600 italic">Ask about experience, skills, or contact details.</div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input
                        className="flex-1 border-2 border-black p-4 text-xs font-mono outline-none"
                        placeholder="Ask about experience, skills, or contact..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
                      />
                      <button
                        onClick={handleAiAsk}
                        disabled={isAiLoading}
                        className="bg-black text-white px-8 font-bold uppercase text-[10px] hover:bg-amber-600 transition-all"
                      >
                        {isAiLoading ? <RefreshCw className="animate-spin" /> : <Send />}
                      </button>
                    </div>
                  </div>
                )}

                {activeLab === 'sqlite' && (
                  <div className="h-full bg-white border border-stone-300 p-6 flex flex-col min-h-[420px]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">SQLite console</span>
                      <span className={`text-[10px] font-mono ${sqlReady ? 'text-green-600' : 'text-amber-600'}`}>
                        {sqlReady ? 'ENGINE READY' : 'LOADING ENGINE'}
                      </span>
                    </div>
                    <textarea
                      className="flex-1 font-mono text-xs p-3 bg-stone-100 outline-none resize-none border border-stone-200"
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                    />
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={runSql}
                        disabled={!sqlReady}
                        className="bg-black text-white px-6 py-3 font-mono text-[10px] uppercase hover:bg-amber-600"
                      >
                        Run Query
                      </button>
                      {sqlError && <span className="text-[10px] font-mono text-red-600">{sqlError}</span>}
                    </div>
                    <div className="mt-4 h-40 border border-stone-300 bg-stone-900 p-4 font-mono text-[10px] text-green-500 overflow-auto">
                      {sqlResult ? <pre>{sqlResult}</pre> : 'Result output will appear here.'}
                    </div>
                  </div>
                )}

                {activeLab === 'ml' && (
                  <div className="h-full bg-stone-900 text-amber-500 p-8 font-mono flex flex-col border-t-8 border-amber-600 min-h-[420px]">
                    <div className="flex-1 bg-black/40 border border-stone-800 p-6 flex flex-col items-center justify-center gap-6">
                      <div className="text-center">
                        <Monitor size={64} className="mx-auto mb-4 opacity-20" />
                        <p className="text-xs text-stone-500">Signal model ready. Input two values to estimate fit.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                        <input
                          type="number"
                          className="border border-amber-600/50 bg-black text-amber-200 px-3 py-2 text-xs"
                          value={mlInputA}
                          onChange={(e) => setMlInputA(Number(e.target.value))}
                        />
                        <input
                          type="number"
                          className="border border-amber-600/50 bg-black text-amber-200 px-3 py-2 text-xs"
                          value={mlInputB}
                          onChange={(e) => setMlInputB(Number(e.target.value))}
                        />
                      </div>
                      <button
                        onClick={runMlInference}
                        disabled={mlLoading}
                        className="px-8 py-3 border border-amber-600/50 hover:bg-amber-600 hover:text-black transition-all font-bold uppercase text-[10px]"
                      >
                        {mlLoading ? 'Running...' : 'Run Inference'}
                      </button>
                      {mlOutput && <div className="text-xs text-amber-200">{mlOutput}</div>}
                    </div>
                  </div>
                )}

                {activeLab === 'n8n' && (
                  <div className="h-full bg-white border border-stone-300 p-8 flex flex-col items-center justify-center text-center min-h-[420px]">
                    <div
                      className={`w-32 h-32 rounded-full border-4 ${
                        automationActive ? 'border-green-500 bg-green-50 animate-pulse' : 'border-stone-300 bg-stone-50'
                      } flex items-center justify-center mb-8 transition-all`}
                    >
                      <Workflow size={48} className={automationActive ? 'text-green-600' : 'text-stone-400'} />
                    </div>
                    <button
                      onClick={() => setAutomationActive(!automationActive)}
                      className={`px-12 py-4 font-bold uppercase tracking-widest ${
                        automationActive ? 'bg-red-600 text-white' : 'bg-black text-white'
                      }`}
                    >
                      {automationActive ? 'Kill Workflow' : 'Run Logic Pipeline'}
                    </button>
                    {automationActive && (
                      <div className="mt-8 flex gap-4">
                        {['Webhook', 'Extract', 'Save', 'Notify'].map((s, i) => (
                          <div
                            key={s}
                            className="p-2 border border-green-200 bg-green-50 text-[10px] font-mono animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="mb-24">
          <div className="mb-12">
            <h3 className="text-4xl font-bold uppercase tracking-tight">Project Archive</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
      </main>

      <footer className="py-12 bg-stone-200 border-t border-stone-300 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-mono text-[10px] uppercase opacity-40">
          <span>© 2026 LAUDA_DHIA_RAKA // CORE_4.0</span>
          <div className="flex gap-6">
            <a href={PROFILE_CONTEXT.contact.github} className="hover:text-black">Github</a>
            <a href={`mailto:${PROFILE_CONTEXT.contact.email}`} className="hover:text-black">Email</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
