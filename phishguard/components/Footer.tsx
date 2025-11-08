'use client'

import { 
  Shield, 
  Mail, 
  Phone, 
  Twitter, 
  Linkedin, 
  Github,
  ChevronUp,
  Heart,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cyan-400/4 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-blue-400/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  PhishGuard
                </span>
              </div>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                AI-powered cybersecurity protection keeping you safe from online threats.
              </p>
              
              {/* Compact Stats */}
              <div className="flex gap-3 mb-4">
                <div className="text-center">
                  <p className="text-cyan-400 font-bold text-sm">50+</p>
                  <p className="text-slate-400 text-xs">Users</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-400 font-bold text-sm">99.9%</p>
                  <p className="text-slate-400 text-xs">Accuracy</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-2">
                {[
                  { icon: Twitter, href: '#', color: 'hover:text-cyan-400' },
                  { icon: Github, href: '#', color: 'hover:text-purple-400' },
                  { icon: Linkedin, href: '#', color: 'hover:text-blue-400' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-8 h-8 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-400 ${social.color} transition-colors duration-300 hover:bg-slate-700/50`}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-semibold mb-4 text-cyan-400">Features</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Dashboard', href: '/dashboard' },
                  { name: 'Document Scanner', href: '/doc' },
                  { name: 'Report Scam', href: '/report' },
                  { name: 'Settings', href: '/settings' }
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security */}
            <div>
              <h4 className="text-base font-semibold mb-4 text-green-400">Security</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Real-time Protection', icon: Clock },
                  { name: 'AI Detection', icon: TrendingUp },
                  { name: '24/7 Monitoring', icon: Shield },
                  { name: 'Threat Intelligence', icon: Award }
                ].map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2 text-slate-300 text-sm">
                    <feature.icon className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-base font-semibold mb-4 text-purple-400">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <a href="mailto:support@phishguard.com" className="hover:text-cyan-400 transition-colors">
                    Hariharanath247@gmail.com
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <a href="tel:+1-800-PHISH-GUARD" className="hover:text-green-400 transition-colors">
                    24/7 Support
                  </a>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                  <p className="text-xs text-green-400 font-medium">Response Time</p>
                  <p className="text-xs text-slate-400">Email: &lt;2hrs • Phone: &lt;5min</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 bg-slate-950/50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Copyright */}
              <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                <span>© 2025 PhishGuard. Made with</span>
                <Heart className="w-3 h-3 text-red-500 animate-pulse" />
                <span>for security.</span>
              </div>

              {/* Legal Links */}
              <div className="flex items-center gap-4 text-xs sm:text-sm">
                {['Privacy', 'Terms', 'Security'].map((link) => (
                  <a
                    key={link}
                    href={`/${link.toLowerCase()}`}
                    className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    {link}
                  </a>
                ))}
              </div>

              {/* Scroll to Top */}
              <button
                onClick={scrollToTop}
                className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                aria-label="Scroll to top"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
