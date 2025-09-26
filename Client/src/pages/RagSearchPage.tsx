import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  ExternalLink
} from "lucide-react"
import axiosInstance from "@/Utils/Auth/axiosInstance"
import { showToast } from "@/Utils/toaster"

interface SearchResult {
  _id: string
  title: string
  fileName: string
  fileType: string
  fileSize: number
  summary?: string
  uploadedBy: {
    name: string
    email: string
  }
  department: {
    name: string
  }
  createdAt: string
  tags?: string[]
}

interface SearchStats {
  totalResults: number
  searchTime: number
  queryComplexity: "simple" | "moderate" | "complex"
}

export function RagSearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<SearchStats | null>(null)
  const [recentSearches] = useState([
    "safety protocols metro operations",
    "employee training guidelines",
    "maintenance procedures",
    "budget reports 2024",
    "technical specifications"
  ])

  const handleSearch = async () => {
    if (!query.trim()) {
      showToast("Please enter a search query", "error")
      return
    }

    setLoading(true)
    const startTime = Date.now()

    try {
      const response = await axiosInstance.get("/api/documents/rag-search", {
        params: {
          query: query.trim(),
          topK: 10
        }
      })

      const searchTime = Date.now() - startTime
      const queryWords = query.trim().split(" ").length
      const complexity = queryWords <= 2 ? "simple" : queryWords <= 5 ? "moderate" : "complex"

      setResults(response.data.results || [])
      setStats({
        totalResults: response.data.results?.length || 0,
        searchTime: Math.round(searchTime / 10) * 10, // Round to nearest 10ms
        queryComplexity: complexity
      })

      if (response.data.results?.length === 0) {
        showToast("No documents found matching your query", "info")
      } else {
        showToast(`Found ${response.data.results.length} relevant documents`, "success")
      }

    } catch (error: any) {
      console.error("RAG search error:", error)
      const errorMessage = error.response?.data?.error || "Search failed. Please try again."
      showToast(errorMessage, "error")
      setResults([])
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    // Auto-trigger search after setting query
    setTimeout(() => handleSearch(), 100)
  }

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />
    if (fileType?.includes("word")) return <FileText className="h-5 w-5 text-blue-500" />
    if (fileType?.includes("excel")) return <FileText className="h-5 w-5 text-green-500" />
    if (fileType?.includes("image")) return <FileText className="h-5 w-5 text-purple-500" />
    return <FileText className="h-5 w-5 text-gray-500" />
  }

  const handlePreview = (documentId: string) => {
    window.open(`/api/documents/document-preview?documentId=${documentId}`, '_blank')
  }

  const handleDownload = (documentId: string, fileName: string) => {
    window.open(`/api/documents/download-document?documentId=${documentId}`, '_blank')
    showToast(`Downloading ${fileName}`, "success")
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300" style={{ marginLeft: '256px' }}>
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
                    <h1 className="text-4xl font-bold mb-2">Intelligent Document Search</h1>
                    <p className="text-blue-100 text-lg">Advanced RAG technology for deep content understanding</p>
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
                  <p className="text-sm text-blue-100 mb-3">Popular searches:</p>
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
                        <p className="text-sm font-medium text-blue-600">Results Found</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalResults}</p>
                      </div>
                      <Target className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Search Time</p>
                        <p className="text-2xl font-bold text-green-900">{stats.searchTime}ms</p>
                      </div>
                      <Clock className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Query Type</p>
                        <p className="text-lg font-bold text-purple-900 capitalize">{stats.queryComplexity}</p>
                      </div>
                      <Lightbulb className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">AI Powered</p>
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Searching...</h2>
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
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {results.length} documents found
                  </Badge>
                </div>

                <div className="grid gap-6">
                  {results.map((result, index) => (
                    <Card key={result._id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-white/70 backdrop-blur-sm hover:bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          {/* File Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                              {getFileIcon(result.fileType)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">
                                  {result.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                  {result.fileName}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-sm font-medium">{index + 1}</span>
                              </div>
                            </div>

                            {/* Summary */}
                            {result.summary && (
                              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                                {result.summary}
                              </p>
                            )}

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-1" />
                                {result.department.name}
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {result.uploadedBy.name}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(result.createdAt)}
                              </div>
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-1" />
                                {formatFileSize(result.fileSize)}
                              </div>
                            </div>

                            {/* Tags */}
                            {result.tags && result.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {result.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="outline" className="text-xs">
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
                                onClick={() => handlePreview(result._id)}
                                className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(result._id, result.fileName)}
                                className="hover:bg-green-50 hover:border-green-200 hover:text-green-600"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
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
                  We couldn't find any documents matching your search. Try different keywords or check your spelling.
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
                      Use natural language to search for specific content within documents.
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
                      Find documents based on meaning and context, not just keywords.
                    </p>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch("employee training guidelines")}
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
                      Advanced AI understands your queries and finds the most relevant content.
                    </p>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch("budget allocation reports")}
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
  )
}