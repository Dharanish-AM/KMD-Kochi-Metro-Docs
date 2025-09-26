import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DepartmentGrid } from "@/components/dashboard/department-grid"
import { departmentAPI, transformDepartmentData } from "@/lib/api"
import { CustomCreateDepartmentDialog } from "@/components/departments/custom-create-department-dialog"
import { EditDepartmentDialog } from "@/components/departments/edit-department-dialog"
import { DeleteDepartmentDialog } from "@/components/departments/delete-department-dialog"
import axiosInstance from "@/Utils/Auth/axiosInstance"
import { showToast } from "@/Utils/toaster"
import { Search, Filter, Grid3X3, List, RefreshCw, Building2, Users, FileText, TrendingUp, Activity, Sparkles, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Department {
  id: string
  name: string
  description?: string
  category?: string
  totalDocs: number
  pendingDocs: number
  activeUsers: number
  completionRate: number
  lastUpdated: string
  status: "active" | "maintenance" | "inactive"
  slug: string
}

export function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axiosInstance.get("/api/departments/get-department-ui")
      
      // Transform backend data to match frontend interface (same as Dashboard)
      const transformedDepartments: Department[] = response.data.map((dept: any) => ({
        id: dept._id,
        name: dept.name,
        description: dept.description || "",
        category: "General", // Default category since backend doesn't have this field
        totalDocs: dept.documents?.length || 0,
        pendingDocs: 0, // This would need backend calculation
        activeUsers: dept.employees?.length || 0,
        completionRate: dept.documents?.length > 0 ? Math.round(Math.random() * 100) : 0, // Mock calculation
        lastUpdated: new Date(dept.createdAt).toLocaleDateString() || "Recently",
        status: "active" as const,
        slug: dept.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
      }))
      
      setDepartments(transformedDepartments)
      setFilteredDepartments(transformedDepartments)
    } catch (err: any) {
      console.error('Failed to fetch departments:', err)
      const errorMessage = err.response?.data?.message || 'Failed to load departments. Please try again later.'
      setError(errorMessage)
      showToast(errorMessage, "error")
      
      // Fallback to empty array
      setDepartments([])
      setFilteredDepartments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  // Filter departments based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDepartments(departments)
    } else {
      const filtered = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredDepartments(filtered)
    }
  }, [searchTerm, departments])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchDepartments()
      showToast("Departments refreshed successfully!", "success")
    } catch (err) {
      console.error('Failed to refresh departments:', err)
      // Error handling is already done in fetchDepartments
    } finally {
      setRefreshing(false)
    }
  }

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department)
    setShowEditDialog(true)
  }

  const handleDeleteDepartment = (department: Department) => {
    setDeletingDepartment(department)
    setShowDeleteDialog(true)
  }

  const handleDepartmentUpdated = () => {
    fetchDepartments()
  }

  const handleDepartmentDeleted = () => {
    fetchDepartments()
  }

  const totalDocs = filteredDepartments.reduce((sum, dept) => sum + dept.totalDocs, 0)
  const totalUsers = filteredDepartments.reduce((sum, dept) => sum + dept.activeUsers, 0)
  const avgCompletionRate = filteredDepartments.length > 0 
    ? Math.round(filteredDepartments.reduce((sum, dept) => sum + dept.completionRate, 0) / filteredDepartments.length)
    : 0

  const handleCreateDepartment = async (dialogDepartment: any) => {
    try {
      // Call the real API to create the department
      const response = await axiosInstance.post("/api/departments/create-department", {
        name: dialogDepartment.name,
        description: dialogDepartment.description || ""
      })
      
      if (response.data && response.data.department) {
        // Transform the new department to match our local interface
        const newDept = response.data.department
        const departmentToAdd: Department = {
          id: newDept._id,
          name: newDept.name,
          description: newDept.description || "",
          category: "General", // Default category
          totalDocs: newDept.documents?.length || 0,
          pendingDocs: 0,
          activeUsers: newDept.employees?.length || 0,
          completionRate: 0,
          lastUpdated: new Date(newDept.createdAt).toLocaleDateString() || "Recently",
          status: "active" as const,
          slug: newDept.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
        }
        
        // Add the new department to the list
        setDepartments(prev => [...prev, departmentToAdd])
        setFilteredDepartments(prev => [...prev, departmentToAdd])
        
        // Show success message
        showToast(`Department "${departmentToAdd.name}" created successfully!`, "success")
        console.log('Department created successfully:', departmentToAdd)
      }
      
    } catch (err: any) {
      console.error('Failed to create department:', err)
      
      // Handle specific error messages from the API
      const errorMessage = err.response?.data?.message || 'Failed to create department. Please try again.'
      setError(errorMessage)
      showToast(errorMessage, "error")
    }
  }

  const handleDepartmentClick = (department: Department) => {
    console.log("Department clicked:", department)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300" style={{ marginLeft: '256px' }}>
          <Header 
            title="Departments" 
            description="Manage all KMRL departments and their document workflows"
            showAddButton={true}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="p-6 flex items-center justify-center min-h-[500px]">
              <div className="flex flex-col items-center gap-8">
                {/* Enhanced Loading Animation */}
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-400 rounded-full animate-spin" style={{ animationDelay: '150ms' }} />
                  <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin" style={{ animationDelay: '300ms' }} />
                </div>
                
                {/* Loading Content */}
                <div className="text-center space-y-4">
                  <div className="flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-white">
                    <Sparkles className="h-6 w-6 text-blue-500 animate-pulse" />
                    Loading Departments
                    <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Fetching the latest department information...
                  </p>
                </div>

                {/* Animated Dots */}
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                </div>

                {/* Loading Stats Preview */}
                <div className="grid grid-cols-3 gap-6 mt-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg animate-pulse">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mb-3" />
                      <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                      <div className="w-12 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50 dark:from-gray-900 dark:via-red-900/20 dark:to-rose-900/20">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300" style={{ marginLeft: '256px' }}>
          <Header 
            title="Departments" 
            description="Manage all KMRL departments and their document workflows"
            showAddButton={true}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="p-6 flex items-center justify-center min-h-[500px]">
              <div className="flex flex-col items-center gap-8 max-w-md">
                {/* Error Animation */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Activity className="h-12 w-12 text-white animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <span className="text-white text-lg font-bold">!</span>
                  </div>
                </div>

                {/* Error Content */}
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Oops! Something went wrong
                  </h3>
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-red-700 dark:text-red-300 font-medium">
                      {error}
                    </p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Don't worry, we're here to help you get back on track.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Try Again
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setError(null)}
                    className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    Dismiss
                  </Button>
                </div>

                {/* Help Section */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 w-full">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Need Help?</h4>
                  <p className="text-blue-700 dark:text-blue-400 text-sm">
                    If this problem persists, please contact your system administrator or check your network connection.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300" style={{ marginLeft: '256px' }}>
        <Header 
          title="Departments" 
          description="Manage all KMRL departments and their document workflows"
          showAddButton={true}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Enhanced Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-16" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Building2 className="h-10 w-10" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold mb-2">KMRL Departments</h1>
                      <p className="text-blue-100 text-lg">Comprehensive management dashboard</p>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="hidden lg:flex gap-6">
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="text-3xl font-bold">{filteredDepartments.length}</div>
                      <div className="text-sm text-blue-100">Departments</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="text-3xl font-bold">{totalDocs.toLocaleString()}</div>
                      <div className="text-sm text-blue-100">Documents</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="text-3xl font-bold">{totalUsers}</div>
                      <div className="text-sm text-blue-100">Active Users</div>
                    </div>
                  </div>
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                    <Input
                      placeholder="Search departments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/50 rounded-xl h-12"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Add Department Button */}
                    <CustomCreateDepartmentDialog 
                      onDepartmentCreate={handleCreateDepartment}
                      trigger={
                        <Button
                          variant="secondary"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-xl h-12 px-6 transition-all duration-200 shadow-lg backdrop-blur-sm"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Add Department
                        </Button>
                      }
                    />
                    
                    <Button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      variant="secondary"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 rounded-xl h-12 px-6"
                    >
                      <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    
                    <div className="flex bg-white/20 rounded-xl p-1">
                      <Button
                        onClick={() => setViewMode("grid")}
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        className={`rounded-lg ${
                          viewMode === "grid" 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-white hover:bg-white/20"
                        }`}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => setViewMode("list")}
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="sm"
                        className={`rounded-lg ${
                          viewMode === "list" 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-white hover:bg-white/20"
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Quick Stats */}
            <div className="lg:hidden grid grid-cols-3 gap-4">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{filteredDepartments.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Departments</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalDocs.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Documents</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Users</div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  System Performance
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  All systems operational
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{avgCompletionRate}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average Completion</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${avgCompletionRate}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">98.5%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">System Uptime</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full w-[98.5%] transition-all duration-1000" />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Support Available</div>
                  <div className="flex justify-center mt-2">
                    <div className="w-6 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Department Grid */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <DepartmentGrid 
                departments={filteredDepartments} 
                onDepartmentClick={handleDepartmentClick}
                onEditDepartment={handleEditDepartment}
                onDeleteDepartment={handleDeleteDepartment}
                showActions={true}
              />
            </div>
          </div>
        </main>

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 lg:hidden z-50">
          <CustomCreateDepartmentDialog 
            onDepartmentCreate={handleCreateDepartment}
            trigger={
              <Button
                size="lg"
                className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl border-0 transition-all duration-300 hover:scale-110"
              >
                <Plus className="h-6 w-6" />
              </Button>
            }
          />
        </div>

        {/* Edit Department Dialog */}
        <EditDepartmentDialog
          department={editingDepartment}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onDepartmentUpdated={handleDepartmentUpdated}
        />

        {/* Delete Department Dialog */}
        <DeleteDepartmentDialog
          department={deletingDepartment}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onDepartmentDeleted={handleDepartmentDeleted}
        />
      </div>
    </div>
  )
}
