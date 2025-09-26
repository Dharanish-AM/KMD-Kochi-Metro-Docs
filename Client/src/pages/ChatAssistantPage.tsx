import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  MessageSquare, 
  Clock,
  Database,
  FileText,
  TrendingUp,
  Calendar,
  Zap,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Mic,
  MicOff,
  Brain,
  Search,
  BarChart3,
  Shield,
  Activity,
  Globe,
  Lightbulb,
  Star,
  ChevronRight,
  Wand2,
  X,
  CheckCircle,
  Tag,
  Paperclip
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/layout/sidebar"
import axiosInstance from "@/Utils/Auth/axiosInstance"
import { useToast } from "@/hooks/use-toast"
interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isTyping?: boolean
  attachedDocuments?: Document[]
}

// Document interface based on backend schema
interface Document {
  _id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  summary?: string;
  classification: string;
  classification_labels?: string[];
  classification_scores?: number[];
  metadata?: any;
  translated_text?: string;
  detected_language?: string;
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

const suggestedPrompts = [
  {
    icon: Calendar,
    title: "Today's Summary",
    prompt: "Give me today's full summarization from the database",
    category: "Daily Report",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
  },
  {
    icon: TrendingUp,
    title: "Department Summary",
    prompt: "Get me today's summary for Engineering department",
    category: "Department",
    gradient: "from-green-500 to-blue-500",
    bgGradient: "from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"
  },
  {
    icon: FileText,
    title: "Recent Documents",
    prompt: "Show me all documents uploaded in the last 2 days",
    category: "Documents",
    gradient: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20"
  },
  {
    icon: Tag,
    title: "Tag & Analyze Documents",
    prompt: "Open document selector to tag and analyze documents",
    isAction: true,
    category: "AI Analysis",
    gradient: "from-purple-500 to-indigo-500",
    bgGradient: "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20"
  },
  {
    icon: Brain,
    title: "AI Document Analysis",
    prompt: "Analyze document patterns and provide insights",
    category: "AI Insights",
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20"
  },
  {
    icon: Shield,
    title: "Security Report",
    prompt: "Show me the latest security and compliance status",
    category: "Security",
    gradient: "from-blue-500 to-slate-600",
    bgGradient: "from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20"
  }
]

const aiFeatures = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Advanced document search with AI understanding"
  },
  {
    icon: BarChart3,
    title: "Analytics Engine",
    description: "Real-time insights and performance metrics"
  },
  {
    icon: Brain,
    title: "AI Processing",
    description: "Intelligent document analysis and categorization"
  },
  {
    icon: Shield,
    title: "Security Monitor",
    description: "Continuous security and compliance tracking"
  }
]

export default function ChatAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentLoading, setDocumentLoading] = useState(false)
  const [showDocumentSelector, setShowDocumentSelector] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([])
  const [documentSearchTerm, setDocumentSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const documentScrollRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch all available documents (with option to filter by recent dates)
  const fetchDocuments = async (recentOnly = false) => {
    try {
      setDocumentLoading(true)
      
      const params = new URLSearchParams({
        page: '1',
        limit: '100', // Fetch more documents
        ...(recentOnly && (() => {
          const currentDate = new Date()
          const weekAgo = new Date(currentDate)
          weekAgo.setDate(weekAgo.getDate() - 7) // Last 7 days instead of just 2
          return {
            fromDate: weekAgo.toISOString().split('T')[0],
            toDate: currentDate.toISOString().split('T')[0]
          }
        })())
      })

      const response = await axiosInstance.get(`/api/documents/all?${params}`)
      
      if (response.data) {
        setDocuments(response.data.documents || [])
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "Failed to fetch documents. Please try again.",
        variant: "destructive"
      })
      setDocuments([])
    } finally {
      setDocumentLoading(false)
    }
  }

  // Load documents on component mount
  useEffect(() => {
    fetchDocuments(false) // Fetch all documents, not just recent ones
  }, [])

  // Scroll to top when search term changes
  useEffect(() => {
    if (documentScrollRef.current) {
      documentScrollRef.current.scrollTop = 0
    }
  }, [documentSearchTerm])

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(documentSearchTerm.toLowerCase()) ||
    doc.fileName.toLowerCase().includes(documentSearchTerm.toLowerCase()) ||
    doc.classification.toLowerCase().includes(documentSearchTerm.toLowerCase()) ||
    doc.department?.name.toLowerCase().includes(documentSearchTerm.toLowerCase())
  )

  // Toggle document selection
  const toggleDocumentSelection = (document: Document) => {
    setSelectedDocuments(prev => {
      const isSelected = prev.some(doc => doc._id === document._id)
      if (isSelected) {
        return prev.filter(doc => doc._id !== document._id)
      } else {
        return [...prev, document]
      }
    })
  }

  // Remove selected document
  const removeSelectedDocument = (documentId: string) => {
    setSelectedDocuments(prev => prev.filter(doc => doc._id !== documentId))
  }

  // Handle @ symbol detection for document tagging
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    // Check if user typed @ and show document selector
    if (value.includes('@') && !showDocumentSelector) {
      setShowDocumentSelector(true)
    }
    
    // Extract search term after @
    const atIndex = value.lastIndexOf('@')
    if (atIndex !== -1) {
      const searchAfterAt = value.substring(atIndex + 1)
      if (searchAfterAt.length > 0) {
        setDocumentSearchTerm(searchAfterAt)
      }
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Helper function to detect summary requests
  const detectSummaryRequest = (message: string) => {
    const lowerMessage = message.toLowerCase()
    
    // Today's summary patterns
    if ((lowerMessage.includes('today') || lowerMessage.includes('today\'s')) && 
        (lowerMessage.includes('summary') || lowerMessage.includes('summarize') || lowerMessage.includes('summarization'))) {
      return 'today_summary'
    }
    
    // Department-specific summary patterns
    const departmentMatch = lowerMessage.match(/(?:from|for|of|in)\s+(\w+)\s+(?:department|dept)/i)
    if (departmentMatch && (lowerMessage.includes('summary') || lowerMessage.includes('summarize'))) {
      return { type: 'department_summary', department: departmentMatch[1] }
    }
    
    // Date range summary patterns
    if (lowerMessage.includes('summary') && (lowerMessage.includes('week') || lowerMessage.includes('month'))) {
      return 'period_summary'
    }
    
    return null
  }

  // Enhanced function to handle summary requests
  const handleSummaryRequest = async (summaryType: any, messageContent: string) => {
    try {
      let endpoint = '/api/documents/chat-assistant'
      let requestData = { message: messageContent }
      
      // Handle different summary types
      if (summaryType === 'today_summary') {
        // For today's summary, we'll let the backend handle the logic
        requestData.message = "Give me today's full summarization from the database"
      } else if (typeof summaryType === 'object' && summaryType.type === 'department_summary') {
        // For department-specific summary
        requestData.message = `Give me today's summary for ${summaryType.department} department`
      } else if (summaryType === 'period_summary') {
        // For period-based summary
        requestData.message = messageContent // Use original message
      }

      const response = await axiosInstance.post(endpoint, requestData)
      return response
    } catch (error) {
      throw error
    }
  }

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim()
    if (!messageContent) return

    // Create user message with attached documents
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date(),
      attachedDocuments: selectedDocuments.length > 0 ? [...selectedDocuments] : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setSelectedDocuments([])
    setShowDocumentSelector(false)
    setIsLoading(true)

    try {
      let response
      
      // Check if there are selected documents - if ANY documents are selected, use Groq API
      if (selectedDocuments.length > 0) {
        // Use Groq API for document-based analysis
        const documentContext = selectedDocuments.map(doc => ({
          title: doc.title || doc.fileName,
          summary: doc.summary,
          content: doc.translated_text,
          classification: doc.classification,
          department: doc.department?.name,
          metadata: doc.metadata
        }))

        response = await axiosInstance.post('/api/documents/groq-analysis', {
          message: messageContent,
          documents: documentContext,
          requestType: 'document_analysis'
        })
      } else {
        // Check if this is a summary request
        const summaryType = detectSummaryRequest(messageContent)
        
        if (summaryType) {
          // Handle summary requests specially
          response = await handleSummaryRequest(summaryType, messageContent)
        } else {
          // Regular chat assistant for general queries
          response = await axiosInstance.post('/api/documents/chat-assistant', {
            message: messageContent,
            attachedDocuments: selectedDocuments.length > 0 ? selectedDocuments.map(doc => doc._id) : undefined
          })
        }
      }

      const data = response.data

      if (response.status === 200) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || data.analysis || data.summary,
          role: 'assistant',
          timestamp: new Date(data.timestamp || new Date())
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      let errorText = "I'm sorry, I'm experiencing some technical difficulties. Please try again in a moment. 🔧"
      
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data
        errorText = errorData?.error || errorData?.message || `Server error: ${error.response.status}`
      } else if (error.request) {
        // Request made but no response received
        errorText = "Unable to connect to the AI assistant. Please check your connection. 🌐"
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorText,
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    // Implement speech recognition here
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <div className="relative border-b border-border bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-cyan-50/80 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-cyan-950/50 backdrop-blur-xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-200/20 dark:bg-cyan-800/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-xl">
                  <Bot className="h-6 w-6 text-white animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 border-3 border-background rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  KMRL IntelliBot
                </h1>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <p className="text-sm text-muted-foreground font-medium">Advanced AI Document Intelligence System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">AI Online</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-blue-200/50 dark:border-blue-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => {
                  setMessages([])
                  setInputValue('')
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex-1 flex flex-col relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-cyan-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-cyan-950/20">
                <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-200/15 dark:bg-cyan-800/8 rounded-full blur-3xl animate-float-delayed"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/10 dark:bg-indigo-800/5 rounded-full blur-3xl animate-pulse"></div>
              </div>

              <div className="relative flex-1 flex flex-col items-center justify-center p-8 z-10">
                <div className="text-center max-w-4xl">
                  {/* Hero Section */}
                  <div className="relative mb-8">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-2xl"></div>
                    <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-2xl border-4 border-white/20 dark:border-slate-800/20">
                      <Wand2 className="h-12 w-12 text-white animate-pulse" />
                      <div className="absolute -top-2 -right-2">
                        <Star className="h-6 w-6 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                    </div>
                  </div>

                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                    Welcome to KMRL IntelliBot
                  </h2>
                  <p className="text-muted-foreground mb-4 text-xl max-w-2xl mx-auto">
                    Your advanced AI companion for intelligent document analysis, real-time insights, and organizational excellence.
                  </p>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {aiFeatures.map((feature, index) => {
                      const Icon = feature.icon
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300/70 dark:hover:border-blue-600/70 transition-all duration-200 group"
                        >
                          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature.title}</span>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Suggested Prompts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {suggestedPrompts.map((prompt, index) => {
                      const Icon = prompt.icon
                      return (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-xl border border-blue-200/50 dark:border-blue-700/30 hover:border-blue-300/70 dark:hover:border-blue-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5"
                        >
                          {/* Gradient Background */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${prompt.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                          
                          <Button
                            variant="ghost"
                            className="relative w-full h-auto p-6 text-left border-0 bg-transparent hover:bg-transparent"
                            onClick={() => {
                              if (prompt.isAction) {
                                setShowDocumentSelector(true)
                              } else {
                                handleSendMessage(prompt.prompt)
                              }
                            }}
                          >
                            <div className="flex items-start space-x-4 w-full">
                              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${prompt.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                <Icon className="h-6 w-6 text-white" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <Sparkles className="h-2 w-2 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200 truncate flex-1">
                                    {prompt.title}
                                  </h3>
                                  <div className="flex items-center space-x-1 flex-shrink-0">
                                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 whitespace-nowrap">
                                      {prompt.category}
                                    </Badge>
                                    <ChevronRight className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                                  </div>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 pr-2">
                                  {prompt.isAction 
                                    ? "Click to open document selector and start tagging documents for analysis"
                                    : prompt.prompt
                                  }
                                </p>
                              </div>
                            </div>
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-8 p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-700/30">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
                      <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Connected to Live KMRL Database
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Real-time data • Intelligent insights • Secure access • 24/7 availability
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Messages Area
            <ScrollArea className="flex-1 p-4 chat-scroll">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start space-x-4",
                      message.role === 'user' ? "flex-row-reverse space-x-reverse" : ""
                    )}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2",
                      message.role === 'user' 
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-200 dark:border-blue-700" 
                        : "bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 border-indigo-200 dark:border-indigo-700"
                    )}>
                      {message.role === 'user' ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={cn(
                      "flex-1 max-w-3xl",
                      message.role === 'user' ? "text-right" : ""
                    )}>
                      <div className={cn(
                        "rounded-2xl p-5 shadow-lg relative",
                        message.role === 'user'
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white ml-16 border border-blue-300/50"
                          : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/30 mr-16"
                      )}>
                        {/* Message indicator */}
                        {message.role === 'assistant' && (
                          <div className="absolute -left-3 top-4 w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                        )}
                        
                        <div className={cn(
                          "prose prose-sm max-w-none",
                          message.role === 'user' 
                            ? "prose-invert" 
                            : "dark:prose-invert prose-blue"
                        )}>
                          {message.content.split('\n').map((line, i) => (
                            <div key={i} className={message.role === 'user' ? 'text-white' : ''}>
                              {line}
                              {i < message.content.split('\n').length - 1 && <br />}
                            </div>
                          ))}
                        </div>
                        
                        {/* Show attached documents for user messages */}
                        {message.role === 'user' && message.attachedDocuments && message.attachedDocuments.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Paperclip className="h-3 w-3 text-white/80" />
                              <span className="text-xs text-white/80 font-medium">
                                Attached Documents ({message.attachedDocuments.length})
                              </span>
                            </div>
                            <div className="space-y-1">
                              {message.attachedDocuments.map((doc) => (
                                <div key={doc._id} className="flex items-center gap-2 bg-white/10 rounded px-2 py-1">
                                  <FileText className="h-3 w-3 text-white/80" />
                                  <span className="text-xs text-white/90">{doc.title || doc.fileName}</span>
                                  <Badge variant="secondary" className="text-xs bg-white/20 text-white/80">
                                    {doc.department?.name || doc.classification}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Message Actions */}
                      {message.role === 'assistant' && (
                        <div className="flex items-center space-x-2 mt-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content)}
                            className="h-6 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                          <div className="text-xs text-muted-foreground ml-2">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg border-2 border-indigo-200 dark:border-indigo-700">
                      <Bot className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/30 rounded-2xl p-5 mr-16 shadow-lg relative">
                      <div className="absolute -left-3 top-4 w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Brain className="h-3 w-3 text-white animate-pulse" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">IntelliBot is analyzing your request...</span>
                        <Wand2 className="h-4 w-4 text-blue-500 animate-spin" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          {/* Selected Documents Display */}
          {selectedDocuments.length > 0 && (
            <div className="border-t border-blue-200/50 dark:border-blue-700/30 bg-blue-50/50 dark:bg-blue-950/30 p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-3">
                  <Paperclip className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Attached Documents ({selectedDocuments.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDocuments.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-2 text-sm"
                    >
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{doc.title || doc.fileName}</span>
                      <Badge variant="secondary" className="text-xs">
                        {doc.department?.name || doc.classification}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                        onClick={() => removeSelectedDocument(doc._id)}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Document Selector Popup */}
          {showDocumentSelector && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-200/50 dark:border-blue-700/30 w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-slide-in-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Tag className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Select Documents to Tag
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose documents to include in your AI analysis
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowDocumentSelector(false)
                      setDocumentSearchTerm('')
                    }}
                    className="rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search documents by title, filename, department, or content..."
                      value={documentSearchTerm}
                      onChange={(e) => setDocumentSearchTerm(e.target.value)}
                      className="pl-10 h-12 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </div>
                </div>

                {/* Stats and Actions */}
                <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Database className="h-4 w-4" />
                      {documents.length} total documents
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      {selectedDocuments.length} selected
                    </span>
                    {documentLoading && (
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        Loading...
                      </span>
                    )}
                    {filteredDocuments.length > 5 && (
                      <span className="text-xs text-blue-500 dark:text-blue-400">
                        ↕️ Scroll to see more
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchDocuments(true)}
                      disabled={documentLoading}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Recent Only
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchDocuments(false)}
                      disabled={documentLoading}
                    >
                      <Database className="h-4 w-4 mr-1" />
                      All Documents
                    </Button>
                  </div>
                </div>

                {/* Document List */}
                <div className="flex-1 overflow-hidden min-h-0">
                  <div ref={documentScrollRef} className="h-full overflow-y-auto p-4 space-y-3 document-selector-scroll">
                    {filteredDocuments.map((doc) => {
                      const isSelected = selectedDocuments.some(selected => selected._id === doc._id)
                      return (
                        <div
                          key={doc._id}
                          className={cn(
                            "group flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                            isSelected 
                              ? "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-300 dark:border-blue-600 shadow-md" 
                              : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                          )}
                          onClick={() => toggleDocumentSelection(doc)}
                        >
                          {/* Selection Checkbox */}
                          <div className={cn(
                            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-1",
                            isSelected 
                              ? "bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-500 shadow-lg" 
                              : "border-gray-300 dark:border-gray-600 group-hover:border-blue-400"
                          )}>
                            {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                          </div>
                          
                          {/* Document Icon */}
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                            isSelected 
                              ? "bg-gradient-to-br from-blue-500 to-cyan-500" 
                              : "bg-gray-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20"
                          )}>
                            <FileText className={cn(
                              "h-6 w-6",
                              isSelected ? "text-white" : "text-blue-500"
                            )} />
                          </div>
                          
                          {/* Document Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {doc.title || doc.fileName}
                              </h4>
                              <div className="flex gap-1 flex-shrink-0">
                                <Badge 
                                  variant="secondary" 
                                  className={cn(
                                    "text-xs",
                                    isSelected 
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                  )}
                                >
                                  {doc.department?.name || doc.classification}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {doc.uploadedBy?.name || 'Unknown'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(doc.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Database className="h-3 w-3" />
                                {formatFileSize(doc.fileSize)}
                              </span>
                              {doc.detected_language && (
                                <Badge variant="outline" className="h-5 text-xs">
                                  {doc.detected_language}
                                </Badge>
                              )}
                            </div>
                            
                            {doc.summary && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2">
                                {doc.summary}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    
                    {filteredDocuments.length === 0 && !documentLoading && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No documents found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                          {documentSearchTerm 
                            ? `No documents match "${documentSearchTerm}". Try adjusting your search terms.`
                            : 'No documents are available. Upload some documents to get started.'
                          }
                        </p>
                        {documentSearchTerm && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDocumentSearchTerm('')}
                            className="mt-4"
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    )}

                    {documentLoading && (
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 animate-pulse">
                            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedDocuments.length > 0 && (
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} selected
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDocumentSelector(false)
                        setDocumentSearchTerm('')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setShowDocumentSelector(false)
                        setDocumentSearchTerm('')
                        if (selectedDocuments.length > 0) {
                          inputRef.current?.focus()
                        }
                      }}
                      disabled={selectedDocuments.length === 0}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Attach {selectedDocuments.length} Document{selectedDocuments.length !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="relative border-t border-blue-200/50 dark:border-blue-700/30 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-cyan-50/80 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-cyan-950/50 backdrop-blur-xl">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-2 right-20 w-16 h-16 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-2 left-20 w-20 h-20 bg-cyan-200/15 dark:bg-cyan-800/8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative max-w-4xl mx-auto p-6">
              <div className="relative flex items-center space-x-3">
                <div className="flex-1 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything: today's summary, department summaries, document analysis... Use @ to tag documents"
                    className="relative pr-16 h-14 text-base rounded-2xl border-2 border-blue-200/50 dark:border-blue-700/30 focus:border-blue-400 dark:focus:border-blue-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg focus:shadow-xl transition-all duration-200 placeholder:text-slate-400"
                    disabled={isLoading}
                  />
                  
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full"
                      onClick={() => setShowDocumentSelector(true)}
                      title="Attach documents"
                    >
                      <Paperclip className="h-4 w-4 text-blue-500 hover:text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full"
                      onClick={toggleListening}
                      title="Voice input"
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
                      ) : (
                        <Mic className="h-4 w-4 text-blue-500 hover:text-blue-600" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="relative h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 hover:from-blue-600 hover:via-indigo-600 hover:to-cyan-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-blue-300/50 dark:border-blue-600/50 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <Send className="h-5 w-5 mr-2 relative z-10" />
                  <span className="relative z-10 font-semibold">Send</span>
                </Button>
              </div>
              
              <div className="flex items-center justify-center mt-4 space-x-6 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-blue-500" />
                  <span>Powered by KMRL IntelliBot</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-3 w-3 text-indigo-500" />
                  <span>Real-time Database Access</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3 text-cyan-500" />
                  <span>Secure & Encrypted</span>
                </div>
              </div>
              
              <div className="text-center mt-2 text-xs text-slate-400">
                Press <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Enter</kbd> to send • 
                <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs ml-1">Shift+Enter</kbd> for new line
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}