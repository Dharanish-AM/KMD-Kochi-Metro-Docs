import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { DepartmentGrid } from "@/components/dashboard/department-grid"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { departmentAPI, transformDepartmentData } from "@/lib/api"

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

const Index = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const apiDepartments = await departmentAPI.getDepartments()
        const transformedDepartments = apiDepartments.map(transformDepartmentData)
        
        setDepartments(transformedDepartments)
      } catch (err) {
        console.error('Failed to fetch departments:', err)
        setError('Failed to load departments. Please try again later.')
        
        // Fallback to empty array
        setDepartments([])
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const handleCreateDepartment = async (newDepartment: Omit<Department, "id" | "totalDocs" | "pendingDocs" | "activeUsers" | "completionRate" | "lastUpdated" | "status">) => {
    try {
      const response = await departmentAPI.createDepartment({
        name: newDepartment.name,
        description: newDepartment.description
      })
      
      // Transform the new department and add it to the list
      const transformedDepartment = transformDepartmentData(response.department)
      setDepartments(prev => [...prev, transformedDepartment])
    } catch (err) {
      console.error('Failed to create department:', err)
    }
  }

  const handleDepartmentClick = (department: Department) => {
    console.log("Department clicked:", department)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title="Kochi Metro Documentation" 
            description="Centralized document management system"
            showAddButton={true}
            onCreateDepartment={handleCreateDepartment}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="p-6 flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-600">Loading departments...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title="Kochi Metro Documentation" 
            description="Centralized document management system"
            showAddButton={true}
            onCreateDepartment={handleCreateDepartment}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="p-6 flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <div className="text-red-500 text-center">
                  <h3 className="text-lg font-semibold mb-2">Error Loading Departments</h3>
                  <p className="text-sm">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Kochi Metro Documentation" 
          description="Centralized document management system"
          showAddButton={true}
          onCreateDepartment={handleCreateDepartment}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6 space-y-6">
            <OverviewStats />
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
        </main>
      </div>
    </div>
  )
}

export default Index
