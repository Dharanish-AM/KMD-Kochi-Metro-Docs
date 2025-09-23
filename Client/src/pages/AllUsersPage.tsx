import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  RefreshCw,
  Building2,
  UserCheck,
  Calendar,
  TrendingUp
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import axiosInstance from "@/Utils/Auth/axiosInstance"

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  department: string
  joinedAt: string
  lastLogin: string
}
export function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get('/api/employee/all')
      
      if (response.data.users) {
        setUsers(response.data.users)
        toast({
          title: "Success",
          description: `Fetched ${response.data.total} users successfully`,
        })
      }
    } catch (error: any) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAllUsers()
    setIsRefreshing(false)
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "Never") return "Never"
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDepartmentColor = (department: string) => {
    const colors = {
      "Engineering": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "HR": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Safety": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Finance": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Operations": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "Legal": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      "Admin": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      "No Department": "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300"
    }
    return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-gray-900/50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300" style={{ marginLeft: '256px' }}>
        <Header 
          title="All Users" 
          description="Manage and view all users across departments"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50/80 to-white dark:from-gray-900/80 dark:to-gray-950">
          <div className="p-6 space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200/50 dark:border-blue-800/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">Total Users</CardTitle>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{users.length}</div>
                  <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Across all departments
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100/80 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200/50 dark:border-purple-800/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">Departments</CardTitle>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{new Set(users.map(u => u.department)).size}</div>
                  <p className="text-xs text-purple-600/80 dark:text-purple-400/80 mt-1 flex items-center">
                    <Building2 className="h-3 w-3 mr-1" />
                    Active departments
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100/80 dark:from-green-950/50 dark:to-green-900/30 border-green-200/50 dark:border-green-800/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300">Recent Joins</CardTitle>
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {users.filter(u => {
                      const joinDate = new Date(u.joinedAt)
                      const thirtyDaysAgo = new Date()
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                      return joinDate > thirtyDaysAgo
                    }).length}
                  </div>
                  <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Last 30 days
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100/80 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200/50 dark:border-orange-800/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-orange-700 dark:text-orange-300">Unique Roles</CardTitle>
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{new Set(users.map(u => u.role)).size}</div>
                  <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1 flex items-center">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Different roles
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Search and Actions */}
            <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-gray-200/80 dark:border-gray-800/80 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      placeholder="Search users by name, email, department, or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-11 h-12 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    {/* <Button 
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Users Table */}
            <Card className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-gray-200/80 dark:border-gray-800/80 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50/80 to-white dark:from-gray-900/80 dark:to-gray-950 border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      All Users ({filteredUsers.length})
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {searchTerm ? `Showing results for "${searchTerm}"` : 'Complete list of users across all departments'}
                    </p>
                  </div>
                  {users.length > 0 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {filteredUsers.length} of {users.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 font-medium">Loading users...</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Please wait while we fetch the data</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/80 dark:bg-gray-900/80 hover:bg-gray-50/90 dark:hover:bg-gray-900/90">
                          <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">User</TableHead>
                          <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Department</TableHead>
                          <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Role</TableHead>
                          <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Joined</TableHead>
                          <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Last Login</TableHead>
                          <TableHead className="font-semibold text-gray-700 dark:text-gray-300 w-[70px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-12">
                              <div className="flex flex-col items-center space-y-3">
                                <Users className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                                <div>
                                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                                  </p>
                                  {searchTerm && (
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                      Try adjusting your search terms
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user, index) => (
                            <TableRow 
                              key={user._id} 
                              className="hover:bg-gray-50/80 dark:hover:bg-gray-900/50 transition-colors duration-200 border-gray-100 dark:border-gray-800"
                            >
                              <TableCell className="py-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-10 w-10 ring-2 ring-gray-200 dark:ring-gray-700">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 font-semibold">
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`${getDepartmentColor(user.department)} font-medium`}>
                                  {user.department}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium text-gray-700 dark:text-gray-300">{user.role}</TableCell>
                              <TableCell className="text-sm text-gray-600 dark:text-gray-400">{formatDate(user.joinedAt)}</TableCell>
                              <TableCell className="text-sm text-gray-600 dark:text-gray-400">{formatDate(user.lastLogin)}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                                    <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
