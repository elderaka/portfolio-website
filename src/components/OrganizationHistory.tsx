import { Users, Calendar } from 'lucide-react'
import personalData from '../personal-data.json'

export const OrganizationHistory = () => {
  return (
    <section id="organizations" className="mb-24 scroll-snap-align-start transition-all duration-700 opacity-0 translate-y-8 [&.section-visible]:opacity-100 [&.section-visible]:translate-y-0">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 section-icon">
            <Users size={24} />
          </div>
          <h3 className="text-4xl sm:text-4xl md:text-4xl font-bold uppercase tracking-tight">Organization History</h3>
        </div>
        <p className="section-muted font-mono text-[9px] sm:text-xs uppercase tracking-widest">
          Leadership &amp; Community Involvement | Teaching &amp; Mentorship
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {personalData.organizational_experience.map((org, index) => (
          <div
            key={index}
            className="section-card transition-all duration-300 group relative overflow-hidden"
          >
            {/* Accent Line */}
            <div className="absolute top-0 left-0 w-1 h-0 section-accent-line group-hover:h-full transition-all duration-500"></div>

            <div className="p-4 pl-6 sm:p-6 sm:pl-8">
              {/* Role */}
              <div className="flex items-start gap-2 mb-2 sm:mb-3">
                <div className="w-2 h-2 section-accent-line mt-1.5 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h4 className="text-lg sm:text-xl font-bold uppercase tracking-tight section-title">
                  {org.role}
                </h4>
              </div>

              {/* Organization */}
              <p className="text-sm sm:text-base font-semibold mb-2 sm:mb-3" style={{ color: 'var(--theme-text)' }}>{org.organization}</p>

              {/* Period */}
              <div className="flex items-center gap-2 text-xs sm:text-sm section-muted mb-3 sm:mb-4">
                <Calendar size={12} className="sm:size-[14px]" />
                <span className="font-mono text-[10px] sm:text-xs">{org.period}</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm section-muted leading-relaxed border-t section-divider pt-3 sm:pt-4">
                {org.description}
              </p>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 right-0 w-0 h-1 section-accent-gradient group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </section>
  )
}
