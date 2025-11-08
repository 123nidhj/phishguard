'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { 
  MessageCircle, 
  Send, 
  User, 
  Bot, 
  Shield, 
  Clock,
  CheckCircle,
  Users,
  FileText,
  Search,
  Filter,
  Star,
  Heart,
  ThumbsUp,
  Pin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { auth, db } from '@/lib/firebase'
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { User as FirebaseUser } from 'firebase/auth'

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    email: string
    avatar: string
    role: 'student' | 'team_lead' | 'admin'
  }
  timestamp: Date
  type: 'question' | 'answer' | 'system'
  category: string
  likes: number
  isResolved: boolean
  isPinned: boolean
  replies?: Message[]
}

interface ChatCategory {
  id: string
  name: string
  icon: React.ElementType
  color: string
  count: number
}

export default function ChatPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u)
    })
    return () => unsubscribe()
  }, [])

  const categories: ChatCategory[] = [
    { id: 'all', name: 'All Topics', icon: MessageCircle, color: 'blue', count: 45 },
    { id: 'phishing', name: 'Phishing Detection', icon: Shield, color: 'red', count: 15 },
    { id: 'scams', name: 'Scam Awareness', icon: Bot, color: 'yellow', count: 12 },
    { id: 'security', name: 'General Security', icon: FileText, color: 'green', count: 8 },
    { id: 'technical', name: 'Technical Help', icon: Search, color: 'purple', count: 10 }
  ]

  // Load messages from Firebase in real-time
  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'questions'), orderBy('timestamp', 'desc'))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const questionsData: Message[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          
          // Create the main question message
          const questionMessage: Message = {
            id: doc.id,
            content: data.content,
            sender: {
              id: data.student.id,
              name: data.student.name,
              email: data.student.email,
              avatar: data.student.avatar,
              role: 'student'
            },
            timestamp: data.timestamp.toDate(),
            type: 'question',
            category: data.category,
            likes: data.likes || 0,
            isResolved: data.status === 'answered' || data.status === 'resolved',
            isPinned: false,
            replies: []
          }
          
          // If there's an admin answer, add it as a reply
          if (data.answer && data.status === 'answered') {
            const adminReply: Message = {
              id: `${doc.id}-answer`,
              content: data.answer.content,
              sender: {
                id: data.answer.answeredBy.id,
                name: data.answer.answeredBy.name,
                email: data.answer.answeredBy.email,
                avatar: data.answer.answeredBy.avatar,
                role: 'team_lead'
              },
              timestamp: data.answer.timestamp.toDate(),
              type: 'answer',
              category: data.category,
              likes: 0,
              isResolved: false,
              isPinned: false,
              replies: []
            }
            questionMessage.replies = [adminReply]
          }
          
          questionsData.push(questionMessage)
        })
        setMessages(questionsData)
      })

      return () => unsubscribe()
    } else {
      setMessages([])
    }
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return

    setIsLoading(true)
    
    try {
      const questionData = {
        content: newMessage,
        student: {
          id: user.uid,
          name: user.displayName || 'Student',
          email: user.email || '',
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Student')}&background=0891b2&color=fff`
        },
        category: selectedCategory === 'all' ? 'general' : selectedCategory,
        timestamp: new Date(),
        priority: 'medium',
        status: 'unanswered',
        likes: 0,
        views: 0,
        tags: [selectedCategory === 'all' ? 'general' : selectedCategory],
        replies: []
      }

      // Save to Firebase
      await addDoc(collection(db, 'questions'), questionData)
      

      setNewMessage('')
      
    } catch (error) {
      console.error('Error saving question:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendReply = async (parentMessageId: string) => {
    if (!replyContent.trim() || !user) return

    setIsLoading(true)
    
    const reply: Message = {
      id: `${parentMessageId}-reply-${Date.now()}`,
      content: replyContent,
      sender: {
        id: user.uid,
        name: user.displayName || 'Student',
        email: user.email || '',
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Student')}&background=0891b2&color=fff`,
        role: 'student'
      },
      timestamp: new Date(),
      type: 'question',
      category: 'general',
      likes: 0,
      isResolved: false,
      isPinned: false
    }

    setMessages(prev => prev.map(msg => {
      if (msg.id === parentMessageId) {
        return {
          ...msg,
          replies: [...(msg.replies || []), reply]
        }
      }
      // Also check if we're replying to a reply
      if (msg.replies) {
        const updatedReplies = msg.replies.map(r => {
          if (r.id === parentMessageId) {
            return {
              ...r,
              replies: [...(r.replies || []), reply]
            }
          }
          return r
        })
        return { ...msg, replies: updatedReplies }
      }
      return msg
    }))
    
    setReplyContent('')
    setReplyingTo(null)
    setIsLoading(false)
  }

  const handleLikeMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, likes: msg.likes + 1 }
        : {
            ...msg,
            replies: msg.replies?.map(reply => 
              reply.id === messageId 
                ? { ...reply, likes: reply.likes + 1 }
                : reply
            )
          }
    ))
  }

  const filteredMessages = messages.filter(msg => {
    const matchesCategory = selectedCategory === 'all' || msg.category === selectedCategory
    const matchesSearch = msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'team_lead': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'team_lead': return Shield
      case 'admin': return Star
      default: return User
    }
  }

  const renderMessage = (message: Message, depth = 0) => {
    const isNested = depth > 0
    const marginLeft = isNested ? { marginLeft: `${Math.min(depth * 32, 128)}px` } : {}
    const avatarSize = isNested ? 'w-8 h-8' : 'w-10 h-10'
    const textSize = isNested ? 'text-sm' : ''

    return (
      <div key={message.id} className="space-y-3" style={marginLeft}>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className={`${avatarSize} rounded-full overflow-hidden ${
              message.sender.role === 'team_lead' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}>
              <Image 
                src={message.sender.avatar} 
                alt={message.sender.name}
                width={isNested ? 32 : 40}
                height={isNested ? 32 : 40}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-semibold text-white ${textSize}`}>{message.sender.name}</span>
              <Badge className={`text-xs ${getRoleColor(message.sender.role)}`}>
                {React.createElement(getRoleIcon(message.sender.role), { className: "w-3 h-3 mr-1" })}
                {message.sender.role.replace('_', ' ')}
              </Badge>
              <span className="text-xs text-zinc-400">
                {message.timestamp.toLocaleDateString()} {message.timestamp.toLocaleTimeString()}
              </span>
              {message.isPinned && <Pin className="w-3 h-3 text-yellow-400" />}
              {message.isResolved && <CheckCircle className="w-3 h-3 text-green-400" />}
            </div>
            
            <div className={`${
              message.sender.role === 'team_lead' 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-zinc-700/30 border border-zinc-600/30'
            } rounded-lg p-3 mb-3`}>
              <p className={`text-zinc-200 leading-relaxed ${textSize}`}>{message.content}</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => handleLikeMessage(message.id)}
                className={`flex items-center gap-1 transition-colors ${
                  message.sender.role === 'team_lead'
                    ? 'text-zinc-400 hover:text-green-400'
                    : 'text-zinc-400 hover:text-red-400'
                }`}
              >
                {message.sender.role === 'team_lead' ? (
                  <ThumbsUp className="w-3 h-3" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
                {message.likes}
              </button>
              
              {user && (
                <button
                  onClick={() => setReplyingTo(replyingTo === message.id ? null : message.id)}
                  className="flex items-center gap-1 text-white hover:text-cyan-400 transition-colors text-xs"
                >
                  <MessageCircle className="w-3 h-3" />
                  Reply
                </button>
              )}
              
              {!isNested && (
                <Badge variant="outline" className="text-xs text-white">
                  {message.category}
                </Badge>
              )}
            </div>

            {/* Reply Input */}
            {user && replyingTo === message.id && (
              <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask a follow-up question or provide additional information..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="bg-zinc-700/50 border-zinc-600/50 text-white placeholder-zinc-400 resize-none text-sm"
                    rows={2}
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      onClick={() => handleSendReply(message.id)}
                      disabled={!replyContent.trim() || isLoading}
                      size="sm"
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-3"
                    >
                      {isLoading ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyContent('')
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs border-zinc-600 text-zinc-400"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Render Nested Replies */}
        {message.replies && message.replies.map((reply) => renderMessage(reply, depth + 1))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Security Chat Hub
              </h1>
              <p className="text-zinc-400">Ask doubts, get expert answers from our security team</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-zinc-400">Active Users</span>
              </div>
              <p className="text-xl font-bold text-white">7</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">Questions</span>
              </div>
              <p className="text-xl font-bold text-white">10</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-400">Resolved</span>
              </div>
              <p className="text-xl font-bold text-white">8</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-zinc-400">Avg Response</span>
              </div>
              <p className="text-xl font-bold text-white">12m</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 sticky top-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-cyan-400" />
                Categories
              </h3>
              
              <div className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-zinc-300 hover:bg-zinc-700/50 hover:text-white'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{category.name}</p>
                      </div>
                   
                    </button>
                  )
                })}
              </div>

              {/* Search */}
              <div className="mt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-zinc-800/50 border-zinc-700/50 text-white placeholder-zinc-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-800/30 rounded-xl border border-zinc-700/50 h-[600px] flex flex-col">
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {filteredMessages.map((message) => renderMessage(message))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {user && (
                <div className="p-4 border-t border-zinc-700/50">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500">
                        <Image 
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=0891b2&color=fff`}
                          alt={user.displayName || 'You'}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder="Ask your cybersecurity question..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="bg-zinc-800/50 border-zinc-700/50 text-white placeholder-zinc-400 resize-none"
                        rows={2}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isLoading}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {!user && (
                <div className="p-4 border-t border-zinc-700/50 text-center">
                  <p className="text-zinc-400">Please sign in to ask questions and participate in discussions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
