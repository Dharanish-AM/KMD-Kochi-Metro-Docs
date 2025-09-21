import { useState, useMemo } from "react"
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
  Upload
} from "lucide-react"
import { format } from "date-fns"

interface DepartmentFileHistoryProps {
  department: string
  filter?: "all" | "pending" | "accepted" | "rejected"
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
}

// Department theme configuration
const departmentThemes = {
  "Engineering": {
    primary: "from-blue-600 via-blue-700 to-indigo-800",
    accent: "bg-blue-500",
    text: "text-blue-600",
    lightBg: "from-blue-50 to-blue-100",
    darkBg: "from-blue-900/20 to-blue-800/20",
    border: "border-blue-200 dark:border-blue-700"
  },
  "HR": {
    primary: "from-emerald-600 via-green-700 to-teal-800",
    accent: "bg-emerald-500",
    text: "text-emerald-600",
    lightBg: "from-emerald-50 to-green-100",
    darkBg: "from-emerald-900/20 to-green-800/20",
    border: "border-emerald-200 dark:border-emerald-700"
  },
  "Legal": {
    primary: "from-purple-600 via-violet-700 to-indigo-800",
    accent: "bg-purple-500",
    text: "text-purple-600",
    lightBg: "from-purple-50 to-violet-100",
    darkBg: "from-purple-900/20 to-violet-800/20",
    border: "border-purple-200 dark:border-purple-700"
  },
  "Finance": {
    primary: "from-amber-600 via-yellow-700 to-orange-800",
    accent: "bg-amber-500",
    text: "text-amber-600",
    lightBg: "from-amber-50 to-yellow-100",
    darkBg: "from-amber-900/20 to-yellow-800/20",
    border: "border-amber-200 dark:border-amber-700"
  },
  "Safety": {
    primary: "from-red-600 via-rose-700 to-pink-800",
    accent: "bg-red-500",
    text: "text-red-600",
    lightBg: "from-red-50 to-rose-100",
    darkBg: "from-red-900/20 to-rose-800/20",
    border: "border-red-200 dark:border-red-700"
  },
  "Operations": {
    primary: "from-cyan-600 via-sky-700 to-blue-800",
    accent: "bg-cyan-500",
    text: "text-cyan-600",
    lightBg: "from-cyan-50 to-sky-100",
    darkBg: "from-cyan-900/20 to-sky-800/20",
    border: "border-cyan-200 dark:border-cyan-700"
  },
  "Procurement": {
    primary: "from-teal-600 via-emerald-700 to-green-800",
    accent: "bg-teal-500",
    text: "text-teal-600",
    lightBg: "from-teal-50 to-emerald-100",
    darkBg: "from-teal-900/20 to-emerald-800/20",
    border: "border-teal-200 dark:border-teal-700"
  },
  "Admin": {
    primary: "from-slate-600 via-gray-700 to-zinc-800",
    accent: "bg-slate-500",
    text: "text-slate-600",
    lightBg: "from-slate-50 to-gray-100",
    darkBg: "from-slate-900/20 to-gray-800/20",
    border: "border-slate-200 dark:border-slate-700"
  },
  "Maintenance": {
    primary: "from-orange-600 via-red-700 to-rose-800",
    accent: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "from-orange-50 to-red-100",
    darkBg: "from-orange-900/20 to-red-800/20",
    border: "border-orange-200 dark:border-orange-700"
  },
  "Security": {
    primary: "from-indigo-600 via-purple-700 to-violet-800",
    accent: "bg-indigo-500",
    text: "text-indigo-600",
    lightBg: "from-indigo-50 to-purple-100",
    darkBg: "from-indigo-900/20 to-purple-800/20",
    border: "border-indigo-200 dark:border-indigo-700"
  }
}

// Mock data for file history
const generateMockFiles = (department: string): FileRecord[] => {
  const baseFiles = [
    {
      id: "1",
      name: "Q4_Financial_Report_2024.pdf",
      category: "Financial Reports",
      uploadDate: new Date(2024, 11, 15),
      status: "accepted" as const,
      size: 2048576,
      uploadedBy: "John Doe",
      reviewedBy: "Admin User",
      reviewDate: new Date(2024, 11, 16),
      comments: "Report approved with minor formatting suggestions",
      downloadCount: 12
    },
    {
      id: "2",
      name: "Employee_Handbook_Updated.docx",
      category: "Policies",
      uploadDate: new Date(2024, 11, 14),
      status: "pending" as const,
      size: 1536000,
      uploadedBy: "Jane Smith",
      downloadCount: 0
    },
    {
      id: "3",
      name: "Safety_Protocol_Rev3.pdf",
      category: "Safety Protocols",
      uploadDate: new Date(2024, 11, 13),
      status: "rejected" as const,
      size: 3072000,
      uploadedBy: "Mike Wilson",
      reviewedBy: "Admin User",
      reviewDate: new Date(2024, 11, 14),
      comments: "Document needs revision - missing section 4.2",
      downloadCount: 2
    },
    {
      id: "4",
      name: "Project_Specifications.xlsx",
      category: "Specifications",
      uploadDate: new Date(2024, 11, 12),
      status: "accepted" as const,
      size: 512000,
      uploadedBy: "Sarah Johnson",
      reviewedBy: "Admin User",
      reviewDate: new Date(2024, 11, 13),
      downloadCount: 8
    },
    {
      id: "5",
      name: "Training_Materials_2024.pptx",
      category: "Training Materials",
      uploadDate: new Date(2024, 11, 11),
      status: "pending" as const,
      size: 4096000,
      uploadedBy: "Robert Brown",
      downloadCount: 0
    },
    {
      id: "6",
      name: "Incident_Report_Nov2024.pdf",
      category: "Incident Reports",
      uploadDate: new Date(2024, 11, 10),
      status: "accepted" as const,
      size: 1024000,
      uploadedBy: "Emily Davis",
      reviewedBy: "Admin User",
      reviewDate: new Date(2024, 11, 11),
      downloadCount: 5
    }
  ]

  return baseFiles
}

export const DepartmentFileHistory = ({ department, filter = "all" }: DepartmentFileHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "accepted" | "rejected">(filter)
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  // Get department theme
  const theme = departmentThemes[department as keyof typeof departmentThemes] || departmentThemes["Engineering"]
  
  const allFiles = generateMockFiles(department)
  
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
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <FileText className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">
            {filter === "accepted" ? "Accepted Documents" : "Document History"}
          </h2>
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
        {filteredFiles.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
            <CardContent className="p-12 text-center">
              <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No files found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your filters to see more results"
                  : "Upload your first document to get started"}
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
                          {format(file.uploadDate, "MMM dd, yyyy")}
                        </span>
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {formatFileSize(file.size)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {file.category}
                        </Badge>
                        {file.downloadCount > 0 && (
                          <span className="flex items-center text-green-600">
                            <Download className="h-4 w-4 mr-1" />
                            {file.downloadCount} downloads
                          </span>
                        )}
                      </div>

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
                                  Reviewed by {file.reviewedBy} on {format(file.reviewDate, "MMM dd, yyyy")}
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
                                  Approved by {file.reviewedBy} on {format(file.reviewDate, "MMM dd, yyyy")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {file.status === "accepted" && (
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    {file.status === "pending" && (
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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