import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Building2,
  Zap,
  Brain,
  Sparkles,
  Filter,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  BookOpen,
  Target,
  Lightbulb,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axiosInstance from "@/Utils/Auth/axiosInstance";
import { showToast } from "@/Utils/toaster";

interface SearchResult {
  _id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  summary?: string;
  uploadedBy: {
    name: string;
    email: string;
  };
  department: {
    name: string;
  };
  uploadedAt: string;
  createdAt?: string;
  tags?: string[];
}

interface SearchStats {
  totalResults: number;
  searchTime: number;
  queryComplexity: "simple" | "moderate" | "complex";
}

export function RagSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
  const [previewingFiles, setPreviewingFiles] = useState<Set<string>>(new Set());
  const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(new Set());
  const [recentSearches] = useState([
    "safety protocols metro operations",
    "employee training guidelines",
    "maintenance procedures",
    "budget reports 2024",
    "technical specifications",
  ]);

  const handleSearch = async () => {
    if (!query.trim()) {
      showToast("Please enter a search query", "error");
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await axiosInstance.get("/api/documents/rag-search", {
        params: {
          query: query.trim(),
          topK: 10,
        },
      });

      const searchTime = Date.now() - startTime;
      const queryWords = query.trim().split(" ").length;
      const complexity =
        queryWords <= 2 ? "simple" : queryWords <= 5 ? "moderate" : "complex";
      console.log("RAG search response:", response.data);
      
      // Filter out results with missing essential data
      const validResults = (response.data.results || []).filter((result: SearchResult) => 
        result && 
        result._id && 
        result.title && 
        result.fileName &&
        result.uploadedBy &&
        result.department
      );
      
      setResults(validResults);
      setStats({
        totalResults: validResults.length,
        searchTime: Math.round(searchTime / 10) * 10, // Round to nearest 10ms
        queryComplexity: complexity,
      });

      if (validResults.length === 0) {
        showToast("No documents found matching your query", "info");
      } else {
        showToast(
          `Found ${validResults.length} relevant documents`,
          "success"
        );
      }
    } catch (error: unknown) {
      console.error("RAG search error:", error);
      const errorMessage = error instanceof Error && 'response' in error && 
        typeof error.response === 'object' && error.response && 
        'data' in error.response && typeof error.response.data === 'object' && 
        error.response.data && 'error' in error.response.data
        ? String(error.response.data.error)
        : "Search failed. Please try again.";
      showToast(errorMessage, "error");
      setResults([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    // Auto-trigger search after setting query
    setTimeout(() => handleSearch(), 100);
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFileIcon = (fileType: string) => {
    if (!fileType) return <FileText className="h-5 w-5 text-gray-500" />;
    
    const type = fileType.toLowerCase();
    if (type.includes("pdf"))
      return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes("word") || type.includes("doc"))
      return <FileText className="h-5 w-5 text-blue-500" />;
    if (type.includes("excel") || type.includes("sheet") || type.includes("xls"))
      return <FileText className="h-5 w-5 text-green-500" />;
    if (type.includes("image") || type.includes("png") || type.includes("jpg") || type.includes("jpeg"))
      return <FileText className="h-5 w-5 text-purple-500" />;
    if (type.includes("text") || type.includes("txt"))
      return <FileText className="h-5 w-5 text-gray-600" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const getFileTypeDisplay = (fileType: string) => {
    if (!fileType) return "Unknown";
    
    const type = fileType.toLowerCase();
    if (type.includes("pdf")) return "PDF Document";
    if (type.includes("word") || type.includes("doc")) return "Word Document";
    if (type.includes("excel") || type.includes("sheet") || type.includes("xls")) return "Excel Spreadsheet";
    if (type.includes("image")) return "Image File";
    if (type.includes("text") || type.includes("txt")) return "Text File";
    return fileType;
  };

  const canPreview = (fileType: string) => {
    if (!fileType) return false;
    const type = fileType.toLowerCase();
    return type.includes("pdf") || type.includes("text") || type.includes("txt") || type.includes("image");
  };

  const handlePreview = async (documentId: string, fileName: string, fileType: string) => {
    if (!documentId) {
      showToast("Unable to preview: Document ID missing", "error");
      return;
    }

    if (!canPreview(fileType)) {
      showToast(`Preview not available for ${getFileTypeDisplay(fileType)}. Use download instead.`, "warning");
      return;
    }

    setPreviewingFiles(prev => new Set([...prev, documentId]));

    try {
      const previewUrl = `/api/documents/document-preview?documentId=${documentId}`;
      const previewWindow = window.open(previewUrl, "_blank", "width=1000,height=800,scrollbars=yes,resizable=yes");
      
      if (previewWindow) {
        showToast(`Opening preview for ${fileName}`, "info");
        
        // Check if the window was blocked
        setTimeout(() => {
          if (previewWindow.closed) {
            showToast("Preview window was blocked. Please allow popups and try again.", "warning");
          }
        }, 1000);
      } else {
        showToast("Preview window was blocked. Please allow popups and try again.", "warning");
      }
    } catch (error) {
      console.error("Preview error:", error);
      showToast("Failed to open preview", "error");
    } finally {
      setTimeout(() => {
        setPreviewingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(documentId);
          return newSet;
        });
      }, 2000);
    }
  };

  const handleDownload = async (documentId: string, fileName: string) => {
    if (!documentId) {
      showToast("Unable to download: Document ID missing", "error");
      return;
    }

    setDownloadingFiles(prev => new Set([...prev, documentId]));

    try {
      showToast(`Preparing download for ${fileName}...`, "info");
      
      // Use fetch to check if file exists first
      const downloadUrl = `/api/documents/download-document?documentId=${documentId}`;
      
      const response = await fetch(downloadUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`File not available (${response.status})`);
      }
      
      // Create a temporary link element for download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || 'download';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast(`Download started for ${fileName}`, "success");
    } catch (error) {
      console.error("Download error:", error);
      showToast(`Failed to download ${fileName}. File may not be available.`, "error");
    } finally {
      setTimeout(() => {
        setDownloadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(documentId);
          return newSet;
        });
      }, 3000);
    }
  };

  const toggleSummary = (documentId: string) => {
    setExpandedSummaries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(documentId)) {
        newSet.delete(documentId);
      } else {
        newSet.add(documentId);
      }
      return newSet;
    });
  };

  const handleQuickView = (result: SearchResult) => {
    if (!result) return;
    
    // Show document details in a modal-like toast or alert
    const details = `
Document: ${result.title || result.fileName}
Type: ${getFileTypeDisplay(result.fileType)}
Size: ${formatFileSize(result.fileSize)}
Department: ${result.department?.name || 'Unknown'}
Uploaded by: ${result.uploadedBy?.name || 'Unknown'}
Date: ${formatDate(result.uploadedAt || result.createdAt)}
${result.summary ? `Summary: ${result.summary.substring(0, 100)}...` : ''}
    `.trim();
    
    alert(details);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <Sidebar />
      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: "256px" }}
      >
        <Header
          title="RAG Search"
          description="AI-powered intelligent document search with deep content understanding"
          showAddButton={false}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Hero Search Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-8 text-white shadow-2xl">
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-16" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Brain className="h-10 w-10" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">
                      Intelligent Document Search
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Advanced RAG technology for deep content understanding
                    </p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-4xl">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/70" />
                    <Input
                      placeholder="Search for specific content, topics, or ask questions about your documents..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-16 pr-32 h-16 text-lg bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/50 rounded-2xl"
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={loading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white text-purple-600 hover:bg-white/90 rounded-xl h-10 px-6"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                          Searching...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 mr-2" />
                          Search
                        </div>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Quick Search Suggestions */}
                <div className="mt-6">
                  <p className="text-sm text-blue-100 mb-3">
                    Popular searches:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSearch(search)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-full text-xs"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Search Stats */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">
                          Results Found
                        </p>
                        <p className="text-2xl font-bold text-blue-900">
                          {stats.totalResults}
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          Search Time
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                          {stats.searchTime}ms
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">
                          Query Type
                        </p>
                        <p className="text-lg font-bold text-purple-900 capitalize">
                          {stats.queryComplexity}
                        </p>
                      </div>
                      <Lightbulb className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">
                          AI Powered
                        </p>
                        <p className="text-lg font-bold text-orange-900 flex items-center">
                          RAG <Sparkles className="h-4 w-4 ml-1" />
                        </p>
                      </div>
                      <Brain className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search Results */}
            {loading && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Searching...
                </h2>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                          <div className="flex space-x-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {results.length > 0 && !loading && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Search Results
                  </h2>
                  <div className="flex items-center space-x-3">
                    {results.some(r => r.summary) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const summaryResults = results.filter(r => r.summary).map(r => r._id);
                          if (expandedSummaries.size === summaryResults.length) {
                            setExpandedSummaries(new Set());
                          } else {
                            setExpandedSummaries(new Set(summaryResults));
                          }
                        }}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        {expandedSummaries.size === results.filter(r => r.summary).length 
                          ? "Collapse All" 
                          : "Expand All"
                        } Summaries
                      </Button>
                    )}
                    <div className="flex space-x-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {results.length} documents found
                      </Badge>
                      {results.filter(r => r.summary).length > 0 && (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                          {results.filter(r => r.summary).length} with AI summaries
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  {results.map((result, index) => (
                    <Card
                      key={result?._id}
                      className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-white/70 backdrop-blur-sm hover:bg-white"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          {/* File Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                              {getFileIcon(result?.fileType)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">
                                  {result?.title || result?.fileName || "Untitled Document"}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {result?.fileName || "Unknown file"}
                                  </p>
                                  <Badge variant="secondary" className="text-xs">
                                    {getFileTypeDisplay(result?.fileType)}
                                  </Badge>
                                  {canPreview(result?.fileType) && (
                                    <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                      Previewable
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-sm font-medium">
                                  #{index + 1}
                                </span>
                              </div>
                            </div>

                            {/* AI Summary - Collapsible */}
                            {result?.summary && (
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg mb-4 overflow-hidden">
                                <button
                                  onClick={() => toggleSummary(result._id)}
                                  className="w-full flex items-center justify-between p-3 hover:bg-blue-100/50 transition-colors"
                                >
                                  <div className="flex items-center space-x-2">
                                    <Brain className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-blue-800">AI Summary</span>
                                    <Sparkles className="h-3 w-3 text-blue-500" />
                                  </div>
                                  {expandedSummaries.has(result._id) ? (
                                    <ChevronUp className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-blue-600" />
                                  )}
                                </button>
                                
                                {expandedSummaries.has(result._id) && (
                                  <div className="px-3 pb-3 border-t border-blue-200/50">
                                    <p className="text-blue-800 text-sm leading-relaxed mt-2">
                                      {result.summary}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* File Info */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {getFileIcon(result?.fileType)}
                                  <span className="font-medium text-gray-700">
                                    {getFileTypeDisplay(result?.fileType)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <span>{formatFileSize(result?.fileSize)}</span>
                                  <span>•</span>
                                  <span>{formatDate(result?.uploadedAt || result?.createdAt)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                              {result?.department?.name && (
                                <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                                  <Building2 className="h-4 w-4 mr-1" />
                                  <span className="font-medium">{result.department.name}</span>
                                </div>
                              )}
                              {result?.uploadedBy?.name && (
                                <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
                                  <User className="h-4 w-4 mr-1" />
                                  <span className="font-medium">{result.uploadedBy.name}</span>
                                </div>
                              )}
                              <div className="flex items-center bg-green-50 px-2 py-1 rounded-md">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span className="font-medium">{formatDate(result?.uploadedAt || result?.createdAt)}</span>
                              </div>
                              <div className="flex items-center bg-purple-50 px-2 py-1 rounded-md">
                                <FileText className="h-4 w-4 mr-1" />
                                <span className="font-medium">{formatFileSize(result?.fileSize)}</span>
                              </div>
                            </div>

                            {/* Tags */}
                            {result?.tags && result?.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {result.tags
                                  .slice(0, 3)
                                  .map((tag, tagIndex) => (
                                    <Badge
                                      key={tagIndex}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                {result.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{result.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreview(result?._id, result?.fileName, result?.fileType)}
                                className={`${canPreview(result?.fileType) 
                                  ? "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600" 
                                  : "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={!canPreview(result?.fileType) || previewingFiles.has(result?._id)}
                              >
                                {previewingFiles.has(result?._id) ? (
                                  <>
                                    <Clock className="h-4 w-4 mr-1 animate-spin" />
                                    Opening...
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-1" />
                                    {canPreview(result?.fileType) ? "Preview" : "No Preview"}
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(result._id, result.fileName)}
                                className="hover:bg-green-50 hover:border-green-200 hover:text-green-600"
                                disabled={downloadingFiles.has(result._id)}
                              >
                                {downloadingFiles.has(result._id) ? (
                                  <>
                                    <Clock className="h-4 w-4 mr-1 animate-spin" />
                                    Downloading...
                                  </>
                                ) : (
                                  <>
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickView(result)}
                                className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Info
                              </Button>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && results.length === 0 && query && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No documents found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  We couldn't find any documents matching your search. Try
                  different keywords or check your spelling.
                </p>
              </div>
            )}

            {/* Getting Started */}
            {!loading && results.length === 0 && !query && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-900">
                      <BookOpen className="h-6 w-6 mr-2" />
                      Smart Search
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 mb-4">
                      Use natural language to search for specific content within
                      documents.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch("safety protocols")}
                      className="border-blue-300 text-blue-600 hover:bg-blue-100"
                    >
                      Try Example <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-900">
                      <Target className="h-6 w-6 mr-2" />
                      Semantic Search
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 mb-4">
                      Find documents based on meaning and context, not just
                      keywords.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleQuickSearch("employee training guidelines")
                      }
                      className="border-green-300 text-green-600 hover:bg-green-100"
                    >
                      Try Example <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-900">
                      <Brain className="h-6 w-6 mr-2" />
                      AI Powered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 mb-4">
                      Advanced AI understands your queries and finds the most
                      relevant content.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleQuickSearch("budget allocation reports")
                      }
                      className="border-purple-300 text-purple-600 hover:bg-purple-100"
                    >
                      Try Example <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
