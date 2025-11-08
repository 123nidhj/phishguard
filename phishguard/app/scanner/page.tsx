'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { 
  Mail, 
  Globe, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Zap,
  Eye,
  ExternalLink,
  History,
  TrendingUp,
  Lock,
  Unlock,
  Info,
  Upload,
  FileText,
  User,
  Clock,
  Target,
  Brain,
  Scan
} from 'lucide-react'

interface ScanResult {
  overall: 'safe' | 'suspicious' | 'dangerous'
  score: number
  urlAnalysis: {
    isSuspicious: boolean
    suspiciousKeywords: string[]
    hasHttps: boolean
    domainAge: 'new' | 'established' | 'unknown'
    reputation: 'good' | 'unknown' | 'bad'
    redirectChain?: string[]
  }
  emailAnalysis: {
    isSuspicious: boolean
    domainReputation: 'good' | 'unknown' | 'bad'
    isTyposquatting: boolean
    isCommonProvider: boolean
    suspiciousPatterns: string[]
    hasAttachments?: boolean
  }
  contentAnalysis?: {
    urgencyLevel: 'low' | 'medium' | 'high'
    hasPersonalInfoRequest: boolean
    hasFinancialRequest: boolean
    hasThreatLanguage: boolean
    grammarScore: number
    sentimentScore: number
  }
  recommendations: string[]
}

interface EmailDocument {
  from: string
  subject: string
  body: string
  attachments?: string[]
}

export default function ScannerPage() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [emailFrom, setEmailFrom] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [scanMode, setScanMode] = useState<'quick' | 'detailed' | 'upload'>('quick')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [scanHistory, setScanHistory] = useState<Array<{ url: string; email: string; result: ScanResult; timestamp: Date }>>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // Enhanced phishing detection algorithms
  const analyzeUrl = (url: string) => {
    const suspiciousKeywords = [
      'free', 'win', 'offer', 'login', 'click', 'verify', 'gift', 'bank', 
      'account', 'security', 'update', 'urgent', 'limited', 'expire',
      'confirm', 'validate', 'suspend', 'unlock', 'claim', 'bonus',
      'prize', 'congratulations', 'selected', 'winner', 'immediate'
    ]
    
    const highRiskKeywords = [
      'paypal-', 'amazon-', 'apple-', 'microsoft-', 'google-', 
      'facebook-', 'instagram-', 'twitter-', 'linkedin-',
      'secure-', 'update-', 'verification-', 'support-'
    ]

    const shorteners = ['bit.ly', 'tinyurl.com', 'short.link', 'ow.ly', 't.co']

    const lowerUrl = url.toLowerCase()
    const foundKeywords = suspiciousKeywords.filter(keyword => lowerUrl.includes(keyword))
    const hasHighRiskKeywords = highRiskKeywords.some(keyword => lowerUrl.includes(keyword))
    const isShortened = shorteners.some(shortener => lowerUrl.includes(shortener))
    
    return {
      isSuspicious: foundKeywords.length > 0 || hasHighRiskKeywords || isShortened,
      suspiciousKeywords: foundKeywords,
      hasHttps: url.startsWith('https://'),
      domainAge: 'unknown' as const,
      reputation: hasHighRiskKeywords ? 'bad' as const : isShortened ? 'unknown' as const : 'good' as const,
      redirectChain: isShortened ? ['Shortened URL - may redirect'] : undefined
    }
  }

  const analyzeEmail = (email: string) => {
    const commonProviders = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'mail.com']
    const suspiciousPatterns = ['support', 'help', 'admin', 'secure', 'info', 'noreply', 'service', 'team', 'hr']
    const legitimateDomains = ['paypal.com', 'amazon.com', 'apple.com', 'microsoft.com', 'google.com']
    
    const [localPart, domain] = email.toLowerCase().split('@')
    const isCommonProvider = commonProviders.includes(domain)
    const foundPatterns = suspiciousPatterns.filter(pattern => localPart.includes(pattern))
    
    // Check for typosquatting
    const isTyposquatting = legitimateDomains.some(legitDomain => {
      const similarity = calculateSimilarity(domain, legitDomain)
      return similarity > 0.7 && similarity < 1
    })

    return {
      isSuspicious: (isCommonProvider && foundPatterns.length > 0) || isTyposquatting,
      domainReputation: legitimateDomains.includes(domain) ? 'good' as const : 'unknown' as const,
      isTyposquatting,
      isCommonProvider,
      suspiciousPatterns: foundPatterns
    }
  }

  const analyzeEmailContent = (subject: string, body: string, from: string) => {
    const urgencyWords = ['urgent', 'immediate', 'asap', 'expires', 'limited time', 'act now', 'hurry']
    const threatWords = ['suspend', 'terminate', 'block', 'freeze', 'legal action', 'consequences']
    const personalInfoWords = ['ssn', 'social security', 'password', 'pin', 'account number', 'credit card']
    const financialWords = ['payment', 'refund', 'transaction', 'billing', 'invoice', 'tax', 'irs']

    const fullText = `${subject} ${body}`.toLowerCase()
    
    const urgencyCount = urgencyWords.filter(word => fullText.includes(word)).length
    const threatCount = threatWords.filter(word => fullText.includes(word)).length
    const personalInfoCount = personalInfoWords.filter(word => fullText.includes(word)).length
    const financialCount = financialWords.filter(word => fullText.includes(word)).length

    // Grammar analysis (simple check for common mistakes)
    const grammarIssues = [
      /\b(recieve|recive)\b/gi, // receive misspelled
      /\b(seperate|seprate)\b/gi, // separate misspelled
      /\b(occured|ocurred)\b/gi, // occurred misspelled
      /[.!?]\s*[a-z]/g, // lowercase after punctuation
      /\s{2,}/g // multiple spaces
    ]
    
    const grammarErrors = grammarIssues.reduce((count, pattern) => {
      const matches = fullText.match(pattern)
      return count + (matches ? matches.length : 0)
    }, 0)

    const grammarScore = Math.max(0, 100 - (grammarErrors * 10))

    return {
      urgencyLevel: urgencyCount >= 3 ? 'high' as const : urgencyCount >= 1 ? 'medium' as const : 'low' as const,
      hasPersonalInfoRequest: personalInfoCount > 0,
      hasFinancialRequest: financialCount > 0,
      hasThreatLanguage: threatCount > 0,
      grammarScore,
      sentimentScore: threatCount > 0 ? 20 : urgencyCount > 0 ? 40 : 80
    }
  }

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = getEditDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  const getEditDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // In a real app, you'd parse the email file here
      // For demo, we'll simulate parsing
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        // Simple parsing simulation
        const fromMatch = content.match(/From:\s*(.+)/i)
        const subjectMatch = content.match(/Subject:\s*(.+)/i)
        const bodyMatch = content.match(/Body:\s*([\s\S]+)/i)
        
        if (fromMatch) setEmailFrom(fromMatch[1].trim())
        if (subjectMatch) setEmailSubject(subjectMatch[1].trim())
        if (bodyMatch) setEmailBody(bodyMatch[1].trim())
      }
      reader.readAsText(file)
      toast.success('📧 Email file uploaded successfully!')
    }
  }

  const handleScan = async () => {
    if (scanMode === 'quick' && (!url || !email)) {
      toast.warning('⚠️ Please enter both Email and URL.')
      return
    }
    if (scanMode === 'detailed' && (!emailFrom || !emailSubject || !emailBody)) {
      toast.warning('⚠️ Please fill all email details.')
      return
    }
    if (scanMode === 'upload' && !uploadedFile) {
      toast.warning('⚠️ Please upload an email file.')
      return
    }

    setIsScanning(true)
    setScanResult(null)

    // Simulate real scanning delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      let urlAnalysis, emailAnalysis, contentAnalysis
      
      if (scanMode === 'quick') {
        urlAnalysis = analyzeUrl(url)
        emailAnalysis = analyzeEmail(email)
      } else {
        // For detailed and upload modes
        const currentEmail = scanMode === 'upload' ? emailFrom : email || emailFrom
        const currentUrl = url || 'No URL provided'
        
        urlAnalysis = url ? analyzeUrl(url) : {
          isSuspicious: false,
          suspiciousKeywords: [],
          hasHttps: false,
          domainAge: 'unknown' as const,
          reputation: 'unknown' as const
        }
        
        emailAnalysis = analyzeEmail(currentEmail)
        contentAnalysis = analyzeEmailContent(emailSubject, emailBody, currentEmail)
      }

      // Calculate overall risk score (0-100)
      let score = 0
      if (urlAnalysis.isSuspicious) score += 30
      if (emailAnalysis.isSuspicious) score += 25
      if (!urlAnalysis.hasHttps && url) score += 10
      if (urlAnalysis.reputation === 'bad') score += 15
      if (emailAnalysis.isTyposquatting) score += 20

      // Add content analysis scoring
      if (contentAnalysis) {
        if (contentAnalysis.urgencyLevel === 'high') score += 20
        if (contentAnalysis.hasPersonalInfoRequest) score += 15
        if (contentAnalysis.hasFinancialRequest) score += 10
        if (contentAnalysis.hasThreatLanguage) score += 15
        if (contentAnalysis.grammarScore < 60) score += 10
      }

      // Determine overall result
      let overall: 'safe' | 'suspicious' | 'dangerous'
      if (score >= 70) overall = 'dangerous'
      else if (score >= 35) overall = 'suspicious'
      else overall = 'safe'

      // Generate recommendations
      const recommendations = []
      if (!urlAnalysis.hasHttps && url) recommendations.push('URL lacks HTTPS encryption')
      if (urlAnalysis.suspiciousKeywords.length > 0) {
        recommendations.push(`Contains suspicious keywords: ${urlAnalysis.suspiciousKeywords.join(', ')}`)
      }
      if (emailAnalysis.isTyposquatting) recommendations.push('Email domain appears to be typosquatting')
      if (emailAnalysis.suspiciousPatterns.length > 0) {
        recommendations.push(`Email uses suspicious patterns: ${emailAnalysis.suspiciousPatterns.join(', ')}`)
      }
      if (contentAnalysis?.urgencyLevel === 'high') {
        recommendations.push('Email uses high-pressure urgency tactics')
      }
      if (contentAnalysis?.hasPersonalInfoRequest) {
        recommendations.push('Email requests personal information - major red flag')
      }
      if (contentAnalysis?.hasThreatLanguage) {
        recommendations.push('Email contains threatening language')
      }
      if (contentAnalysis?.grammarScore && contentAnalysis.grammarScore < 60) {
        recommendations.push('Poor grammar and spelling detected')
      }
      if (overall === 'safe') recommendations.push('No immediate threats detected')

      const result: ScanResult = {
        overall,
        score,
        urlAnalysis,
        emailAnalysis,
        contentAnalysis,
        recommendations
      }

      setScanResult(result)
      setScanHistory(prev => [{
        url: url || 'Email content scan',
        email: scanMode === 'quick' ? email : emailFrom,
        result,
        timestamp: new Date()
      }, ...prev.slice(0, 4)]) // Keep last 5 scans

      // Show appropriate toast
      if (overall === 'dangerous') {
        toast.error('🚨 HIGH RISK: This appears to be a phishing attempt!')
      } else if (overall === 'suspicious') {
        toast.warning('⚠️ SUSPICIOUS: Exercise caution with this content')
      } else {
        toast.success('✅ SAFE: No immediate threats detected')
      }

    } catch (error) {
      toast.error('❌ Scan failed. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }

  const getRiskColor = (overall: string) => {
    switch (overall) {
      case 'dangerous': return 'text-red-400'
      case 'suspicious': return 'text-yellow-400'
      case 'safe': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskIcon = (overall: string) => {
    switch (overall) {
      case 'dangerous': return <XCircle className="w-6 h-6" />
      case 'suspicious': return <AlertTriangle className="w-6 h-6" />
      case 'safe': return <CheckCircle className="w-6 h-6" />
      default: return <Shield className="w-6 h-6" />
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            🛡️ Advanced Phishing Scanner
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-2">
            AI-powered analysis to detect phishing emails and malicious URLs with advanced content scanning
          </p>
        </div>

        {/* Scan Mode Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
          <button
            onClick={() => setScanMode('quick')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
              scanMode === 'quick'
                ? 'bg-cyan-500 text-black shadow-lg'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-2" />
            Quick Scan
          </button>
          <button
            onClick={() => setScanMode('detailed')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
              scanMode === 'detailed'
                ? 'bg-cyan-500 text-black shadow-lg'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <Brain className="w-4 h-4 inline mr-2" />
            Detailed Analysis
          </button>
          <button
            onClick={() => setScanMode('upload')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
              scanMode === 'upload'
                ? 'bg-cyan-500 text-black shadow-lg'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload Email
          </button>
        </div>

        {/* Main Scanner Card */}
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
                <Scan className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                {scanMode === 'quick' && 'Quick Scan'}
                {scanMode === 'detailed' && 'Detailed Email Analysis'}
                {scanMode === 'upload' && 'Upload Email Document'}
              </h2>

              {scanMode === 'quick' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-cyan-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="email"
                      placeholder="Sender's email (e.g., hr@internshippartner.xyz)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-zinc-400"
                    />
                  </div>

                  <div className="relative">
                    <Globe className="absolute left-3 top-3 text-cyan-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Suspicious URL (e.g., http://bit.ly/job-verification-now)"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-zinc-400"
                    />
                  </div>
                </div>
              )}

              {scanMode === 'detailed' && (
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-cyan-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="email"
                      placeholder="From: hr@internshippartner.xyz"
                      value={emailFrom}
                      onChange={(e) => setEmailFrom(e.target.value)}
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-zinc-400"
                    />
                  </div>

                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-cyan-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Subject: Selected for Internship – Urgent Action Needed!"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-zinc-400"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-cyan-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <textarea
                      placeholder="Email Body: Congratulations! You've been selected for our internship program. Click the link below to confirm your position immediately..."
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      rows={4}
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-zinc-400 resize-none"
                    />
                  </div>

                  <div className="relative">
                    <Globe className="absolute left-3 top-3 text-cyan-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="URL (optional): http://bit.ly/job-verification-now"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-zinc-400"
                    />
                  </div>
                </div>
              )}

              {scanMode === 'upload' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors">
                    <Upload className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <label className="block text-zinc-300 mb-2 cursor-pointer">
                      <span className="text-cyan-400 hover:text-cyan-300">Click to upload</span> your email file
                      <input
                        type="file"
                        accept=".txt,.eml,.msg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-zinc-500 text-sm">Supports .txt, .eml, .msg files</p>
                    {uploadedFile && (
                      <p className="text-green-400 text-sm mt-2">✓ {uploadedFile.name} uploaded</p>
                    )}
                  </div>

                  {emailFrom && (
                    <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                      <p className="text-zinc-300 text-sm"><span className="text-cyan-400">From:</span> {emailFrom}</p>
                      <p className="text-zinc-300 text-sm"><span className="text-cyan-400">Subject:</span> {emailSubject}</p>
                      <p className="text-zinc-300 text-sm"><span className="text-cyan-400">Body:</span> {emailBody.substring(0, 100)}...</p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleScan}
                disabled={
                  isScanning || 
                  (scanMode === 'quick' && (!url || !email)) ||
                  (scanMode === 'detailed' && (!emailFrom || !emailSubject || !emailBody)) ||
                  (scanMode === 'upload' && !uploadedFile)
                }
                className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
              >
                {isScanning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Analyzing Content...</span>
                    <span className="sm:hidden">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">
                      {scanMode === 'upload' ? 'Analyze Email Document' : 'Scan for Threats'}
                    </span>
                    <span className="sm:hidden">Scan</span>
                  </>
                )}
              </button>

              {/* Security Tips */}
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Info className="w-4 h-4 text-blue-400" />
                  Security Tips
                </h3>
                <ul className="text-zinc-300 text-xs sm:text-sm space-y-1.5">
                  <li>• Always verify sender identity through official channels</li>
                  <li>• Be suspicious of urgent requests for personal information</li>
                  <li>• Check for HTTPS encryption in URLs</li>
                  <li>• Never enter passwords on suspicious sites</li>
                  <li>• Look for grammar and spelling mistakes</li>
                </ul>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {scanResult ? (
                <>
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border ${
                      scanResult.overall === 'dangerous' 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : scanResult.overall === 'suspicious'
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-green-500/10 border-green-500/30'
                    }`}>
                      <div className={getRiskColor(scanResult.overall)}>
                        {getRiskIcon(scanResult.overall)}
                      </div>
                      <div className="text-left">
                        <div className={`font-semibold text-base sm:text-lg ${getRiskColor(scanResult.overall)}`}>
                          {scanResult.overall.toUpperCase()}
                        </div>
                        <div className="text-zinc-400 text-xs sm:text-sm">
                          Risk Score: {scanResult.score}/100
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Analysis */}
                  <div className="space-y-4">
                    {/* Content Analysis (for detailed/upload modes) */}
                    {scanResult.contentAnalysis && (
                      <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <Brain className="w-4 h-4 text-cyan-400" />
                          Content Analysis
                        </h3>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Urgency Level:</span>
                            <span className={`font-medium ${
                              scanResult.contentAnalysis.urgencyLevel === 'high' ? 'text-red-400' :
                              scanResult.contentAnalysis.urgencyLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {scanResult.contentAnalysis.urgencyLevel.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Grammar Score:</span>
                            <span className={`font-medium ${
                              scanResult.contentAnalysis.grammarScore < 60 ? 'text-red-400' :
                              scanResult.contentAnalysis.grammarScore < 80 ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {scanResult.contentAnalysis.grammarScore}/100
                            </span>
                          </div>
                          {scanResult.contentAnalysis.hasPersonalInfoRequest && (
                            <div className="text-red-300 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Requests personal information
                            </div>
                          )}
                          {scanResult.contentAnalysis.hasFinancialRequest && (
                            <div className="text-orange-300 flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              Contains financial requests
                            </div>
                          )}
                          {scanResult.contentAnalysis.hasThreatLanguage && (
                            <div className="text-red-300 flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Uses threatening language
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* URL Analysis */}
                    {(url || scanMode === 'quick') && (
                      <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <Globe className="w-4 h-4 text-cyan-400" />
                          URL Analysis
                        </h3>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            {scanResult.urlAnalysis.hasHttps ? (
                              <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                            ) : (
                              <Unlock className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
                            )}
                            <span className="text-zinc-300">
                              {scanResult.urlAnalysis.hasHttps ? 'HTTPS Secured' : 'No HTTPS encryption'}
                            </span>
                          </div>
                          {scanResult.urlAnalysis.suspiciousKeywords.length > 0 && (
                            <div className="text-orange-300 break-words">
                              <span className="font-medium">Suspicious keywords:</span> {scanResult.urlAnalysis.suspiciousKeywords.join(', ')}
                            </div>
                          )}
                          {scanResult.urlAnalysis.redirectChain && (
                            <div className="text-yellow-300">
                              <span className="font-medium">Warning:</span> {scanResult.urlAnalysis.redirectChain[0]}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Email Analysis */}
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                      <h3 className="text-white font-medium mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <Mail className="w-4 h-4 text-cyan-400" />
                        Email Analysis
                      </h3>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            scanResult.emailAnalysis.domainReputation === 'good' ? 'bg-green-400' :
                            scanResult.emailAnalysis.domainReputation === 'bad' ? 'bg-red-400' : 'bg-yellow-400'
                          }`}></div>
                          <span className="text-zinc-300">
                            Domain reputation: {scanResult.emailAnalysis.domainReputation}
                          </span>
                        </div>
                        {scanResult.emailAnalysis.isTyposquatting && (
                          <div className="text-red-300">⚠️ Possible typosquatting detected</div>
                        )}
                        {scanResult.emailAnalysis.suspiciousPatterns.length > 0 && (
                          <div className="text-orange-300 break-words">
                            <span className="font-medium">Suspicious patterns:</span> {scanResult.emailAnalysis.suspiciousPatterns.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                      <h3 className="text-white font-medium mb-3 text-sm sm:text-base">Recommendations</h3>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-300">
                        {scanResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                            <span className="break-words">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-500 text-sm sm:text-base">
                    {scanMode === 'quick' && 'Enter email and URL to start scanning'}
                    {scanMode === 'detailed' && 'Fill in email details for comprehensive analysis'}
                    {scanMode === 'upload' && 'Upload an email file to begin analysis'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scan History */}
        {scanHistory.length > 0 && (
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <History className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              Recent Scans
            </h2>
            <div className="space-y-3">
              {scanHistory.map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`${getRiskColor(scan.result.overall)} flex-shrink-0`}>
                      {getRiskIcon(scan.result.overall)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white text-xs sm:text-sm font-medium truncate">
                        {scan.url}
                      </div>
                      <div className="text-zinc-400 text-xs flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {scan.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs font-medium ${getRiskColor(scan.result.overall)} flex-shrink-0`}>
                    {scan.result.score}/100
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              Common Phishing Signs
            </h3>
            <ul className="space-y-2 text-zinc-300 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                <span>Urgent or threatening language ("Act now or lose access!")</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                <span>Requests for personal information via email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                <span>Suspicious sender addresses (hr@internshippartner.xyz)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                <span>Poor grammar or spelling errors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                <span>Shortened URLs (bit.ly, tinyurl.com)</span>
              </li>
            </ul>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              Stay Protected
            </h3>
            <ul className="space-y-2 text-zinc-300 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                <span>Verify sender through official company channels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                <span>Check URLs before clicking (hover to preview)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                <span>Use two-factor authentication</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                <span>Keep software and browsers updated</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                <span>Report suspicious emails to IT/security team</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}