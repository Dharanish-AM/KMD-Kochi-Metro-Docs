import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  ExternalLink,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const departmentIcons = {
  "Operations & Maintenance": Zap,
  "Engineering & Infrastructure": Wrench,
  "Electrical & Mechanical": Wrench,
  "Finance & Accounts": DollarSign,
  "Human Resources": Users,
  "Legal & Compliance": Scale,
  "Procurement & Contracts": Truck,
  "Corporate Communications": Heart,
  "Business Development": Building2,
  "Vigilance & Security": Shield,
  "Information Technology & Systems": Zap,
  "Planning & Development": Building2,
  "Environment & Sustainability": Heart,
  "Customer Relations & Services": UserCheck,
  "Project Management": Building2,
  
  // Fallback mappings for shorter names
  "Operations": Zap,
  "Engineering": Wrench,
  "Electrical": Wrench,
  "Finance": DollarSign,
  "HR": Users,
  "Legal": Scale,
  "Procurement": Truck,
  "Communications": Heart,
  "Business": Building2,
  "Security": Shield,
  "IT": Zap,
  "Planning": Building2,
  "Environment": Heart,
  "Customer": UserCheck,
  "Project": Building2
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
  slug: string
}

interface DepartmentGridProps {
  onDepartmentClick: (department: Department) => void
  departments: Department[]
  onEditDepartment?: (department: Department) => void
  onDeleteDepartment?: (department: Department) => void
  showActions?: boolean
}

export function DepartmentGrid({ onDepartmentClick, departments, onEditDepartment, onDeleteDepartment, showActions = false }: DepartmentGridProps) {
  const navigate = useNavigate()

  const handleDepartmentAccess = (department: Department) => {
    // Navigate to department role panel
    const departmentSlug = department.name.toLowerCase().replace(/\s+/g, '-')
    navigate(`/department/${departmentSlug}`)
  }

  const handleSeeAllUsers = (department: Department) => {
    const departmentSlug = department.name.toLowerCase().replace(/\s+/g, '-')
    const deptid=department.id;
    console.log(deptid);
    navigate(`/users/${departmentSlug}`,{
      state:{deptid}
    })
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
    <div className="w-full">
      {departments.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
            <Building2 className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No departments found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {departments.map((department, index) => {
            const Icon = departmentIcons[department.name as keyof typeof departmentIcons] || Building2
            
            return (
              <Card 
                key={department.id} 
                className="group relative overflow-hidden border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-[1.03] hover:-translate-y-2"
                onClick={() => onDepartmentClick(department)}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
              {/* Enhanced Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'subtract' }} />
              
              {/* Floating particles effect */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500" />
              <div className="absolute top-6 right-8 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-700" style={{ animationDelay: '200ms' }} />
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-7 w-7 text-white" />
                      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {department.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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
              {/* Enhanced Statistics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="relative text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl border border-blue-100 dark:border-blue-800 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute top-2 right-2 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse" />
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {department.totalDocs}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                    Total Documents
                  </p>
                </div>
                <div className="relative text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-2xl border border-orange-100 dark:border-orange-800 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute top-2 right-2 w-3 h-3 bg-orange-400 rounded-full opacity-60 animate-pulse" />
                  <p className="text-3xl font-bold text-orange-500 dark:text-orange-400 mb-1">
                    {department.pendingDocs}
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 font-semibold">
                    Pending Review
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

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-semibold rounded-xl h-11 transform hover:scale-105" 
                  onClick={(e) => {
                    e.stopPropagation();
                    const departmentPath = `/${department.slug}`;
                    window.open(departmentPath, '_blank');
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Dashboard
                  <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-2 border-gray-200 dark:border-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-blue-900/30 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 text-sm font-semibold rounded-xl h-11 transform hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeeAllUsers(department);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Users
                  <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </Button>
                
                {/* Actions Menu - only show if showActions is true */}
                {showActions && (onEditDepartment || onDeleteDepartment) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-400 transition-all duration-300 rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {onEditDepartment && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditDepartment(department);
                          }}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Department
                        </DropdownMenuItem>
                      )}
                      {onDeleteDepartment && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDepartment(department);
                          }}
                          className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Department
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
      )}
    </div>
  )
}