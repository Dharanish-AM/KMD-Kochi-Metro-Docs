import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  RefreshCw,
  BookOpen,
  Info,
  Tag,
  Sparkles,
  Building2,
  Archive,
  Globe,
  Languages,
  Copy,
  Share2,
  Heart,
  Bookmark,
  Star
} from "lucide-react"
import { format } from "date-fns"
import { documentAPI, type DocumentFromAPI } from "@/lib/api"
import { getUser } from "@/Utils/Auth/token"
import { useToast } from "@/hooks/use-toast"
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
  const [selectedDocument, setSelectedDocument] = useState<DocumentFromAPI | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()
  
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
      // Use the download endpoint to view the document
      const downloadUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/documents/download/${documentId}`
      window.open(downloadUrl, '_blank')
    } catch (error) {
      console.error("Error opening document:", error)
      toast({
        title: "Error",
        description: "Failed to open document",
        variant: "destructive"
      })
    }
  }

  // Handle viewing full document details
  const handleViewMore = async (fileId: string) => {
    try {
      console.log("Fetching document details for ID:", fileId)
      const document = await documentAPI.getDocumentById(fileId)
      console.log("Document fetched successfully:", document)
      setSelectedDocument(document)
      setIsModalOpen(true)
    } catch (error: any) {
      console.error("Error fetching document details:", error)
      console.error("Error response:", error.response?.data)
      console.error("Error status:", error.response?.status)
      
      let errorMessage = "Failed to load document details"
      if (error.response?.status === 404) {
        errorMessage = "Document not found"
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid document ID"
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  // Handle copying text to clipboard
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Success",
      description: "Text copied to clipboard",
    })
  }

  const handleDownloadDocument = async (documentId: string) => {
    try {
      // Use the download API endpoint
      const downloadUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/documents/download/${documentId}`
      
      // Get document details for filename
      const docData = await documentAPI.getDocumentById(documentId)
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = docData.fileName || docData.title || 'document'
      
      // Append to body, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Success",
        description: `Download started for ${docData.fileName || docData.title}`,
      })
    } catch (error) {
      console.error("Error downloading document:", error)
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      })
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

  // Format date with error handling
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  // Get file extension from fileName
  const getFileType = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || 'FILE'
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

                      {/* AI-Generated Summary - Collapsible */}
                      {file.summary && (
                        <div className="mb-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const summaryElement = document.getElementById(`summary-${file.id}`)
                              const isHidden = summaryElement?.style.display === 'none'
                              if (summaryElement) {
                                summaryElement.style.display = isHidden ? 'block' : 'none'
                              }
                              const chevron = document.getElementById(`chevron-${file.id}`)
                              if (chevron) {
                                chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)'
                              }
                            }}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 h-auto"
                          >
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-medium">AI Summary</span>
                            <svg 
                              id={`chevron-${file.id}`}
                              className="h-4 w-4 transition-transform duration-200" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                              style={{ transform: 'rotate(0deg)' }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </Button>
                          <div 
                            id={`summary-${file.id}`}
                            className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mt-2 transition-all duration-300"
                            style={{ display: 'none' }}
                          >
                            <div className="flex items-start space-x-2">
                              <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                                  {file.summary}
                                </p>
                              </div>
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
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      onClick={() => handleViewMore(file.id)}
                      title="View full details"
                    >
                      <BookOpen className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => handleViewDocument(file.id)}
                      title="Preview document"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                      onClick={() => handleDownloadDocument(file.id)}
                      title="Download document"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDeleteDocument(file.id)}
                      title="Delete document"
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

      {/* Enhanced Document Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 bg-gradient-to-br from-white via-slate-50 to-blue-50 border-0 shadow-2xl">
          {/* Beautiful Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            
            <div className="relative p-8">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-2xl font-bold text-white mb-2 leading-tight">
                        {selectedDocument?.title || selectedDocument?.fileName}
                      </DialogTitle>
                      <div className="flex items-center gap-4 text-blue-100 text-sm">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {selectedDocument?.department?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {selectedDocument && getFileType(selectedDocument.fileName)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {selectedDocument?.uploadedBy?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  {selectedDocument?.status && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1">
                        {selectedDocument.status === 'APPROVED' && <CheckCircle className="h-4 w-4 mr-2" />}
                        {selectedDocument.status === 'PENDING' && <Clock className="h-4 w-4 mr-2" />}
                        {selectedDocument.status === 'REJECTED' && <XCircle className="h-4 w-4 mr-2" />}
                        <span>{selectedDocument.status}</span>
                      </Badge>
                    </div>
                  )}
                </div>
                
                <DialogDescription className="text-blue-100 mt-4 text-base">
                  Comprehensive document analysis with AI-powered insights and multilingual support
                </DialogDescription>
                
                {/* Quick Stats Row */}
                <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2 text-blue-100">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Created {selectedDocument && formatDate(selectedDocument.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Archive className="h-4 w-4" />
                    <span className="text-sm">{selectedDocument && formatFileSize(selectedDocument.fileSize)}</span>
                  </div>
                  {(selectedDocument?.detectedLanguage || selectedDocument?.detected_language) && (
                    <div className="flex items-center gap-2 text-blue-100">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">{selectedDocument.detectedLanguage || selectedDocument.detected_language}</span>
                    </div>
                  )}
                </div>
              </DialogHeader>
            </div>
          </div>

          {selectedDocument && (
            <div className="p-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-gray-200/50">
                  <TabsTrigger 
                    value="overview" 
                    className="flex items-center gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
                  >
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="content" 
                    className="flex items-center gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Content</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="metadata" 
                    className="flex items-center gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
                  >
                    <Tag className="h-4 w-4" />
                    <span className="hidden sm:inline">Metadata</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="actions" 
                    className="flex items-center gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Actions</span>
                  </TabsTrigger>
                </TabsList>

                {/* Enhanced Overview Tab */}
                <TabsContent value="overview" className="mt-8">
                  <ScrollArea className="h-[55vh] pr-4">
                    <div className="space-y-8">
                      {/* Document Header Card */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {selectedDocument.title || selectedDocument.fileName}
                            </h3>
                            {selectedDocument.description && (
                              <p className="text-gray-600 leading-relaxed">
                                {selectedDocument.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Key Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* File Type Card */}
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">File Type</span>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">{getFileType(selectedDocument.fileName)}</p>
                        </div>

                        {/* File Size Card */}
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Archive className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">File Size</span>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">{formatFileSize(selectedDocument.fileSize)}</p>
                        </div>

                        {/* Version Card */}
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Star className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Version</span>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">v{selectedDocument.version || 1}</p>
                        </div>
                      </div>

                      {/* Department & User Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Department Card */}
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-orange-100 rounded-xl">
                              <Building2 className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Department</h4>
                              <p className="text-sm text-gray-500">Document owner</p>
                            </div>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">{selectedDocument.department?.name}</p>
                        </div>

                        {/* Uploaded By Card */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-emerald-100 rounded-xl">
                              <User className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Uploaded By</h4>
                              <p className="text-sm text-gray-500">Document author</p>
                            </div>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">{selectedDocument.uploadedBy?.name}</p>
                        </div>
                      </div>

                      {/* Timeline Information */}
                      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                        <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-6">
                          <Clock className="h-5 w-5 text-blue-600" />
                          Document Timeline
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Created</p>
                              <p className="text-base font-semibold text-gray-900">{formatDate(selectedDocument.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                              <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Last Modified</p>
                              <p className="text-base font-semibold text-gray-900">{formatDate(selectedDocument.updatedAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags Section */}
                      {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                          <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                            <Tag className="h-5 w-5 text-indigo-600" />
                            Tags & Labels
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedDocument.tags.map((tag, index) => (
                              <Badge 
                                key={index} 
                                className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200 hover:from-indigo-200 hover:to-purple-200 transition-all duration-300"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Enhanced Content Tab */}
                <TabsContent value="content" className="mt-8">
                  <ScrollArea className="h-[55vh] pr-4">
                    <div className="space-y-8">
                      {/* Language Detection Card */}
                      {(selectedDocument.detectedLanguage || selectedDocument.detected_language) && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <Globe className="h-5 w-5 text-emerald-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Language Detection</h4>
                          </div>
                          <Badge className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-md">
                            {selectedDocument.detectedLanguage || selectedDocument.detected_language}
                          </Badge>
                        </div>
                      )}

                      {/* Enhanced Summary Section */}
                      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                          <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            AI-Generated Summaries
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">Intelligent document analysis in multiple languages</p>
                        </div>
                        
                        <div className="p-6">
                          <Tabs defaultValue="english" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1 rounded-xl">
                              <TabsTrigger 
                                value="english" 
                                className="flex items-center gap-2 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                              >
                                <Globe className="h-4 w-4" />
                                English Summary
                              </TabsTrigger>
                              <TabsTrigger 
                                value="malayalam" 
                                className="flex items-center gap-2 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                              >
                                <Languages className="h-4 w-4" />
                                Malayalam Summary
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="english" className="mt-6">
                              {selectedDocument.summary ? (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-medium text-gray-900">English Summary</h5>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleCopyText(selectedDocument.summary!)}
                                      className="hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200"
                                    >
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy
                                    </Button>
                                  </div>
                                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                                    <p className="text-gray-800 leading-relaxed">
                                      {selectedDocument.summary}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-12">
                                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="h-10 w-10 text-gray-400" />
                                  </div>
                                  <h5 className="font-medium text-gray-900 mb-2">No English Summary Available</h5>
                                  <p className="text-gray-500 text-sm">This document hasn't been processed for English summarization yet.</p>
                                </div>
                              )}
                            </TabsContent>

                            <TabsContent value="malayalam" className="mt-6">
                              {selectedDocument.summary_ml ? (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-medium text-gray-900">Malayalam Summary</h5>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleCopyText(selectedDocument.summary_ml!)}
                                      className="hover:bg-emerald-50 hover:border-emerald-200 transition-colors duration-200"
                                    >
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy
                                    </Button>
                                  </div>
                                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6 shadow-sm">
                                    <p className="text-gray-800 leading-relaxed">
                                      {selectedDocument.summary_ml}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-12">
                                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Languages className="h-10 w-10 text-gray-400" />
                                  </div>
                                  <h5 className="font-medium text-gray-900 mb-2">No Malayalam Summary Available</h5>
                                  <p className="text-gray-500 text-sm">This document hasn't been processed for Malayalam summarization yet.</p>
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>

                      {/* Original Text Section */}
                      {selectedDocument.originalText && (
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                  <FileText className="h-4 w-4 text-yellow-600" />
                                </div>
                                <h5 className="font-semibold text-gray-900">Original Text</h5>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCopyText(selectedDocument.originalText!)}
                                className="hover:bg-yellow-50 hover:border-yellow-200 transition-colors duration-200"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="max-h-48 overflow-y-auto bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-100">
                              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                                {selectedDocument.originalText}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Translated Text Section */}
                      {(selectedDocument.translatedText || selectedDocument.translated_text) && (
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <Languages className="h-4 w-4 text-green-600" />
                                </div>
                                <h5 className="font-semibold text-gray-900">Translated Text</h5>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCopyText(selectedDocument.translatedText || selectedDocument.translated_text!)}
                                className="hover:bg-green-50 hover:border-green-200 transition-colors duration-200"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="max-h-48 overflow-y-auto bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                                {selectedDocument.translatedText || selectedDocument.translated_text}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Metadata Tab */}
                <TabsContent value="metadata" className="mt-6">
                  <ScrollArea className="h-[50vh]">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">Document ID</label>
                          <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded font-mono">
                            {selectedDocument._id}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">Classification</label>
                          <p className="text-gray-700">{selectedDocument.classification}</p>
                        </div>
                      </div>

                      {/* Classification Labels */}
                      {selectedDocument.classification_labels && selectedDocument.classification_labels.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">Classification Labels</label>
                          <div className="flex flex-wrap gap-2">
                            {selectedDocument.classification_labels.map((label, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {label}
                                {selectedDocument.classification_scores?.[index] && 
                                  ` (${(selectedDocument.classification_scores[index] * 100).toFixed(1)}%)`
                                }
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Metadata */}
                      {selectedDocument.metadata && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">Additional Metadata</label>
                          <div className="bg-gray-50 border rounded-lg p-4">
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                              {JSON.stringify(selectedDocument.metadata, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* File Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">File Name</label>
                          <p className="text-gray-700 text-sm font-mono bg-gray-100 p-2 rounded">
                            {selectedDocument.fileName}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">File URL</label>
                          <p className="text-gray-500 text-xs font-mono bg-gray-100 p-2 rounded truncate">
                            {selectedDocument.fileUrl}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Enhanced Actions Tab */}
                <TabsContent value="actions" className="mt-8">
                  <ScrollArea className="h-[55vh] pr-4">
                    <div className="space-y-8">
                      {/* Primary Actions */}
                      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-6">
                          <Sparkles className="h-5 w-5 text-orange-600" />
                          Quick Actions
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button 
                            onClick={() => handleViewDocument(selectedDocument._id)}
                            className="flex items-center justify-center gap-3 p-6 h-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <div className="p-2 bg-white/20 rounded-lg">
                              <Eye className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold">Preview Document</div>
                              <div className="text-xs opacity-90">View in browser</div>
                            </div>
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleDownloadDocument(selectedDocument._id)}
                            className="flex items-center justify-center gap-3 p-6 h-auto border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105"
                          >
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <Download className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-emerald-700">Download</div>
                              <div className="text-xs text-emerald-600">Save to device</div>
                            </div>
                          </Button>
                        </div>
                      </div>

                      {/* Secondary Actions */}
                      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-6">
                          <Share2 className="h-5 w-5 text-purple-600" />
                          Share & Copy
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button 
                            variant="outline"
                            onClick={() => handleCopyText(selectedDocument._id)}
                            className="flex items-center justify-start gap-3 p-4 h-auto border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all duration-300"
                          >
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Copy className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-purple-700">Copy Document ID</div>
                              <div className="text-xs text-purple-600">For reference</div>
                            </div>
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              const shareUrl = `${window.location.origin}/documents/${selectedDocument._id}`
                              handleCopyText(shareUrl)
                            }}
                            className="flex items-center justify-start gap-3 p-4 h-auto border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300"
                          >
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Share2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-blue-700">Copy Share Link</div>
                              <div className="text-xs text-blue-600">Share with others</div>
                            </div>
                          </Button>
                        </div>
                      </div>

                      {/* Document Intelligence Summary */}
                      <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 rounded-xl border border-indigo-100 p-6">
                        <h4 className="flex items-center gap-2 font-semibold text-indigo-900 mb-4">
                          <Sparkles className="h-5 w-5 text-indigo-600" />
                          AI Analysis Summary
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${selectedDocument.summary ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                              <span className="text-sm font-medium text-indigo-800">
                                Summary Generation: {selectedDocument.summary ? 'Complete' : 'Pending'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${selectedDocument.detectedLanguage || selectedDocument.detected_language ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                              <span className="text-sm font-medium text-indigo-800">
                                Language Detection: {selectedDocument.detectedLanguage || selectedDocument.detected_language || 'Not detected'}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${selectedDocument.translatedText || selectedDocument.translated_text ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                              <span className="text-sm font-medium text-indigo-800">
                                Translation: {selectedDocument.translatedText || selectedDocument.translated_text ? 'Available' : 'Not available'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${selectedDocument.status === 'APPROVED' ? 'bg-green-400' : selectedDocument.status === 'PENDING' ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                              <span className="text-sm font-medium text-indigo-800">
                                Status: {selectedDocument.status || 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}