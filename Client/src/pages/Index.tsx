import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { DepartmentGrid } from "@/components/dashboard/department-grid"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ImportantPoints } from "@/components/dashboard/important-points"
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
        
        // Fallback to empty array or you could keep some default data
        setDepartments([])
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const handleCreateDepartment = async (newDepartment: Omit<Department, "id" | "totalDocs" | "pendingDocs" | "activeUsers" | "completionRate" | "lastUpdated" | "status">) => {
    // try {
    //   const response = await departmentAPI.createDepartment({
    //     name: newDepartment.name,
    //     description: newDepartment.description
    //   })
      
    //   // Transform the new department and add it to the list
    //   const transformedDepartment = transformDepartmentData(response.department)
    //   setDepartments(prev => [...prev, transformedDepartment])
      
    //   // You could also refresh the entire list
    //   // window.location.reload() or re-fetch data
    // } catch (err) {
    //   console.error('Failed to create department:', err)
    //   setError('Failed to create department. Please try again.')
    // }
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
            <OverviewStats />
            
            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-red-800">
                    <h3 className="text-sm font-medium">Error Loading Data</h3>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Loading State */}
            {loading ? (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg border p-6">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="border rounded-lg p-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border p-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border p-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Main Content */
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
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Index