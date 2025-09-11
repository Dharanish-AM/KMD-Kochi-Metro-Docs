import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { CreateDepartmentDialog } from "@/components/admin/create-department-dialog"
import { NotificationsDropdown } from "./notifications-dropdown"
import { ProfileDropdown } from "./profile-dropdown"

interface HeaderProps {
  title: string
  description?: string
  onAddClick?: () => void
  showAddButton?: boolean
  onCreateDepartment?: (department: any) => void
}

export function Header({ title, description, onAddClick, showAddButton = false, onCreateDepartment }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border gradient-card shadow-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10 w-64 bg-background"
            />
          </div>

          {showAddButton && onCreateDepartment && (
            <CreateDepartmentDialog onDepartmentCreate={onCreateDepartment} />
          )}

          <NotificationsDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}