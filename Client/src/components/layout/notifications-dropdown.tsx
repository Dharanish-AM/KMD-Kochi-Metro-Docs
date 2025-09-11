import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  Check,
  X,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Mail
} from "lucide-react"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionRequired?: boolean
  department?: string
  relatedUser?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Document Review Required",
    message: "Engineering department has 3 documents pending approval",
    timestamp: "2 hours ago",
    read: false,
    actionRequired: true,
    department: "Engineering"
  },
  {
    id: "2",
    type: "success",
    title: "User Access Approved",
    message: "Sarah Johnson has been granted access to HR department",
    timestamp: "4 hours ago",
    read: false,
    relatedUser: "Sarah Johnson",
    department: "HR"
  },
  {
    id: "3",
    type: "info",
    title: "System Maintenance",
    message: "Scheduled maintenance window: Tonight 11 PM - 2 AM IST",
    timestamp: "6 hours ago",
    read: true
  },
  {
    id: "4",
    type: "error",
    title: "Upload Failed",
    message: "Failed to upload 2 documents in Finance department",
    timestamp: "1 day ago",
    read: true,
    actionRequired: true,
    department: "Finance"
  },
  {
    id: "5",
    type: "info",
    title: "New User Registration",
    message: "Mike Wilson has requested access to Engineering department",
    timestamp: "1 day ago",
    read: true,
    actionRequired: true,
    relatedUser: "Mike Wilson",
    department: "Engineering"
  },
  {
    id: "6",
    type: "success",
    title: "Backup Completed",
    message: "Daily backup completed successfully for all departments",
    timestamp: "2 days ago",
    read: true
  }
]

export function NotificationsDropdown() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: false } : notification
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-blue-500" />
    }
  }

  const getNotificationBg = (type: string, read: boolean) => {
    const opacity = read ? "opacity-60" : ""
    switch (type) {
      case "success":
        return `bg-green-50 dark:bg-green-900/20 ${opacity}`
      case "warning":
        return `bg-yellow-50 dark:bg-yellow-900/20 ${opacity}`
      case "error":
        return `bg-red-50 dark:bg-red-900/20 ${opacity}`
      default:
        return `bg-blue-50 dark:bg-blue-900/20 ${opacity}`
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-96 max-h-[80vh] overflow-hidden p-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs h-7"
                >
                  Mark all read
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAll}
                className="text-xs h-7 text-red-600 hover:text-red-700"
              >
                Clear all
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    !notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${!notification.read ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"}`}>
                            {notification.title}
                          </h4>
                          <p className={`text-sm mt-1 ${!notification.read ? "text-gray-700 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-400">
                              {notification.timestamp}
                            </span>
                            {notification.department && (
                              <Badge variant="outline" className="text-xs">
                                {notification.department}
                              </Badge>
                            )}
                            {notification.actionRequired && (
                              <Badge variant="destructive" className="text-xs">
                                Action Required
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsUnread(notification.id)}
                              className="h-6 w-6 p-0"
                              title="Mark as unread"
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                            title="Delete notification"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t bg-gray-50 dark:bg-gray-800">
            <Button 
              variant="ghost" 
              className="w-full text-sm h-8"
              onClick={() => {
                setIsOpen(false)
                navigate('/notifications')
              }}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
