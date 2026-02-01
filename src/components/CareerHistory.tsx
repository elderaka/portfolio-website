import { Briefcase, MapPin, Calendar } from 'lucide-react'
import personalData from '../personal-data.json'

export const CareerHistory = () => {
  return (
    <section id="career" className="mb-24 scroll-snap-align-start transition-all duration-700 opacity-0 translate-y-8 [&.section-visible]:opacity-100 [&.section-visible]:translate-y-0">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-stone-900 text-amber-500">
            <Briefcase size={24} />
          </div>
          <h3 className="text-4xl sm:text-4xl md:text-4xl font-bold uppercase tracking-tight">Career History</h3>
        </div>
        <p className="text-stone-500 font-mono text-[9px] sm:text-xs uppercase tracking-widest">
          Professional Experience | Full-Stack Development &amp; System Architecture
        </p>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-stone-300 ml-4 sm:ml-6">
        {personalData.professional_experience.map((job, index) => (
          <div
            key={index}
            className="mb-8 sm:mb-12 ml-6 sm:ml-8 relative group"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[33px] sm:-left-[41px] top-0 w-3 h-3 sm:w-4 sm:h-4 bg-amber-500 border-4 border-stone-100 rounded-full group-hover:scale-125 group-hover:bg-amber-600 transition-all duration-300"></div>
            
            {/* Timeline connector line (to content) */}
            <div className="absolute -left-[25px] sm:-left-[33px] top-1.5 sm:top-2 w-6 sm:w-8 h-0.5 bg-stone-300 group-hover:bg-amber-500 transition-colors duration-300"></div>

            {/* Content Card */}
            <div className="border border-stone-300 bg-[#EBE7DF]/40 hover:bg-white hover:border-amber-500 transition-all duration-300 p-4 sm:p-6">
              {/* Period Badge */}
              <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-stone-900 text-amber-500 font-mono text-[9px] sm:text-[10px] uppercase font-bold mb-3 sm:mb-4">
                <Calendar size={10} />
                {job.period}
              </div>

              {/* Role & Company */}
              <div className="mb-3 sm:mb-4">
                <h4 className="text-lg sm:text-xl font-bold uppercase tracking-tight mb-2 group-hover:text-amber-700 transition-colors">
                  {job.role}
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-stone-600">
                  <p className="text-sm sm:text-base font-semibold">{job.company}</p>
                  <span className="hidden sm:inline text-stone-400">•</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={11} className="sm:size-3" />
                    <span className="text-xs sm:text-sm font-mono">{job.location}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3 sm:mb-4">
                {job.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 pt-2 sm:pt-3 border-t border-stone-200">
                <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-stone-400">
                  STACK:
                </span>
                {job.stack.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-0.5 sm:py-1 bg-stone-200 border border-stone-300 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-700 group-hover:bg-amber-50 group-hover:border-amber-300 transition-colors"
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
