import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
  Users as UsersIcon
} from "lucide-react"
import { AddUserModal } from "../components/dashboard/add-user-modal"

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
  "engineering": [ // Engineering
    {
      id: "u1",
      name: "John Smith",
      email: "john.smith@metro.com",
      phone: "+1 234-567-8901",
      role: "Senior Engineer",
      status: "active",
      lastLogin: "2 hours ago",
      permissions: ["read", "write", "delete", "admin"],
      joinedDate: "2023-01-15"
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
      joinedDate: "2023-02-20"
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
      joinedDate: "2023-03-10"
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
      joinedDate: "2022-08-12"
    }
  ],
  "hr": [ // HR
    {
      id: "u5",
      name: "Lisa Brown",
      email: "lisa.brown@metro.com",
      phone: "+1 234-567-8905",
      role: "HR Manager",
      status: "active",
      lastLogin: "30 mins ago",
      permissions: ["read", "write", "admin"],
      joinedDate: "2022-11-05"
    },
    {
      id: "u6",
      name: "David Garcia",
      email: "david.garcia@metro.com",
      phone: "+1 234-567-8906",
      role: "HR Specialist",
      status: "pending",
      lastLogin: "Never",
      permissions: ["read"],
      joinedDate: "2024-01-15"
    },
    {
      id: "u7",
      name: "Anna Martinez",
      email: "anna.martinez@metro.com",
      phone: "+1 234-567-8907",
      role: "Recruiter",
      status: "active",
      lastLogin: "4 hours ago",
      permissions: ["read", "write"],
      joinedDate: "2023-06-20"
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

  useEffect(() => {
    if (departmentId) {
      const deptUsers = mockUsers[departmentId] || []
      setUsers(deptUsers)
      setDepartmentName(departmentNames[departmentId] || departmentId)
    }
  }, [departmentId])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {departmentName} Department Users
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage users, roles, and permissions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add User */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={() => setIsAddUserModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Permissions</TableHead>
                  <TableHead className="font-semibold">Last Login</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500 dark:text-gray-400">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900 dark:text-white">{user.role}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(user.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(user.status)}
                        <span className="capitalize">{user.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {["read", "write", "delete", "admin"].map((permission) => (
                          <div key={permission} className="flex items-center gap-2">
                            <Switch
                              checked={user.permissions.includes(permission)}
                              onCheckedChange={() => togglePermission(user.id, permission)}
                            />
                            <span className="text-xs capitalize text-gray-600 dark:text-gray-300">
                              {permission}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{user.lastLogin}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.status}
                          onValueChange={(value) => handleUpdateUser(user.id, { status: value as any })}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "No users match your search criteria." : "No users in this department yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
        departmentName={departmentName}
      />
    </div>
  )
}
