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
  TrendingUp
} from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ImportantPoint {
  id: string
  title: string
  description: string
  department: string
  category: "safety" | "procedure" | "policy" | "regulation" | "guideline" | "warning" | "requirement"
  priority: "high" | "medium" | "low"
  extractedDate: string
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "safety":
        return <Shield className="h-4 w-4" />
      case "procedure":
        return <FileText className="h-4 w-4" />
      case "requirement":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Train Operations Monitor</CardTitle>
              <CardDescription>Critical alerts affecting train route clearance</CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/important-points")}
            className="text-blue-600 hover:text-blue-700"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
            <div className="text-lg font-bold text-red-600 dark:text-red-400">5</div>
            <div className="text-xs text-red-600 dark:text-red-400">Critical Issues</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">3</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Route Alerts</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">10</div>
            <div className="text-xs text-green-600 dark:text-green-400">Active Checks</div>
          </div>
        </div>

        {/* Recent Points */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Active Operational Alerts
          </h4>
          {recentImportantPoints.map((point) => (
            <div key={point.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-600 dark:text-blue-400">
                    {getCategoryIcon(point.category)}
                  </div>
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {point.title}
                  </h5>
                </div>
                <Badge className={`${getPriorityColor(point.priority)} text-xs`}>
                  {point.priority}
                </Badge>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                {point.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Building2 className="h-3 w-3 mr-1" />
                  {point.department}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(point.extractedDate)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => navigate("/important-points")}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            View All Train Alerts
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => navigate("/important-points?priority=high")}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Critical Route Issues
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
