import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { DepartmentGrid } from "@/components/dashboard/department-grid"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ImportantPoints } from "@/components/dashboard/important-points"
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
}

const Index = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch departments from database
  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await axiosInstance.get("/api/departments/get-department-ui")
      const departmentsData = response.data
      
      // Transform backend data to frontend format
      const transformedDepartments: Department[] = departmentsData.map((dept: any) => ({
        id: dept._id,
        name: dept.name,
        description: dept.description || "",
        totalDocs: dept.documents?.length || 0,
        pendingDocs: Math.floor((dept.documents?.length || 0) * 0.1), // Simulate pending docs
        activeUsers: dept.employees?.length || 0,
        completionRate: dept.documents?.length > 0 ? Math.floor(Math.random() * 20) + 80 : 0, // Simulate completion rate
        lastUpdated: new Date(dept.createdAt).toLocaleDateString() || "Unknown",
        status: "active" as const
      }))
      
      setDepartments(transformedDepartments)
    } catch (error: any) {
      console.error("Error fetching departments:", error)
      setError("Failed to fetch departments")
      showToast.error("Error", "Failed to load departments from database")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleCreateDepartment = async (newDepartment: Omit<Department, "id" | "totalDocs" | "pendingDocs" | "activeUsers" | "completionRate" | "lastUpdated" | "status">) => {
    // The create department dialog already handles the API call
    // Just refresh the departments list
    await fetchDepartments()
  }

  const handleDepartmentClick = (department: Department) => {
    console.log("Department clicked:", department)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300" style={{ marginLeft: '256px' }}>
        <Header 
          title="Kochi Metro Documentation" 
          description="Centralized document management system"
          showAddButton={true}
          onCreateDepartment={handleCreateDepartment}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Loading departments...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button 
                    onClick={fetchDepartments}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                <OverviewStats />
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <DepartmentGrid 
                      departments={departments} 
                      onDepartmentClick={handleDepartmentClick}
                    />
                  </div>
                  <div className="space-y-6">
                    <ImportantPoints />
                    <RecentActivity />
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Index
