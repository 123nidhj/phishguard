'use client'

import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  MessageCircle, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Search,
  Eye,
  Reply
}
 from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { auth, db } from '@/lib/firebase'
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore'
import { User as FirebaseUser } from 'firebase/auth'
import Image from 'next/image'

interface Question{
id: string;
content: string;
student:{
  name:string;
  email:string;
  avatar:string;
}
category:string;
timestamp:Date;
priority:'low'|'medium'|'high'|'urgent'
status:'unanswered'|'answered'|'resolved'
likes:number
views:number
tag:string[]
}

export default function AdminChatPage()
{
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [answer, setAnswer] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
}
const ADMIN_UID = '9z0COxpJEbXJsjElS3ZlUdGNcC22'

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u)
      if (u && u.uid === ADMIN_UID) {
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // Load questions from Firebase in real-time
    if (isAuthorized) {
      const q = query(collection(db, 'questions'), orderBy('timestamp', 'desc'))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const questionsData: Question[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          questionsData.push({
            id: doc.id,
            content: data.content,
            student: data.student,
            category: data.category,
            timestamp: data.timestamp.toDate(),
            priority: data.priority || 'medium',
            status: data.status || 'unanswered',
            likes: data.likes || 0,
            views: data.views || 0,
            tags: data.tags || []
          })
        })
        setQuestions(questionsData)
      })

      return () => unsubscribe()
    }
  }, [isAuthorized])

  const handleAnswerSubmit = async () => {
    if (!answer.trim() || !selectedQuestion || !user) return
    
    setIsLoading(true)
    
    try {
      // Create answer data
      const answerData = {
        content: answer,
        answeredBy: {
          id: user.uid,
          name: user.displayName || 'Team Lead',
          email: user.email || '',
          avatar: user.photoURL || https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Team Lead')}&background=059669&color=fff
        },
        timestamp: new Date()
      }

      // Update question status and add answer
      const questionRef = doc(db, 'questions', selectedQuestion.id)
      await updateDoc(questionRef, {
        status: 'answered',
        answer: answerData
      })
      
      // Update local state
      setQuestions(prev => prev.map(q => 
        q.id === selectedQuestion.id 
          ? { ...q, status: 'answered' as const }
          : q
      ))
      
      setAnswer('')
      setSelectedQuestion(null)
      
    } catch (error) {
      console.error('Error submitting answer:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-500/20 text-green-400 border-green-500/30'





}


