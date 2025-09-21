import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  User,
  Edit3,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  ArrowLeft,
  Users as UsersIcon,
  MoreVertical,
  Shield,
  Crown,
  Eye,
  Settings,
  Download,
  Filter,
  TrendingUp,
  Activity,
  Clock,
  Building2,
  Star,
  Zap,
  Target,
  Award,
  MapPin,
  FileText,
  AlertCircle,
  Edit,
  MessageSquare,
  BarChart3,
  UserMinus,
  X,
  Users
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: "active" | "inactive" | "pending"
  lastLogin: string
  permissions: string[]
  joinedDate: string
  avatar?: string
  isOnline?: boolean
  documentsUploaded?: number
  lastActivity?: string
  performanceScore?: number
  location?: string
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

// Mock data for users in each department
const mockUsers: Record<string, User[]> = {
  "engineering": [
    {
      id: "u1",
      name: "John Smith",
      email: "john.smith@metro.com",
      phone: "+1 234-567-8901",
      role: "Senior Engineer",
      status: "active",
      lastLogin: "2 mins ago",
      permissions: ["read", "write", "delete"],
      joinedDate: "2023-01-15",
      avatar: "",
      isOnline: true,
      documentsUploaded: 127,
      lastActivity: "2 mins ago",
      performanceScore: 94,
      location: "Engineering Lab A"
    },
    {
      id: "u2",
      name: "Sarah Johnson",
      email: "sarah.johnson@metro.com",
      phone: "+1 234-567-8902",
      role: "Project Manager",
      status: "active",
      lastLogin: "1 hour ago",
      permissions: ["read", "write", "admin"],
      joinedDate: "2023-02-20",
      avatar: "",
      isOnline: true,
      documentsUploaded: 89,
      lastActivity: "30 mins ago",
      performanceScore: 96,
      location: "Project Office"
    },
    {
      id: "u3",
      name: "Mike Wilson",
      email: "mike.wilson@metro.com",
      phone: "+1 234-567-8903",
      role: "Junior Engineer",
      status: "inactive",
      lastLogin: "2 days ago",
      permissions: ["read", "write"],
      joinedDate: "2023-03-10",
      avatar: "",
      isOnline: false,
      documentsUploaded: 45,
      lastActivity: "2 days ago",
      performanceScore: 78,
      location: "Field Office"
    },
    {
      id: "u4",
      name: "Emily Davis",
      email: "emily.davis@metro.com",
      phone: "+1 234-567-8904",
      role: "Technical Lead",
      status: "active",
      lastLogin: "30 mins ago",
      permissions: ["read", "write", "admin"],
      joinedDate: "2022-08-12",
      avatar: "",
      isOnline: true,
      documentsUploaded: 156,
      lastActivity: "5 mins ago",
      performanceScore: 98,
      location: "Engineering Lab B"
    },
    {
      id: "u5",
      name: "David Rodriguez",
      email: "david.rodriguez@metro.com",
      phone: "+1 234-567-8905",
      role: "Systems Architect",
      status: "active",
      lastLogin: "3 hours ago",
      permissions: ["read", "write", "delete", "admin"],
      joinedDate: "2022-04-08",
      avatar: "",
      isOnline: false,
      documentsUploaded: 203,
      lastActivity: "1 hour ago",
      performanceScore: 92,
      location: "Systems Lab"
    }
  ],
  "hr": [
    {
      id: "u6",
      name: "Lisa Brown",
      email: "lisa.brown@metro.com",
      phone: "+1 234-567-8905",
      role: "HR Manager",
      status: "active",
      lastLogin: "30 mins ago",
      permissions: ["read", "write", "admin"],
      joinedDate: "2022-11-05",
      avatar: "",
      isOnline: true,
      documentsUploaded: 134,
      lastActivity: "20 mins ago",
      performanceScore: 91,
      location: "HR Department"
    },
    {
      id: "u7",
      name: "David Garcia",
      email: "david.garcia@metro.com",
      phone: "+1 234-567-8906",
      role: "HR Specialist",
      status: "pending",
      lastLogin: "Never",
      permissions: ["read"],
      joinedDate: "2024-01-15",
      avatar: "",
      isOnline: false,
      documentsUploaded: 12,
      lastActivity: "Never",
      performanceScore: 65,
      location: "Remote"
    },
    {
      id: "u8",
      name: "Anna Martinez",
      email: "anna.martinez@metro.com",
      phone: "+1 234-567-8907",
      role: "Recruiter",
      status: "active",
      lastLogin: "4 hours ago",
      permissions: ["read", "write"],
      joinedDate: "2023-06-20",
      avatar: "",
      isOnline: false,
      documentsUploaded: 67,
      lastActivity: "2 hours ago",
      performanceScore: 87,
      location: "HR Department"
    }
  ],
  "legal": [
    {
      id: "u8",
      name: "Robert Taylor",
      email: "robert.taylor@metro.com",
      phone: "+1 234-567-8908",
      role: "Legal Counsel",
      status: "active",
      lastLogin: "1 hour ago",
      permissions: ["read", "write", "admin"],
      joinedDate: "2022-03-15"
    }
  ],
  "finance": [
    {
      id: "u9",
      name: "Jennifer Wilson",
      email: "jennifer.wilson@metro.com",
      phone: "+1 234-567-8909",
      role: "Finance Manager",
      status: "active",
      lastLogin: "45 mins ago",
      permissions: ["read", "write", "admin"],
      joinedDate: "2022-09-10"
    },
    {
      id: "u10",
      name: "Michael Brown",
      email: "michael.brown@metro.com",
      phone: "+1 234-567-8910",
      role: "Accountant",
      status: "active",
      lastLogin: "2 hours ago",
      permissions: ["read", "write"],
      joinedDate: "2023-04-22"
    }
  ]
}

const departmentNames: Record<string, string> = {
  "engineering": "Engineering",
  "hr": "HR",
  "legal": "Legal", 
  "finance": "Finance",
  "safety": "Safety",
  "operations": "Operations"
}

export function UsersPage() {
  const { departmentId } = useParams<{ departmentId: string }>()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [departmentName, setDepartmentName] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)

  useEffect(() => {
    if (departmentId) {
      const deptUsers = mockUsers[departmentId] || []
      setUsers(deptUsers)
      setDepartmentName(departmentNames[departmentId] || departmentId)
    }
  }, [departmentId])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesOnline = !showOnlineOnly || user.isOnline
    
    return matchesSearch && matchesStatus && matchesRole && matchesOnline
  })

  const roles = [...new Set(users.map(user => user.role))]
  const activeUsers = users.filter(u => u.status === 'active').length
  const onlineUsers = users.filter(u => u.isOnline).length
  const totalDocuments = users.reduce((sum, user) => sum + (user.documentsUploaded || 0), 0)
  const avgPerformance = users.reduce((sum, user) => sum + (user.performanceScore || 0), 0) / users.length

  const getDepartmentTheme = (dept: string) => {
    const themes = {
      "Engineering": {
        primary: "from-blue-500 to-indigo-600",
        secondary: "from-blue-100 to-indigo-100",
        accent: "bg-blue-500",
        light: "bg-blue-50 dark:bg-blue-900/20", 
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      },
      "HR": {
        primary: "from-purple-500 to-pink-600",
        secondary: "from-purple-100 to-pink-100",
        accent: "bg-purple-500",
        light: "bg-purple-50 dark:bg-purple-900/20", 
        text: "text-purple-700",
        badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      },
      "Legal": {
        primary: "from-gray-500 to-slate-600",
        secondary: "from-gray-100 to-slate-100",
        accent: "bg-gray-500",
        light: "bg-gray-50 dark:bg-gray-900/20", 
        text: "text-gray-700",
        badge: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
      },
      "Finance": {
        primary: "from-green-500 to-emerald-600",
        secondary: "from-green-100 to-emerald-100",
        accent: "bg-green-500",
        light: "bg-green-50 dark:bg-green-900/20", 
        text: "text-green-700",
        badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      }
    }
    return themes[dept as keyof typeof themes] || themes["Engineering"]
  }

  const theme = getDepartmentTheme(departmentName)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "inactive":
        return <XCircle className="h-4 w-4" />
      case "pending":
        return <Calendar className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ))
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  const handleAddUser = (newUserData: Partial<User>) => {
    const user: User = {
      id: `u${Date.now()}`,
      name: newUserData.name!,
      email: newUserData.email!,
      phone: newUserData.phone || "",
      role: newUserData.role!,
      status: newUserData.status as "active" | "inactive" | "pending",
      lastLogin: "Never",
      permissions: newUserData.permissions || ["read"],
      joinedDate: new Date().toISOString().split('T')[0]
    }
    setUsers(prev => [...prev, user])
    setIsAddUserModalOpen(false)
  }

  const togglePermission = (userId: string, permission: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const hasPermission = user.permissions.includes(permission)
        const newPermissions = hasPermission
          ? user.permissions.filter(p => p !== permission)
          : [...user.permissions, permission]
        return { ...user, permissions: newPermissions }
      }
      return user
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Stunning Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center shadow-lg ring-4 ring-white/20 dark:ring-gray-800/20`}>
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text">
                    {departmentName} Department
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Advanced User Management System
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setIsAddUserModalOpen(true)}
                className={`bg-gradient-to-r ${theme.primary} hover:opacity-90 shadow-lg ring-2 ring-white/20 dark:ring-gray-800/20 transition-all duration-200 hover:scale-105`}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stunning Stats Dashboard */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
              <UsersIcon className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{users.length}</div>
              <p className="text-xs text-blue-200 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                Department members
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-emerald-100">Active Users</CardTitle>
              <CheckCircle className="h-5 w-5 text-emerald-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{activeUsers}</div>
              <p className="text-xs text-emerald-200 flex items-center gap-1 mt-1">
                <Activity className="h-3 w-3" />
                {users.length ? Math.round((activeUsers / users.length) * 100) : 0}% active rate
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-amber-100">Online Now</CardTitle>
              <Zap className="h-5 w-5 text-amber-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{onlineUsers}</div>
              <p className="text-xs text-amber-200 flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-amber-200 rounded-full animate-pulse"></div>
                Real-time status
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-purple-100">Performance</CardTitle>
              <Target className="h-5 w-5 text-purple-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{avgPerformance ? Math.round(avgPerformance) : 0}%</div>
              <p className="text-xs text-purple-200 flex items-center gap-1 mt-1">
                <Award className="h-3 w-3" />
                Average score
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Professional Filters */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mb-8 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Filter className="h-5 w-5" />
              Advanced Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              {/* Enhanced Search */}
              <div className="lg:col-span-2">
                <Label htmlFor="search" className="text-sm font-medium mb-2 block">Search Users</Label>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-primary/50 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 border-2 focus:border-primary/50">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Role Filter</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-12 border-2 focus:border-primary/50">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="online-only" 
                  checked={showOnlineOnly}
                  onCheckedChange={setShowOnlineOnly}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="online-only" className="text-sm font-medium">
                  Show online users only
                </Label>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setRoleFilter("all")
                  setShowOnlineOnly(false)
                }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredUsers.length}</span> of{" "}
            <span className="font-semibold text-foreground">{users.length}</span> users
          </div>
        </div>

        {/* Stunning Enhanced Users Table */}
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Department Users
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Table Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  No users found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                  {searchTerm ? "Try adjusting your search criteria or filters" : "No users in this department yet"}
                </p>
                <Button 
                  onClick={() => setIsAddUserModalOpen(true)}
                  className={`bg-gradient-to-r ${theme.primary} hover:opacity-90 shadow-lg`}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add First User
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                    <tr>
                      <th className="text-left p-6 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">User</th>
                      <th className="text-left p-6 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">Role</th>
                      <th className="text-left p-6 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">Status</th>
                      <th className="text-left p-6 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">Performance</th>
                      <th className="text-left p-6 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">Activity</th>
                      <th className="text-left p-6 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">Documents</th>
                      <th className="text-right p-6 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr 
                        key={user.id} 
                        className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent dark:hover:from-gray-800/50 dark:hover:to-transparent transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/30 dark:bg-gray-800/30'
                        }`}
                      >
                        {/* Enhanced User Info */}
                        <td className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="relative group">
                              <Avatar className="h-14 w-14 ring-3 ring-white dark:ring-gray-800 shadow-lg group-hover:scale-105 transition-transform duration-200">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className={`bg-gradient-to-br ${theme.primary} text-white font-bold text-lg`}>
                                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {user.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white dark:border-gray-800 rounded-full animate-pulse shadow-lg" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                                {user.name}
                                {user.isOnline && (
                                  <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full font-medium shadow-sm">
                                    Online
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{user.email}</div>
                              {user.location && (
                                <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {user.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Enhanced Role */}
                        <td className="p-6">
                          <Badge 
                            variant="secondary" 
                            className={`${theme.badge} font-medium px-3 py-1 text-sm shadow-sm`}
                          >
                            {user.role}
                          </Badge>
                        </td>

                        {/* Enhanced Status */}
                        <td className="p-6">
                          <div className="flex items-center space-x-2">
                            <div 
                              className={`w-3 h-3 rounded-full shadow-sm ${
                                user.status === 'active' ? 'bg-green-500 animate-pulse' :
                                user.status === 'inactive' ? 'bg-red-500' :
                                'bg-yellow-500 animate-pulse'
                              }`} 
                            />
                            <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                              {user.status}
                            </span>
                          </div>
                        </td>

                        {/* Enhanced Performance */}
                        <td className="p-6">
                          <div className="space-y-2 w-24">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {user.performanceScore}%
                              </span>
                              <div className="flex items-center">
                                {user.performanceScore && user.performanceScore >= 90 ? (
                                  <Star className="h-4 w-4 text-yellow-500" />
                                ) : user.performanceScore && user.performanceScore >= 80 ? (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-orange-500" />
                                )}
                              </div>
                            </div>
                            <Progress 
                              value={user.performanceScore || 0} 
                              className="h-2 bg-gray-200 dark:bg-gray-700"
                            />
                          </div>
                        </td>

                        {/* Enhanced Activity */}
                        <td className="p-6">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span className="font-medium">{user.lastActivity}</span>
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              Joined {user.joinedDate}
                            </div>
                          </div>
                        </td>

                        {/* Enhanced Documents */}
                        <td className="p-6">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {user.documentsUploaded || 0}
                              </span>
                              <div className="text-xs text-gray-400">docs</div>
                            </div>
                          </div>
                        </td>

                        {/* Enhanced Actions */}
                        <td className="p-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                <Eye className="h-4 w-4 mr-2 text-blue-600" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-green-50 dark:hover:bg-green-900/20">
                                <Edit className="h-4 w-4 mr-2 text-green-600" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                <MessageSquare className="h-4 w-4 mr-2 text-purple-600" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                                <Shield className="h-4 w-4 mr-2 text-yellow-600" />
                                Manage Permissions
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                                <BarChart3 className="h-4 w-4 mr-2 text-indigo-600" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <UserMinus className="h-4 w-4 mr-2" />
                                Remove User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stunning Enhanced Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center shadow-lg ring-4 ring-white/20 dark:ring-gray-800/20`}>
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Add New User
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {departmentName} Department
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter full name" 
                  className="mt-2 h-12 border-2 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter email address" 
                  className="mt-2 h-12 border-2 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role</Label>
                <Select>
                  <SelectTrigger className="mt-2 h-12 border-2 focus:border-primary/50">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location (Optional)</Label>
                <Input 
                  id="location" 
                  placeholder="Enter location" 
                  className="mt-2 h-12 border-2 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Initial Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger className="mt-2 h-12 border-2 focus:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 bg-gray-50 dark:bg-gray-800/50">
              <Button
                variant="outline"
                className="flex-1 h-12 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsAddUserModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 h-12 bg-gradient-to-r ${theme.primary} hover:opacity-90 shadow-lg transition-all duration-200 hover:scale-105`}
                onClick={() => setIsAddUserModalOpen(false)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
