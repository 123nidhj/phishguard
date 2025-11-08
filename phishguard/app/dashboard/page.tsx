'use client'

import { useEffect, useState, useMemo } from 'react'
import { db } from '../../lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { 
  Globe2, 
  User2, 
  CalendarDays, 
  AlertCircle, 
  Shield, 
  TrendingUp, 
  Activity,
  Search,
  Filter,
  Download
} from 'lucide-react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Tooltip, 
  Legend, 
  ArcElement
)

interface Report {
  id: string
  url: string
  reporterEmail?: string
  scamType?: string
  description?: string
  imageUrl?: string
  createdAt?: {
    toDate: () => Date
  }
}

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  // CSV Export Function
  const exportToCSV = () => {
    if (filteredReports.length === 0) {
      alert('No data to export!')
      return
    }

    try {
      // Define CSV headers
      const headers = ['ID', 'URL', 'Reporter Email', 'Scam Type', 'Description', 'Image URL', 'Date Reported']
      
      // Convert reports to CSV format
      const csvData = filteredReports.map(report => [
        report.id,
        `"${report.url}"`, // Wrap in quotes to handle commas in URLs
        report.reporterEmail || 'Anonymous',
        report.scamType || 'Unknown',
        `"${(report.description || '').replace(/"/g, '""')}"`, // Escape quotes in description
        report.imageUrl || '',
        report.createdAt?.toDate
          ? new Date(report.createdAt.toDate()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'Unknown'
      ])

      // Combine headers and data
      const csvContent = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n')

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `phishguard-reports-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the URL object
      URL.revokeObjectURL(url)
      
      // Show success message
      setTimeout(() => {
        alert(`Successfully exported ${filteredReports.length} reports to CSV!`)
      }, 100)
      
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Report))
      setReports(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Enhanced analytics
  const analytics = useMemo(() => {
    const totalReports = reports.length
    const scamTypeCounts = reports.reduce((acc: Record<string, number>, report) => {
      const type = report.scamType || 'Unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)
    
    const recentReports = reports.filter(r => 
      r.createdAt?.toDate && r.createdAt.toDate() > last7Days
    ).length

    const topScamType = Object.entries(scamTypeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'

    return {
      totalReports,
      scamTypeCounts,
      recentReports,
      topScamType
    }
  }, [reports])

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = 
        report.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporterEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = 
        selectedFilter === 'all' || 
        report.scamType === selectedFilter

      return matchesSearch && matchesFilter
    })
  }, [reports, searchTerm, selectedFilter])

  const chartData = {
    labels: Object.keys(analytics.scamTypeCounts),
    datasets: [
      {
        label: 'Reports by Type',
        data: Object.values(analytics.scamTypeCounts),
        backgroundColor: [
          'rgba(6, 182, 212, 0.8)',   // cyan
          'rgba(251, 146, 60, 0.8)',  // orange
          'rgba(34, 197, 94, 0.8)',   // green
          'rgba(168, 85, 247, 0.8)',  // purple
          'rgba(239, 68, 68, 0.8)',   // red
          'rgba(245, 158, 11, 0.8)',  // yellow
        ],
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    ],
  }

  const doughnutData = {
    labels: Object.keys(analytics.scamTypeCounts),
    datasets: [
      {
        data: Object.values(analytics.scamTypeCounts),
        backgroundColor: [
          'rgba(6, 182, 212, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: { size: 12 },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#06b6d4',
        bodyColor: '#fff',
        borderColor: '#06b6d4',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#ccc', font: { size: 11 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: '#ccc', font: { size: 11 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#fff',
          font: { size: 11 },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#06b6d4',
        bodyColor: '#fff',
      },
    },
  }

  const uniqueScamTypes = ['all', ...Array.from(new Set(reports.map(r => r.scamType).filter(Boolean)))]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-cyan-400">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
           PhishGuard Dashboard
        </h1>
        <p className="text-zinc-400 text-lg">Real-time monitoring of phishing and scam reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-400 text-sm font-medium">Total Reports</p>
              <p className="text-3xl font-bold text-white">{analytics.totalReports}</p>
            </div>
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">This Week</p>
              <p className="text-3xl font-bold text-white">{analytics.recentReports}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Top Scam Type</p>
              <p className="text-lg font-bold text-white truncate">{analytics.topScamType}</p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Unique Types</p>
              <p className="text-3xl font-bold text-white">{Object.keys(analytics.scamTypeCounts).length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Reports by Scam Type</h3>
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Distribution</h3>
          <div className="h-80">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
            >
              {uniqueScamTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">
            Recent Reports ({filteredReports.length})
          </h3>
          
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">
                {reports.length === 0 
                  ? "No scam reports yet... you're safe for now 🛡️"
                  : "No reports match your current filters"
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 hover:border-cyan-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1 space-y-3">
                      {/* URL */}
                      <div className="flex items-center gap-2">
                        <Globe2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-cyan-400 font-medium break-all">{report.url}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {/* Reporter */}
                        <div className="flex items-center gap-2 text-zinc-300">
                          <User2 className="w-4 h-4 text-zinc-500" />
                          <span>{report.reporterEmail || 'Anonymous'}</span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-zinc-400">
                          <CalendarDays className="w-4 h-4 text-zinc-500" />
                          <span>
                            {report.createdAt?.toDate
                              ? new Date(report.createdAt.toDate()).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {/* Scam Type */}
                      {report.scamType && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-400" />
                          <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs font-medium">
                            {report.scamType}
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      {report.description && (
                        <div className="text-zinc-300 text-sm bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                          <p className="italic">&quot;{report.description}&quot;</p>
                        </div>
                      )}
                    </div>

                    {/* Image Preview */}
                    {report.imageUrl && (
                      <div className="lg:w-48 flex-shrink-0">
                        <img
                          src={report.imageUrl}
                          alt="Reported screenshot"
                          className="w-full h-32 lg:h-24 object-cover rounded-lg border border-zinc-700 shadow-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}