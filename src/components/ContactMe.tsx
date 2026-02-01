import { Mail, Github, Linkedin, MapPin, Clock } from 'lucide-react'
import personalData from '../personal-data.json'

export const ContactMe = () => {
  return (
    <section id="contact" className="mb-24 scroll-snap-align-start transition-all duration-700 opacity-0 translate-y-8 [&.section-visible]:opacity-100 [&.section-visible]:translate-y-0">
      <div className="border-2 border-stone-900 bg-gradient-to-br from-stone-900 to-stone-800 p-6 sm:p-12 relative overflow-hidden">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-500 text-black font-mono text-[10px] sm:text-xs uppercase font-bold mb-4 sm:mb-6">
              OPEN FOR OPPORTUNITIES
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white mb-3 sm:mb-4">
              Let's Build Something
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-stone-400 max-w-2xl mx-auto px-4">
              Available for full-time positions, freelance projects, and technical collaborations
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {/* Email */}
            <a
              href={`mailto:${personalData.contact.email}`}
              className="border border-stone-700 bg-stone-800/50 p-4 sm:p-6 hover:border-amber-500 hover:bg-stone-800 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-amber-500 text-black group-hover:scale-110 transition-transform">
                  <Mail size={16} className="sm:size-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-stone-400">
                  Email
                </span>
              </div>
              <p className="text-white font-mono text-xs sm:text-sm break-all">{personalData.contact.email}</p>
            </a>

            {/* GitHub */}
            <a
              href={personalData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-stone-700 bg-stone-800/50 p-4 sm:p-6 hover:border-amber-500 hover:bg-stone-800 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-amber-500 text-black group-hover:scale-110 transition-transform">
                  <Github size={16} className="sm:size-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-stone-400">
                  GitHub
                </span>
              </div>
              <p className="text-white font-mono text-xs sm:text-sm">@elderaka</p>
            </a>

            {/* LinkedIn */}
            <a
              href={personalData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-stone-700 bg-stone-800/50 p-4 sm:p-6 hover:border-amber-500 hover:bg-stone-800 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-amber-500 text-black group-hover:scale-110 transition-transform">
                  <Linkedin size={16} className="sm:size-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-stone-400">
                  LinkedIn
                </span>
              </div>
              <p className="text-white font-mono text-xs sm:text-sm">/in/laudadraka</p>
            </a>

            {/* Location */}
            <div className="border border-stone-700 bg-stone-800/50 p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-amber-500 text-black">
                  <MapPin size={16} className="sm:size-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-stone-400">
                  Location
                </span>
              </div>
              <p className="text-white font-mono text-xs sm:text-sm">{personalData.contact.location}</p>
            </div>
          </div>

          {/* Availability Banner */}
          <div className="border border-amber-500/30 bg-amber-500/10 p-4 sm:p-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 text-center md:text-left">
              <div className="p-2 sm:p-3 bg-amber-500 text-black">
                <Clock size={20} className="sm:size-6" />
              </div>
              <div>
                <p className="text-amber-500 font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-1">
                  Current Status
                </p>
                <p className="text-white text-base sm:text-lg font-bold">
                  {personalData.contact.availability}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contact Form Placeholder */}
          <div className="mt-8 sm:mt-12 border-t border-stone-700 pt-8 sm:pt-12">
            <div className="max-w-2xl mx-auto text-center px-4">
              <p className="text-stone-400 text-sm sm:text-base mb-6 sm:mb-8">
                Prefer a quick message? Send me an email and I'll get back to you within 24 hours.
              </p>
              <a
                href={`mailto:${personalData.contact.email}?subject=Opportunity Inquiry&body=Hi Lauda,%0D%0A%0D%0AI'd like to discuss...`}
                className="inline-block bg-amber-500 text-black px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-bold uppercase tracking-widest hover:bg-amber-400 transition-all"
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
