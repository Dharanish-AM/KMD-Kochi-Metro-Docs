import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { DepartmentGrid } from "@/components/dashboard/department-grid"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { DepartmentUpload } from "@/components/departments/department-upload"
import { ImportantPoints } from "@/components/admin/important-points"
import axiosInstance from "@/Utils/Auth/axiosInstance"
import { showToast } from "@/Utils/toaster"

interface Department {
  id: string
  name: string
  description?: string
  totalDocs: number
  pendingDocs: number
  activeUsers: number
  completionRate: number
  lastUpdated: string
  status: "active" | "maintenance" | "inactive"
  slug: string
}

export function Dashboard() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [activeView, setActiveView] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/api/departments/get-department-ui")
   
      
      // Transform backend data to match frontend interface
      const transformedDepartments: Department[] = response.data.map((dept: any) => ({
        id: dept._id,
        name: dept.name,
        description: dept.description || "",
        totalDocs: dept.documents?.length || 0,
        pendingDocs: 0, // This would need backend calculation
        activeUsers: dept.employees?.length || 0,
        completionRate: dept.documents?.length > 0 ? Math.round(Math.random() * 100) : 0, // Mock calculation
        lastUpdated: new Date(dept.createdAt).toLocaleDateString() || "Recently",
        status: "active" as const,
        slug: dept.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
      }))
      
      setDepartments(transformedDepartments)
    } catch (error: any) {
      console.error("Error fetching departments:", error)
      showToast.error(
        "Failed to load departments",
        "Unable to fetch departments from server"
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleCreateDepartment = async (newDepartment: Omit<Department, "id" | "totalDocs" | "pendingDocs" | "activeUsers" | "completionRate" | "lastUpdated" | "status">) => {
 
    await fetchDepartments()
  }

  const handleDepartmentClick = (department: Department) => {
    console.log("Department clicked:", department)
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-600">Loading departments...</p>
          </div>
        </div>
      )
    }

    switch (activeView) {
      case "dashboard":
        return (
          <div className="p-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DepartmentGrid 
                  departments={departments} 
                  onDepartmentClick={handleDepartmentClick}
                />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </div>
        )
      case "important-points":
        return (
          <div className="p-6">
            <ImportantPoints />
          </div>
        )
      case "departments":
        return (
          <div className="p-6 space-y-6">
            <DepartmentGrid 
              departments={departments} 
              onDepartmentClick={handleDepartmentClick}
            />
          </div>
        )
      case "documents":
        return (
          <div className="p-6">
            <DepartmentUpload />
          </div>
        )
      case "users":
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Management</h2>
              <p className="text-gray-600 dark:text-gray-400">Manage users across all departments</p>
            </div>
          </div>
        )
      case "settings":
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Application settings and preferences</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="p-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DepartmentGrid 
                  departments={departments} 
                  onDepartmentClick={handleDepartmentClick}
                />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Kochi Metro Documentation" 
          description="Centralized document management system"
          showAddButton={activeView === "dashboard" || activeView === "departments"}
          onCreateDepartment={handleCreateDepartment}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
