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
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <FileText className="h-8 w-8" />
          <h2 className="text-2xl font-bold">
            {filter === "accepted" ? "Accepted Documents" : "Document History"}
          </h2>
        </div>
        <p className="text-purple-100">
          {filter === "accepted" 
            ? "View and download your approved documents"
            : "Track the status of all your submitted documents"
          }
        </p>
      </div>

      {/* Filters */}
      <Card className="border-2 border-dashed border-purple-200 dark:border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-600">
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
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredFiles.length}</div>
              <div className="text-sm text-blue-600">Total Files</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
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