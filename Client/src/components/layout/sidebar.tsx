import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  FileText, 
  Users, 
  Settings,
  Menu,
  X,
  Lightbulb,
  Bell,
  UserCircle,
  LogOut
} from "lucide-react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { clearAuthData } from "@/Utils/Auth/token"

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { id: "departments", label: "Departments", icon: Building2, path: "/departments" },
  { id: "documents", label: "Documents", icon: FileText, path: "/documents" },
  { id: "chat-assistant", label: "Chat Assistant", icon: MessageSquare, path: "/chat-assistant" },
  { id: "users", label: "Users", icon: Users, path: "/users" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  { id: "profile", label: "Profile", icon: UserCircle, path: "/profile" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" }
]

// Special featured item - Important Points
const featuredItem = {
  id: "important-points", 
  label: "Important Points", 
  icon: Lightbulb, 
  path: "/important-points",
  isNew: true,
  description: "AI-powered insights"
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false) // Start expanded by default
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  }

  return (
    <>
      <div className={cn(
        "fixed left-0 top-0 z-40 h-full bg-card border-r border-border transition-all duration-300 gradient-card shadow-card",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">K</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">KMRL</h1>
                <p className="text-xs text-muted-foreground">IntelliDocs</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 hover:bg-muted"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const itemIsActive = isActive(item.path)
              
              return (
                <li key={item.id}>
                  <Button
                    variant={itemIsActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start transition-smooth",
                      isCollapsed ? "px-3" : "px-4",
                      itemIsActive && "gradient-primary shadow-glow"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Button>
                </li>
              )
            })}
          </ul>
        </nav>

        {isCollapsed && (
          <div className="absolute bottom-4 left-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-12 w-12 hover:bg-destructive/10 hover:text-destructive"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
              <LogOut className="h-8 w-8 text-destructive mb-2" />
              <h3 className="font-semibold text-sm text-foreground mb-1">Sign Out</h3>
              <p className="text-xs text-muted-foreground mb-3">Logout from your account</p>
              <Button 
                size="sm" 
                variant="destructive" 
                className="w-full"
                onClick={() => {
                  clearAuthData();
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}