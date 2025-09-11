import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Bell,
  Check,
  X,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Mail,
  Search,
  Filter,
  RefreshCw
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
  category: "system" | "user" | "document" | "security"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Document Review Required",
    message: "Engineering department has 3 documents pending approval that require immediate attention from department heads.",
    timestamp: "2024-01-15T10:30:00Z",
    read: false,
    actionRequired: true,
    department: "Engineering",
    category: "document"
  },
  {
    id: "2",
    type: "success",
    title: "New User Added",
    message: "John Doe has been successfully added to the Operations department with reviewer permissions.",
    timestamp: "2024-01-15T09:15:00Z",
    read: false,
    department: "Operations",
    relatedUser: "John Doe",
    category: "user"
  },
  {
    id: "3",
    type: "info",
    title: "System Maintenance Scheduled",
    message: "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM. Some features may be temporarily unavailable.",
    timestamp: "2024-01-15T08:45:00Z",
    read: true,
    category: "system"
  },
  {
    id: "4",
    type: "error",
    title: "Security Alert",
    message: "Multiple failed login attempts detected for admin account. Please review security logs immediately.",
    timestamp: "2024-01-15T07:20:00Z",
    read: false,
    actionRequired: true,
    category: "security"
  },
  {
    id: "5",
    type: "info",
    title: "Department Update",
    message: "Finance department structure has been updated with new roles and permissions.",
    timestamp: "2024-01-14T16:30:00Z",
    read: true,
    department: "Finance",
    category: "system"
  },
  {
    id: "6",
    type: "warning",
    title: "Document Expiring Soon",
    message: "Safety protocol document expires in 7 days. Please review and update before expiration.",
    timestamp: "2024-01-14T14:15:00Z",
    read: false,
    actionRequired: true,
    category: "document"
  }
]

export function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread" | "action-required">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const getNotificationIcon = (type: string, category: string) => {
    switch (category) {
      case "document":
        return <FileText className="h-5 w-5" />
      case "user":
        return <Users className="h-5 w-5" />
      case "security":
        return <AlertTriangle className="h-5 w-5" />
      case "system":
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400"
      case "warning":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "error":
        return "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400"
      case "info":
      default:
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  const filteredNotifications = notifications.filter(notif => {
    // Apply read/action filter
    if (filter === "unread" && notif.read) return false
    if (filter === "action-required" && !notif.actionRequired) return false
    
    // Apply category filter
    if (categoryFilter !== "all" && notif.category !== categoryFilter) return false
    
    // Apply search filter
    if (searchQuery && !notif.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !notif.message.toLowerCase().includes(searchQuery.toLowerCase())) return false
    
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: '256px' }}>
        <Header title="Notifications" />
        <main className="p-6 space-y-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Stay updated with system activities and important alerts
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Notifications</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{unreadCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Action Required</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{actionRequiredCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="unread">Unread Only</SelectItem>
                      <SelectItem value="action-required">Action Required</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="user">User Management</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No notifications found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchQuery || filter !== "all" || categoryFilter !== "all" 
                        ? "Try adjusting your filters or search terms"
                        : "You're all caught up! No new notifications at this time."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card key={notification.id} className={`${notification.read ? 'opacity-75' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type, notification.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              )}
                              {notification.actionRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Action Required
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs capitalize">
                                {notification.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {notification.department && (
                                <span>{notification.department}</span>
                              )}
                              {notification.relatedUser && (
                                <span>User: {notification.relatedUser}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Load More Button (if needed for pagination) */}
            {filteredNotifications.length > 0 && (
              <div className="text-center mt-6">
                <Button variant="outline">
                  Load More Notifications
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
