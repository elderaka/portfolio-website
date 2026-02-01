import { useState } from 'react'
import { Send, RefreshCw } from 'lucide-react'

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
  },
}

export const AILab = () => {
  const [query, setQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)

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
      setIsAiLoading(false)
    }, 500)
  }

  return (
    <div className="h-full flex flex-col min-h-[420px]">
      <div className="flex-1 border border-stone-300 bg-[#2C2C2C] p-6 overflow-y-auto space-y-4 font-mono text-sm text-amber-500">
        {aiResponse ? (
          <div className="border-l-2 border-amber-600 pl-4 py-2 animate-in fade-in slide-in-from-left-2">
            {aiResponse}
          </div>
        ) : (
          <div className="text-stone-600 italic">
            Ask about experience, skills, or contact details.
          </div>
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
  )
}
