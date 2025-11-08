'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Star,
  Users,
  Globe,
  Award
} from 'lucide-react'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  description?: string
  showStats?: boolean
  showCTA?: boolean
  backgroundVariant?: 'default' | 'minimal' | 'dashboard'
}

export default function HeroSection({ 
  title = "PhishGuard",
  subtitle = "Advanced Cybersecurity Protection",
  description = "AI-powered phishing detection and real-time threat protection for individuals and businesses. Stay safe from online scams with our comprehensive security suite.",
  showStats = true,
  showCTA = true,
  backgroundVariant = 'default'
}: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const stats = [
    { icon: Users, label: 'Protected Users', value: '50,000+', color: 'text-cyan-400' },
    { icon: Shield, label: 'Threats Blocked', value: '1M+', color: 'text-green-400' },
    { icon: Globe, label: 'Countries Served', value: '25+', color: 'text-blue-400' },
    { icon: Award, label: 'Detection Rate', value: '99.9%', color: 'text-purple-400' }
  ]

  const features = [
    'Real-time phishing detection',
    'AI-powered threat analysis', 
    'Browser extension protection',
    '24/7 security monitoring'
  ]

  return (
    <section className={`relative min-h-[80vh] flex items-center justify-center overflow-hidden ${
      backgroundVariant === 'minimal' ? 'bg-gradient-to-b from-slate-900 to-slate-950' :
      backgroundVariant === 'dashboard' ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-black' :
      'bg-gradient-to-b from-black via-slate-950 to-slate-900'
    }`}>
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradients */}
        <div 
          className="absolute w-96 h-96 bg-cyan-400/8 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            left: `${20 + mousePosition.x * 0.1}%`,
            top: `${30 + mousePosition.y * 0.1}%`,
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-blue-400/6 rounded-full blur-3xl transition-transform duration-1000 ease-out delay-300"
          style={{
            right: `${15 + mousePosition.x * 0.08}%`,
            bottom: `${25 + mousePosition.y * 0.08}%`,
          }}
        />
        <div 
          className="absolute w-72 h-72 bg-purple-400/5 rounded-full blur-3xl transition-transform duration-1000 ease-out delay-500"
          style={{
            left: `${60 + mousePosition.x * 0.06}%`,
            top: `${60 + mousePosition.y * 0.06}%`,
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">Trusted by 50,000+ users worldwide</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-cyan-400 mb-6">
            {subtitle}
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            {description}
          </p>

          {/* Feature List */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 bg-slate-800/30 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-700/50">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Call to Action Buttons */}
          {showCTA && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  <span>Get Protected Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>

              <button className="group flex items-center gap-3 px-8 py-4 bg-slate-800/50 hover:bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>
          )}

          {/* Stats */}
          {showStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="group relative">
                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-1`}>
                        {stat.value}
                      </div>
                      <div className="text-slate-400 text-sm font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
    </section>
  )
}
