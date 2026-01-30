import { Mail, Github, Linkedin, MapPin, Clock } from 'lucide-react'
import personalData from '../personal-data.json'

export const ContactMe = () => {
  return (
    <section id="contact" className="mb-24 scroll-snap-align-start">
      <div className="border-2 border-stone-900 bg-gradient-to-br from-stone-900 to-stone-800 p-12 relative overflow-hidden">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-block px-4 py-2 bg-amber-500 text-black font-mono text-xs uppercase font-bold mb-6">
              OPEN FOR OPPORTUNITIES
            </div>
            <h3 className="text-5xl font-bold uppercase tracking-tight text-white mb-4">
              Let's Build Something
            </h3>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto">
              Available for full-time positions, freelance projects, and technical collaborations
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Email */}
            <a
              href={`mailto:${personalData.contact.email}`}
              className="border border-stone-700 bg-stone-800/50 p-6 hover:border-amber-500 hover:bg-stone-800 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-500 text-black group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  Email
                </span>
              </div>
              <p className="text-white font-mono text-sm break-all">{personalData.contact.email}</p>
            </a>

            {/* GitHub */}
            <a
              href={personalData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-stone-700 bg-stone-800/50 p-6 hover:border-amber-500 hover:bg-stone-800 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-500 text-black group-hover:scale-110 transition-transform">
                  <Github size={20} />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  GitHub
                </span>
              </div>
              <p className="text-white font-mono text-sm">@elderaka</p>
            </a>

            {/* LinkedIn */}
            <a
              href={personalData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-stone-700 bg-stone-800/50 p-6 hover:border-amber-500 hover:bg-stone-800 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-500 text-black group-hover:scale-110 transition-transform">
                  <Linkedin size={20} />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  LinkedIn
                </span>
              </div>
              <p className="text-white font-mono text-sm">/in/laudadraka</p>
            </a>

            {/* Location */}
            <div className="border border-stone-700 bg-stone-800/50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-500 text-black">
                  <MapPin size={20} />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  Location
                </span>
              </div>
              <p className="text-white font-mono text-sm">{personalData.contact.location}</p>
            </div>
          </div>

          {/* Availability Banner */}
          <div className="border border-amber-500/30 bg-amber-500/10 p-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
              <div className="p-3 bg-amber-500 text-black">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-1">
                  Current Status
                </p>
                <p className="text-white text-lg font-bold">
                  {personalData.contact.availability}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contact Form Placeholder */}
          <div className="mt-12 border-t border-stone-700 pt-12">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-stone-400 mb-8">
                Prefer a quick message? Send me an email and I'll get back to you within 24 hours.
              </p>
              <a
                href={`mailto:${personalData.contact.email}?subject=Opportunity Inquiry&body=Hi Lauda,%0D%0A%0D%0AI'd like to discuss...`}
                className="inline-block bg-amber-500 text-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-amber-400 transition-all"
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
