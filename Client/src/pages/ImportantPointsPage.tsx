import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Lightbulb,
  Search,
  Filter,
  FileText,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Download,
  Share2,
  BookOpen,
  Target,
  Shield,
  Zap
} from "lucide-react"

interface ImportantPoint {
  id: string
  title: string
  titleMl?: string
  description: string
  descriptionMl?: string
  department: string
  documentName: string
  documentId: string
  category: "safety" | "procedure" | "policy" | "regulation" | "guideline" | "warning" | "requirement" | "security"
  priority: "high" | "medium" | "low"
  extractedDate: string
  tags: string[]
  pageNumber?: number
  confidence: number
}

const mockImportantPoints: ImportantPoint[] = [
  {
    id: "1",
    title: "Track Section A3-B7 Signal Malfunction",
    titleMl: "ട്രാക്ക് സെക്ഷൻ A3-B7 സിഗ്നൽ തകരാർ",
    description: "Signal control system between Aluva and Kalamassery stations experiencing intermittent failures. Manual override required for train operations. Speed restriction: 25 km/h maximum.",
    descriptionMl: "ആലുവയിലും കളമശ്ശേരിയിലും ഇടയിലുള്ള സിഗ്നൽ കൺട്രോൾ സിസ്റ്റത്തിൽ ഇടവിട്ടുള്ള തകരാറുകൾ. ട്രയിൻ ഓപ്പറേഷനുകൾക്ക് മാനുവൽ ഓവർറൈഡ് ആവശ്യം. വേഗത പരിമിതി: പരമാവധി 25 കി.മീ/മണിക്കൂർ.",
    department: "Signal & Telecommunications",
    documentName: "Daily Operations Report - Track A3-B7",
    documentId: "doc_001",
    category: "safety",
    priority: "high",
    extractedDate: "2024-01-15T10:30:00Z",
    tags: ["signal-failure", "speed-restriction", "manual-override", "track-a3-b7"],
    pageNumber: 2,
    confidence: 0.95
  },
  {
    id: "2",
    title: "Train BR-204 Brake System Alert",
    titleMl: "ട്രയിൻ BR-204 ബ്രേക്ക് സിസ്റ്റം അലേർട്ട്",
    description: "Regenerative braking system showing 15% efficiency reduction. Train certified for operation but requires 20% longer stopping distance. Route approval needed for high-speed sections.",
    descriptionMl: "റീജനറേറ്റീവ് ബ്രേക്കിംഗ് സിസ്റ്റത്തിൽ 15% കാര്യക്ഷമത കുറവ്. ട്രയിൻ പ്രവർത്തനത്തിന് സാക്ഷ്യപ്പെടുത്തിയെങ്കിലും 20% കൂടുതൽ സ്റ്റോപ്പിംഗ് ദൂരം ആവശ്യം. ഹൈ-സ്പീഡ് സെക്ഷനുകൾക്ക് റൂട്ട് അനുമതി ആവശ്യം.",
    department: "Rolling Stock Maintenance",
    documentName: "Train Inspection Report BR-204",
    documentId: "doc_002",
    category: "warning",
    priority: "high",
    extractedDate: "2024-01-14T14:20:00Z",
    tags: ["brake-system", "efficiency-reduction", "stopping-distance", "br-204"],
    pageNumber: 8,
    confidence: 0.92
  },
  {
    id: "3",
    title: "Monsoon Water Logging - Kochi Metro Line",
    titleMl: "കൊച്ചി മെട്രോ ലൈനിൽ മൺസൂൺ വെള്ളക്കെട്ട്",
    description: "Track sections between Thaikoodam and Ernakulam Town prone to water logging during heavy rainfall (>50mm/hr). Train operations suspended when water level exceeds 150mm on tracks.",
    descriptionMl: "തൈക്കൂടത്തിനും എറണാകുളം ടൗണിനും ഇടയിലുള്ള ട്രാക്ക് സെക്ഷനുകളിൽ കനത്ത മഴയിൽ (>50mm/hr) വെള്ളക്കെട്ട് സാധ്യത. ട്രാക്കിൽ വെള്ളത്തിന്റെ അളവ് 150mm കവിയുമ്പോൾ ട്രയിൻ ഓപ്പറേഷൻ താൽക്കാലികമായി നിർത്തും.",
    department: "Track Maintenance",
    documentName: "Monsoon Preparedness Report 2024",
    documentId: "doc_003",
    category: "regulation",
    priority: "medium",
    extractedDate: "2024-01-13T09:15:00Z",
    tags: ["water-logging", "monsoon", "track-suspension", "rainfall-limit"],
    pageNumber: 12,
    confidence: 0.88
  },
  {
    id: "4",
    title: "Power Supply Voltage Fluctuation Zone 3",
    titleMl: "പവർ സപ്ലൈ വോൾട്ടേജ് ഫ്ലക്ച്വേഷൻ സോൺ 3",
    description: "Electrical supply in Zone 3 (MG Road to Edappally) showing voltage fluctuations between 22.5kV-24.8kV. All trains must operate at reduced power (80% capacity) until stabilization.",
    descriptionMl: "സോൺ 3-ൽ (എം.ജി. റോഡ് മുതൽ ഇടപ്പള്ളി വരെ) ഇലക്ട്രിക്കൽ സപ്ലൈയിൽ 22.5kV-24.8kV വോൾട്ടേജ് ഫ്ലക്ച്വേഷൻ. സ്ഥിരത വരുന്നതുവരെ എല്ലാ ട്രയിനുകളും കുറഞ്ഞ പവറിൽ (80% കപ്പാസിറ്റി) പ്രവർത്തിക്കണം.",
    department: "Electrical Systems",
    documentName: "Power Grid Status Report",
    documentId: "doc_004",
    category: "requirement",
    priority: "high",
    extractedDate: "2024-01-12T16:45:00Z",
    tags: ["voltage-fluctuation", "reduced-power", "zone-3", "electrical-supply"],
    pageNumber: 5,
    confidence: 0.94
  },
  {
    id: "5",
    title: "Platform Door System Malfunction - Kaloor Station",
    titleMl: "കളൂർ സ്റ്റേഷനിൽ പ്ലാറ്റ്‌ഫോം ഡോർ സിസ്റ്റം തകരാർ",
    description: "Platform Screen Door (PSD) at Kaloor station Platform 2 has 3 doors non-operational. Station master approval required for each train departure. Manual safety protocol in effect.",
    descriptionMl: "കളൂർ സ്റ്റേഷൻ പ്ലാറ്റ്‌ഫോം 2-ൽ പ്ലാറ്റ്‌ഫോം സ്ക്രീൻ ഡോർ (PSD) യുടെ 3 വാതിലുകൾ പ്രവർത്തനരഹിതം. ഓരോ ട്രയിൻ പുറപ്പെടലിനും സ്റ്റേഷൻ മാസ്റ്റർ അനുമതി ആവശ്യം. മാനുവൽ സുരക്ഷാ പ്രോട്ടോക്കോൾ പ്രാബല്യത്തിൽ.",
    department: "Station Operations",
    documentName: "Station Safety Checklist - Kaloor",
    documentId: "doc_005",
    category: "safety",
    priority: "high",
    extractedDate: "2024-01-11T11:30:00Z",
    tags: ["platform-doors", "manual-approval", "kaloor-station", "safety-protocol"],
    pageNumber: 3,
    confidence: 0.91
  }
]

const departments = [
  "All Departments", 
  "Signal & Telecommunications", 
  "Rolling Stock Maintenance", 
  "Track Maintenance", 
  "Electrical Systems", 
  "Station Operations", 
  "Control Center Operations", 
  "Track Safety Systems", 
  "Environmental Control", 
  "Tunnel Safety", 
  "Overhead Line Equipment"
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "safety", label: "Safety", icon: Shield },
  { value: "procedure", label: "Procedures", icon: BookOpen },
  { value: "policy", label: "Policies", icon: FileText },
  { value: "regulation", label: "Regulations", icon: AlertTriangle },
  { value: "guideline", label: "Guidelines", icon: Target },
  { value: "requirement", label: "Requirements", icon: CheckCircle },
  { value: "warning", label: "Warnings", icon: Zap },
  { value: "security", label: "Security", icon: Shield }
]

export function ImportantPointsPage() {
  const { language, t } = useLanguage()
  const [points, setPoints] = useState<ImportantPoint[]>(mockImportantPoints)
  const [filteredPoints, setFilteredPoints] = useState<ImportantPoint[]>(mockImportantPoints)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")

  useEffect(() => {
    let filtered = points

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(point =>
        point.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by department
    if (selectedDepartment !== "All Departments") {
      filtered = filtered.filter(point => point.department === selectedDepartment)
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(point => point.category === selectedCategory)
    }

    // Filter by priority
    if (selectedPriority !== "all") {
      filtered = filtered.filter(point => point.priority === selectedPriority)
    }

    setFilteredPoints(filtered)
  }, [points, searchQuery, selectedDepartment, selectedCategory, selectedPriority])

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.value === category)
    return categoryData?.icon || FileText
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "safety":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "procedure":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "policy":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "regulation":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "guideline":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "requirement":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "security":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const stats = {
    total: points.length,
    high: points.filter(p => p.priority === "high").length,
    safety: points.filter(p => p.category === "safety").length,
    recent: points.filter(p => {
      const pointDate = new Date(p.extractedDate)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return pointDate > weekAgo
    }).length
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: '256px' }}>
        <Header title="Important Points" />
        <main className="p-6 space-y-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg p-6 border mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t('train.operational.intelligence')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('critical.operational.data')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <LanguageSwitcher />
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    {t('route.clearance.report')}
                  </Button>
                  <Button>
                    <Share2 className="h-4 w-4 mr-2" />
                    {t('share.control.center')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('total.issues')}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('critical.alerts')}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.high}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('safety.concerns')}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.safety}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('active.alerts')}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.recent}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('search')}</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder={t('search.placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('department')}</label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <Building2 className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('category')}</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('priority')}</label>
                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                      <SelectTrigger>
                        <Star className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('all.priorities')}</SelectItem>
                        <SelectItem value="high">{t('high.priority')}</SelectItem>
                        <SelectItem value="medium">{t('medium.priority')}</SelectItem>
                        <SelectItem value="low">{t('low.priority')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Points List */}
            <div className="space-y-4">
              {filteredPoints.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No important points found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try adjusting your filters or search terms
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredPoints.map((point) => {
                  const CategoryIcon = getCategoryIcon(point.category)
                  return (
                    <Card key={point.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(point.category)}`}>
                              <CategoryIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {language === 'ml' && point.titleMl ? point.titleMl : point.title}
                                </h3>
                                <Badge className={getPriorityColor(point.priority)}>
                                  {point.priority}
                                </Badge>
                                <Badge className={getCategoryColor(point.category)}>
                                  {point.category}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 dark:text-gray-300 mb-3">
                                {language === 'ml' && point.descriptionMl ? point.descriptionMl : point.description}
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-4 w-4" />
                                  {point.department}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  {point.documentName}
                                </span>
                                {point.pageNumber && (
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" />
                                    Page {point.pageNumber}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(point.extractedDate)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {point.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <div className="text-right">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
                              <p className="text-sm font-medium">{Math.round(point.confidence * 100)}%</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>

            {/* Load More */}
            {filteredPoints.length > 0 && (
              <div className="text-center mt-6">
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Load More Points
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ImportantPointsPageWithProvider() {
  return (
    <LanguageProvider>
      <ImportantPointsPage />
    </LanguageProvider>
  )
}
