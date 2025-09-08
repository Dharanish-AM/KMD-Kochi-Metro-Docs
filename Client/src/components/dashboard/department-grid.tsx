import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  Users, 
  FileText, 
  Upload,
  Wrench,
  Heart,
  Scale,
  DollarSign,
  Shield,
  Zap,
  Truck,
  UserCheck,
  ExternalLink
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const departmentIcons = {
  "Engineering": Wrench,
  "HR": Users,
  "Legal": Scale,
  "Finance": DollarSign,
  "Safety": Shield,
  "Operations": Zap,
  "Procurement": Truck,
  "Admin": UserCheck,
  "Maintenance": Wrench,
  "Security": Shield
}

interface Department {
  id: string
  name: string
  totalDocs: number
  pendingDocs: number
  activeUsers: number
  completionRate: number
  lastUpdated: string
  status: "active" | "maintenance" | "inactive"
}

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Engineering",
    totalDocs: 456,
    pendingDocs: 12,
    activeUsers: 15,
    completionRate: 94,
    lastUpdated: "2 hours ago",
    status: "active"
  },
  {
    id: "2", 
    name: "HR",
    totalDocs: 234,
    pendingDocs: 8,
    activeUsers: 8,
    completionRate: 98,
    lastUpdated: "1 hour ago",
    status: "active"
  },
  {
    id: "3",
    name: "Legal",
    totalDocs: 189,
    pendingDocs: 15,
    activeUsers: 6,
    completionRate: 87,
    lastUpdated: "3 hours ago",
    status: "active"
  },
  {
    id: "4",
    name: "Finance",
    totalDocs: 678,
    pendingDocs: 23,
    activeUsers: 12,
    completionRate: 91,
    lastUpdated: "30 mins ago",
    status: "active"
  },
  {
    id: "5",
    name: "Safety",
    totalDocs: 145,
    pendingDocs: 3,
    activeUsers: 9,
    completionRate: 96,
    lastUpdated: "45 mins ago",
    status: "active"
  },
  {
    id: "6",
    name: "Operations",
    totalDocs: 567,
    pendingDocs: 18,
    activeUsers: 22,
    completionRate: 89,
    lastUpdated: "1 hour ago",
    status: "active"
  }
]

interface DepartmentGridProps {
  onDepartmentClick: (department: Department) => void
  departments: Department[]
}

export function DepartmentGrid({ onDepartmentClick, departments }: DepartmentGridProps) {
  const navigate = useNavigate()

  const handleDepartmentAccess = (department: Department) => {
    // Navigate to department role panel
    const departmentSlug = department.name.toLowerCase().replace(/\s+/g, '-')
    navigate(`/department/${departmentSlug}`)
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground"
      case "maintenance":
        return "bg-warning text-warning-foreground"
      case "inactive":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((department) => {
        const Icon = departmentIcons[department.name as keyof typeof departmentIcons] || Building2
        
        return (
          <Card key={department.id} className="gradient-card hover:shadow-elevated transition-smooth cursor-pointer"
                onClick={() => onDepartmentClick(department)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Updated {department.lastUpdated}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(department.status)} variant="secondary">
                  {department.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{department.totalDocs}</p>
                  <p className="text-xs text-muted-foreground">Total Docs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">{department.pendingDocs}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">{department.completionRate}%</span>
                  </div>
                  <Progress value={department.completionRate} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    Active Users
                  </span>
                  <span className="font-medium">{department.activeUsers}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1 gradient-primary" size="sm" onClick={() => onDepartmentClick(department)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDepartmentAccess(department)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Dept Access
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}