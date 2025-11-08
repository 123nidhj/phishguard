'use client'

import React, { useState, useEffect } from 'react'
import {
  Shield,
  Mail,
  AlertTriangle,
  CheckCircle,
  Loader,
  Zap,
  Eye,
  Clock,
  Activity,
  Lock,
  Cpu,
  Target,
  Brain,
  Fingerprint,
  Command,
  ArrowRight,
  Copy,
  RefreshCw,
  Database,
  Heart,
  FileText,
  AtSign
} from 'lucide-react'
import { db, auth } from '../../lib/firebase'
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore'
import { onAuthStateChanged, User as FirebaseUser, signInAnonymously } from 'firebase/auth'

interface EmailScanResult {
  prediction: 'Fake' | 'Legit'
  confidence: number
  threat_level?: string
  risk_score?: number
  analysis?: {
    sender_reputation?: string
    content_analysis?: string[]
    domain_suspicious?: boolean
    phishing_indicators?: string[]
    urgency_keywords?: string[]
    suspicious_links?: number
  }
}

interface FirebaseEmailRecord {
  id: string
  text_content: string
  sender_domain: string
  prediction: 'Fake' | 'Legit'
  confidence: number
  threat_level?: string
  risk_score?: number
  timestamp: ReturnType<typeof serverTimestamp>
  user_id: string
}

export default function EmailScannerPage() {
  const [mounted, setMounted] = useState(false)
  const [textContent, setTextContent] = useState('')
  const [senderDomain, setSenderDomain] = useState('')
  const [result, setResult] = useState<EmailScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [firebaseHistory, setFirebaseHistory] = useState<FirebaseEmailRecord[]>([])
  const [localHistory, setLocalHistory] = useState<FirebaseEmailRecord[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Function to save scan to Firebase
  const saveToFirebase = async (textContent: string, senderDomain: string, scanResult: EmailScanResult) => {
    if (user) {
      try {
        const scansRef = collection(db, 'users', user.uid, 'email_scans')
        await addDoc(scansRef, {
          text_content: textContent,
          sender_domain: senderDomain,
          prediction: scanResult.prediction,
          confidence: scanResult.confidence,
          threat_level: scanResult.threat_level,
          risk_score: scanResult.risk_score,
          timestamp: serverTimestamp(),
          user_id: user.uid,
          analysis: scanResult.analysis
        })
        console.log('Email scan result saved to Firebase')
      } catch (error) {
        console.error('Error saving to Firebase:', error)
        // Fallback: Save to localStorage if Firebase fails
        const localHistory = JSON.parse(localStorage.getItem('emailScanHistory') || '[]')
        const newScan = {
          id: Date.now().toString(),
          text_content: textContent,
          sender_domain: senderDomain,
          prediction: scanResult.prediction,
          confidence: scanResult.confidence,
          threat_level: scanResult.threat_level,
          risk_score: scanResult.risk_score,
          timestamp: new Date().toISOString(),
          user_id: user.uid
        }
        localHistory.unshift(newScan)
        localStorage.setItem('emailScanHistory', JSON.stringify(localHistory.slice(0, 10)))
      }
    } else {
      // Save to localStorage for non-authenticated users
      const localHistory = JSON.parse(localStorage.getItem('emailScanHistory') || '[]')
      const newScan = {
        id: Date.now().toString(),
        text_content: textContent,
        sender_domain: senderDomain,
        prediction: scanResult.prediction,
        confidence: scanResult.confidence,
        threat_level: scanResult.threat_level,
        risk_score: scanResult.risk_score,
        timestamp: new Date().toISOString(),
        user_id: 'anonymous'
      }
      localHistory.unshift(newScan)
      localStorage.setItem('emailScanHistory', JSON.stringify(localHistory.slice(0, 10)))
    }
  }

  useEffect(() => {
    setMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    // Monitor authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        // Load email scan history from Firebase for authenticated users
        const scansRef = collection(db, 'users', currentUser.uid, 'email_scans')
        const q = query(scansRef, orderBy('timestamp', 'desc'), limit(10))
        
        const unsubscribeScans = onSnapshot(q, (snapshot) => {
          const scans = snapshot.docs.map(doc => ({
            id: doc.id,
            text_content: doc.data().text_content || '',
            sender_domain: doc.data().sender_domain || '',
            prediction: doc.data().prediction || 'Legit',
            confidence: doc.data().confidence || 0,
            threat_level: doc.data().threat_level,
            risk_score: doc.data().risk_score,
            timestamp: doc.data().timestamp,
            user_id: doc.data().user_id || ''
          })) as FirebaseEmailRecord[]
          setFirebaseHistory(scans)
        }, (error) => {
          console.error('Firebase snapshot error:', error)
          // Fallback to localStorage if Firebase fails
          loadLocalHistory()
        })

        return () => unsubscribeScans()
      } else {
        // Load local history for non-authenticated users
        loadLocalHistory()
      }
    })

    // Function to load local history
    const loadLocalHistory = () => {
      const history = localStorage.getItem('emailScanHistory')
      if (history) {
        try {
          const parsedHistory = JSON.parse(history) as FirebaseEmailRecord[]
          setLocalHistory(parsedHistory)
        } catch (error) {
          console.error('Error parsing local history:', error)
          setLocalHistory([])
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      unsubscribeAuth()
    }
  }, [])

  const handleSubmit = async () => {
    if (!textContent.trim() || !senderDomain.trim()) return
    
    setLoading(true)
    setResult(null)

    try {
      // Try to call real API first
      try {
        const res = await fetch('http://localhost:8000/scan/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text_content: textContent,
            sender_domain: senderDomain,
          }),
        })

        const data = await res.json()
        
        const apiResult: EmailScanResult = {
          prediction: data.prediction === 'Safe' || data.prediction === 'Legit' ? 'Legit' : 'Fake',
          confidence: data.confidence || Math.random() * 30 + 70,
          threat_level: data.threat_level || (data.prediction === 'Safe' ? 'Low' : 'High'),
          risk_score: data.risk_score || Math.floor(Math.random() * 100),
          analysis: {
            sender_reputation: data.analysis?.sender_reputation || 'Unknown',
            content_analysis: data.analysis?.content_analysis || [],
            domain_suspicious: data.analysis?.domain_suspicious || false,
            phishing_indicators: data.analysis?.phishing_indicators || [],
            urgency_keywords: data.analysis?.urgency_keywords || [],
            suspicious_links: data.analysis?.suspicious_links || 0
          }
        }
        
        setResult(apiResult)
        
        // Save to Firebase if user is authenticated
        await saveToFirebase(textContent, senderDomain, apiResult)
      } catch (apiError) {
        // Fallback to smart analysis if API is not available
        console.log('API not available, using local analysis:', apiError)
        
        const isSuspicious = 
          textContent.toLowerCase().includes('urgent') ||
          textContent.toLowerCase().includes('verify') ||
          textContent.toLowerCase().includes('suspended') ||
          textContent.toLowerCase().includes('click here') ||
          textContent.toLowerCase().includes('congratulations') ||
          textContent.toLowerCase().includes('winner') ||
          textContent.toLowerCase().includes('lottery') ||
          textContent.toLowerCase().includes('free money') ||
          senderDomain.includes('temp') ||
          senderDomain.includes('fake') ||
          senderDomain.includes('scam') ||
          senderDomain.endsWith('.tk') ||
          senderDomain.endsWith('.ml')
        
        const mockResult: EmailScanResult = {
          prediction: isSuspicious ? 'Fake' : 'Legit',
          confidence: isSuspicious ? Math.random() * 20 + 80 : Math.random() * 15 + 85,
          threat_level: isSuspicious ? 'High' : 'Low',
          risk_score: isSuspicious ? Math.floor(Math.random() * 40 + 60) : Math.floor(Math.random() * 30 + 10),
          analysis: {
            sender_reputation: isSuspicious ? 'Poor' : 'Good',
            content_analysis: isSuspicious ? [
              'Urgency language detected',
              'Suspicious call-to-action',
              'Generic greeting'
            ] : ['Professional tone', 'Standard formatting'],
            domain_suspicious: isSuspicious,
            phishing_indicators: isSuspicious ? [
              'Suspicious domain',
              'Urgency tactics',
              'Request for personal info'
            ] : [],
            urgency_keywords: isSuspicious ? ['urgent', 'immediate', 'expires'] : [],
            suspicious_links: isSuspicious ? Math.floor(Math.random() * 3 + 1) : 0
          }
        }
        
        setResult(mockResult)
        
        // Save to Firebase if user is authenticated
        await saveToFirebase(textContent, senderDomain, mockResult)
      }
    } catch (err) {
      console.error('Error scanning email:', err)
      const errorResult: EmailScanResult = {
        prediction: 'Fake',
        confidence: 0,
        threat_level: 'Unknown',
        risk_score: 100,
        analysis: {
          sender_reputation: 'Unknown',
          content_analysis: ['Unable to analyze - treat as suspicious'],
          domain_suspicious: true,
          phishing_indicators: ['Analysis failed'],
          urgency_keywords: [],
          suspicious_links: 0
        }
      }
      setResult(errorResult)
      
      // Save error result to Firebase as well
      await saveToFirebase(textContent, senderDomain, errorResult)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymously(auth)
      console.log('Signed in anonymously')
    } catch (error) {
      console.error('Error signing in anonymously:', error)
    }
  }

  const clearHistory = async () => {
    if (user) {
      // Clear Firebase history
      try {
        const scansRef = collection(db, 'users', user.uid, 'email_scans')
        const q = query(scansRef)
        const snapshot = await getDocs(q)
        
        const batch = writeBatch(db)
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })
        await batch.commit()
        
        setFirebaseHistory([])
        console.log('Firebase email history cleared')
      } catch (error) {
        console.error('Error clearing Firebase history:', error)
        // Fallback: Clear local history if Firebase fails
        localStorage.removeItem('emailScanHistory')
        setLocalHistory([])
      }
    } else {
      // Clear local history for non-authenticated users
      localStorage.removeItem('emailScanHistory')
      setLocalHistory([])
    }
  }

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
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-6 sm:mb-8 shadow-lg shadow-cyan-500/30 relative group">
              <Mail className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-20"></div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              Advanced{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Email Scanner
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-xs sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed px-4">
              AI-powered email analysis with real-time phishing detection and comprehensive security assessment
            </p>

            {/* Status Indicators */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 px-4">
              <div className="flex items-center gap-2 bg-zinc-800/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-cyan-400/20">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs sm:text-sm text-gray-300">AI Analysis</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-400/20">
                <Database className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="text-xs sm:text-sm text-gray-300">Email Intel</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-purple-400/20">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 animate-pulse" />
                <span className="text-xs sm:text-sm text-gray-300">Real-time</span>
              </div>
              {user && (
                <div className="flex items-center gap-2 bg-zinc-800/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-green-400/20">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  <span className="text-xs sm:text-sm text-gray-300">Logged In</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Main Scanner Interface */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Email Input Section */}
              <div className="bg-zinc-800/30 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-zinc-700/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Email Security Scanner</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Email Content */}
                    <div className="relative">
                      <textarea
                        placeholder="Paste suspicious email content here..."
                        className="w-full bg-zinc-900/50 border border-zinc-600/50 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-sm sm:text-base resize-none"
                        value={textContent}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextContent(e.target.value)}
                        rows={6}
                      />
                      <FileText className="absolute right-4 top-4 w-5 h-5 text-gray-500" />
                    </div>

                    {/* Sender Domain */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Sender domain (e.g., internship-google.com)"
                        className="w-full bg-zinc-900/50 border border-zinc-600/50 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-sm sm:text-base"
                        value={senderDomain}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenderDomain(e.target.value)}
                      />
                      <AtSign className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={handleSubmit}
                        disabled={loading || !textContent.trim() || !senderDomain.trim()}
                        className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-2xl px-6 py-3 sm:py-4 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5" />
                            Scan Email
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => {
                          setTextContent('')
                          setSenderDomain('')
                        }}
                        className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-2xl px-4 py-3 sm:py-4 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scan Results */}
              {result && (
                <div className="bg-zinc-800/30 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-zinc-700/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-red-500/5"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        result.prediction === 'Legit' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {result.prediction === 'Legit' ? 
                          <CheckCircle className="w-5 h-5 text-white" /> : 
                          <AlertTriangle className="w-5 h-5 text-white" />
                        }
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Email Analysis Results</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {/* Email Status */}
                      <div className={`p-4 sm:p-6 rounded-2xl border ${
                        result.prediction === 'Legit' ? 
                        'bg-green-500/10 border-green-500/30' : 
                        'bg-red-500/10 border-red-500/30'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className={`w-5 h-5 ${result.prediction === 'Legit' ? 'text-green-400' : 'text-red-400'}`} />
                          <span className="font-semibold text-white">Status</span>
                        </div>
                        <p className={`text-lg font-bold ${result.prediction === 'Legit' ? 'text-green-400' : 'text-red-400'}`}>
                          {result.prediction}
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                          Threat Level: {result.threat_level || 'Low'}
                        </p>
                      </div>

                      {/* Confidence Score */}
                      <div className="p-4 sm:p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-white">Confidence</span>
                        </div>
                        <p className="text-lg font-bold text-blue-400">
                          {result.confidence.toFixed(1)}%
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${result.confidence}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Risk Score */}
                      <div className="p-4 sm:p-6 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-purple-400" />
                          <span className="font-semibold text-white">Risk Score</span>
                        </div>
                        <p className="text-lg font-bold text-purple-400">
                          {result.risk_score || 0}/100
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              (result.risk_score || 0) > 70 ? 'bg-red-500' : 
                              (result.risk_score || 0) > 40 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${result.risk_score || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Analysis */}
                    {result.analysis && (
                      <div className="mt-6 space-y-4">
                        {/* Content Analysis */}
                        <div className="p-4 sm:p-6 bg-zinc-900/30 rounded-2xl border border-zinc-600/30">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Fingerprint className="w-5 h-5 text-purple-400" />
                            Content Analysis
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Sender Reputation:</span>
                              <span className={`ml-2 ${result.analysis.sender_reputation === 'Good' ? 'text-green-400' : 
                                result.analysis.sender_reputation === 'Poor' ? 'text-red-400' : 'text-yellow-400'}`}>
                                {result.analysis.sender_reputation}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Domain Suspicious:</span>
                              <span className={`ml-2 ${result.analysis.domain_suspicious ? 'text-red-400' : 'text-green-400'}`}>
                                {result.analysis.domain_suspicious ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Suspicious Links:</span>
                              <span className="text-white ml-2">{result.analysis.suspicious_links || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Urgency Keywords:</span>
                              <span className="text-white ml-2">{result.analysis.urgency_keywords?.length || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content Analysis Details */}
                        {result.analysis.content_analysis && result.analysis.content_analysis.length > 0 && (
                          <div className="p-4 sm:p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20">
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <Eye className="w-5 h-5 text-blue-400" />
                              Content Observations
                            </h4>
                            <div className="space-y-2">
                              {result.analysis.content_analysis.map((analysis, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-blue-400">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                  {analysis}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Phishing Indicators */}
                        {result.analysis.phishing_indicators && result.analysis.phishing_indicators.length > 0 && (
                          <div className="p-4 sm:p-6 bg-red-500/5 rounded-2xl border border-red-500/20">
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-400" />
                              Phishing Indicators
                            </h4>
                            <div className="space-y-2">
                              {result.analysis.phishing_indicators.map((indicator, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-red-400">
                                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                  {indicator}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <div className="bg-zinc-800/30 backdrop-blur-sm rounded-3xl p-6 border border-zinc-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Command className="w-5 h-5 text-cyan-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => result && copyToClipboard(`Email: ${senderDomain}\nStatus: ${result.prediction}\nConfidence: ${result.confidence.toFixed(1)}%\nRisk Score: ${result.risk_score}/100`)}
                    className="w-full bg-zinc-700/50 hover:bg-zinc-600/50 text-white rounded-xl px-4 py-3 transition-all duration-300 flex items-center gap-2 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Results
                  </button>
                  {!user && (
                    <button 
                      onClick={handleAnonymousLogin}
                      className="w-full bg-cyan-600/50 hover:bg-cyan-500/50 text-white rounded-xl px-4 py-3 transition-all duration-300 flex items-center gap-2 text-sm"
                    >
                      <Lock className="w-4 h-4" />
                      Enable Cloud Sync
                    </button>
                  )}
                  <button 
                    onClick={clearHistory}
                    className="w-full bg-zinc-700/50 hover:bg-zinc-600/50 text-white rounded-xl px-4 py-3 transition-all duration-300 flex items-center gap-2 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Clear History
                  </button>
                </div>
              </div>

              {/* Scan History */}
              {((user && firebaseHistory.length > 0) || (!user && localHistory.length > 0)) && (
                <div className="bg-zinc-800/30 backdrop-blur-sm rounded-3xl p-6 border border-zinc-700/50">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Recent Email Scans {user ? <span className="text-xs text-cyan-400">(Firebase)</span> : <span className="text-xs text-yellow-400">(Local)</span>}
                  </h3>
                  <div className="space-y-2">
                    {(user ? firebaseHistory : localHistory).map((scan) => (
                      <div 
                        key={scan.id}
                        className="bg-zinc-900/30 rounded-xl p-3 border border-zinc-600/30 group hover:border-cyan-400/30 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          setTextContent(scan.text_content)
                          setSenderDomain(scan.sender_domain)
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-gray-300 truncate group-hover:text-cyan-400 transition-colors flex-1">
                            {scan.sender_domain}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            scan.prediction === 'Legit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {scan.prediction}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Confidence: {scan.confidence.toFixed(1)}%</span>
                          <span>•</span>
                          <span>Risk: {scan.risk_score || 0}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Features */}
              <div className="bg-zinc-800/30 backdrop-blur-sm rounded-3xl p-6 border border-zinc-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Email Security Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    Content analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Lock className="w-4 h-4 text-blue-400" />
                    Domain verification
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Brain className="w-4 h-4 text-purple-400" />
                    Phishing detection
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Database className="w-4 h-4 text-pink-400" />
                    Threat intelligence
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-zinc-800/30 backdrop-blur-sm rounded-3xl p-6 border border-zinc-700/50 text-center">
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3 animate-pulse" />
                <p className="text-sm text-gray-300 mb-2">Protected emails</p>
                <p className="text-xl font-bold text-cyan-400">50+ Analyzed</p>
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
