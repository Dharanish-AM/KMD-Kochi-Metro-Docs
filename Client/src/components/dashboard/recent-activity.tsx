import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Upload, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface ActivityItem {
  id: string
  type: "upload" | "review" | "alert" | "complete"
  title: string
  description: string
  user: string
  userAvatar?: string
  timestamp: string
  department: string
}

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "upload",
    title: "New Safety Report Uploaded",
    description: "Monthly safety inspection report for Line 1",
    user: "Raj Kumar",
    timestamp: "2 minutes ago",
    department: "Safety"
  },
  {
    id: "2", 
    type: "complete",
    title: "Procurement Review Completed",
    description: "Vendor contract analysis finished",
    user: "Priya Singh",
    timestamp: "15 minutes ago",
    department: "Procurement"
  },
  {
    id: "3",
    type: "alert",
    title: "Compliance Deadline Approaching",
    description: "Environmental clearance renewal due in 3 days",
    user: "System",
    timestamp: "1 hour ago",
    department: "Legal"
  },
  {
    id: "4",
    type: "review",
    title: "Engineering Change Order",
    description: "Signal system modification requires review",
    user: "Arun Menon",
    timestamp: "2 hours ago", 
    department: "Engineering"
  },
  {
    id: "5",
    type: "upload",
    title: "HR Policy Document",
    description: "Updated employee handbook uploaded",
    user: "Sunita Nair",
    timestamp: "3 hours ago",
    department: "HR"
  }
]

export function RecentActivity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="h-4 w-4 text-primary" />
      case "review":
        return <Clock className="h-4 w-4 text-warning" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "complete":
        return <CheckCircle className="h-4 w-4 text-success" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "upload":
        return "bg-primary-light"
      case "review":
        return "bg-warning-light"
      case "alert":
        return "bg-destructive/10"
      case "complete":
        return "bg-success-light"
      default:
        return "bg-muted"
    }
  }

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </h4>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {activity.department}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={activity.userAvatar} />
                    <AvatarFallback className="text-xs">{activity.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {activity.user} • {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}