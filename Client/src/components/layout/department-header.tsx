import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Upload, FileText, LogOut } from "lucide-react"

interface DepartmentHeaderProps {
  departmentName: string
  userName: string
  userRole: string
}

export function DepartmentHeader({ departmentName, userName, userRole }: DepartmentHeaderProps) {
  return (
    <header className="bg-card border-b border-border gradient-card shadow-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">K</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{departmentName} Department</h1>
            <p className="text-sm text-muted-foreground">KMRL IntelliDocs - Document Upload Portal</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <Badge variant="outline" className="text-xs">
                {userRole}
              </Badge>
            </div>
            
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="gradient-primary text-primary-foreground">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="w-px h-8 bg-border"></div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" title="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              My Uploads
            </Button>
            
            <Button variant="ghost" size="icon" title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}