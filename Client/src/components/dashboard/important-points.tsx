import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Lightbulb, 
  AlertTriangle, 
  Shield, 
  Clock, 
  FileText,
  Building2,
  ArrowRight,
  TrendingUp,
  Eye,
  Zap,
  Activity,
  BarChart3,
  Download,
  Star,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { documentAPI, DocumentFromAPI } from "@/lib/api"
import { getUser } from "@/Utils/Auth/token"

interface ImportantPoint {
  id: string
  title: string
  description: string
  department: string
  category: "safety" | "procedure" | "policy" | "regulation" | "guideline" | "warning" | "requirement"
  priority: "high" | "medium" | "low"
  extractedDate: string
  summary?: string
  fileType?: string
  uploadedBy?: string
  tags?: string[]
}

interface DashboardStats {
  totalDocuments: number
  recentUploads: number
  criticalAlerts: number
  activeUsers: number
  completionRate: number
}

const recentImportantPoints: ImportantPoint[] = [
  {
    id: "1",
    title: "Track Section A3-B7 Signal Malfunction",
    description: "Signal control system experiencing intermittent failures. Manual override required...",
    department: "Signal & Telecommunications",
    category: "safety",
    priority: "high",
    extractedDate: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    title: "Train BR-204 Brake System Alert",
    description: "Regenerative braking system showing 15% efficiency reduction. Route approval needed...",
    department: "Rolling Stock Maintenance",
    category: "warning",
    priority: "high",
    extractedDate: "2024-01-14T14:20:00Z"
  },
  {
    id: "3",
    title: "Power Supply Voltage Fluctuation Zone 3",
    description: "Electrical supply showing voltage fluctuations. All trains must operate at reduced power...",
    department: "Electrical Systems",
    category: "requirement",
    priority: "high",
    extractedDate: "2024-01-12T16:45:00Z"
  }
]

export function ImportantPoints() {
  const navigate = useNavigate()
  const [recentDocuments, setRecentDocuments] = useState<DocumentFromAPI[]>([])
  const [importantPoints, setImportantPoints] = useState<ImportantPoint[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalDocuments: 0,
    recentUploads: 0,
    criticalAlerts: 0,
    activeUsers: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch recent documents and generate important points
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const user = getUser()
      
      if (user && user.id) {
        // Fetch user's recent documents
        const documents = await documentAPI.getDocumentsByUser(user.id)
        
        // Sort by creation date and take latest 1
        const sortedDocs = documents
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 1)
        
        setRecentDocuments(sortedDocs)
        
        // Generate important points from recent documents
        const points = generateImportantPointsFromDocuments(sortedDocs)
        setImportantPoints(points)
        
        // Calculate dashboard stats
        const stats = calculateDashboardStats(documents)
        setDashboardStats(stats)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateImportantPointsFromDocuments = (documents: DocumentFromAPI[]): ImportantPoint[] => {
    return documents.map((doc, index) => ({
      id: doc._id,
      title: doc.title,
      description: doc.summary || `Document uploaded: ${doc.fileName}`,
      department: doc.department.name,
      category: getCategoryFromFileType(doc.fileType),
      priority: index === 0 ? "high" : index === 1 ? "medium" : "low",
      extractedDate: doc.createdAt,
      summary: doc.summary,
      fileType: doc.fileType,
      uploadedBy: doc.uploadedBy.name,
      tags: [doc.category, doc.classification].filter(Boolean)
    }))
  }

  const getCategoryFromFileType = (fileType: string): ImportantPoint['category'] => {
    if (fileType.includes('pdf') || fileType.includes('document')) return 'procedure'
    if (fileType.includes('image')) return 'guideline'
    if (fileType.includes('spreadsheet')) return 'policy'
    return 'requirement'
  }

  const calculateDashboardStats = (documents: DocumentFromAPI[]): DashboardStats => {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const recentUploads = documents.filter(doc => 
      new Date(doc.createdAt) > oneDayAgo
    ).length
    
    const weeklyUploads = documents.filter(doc => 
      new Date(doc.createdAt) > oneWeekAgo
    ).length
    
    return {
      totalDocuments: documents.length,
      recentUploads,
      criticalAlerts: Math.min(recentUploads, 5), // Simulate critical alerts
      activeUsers: Math.min(documents.length, 25), // Simulate active users
      completionRate: Math.min(Math.round((weeklyUploads / Math.max(documents.length, 1)) * 100), 100)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/40 dark:to-red-800/40 dark:text-red-300 border border-red-200 dark:border-red-700 shadow-sm"
      case "medium":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 dark:from-yellow-900/40 dark:to-yellow-800/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700 shadow-sm"
      case "low":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/40 dark:to-green-800/40 dark:text-green-300 border border-green-200 dark:border-green-700 shadow-sm"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-800/40 dark:to-gray-700/40 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "safety":
        return <Shield className="h-4 w-4 text-white" />
      case "procedure":
        return <FileText className="h-4 w-4 text-white" />
      case "policy":
        return <CheckCircle className="h-4 w-4 text-white" />
      case "regulation":
        return <AlertTriangle className="h-4 w-4 text-white" />
      case "guideline":
        return <Lightbulb className="h-4 w-4 text-white" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-white" />
      case "requirement":
        return <AlertTriangle className="h-4 w-4 text-white" />
      default:
        return <FileText className="h-4 w-4 text-white" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg">
              <Activity className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Document Intelligence
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">Loading insights from recent uploads...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/30 border-0 shadow-xl overflow-hidden max-h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                Document Intelligence
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 dark:text-gray-400 truncate">
                Insights from your recent document activity
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/documents")}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs px-2 py-1"
            >
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 p-4">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative group">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-1">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                  <FileText className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs text-blue-600 font-medium">Total</span>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalDocuments}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Documents</div>
            </div>
          </div>

          <div className="relative group">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-1">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-md flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs text-green-600 font-medium">24h</span>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{dashboardStats.recentUploads}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Recent</div>
            </div>
          </div>
        </div>

        {/* Recent Document Insights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              Recent Document Activity
            </h4>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
              Latest Upload
            </Badge>
          </div>
          
          {importantPoints.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent documents found</p>
              <p className="text-xs mt-1">Upload some documents to see intelligent insights here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {importantPoints.map((point, index) => (
                <div 
                  key={point.id} 
                  className="group relative p-2.5 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2.5 flex-1">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                        index === 0 ? 'bg-gradient-to-br from-red-500 to-red-600' :
                        index === 1 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                        'bg-gradient-to-br from-green-500 to-green-600'
                      } shadow-md`}>
                        {getCategoryIcon(point.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                          {point.title}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-1">
                          {point.summary || point.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5 ml-2">
                      <Badge className={`${getPriorityColor(point.priority)} text-xs`}>
                        {point.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                        onClick={() => navigate(`/documents/${point.id}`)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Building2 className="h-3 w-3 mr-1" />
                        {point.department}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {point.uploadedBy}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(point.extractedDate)}
                      </span>
                    </div>
                    {point.tags && point.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        {point.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button 
            variant="outline" 
            size="sm"
            className="justify-center bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200 text-xs px-2 py-1.5"
            onClick={() => navigate("/documents")}
          >
            <FileText className="h-3 w-3 mr-1" />
            Browse All Documents
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="justify-center bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 transition-all duration-200 text-xs px-2 py-1.5"
            onClick={() => navigate("/upload")}
          >
            <Zap className="h-3 w-3 mr-1" />
            Upload New Document
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
