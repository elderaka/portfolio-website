import { Briefcase, MapPin, Calendar } from 'lucide-react'
import personalData from '../personal-data.json'

export const CareerHistory = () => {
  return (
    <section id="career" className="mb-24 scroll-snap-align-start transition-all duration-700 opacity-0 translate-y-8 [&.section-visible]:opacity-100 [&.section-visible]:translate-y-0">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 section-icon">
            <Briefcase size={24} />
          </div>
          <h3 className="text-4xl sm:text-4xl md:text-4xl font-bold uppercase tracking-tight">Career History</h3>
        </div>
        <p className="section-muted font-mono text-[9px] sm:text-xs uppercase tracking-widest">
          Professional Experience | Full-Stack Development &amp; System Architecture
        </p>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 section-divider ml-4 sm:ml-6">
        {personalData.professional_experience.map((job, index) => (
          <div
            key={index}
            className="mb-8 sm:mb-12 ml-6 sm:ml-8 relative group"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[33px] sm:-left-[41px] top-0 w-3 h-3 sm:w-4 sm:h-4 border-4 rounded-full section-accent-dot group-hover:scale-125 transition-all duration-300"></div>
            
            {/* Timeline connector line (to content) */}
            <div className="absolute -left-[25px] sm:-left-[33px] top-1.5 sm:top-2 w-6 sm:w-8 h-0.5 section-line group-hover:bg-[var(--theme-accent)] transition-colors duration-300"></div>

            {/* Content Card */}
            <div className="section-card p-4 sm:p-6">
              {/* Period Badge */}
              <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 section-badge font-mono text-[9px] sm:text-[10px] uppercase font-bold mb-3 sm:mb-4">
                <Calendar size={10} />
                {job.period}
              </div>

              {/* Role & Company */}
              <div className="mb-3 sm:mb-4">
                <h4 className="text-lg sm:text-xl font-bold uppercase tracking-tight mb-2 section-title">
                  {job.role}
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 section-muted">
                  <p className="text-sm sm:text-base font-semibold">{job.company}</p>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={11} className="sm:size-3" />
                    <span className="text-xs sm:text-sm font-mono">{job.location}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm section-muted leading-relaxed mb-3 sm:mb-4">
                {job.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 pt-2 sm:pt-3 border-t section-divider">
                <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest section-muted">
                  STACK:
                </span>
                {job.stack.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-0.5 sm:py-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider section-chip"
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
