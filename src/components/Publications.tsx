import { BookOpen, Calendar, ExternalLink } from 'lucide-react'
import personalData from '../personal-data.json'

export const Publications = () => {
  return (
    <section id="publications" className="mb-24 scroll-snap-align-start transition-all duration-700 opacity-0 translate-y-8 [&.section-visible]:opacity-100 [&.section-visible]:translate-y-0">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 section-icon">
            <BookOpen size={24} />
          </div>
          <h3 className="text-4xl font-bold uppercase tracking-tight">Publications &amp; Education</h3>
        </div>
        <p className="section-muted font-mono text-xs uppercase tracking-widest">
          Academic Work &amp; Formal Education
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Publications Section */}
        <div className="flex flex-col">
          <h4 className="text-xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
            <div className="w-1 h-6 section-accent-line"></div>
            Publications
          </h4>
          <div className="flex-1">
            {personalData.publications.map((pub, index) => (
              <div
                key={index}
                className="section-card p-6 transition-all duration-300 group relative h-full flex flex-col"
              >
                {/* Type Badge */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={16} className="section-accent-text" />
                </div>

                {/* Year Badge */}
                <div className="inline-block px-2 py-1 section-accent-badge font-mono text-[9px] uppercase font-bold mb-3">
                  {pub.year}
                </div>

                {/* Title */}
                <h5 className="text-base font-bold uppercase tracking-tight mb-2 section-title leading-tight">
                  {pub.title}
                </h5>

                {/* Authors */}
                {pub.authors && (
                  <p className="text-xs section-muted mb-2 italic">
                    {pub.authors}
                  </p>
                )}

                {/* Type */}
                <p className="text-xs section-muted font-mono uppercase tracking-widest mb-2">
                  {pub.type}
                </p>

                {/* Venue */}
                <p className="text-xs section-muted mb-2">{pub.venue}</p>

                {/* Location & Date */}
                {(pub.location || pub.date) && (
                  <p className="text-xs section-muted mb-3 font-mono">
                    {pub.date && `${pub.date}`}
                    {pub.location && pub.date && ' • '}
                    {pub.location}
                  </p>
                )}

                {/* Description */}
                <p className="text-sm section-muted leading-relaxed border-t section-divider pt-3 mt-auto">
                  {pub.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="flex flex-col">
          <h4 className="text-xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
            <div className="w-1 h-6 section-accent-line"></div>
            Education
          </h4>
          <div className="flex-1">
            {personalData.education.map((edu, index) => (
              <div
                key={index}
                className="section-card p-6 transition-all duration-300 group h-full flex flex-col"
              >
                {/* Degree Badge */}
                <div className="inline-block px-3 py-1 section-badge font-mono text-[10px] uppercase font-bold mb-4">
                  {edu.degree}
                </div>

                {/* Institution */}
                <h5 className="text-xl font-bold uppercase tracking-tight mb-3 section-title">
                  {edu.institution}
                </h5>

                {/* Period & Location */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm section-muted">
                    <Calendar size={14} />
                    <span className="font-mono text-xs">{edu.period}</span>
                  </div>
                  <div className="text-sm section-muted font-mono text-xs">
                    {edu.location}
                  </div>
                </div>

                {/* GPA */}
                <div className="border-t section-divider pt-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-widest section-muted">
                      GPA
                    </span>
                    <span className="text-2xl font-bold section-accent-text">
                      {edu.gpa}
                    </span>
                  </div>
                  <div className="w-full" style={{ backgroundColor: 'var(--theme-border)', height: '0.5rem', overflow: 'hidden' }}>
                    <div
                      className="h-full transition-all duration-1000"
                      style={{
                        width: `${(parseFloat(edu.gpa) / 4.0) * 100}%`,
                        background: 'linear-gradient(to right, var(--theme-accent), var(--theme-accent-hover))'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Relevant Courses */}
                {edu.courses && (
                  <div className="border-t section-divider pt-4 mt-auto">
                    <p className="text-xs font-mono uppercase tracking-widest section-muted mb-3">
                      Relevant Coursework
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.courses.map((course, courseIndex) => (
                        <span
                          key={courseIndex}
                          className="px-2 py-1 text-[9px] font-mono section-chip"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
