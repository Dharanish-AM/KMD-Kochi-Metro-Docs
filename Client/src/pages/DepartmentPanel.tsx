import { DepartmentHeader } from "@/components/layout/department-header"
import { DepartmentRoleUpload } from "@/components/departments/department-role-upload"
import { useParams } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

const DepartmentPanel = () => {
  const { departmentName } = useParams<{ departmentName: string }>()
  const { user } = useAuth()

  const displayName = departmentName?.replace("-", " ") || "Department"

  return (
    <div className="min-h-screen bg-background gradient-subtle">
      <DepartmentHeader 
        departmentName={displayName}
        userName={user?.name || "User"}
        userRole={user?.role || "Staff Member"}
      />
      
      <main className="container mx-auto px-6 py-8">
        <DepartmentRoleUpload departmentName={displayName} />
      </main>
    </div>
  )
}

export default DepartmentPanel