import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  TrendingUp,
  Download,
  Eye,
  Filter
} from "lucide-react"

interface ImportantPoint {
  id: string
  department: string
  title: string
  summary: string
  priority: "high" | "medium" | "low"
  category: "compliance" | "safety" | "financial" | "operational" | "legal"
  extractedFrom: string
  timestamp: string
  actionRequired: boolean
  deadline?: string
}

const mockImportantPoints: ImportantPoint[] = [
  {
    id: "1",
    department: "Engineering",
    title: "Signal System Maintenance Required",
    summary: "Monthly inspection report indicates signal timing calibration needed on Line 1, Stations 5-8. Immediate attention required to maintain safety standards.",
    priority: "high",
    category: "safety",
    extractedFrom: "Monthly_Maintenance_Report_Nov2024.pdf",
    timestamp: "2 hours ago",
    actionRequired: true,
    deadline: "2024-12-15"
  },
  {
    id: "2", 
    department: "Finance",
    title: "Vendor Payment Approval Pending",
    summary: "Three vendor invoices totaling ₹2.4 Cr pending approval. Payment delays may impact supplier relationships and project timelines.",
    priority: "high",
    category: "financial",
    extractedFrom: "Vendor_Invoice_Summary_Dec2024.pdf",
    timestamp: "1 hour ago",
    actionRequired: true,
    deadline: "2024-12-10"
  },
  {
    id: "3",
    department: "Legal",
    title: "Environmental Clearance Renewal",
    summary: "Environmental clearance for Phase 2 extension expires on Dec 20, 2024. Renewal application submitted, awaiting government approval.",
    priority: "high", 
    category: "compliance",
    extractedFrom: "Legal_Compliance_Update_Dec2024.docx",
    timestamp: "3 hours ago",
    actionRequired: true,
    deadline: "2024-12-20"
  },
  {
    id: "4",
    department: "HR",
    title: "Annual Safety Training Completion",
    summary: "94% of operational staff completed mandatory safety training. 23 employees pending completion across Engineering and Operations departments.",
    priority: "medium",
    category: "compliance",
    extractedFrom: "HR_Training_Status_Dec2024.xlsx",
    timestamp: "4 hours ago",
    actionRequired: true,
    deadline: "2024-12-31"
  },
  {
    id: "5",
    department: "Operations",
    title: "Passenger Satisfaction Survey Results",
    summary: "Q4 passenger satisfaction improved to 4.2/5. Key improvement areas: cleanliness (4.8/5), punctuality (4.5/5), safety (4.9/5).",
    priority: "low",
    category: "operational",
    extractedFrom: "Passenger_Survey_Q4_2024.pdf",
    timestamp: "6 hours ago",
    actionRequired: false
  },
  {
    id: "6",
    department: "Safety",
    title: "Emergency Drill Performance Assessment",
    summary: "Station evacuation drill conducted at 8 stations. Average evacuation time: 4.2 minutes (target: <5 min). All stations passed safety protocols.",
    priority: "low",
    category: "safety",
    extractedFrom: "Emergency_Drill_Report_Dec2024.pdf",
    timestamp: "8 hours ago",
    actionRequired: false
  }
]

export function ImportantPoints() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-warning text-warning-foreground"
      case "low":
        return "bg-success text-success-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "safety":
        return <AlertTriangle className="h-4 w-4" />
      case "compliance":
        return <CheckCircle className="h-4 w-4" />
      case "financial":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const highPriorityCount = mockImportantPoints.filter(p => p.priority === "high").length
  const actionRequiredCount = mockImportantPoints.filter(p => p.actionRequired).length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{mockImportantPoints.length}</p>
              </div>
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-destructive">{highPriorityCount}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Action Required</p>
                <p className="text-2xl font-bold text-warning">{actionRequiredCount}</p>
              </div>
              <Clock className="h-6 w-6 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold text-success">78%</p>
              </div>
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            All Departments
          </Button>
          <Button variant="outline" size="sm">
            High Priority Only
          </Button>
          <Button variant="outline" size="sm">
            Action Required
          </Button>
        </div>
        <Button className="gradient-primary">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Important Points List */}
      <div className="space-y-4">
        {mockImportantPoints.map((point) => (
          <Card key={point.id} className="gradient-card hover:shadow-elevated transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {point.department}
                    </Badge>
                    <Badge className={getPriorityColor(point.priority)} variant="secondary">
                      {point.priority.toUpperCase()}
                    </Badge>
                    <div className="flex items-center text-muted-foreground">
                      {getCategoryIcon(point.category)}
                      <span className="ml-1 text-xs capitalize">{point.category}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">{point.title}</h3>
                  <p className="text-muted-foreground mb-3 leading-relaxed">{point.summary}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Extracted from: {point.extractedFrom}</span>
                      <span>•</span>
                      <span>{point.timestamp}</span>
                    </div>
                    
                    {point.deadline && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Deadline: </span>
                        <span className="font-medium text-warning">{point.deadline}</span>
                      </div>
                    )}
                  </div>
                  
                  {point.actionRequired && (
                    <div className="mt-3 p-3 bg-warning-light rounded-lg border border-warning/20">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-warning mr-2" />
                        <span className="text-sm font-medium text-warning">Action Required</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex flex-col space-y-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                  {point.actionRequired && (
                    <Button size="sm" className="gradient-primary">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}