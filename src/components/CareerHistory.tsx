import { Briefcase, MapPin, Calendar } from 'lucide-react'
import personalData from '../personal-data.json'

export const CareerHistory = () => {
  return (
    <section id="career" className="mb-24 scroll-snap-align-start">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-stone-900 text-amber-500">
            <Briefcase size={24} />
          </div>
          <h3 className="text-4xl font-bold uppercase tracking-tight">Career History</h3>
        </div>
        <p className="text-stone-500 font-mono text-xs uppercase tracking-widest">
          Professional Experience // Full-Stack Development &amp; System Architecture
        </p>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-stone-300 ml-6">
        {personalData.professional_experience.map((job, index) => (
          <div
            key={index}
            className="mb-12 ml-8 relative group"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[41px] top-0 w-4 h-4 bg-amber-500 border-4 border-stone-100 rounded-full group-hover:scale-125 group-hover:bg-amber-600 transition-all duration-300"></div>
            
            {/* Timeline connector line (to content) */}
            <div className="absolute -left-[33px] top-2 w-8 h-0.5 bg-stone-300 group-hover:bg-amber-500 transition-colors duration-300"></div>

            {/* Content Card */}
            <div className="border border-stone-300 bg-[#EBE7DF]/40 hover:bg-white hover:border-amber-500 transition-all duration-300 p-6">
              {/* Period Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-900 text-amber-500 font-mono text-[10px] uppercase font-bold mb-4">
                <Calendar size={12} />
                {job.period}
              </div>

              {/* Role & Company */}
              <div className="mb-4">
                <h4 className="text-xl font-bold uppercase tracking-tight mb-2 group-hover:text-amber-700 transition-colors">
                  {job.role}
                </h4>
                <div className="flex items-center gap-2 text-stone-600">
                  <p className="text-base font-semibold">{job.company}</p>
                  <span className="text-stone-400">•</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span className="text-sm font-mono">{job.location}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                {job.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-200">
                <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400">
                  STACK:
                </span>
                {job.stack.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 bg-stone-200 border border-stone-300 font-mono text-[9px] uppercase tracking-wider text-stone-700 group-hover:bg-amber-50 group-hover:border-amber-300 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
