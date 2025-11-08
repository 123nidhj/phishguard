'use client'

import { useState, useEffect } from 'react'
import { auth } from '../../lib/firebase'
import { User as FirebaseUser } from 'firebase/auth'
import React from 'react'
import {
  BookOpen,
  Shield,
  AlertTriangle,
  CheckCircle,
  Brain,
  TrendingUp,
  Clock,
  Play,
  ChevronRight,
  FileText,
  Mail,
  Smartphone
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface UserProgress {
  points: number
  level: number
  completedLessons: string[]
  badges: string[]
  streak: number
}

interface Lesson {
  id: string
  title: string
  description: string
  category: 'phishing' | 'malware' | 'social' | 'mobile' | 'general'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  points: number
  duration: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  completed?: boolean
  content: {
    page1: {
      title: string
      content: string
      keyPoints: string[]
    }
    page2: {
      title: string
      content: string
      keyPoints: string[]
      quiz?: {
        question: string
        options: string[]
        correct: number
      }
    }
  }
}

interface Article {
  id: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  featured?: boolean
}

export default function AwarenessHub() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    points: 0, // Start with 0 points
    level: 1,
    completedLessons: [],
    badges: [],
    streak: 0
  })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pointsAnimation, setPointsAnimation] = useState<number | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u)
    })
    return () => unsubscribe()
  }, [])

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('phishguard-progress')
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setUserProgress(parsed)
      } catch (error) {
        console.error('Error loading saved progress:', error)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('phishguard-progress', JSON.stringify(userProgress))
  }, [userProgress])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u)
    })
    return () => unsubscribe()
  }, [])

  const lessons: Lesson[] = [
    {
      id: 'phish-basics',
      title: 'Phishing Fundamentals',
      description: 'Learn the basics of identifying phishing attempts and protect yourself from common scams.',
      category: 'phishing',
      difficulty: 'beginner',
      points: 100,
      duration: '15 min',
      icon: Shield,
      completed: false,
      content: {
        page1: {
          title: 'What is Phishing?',
          content: 'Phishing is a cybercrime where attackers impersonate legitimate organizations to steal sensitive information like passwords, credit card numbers, or personal data. These attacks typically come through email, text messages, or fake websites that look authentic.',
          keyPoints: [
            'Phishing attacks target personal and financial information',
            'Attackers impersonate trusted organizations',
            'Common targets include banks, social media, and email providers',
            'Always verify suspicious communications independently'
          ]
        },
        page2: {
          title: 'Identifying Phishing Attempts',
          content: 'Learn to recognize common signs of phishing attempts. Look for urgent language, spelling errors, suspicious links, and requests for sensitive information. Legitimate organizations rarely ask for passwords or personal data via email.',
          keyPoints: [
            'Check sender email addresses carefully',
            'Look for spelling and grammar mistakes',
            'Hover over links to see real destinations',
            'Be suspicious of urgent or threatening language'
          ],
          quiz: {
            question: 'Which of these is a common sign of a phishing email?',
            options: [
              'Perfect grammar and spelling',
              'Urgent requests for personal information',
              'Links that match the sender domain',
              'Personalized greeting with your name'
            ],
            correct: 1
          }
        }
      }
    },
    {
      id: 'email-safety',
      title: 'Email Security Mastery',
      description: 'Advanced techniques for spotting malicious emails and protecting your inbox.',
      category: 'phishing',
      difficulty: 'intermediate',
      points: 150,
      duration: '20 min',
      icon: Mail,
      completed: false,
      content: {
        page1: {
          title: 'Email Header Analysis',
          content: 'Understanding email headers is crucial for identifying spoofed emails. Learn to examine sender information, routing details, and authentication records to verify email authenticity.',
          keyPoints: [
            'Check the "From" field for exact domain matches',
            'Examine routing information for suspicious paths',
            'Look for SPF, DKIM, and DMARC authentication',
            'Be wary of emails from external domains'
          ]
        },
        page2: {
          title: 'Advanced Email Threats',
          content: 'Modern email threats include spear phishing, business email compromise, and sophisticated social engineering. These attacks are highly targeted and use personal information to appear legitimate.',
          keyPoints: [
            'Spear phishing targets specific individuals',
            'BEC attacks impersonate executives or vendors',
            'Attackers research targets on social media',
            'Always verify requests through separate channels'
          ],
          quiz: {
            question: 'What is the main characteristic of spear phishing?',
            options: [
              'It uses generic messages sent to many people',
              'It targets specific individuals with personalized content',
              'It only comes through text messages',
              'It always contains malware attachments'
            ],
            correct: 1
          }
        }
      }
    },
    {
      id: 'mobile-security',
      title: 'Mobile Security Essentials',
      description: 'Protect your smartphone and mobile apps from security threats.',
      category: 'mobile',
      difficulty: 'beginner',
      points: 125,
      duration: '18 min',
      icon: Smartphone,
      completed: false,
      content: {
        page1: {
          title: 'Mobile Threat Landscape',
          content: 'Mobile devices face unique security challenges including malicious apps, SMS phishing, unsecured WiFi, and device theft. Understanding these threats is the first step to protection.',
          keyPoints: [
            'Download apps only from official stores',
            'Keep your operating system updated',
            'Use strong authentication methods',
            'Be cautious on public WiFi networks'
          ]
        },
        page2: {
          title: 'Mobile Security Best Practices',
          content: 'Implement security measures like app permissions review, regular updates, secure messaging, and remote wipe capabilities to protect your mobile device and data.',
          keyPoints: [
            'Review app permissions regularly',
            'Enable automatic security updates',
            'Use encrypted messaging apps',
            'Set up remote wipe for lost devices'
          ],
          quiz: {
            question: 'What should you check before downloading a mobile app?',
            options: [
              'Only the app icon design',
              'App permissions and developer reputation',
              'The number of downloads only',
              'The app size'
            ],
            correct: 1
          }
        }
      }
    },
    {
      id: 'social-engineering',
      title: 'Social Engineering Defense',
      description: 'Understand psychological manipulation tactics used by cybercriminals.',
      category: 'social',
      difficulty: 'intermediate',
      points: 175,
      duration: '30 min',
      icon: Brain,
      completed: false,
      content: {
        page1: {
          title: 'Psychology of Social Engineering',
          content: 'Social engineers exploit human psychology using techniques like authority, urgency, fear, and trust. They manipulate emotions to bypass logical thinking and security procedures.',
          keyPoints: [
            'Attackers use authority figures to intimidate',
            'Urgency creates pressure to act quickly',
            'Fear of consequences overrides caution',
            'Trust is built through familiarity and helpfulness'
          ]
        },
        page2: {
          title: 'Defending Against Manipulation',
          content: 'Develop defensive strategies against social engineering by establishing verification procedures, taking time to think, and maintaining healthy skepticism of unsolicited requests.',
          keyPoints: [
            'Always verify requests through known channels',
            'Take time to think before acting',
            'Question unsolicited offers or requests',
            'Trust your instincts when something feels wrong'
          ],
          quiz: {
            question: 'What is the best defense against social engineering?',
            options: [
              'Installing antivirus software',
              'Verification through independent channels',
              'Using strong passwords',
              'Avoiding all phone calls'
            ],
            correct: 1
          }
        }
      }
    },
    {
      id: 'malware-detection',
      title: 'Malware Recognition',
      description: 'Identify different types of malware and learn prevention strategies.',
      category: 'malware',
      difficulty: 'advanced',
      points: 250,
      duration: '35 min',
      icon: AlertTriangle,
      completed: false,
      content: {
        page1: {
          title: 'Types of Malware',
          content: 'Malware comes in many forms including viruses, trojans, ransomware, spyware, and adware. Each type has different characteristics and methods of infection. Understanding these differences is crucial for effective protection.',
          keyPoints: [
            'Viruses replicate and spread to other files',
            'Trojans disguise themselves as legitimate software',
            'Ransomware encrypts files and demands payment',
            'Spyware secretly monitors user activities'
          ]
        },
        page2: {
          title: 'Malware Prevention and Detection',
          content: 'Effective malware protection requires multiple layers including antivirus software, regular updates, safe browsing habits, and backup strategies. Learn to recognize suspicious behavior and respond appropriately.',
          keyPoints: [
            'Keep antivirus software updated and active',
            'Avoid downloading from untrusted sources',
            'Regular system and data backups',
            'Monitor system performance for unusual activity'
          ],
          quiz: {
            question: 'Which type of malware encrypts your files and demands payment?',
            options: [
              'Virus',
              'Trojan',
              'Ransomware',
              'Spyware'
            ],
            correct: 2
          }
        }
      }
    },
    {
      id: 'password-security',
      title: 'Password Security & Management',
      description: 'Create strong passwords and learn secure password management practices.',
      category: 'general',
      difficulty: 'beginner',
      points: 110,
      duration: '16 min',
      icon: Shield,
      completed: false,
      content: {
        page1: {
          title: 'Password Fundamentals',
          content: 'Strong passwords are your first line of defense against unauthorized access. Learn the principles of creating secure passwords that are both strong and memorable while avoiding common pitfalls.',
          keyPoints: [
            'Use at least 12 characters with mixed case, numbers, and symbols',
            'Avoid personal information and common words',
            'Use unique passwords for each account',
            'Consider passphrases for better memorability'
          ]
        },
        page2: {
          title: 'Password Managers and 2FA',
          content: 'Password managers help you generate and store unique passwords securely. Two-factor authentication adds an extra layer of security that significantly reduces the risk of account compromise.',
          keyPoints: [
            'Password managers generate and store unique passwords',
            'Enable 2FA wherever possible',
            'Use authenticator apps over SMS when available',
            'Keep backup codes in a secure location'
          ],
          quiz: {
            question: 'What is the recommended minimum length for a secure password?',
            options: [
              '6 characters',
              '8 characters',
              '12 characters',
              '16 characters'
            ],
            correct: 2
          }
        }
      }
    }
  ]

  const articles: Article[] = [
    {
      id: '1',
      title: 'The Evolution of Phishing: From Simple Emails to AI-Powered Attacks',
      excerpt: 'Explore how phishing attacks have evolved and what the future holds for cybersecurity.',
      category: 'Trends',
      readTime: '8 min read',
      date: '2 days ago',
      featured: true
    },
    {
      id: '2',
      title: 'Top 10 Red Flags in Suspicious Emails',
      excerpt: 'Learn to spot the most common warning signs that indicate a malicious email.',
      category: 'Email Security',
      readTime: '5 min read',
      date: '1 week ago',
      featured: true
    },
    {
      id: '3',
      title: 'Case Study: How a Small Business Prevented a $50k Scam',
      excerpt: 'Real-world example of how security awareness training saved a company from fraud.',
      category: 'Case Studies',
      readTime: '12 min read',
      date: '3 days ago'
    },
    {
      id: '4',
      title: 'Mobile App Security: What to Look For',
      excerpt: 'Essential security features to check before downloading any mobile application.',
      category: 'Mobile Security',
      readTime: '6 min read',
      date: '5 days ago'
    },
    {
      id: '5',
      title: 'Password Managers: Your First Line of Defense',
      excerpt: 'Why password managers are crucial and how to choose the right one for you.',
      category: 'Tools',
      readTime: '10 min read',
      date: '1 week ago'
    },
    {
      id: '6',
      title: 'Social Engineering Tactics: The Human Element of Cybercrime',
      excerpt: 'Understanding how attackers manipulate psychology to bypass technical security.',
      category: 'Social Engineering',
      readTime: '15 min read',
      date: '2 weeks ago'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'phishing', name: 'Phishing', icon: Mail },
    { id: 'malware', name: 'Malware', icon: AlertTriangle },
    { id: 'social', name: 'Social Engineering', icon: Brain },
    { id: 'mobile', name: 'Mobile Security', icon: Smartphone },
    { id: 'general', name: 'General Security', icon: Shield }
  ]

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ]

  const filteredLessons = lessons.filter(lesson => {
    const categoryMatch = selectedCategory === 'all' || lesson.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const completeLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId)
    if (lesson && !userProgress.completedLessons.includes(lessonId)) {
      const newPoints = userProgress.points + lesson.points
      const newLevel = Math.floor(newPoints / 500) + 1 // Level up every 500 points
      
      // Show points animation
      setPointsAnimation(lesson.points)
      setTimeout(() => setPointsAnimation(null), 2000)
      
      // Award badges based on milestones
      const newBadges = [...userProgress.badges]
      if (userProgress.completedLessons.length === 0) {
        newBadges.push('First Steps')
      }
      if (userProgress.completedLessons.length + 1 === 3) {
        newBadges.push('Quick Learner')
      }
      if (newPoints >= 500 && !newBadges.includes('Security Expert')) {
        newBadges.push('Security Expert')
      }
      if (lesson.category === 'phishing' && !newBadges.includes('Phishing Hunter')) {
        newBadges.push('Phishing Hunter')
      }
      
      setUserProgress(prev => ({
        ...prev,
        points: newPoints,
        level: newLevel,
        completedLessons: [...prev.completedLessons, lessonId],
        badges: newBadges,
        streak: prev.streak + 1
      }))
      
      // Show success message (you could add a toast library here)
      console.log(`Course completed! Earned ${lesson.points} points. Total: ${newPoints}`)
    }
  }

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setCurrentPage(1)
  }

  const closeLessonViewer = () => {
    setSelectedLesson(null)
    setCurrentPage(1)
  }

  const nextPage = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const finishLesson = () => {
    if (selectedLesson) {
      completeLesson(selectedLesson.id)
      closeLessonViewer()
    }
  }

  // Reset progress function for testing
  const resetProgress = () => {
    const defaultProgress = {
      points: 0,
      level: 1,
      completedLessons: [],
      badges: [],
      streak: 0
    }
    setUserProgress(defaultProgress)
    localStorage.setItem('phishguard-progress', JSON.stringify(defaultProgress))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'advanced': return 'text-red-400 bg-red-500/10 border-red-500/30'
      default: return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Course Viewer Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-700">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedLesson.title}</h2>
                <p className="text-zinc-400 mt-1">Page {currentPage} of 2</p>
              </div>
              <Button
                onClick={closeLessonViewer}
                variant="outline"
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
              >
                Close
              </Button>
            </div>

          
            <div className="p-6">
              {currentPage === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <selectedLesson.icon className="w-8 h-8 text-blue-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">{selectedLesson.content.page1.title}</h3>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                      {selectedLesson.content.page1.content}
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Key Points
                    </h4>
                    <ul className="space-y-3">
                      {selectedLesson.content.page1.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-zinc-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {currentPage === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <selectedLesson.icon className="w-8 h-8 text-blue-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">{selectedLesson.content.page2.title}</h3>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                      {selectedLesson.content.page2.content}
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Key Points
                    </h4>
                    <ul className="space-y-3">
                      {selectedLesson.content.page2.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-zinc-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quiz Section */}
                  {selectedLesson.content.page2.quiz && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Knowledge Check</h4>
                      <p className="text-zinc-300 mb-4">{selectedLesson.content.page2.quiz.question}</p>
                      <div className="space-y-2">
                        {selectedLesson.content.page2.quiz.options.map((option, index) => (
                          <div key={index} className="flex items-center p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
                            <div className="w-4 h-4 border border-zinc-500 rounded-full mr-3"></div>
                            <span className="text-zinc-300">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between p-6 border-t border-zinc-700">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                variant="outline"
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${currentPage === 1 ? 'bg-blue-400' : 'bg-zinc-600'}`}></div>
                <div className={`w-2 h-2 rounded-full ${currentPage === 2 ? 'bg-blue-400' : 'bg-zinc-600'}`}></div>
              </div>

              {currentPage < 2 ? (
                <Button
                  onClick={nextPage}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={finishLesson}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Complete Course
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Security Education Center
          </h1>
          <p className="text-zinc-400 text-base max-w-2xl mx-auto">
            Learn cybersecurity fundamentals through structured courses and expert-written articles
          </p>
        </div>

        {/* User Progress Dashboard */}
        {user && (
          <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                Your Learning Progress
              </h2>
              <Button
                onClick={resetProgress}
                variant="outline"
                className="border-zinc-600 text-zinc-400 hover:bg-zinc-800 text-xs px-3 py-1"
              >
                Reset Progress
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Level & Progress */}
              <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">Level {userProgress.level}</div>
                <div className="text-sm text-zinc-400 mb-2">
                  {userProgress.points % 500} / 500 XP
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((userProgress.points % 500) / 500) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Completed Lessons */}
              <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">{userProgress.completedLessons.length}</div>
                <div className="text-sm text-zinc-400">Lessons Completed</div>
              </div>

              {/* Total Points with Animation */}
              <div className="text-center p-4 bg-zinc-800/30 rounded-lg relative">
                <div className="text-2xl font-bold text-white mb-1 transition-all duration-300">
                  {userProgress.points}
                  {pointsAnimation && (
                    <span className="absolute -top-2 -right-2 text-green-400 text-sm font-bold animate-bounce">
                      +{pointsAnimation}
                    </span>
                  )}
                </div>
                <div className="text-sm text-zinc-400">Points Earned</div>
              </div>

              {/* Badges */}
              <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">{userProgress.badges.length}</div>
                <div className="text-sm text-zinc-400">Badges Earned</div>
              </div>
            </div>

            {/* Badges Display */}
            {userProgress.badges.length > 0 && (
              <div className="mt-6 pt-6 border-t border-zinc-700/50">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  🏆 Your Achievements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userProgress.badges.map((badge, index) => (
                    <Badge key={index} className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30 px-3 py-1">
                      ⭐ {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Learning Courses */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-blue-400" />
            Security Training Courses
          </h2>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Filter by Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => {
              const isCompleted = userProgress.completedLessons.includes(lesson.id)
              return (
                <div
                  key={lesson.id}
                  className={`bg-zinc-900/50 border rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 ${
                    isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-zinc-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCompleted ? 'bg-green-500/20' : 'bg-zinc-800/50'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <lesson.icon className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)} border`}>
                        {lesson.difficulty}
                      </Badge>
                      <div className="flex items-center text-zinc-400 text-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {lesson.duration}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{lesson.title}</h3>
                  <p className="text-zinc-400 text-sm mb-4">{lesson.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-blue-400 text-sm font-medium">
                      {lesson.points} points
                    </div>
                    <Button
                      onClick={() => startLesson(lesson)}
                      disabled={isCompleted}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Course
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Knowledge Base */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-blue-400" />
            Knowledge Base & Articles
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Articles */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">Featured Articles</h3>
              <div className="space-y-4">
                {articles.filter(article => article.featured).map((article) => (
                  <div
                    key={article.id}
                    className="bg-zinc-900/50 border border-zinc-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {article.category}
                      </Badge>
                      <span className="text-zinc-500 text-sm">{article.date}</span>
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-zinc-400 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-sm flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime}
                      </span>
                      <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Articles Sidebar */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Articles</h3>
              <div className="space-y-3">
                {articles.filter(article => !article.featured).map((article) => (
                  <div
                    key={article.id}
                    className="bg-zinc-900/30 border border-zinc-700/30 rounded-lg p-4 hover:border-blue-500/30 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                        {article.category}
                      </Badge>
                      <span className="text-zinc-500 text-xs">{article.date}</span>
                    </div>
                    <h5 className="text-sm font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h5>
                    <div className="flex items-center text-zinc-500 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section className="bg-zinc-900/50 border border-zinc-700/50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Start Your Security Education Journey
          </h3>
          <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
            Begin with our foundational courses and progress to advanced topics. 
            Build your cybersecurity knowledge at your own pace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
              <Play className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
            <Button variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 px-6 py-3 rounded-lg font-medium">
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Articles
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
