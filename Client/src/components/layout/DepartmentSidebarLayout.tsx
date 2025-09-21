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
  Home,
  ChevronDown,
  Dot,
  TrendingUp,
  Shield
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
  "Engineering": { icon: "⚙️", color: "text-blue-400" },
  "HR": { icon: "👥", color: "text-green-400" },
  "Legal": { icon: "⚖️", color: "text-purple-400" },
  "Finance": { icon: "💰", color: "text-yellow-400" },
  "Safety": { icon: "🛡️", color: "text-red-400" },
  "Operations": { icon: "⚡", color: "text-cyan-400" },
  "Procurement": { icon: "�", color: "text-teal-400" },
  "Admin": { icon: "📋", color: "text-gray-400" },
  "Maintenance": { icon: "🔧", color: "text-orange-400" },
  "Security": { icon: "🔒", color: "text-indigo-400" }
}

const departmentThemes = {
  "Engineering": {
    primary: "from-blue-600 via-blue-700 to-indigo-800",
    secondary: "from-blue-50 to-indigo-50",
    accent: "bg-blue-500",
    text: "text-blue-600"
  },
  "HR": {
    primary: "from-emerald-600 via-green-700 to-teal-800",
    secondary: "from-emerald-50 to-green-50",
    accent: "bg-emerald-500",
    text: "text-emerald-600"
  },
  "Legal": {
    primary: "from-purple-600 via-violet-700 to-indigo-800",
    secondary: "from-purple-50 to-violet-50",
    accent: "bg-purple-500",
    text: "text-purple-600"
  },
  "Finance": {
    primary: "from-amber-600 via-yellow-700 to-orange-800",
    secondary: "from-amber-50 to-yellow-50",
    accent: "bg-amber-500",
    text: "text-amber-600"
  },
  "Safety": {
    primary: "from-red-600 via-rose-700 to-pink-800",
    secondary: "from-red-50 to-rose-50",
    accent: "bg-red-500",
    text: "text-red-600"
  },
  "Operations": {
    primary: "from-cyan-600 via-sky-700 to-blue-800",
    secondary: "from-cyan-50 to-sky-50",
    accent: "bg-cyan-500",
    text: "text-cyan-600"
  },
  "Procurement": {
    primary: "from-teal-600 via-emerald-700 to-green-800",
    secondary: "from-teal-50 to-emerald-50",
    accent: "bg-teal-500",
    text: "text-teal-600"
  },
  "Admin": {
    primary: "from-slate-600 via-gray-700 to-zinc-800",
    secondary: "from-slate-50 to-gray-50",
    accent: "bg-slate-500",
    text: "text-slate-600"
  },
  "Maintenance": {
    primary: "from-orange-600 via-red-700 to-rose-800",
    secondary: "from-orange-50 to-red-50",
    accent: "bg-orange-500",
    text: "text-orange-600"
  },
  "Security": {
    primary: "from-indigo-600 via-purple-700 to-violet-800",
    secondary: "from-indigo-50 to-purple-50",
    accent: "bg-indigo-500",
    text: "text-indigo-600"
  }
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  const theme = departmentThemes[department as keyof typeof departmentThemes] || departmentThemes["Engineering"]
  const departmentInfo = departmentIcons[department as keyof typeof departmentIcons] || departmentIcons["Engineering"]

  const navigationItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: BarChart3,
      description: "Overview & Analytics",
      badge: null
    },
    {
      id: "upload",
      label: "Upload Files",
      icon: Upload,
      description: "Submit Documents",
      badge: "New"
    },
    {
      id: "history",
      label: "File History",
      icon: FileText,
      description: "Track Submissions",
      badge: "24"
    },
    {
      id: "accepted",
      label: "Approved Files",
      icon: CheckCircle,
      description: "Accepted Documents",
      badge: null
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white/95 backdrop-blur-md shadow-lg border-white/20 hover:bg-white"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-80 transform transition-all duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 dark:border-gray-800/50">
          
          {/* Department Header */}
          <div className={`bg-gradient-to-br ${theme.primary} p-6 text-white relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
            </div>
            
            <div className="relative z-10">
              {/* Department Info */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <span className="text-2xl">{departmentInfo.icon}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-white mb-1">{department}</h1>
                  <p className="text-white/80 text-sm font-medium">Department Portal</p>
                </div>
              </div>
              
              {/* User Profile */}
              <div 
                className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 cursor-pointer transition-all duration-200 hover:bg-white/15"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <Avatar className="h-11 w-11 border-2 border-white/30 shadow-lg">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
                  <AvatarFallback className="bg-white/20 text-white font-semibold text-sm">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{userName}</p>
                  <p className="text-xs text-white/70 truncate">{userRole}</p>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 text-white/70 transition-transform duration-200",
                  isUserMenuOpen && "rotate-180"
                )} />
              </div>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="mt-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-white/90 hover:bg-white/10 rounded-lg transition-colors duration-150">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-white/90 hover:bg-white/10 rounded-lg transition-colors duration-150">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Notifications</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto">
            {/* Navigation Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Navigation
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700 ml-3"></div>
              </div>
              
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={cn(
                        "w-full group relative flex items-center space-x-4 px-4 py-3.5 rounded-xl text-left transition-all duration-300 ease-out",
                        isActive
                          ? `bg-gradient-to-r ${theme.primary} text-white shadow-lg shadow-black/10 scale-[1.02]`
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-md hover:scale-[1.01]"
                      )}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                      )}
                      
                      <div className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                        isActive 
                          ? "bg-white/20 text-white" 
                          : `${theme.secondary} ${theme.text} group-hover:scale-110`
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={cn(
                              "text-sm font-semibold",
                              isActive ? "text-white" : "text-gray-900 dark:text-white"
                            )}>
                              {item.label}
                            </p>
                            <p className={cn(
                              "text-xs font-medium",
                              isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                            )}>
                              {item.description}
                            </p>
                          </div>
                          
                          {item.badge && (
                            <Badge 
                              variant={isActive ? "secondary" : "outline"} 
                              className={cn(
                                "text-xs px-2 py-0.5 h-5",
                                isActive 
                                  ? "bg-white/20 text-white border-white/30" 
                                  : `${theme.accent} text-white border-transparent`
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Hover Effect */}
                      <div className={cn(
                        "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
                        !isActive && "group-hover:opacity-100 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent dark:via-gray-700/50"
                      )}></div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quick Stats
                </h3>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className={cn(
                  "relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:shadow-lg",
                  `bg-gradient-to-br ${theme.secondary} border border-gray-200/50 dark:border-gray-700/50`
                )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={cn("text-2xl font-bold", theme.text)}>24</div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Pending Reviews</div>
                    </div>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", theme.accent)}>
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                    <div className={cn("w-full h-full rounded-full", theme.accent)}></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200/50 dark:border-emerald-700/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">156</div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Approved</div>
                    </div>
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500 rounded-full opacity-10"></div>
                </div>
              </div>
              
              {/* Department Status */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Department Status</span>
                  <div className="flex items-center space-x-1">
                    <Dot className="h-4 w-4 text-green-500 animate-pulse" />
                    <span className="text-green-600 dark:text-green-400 font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4 space-y-2 bg-gray-50/50 dark:bg-gray-800/50">
            <Button
              variant="ghost"
              size="sm" 
              className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Shield className="h-4 w-4 mr-3" />
              Security Center
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
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
        {/* Enhanced Top Bar */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-30 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="hidden lg:flex hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-3">
                  <div className={cn("w-2 h-2 rounded-full", theme.accent)}></div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {navigationItems.find(item => item.id === activeSection)?.label || "Dashboard"}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {navigationItems.find(item => item.id === activeSection)?.description || "Welcome to your department portal"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-xs font-medium bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  Last active: 2h ago
                </Badge>
                <Badge variant="secondary" className={cn("text-xs font-medium", theme.accent, "text-white")}>
                  <Users className="h-3 w-3 mr-1.5" />
                  15 Online
                </Badge>
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content with Enhanced Background */}
        <div className="p-6 min-h-[calc(100vh-5rem)]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}