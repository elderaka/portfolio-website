import { BookOpen, Calendar, ExternalLink } from 'lucide-react'
import personalData from '../personal-data.json'

export const Publications = () => {
  return (
    <section id="publications" className="mb-24 scroll-snap-align-start transition-all duration-700 opacity-0 translate-y-8 [&.section-visible]:opacity-100 [&.section-visible]:translate-y-0">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-stone-900 text-amber-500">
            <BookOpen size={24} />
          </div>
          <h3 className="text-4xl font-bold uppercase tracking-tight">Publications &amp; Education</h3>
        </div>
        <p className="text-stone-500 font-mono text-xs uppercase tracking-widest">
          Academic Work &amp; Formal Education
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Publications Section */}
        <div className="flex flex-col">
          <h4 className="text-xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-amber-500"></div>
            Publications
          </h4>
          <div className="flex-1">
            {personalData.publications.map((pub, index) => (
              <div
                key={index}
                className="border border-stone-300 bg-white p-6 hover:border-amber-500 transition-all duration-300 group relative h-full flex flex-col"
              >
                {/* Type Badge */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={16} className="text-amber-500" />
                </div>

                {/* Year Badge */}
                <div className="inline-block px-2 py-1 bg-amber-500 text-black font-mono text-[9px] uppercase font-bold mb-3">
                  {pub.year}
                </div>

                {/* Title */}
                <h5 className="text-base font-bold uppercase tracking-tight mb-2 group-hover:text-amber-700 transition-colors leading-tight">
                  {pub.title}
                </h5>

                {/* Authors */}
                {pub.authors && (
                  <p className="text-xs text-stone-500 mb-2 italic">
                    {pub.authors}
                  </p>
                )}

                {/* Type */}
                <p className="text-xs text-stone-500 font-mono uppercase tracking-widest mb-2">
                  {pub.type}
                </p>

                {/* Venue */}
                <p className="text-xs text-stone-600 mb-2">{pub.venue}</p>

                {/* Location & Date */}
                {(pub.location || pub.date) && (
                  <p className="text-xs text-stone-500 mb-3 font-mono">
                    {pub.date && `${pub.date}`}
                    {pub.location && pub.date && ' • '}
                    {pub.location}
                  </p>
                )}

                {/* Description */}
                <p className="text-sm text-stone-600 leading-relaxed border-t border-stone-200 pt-3 mt-auto">
                  {pub.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="flex flex-col">
          <h4 className="text-xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-amber-500"></div>
            Education
          </h4>
          <div className="flex-1">
            {personalData.education.map((edu, index) => (
              <div
                key={index}
                className="border border-stone-300 bg-white p-6 hover:border-amber-500 transition-all duration-300 group h-full flex flex-col"
              >
                {/* Degree Badge */}
                <div className="inline-block px-3 py-1 bg-stone-900 text-amber-500 font-mono text-[10px] uppercase font-bold mb-4">
                  {edu.degree}
                </div>

                {/* Institution */}
                <h5 className="text-xl font-bold uppercase tracking-tight mb-3 group-hover:text-amber-700 transition-colors">
                  {edu.institution}
                </h5>

                {/* Period & Location */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Calendar size={14} />
                    <span className="font-mono text-xs">{edu.period}</span>
                  </div>
                  <div className="text-sm text-stone-600 font-mono text-xs">
                    {edu.location}
                  </div>
                </div>

                {/* GPA */}
                <div className="border-t border-stone-200 pt-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
                      GPA
                    </span>
                    <span className="text-2xl font-bold text-amber-600">
                      {edu.gpa}
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-1000 group-hover:from-amber-600 group-hover:to-amber-700"
                      style={{ width: `${(parseFloat(edu.gpa) / 4.0) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Relevant Courses */}
                {edu.courses && (
                  <div className="border-t border-stone-200 pt-4 mt-auto">
                    <p className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-3">
                      Relevant Coursework
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.courses.map((course, courseIndex) => (
                        <span
                          key={courseIndex}
                          className="px-2 py-1 bg-stone-100 border border-stone-200 text-[9px] font-mono text-stone-600 group-hover:bg-amber-50 group-hover:border-amber-200 transition-colors"
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
