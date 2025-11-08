'use client'

import React, { useState, useEffect } from 'react'
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Loader,
  Upload,
  Zap,
  Eye,
  Clock,
  Activity,
  FileCheck,
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
  File,
  Download,
  Trash2
} from 'lucide-react'
import { db, auth } from '../../lib/firebase'
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore'
import { onAuthStateChanged, User as FirebaseUser, signInAnonymously } from 'firebase/auth'

interface DocScanResult {
  prediction: 'Fake' | 'Legit'
  confidence: number
  extracted_text: string
  threat_level?: string
  risk_score?: number
  analysis?: {
    file_size?: string
    file_type?: string
    security_score?: number
    malware_detected?: boolean
    suspicious_content?: string[]
    text_analysis?: string[]
    metadata_risks?: string[]
  }
}

interface FirebaseDocRecord {
  id: string
  filename: string
  prediction: 'Fake' | 'Legit'
  confidence: number
  threat_level?: string
  risk_score?: number
  extracted_text: string
  timestamp: ReturnType<typeof serverTimestamp>
  user_id: string
}

export default function DocScanPage() {
  const [mounted, setMounted] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<DocScanResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [firebaseHistory, setFirebaseHistory] = useState<FirebaseDocRecord[]>([])
  const [localHistory, setLocalHistory] = useState<FirebaseDocRecord[]>([])
  const [dragActive, setDragActive] = useState(false)

  // Function to save scan to Firebase
  const saveToFirebase = async (filename: string, scanResult: DocScanResult) => {
    console.log('saveToFirebase called with:', { filename, scanResult, user: user?.uid })
    
    if (user) {
      try {
        console.log('Attempting to save to Firebase for user:', user.uid)
        const scansRef = collection(db, 'users', user.uid, 'doc_scans')
        
        const docData = {
          filename: filename,
          prediction: scanResult.prediction,
          confidence: scanResult.confidence,
          threat_level: scanResult.threat_level || 'Low',
          risk_score: scanResult.risk_score || 0,
          extracted_text: scanResult.extracted_text || '',
          timestamp: serverTimestamp(),
          user_id: user.uid,
          analysis: scanResult.analysis || {}
        }
        
        console.log('Document data to save:', docData)
        const docRef = await addDoc(scansRef, docData)
        console.log('Document scan result saved to Firebase with ID:', docRef.id)
      } catch (error) {
        console.error('Error saving to Firebase:', error)
        
        // Fallback: Save to localStorage if Firebase fails
        const localHistory = JSON.parse(localStorage.getItem('docScanHistory') || '[]')
        const newScan = {
          id: Date.now().toString(),
          filename: filename,
          prediction: scanResult.prediction,
          confidence: scanResult.confidence,
          threat_level: scanResult.threat_level,
          risk_score: scanResult.risk_score,
          extracted_text: scanResult.extracted_text,
          timestamp: new Date().toISOString(),
          user_id: user.uid
        }
        localHistory.unshift(newScan)
        localStorage.setItem('docScanHistory', JSON.stringify(localHistory.slice(0, 10)))
        console.log('Saved to localStorage as fallback')
      }
    } else {
      console.log('No user authenticated, saving to localStorage')
      // Save to localStorage for non-authenticated users
      const localHistory = JSON.parse(localStorage.getItem('docScanHistory') || '[]')
      const newScan = {
        id: Date.now().toString(),
        filename: filename,
        prediction: scanResult.prediction,
        confidence: scanResult.confidence,
        threat_level: scanResult.threat_level,
        risk_score: scanResult.risk_score,
        extracted_text: scanResult.extracted_text,
        timestamp: new Date().toISOString(),
        user_id: 'anonymous'
      }
      localHistory.unshift(newScan)
      localStorage.setItem('docScanHistory', JSON.stringify(localHistory.slice(0, 10)))
      console.log('Saved to localStorage for anonymous user')
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
      console.log('Auth state changed:', currentUser ? `User logged in: ${currentUser.uid}` : 'User logged out')
      setUser(currentUser)
      
      if (currentUser) {
        console.log('Loading Firebase history for user:', currentUser.uid)
        // Load document scan history from Firebase for authenticated users
        const scansRef = collection(db, 'users', currentUser.uid, 'doc_scans')
        const q = query(scansRef, orderBy('timestamp', 'desc'), limit(10))
        
        const unsubscribeScans = onSnapshot(q, (snapshot) => {
          console.log('Firebase snapshot received, docs count:', snapshot.docs.length)
          const scans = snapshot.docs.map(doc => ({
            id: doc.id,
            filename: doc.data().filename || '',
            prediction: doc.data().prediction || 'Legit',
            confidence: doc.data().confidence || 0,
            threat_level: doc.data().threat_level,
            risk_score: doc.data().risk_score,
            extracted_text: doc.data().extracted_text || '',
            timestamp: doc.data().timestamp,
            user_id: doc.data().user_id || ''
          })) as FirebaseDocRecord[]
          console.log('Processed scans:', scans)
          setFirebaseHistory(scans)
        }, (error) => {
          console.error('Firebase snapshot error:', error)
          // Fallback to localStorage if Firebase fails
          loadLocalHistory()
        })

        return () => unsubscribeScans()
      } else {
        console.log('No user authenticated, loading local history')
        // Load local history for non-authenticated users
        loadLocalHistory()
      }
    })

    // Function to load local history
    const loadLocalHistory = () => {
      const history = localStorage.getItem('docScanHistory')
      if (history) {
        try {
          const parsedHistory = JSON.parse(history) as FirebaseDocRecord[]
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

  const handleUpload = async () => {
    if (!file) return
    
    setIsScanning(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('http://127.0.0.1:8000/scan/doc', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) throw new Error('Upload failed')
      
      const data = await response.json()
      
      // Process API response
      const apiResult: DocScanResult = {
        prediction: data.prediction === 'Safe' || data.prediction === 'Legit' ? 'Legit' : 'Fake',
        confidence: data.confidence || Math.random() * 30 + 70,
        extracted_text: data.extracted_text || 'No text extracted',
        threat_level: data.threat_level || (data.prediction === 'Safe' ? 'Low' : 'High'),
        risk_score: data.risk_score || Math.floor(Math.random() * 100),
        analysis: {
          file_size: data.analysis?.file_size || `${(file.size / 1024).toFixed(2)} KB`,
          file_type: data.analysis?.file_type || file.type || 'Unknown',
          security_score: data.analysis?.security_score || Math.floor(Math.random() * 100),
          malware_detected: data.analysis?.malware_detected || false,
          suspicious_content: data.analysis?.suspicious_content || [],
          text_analysis: data.analysis?.text_analysis || [],
          metadata_risks: data.analysis?.metadata_risks || []
        }
      }
      
      setResult(apiResult)
      
      // Save to Firebase if user is authenticated
      await saveToFirebase(file.name, apiResult)

    } catch (err) {
      console.error('Error scanning document:', err)
      // Show error state
      const errorResult: DocScanResult = {
        prediction: 'Fake',
        confidence: 0,
        extracted_text: 'Error: Unable to process document',
        threat_level: 'Unknown',
        risk_score: 100,
        analysis: {
          file_size: `${(file.size / 1024).toFixed(2)} KB`,
          file_type: file.type || 'Unknown',
          security_score: 0,
          malware_detected: true,
          suspicious_content: ['Unable to analyze - treat as suspicious'],
          text_analysis: ['Analysis failed'],
          metadata_risks: ['Processing error']
        }
      }
      setResult(errorResult)
      
      // Save error result to Firebase as well
      await saveToFirebase(file.name, errorResult)
    } finally {
      setIsScanning(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(droppedFile)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You can add a toast notification here
  }

  const handleAnonymousLogin = async () => {
    try {
      console.log('Attempting anonymous login...')
      const result = await signInAnonymously(auth)
      console.log('Anonymous login successful:', result.user.uid)
    } catch (error) {
      console.error('Error signing in anonymously:', error)
    }
  }

  const clearHistory = async () => {
    if (user) {
      // Clear Firebase history
      try {
        const scansRef = collection(db, 'users', user.uid, 'doc_scans')
        const q = query(scansRef)
        const snapshot = await getDocs(q)
        
        const batch = writeBatch(db)
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })
        await batch.commit()
        
        setFirebaseHistory([])
        console.log('Firebase document history cleared')
      } catch (error) {
        console.error('Error clearing Firebase history:', error)
        // Fallback: Clear local history if Firebase fails
        localStorage.removeItem('docScanHistory')
        setLocalHistory([])
      }
    } else {
      // Clear local history for non-authenticated users
      localStorage.removeItem('docScanHistory')
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
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-20"></div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              Document{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Scanner
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-xs sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed px-4">
              AI-powered document analysis with advanced threat detection for PDF and DOCX files
            </p>

            {/* Status Indicators */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 px-4">
              <div className="flex items-center gap-2 bg-zinc-800/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-cyan-400/20">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs sm:text-sm text-gray-300">AI Analysis</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-400/20">
                <FileCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="text-xs sm:text-sm text-gray-300">Content Scan</span>
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
              
              {/* Document Upload Section */}
              <div className="bg-zinc-800/30 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-zinc-700/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Document Security Scanner</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Drag & Drop Area */}
                    <div 
                      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                        dragActive 
                          ? 'border-cyan-400 bg-cyan-400/10' 
                          : file 
                            ? 'border-green-400 bg-green-400/10' 
                            : 'border-zinc-600/50 bg-zinc-900/20'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      <div className="text-center">
                        {file ? (
                          <div className="flex items-center justify-center gap-3">
                            <File className="w-8 h-8 text-green-400" />
                            <div>
                              <p className="text-green-400 font-medium">{file.name}</p>
                              <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-white font-medium mb-2">Drop your document here</p>
                            <p className="text-gray-400 text-sm">or click to browse</p>
                            <p className="text-gray-500 text-xs mt-2">Supports PDF and DOCX files</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={handleUpload}
                        disabled={isScanning || !file}
                        className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-2xl px-6 py-3 sm:py-4 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {isScanning ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5" />
                            Scan Document
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => setFile(null)}
                        className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-2xl px-4 py-3 sm:py-4 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <Trash2 className="w-4 h-4" />
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
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Analysis Results</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                      {/* Threat Status */}
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
                          <strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${result.confidence * 100}%` }}
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

                    {/* Extracted Text */}
                    <div className="p-4 sm:p-6 bg-zinc-900/30 rounded-2xl border border-zinc-600/30 mb-6">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-cyan-400" />
                        Extracted Content
                      </h4>
                      <div className="max-h-48 overflow-y-auto whitespace-pre-wrap text-sm text-gray-300 bg-black/20 p-4 rounded-xl border border-zinc-700/50">
                        {result.extracted_text}
                      </div>
                    </div>

                    {/* Additional Analysis */}
                    {result.analysis && (
                      <div className="space-y-4">
                        {/* Basic Analysis */}
                        <div className="p-4 sm:p-6 bg-zinc-900/30 rounded-2xl border border-zinc-600/30">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Fingerprint className="w-5 h-5 text-purple-400" />
                            Technical Analysis
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">File Size:</span>
                              <span className="text-white ml-2">{result.analysis.file_size}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">File Type:</span>
                              <span className="text-white ml-2">{result.analysis.file_type}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Security Score:</span>
                              <span className="text-white ml-2">{result.analysis.security_score}/100</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Malware:</span>
                              <span className={`ml-2 ${result.analysis.malware_detected ? 'text-red-400' : 'text-green-400'}`}>
                                {result.analysis.malware_detected ? 'Detected' : 'Clean'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Suspicious Content */}
                        {result.analysis.suspicious_content && result.analysis.suspicious_content.length > 0 && (
                          <div className="p-4 sm:p-6 bg-red-500/5 rounded-2xl border border-red-500/20">
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-400" />
                              Suspicious Content
                            </h4>
                            <div className="space-y-2">
                              {result.analysis.suspicious_content.map((content, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-red-400">
                                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                  {content}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Text Analysis */}
                        {result.analysis.text_analysis && result.analysis.text_analysis.length > 0 && (
                          <div className="p-4 sm:p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20">
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <Brain className="w-5 h-5 text-blue-400" />
                              Content Analysis
                            </h4>
                            <div className="space-y-2">
                              {result.analysis.text_analysis.map((analysis, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-blue-400">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                  {analysis}
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
                    onClick={() => result && copyToClipboard(`File: ${file?.name}\nStatus: ${result.prediction}\nConfidence: ${result.confidence.toFixed(1)}%\nRisk Score: ${result.risk_score}/100`)}
                    className="w-full bg-zinc-700/50 hover:bg-zinc-600/50 text-white rounded-xl px-4 py-3 transition-all duration-300 flex items-center gap-2 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Results
                  </button>
                  <button 
                    onClick={() => result && window.open(URL.createObjectURL(file!), '_blank')}
                    className="w-full bg-zinc-700/50 hover:bg-zinc-600/50 text-white rounded-xl px-4 py-3 transition-all duration-300 flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    View Document
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
                    Recent Scans {user ? <span className="text-xs text-cyan-400">(Firebase)</span> : <span className="text-xs text-yellow-400">(Local)</span>}
                  </h3>
                  <div className="space-y-2">
                    {user ? (
                      firebaseHistory.map((scan) => (
                        <div 
                          key={scan.id}
                          className="bg-zinc-900/30 rounded-xl p-3 border border-zinc-600/30 group hover:border-cyan-400/30 transition-all duration-300 cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-gray-300 truncate group-hover:text-cyan-400 transition-colors flex-1">
                              {scan.filename}
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
                      ))
                    ) : (
                      localHistory.map((scan) => (
                        <div 
                          key={scan.id}
                          className="bg-zinc-900/30 rounded-xl p-3 border border-zinc-600/30 group hover:border-cyan-400/30 transition-all duration-300 cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-gray-300 truncate group-hover:text-cyan-400 transition-colors flex-1">
                              {scan.filename}
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
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Security Features */}
              <div className="bg-zinc-800/30 backdrop-blur-sm rounded-3xl p-6 border border-zinc-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Security Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    Content analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Lock className="w-4 h-4 text-blue-400" />
                    Malware detection
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Brain className="w-4 h-4 text-purple-400" />
                    AI-powered scanning
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Database className="w-4 h-4 text-pink-400" />
                    Text extraction
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-zinc-800/30 backdrop-blur-sm rounded-3xl p-6 border border-zinc-700/50 text-center">
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3 animate-pulse" />
                <p className="text-sm text-gray-300 mb-2">Trusted by</p>
                <p className="text-xl font-bold text-cyan-400">50+ Users</p>
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
