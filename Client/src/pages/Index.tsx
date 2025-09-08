import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { DepartmentGrid } from "@/components/dashboard/department-grid"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { DepartmentUpload } from "@/components/departments/department-upload"
import { ImportantPoints } from "@/components/admin/important-points"

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
    pendingDocs: 15,
    activeUsers: 6,
    completionRate: 87,
    lastUpdated: "3 hours ago",
    status: "active"
  },
  {
    id: "4",
    name: "Finance",
    category: "administrative",
    totalDocs: 678,
    pendingDocs: 23,
    activeUsers: 12,
    completionRate: 91,
    lastUpdated: "30 mins ago",
    status: "active"
  },
  {
    id: "5",
    name: "Safety",
    category: "operations",
    totalDocs: 145,
    pendingDocs: 3,
    activeUsers: 9,
    completionRate: 96,
    lastUpdated: "45 mins ago",
    status: "active"
  },
  {
    id: "6",
    name: "Operations",
    category: "operations",
    totalDocs: 567,
    pendingDocs: 18,
    activeUsers: 22,
    completionRate: 89,
    lastUpdated: "1 hour ago",
    status: "active"
  }
]

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)

  const handleDepartmentClick = (department: Department) => {
    setSelectedDepartment(department)
    setActiveView("department-upload")
  }

  const handleBackToDashboard = () => {
    setSelectedDepartment(null)
    setActiveView("dashboard")
  }

  const handleCreateDepartment = (newDepartment: Department) => {
    setDepartments(prev => [...prev, newDepartment])
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <OverviewStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground mb-2">Departments</h2>
                  <p className="text-muted-foreground">Manage documents across all KMRL departments</p>
                </div>
            <DepartmentGrid 
              onDepartmentClick={handleDepartmentClick}
              departments={departments}
            />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </div>
        )
      
      case "department-upload":
        return selectedDepartment ? (
          <DepartmentUpload 
            department={selectedDepartment} 
            onBack={handleBackToDashboard}
          />
        ) : null

      case "important-points":
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Important Points Summary</h2>
              <p className="text-muted-foreground">AI-extracted insights from all department documents</p>
            </div>
            <ImportantPoints />
          </div>
        )

      case "departments":
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">All Departments</h2>
              <p className="text-muted-foreground">Manage KMRL departments and their document workflows</p>
            </div>
            <DepartmentGrid 
              onDepartmentClick={handleDepartmentClick} 
              departments={departments}
            />
          </div>
        )

      case "documents":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">All Documents</h2>
            <p className="text-muted-foreground">Document management interface coming soon...</p>
          </div>
        )

      case "users":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">User Management</h2>
            <p className="text-muted-foreground">User administration interface coming soon...</p>
          </div>
        )

      case "settings":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Settings</h2>
            <p className="text-muted-foreground">System configuration interface coming soon...</p>
          </div>
        )

      default:
        return null
    }
  }

  const getPageTitle = () => {
    switch (activeView) {
      case "dashboard":
        return "Dashboard"
      case "department-upload":
        return `${selectedDepartment?.name} Department`
      case "important-points":
        return "Important Points"
      case "departments":
        return "Departments"
      case "documents":
        return "Documents"
      case "users":
        return "Users"
      case "settings":
        return "Settings"
      default:
        return "KMRL IntelliDocs"
    }
  }

  const getPageDescription = () => {
    switch (activeView) {
      case "dashboard":
        return "Overview of document management across all KMRL departments"
      case "important-points":
        return "AI-extracted insights and key findings from all departments"
      case "departments":
        return "Manage departments and their document workflows"
      case "documents":
        return "Search and manage all documents in the system"
      case "users":
        return "Manage user access and permissions"
      case "settings":
        return "Configure system settings and preferences"
      default:
        return undefined
    }
  }

  return (
    <div className="flex h-screen bg-background gradient-subtle">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col ml-64">
        <Header 
          title={getPageTitle()}
          description={getPageDescription()}
          showAddButton={activeView === "departments"}
          onCreateDepartment={handleCreateDepartment}
        />
        
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default Index
