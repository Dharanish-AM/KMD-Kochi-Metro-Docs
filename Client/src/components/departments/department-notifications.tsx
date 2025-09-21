import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Bell,
  BellRing,
  Check,
  X,
  Filter,
  Search,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Trash2,
  MoreVertical,
  Calendar,
  User,
  Download
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface DepartmentNotificationsProps {
  department: string
  userName: string
}

interface Notification {
  id: string
  type: "document" | "system" | "security" | "general"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  priority: "low" | "medium" | "high"
  actionRequired?: boolean
  relatedDocument?: string
  sender?: string
}

// Department theme configuration
const departmentThemes = {
  "Engineering": {
    primary: "from-blue-600 via-blue-700 to-indigo-800",
    accent: "bg-blue-500",
    text: "text-blue-600",
    lightBg: "from-blue-50 to-blue-100",
    darkBg: "from-blue-900/20 to-blue-800/20",
    border: "border-blue-200 dark:border-blue-700"
  },
  "HR": {
    primary: "from-emerald-600 via-green-700 to-teal-800",
    accent: "bg-emerald-500",
    text: "text-emerald-600",
    lightBg: "from-emerald-50 to-green-100",
    darkBg: "from-emerald-900/20 to-green-800/20",
    border: "border-emerald-200 dark:border-emerald-700"
  },
  "Legal": {
    primary: "from-purple-600 via-violet-700 to-indigo-800",
    accent: "bg-purple-500",
    text: "text-purple-600",
    lightBg: "from-purple-50 to-violet-100",
    darkBg: "from-purple-900/20 to-violet-800/20",
    border: "border-purple-200 dark:border-purple-700"
  },
  "Finance": {
    primary: "from-amber-600 via-yellow-700 to-orange-800",
    accent: "bg-amber-500",
    text: "text-amber-600",
    lightBg: "from-amber-50 to-yellow-100",
    darkBg: "from-amber-900/20 to-yellow-800/20",
    border: "border-amber-200 dark:border-amber-700"
  },
  "Safety": {
    primary: "from-red-600 via-rose-700 to-pink-800",
    accent: "bg-red-500",
    text: "text-red-600",
    lightBg: "from-red-50 to-rose-100",
    darkBg: "from-red-900/20 to-rose-800/20",
    border: "border-red-200 dark:border-red-700"
  },
  "Operations": {
    primary: "from-cyan-600 via-sky-700 to-blue-800",
    accent: "bg-cyan-500",
    text: "text-cyan-600",
    lightBg: "from-cyan-50 to-sky-100",
    darkBg: "from-cyan-900/20 to-sky-800/20",
    border: "border-cyan-200 dark:border-cyan-700"
  },
  "Procurement": {
    primary: "from-teal-600 via-emerald-700 to-green-800",
    accent: "bg-teal-500",
    text: "text-teal-600",
    lightBg: "from-teal-50 to-emerald-100",
    darkBg: "from-teal-900/20 to-emerald-800/20",
    border: "border-teal-200 dark:border-teal-700"
  },
  "Admin": {
    primary: "from-slate-600 via-gray-700 to-zinc-800",
    accent: "bg-slate-500",
    text: "text-slate-600",
    lightBg: "from-slate-50 to-gray-100",
    darkBg: "from-slate-900/20 to-gray-800/20",
    border: "border-slate-200 dark:border-slate-700"
  },
  "Maintenance": {
    primary: "from-orange-600 via-red-700 to-rose-800",
    accent: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "from-orange-50 to-red-100",
    darkBg: "from-orange-900/20 to-red-800/20",
    border: "border-orange-200 dark:border-orange-700"
  },
  "Security": {
    primary: "from-indigo-600 via-purple-700 to-violet-800",
    accent: "bg-indigo-500",
    text: "text-indigo-600",
    lightBg: "from-indigo-50 to-purple-100",
    darkBg: "from-indigo-900/20 to-purple-800/20",
    border: "border-indigo-200 dark:border-indigo-700"
  }
}

// Mock notifications data
const generateNotifications = (department: string): Notification[] => [
  {
    id: "1",
    type: "document",
    title: "Document Approved",
    message: "Your quarterly report has been approved by the review team.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    priority: "high",
    relatedDocument: "Q4_Report_2024.pdf",
    sender: "Review Team"
  },
  {
    id: "2",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2 AM to 4 AM.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isRead: true,
    priority: "medium",
    sender: "System Admin"
  },
  {
    id: "3",
    type: "document",
    title: "Document Requires Revision",
    message: "Your safety protocol document needs revisions in section 4.2.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    isRead: false,
    priority: "high",
    actionRequired: true,
    relatedDocument: "Safety_Protocol.pdf",
    sender: "Safety Officer"
  },
  {
    id: "4",
    type: "security",
    title: "Password Expiry Reminder",
    message: "Your password will expire in 7 days. Please update it soon.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true,
    priority: "medium",
    actionRequired: true,
    sender: "Security System"
  },
  {
    id: "5",
    type: "general",
    title: "Department Meeting",
    message: `${department} department meeting scheduled for tomorrow at 10 AM.`,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: false,
    priority: "low",
    sender: "Department Head"
  },
  {
    id: "6",
    type: "document",
    title: "New Document Shared",
    message: "A new training manual has been shared with your department.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRead: true,
    priority: "low",
    relatedDocument: "Training_Manual_2024.pdf",
    sender: "HR Department"
  }
]

export const DepartmentNotifications = ({ department, userName }: DepartmentNotificationsProps) => {
  const { toast } = useToast()
  const theme = departmentThemes[department as keyof typeof departmentThemes] || departmentThemes["Engineering"]
  
  const [notifications, setNotifications] = useState<Notification[]>(generateNotifications(department))
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "document" | "system" | "security" | "general">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">("all")
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: false,
    showPreview: true
  })

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (notification.sender && notification.sender.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesType = filterType === "all" || notification.type === filterType
      const matchesStatus = filterStatus === "all" || 
                           (filterStatus === "read" && notification.isRead) ||
                           (filterStatus === "unread" && !notification.isRead)
      
      return matchesSearch && matchesType && matchesStatus
    })
  }, [notifications, searchTerm, filterType, filterStatus])

  const unreadCount = notifications.filter(n => !n.isRead).length
  const priorityCount = notifications.filter(n => n.priority === "high" && !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been updated.",
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    })
  }

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === "high" ? "text-red-500" : priority === "medium" ? "text-yellow-500" : "text-gray-500"
    
    switch (type) {
      case "document":
        return <FileText className={`h-5 w-5 ${iconClass}`} />
      case "security":
        return <AlertTriangle className={`h-5 w-5 ${iconClass}`} />
      case "system":
        return <Settings className={`h-5 w-5 ${iconClass}`} />
      default:
        return <Info className={`h-5 w-5 ${iconClass}`} />
    }
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-gray-100 text-gray-800 border-gray-200"
    }
    
    return (
      <Badge variant="outline" className={variants[priority as keyof typeof variants]}>
        {priority.toUpperCase()}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`bg-gradient-to-br ${theme.primary} rounded-xl p-6 text-white shadow-2xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Notifications</h2>
              <p className="text-white/90 font-medium">Stay updated with your department activities</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{unreadCount}</div>
            <div className="text-white/80 text-sm">Unread</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`bg-gradient-to-br ${theme.lightBg} ${theme.darkBg} ${theme.border} shadow-lg`}>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${theme.text}`}>{unreadCount}</div>
                <div className="text-sm text-gray-600">Unread Messages</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-800/20 border-red-200 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{priorityCount}</div>
                <div className="text-sm text-red-600">High Priority</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 border-green-200 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{notifications.filter(n => n.actionRequired).length}</div>
                <div className="text-sm text-green-600">Action Required</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${theme.text}`}>
                <Filter className="h-5 w-5" />
                <span>Filter Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as typeof filterStatus)}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={markAllAsRead} variant="outline" className={theme.border}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Notifications</span>
                <Badge variant="secondary">{filteredNotifications.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications found</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div className={`flex items-start space-x-4 p-4 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                        !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}>
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h4>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                                {notification.actionRequired && (
                                  <Badge variant="destructive" className="text-xs">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                </span>
                                {notification.sender && (
                                  <span className="flex items-center">
                                    <User className="h-3 w-3 mr-1" />
                                    {notification.sender}
                                  </span>
                                )}
                                {notification.relatedDocument && (
                                  <span className="flex items-center">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {notification.relatedDocument}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              {getPriorityBadge(notification.priority)}
                              <div className="flex space-x-1">
                                {!notification.isRead && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {notification.relatedDocument && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <Button variant="outline" size="sm" className="text-xs">
                                <Download className="h-3 w-3 mr-1" />
                                View Document
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      {index < filteredNotifications.length - 1 && <Separator />}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${theme.text}`}>
                <Settings className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive browser notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Sound Notifications</Label>
                    <p className="text-sm text-gray-500">Play sound for new notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.soundEnabled}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, soundEnabled: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Show Preview</Label>
                    <p className="text-sm text-gray-500">Display notification content in previews</p>
                  </div>
                  <Switch
                    checked={notificationSettings.showPreview}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, showPreview: checked})}
                  />
                </div>
              </div>

              <Button className={`${theme.accent} hover:opacity-90 text-white`}>
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}