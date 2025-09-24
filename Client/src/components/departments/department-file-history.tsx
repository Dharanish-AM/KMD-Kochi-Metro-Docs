import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Upload,
  Loader,
  RefreshCw
} from "lucide-react"
import { format } from "date-fns"
import { documentAPI, type DocumentFromAPI } from "@/lib/api"
import { getUser } from "@/Utils/Auth/token"
interface DepartmentFileHistoryProps {
  department: string
  departmentId?: string
  filter?: "all" | "pending" | "accepted" | "rejected"
  onFileCountChange?: () => void
}

interface FileRecord {
  id: string
  name: string
  category: string
  uploadDate: Date
  status: "pending" | "accepted" | "rejected"
  size: number
  uploadedBy: string
  reviewedBy?: string
  reviewDate?: Date
  comments?: string
  downloadCount: number
  classification?: string
  summary?: string
  detected_language?: string
}

// Department theme configuration
const departmentThemes = {
  // KMRL Departments with new themes
  "Operations & Maintenance": {
    primary: "from-cyan-600 via-sky-700 to-blue-800",
    secondary: "from-cyan-50 to-sky-50",
    accent: "bg-cyan-500",
    text: "text-cyan-600",
    lightBg: "from-cyan-50 to-sky-100",
    darkBg: "from-cyan-900/20 to-sky-800/20",
    border: "border-cyan-200 dark:border-cyan-700"
  },
  "Engineering & Infrastructure": {
    primary: "from-blue-600 via-blue-700 to-indigo-800",
    secondary: "from-blue-50 to-indigo-50",
    accent: "bg-blue-500",
    text: "text-blue-600",
    lightBg: "from-blue-50 to-blue-100",
    darkBg: "from-blue-900/20 to-blue-800/20",
    border: "border-blue-200 dark:border-blue-700"
  },
  "Electrical & Mechanical": {
    primary: "from-orange-600 via-amber-700 to-yellow-800",
    secondary: "from-orange-50 to-amber-50",
    accent: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "from-orange-50 to-amber-100",
    darkBg: "from-orange-900/20 to-amber-800/20",
    border: "border-orange-200 dark:border-orange-700"
  },
  "Finance & Accounts": {
    primary: "from-yellow-600 via-amber-700 to-orange-800",
    secondary: "from-yellow-50 to-amber-50",
    accent: "bg-yellow-500",
    text: "text-yellow-600",
    lightBg: "from-yellow-50 to-amber-100",
    darkBg: "from-yellow-900/20 to-amber-800/20",
    border: "border-yellow-200 dark:border-yellow-700"
  },
  "Human Resources": {
    primary: "from-emerald-600 via-green-700 to-teal-800",
    secondary: "from-emerald-50 to-green-50",
    accent: "bg-emerald-500",
    text: "text-emerald-600",
    lightBg: "from-emerald-50 to-green-100",
    darkBg: "from-emerald-900/20 to-green-800/20",
    border: "border-emerald-200 dark:border-emerald-700"
  },
  "Legal & Compliance": {
    primary: "from-purple-600 via-violet-700 to-indigo-800",
    secondary: "from-purple-50 to-violet-50",
    accent: "bg-purple-500",
    text: "text-purple-600",
    lightBg: "from-purple-50 to-violet-100",
    darkBg: "from-purple-900/20 to-violet-800/20",
    border: "border-purple-200 dark:border-purple-700"
  },
  "Procurement & Contracts": {
    primary: "from-teal-600 via-emerald-700 to-green-800",
    secondary: "from-teal-50 to-emerald-50",
    accent: "bg-teal-500",
    text: "text-teal-600",
    lightBg: "from-teal-50 to-emerald-100",
    darkBg: "from-teal-900/20 to-emerald-800/20",
    border: "border-teal-200 dark:border-teal-700"
  },
  "Corporate Communications": {
    primary: "from-pink-600 via-rose-700 to-red-800",
    secondary: "from-pink-50 to-rose-50",
    accent: "bg-pink-500",
    text: "text-pink-600",
    lightBg: "from-pink-50 to-rose-100",
    darkBg: "from-pink-900/20 to-rose-800/20",
    border: "border-pink-200 dark:border-pink-700"
  },
  "Business Development": {
    primary: "from-indigo-600 via-blue-700 to-cyan-800",
    secondary: "from-indigo-50 to-blue-50",
    accent: "bg-indigo-500",
    text: "text-indigo-600",
    lightBg: "from-indigo-50 to-blue-100",
    darkBg: "from-indigo-900/20 to-blue-800/20",
    border: "border-indigo-200 dark:border-indigo-700"
  },
  "Vigilance & Security": {
    primary: "from-red-600 via-rose-700 to-pink-800",
    secondary: "from-red-50 to-rose-50",
    accent: "bg-red-500",
    text: "text-red-600",
    lightBg: "from-red-50 to-rose-100",
    darkBg: "from-red-900/20 to-rose-800/20",
    border: "border-red-200 dark:border-red-700"
  },
  "Information Technology & Systems": {
    primary: "from-violet-600 via-purple-700 to-indigo-800",
    secondary: "from-violet-50 to-purple-50",
    accent: "bg-violet-500",
    text: "text-violet-600",
    lightBg: "from-violet-50 to-purple-100",
    darkBg: "from-violet-900/20 to-purple-800/20",
    border: "border-violet-200 dark:border-violet-700"
  },
  "Planning & Development": {
    primary: "from-lime-600 via-green-700 to-emerald-800",
    secondary: "from-lime-50 to-green-50",
    accent: "bg-lime-500",
    text: "text-lime-600",
    lightBg: "from-lime-50 to-green-100",
    darkBg: "from-lime-900/20 to-green-800/20",
    border: "border-lime-200 dark:border-lime-700"
  },
  "Environment & Sustainability": {
    primary: "from-green-600 via-emerald-700 to-teal-800",
    secondary: "from-green-50 to-emerald-50",
    accent: "bg-green-500",
    text: "text-green-600",
    lightBg: "from-green-50 to-emerald-100",
    darkBg: "from-green-900/20 to-emerald-800/20",
    border: "border-green-200 dark:border-green-700"
  },
  "Customer Relations & Services": {
    primary: "from-sky-600 via-blue-700 to-indigo-800",
    secondary: "from-sky-50 to-blue-50",
    accent: "bg-sky-500",
    text: "text-sky-600",
    lightBg: "from-sky-50 to-blue-100",
    darkBg: "from-sky-900/20 to-blue-800/20",
    border: "border-sky-200 dark:border-sky-700"
  },
  "Project Management": {
    primary: "from-orange-600 via-amber-700 to-yellow-800",
    secondary: "from-orange-50 to-amber-50",
    accent: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "from-orange-50 to-amber-100",
    darkBg: "from-orange-900/20 to-amber-800/20",
    border: "border-orange-200 dark:border-orange-700"
  },
  // Legacy department mappings (for backward compatibility)
  "Engineering": {
    primary: "from-blue-600 via-blue-700 to-indigo-800",
    secondary: "from-blue-50 to-indigo-50",
    accent: "bg-blue-500",
    text: "text-blue-600",
    lightBg: "from-blue-50 to-blue-100",
    darkBg: "from-blue-900/20 to-blue-800/20",
    border: "border-blue-200 dark:border-blue-700"
  },
  "HR": {
    primary: "from-emerald-600 via-green-700 to-teal-800",
    secondary: "from-emerald-50 to-green-50",
    accent: "bg-emerald-500",
    text: "text-emerald-600",
    lightBg: "from-emerald-50 to-green-100",
    darkBg: "from-emerald-900/20 to-green-800/20",
    border: "border-emerald-200 dark:border-emerald-700"
  },
  "Legal": {
    primary: "from-purple-600 via-violet-700 to-indigo-800",
    secondary: "from-purple-50 to-violet-50",
    accent: "bg-purple-500",
    text: "text-purple-600",
    lightBg: "from-purple-50 to-violet-100",
    darkBg: "from-purple-900/20 to-violet-800/20",
    border: "border-purple-200 dark:border-purple-700"
  },
  "Finance": {
    primary: "from-amber-600 via-yellow-700 to-orange-800",
    secondary: "from-amber-50 to-yellow-50",
    accent: "bg-amber-500",
    text: "text-amber-600",
    lightBg: "from-amber-50 to-yellow-100",
    darkBg: "from-amber-900/20 to-yellow-800/20",
    border: "border-amber-200 dark:border-amber-700"
  },
  "Safety": {
    primary: "from-red-600 via-rose-700 to-pink-800",
    secondary: "from-red-50 to-rose-50",
    accent: "bg-red-500",
    text: "text-red-600",
    lightBg: "from-red-50 to-rose-100",
    darkBg: "from-red-900/20 to-rose-800/20",
    border: "border-red-200 dark:border-red-700"
  },
  "Operations": {
    primary: "from-cyan-600 via-sky-700 to-blue-800",
    secondary: "from-cyan-50 to-sky-50",
    accent: "bg-cyan-500",
    text: "text-cyan-600",
    lightBg: "from-cyan-50 to-sky-100",
    darkBg: "from-cyan-900/20 to-sky-800/20",
    border: "border-cyan-200 dark:border-cyan-700"
  },
  "Procurement": {
    primary: "from-teal-600 via-emerald-700 to-green-800",
    secondary: "from-teal-50 to-emerald-50",
    accent: "bg-teal-500",
    text: "text-teal-600",
    lightBg: "from-teal-50 to-emerald-100",
    darkBg: "from-teal-900/20 to-emerald-800/20",
    border: "border-teal-200 dark:border-teal-700"
  },
  "Admin": {
    primary: "from-slate-600 via-gray-700 to-zinc-800",
    secondary: "from-slate-50 to-gray-50",
    accent: "bg-slate-500",
    text: "text-slate-600",
    lightBg: "from-slate-50 to-gray-100",
    darkBg: "from-slate-900/20 to-gray-800/20",
    border: "border-slate-200 dark:border-slate-700"
  },
  "Maintenance": {
    primary: "from-orange-600 via-red-700 to-rose-800",
    secondary: "from-orange-50 to-red-50",
    accent: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "from-orange-50 to-red-100",
    darkBg: "from-orange-900/20 to-red-800/20",
    border: "border-orange-200 dark:border-orange-700"
  },
  "Security": {
    primary: "from-indigo-600 via-purple-700 to-violet-800",
    secondary: "from-indigo-50 to-purple-50",
    accent: "bg-indigo-500",
    text: "text-indigo-600",
    lightBg: "from-indigo-50 to-purple-100",
    darkBg: "from-indigo-900/20 to-purple-800/20",
    border: "border-indigo-200 dark:border-indigo-700"
  }
}

// Transform API document data to FileRecord format
const transformDocumentToFileRecord = (doc: DocumentFromAPI): FileRecord => {
  // Safely parse the date with fallback
  const parseDate = (dateString: string): Date => {
    if (!dateString) return new Date()
    
    const parsedDate = new Date(dateString)
    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      console.warn(`Invalid date format: ${dateString}`)
      return new Date() // Return current date as fallback
    }
    return parsedDate
  }

  return {
    id: doc._id,
    name: doc.fileName || 'Untitled Document',
    category: doc.category || 'General',
    uploadDate: parseDate(doc.createdAt),
    status: "accepted", // For now, all documents from DB are considered accepted
    size: doc.fileSize || 0,
    uploadedBy: doc.uploadedBy?.name || 'Unknown User',
    downloadCount: 0, // This would need to be tracked separately
    classification: doc.classification || '',
    summary: doc.summary || '',
    detected_language: doc.detected_language || 'unknown'
  }
}

export const DepartmentFileHistory = ({ department, departmentId, filter = "all", onFileCountChange }: DepartmentFileHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "accepted" | "rejected">(filter)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [allFiles, setAllFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Get department theme
  const theme = departmentThemes[department as keyof typeof departmentThemes] || departmentThemes["Engineering"]
  
  // Fetch documents from database
  const fetchDocuments = async () => {
    if (!departmentId) {
      setError("Department ID is required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const documents = await documentAPI.getDocumentsByDepartment(departmentId)
      
      if (!Array.isArray(documents)) {
        console.warn("Documents response is not an array:", documents)
        setAllFiles([])
        return
      }
      
      const transformedFiles = documents.map(transformDocumentToFileRecord)
      setAllFiles(transformedFiles)
    } catch (err: any) {
      console.error("Failed to fetch documents:", err)
      
      let errorMessage = "Failed to load documents. Please try again."
      if (err?.response?.status === 404) {
        errorMessage = "Department not found."
      } else if (err?.response?.status === 403) {
        errorMessage = "You don't have permission to view documents from this department."
      } else if (err?.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setAllFiles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [departmentId])

  // Refresh function for manual refetch
  const handleRefresh = () => {
    fetchDocuments()
    // Also update the parent's file count
    if (onFileCountChange) {
      onFileCountChange()
    }
  }

  // Handler functions for document actions
  const handleViewDocument = async (documentId: string) => {
    try {
      // Get the document details first to get the file URL
      const document = await documentAPI.getDocumentById(documentId)
      
      if (document.fileUrl) {
        let fileUrl: string
        
        if (document.fileUrl.startsWith('http')) {
          // Already a complete URL
          fileUrl = document.fileUrl
        } else if (document.fileUrl.startsWith('/uploads/')) {
          // New format: relative path starting with /uploads/
          fileUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${document.fileUrl}`
        } else {
          // Old format: absolute file system path - extract filename and construct URL
          const filename = document.fileUrl.split(/[\\/]/).pop() || document.fileName
          fileUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/uploads/${filename}`
        }
        
        // Open the PDF in a new tab
        window.open(fileUrl, '_blank')
      } else {
        console.error("No file URL found for document:", documentId)
        // You could show a toast notification here
      }
    } catch (error) {
      console.error("Error viewing document:", error)
      // You could show an error toast notification here
    }
  }

  const handleDownloadDocument = async (documentId: string) => {
    try {
      // Method 1: Use dedicated download API endpoint (more robust)
      const downloadUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/documents/download/${documentId}`
      
      // Get document details for filename
      const docData = await documentAPI.getDocumentById(documentId)
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = docData.fileName || docData.title || 'document'
      link.target = '_blank'
      
      // Append to body, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log("Download initiated for:", docData.fileName || docData.title)
    } catch (error) {
      console.error("Error downloading document:", error)
      
      // Fallback: Try the old method with direct file URL
      try {
        const docData = await documentAPI.getDocumentById(documentId)
        
        if (docData.fileUrl) {
          let downloadUrl: string
          
          if (docData.fileUrl.startsWith('http')) {
            downloadUrl = docData.fileUrl
          } else if (docData.fileUrl.startsWith('/uploads/')) {
            downloadUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${docData.fileUrl}`
          } else {
            const filename = docData.fileUrl.split(/[\\/]/).pop() || docData.fileName
            downloadUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/uploads/${filename}`
          }
          
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = docData.fileName || docData.title || 'document'
          link.target = '_blank'
          
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          console.log("Fallback download initiated for:", docData.fileName || docData.title)
        }
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError)
        // You could show an error toast notification here
      }
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return
    }

    try {
      const currentUser = getUser()
      if (!currentUser?.id) {
        alert("You must be logged in to delete documents.")
        return
      }

      await documentAPI.deleteDocument(documentId, currentUser.id)
      
      // Remove the document from the local state
      setAllFiles(prevFiles => prevFiles.filter(file => file.id !== documentId))
      
      // Update the file count in parent component
      if (onFileCountChange) {
        onFileCountChange()
      }
    } catch (error) {
      console.error("Failed to delete document:", error)
      alert("Failed to delete document. Please try again.")
    }
  }
  
  const filteredFiles = useMemo(() => {
    return allFiles.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || file.status === statusFilter
      const matchesCategory = categoryFilter === "all" || file.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [allFiles, searchTerm, statusFilter, categoryFilter])

  const categories = Array.from(new Set(allFiles.map(file => file.category)))

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      accepted: "default",
      pending: "secondary",
      rejected: "destructive"
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className="capitalize">
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section - Now uses department theme colors */}
      <div className={`bg-gradient-to-br ${theme.primary} rounded-xl p-6 text-white shadow-2xl`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">
              {filter === "accepted" ? "Accepted Documents" : "Document History"}
            </h2>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="ghost"
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/40 transition-all duration-200"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <p className="text-white/90 font-medium">
          {filter === "accepted" 
            ? "View and download your approved documents"
            : "Track the status of all your submitted documents"
          }
        </p>
      </div>

      {/* Filters */}
      <Card className={`border-2 border-dashed ${theme.border} shadow-lg`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${theme.text}`}>
            <Filter className="h-5 w-5" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files, categories, or uploaders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | "pending" | "accepted" | "rejected")}>
              <SelectTrigger className="w-full sm:w-[150px] h-12">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-12">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      {filteredFiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`bg-gradient-to-br ${theme.lightBg} ${theme.darkBg} ${theme.border} shadow-lg`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${theme.text}`}>{filteredFiles.length}</div>
              <div className={`text-sm ${theme.text}`}>Total Files</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredFiles.filter(f => f.status === 'accepted').length}
              </div>
              <div className="text-sm text-green-600">Approved</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredFiles.filter(f => f.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-600">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredFiles.filter(f => f.status === 'rejected').length}
              </div>
              <div className="text-sm text-red-600">Rejected</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* File List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
            <CardContent className="p-12 text-center">
              <Loader className="mx-auto h-16 w-16 text-gray-400 mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading documents...</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Please wait while we fetch your documents
              </p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-2 border-dashed border-red-300 dark:border-red-600">
            <CardContent className="p-12 text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">Error loading documents</h3>
              <p className="text-red-500 dark:text-red-400 mb-4">
                {error}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-red-600 to-red-700"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : filteredFiles.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
            <CardContent className="p-12 text-center">
              <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No files found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your filters to see more results"
                  : "No documents have been uploaded to this department yet"}
              </p>
              {!searchTerm && statusFilter === "all" && categoryFilter === "all" && (
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {file.name}
                        </h3>
                        {getStatusIcon(file.status)}
                        {getStatusBadge(file.status)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {file.uploadedBy}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {file.uploadDate && !isNaN(file.uploadDate.getTime()) 
                            ? format(file.uploadDate, "MMM dd, yyyy")
                            : "Unknown date"
                          }
                        </span>
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {formatFileSize(file.size)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {file.category}
                        </Badge>
                        {file.classification && (
                          <Badge variant="secondary" className="text-xs">
                            {file.classification}
                          </Badge>
                        )}
                        {file.detected_language && file.detected_language !== 'unknown' && (
                          <Badge variant="outline" className="text-xs">
                            {file.detected_language.toUpperCase()}
                          </Badge>
                        )}
                        {file.downloadCount > 0 && (
                          <span className="flex items-center text-green-600">
                            <Download className="h-4 w-4 mr-1" />
                            {file.downloadCount} downloads
                          </span>
                        )}
                      </div>

                      {/* AI-Generated Summary */}
                      {file.summary && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
                          <div className="flex items-start space-x-2">
                            <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                                AI Summary
                              </p>
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                {file.summary}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {file.status === "rejected" && file.comments && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
                          <div className="flex items-start space-x-2">
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                                Document Rejected
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {file.comments}
                              </p>
                              {file.reviewedBy && file.reviewDate && (
                                <p className="text-xs text-red-500 dark:text-red-500 mt-2">
                                  Reviewed by {file.reviewedBy} on {
                                    file.reviewDate && !isNaN(file.reviewDate.getTime()) 
                                      ? format(file.reviewDate, "MMM dd, yyyy")
                                      : "Unknown date"
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {file.status === "accepted" && file.comments && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                                Document Approved
                              </p>
                              <p className="text-sm text-green-600 dark:text-green-400">
                                {file.comments}
                              </p>
                              {file.reviewedBy && file.reviewDate && (
                                <p className="text-xs text-green-500 dark:text-green-500 mt-2">
                                  Approved by {file.reviewedBy} on {
                                    file.reviewDate && !isNaN(file.reviewDate.getTime()) 
                                      ? format(file.reviewDate, "MMM dd, yyyy")
                                      : "Unknown date"
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => handleViewDocument(file.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                      onClick={() => handleDownloadDocument(file.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDeleteDocument(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}