import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Building2,
  BarChart3,
  Upload,
  FileText,
  CheckCircle,
  Users,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Home
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DepartmentSidebarLayoutProps {
  children: React.ReactNode
  department: string
  userName: string
  userRole: string
  activeSection: string
  onSectionChange: (section: string) => void
}

const departmentIcons = {
  "Engineering": "🔧",
  "HR": "👥",
  "Legal": "⚖️",
  "Finance": "💰",
  "Safety": "🛡️",
  "Operations": "⚡",
  "Procurement": "🚛",
  "Admin": "📋",
  "Maintenance": "🔧",
  "Security": "🔒"
}

const departmentColors = {
  "Engineering": "from-blue-600 to-indigo-600",
  "HR": "from-green-600 to-emerald-600",
  "Legal": "from-purple-600 to-violet-600",
  "Finance": "from-yellow-600 to-orange-600",
  "Safety": "from-red-600 to-pink-600",
  "Operations": "from-cyan-600 to-blue-600",
  "Procurement": "from-teal-600 to-green-600",
  "Admin": "from-gray-600 to-slate-600",
  "Maintenance": "from-orange-600 to-red-600",
  "Security": "from-indigo-600 to-purple-600"
}

export const DepartmentSidebarLayout = ({ 
  children, 
  department, 
  userName, 
  userRole, 
  activeSection, 
  onSectionChange 
}: DepartmentSidebarLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  const gradientClass = departmentColors[department as keyof typeof departmentColors] || departmentColors["Engineering"]
  const departmentIcon = departmentIcons[department as keyof typeof departmentIcons] || "🏢"

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      description: "Dashboard & Analytics"
    },
    {
      id: "upload",
      label: "Upload Files",
      icon: Upload,
      description: "Submit Documents"
    },
    {
      id: "history",
      label: "File History",
      icon: FileText,
      description: "All Submissions"
    },
    {
      id: "accepted",
      label: "Accepted Files",
      icon: CheckCircle,
      description: "Approved Documents"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700">
          {/* Department Header */}
          <div className={`bg-gradient-to-r ${gradientClass} p-6 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-3xl">{departmentIcon}</div>
                <div>
                  <h1 className="text-xl font-bold">{department} Department</h1>
                  <p className="text-white/80 text-sm">Document Management Portal</p>
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
                  <AvatarFallback className="bg-white/20 text-white font-semibold">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{userName}</p>
                  <p className="text-xs text-white/70 truncate">{userRole}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-2">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Navigation
              </h3>
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group",
                        isActive
                          ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg`
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        isActive ? "text-white" : "text-gray-500 dark:text-gray-400",
                        "group-hover:scale-110"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium",
                          isActive ? "text-white" : "text-gray-900 dark:text-white"
                        )}>
                          {item.label}
                        </p>
                        <p className={cn(
                          "text-xs",
                          isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                        )}>
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">24</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">156</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Approved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Bell className="h-4 w-4 mr-3" />
              Notifications
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isSidebarOpen ? "lg:ml-80" : "lg:ml-0"
      )}>
        {/* Top Bar */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="hidden lg:flex"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {navigationItems.find(item => item.id === activeSection)?.label || "Dashboard"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {navigationItems.find(item => item.id === activeSection)?.description || "Welcome to your department portal"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Last active: 2 hours ago
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  15 Staff Online
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}