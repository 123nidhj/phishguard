'use client'

import React, { useEffect, useState } from 'react'
import { 
  ShieldCheck, 
  Bug, 
  UploadCloud, 
  Globe2, 
  Download, 
  Zap,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Shield,
  Scan,
  AlertTriangle,
  TrendingUp,
  Clock,
  Award,
  Eye,
  Lock,
  Wifi,
  Database,
  Target,
  Activity,
  Cpu,
  Heart,
  Rocket,
  Search,
  Brain,
  Timer,
  Fingerprint,
  MousePointer,
  Command
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4)
    }, 3000)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      clearInterval(interval)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const features = [
    { icon: Shield, text: "Real-time protection against phishing attacks", color: "cyan" },
    { icon: Brain, text: "AI-powered URL analysis and threat detection", color: "blue" },
    { icon: AlertTriangle, text: "Instant alerts for malicious content", color: "purple" },
    { icon: Fingerprint, text: "Advanced behavioral pattern recognition", color: "pink" }
  ]

  const stats = [
    { number: "50+", label: "URLs Scanned", icon: Search },
    { number: "231+", label: "Threats Blocked", icon: Shield },
    { number: "99.9%", label: "Accuracy Rate", icon: Target },
    { number: "24/7", label: "Protection", icon: Clock }
  ]

  if (!mounted) {
    return null
  }
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            top: `${mousePosition.y}%`,
            left: `${mousePosition.x}%`,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-400/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 xl:py-20">
          <div className="max-w-7xl mx-auto text-center space-y-6 sm:space-y-8 lg:space-y-12">
            
            {/* Status Badge */}
            <div className="flex justify-center animate-fade-in">
              <Badge 
                variant="outline" 
                className="text-cyan-400 px-4 sm:px-6 py-2 sm:py-3 border-cyan-400/50 bg-cyan-400/10 backdrop-blur-sm text-xs sm:text-sm lg:text-base font-medium hover:bg-cyan-400/20 transition-all duration-300 cursor-pointer group"
              >
                <Rocket className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:animate-bounce" />
                 Next-Gen AI Security Platform
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 ml-2 animate-pulse" />
              </Badge>
            </div>

            {/* Main Heading - Enhanced Mobile Responsive */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold tracking-tight leading-tight px-2">
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 xs:mb-2 sm:mb-4">
                Advanced Phishing
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Protection Suite
              </span>
            </h1>

            {/* Dynamic Feature Display - Mobile Optimized */}
            <div className="h-10 xs:h-12 sm:h-16 flex items-center justify-center px-2 sm:px-4">
              <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 bg-zinc-800/50 backdrop-blur-sm rounded-full px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 border border-zinc-700/50 transition-all duration-500 hover:border-cyan-400/50 hover:bg-zinc-800/70">
                {React.createElement(features[currentFeature].icon, {
                  className: `w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-${features[currentFeature].color}-400 animate-pulse flex-shrink-0`
                })}
                <span className="text-zinc-300 text-xs xs:text-xs sm:text-sm lg:text-base font-medium max-w-[200px] xs:max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl text-center leading-relaxed truncate sm:whitespace-normal">
                  {features[currentFeature].text}
                </span>
              </div>
            </div>

            {/* Enhanced Description - Mobile Optimized */}
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-2xl text-zinc-300 leading-relaxed max-w-[280px] xs:max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-2 sm:px-4">
              PhishGuard leverages <span className="text-cyan-400 font-semibold inline-flex items-center"><Brain className="w-3 h-3 xs:w-4 xs:h-4 mx-1" />advanced AI</span> and 
              <span className="text-blue-400 font-semibold inline-flex items-center"><Cpu className="w-3 h-3 xs:w-4 xs:h-4 mx-1" />machine learning</span> to detect phishing, 
              malware, and scam threats — <span className="text-purple-400 font-semibold inline-flex items-center"><Timer className="w-3 h-3 xs:w-4 xs:h-4 mx-1" />in real-time</span>.
            </p>

            {/* CTA Buttons - Enhanced Mobile Responsive */}
            <div className="flex flex-col gap-3 xs:gap-4 sm:flex-row sm:justify-center sm:gap-4 lg:gap-6 mt-6 xs:mt-8 sm:mt-12 px-2 xs:px-4 w-full max-w-sm xs:max-w-md sm:max-w-2xl mx-auto">
              <Link
                href="/install"
                className="group inline-flex items-center justify-center gap-2 xs:gap-2 sm:gap-3 px-4 xs:px-6 sm:px-8 lg:px-10 py-3 xs:py-3.5 sm:py-4 lg:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg xs:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 text-xs xs:text-sm sm:text-base lg:text-lg"
              >
                <Download className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 group-hover:animate-bounce" />
                Install Extension
                <ArrowRight className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/report"
                className="group inline-flex items-center justify-center gap-2 xs:gap-2 sm:gap-3 px-4 xs:px-6 sm:px-8 lg:px-10 py-3 xs:py-3.5 sm:py-4 lg:py-5 border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 font-semibold rounded-lg xs:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs xs:text-sm sm:text-base lg:text-lg"
              >
                <UploadCloud className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
                Report Threat
                <MousePointer className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Enhanced Stats Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-6 lg:gap-8 mt-8 xs:mt-12 sm:mt-16 lg:mt-20 px-2 xs:px-4 max-w-6xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="bg-zinc-800/30 backdrop-blur-sm rounded-lg xs:rounded-xl sm:rounded-2xl p-2 xs:p-3 sm:p-6 lg:p-8 border border-zinc-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:bg-zinc-800/50 group-hover:shadow-lg group-hover:shadow-cyan-400/10 transform hover:-translate-y-1">
                    <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-1 xs:mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      {React.createElement(stat.icon, {
                        className: "w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white"
                      })}
                    </div>
                    <div className="text-lg xs:text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-zinc-400 text-xs xs:text-xs sm:text-sm lg:text-base font-medium mt-0.5 xs:mt-1 sm:mt-2">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Social Proof - Mobile Optimized */}
            <div className="flex flex-col xs:flex-row items-center justify-center gap-2 xs:gap-3 sm:gap-6 lg:gap-8 mt-8 xs:mt-12 sm:mt-16 text-zinc-400 px-2 xs:px-4">
              <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 bg-zinc-800/30 backdrop-blur-sm rounded-full px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-3 border border-zinc-700/50 hover:border-cyan-400/30 transition-all duration-300">
                <Users className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span className="text-xs xs:text-xs sm:text-sm lg:text-base">
                  Trusted by <span className="text-cyan-400 font-semibold">50+</span> users
                </span>
                <Heart className="w-3 h-3 xs:w-4 xs:h-4 text-pink-400 animate-pulse" />
              </div>
              <div className="hidden xs:block w-1 h-1 bg-zinc-600 rounded-full"></div>
              <div className="flex items-center gap-1 xs:gap-1 sm:gap-2 bg-zinc-800/30 backdrop-blur-sm rounded-full px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-3 border border-zinc-700/50 hover:border-yellow-400/30 transition-all duration-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-1 xs:ml-2 text-xs xs:text-xs sm:text-sm lg:text-base">4.2/5 rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Features Section - Mobile Enhanced */}
        <section className="py-8 xs:py-12 sm:py-16 lg:py-20 xl:py-24 px-2 xs:px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 xs:mb-12 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center justify-center w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4 xs:mb-6 sm:mb-8 shadow-lg shadow-cyan-500/30">
                <Zap className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
              </div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3 xs:mb-4 sm:mb-6 px-2">
                Enterprise-Grade Security Features
              </h2>
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-zinc-400 max-w-[280px] xs:max-w-sm sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed px-2">
                Comprehensive cybersecurity solutions powered by cutting-edge AI technology and machine learning algorithms
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
              {/* Real-Time Detection - Mobile Enhanced */}
              <div className="group bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm p-3 xs:p-4 sm:p-6 lg:p-8 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl border border-zinc-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/10 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg xs:rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 xs:mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                    <ShieldCheck className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold mb-2 xs:mb-3 sm:mb-4 text-white group-hover:text-cyan-400 transition-colors">
                    Real-Time Detection
                  </h3>
                  <p className="text-zinc-400 text-xs xs:text-sm sm:text-base leading-relaxed mb-3 xs:mb-4">
                    Advanced AI algorithms analyze URLs instantly using machine learning patterns and threat intelligence databases.
                  </p>
                  <div className="flex items-center text-cyan-400 text-xs xs:text-xs sm:text-sm font-medium">
                    <CheckCircle className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-1 xs:mr-2" />
                    99.9% accuracy rate
                    <Eye className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 ml-1 xs:ml-2 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Malware Protection - Mobile Enhanced */}
              <div className="group bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm p-3 xs:p-4 sm:p-6 lg:p-8 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl border border-zinc-700/50 hover:border-red-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-400/10 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg xs:rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 xs:mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/30">
                    <Bug className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold mb-2 xs:mb-3 sm:mb-4 text-white group-hover:text-red-400 transition-colors">
                    Malware Protection
                  </h3>
                  <p className="text-zinc-400 text-xs xs:text-sm sm:text-base leading-relaxed mb-3 xs:mb-4">
                    Proactive defense against malware, ransomware, and malicious scripts with behavioral analysis.
                  </p>
                  <div className="flex items-center text-red-400 text-xs xs:text-xs sm:text-sm font-medium">
                    <Lock className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-1 xs:mr-2" />
                    Enterprise-grade protection
                    <Database className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 ml-1 xs:ml-2 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Global Coverage - Mobile Enhanced */}
              <div className="group bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm p-3 xs:p-4 sm:p-6 lg:p-8 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl border border-zinc-700/50 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-400/10 transform hover:-translate-y-2 relative overflow-hidden sm:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg xs:rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 xs:mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                    <Globe2 className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold mb-2 xs:mb-3 sm:mb-4 text-white group-hover:text-purple-400 transition-colors">
                    Global Threat Intelligence
                  </h3>
                  <p className="text-zinc-400 text-xs xs:text-sm sm:text-base leading-relaxed mb-3 xs:mb-4">
                    Worldwide threat monitoring with real-time updates from our global security network.
                  </p>
                  <div className="flex items-center text-purple-400 text-xs xs:text-xs sm:text-sm font-medium">
                    <Wifi className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-1 xs:mr-2" />
                    200+ countries monitored
                    <Command className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 ml-1 xs:ml-2 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & Revenue Model Section */}
        <section className="py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4 sm:mb-6 shadow-lg shadow-green-500/30">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4 sm:mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                Choose the perfect plan for your security needs. From students to enterprises, we&apos;ve got you covered.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
              
              {/* Free Plan */}
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-zinc-700/50 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-400/10 transform hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Free Plan</h3>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Students</Badge>
                  </div>
                  <div className="mb-4 sm:mb-6">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">₹0</span>
                    <span className="text-zinc-400 text-sm sm:text-base ml-2">forever</span>
                  </div>
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                      Link & Email Scanning
                    </li>
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                      Basic Phishing Protection
                    </li>
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                      Browser Extension
                    </li>
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                      Community Support
                    </li>
                  </ul>
                  <Link
                    href="/install"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    Get Started Free
                  </Link>
                </div>
              </div>

              {/* Pro Plan - Most Popular */}
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/20 transform hover:-translate-y-2 relative overflow-hidden scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg">
                    Most Popular
                  </Badge>
                </div>
                <div className="relative z-10 pt-2">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Pro Plan</h3>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">Individual</Badge>
                  </div>
                  <div className="mb-4 sm:mb-6">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">₹299</span>
                    <span className="text-zinc-400 text-sm sm:text-base ml-2">/month</span>
                  </div>
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mr-2 sm:mr-3 flex-shrink-0" />
                      Everything in Free
                    </li>
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mr-2 sm:mr-3 flex-shrink-0" />
                      AI Document Scanning
                    </li>
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mr-2 sm:mr-3 flex-shrink-0" />
                      Custom Security Alerts
                    </li>
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mr-2 sm:mr-3 flex-shrink-0" />
                      Advanced Analytics
                    </li>
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mr-2 sm:mr-3 flex-shrink-0" />
                      Priority Support
                    </li>
                  </ul>
                  <Link
                    href="/install"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base shadow-lg shadow-cyan-500/25"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    Upgrade to Pro
                  </Link>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-zinc-700/50 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-400/10 transform hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Enterprise</h3>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">Universities</Badge>
                  </div>
                  <div className="mb-4 sm:mb-6">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">₹2,999</span>
                    <span className="text-zinc-400 text-sm sm:text-base ml-2">/year</span>
                  </div>
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mr-2 sm:mr-3 flex-shrink-0" />
                      SAP-Powered Dashboards
                    </li>
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mr-2 sm:mr-3 flex-shrink-0" />
                      Scam Trend Reports
                    </li>
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mr-2 sm:mr-3 flex-shrink-0" />
                      Campus-wide Alerts
                    </li>
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mr-2 sm:mr-3 flex-shrink-0" />
                      API Integration
                    </li>
                    <li className="flex items-center text-zinc-300 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mr-2 sm:mr-3 flex-shrink-0" />
                      Dedicated Support
                    </li>
                  </ul>
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border-2 border-purple-400/50 text-purple-400 hover:bg-purple-400/10 hover:border-purple-400 font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                  >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>

            {/* Revenue Model Info */}
            <div className="mt-12 sm:mt-16 lg:mt-20">
              <div className="bg-gradient-to-r from-zinc-800/30 to-zinc-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 border border-zinc-700/50">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Revenue Model – How PhishGuard Generates Value
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  
                  {/* Freemium Model */}
                  <div className="bg-zinc-800/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-zinc-700/30 hover:border-blue-400/30 transition-all duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Freemium Plan</h4>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-3">
                      Free core features for students, premium advanced features for enhanced protection.
                    </p>
                    <div className="text-cyan-400 text-xs sm:text-sm font-medium">
                      Free → ₹299/month
                    </div>
                  </div>

                  {/* University Subscriptions */}
                  <div className="bg-zinc-800/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-zinc-700/30 hover:border-purple-400/30 transition-all duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">University Subscriptions</h4>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-3">
                      Institutional dashboards, analytics, and campus-wide security monitoring.
                    </p>
                    <div className="text-purple-400 text-xs sm:text-sm font-medium">
                      ₹2,999/year
                    </div>
                  </div>

                  {/* API Integration */}
                  <div className="bg-zinc-800/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-zinc-700/30 hover:border-green-400/30 transition-all duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <Globe2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">API Integration</h4>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-3">
                      Scam verification APIs for career portals like Internshala, LinkedIn.
                    </p>
                    <div className="text-green-400 text-xs sm:text-sm font-medium">
                      Negotiable pricing
                    </div>
                  </div>

                  {/* Partnerships */}
                  <div className="bg-zinc-800/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-zinc-700/30 hover:border-yellow-400/30 transition-all duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Partnerships</h4>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-3">
                      Cybersecurity partnerships for awareness campaigns and sponsored content.
                    </p>
                    <div className="text-yellow-400 text-xs sm:text-sm font-medium">
                      Long-term revenue
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20 backdrop-blur-sm border-y border-zinc-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"></div>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6 sm:mb-8 lg:mb-10 shadow-lg shadow-cyan-500/30 animate-pulse">
              <Award className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Secure Your Digital Life Today
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-zinc-300 mb-6 sm:mb-8 lg:mb-10 leading-relaxed max-w-4xl mx-auto">
              Join thousands of security-conscious users who trust PhishGuard to protect their online activities. 
              Experience next-generation cybersecurity protection.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6 max-w-2xl mx-auto">
              <Link
                href="/scanner"
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base lg:text-lg"
              >
                <Scan className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-spin" />
                Launch Security Scanner
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 border-2 border-zinc-600 text-zinc-300 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/5 font-semibold rounded-xl lg:rounded-2xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base lg:text-lg"
              >
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce" />
                Security Dashboard
              </Link>
            </div>
            
            {/* Additional Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12 lg:mt-16 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 bg-zinc-800/30 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-zinc-700/50 hover:border-green-400/30 transition-all duration-300">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span className="text-zinc-300 text-xs sm:text-sm font-medium">SSL Secure</span>
              </div>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 bg-zinc-800/30 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-zinc-700/50 hover:border-blue-400/30 transition-all duration-300">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="text-zinc-300 text-xs sm:text-sm font-medium">Privacy Protected</span>
              </div>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 bg-zinc-800/30 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-zinc-700/50 hover:border-purple-400/30 transition-all duration-300 sm:col-span-3 lg:col-span-1">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <span className="text-zinc-300 text-xs sm:text-sm font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
