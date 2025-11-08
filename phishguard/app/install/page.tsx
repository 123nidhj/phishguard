'use client'

import React, { useEffect, useState } from 'react'
import {
  Shield,
  Download,
  FolderOpen,
  Settings,
  CheckCircle,
  AlertTriangle,
  Zap,
  Lock,
  Eye,
  Cpu,
  Activity,
  Clock,
  Users,
  Star,
  Chrome,
  ArrowRight,
  FileArchive,
  MousePointer,
  Command,
  Heart,
  Fingerprint
} from 'lucide-react'

export default function InstallPage() {
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev % 5) + 1)
    }, 4000)

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      clearInterval(interval)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const installSteps = [
    {
      id: 1,
      icon: Download,
      title: "Download Extension",
      description: "Get the PhishGuard security package with advanced protection algorithms",
      detail: "Secure ZIP file containing all necessary components and dependencies",
      color: "cyan"
    },
    {
      id: 2,
      icon: FileArchive,
      title: "Extract Security Files",
      description: "Unzip the package to a secure directory on your system",
      detail: "Maintain folder structure for optimal security configuration",
      color: "blue"
    },
    {
      id: 3,
      icon: Chrome,
      title: "Access Chrome Extensions",
      description: "Navigate to chrome://extensions in your browser",
      detail: "Browser's native extension management interface",
      color: "purple"
    },
    {
      id: 4,
      icon: Settings,
      title: "Enable Developer Mode",
      description: "Activate developer mode for extension installation",
      detail: "Required for loading unpacked security extensions",
      color: "pink"
    },
    {
      id: 5,
      icon: FolderOpen,
      title: "Deploy Extension",
      description: "Load unpacked extension from your extracted folder",
      detail: "Complete installation and activate protection protocols",
      color: "green"
    }
  ]

  const features = [
    { icon: Shield, text: "Blocks 231+ malicious domains", color: "cyan" },
    { icon: Activity, text: "Real-time threat detection", color: "blue" },
    { icon: Cpu, text: "Zero performance impact", color: "purple" },
    { icon: Lock, text: "Enterprise-grade encryption", color: "pink" },
    { icon: Eye, text: "Advanced behavioral analysis", color: "green" },
    { icon: Fingerprint, text: "AI-powered pattern recognition", color: "orange" }
  ]

  if (!mounted) {
    return null
  }
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-cyan-400/8 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            top: `${mousePosition.y}%`,
            left: `${mousePosition.x}%`,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/6 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-400/6 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-400/6 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Cyber Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-25 delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Enhanced Header Section */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full mb-6 sm:mb-8 shadow-lg shadow-cyan-500/30 relative group">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full animate-ping opacity-20"></div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              Install{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent relative">
                PhishGuard
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent animate-pulse"></div>
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-xs sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed px-4">
              Deploy enterprise-grade cybersecurity protection with advanced AI-powered threat detection and real-time malware prevention
            </p>

            {/* Status Indicators */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 px-4">
              <div className="flex items-center gap-2 bg-zinc-800/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-cyan-400/20">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <span className="text-xs sm:text-sm text-gray-300">SSL Verified</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-400/20">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 animate-pulse" />
                <span className="text-xs sm:text-sm text-gray-300">AI Powered</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-purple-400/20">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400 animate-pulse" />
                <span className="text-xs sm:text-sm text-gray-300">Free Forever</span>
              </div>
            </div>
          </div>

          {/* Main Installation Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            
            {/* Installation Steps */}
            <div className="space-y-6 lg:space-y-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Command className="w-4 h-4 sm:w-5 sm:h-5 text-black font-bold" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Installation Protocol
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {installSteps.map((step) => (
                  <div 
                    key={step.id}
                    className={`group relative bg-zinc-800/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border transition-all duration-500 hover:bg-zinc-800/50 cursor-pointer transform hover:-translate-y-1 ${
                      currentStep === step.id 
                        ? `border-${step.color}-400/50 shadow-lg shadow-${step.color}-400/10` 
                        : 'border-zinc-700/50 hover:border-cyan-400/30'
                    }`}
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r ${
                        step.color === 'cyan' ? 'from-cyan-500 to-cyan-600' :
                        step.color === 'blue' ? 'from-blue-500 to-blue-600' :
                        step.color === 'purple' ? 'from-purple-500 to-purple-600' :
                        step.color === 'pink' ? 'from-pink-500 to-pink-600' :
                        'from-green-500 to-green-600'
                      } rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg ${
                        currentStep === step.id ? 'animate-pulse' : ''
                      }`}>
                        {React.createElement(step.icon, {
                          className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white"
                        })}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                          <span className="text-xs sm:text-sm font-bold text-zinc-500 bg-zinc-700/50 px-2 py-1 rounded-full">
                            STEP {step.id}
                          </span>
                          {currentStep === step.id && (
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                              <span className="text-xs text-cyan-400 font-medium">ACTIVE</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors">
                          {step.title}
                        </h3>
                        
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-2 sm:mb-3">
                          {step.description}
                        </p>
                        
                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                          {step.detail}
                        </p>
                        
                        {step.id === 3 && (
                          <div className="mt-3 sm:mt-4">
                            <code className="bg-black border border-cyan-500/30 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-cyan-400 font-mono text-xs sm:text-sm">
                              chrome://extensions
                            </code>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0">
                        <MousePointer className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download & Features Section */}
            <div className="space-y-6 sm:space-y-8">
              
              {/* Download Card */}
              <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-2xl border border-cyan-400/20 relative overflow-hidden group">
                
                {/* Animated Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-400/10 to-purple-400/5 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-1000"></div>
                
                <div className="relative z-10 text-center">
                  <div className="text-5xl sm:text-6xl lg:text-7xl mb-4 sm:mb-6 animate-bounce">
                    ⚡
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                    Ready to Deploy?
                  </h3>
                  
                  <p className="text-base sm:text-lg lg:text-xl text-cyan-100 mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto">
                    Download PhishGuard and activate enterprise-grade security protocols
                  </p>
                  
                  <a
                    href="/assets/phishguard.zip"
                    download
                    className="inline-flex items-center justify-center gap-3 sm:gap-4 px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-bold rounded-2xl sm:rounded-3xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 text-base sm:text-lg lg:text-xl group/btn"
                  >
                    <Download className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:animate-bounce" />
                    Download PhishGuard
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                  
                  <div className="mt-4 sm:mt-6 text-sm sm:text-base text-cyan-300 flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    Version 2.0 • Advanced Security • Free
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="group bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-zinc-700/50 hover:border-cyan-400/30 transition-all duration-300 hover:bg-zinc-800/50 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${
                        feature.color === 'cyan' ? 'from-cyan-500 to-cyan-600' :
                        feature.color === 'blue' ? 'from-blue-500 to-blue-600' :
                        feature.color === 'purple' ? 'from-purple-500 to-purple-600' :
                        feature.color === 'pink' ? 'from-pink-500 to-pink-600' :
                        feature.color === 'green' ? 'from-green-500 to-green-600' :
                        'from-orange-500 to-orange-600'
                      } rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        {React.createElement(feature.icon, {
                          className: "w-4 h-4 sm:w-5 sm:h-5 text-white"
                        })}
                      </div>
                      <span className="text-sm sm:text-base font-medium text-gray-300 group-hover:text-white transition-colors">
                        {feature.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="bg-zinc-800/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-zinc-700/30">
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                  <span className="text-base sm:text-lg text-gray-300">
                    Trusted by <span className="text-cyan-400 font-bold">50+</span> users worldwide
                  </span>
                </div>
                
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-300">
                    4.9/5 Security Rating
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Security Notice */}
          <div className="mt-8 sm:mt-12 lg:mt-16 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 border border-cyan-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-cyan-400/30 backdrop-blur-sm">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-cyan-400 animate-pulse" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-cyan-300 flex items-center gap-2">
                  Security Protocol Notice
                  <Fingerprint className="w-5 h-5 text-cyan-400" />
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                  PhishGuard provides enterprise-grade protection against known cybersecurity threats but should be integrated as part of a comprehensive security strategy. 
                  Always verify URLs manually and maintain best cybersecurity practices when handling sensitive information and credentials.
                </p>
                
                <div className="mt-4 sm:mt-6 flex flex-wrap gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-cyan-400">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                    End-to-end encryption
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-400">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    Privacy compliant
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-400">
                    <Cpu className="w-3 h-3 sm:w-4 sm:h-4" />
                    AI-powered detection
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
