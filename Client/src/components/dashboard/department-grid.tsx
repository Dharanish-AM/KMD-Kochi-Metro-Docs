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

  const handleSeeAllUsers = (department: Department) => {
    // Navigate to users page for this department
    const departmentSlug = department.name.toLowerCase().replace(/\s+/g, '-')
    navigate(`/users/${departmentSlug}`)
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {departments.map((department) => {
          const Icon = departmentIcons[department.name as keyof typeof departmentIcons] || Building2
          
          return (
            <Card 
              key={department.id} 
              className="group relative overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:border-blue-200 dark:hover:border-blue-700"
              onClick={() => onDepartmentClick(department)}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {department.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Updated {department.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    className={`${getStatusColor(department.status)} text-xs font-medium px-2 py-1 rounded-full flex-shrink-0`} 
                    variant="secondary"
                  >
                    {department.status}
                  </Badge>
                </div>
              </CardHeader>
            
            <CardContent className="relative z-10 pt-0">
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {department.totalDocs}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium">
                    Total Docs
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-orange-500 dark:text-orange-400">
                    {department.pendingDocs}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium">
                    Pending
                  </p>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Completion Rate</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {department.completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                      style={{ width: `${department.completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center text-sm font-medium">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    Active Users
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {department.activeUsers}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    const departmentPath = `/${department.name.toLowerCase()}`;
                    window.open(departmentPath, '_blank');
                    //new page

                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeeAllUsers(department);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  See All Users
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  </div>
  )
}