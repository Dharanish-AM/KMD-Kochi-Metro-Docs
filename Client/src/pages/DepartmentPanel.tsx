import { DepartmentHeader } from "@/components/layout/department-header"
import { DepartmentRoleUpload } from "@/components/departments/department-role-upload"
import { useParams } from "react-router-dom"

const DepartmentPanel = () => {
  const { departmentName } = useParams<{ departmentName: string }>()
  
  // In a real app, this would come from authentication/context
  const mockUser = {
    name: "Rajesh Kumar",
    role: "Document Manager"
  }

  const displayName = departmentName?.replace("-", " ") || "Department"

  return (
    <div className="min-h-screen bg-background gradient-subtle">
      <DepartmentHeader 
        departmentName={displayName}
        userName={mockUser.name}
        userRole={mockUser.role}
      />
      
      <main className="container mx-auto px-6 py-8">
        <DepartmentRoleUpload departmentName={displayName} />
      </main>
    </div>
  )
}

export default DepartmentPanel