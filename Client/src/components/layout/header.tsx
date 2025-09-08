import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CreateDepartmentDialog } from "@/components/admin/create-department-dialog"

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

          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </div>

          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="gradient-primary text-primary-foreground">AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}