import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { DepartmentGrid } from "@/components/dashboard/department-grid"
import { RecentActivity } from "@/components/dashboard/recent-activity"

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
}

const initialDepartments: Department[] = [
  {
    id: "1",
    name: "Engineering",
    category: "technical",
    totalDocs: 456,
    pendingDocs: 12,
    activeUsers: 15,
    completionRate: 94,
    lastUpdated: "2 hours ago",
    status: "active"
  },
  {
    id: "2", 
    name: "HR",
    category: "administrative",
    totalDocs: 234,
    pendingDocs: 8,
    activeUsers: 8,
    completionRate: 98,
    lastUpdated: "1 hour ago",
    status: "active"
  },
  {
    id: "3",
    name: "Legal",
    category: "administrative",
    totalDocs: 189,
    pendingDocs: 5,
    activeUsers: 6,
    completionRate: 96,
    lastUpdated: "3 hours ago",
    status: "active"
  },
  {
    id: "4",
    name: "Finance",
    category: "administrative", 
    totalDocs: 567,
    pendingDocs: 23,
    activeUsers: 12,
    completionRate: 91,
    lastUpdated: "4 hours ago",
    status: "active"
  },
  {
    id: "5",
    name: "Operations",
    category: "operational",
    totalDocs: 789,
    pendingDocs: 34,
    activeUsers: 20,
    completionRate: 89,
    lastUpdated: "1 hour ago",
    status: "active"
  },
  {
    id: "6",
    name: "Safety",
    category: "operational",
    totalDocs: 345,
    pendingDocs: 15,
    activeUsers: 10,
    completionRate: 93,
    lastUpdated: "2 hours ago",
    status: "active"
  },
  {
    id: "7",
    name: "Maintenance",
    category: "operational",
    totalDocs: 445,
    pendingDocs: 18,
    activeUsers: 14,
    completionRate: 88,
    lastUpdated: "5 hours ago",
    status: "maintenance"
  },
  {
    id: "8",
    name: "Customer Service",
    category: "operational",
    totalDocs: 256,
    pendingDocs: 9,
    activeUsers: 16,
    completionRate: 97,
    lastUpdated: "30 minutes ago",
    status: "active"
  }
]

const Index = () => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)

  const handleCreateDepartment = (newDepartment: Omit<Department, "id" | "totalDocs" | "pendingDocs" | "activeUsers" | "completionRate" | "lastUpdated" | "status">) => {
    const department: Department = {
      ...newDepartment,
      id: (departments.length + 1).toString(),
      totalDocs: 0,
      pendingDocs: 0,
      activeUsers: 1,
      completionRate: 0,
      lastUpdated: "Just now",
      status: "active"
    }
    setDepartments(prev => [...prev, department])
  }

  const handleDepartmentClick = (department: Department) => {
    console.log("Department clicked:", department)
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
