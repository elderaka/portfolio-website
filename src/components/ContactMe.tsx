import { Mail, Github, Linkedin, MapPin, Clock } from 'lucide-react'
import personalData from '../personal-data.json'

export const ContactMe = () => {
  return (
    <section id="contact" className="mb-24 scroll-snap-align-start transition-all duration-700 opacity-0 translate-y-8 [&.section-visible]:opacity-100 [&.section-visible]:translate-y-0">
      <div className="border-2 p-6 sm:p-12 relative overflow-hidden" style={{ borderColor: 'var(--theme-border)', background: 'linear-gradient(135deg, var(--contact-bg-start), var(--contact-bg-end))' }}>
        {/* Grid Pattern Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#b0aca5 1px, transparent 1px), linear-gradient(90deg, #b0aca5 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 'var(--theme-grid-opacity, 0.05)'
        }}></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 font-mono text-[10px] sm:text-xs uppercase font-bold mb-4 sm:mb-6 section-accent-badge">
              OPEN FOR OPPORTUNITIES
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-3 sm:mb-4" style={{ color: 'var(--contact-text)' }}>
              Let's Build Something
            </h3>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4" style={{ color: 'var(--contact-text-muted)' }}>
              Available for full-time positions, freelance projects, and technical collaborations
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {/* Email */}
            <a
              href={`mailto:${personalData.contact.email}`}
              className="section-card p-4 sm:p-6 group"
              style={{ borderColor: 'var(--theme-border)' }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 section-accent-badge group-hover:scale-110 transition-transform">
                  <Mail size={16} className="sm:size-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest section-muted">
                  Email
                </span>
              </div>
              <p className="font-mono text-xs sm:text-sm break-all transition-colors group-hover:" style={{ color: 'var(--contact-text)', '--contact-hover-color': 'var(--contact-text-hover)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--contact-text-hover)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--contact-text)'}>{personalData.contact.email}</p>
            </a>

            {/* GitHub */}
            <a
              href={personalData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="section-card p-4 sm:p-6 group"
              style={{ borderColor: 'var(--theme-border)' }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 section-accent-badge group-hover:scale-110 transition-transform">
                  <Github size={16} className="sm:size-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest section-muted">
                  GitHub
                </span>
              </div>
              <p className="font-mono text-xs sm:text-sm transition-colors" style={{ color: 'var(--contact-text)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--contact-text-hover)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--contact-text)'}>@elderaka</p>
            </a>

            {/* LinkedIn */}
            <a
              href={personalData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="section-card p-4 sm:p-6 group"
              style={{ borderColor: 'var(--theme-border)' }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 section-accent-badge group-hover:scale-110 transition-transform">
                  <Linkedin size={16} className="sm:size-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest section-muted">
                  LinkedIn
                </span>
              </div>
              <p className="font-mono text-xs sm:text-sm transition-colors" style={{ color: 'var(--contact-text)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--contact-text-hover)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--contact-text)'}>/in/laudadraka</p>
            </a>

            {/* Location */}
            <div className="section-card p-4 sm:p-6" style={{ borderColor: 'var(--theme-border)' }}>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 section-accent-badge">
                  <MapPin size={16} className="sm:size-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest section-muted">
                  Location
                </span>
              </div>
              <p className="font-mono text-xs sm:text-sm" style={{ color: 'var(--contact-text)' }}>{personalData.contact.location}</p>
            </div>
          </div>

          {/* Availability Banner */}
          <div className="p-4 sm:p-6" style={{ borderColor: `var(--theme-accent)`, backgroundColor: `var(--theme-accent)15`, border: `1px solid var(--theme-accent)30` }}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 text-center md:text-left">
              <div className="p-2 sm:p-3 section-accent-badge">
                <Clock size={20} className="sm:size-6" />
              </div>
              <div>
                <p className="font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--theme-accent)' }}>
                  Current Status
                </p>
                <p className="text-base sm:text-lg font-bold" style={{ color: 'var(--contact-text)' }}>
                  {personalData.contact.availability}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contact Form Placeholder */}
          <div className="mt-8 sm:mt-12 pt-8 sm:pt-12" style={{ borderTop: `1px solid var(--theme-border)` }}>
            <div className="max-w-2xl mx-auto text-center px-4">
              <p className="text-sm sm:text-base mb-6 sm:mb-8" style={{ color: 'var(--contact-text-muted)' }}>
                Prefer a quick message? Send me an email and I'll get back to you within 24 hours.
              </p>
              <a
                href={`mailto:${personalData.contact.email}?subject=Opportunity Inquiry&body=Hi Lauda,%0D%0A%0D%0AI'd like to discuss...`}
                className="inline-block px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-bold uppercase tracking-widest transition-all"
                style={{
                  backgroundColor: 'var(--theme-accent)',
                  color: 'var(--theme-bg)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--theme-accent-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--theme-accent)'
                }}
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
