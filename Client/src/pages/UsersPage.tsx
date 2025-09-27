import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
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
  Users,
  Loader2
} from "lucide-react"
import axiosInstance from "@/Utils/Auth/axiosInstance"
import { useToast } from "@/hooks/use-toast"
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
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [departmentName, setDepartmentName] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  const [isDeletingUser, setIsDeletingUser] = useState(false)
  const location=useLocation();
  const deptid=location.state?.deptid;
  
  // Form state for add user modal
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    status: "active"
  })

  // Form state for edit user modal
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "active"
  })
  
  // Available departments from backend
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("")

  // Available roles
  const roles = ["Employee", "Viewer"]

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // If we have a departmentId, we'll use it later for setting the user's department
        if (departmentId) {
          setSelectedDepartmentId(departmentId)
        }
        // You might want to fetch all departments here for the dropdown
        // For now, we'll use the departmentId from the URL
      } catch (error) {
        console.error("Error fetching departments:", error)
      }
    }
    
    fetchDepartments()
  }, [departmentId])

  // Fetch users from backend when departmentId changes
  useEffect(() => {
    const fetchDepartmentUsers = async () => {
      if (!departmentId) return
      
      setIsLoadingUsers(true)
      try {
        const response = await axiosInstance.get(`/api/departments/${deptid}`)
        
        if (response.data) {
          const department = response.data
          setDepartmentName(department.name)
          
          // Transform backend employees to frontend User interface
          const transformedUsers: User[] = department.employees.map((employee: any) => ({
            id: employee._id,
            name: employee.name,
            email: employee.email,
            phone: employee.phone || "",
            role: employee.role,
            status: "active", // Default status, you can enhance this based on backend data
            lastLogin: "Never", // This would need to be tracked in backend
            permissions: ["read"], // Default permissions, can be enhanced
            joinedDate: new Date(employee.joinedAt).toISOString().split('T')[0],
            isOnline: false, // This would need real-time tracking
            documentsUploaded: 0, // This would need to be calculated from documents
            performanceScore: 85, // This would need to be calculated
            location: employee.location || ""
          }))
          
          setUsers(transformedUsers)
          setLastRefreshed(new Date())
          
          toast({
            title: "Success",
            description: `Loaded ${transformedUsers.length} users from ${department.name}`,
          })
        }
      } catch (error: any) {
        console.error("Error fetching department users:", error)
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch users",
          variant: "destructive",
        })
        
        // Fallback to empty array if error
        setUsers([])
        setDepartmentName(departmentId)
      } finally {
        setIsLoadingUsers(false)
      }
    }
    
    fetchDepartmentUsers()
  }, [departmentId, toast])

  // Add keyboard shortcut for refresh
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === 'r') || event.key === 'F5') {
        event.preventDefault()
        handleManualRefresh()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [departmentId])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !departmentId) return

    const interval = setInterval(() => {
      refetchUsers(true)
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, departmentId])

  // Function to refetch users (useful after adding/updating users)
  const refetchUsers = async (isAutoRefresh = false) => {
    if (!departmentId) return
    
    setIsLoadingUsers(true)
    
    try {
      const response = await axiosInstance.get(`/api/departments/${deptid}`)
      
      if (response.data) {
        const department = response.data
        setDepartmentName(department.name)
        
        // Transform backend employees to frontend User interface
        const transformedUsers: User[] = department.employees.map((employee: any) => ({
          id: employee._id,
          name: employee.name,
          email: employee.email,
          phone: employee.phone || "",
          role: employee.role,
          status: "active",
          lastLogin: "Never",
          permissions: ["read"],
          joinedDate: new Date(employee.joinedAt).toISOString().split('T')[0],
          isOnline: false,
          documentsUploaded: 0,
          performanceScore: 85,
          location: employee.location || ""
        }))
        
        setUsers(transformedUsers)
        setLastRefreshed(new Date())
        
        if (!isAutoRefresh) {
          toast({
            title: "Success",
            description: `Refreshed ${transformedUsers.length} users from ${department.name}`,
          })
        }
      }
    } catch (error: any) {
      console.error("Error refetching users:", error)
      if (!isAutoRefresh) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to refresh users",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleManualRefresh = () => {
    refetchUsers(false)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesOnline = !showOnlineOnly || user.isOnline
    
    return matchesSearch && matchesStatus && matchesRole && matchesOnline
  })

  const userRoles = [...new Set(users.map(user => user.role))]
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

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    setIsUpdatingUser(true)
    
    try {
      const response = await axiosInstance.put(`/api/employee/${userId}`, {
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        role: updates.role,
        departmentId: deptid
      })
      
      if (response.data.user) {
        // Transform backend user to frontend User interface
        const updatedUser: User = {
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone || "",
          role: response.data.user.role,
          status: updates.status || "active",
          lastLogin: "Never",
          permissions: ["read"],
          joinedDate: new Date(response.data.user.joinedAt).toISOString().split('T')[0],
          isOnline: false,
          documentsUploaded: 0,
          performanceScore: 85,
          location: updates.location || ""
        }
        
        // Update the user in the local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? updatedUser : user
        ))
        
        toast({
          title: "Success",
          description: "User updated successfully",
        })
      }
      
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingUser(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    setIsDeletingUser(true)
    
    try {
      await axiosInstance.delete(`/api/employee/${userId}`)
      
      // Remove user from local state
      setUsers(prev => prev.filter(user => user.id !== userId))
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user", 
        variant: "destructive",
      })
    } finally {
      setIsDeletingUser(false)
      setIsDeleteConfirmOpen(false)
      setSelectedUser(null)
    }
  }

  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!selectedDepartmentId && formData.role !== "Admin") {
      toast({
        title: "Validation Error", 
        description: "Department is required for non-admin users",
        variant: "destructive",
      })
      return
    }

    setIsCreatingUser(true)
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        ...(selectedDepartmentId && { departmentId: deptid })
      }

      const response = await axiosInstance.post("/api/employee/create-user", userData)
      
      if (response.data.user) {
        const emailStatus = response.data.emailSent ? 
          " Welcome email with credentials sent successfully!" : 
          " (Email service not configured - please provide credentials manually)"
        
        toast({
          title: "Success",
          description: `User created successfully.${emailStatus}`,
        })
        
        // Refetch users to get the updated list from backend
        await refetchUsers(false)
        
        closeAddUserModal()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create user",
        variant: "destructive",
      })
    } finally {
      setIsCreatingUser(false)
    }
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const openAddUserModal = () => {
    // Reset form when opening modal
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "",
      status: "active"
    })
    setIsAddUserModalOpen(true)
  }

  const closeAddUserModal = () => {
    // Reset form when closing modal
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "",
      status: "active"
    })
    setIsAddUserModalOpen(false)
  }

  const openEditUserModal = (user: User) => {
    setSelectedUser(user)
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    })
    setIsEditUserModalOpen(true)
  }

  const closeEditUserModal = () => {
    setEditFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "active"
    })
    setSelectedUser(null)
    setIsEditUserModalOpen(false)
  }

  const openDeleteConfirm = (user: User) => {
    setSelectedUser(user)
    setIsDeleteConfirmOpen(true)
  }

  const closeDeleteConfirm = () => {
    setSelectedUser(null)
    setIsDeleteConfirmOpen(false)
  }

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveUserEdit = async () => {
    if (!selectedUser) return
    
    if (!editFormData.name || !editFormData.email || !editFormData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    await handleUpdateUser(selectedUser.id, {
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      role: editFormData.role,
      status: editFormData.status as "active" | "inactive" | "pending"
    })
    
    closeEditUserModal()
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return
    await handleDeleteUser(selectedUser.id)
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
      {/* Modern Enhanced Header */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 sticky top-0 z-50 shadow-lg animate-in slide-in-from-top duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Top Bar with Navigation and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-100 dark:border-gray-800/50 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-all duration-200 text-gray-600 dark:text-gray-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back</span>
              </Button>
              
              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Building2 className="h-4 w-4" />
                <span>Departments</span>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">{departmentName}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <Label 
                  htmlFor="auto-refresh" 
                  className={`text-xs font-medium cursor-pointer ${autoRefresh ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <span className="hidden sm:inline">Auto-refresh</span>
                  <span className="sm:hidden">Auto</span>
                  {autoRefresh && <span className="hidden sm:inline"> (30s)</span>}
                </Label>
              </div>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isLoadingUsers}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 border-gray-200 dark:border-gray-700"
                title={lastRefreshed ? `Last refreshed: ${lastRefreshed.toLocaleTimeString()}` : "Refresh user data"}
              >
                {isLoadingUsers ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Activity className="h-4 w-4" />
                )}
                <span className="hidden sm:inline ml-1.5">Refresh</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline ml-1.5">Export</span>
              </Button>
            </div>
          </div>

          {/* Main Header Content */}
          <div className="py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Department Info */}
              <div className="flex items-center space-x-4 lg:space-x-6">
                <div className="relative">
                  <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${theme.primary} flex items-center justify-center shadow-xl ring-4 ring-white/30 dark:ring-gray-800/30`}>
                    <UsersIcon className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                  {isLoadingUsers && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Loader2 className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-white animate-spin" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                    {departmentName || 'Department'}
                  </h1>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    User Management Dashboard
                    {lastRefreshed && (
                      <>
                        <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
                        <span className="hidden sm:inline text-sm">
                          Updated {lastRefreshed.toLocaleTimeString()}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={openAddUserModal}
                  className={`bg-gradient-to-r ${theme.primary} hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-4 lg:px-6 py-2 lg:py-3`}
                  size="lg"
                >
                  <UserPlus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                  <span className="hidden sm:inline">Add New User</span>
                  <span className="sm:hidden">Add User</span>
                </Button>
              </div>
            </div>

            {/* Quick Stats Bar */}
            {/* <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800/50">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <div className={`flex items-center space-x-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl px-3 lg:px-4 py-3 transition-all duration-200 ${isLoadingUsers ? 'animate-pulse' : ''}`}>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                      {isLoadingUsers ? '...' : filteredUsers.length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Users</p>
                  </div>
                </div>

                <div className={`flex items-center space-x-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl px-3 lg:px-4 py-3 transition-all duration-200 ${isLoadingUsers ? 'animate-pulse' : ''}`}>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                      {isLoadingUsers ? '...' : activeUsers}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                  </div>
                </div>

                <div className={`flex items-center space-x-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl px-3 lg:px-4 py-3 transition-all duration-200 ${isLoadingUsers ? 'animate-pulse' : ''}`}>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Activity className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                      {isLoadingUsers ? '...' : onlineUsers}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                  </div>
                </div>

                <div className={`flex items-center space-x-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl px-3 lg:px-4 py-3 transition-all duration-200 ${isLoadingUsers ? 'animate-pulse' : ''}`}>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                      {isLoadingUsers ? '...' : totalDocuments}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Documents</p>
                  </div>
                </div>
              </div>
            </div> */}
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
              <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
                Total Users
                {isLoadingUsers && <Loader2 className="h-3 w-3 animate-spin" />}
                {autoRefresh && !isLoadingUsers && <Activity className="h-3 w-3 text-green-300" />}
              </CardTitle>
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
                    {userRoles.map(role => (
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
            {isLoadingUsers ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Loading Users
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                  Fetching users from {departmentName || 'department'}...
                </p>
              </div>
            ) : filteredUsers.length === 0 ? (
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
                  onClick={openAddUserModal}
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
                        className={`group border-b border-gray-100 dark:border-gray-800 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent dark:hover:from-gray-800/50 dark:hover:to-transparent transition-all duration-200 ${
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
                          <div className="flex items-center justify-between">
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateUser(user.id, { 
                                status: user.status === 'active' ? 'inactive' : 'active' 
                              })}
                              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              title={`Set ${user.status === 'active' ? 'inactive' : 'active'}`}
                            >
                              {user.status === 'active' ? 
                                <XCircle className="h-4 w-4 text-red-500" /> : 
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              }
                            </Button>
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
                          <div className="flex items-center justify-end space-x-2">
                            {/* Quick Action Buttons - Show on hover */}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditUserModal(user)}
                                className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg"
                                title="Edit user"
                              >
                                <Edit3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteConfirm(user)}
                                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                                title="Delete user"
                              >
                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </Button>
                            </div>
                            
                            {/* Dropdown Menu */}
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
                              <DropdownMenuItem 
                                className="hover:bg-green-50 dark:hover:bg-green-900/20"
                                onClick={() => openEditUserModal(user)}
                              >
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
                              <DropdownMenuItem 
                                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => openDeleteConfirm(user)}
                              >
                                <UserMinus className="h-4 w-4 mr-2" />
                                Remove User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          </div>
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
                  onClick={closeAddUserModal}
                  className="h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name *</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="Enter full name" 
                  className="mt-2 h-12 border-2 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  placeholder="Enter email address" 
                  className="mt-2 h-12 border-2 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  placeholder="Enter phone number" 
                  className="mt-2 h-12 border-2 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password *</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => handleFormChange("password", e.target.value)}
                  placeholder="Enter password" 
                  className="mt-2 h-12 border-2 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleFormChange("role", value)}>
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
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Initial Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleFormChange("status", value)}>
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
                onClick={closeAddUserModal}
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 h-12 bg-gradient-to-r ${theme.primary} hover:opacity-90 shadow-lg transition-all duration-200 hover:scale-105`}
                onClick={handleAddUser}
                disabled={isCreatingUser}
              >
                {isCreatingUser ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                {isCreatingUser ? "Creating..." : "Add User"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg ring-4 ring-white/20 dark:ring-gray-800/20">
                    <Edit className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Edit User
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedUser.name}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeEditUserModal}
                  className="h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name *</Label>
                <Input 
                  id="edit-name" 
                  value={editFormData.name}
                  onChange={(e) => handleEditFormChange("name", e.target.value)}
                  placeholder="Enter full name" 
                  className="mt-2 h-12 border-2 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="edit-email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address *</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={editFormData.email}
                  onChange={(e) => handleEditFormChange("email", e.target.value)}
                  placeholder="Enter email address" 
                  className="mt-2 h-12 border-2 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</Label>
                <Input 
                  id="edit-phone" 
                  type="tel" 
                  value={editFormData.phone}
                  onChange={(e) => handleEditFormChange("phone", e.target.value)}
                  placeholder="Enter phone number" 
                  className="mt-2 h-12 border-2 focus:border-primary/50 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="edit-role" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role *</Label>
                <Select value={editFormData.role} onValueChange={(value) => handleEditFormChange("role", value)}>
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
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</Label>
                <Select value={editFormData.status} onValueChange={(value) => handleEditFormChange("status", value)}>
                  <SelectTrigger className="mt-2 h-12 border-2 focus:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 bg-gray-50 dark:bg-gray-800/50">
              <Button
                variant="outline"
                className="flex-1 h-12 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={closeEditUserModal}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 shadow-lg transition-all duration-200 hover:scale-105"
                onClick={handleSaveUserEdit}
                disabled={isUpdatingUser}
              >
                {isUpdatingUser ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                {isUpdatingUser ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg ring-4 ring-red-100/50 dark:ring-red-900/20">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Delete User
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to delete <strong className="font-semibold text-gray-900 dark:text-white">{selectedUser.name}</strong>? 
                This will permanently remove their account and all associated data.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                      Warning
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                      This action is permanent and cannot be reversed. The user will lose access to all their data and permissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 bg-gray-50 dark:bg-gray-800/50">
              <Button
                variant="outline"
                className="flex-1 h-12 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={closeDeleteConfirm}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 shadow-lg transition-all duration-200 hover:scale-105 text-white"
                onClick={handleConfirmDelete}
                disabled={isDeletingUser}
              >
                {isDeletingUser ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {isDeletingUser ? "Deleting..." : "Delete User"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
