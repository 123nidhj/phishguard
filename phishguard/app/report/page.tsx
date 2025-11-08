'use client'

import { useState, useEffect } from 'react'
import { db, auth } from '../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import {
  Globe2,
  Mail,
  AlertTriangle,
  FileText,
  ImageIcon,
  SendHorizonal,
  Shield,
  CheckCircle,
  Loader2,
  Info,
  Sparkles,
  Eye,
  Users,
  Clock,
  Lock,
  Zap,
  Activity
} from 'lucide-react'
import { toast } from 'sonner'

export default function ReportPage() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [scamType, setScamType] = useState('')
  const [description, setDescription] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!url.trim()) {
      newErrors.url = 'URL is required'
    } else if (!isValidUrl(url)) {
      newErrors.url = 'Please enter a valid URL'
    }
    
    if (!scamType) {
      newErrors.scamType = 'Please select a scam type'
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }
    
    if (email && !isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (proofUrl && !isValidUrl(proofUrl)) {
      newErrors.proofUrl = 'Please enter a valid URL'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async () => {
    const user = auth.currentUser
    if (!user) {
      toast.error('Please sign in to submit a report.')
      return
    }

    if (!validateForm()) {
      toast.error('Please fix the errors below.')
      return
    }

    setIsSubmitting(true)

    try {
      await addDoc(collection(db, 'reports'), {
        url: url.trim(),
        scamType,
        description: description.trim(),
        reporterEmail: email || user.email,
        proofUrl: proofUrl.trim() || null,
        uid: user.uid,
        createdAt: serverTimestamp(),
        status: 'pending',
      })

      setUrl('')
      setEmail('')
      setScamType('')
      setDescription('')
      setProofUrl('')
      setErrors({})

      toast.success('✅ Scam report submitted successfully! We\'ll review it shortly.')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
      </div>

      <div className="relative z-10 max-w-6xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-6 sm:mb-8 shadow-lg shadow-cyan-500/30 relative group">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-20"></div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
            Report a{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Scam
            </span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-300 max-w-xs sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed px-4">
            Help protect the community by reporting suspicious websites, phishing attempts, and online scams
          </p>

          {/* Status Indicators */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 px-4">
            <div className="flex items-center gap-2 bg-slate-800/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-cyan-400/20">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs sm:text-sm text-slate-300">24/7 Monitoring</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-400/20">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <span className="text-xs sm:text-sm text-slate-300">Community Driven</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-purple-400/20">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 animate-pulse" />
              <span className="text-xs sm:text-sm text-slate-300">Real-time Protection</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-700/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Report Details</h2>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  
                  {/* URL Field */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                      <Globe2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Suspicious URL</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://suspicious-website.com"
                        className={`w-full px-4 py-4 rounded-xl bg-slate-900/60 border-2 transition-all duration-300 text-sm sm:text-base placeholder:text-slate-500 focus:outline-none focus:ring-4 backdrop-blur-sm ${
                          errors.url 
                            ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/20' 
                            : 'border-slate-600/50 focus:border-cyan-400 focus:ring-cyan-500/20 hover:border-slate-500/70'
                        }`}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {errors.url && (
                      <p className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.url}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                      <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Your Email</span>
                      <span className="text-slate-400 text-sm font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-4 rounded-xl bg-slate-900/60 border-2 transition-all duration-300 text-sm sm:text-base placeholder:text-slate-500 focus:outline-none focus:ring-4 backdrop-blur-sm ${
                          errors.email 
                            ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/20' 
                            : 'border-slate-600/50 focus:border-cyan-400 focus:ring-cyan-500/20 hover:border-slate-500/70'
                        }`}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                    <p className="text-slate-400 text-xs sm:text-sm flex items-start gap-2 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                      <span>We&apos;ll use this to contact you for follow-up questions if needed</span>
                    </p>
                  </div>

                  {/* Scam Type Field */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                      <AlertTriangle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Scam Category</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={scamType}
                        onChange={(e) => setScamType(e.target.value)}
                        className={`w-full px-4 py-4 rounded-xl bg-slate-900/60 border-2 transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-4 backdrop-blur-sm appearance-none cursor-pointer ${
                          errors.scamType 
                            ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/20' 
                            : 'border-slate-600/50 focus:border-cyan-400 focus:ring-cyan-500/20 hover:border-slate-500/70'
                        }`}
                      >
                        <option value="Phishing"> Phishing (Fake login pages)</option>
                <option value="Fake Tech Support"> Fake Tech Support</option>
                <option value="Financial Scam"> Financial Scam</option>
                      </select>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {errors.scamType && (
                      <p className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.scamType}</span>
                      </p>
                    )}
                  </div>

                  {/* Description Field */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                      <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Detailed Description</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        placeholder="Please provide detailed information about the scam:

• How did you encounter this suspicious activity?
• What happened when you visited the site?
• What information did they request?
• Any unusual behavior or red flags you noticed?
• Additional context that might help our investigation..."
                        className={`w-full px-4 py-4 rounded-xl bg-slate-900/60 border-2 transition-all duration-300 text-sm sm:text-base placeholder:text-slate-500 focus:outline-none focus:ring-4 resize-none backdrop-blur-sm ${
                          errors.description 
                            ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/20' 
                            : 'border-slate-600/50 focus:border-cyan-400 focus:ring-cyan-500/20 hover:border-slate-500/70'
                        }`}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      {errors.description ? (
                        <p className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          <span>{errors.description}</span>
                        </p>
                      ) : (
                        <p className="text-slate-400 text-xs sm:text-sm bg-slate-800/50 px-3 py-1.5 rounded-lg">
                          {description.length}/1000 characters
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Proof URL Field */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                      <ImageIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Evidence/Screenshot Link</span>
                      <span className="text-slate-400 text-sm font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={proofUrl}
                        onChange={(e) => setProofUrl(e.target.value)}
                        placeholder="https://imgur.com/your-screenshot or https://example.com/evidence"
                        className={`w-full px-4 py-4 rounded-xl bg-slate-900/60 border-2 transition-all duration-300 text-sm sm:text-base placeholder:text-slate-500 focus:outline-none focus:ring-4 backdrop-blur-sm ${
                          errors.proofUrl 
                            ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/20' 
                            : 'border-slate-600/50 focus:border-cyan-400 focus:ring-cyan-500/20 hover:border-slate-500/70'
                        }`}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {errors.proofUrl && (
                      <p className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.proofUrl}</span>
                      </p>
                    )}
                    <p className="text-slate-400 text-xs sm:text-sm flex items-start gap-2 bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/20">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-400" />
                      <span>Upload screenshots to services like Imgur, Dropbox, or Google Drive, then paste the public link here</span>
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 sm:pt-6">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-2xl px-8 py-4 sm:py-5 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 text-sm sm:text-base transform hover:scale-[1.02] disabled:transform-none relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Submitting Report...</span>
                          </>
                        ) : (
                          <>
                            <SendHorizonal className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            <span>Submit Security Report</span>
                            <Sparkles className="w-4 h-4 animate-pulse" />
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Process Info */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-bold text-white">What Happens Next?</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
                  <Clock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm">24-Hour Review</p>
                    <p className="text-slate-400 text-xs">Our security team reviews all reports</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
                  <Activity className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm">Database Update</p>
                    <p className="text-slate-400 text-xs">Confirmed threats added to blocklist</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
                  <Users className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm">Community Protection</p>
                    <p className="text-slate-400 text-xs">Help protect other users</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
                  <Lock className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm">Follow-up Contact</p>
                    <p className="text-slate-400 text-xs">We may reach out for more details</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Community Impact
              </h3>
              <div className="space-y-4">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
                  <p className="text-2xl font-bold text-cyan-400">20+</p>
                  <p className="text-sm text-slate-300">Reports Processed</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20">
                  <p className="text-2xl font-bold text-green-400">99.8%</p>
                  <p className="text-sm text-slate-300">Accuracy Rate</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20">
                  <p className="text-2xl font-bold text-purple-400">231</p>
                  <p className="text-sm text-slate-300">Threats Blocked</p>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Your Privacy
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span>End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span>Anonymous reporting option</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>Real-time threat updates</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI-powered analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}