import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  X,
  Globe,
  Languages,
  Info,
  Tag,
  CheckCircle,
  AlertCircle,
  Pause,
  Copy,
  Share2,
  Calendar,
  User,
  Building2,
  Archive,
  Sparkles,
  Star,
  Heart,
  Bookmark,
  Clock
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import axiosInstance from "@/Utils/Auth/axiosInstance"
import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
// Document interface based on backend schema
interface Document {
  _id: string;
  title: string;
  description?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  summary?: string;
  summary_ml?: string;
  originalText?: string;
  translatedText?: string;
  translated_text?: string;
  detectedLanguage?: string;
  detected_language?: string;
  classification: string;
  classification_labels?: string[];
  classification_scores?: number[];
  metadata?: any;
  tags?: string[];
  version?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  department: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  uploadedAt?: string;
}

interface DocumentsResponse {
  documents: Document[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDocuments: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<DocumentsResponse['pagination'] | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch documents from API
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(selectedDepartment && { department: selectedDepartment })
      });

      const response = await axiosInstance.get(`/api/documents/all?${params}`);
      
      if (response.data) {
        setDocuments(response.data.documents || []);
        setPagination(response.data.pagination || null);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to fetch documents. Please try again.",
        variant: "destructive"
      });
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedDepartment, toast]);

  // Fetch documents on component mount and when dependencies change
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Handle search with debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get file extension from fileName
  const getFileType = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || 'FILE';
  };

  // Handle document preview
  const handlePreview = async (documentId: string) => {
    try {
      window.open(`http://localhost:8000/api/documents/download/${documentId}`, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to preview document.",
        variant: "destructive"
      });
    }
  };

  // Handle document download
  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const response = await axiosInstance.get(`/api/documents/download/${documentId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "under_review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  // Handle viewing full document details
  const handleViewMore = (document: Document) => {
    setSelectedDocument(document)
    setIsModalOpen(true)
  }

  // Handle copying text to clipboard
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Success",
      description: "Text copied to clipboard",
    })
  }

  // Get status badge styling
  const getStatusBadgeStyle = (status?: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200'
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200'
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  // Get status icon
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />
      case 'REJECTED': return <AlertCircle className="h-4 w-4" />
      case 'PENDING': return <Pause className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300" style={{ marginLeft: '256px' }}>
        <Header 
          title="Documents" 
          description="Comprehensive document management across all departments"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6 space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => fetchDocuments()}>
                  <Filter className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading documents...</span>
              </div>
            )}

            {/* No Documents State */}
            {!loading && documents.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No documents found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
                </p>
              </div>
            )}

            {/* Enhanced Documents Grid */}
            {!loading && documents.length > 0 && (
              <div className="grid gap-8">
                {documents.map((document, index) => (
                  <Card 
                    key={document._id} 
                    className="group relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)'
                    }}
                  >
                    {/* Decorative gradient bar at top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-start justify-between">
                        {/* Left section with document info */}
                        <div className="flex items-start space-x-6 flex-1">
                          {/* Enhanced file icon */}
                          <div className="relative">
                            <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                              <FileText className="h-8 w-8 text-blue-600" />
                            </div>
                            {/* Status indicator dot */}
                            {document.status && (
                              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-md ${
                                document.status === 'APPROVED' ? 'bg-green-500' : 
                                document.status === 'PENDING' ? 'bg-yellow-500' : 'bg-gray-400'
                              }`}></div>
                            )}
                          </div>

                          {/* Document details */}
                          <div className="flex-1 min-w-0">
                            {/* Document title */}
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight">
                                {document.title || document.fileName}
                              </h3>
                            </div>

                            {/* Metadata badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <Building2 className="h-3 w-3 mr-1" />
                                {document.department?.name || document.classification}
                              </Badge>
                              <Badge className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <FileText className="h-3 w-3 mr-1" />
                                {getFileType(document.fileName)}
                              </Badge>
                              <Badge className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <Archive className="h-3 w-3 mr-1" />
                                {formatFileSize(document.fileSize)}
                              </Badge>
                              {(document.detected_language || document.detectedLanguage) && (
                                <Badge className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                                  <Globe className="h-3 w-3 mr-1" />
                                  {document.detected_language || document.detectedLanguage}
                                </Badge>
                              )}
                            </div>

                            {/* User and date info */}
                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-600" />
                                </div>
                                <span className="font-medium">{document.uploadedBy?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>Uploaded {formatDate(document.createdAt)}</span>
                              </div>
                              {document.createdAt !== document.updatedAt && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span>Modified {formatDate(document.updatedAt)}</span>
                                </div>
                              )}
                            </div>

                            {/* Document summary */}
                            {document.summary && (
                              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200 shadow-sm">
                                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                                  {document.summary}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right section with actions */}
                        <div className="flex flex-col items-end gap-4 ml-6">
                          {/* Status badge */}
                          {document.status && (
                            <Badge className={`px-3 py-1 font-medium shadow-md ${
                              document.status === 'APPROVED' 
                                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300' 
                                : document.status === 'PENDING' 
                                ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300'
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
                            }`}>
                              {getStatusIcon(document.status)}
                              <span className="ml-2 capitalize">{document.status.toLowerCase()}</span>
                            </Badge>
                          )}

                          {/* Action buttons */}
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewMore(document)}
                                title="View full details"
                                className="text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-0"
                              >
                                <BookOpen className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handlePreview(document._id)}
                                title="Preview document"
                                className="text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownload(document._id, document.fileName)}
                                title="Download document"
                                className="text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-0"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {/* Quick stats */}
                            <div className="text-right text-xs text-gray-500 mt-2">
                              <div className="flex items-center gap-1 justify-end">
                                <Sparkles className="h-3 w-3" />
                                <span>AI Processed</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    {/* Bottom accent line with animation */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalDocuments)} of {pagination.totalDocuments} documents
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={!pagination.hasPrevPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Upload Area */}
            {/* <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
              <CardContent className="p-12 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Documents
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Drag and drop files here, or click to browse
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </main>
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
                        {getStatusIcon(selectedDocument.status)}
                        <span className="ml-2">{selectedDocument.status}</span>
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
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      <span className="font-medium text-gray-900">English Summary</span>
                                    </div>
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
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
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
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                      <span className="font-medium text-gray-900">Malayalam Summary</span>
                                    </div>
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
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm font-malayalam">
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
                            onClick={() => handlePreview(selectedDocument._id)}
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
                            onClick={() => handleDownload(selectedDocument._id, selectedDocument.fileName)}
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
