import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  User,
  Settings,
  LogOut,
  Shield,
  Bell,
  HelpCircle,
  Moon,
  Sun,
  Palette,
  Key,
  Activity
} from "lucide-react"

interface UserProfile {
  name: string
  email: string
  avatar: string
  role: string
  department: string
  status: "active" | "inactive" | "pending"
}

const mockUser: UserProfile = {
  name: "Admin User",
  email: "admin@metro.com",
  avatar: "",
  role: "System Administrator",
  department: "Administration",
  status: "active"
}

export function ProfileDropdown() {
  const navigate = useNavigate()
  const [user] = useState<UserProfile>(mockUser)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...")
    // Redirect to login or home page
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Here you would typically update the theme context or localStorage
    document.documentElement.classList.toggle('dark')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {/* Online status indicator */}
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 p-0" 
        align="end" 
        sideOffset={8}
      >
        {/* User Info Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {user.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getStatusColor(user.status)} text-xs`}>
                  {user.status}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user.department}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2">
          {/* Profile Section */}
          <DropdownMenuItem 
            onClick={handleProfileClick}
            className="cursor-pointer p-3 rounded-md"
          >
            <User className="mr-3 h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">View Profile</div>
              <div className="text-xs text-gray-500">Manage your account settings</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer p-3 rounded-md">
            <Settings className="mr-3 h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">Settings</div>
              <div className="text-xs text-gray-500">App preferences and configuration</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          {/* Quick Actions */}
          <div className="px-2 py-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quick Actions
            </p>
          </div>

          <DropdownMenuItem className="cursor-pointer p-3 rounded-md">
            <Activity className="mr-3 h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">Activity Log</div>
              <div className="text-xs text-gray-500">View your recent activity</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer p-3 rounded-md">
            <Bell className="mr-3 h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">Notification Settings</div>
              <div className="text-xs text-gray-500">Manage your notifications</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer p-3 rounded-md">
            <Shield className="mr-3 h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">Security</div>
              <div className="text-xs text-gray-500">Password and security settings</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="cursor-pointer p-3 rounded-md"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-3 h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">Settings</div>
              <div className="text-xs text-gray-500">Application preferences</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          {/* Appearance */}
          <DropdownMenuItem 
            onClick={toggleDarkMode}
            className="cursor-pointer p-3 rounded-md"
          >
            {isDarkMode ? (
              <Sun className="mr-3 h-4 w-4" />
            ) : (
              <Moon className="mr-3 h-4 w-4" />
            )}
            <div className="flex-1">
              <div className="font-medium">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </div>
              <div className="text-xs text-gray-500">Switch theme appearance</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer p-3 rounded-md">
            <Palette className="mr-3 h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">Appearance</div>
              <div className="text-xs text-gray-500">Customize the interface</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          {/* Help & Support */}
          <DropdownMenuItem className="cursor-pointer p-3 rounded-md">
            <HelpCircle className="mr-3 h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">Help & Support</div>
              <div className="text-xs text-gray-500">Get help and documentation</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          {/* Logout */}
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer p-3 rounded-md text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 focus:bg-red-50 dark:focus:bg-red-900/20"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">Sign Out</div>
              <div className="text-xs opacity-75">Sign out of your account</div>
            </div>
          </DropdownMenuItem>
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Role: {user.role}</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
