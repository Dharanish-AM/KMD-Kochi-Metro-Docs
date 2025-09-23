import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit,
  Save,
  Camera,
  Shield,
  Bell,
  Eye,
  Lock,
  Globe,
  Settings,
  RefreshCw,
  Loader2,
  Crown,
  Database,
  Users,
  Activity,
  ServerCog,
  Key,
  ShieldCheck
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axiosInstance from "@/Utils/Auth/axiosInstance"
import { getUser } from "@/Utils/Auth/token"

interface AdminProfile {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  joinedAt: string
  lastLogin?: string
  bio?: string
  avatar?: string
  location?: string
  adminLevel?: "Super Admin" | "Admin" | "Moderator"
  permissions?: string[]
  systemAccess?: {
    canManageUsers: boolean
    canManageDepartments: boolean
    canAccessReports: boolean
    canModifySettings: boolean
    canBackupData: boolean
  }
  preferences?: {
    emailNotifications: boolean
    pushNotifications: boolean
    darkMode: boolean
    language: string
    timezone: string
    securityAlerts: boolean
    systemNotifications: boolean
  }
  stats?: {
    totalUsersManaged: number
    totalDepartments: number
    lastSystemBackup: string
    systemUptime: string
  }
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [formData, setFormData] = useState<AdminProfile | null>(null)

  // Get current user info from localStorage
  const currentUser = getUser()

  useEffect(() => {
    fetchAdminProfile()
  }, [])

  const fetchAdminProfile = async () => {
    try {
      setIsLoading(true)
      
      if (!currentUser?.id) {
        toast({
          title: "Error",
          description: "Admin not authenticated",
          variant: "destructive",
        })
        navigate('/login')
        return
      }

      // Check if user is admin
      if (currentUser?.role !== 'Admin') {
        toast({
          title: "Access Denied",
          description: "This page is only accessible to administrators",
          variant: "destructive",
        })
        navigate('/dashboard')
        return
      }

      const response = await axiosInstance.get(`/api/employee/${currentUser.id}`)
      
      if (response.data) {
        const adminData: AdminProfile = {
          ...response.data,
          adminLevel: "Super Admin", // Default admin level
          bio: response.data.bio || "System Administrator with full access to Metro documentation system.",
          location: response.data.location || "Kochi Metro Headquarters",
          avatar: response.data.avatar || "",
          permissions: ["read", "write", "delete", "admin", "system"],
          systemAccess: {
            canManageUsers: true,
            canManageDepartments: true,
            canAccessReports: true,
            canModifySettings: true,
            canBackupData: true
          },
          preferences: response.data.preferences || {
            emailNotifications: true,
            pushNotifications: true,
            darkMode: false,
            language: "English",
            timezone: "Asia/Kolkata",
            securityAlerts: true,
            systemNotifications: true
          },
          stats: {
            totalUsersManaged: 0, // Will be fetched separately
            totalDepartments: 0, // Will be fetched separately
            lastSystemBackup: new Date().toISOString(),
            systemUptime: "99.9%"
          }
        }
        
        setProfile(adminData)
        setFormData(adminData)
      }
    } catch (error: any) {
      console.error("Error fetching admin profile:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch admin profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData || !currentUser?.id) return

    try {
      setIsSaving(true)
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        preferences: formData.preferences
      }

      const response = await axiosInstance.put(`/api/employee/${currentUser.id}`, updateData)
      
      if (response.data.user) {
        const updatedProfile: AdminProfile = {
          ...response.data.user,
          bio: response.data.user.bio || formData.bio,
          location: response.data.user.location || formData.location,
          preferences: formData.preferences,
          // Preserve admin-specific properties
          adminLevel: formData.adminLevel || "Admin",
          permissions: formData.permissions || ["read", "write", "delete", "admin", "system"],
          systemAccess: formData.systemAccess || {
            canManageUsers: true,
            canManageDepartments: true,
            canAccessReports: true,
            canModifySettings: true,
            canBackupData: true
          },
          stats: formData.stats || {
            totalUsersManaged: 0,
            totalDepartments: 0,
            lastSystemBackup: new Date().toISOString(),
            systemUptime: "99.9%"
          }
        }
        
        setProfile(updatedProfile)
        setFormData(updatedProfile)
        setIsEditing(false)
        
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      }
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  const getDepartmentName = (department: any) => {
    if (typeof department === 'string') return department
    if (department?.name) return department.name
    return 'No Department'
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getAdminLevelColor = (level: string) => {
    switch (level) {
      case "Super Admin":
        return "bg-gradient-to-r from-purple-500 to-purple-700 text-white border-purple-300"
      case "Admin":
        return "bg-gradient-to-r from-blue-500 to-blue-700 text-white border-blue-300"
      case "Moderator":
        return "bg-gradient-to-r from-green-500 to-green-700 text-white border-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <Sidebar />
        <div className="flex-1" style={{ marginLeft: '256px' }}>
          <Header title="Admin Profile" />
          <main className="p-6">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-600 dark:text-purple-400 mb-4" />
                  <Crown className="h-6 w-6 absolute top-0 right-0 text-yellow-500" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">Loading Admin Profile...</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Accessing administrative data</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <Sidebar />
        <div className="flex-1" style={{ marginLeft: '256px' }}>
          <Header title="Admin Profile" />
          <main className="p-6">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <ShieldCheck className="h-16 w-16 text-red-400 dark:text-red-500 mx-auto mb-4" />
                <p className="text-gray-700 dark:text-gray-300 font-semibold">Admin Profile Not Found</p>
                <Button onClick={() => navigate('/login')} className="mt-4 bg-purple-600 hover:bg-purple-700">
                  Return to Login
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: '256px' }}>
        <Header title="Admin Profile" />
        <main className="p-6 space-y-6">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Admin Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Crown className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Administrative Profile
                    <ShieldCheck className="h-7 w-7 text-purple-600" />
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    System Administrator Dashboard & Settings
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="lg" onClick={handleCancel} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button size="lg" onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg">
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button size="lg" onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Enhanced Admin Profile Overview */}
              <div className="xl:col-span-1">
                <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-800/50 shadow-xl">
                  <CardHeader className="text-center pb-4">
                    <div className="relative mx-auto w-36 h-36 mb-6">
                      <Avatar className="w-36 h-36 ring-4 ring-purple-200 dark:ring-purple-800">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 text-purple-700 dark:text-purple-300 font-bold">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute bottom-2 right-2 w-10 h-10 rounded-full p-0 bg-purple-600 hover:bg-purple-700"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</CardTitle>
                    <p className="text-purple-600 dark:text-purple-400 font-semibold text-lg">{profile.role}</p>
                    <Badge className={`${getAdminLevelColor(profile.adminLevel || "Admin")} mt-3 px-4 py-2 text-sm font-semibold shadow-lg`}>
                      <Shield className="h-4 w-4 mr-2" />
                      {profile.adminLevel || "Admin"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-purple-500" />
                      <span className="text-gray-700 dark:text-gray-300">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-purple-500" />
                      <span className="text-gray-700 dark:text-gray-300">{profile.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <ServerCog className="h-4 w-4 text-purple-500" />
                      <span className="text-gray-700 dark:text-gray-300">System Administrator</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      <span className="text-gray-700 dark:text-gray-300">{profile.location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span className="text-gray-700 dark:text-gray-300">Admin since {formatDate(profile.joinedAt)}</span>
                    </div>
                    <Separator className="my-4" />
                    <div>
                      <p className="text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Admin Bio
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
                    </div>
                    
                    {/* Admin Quick Stats */}
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Users</p>
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{profile.stats?.totalUsersManaged || 0}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Database className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">Uptime</p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-300">{profile.stats?.systemUptime || "99.9%"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Admin Content */}
              <div className="xl:col-span-3 space-y-6">
                {/* System Access Permissions - Only show if systemAccess exists */}
                {profile.systemAccess && (
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-blue-800 dark:text-blue-300">
                        <Key className="h-6 w-6" />
                        System Access Permissions
                      </CardTitle>
                      <p className="text-blue-600 dark:text-blue-400">Administrative privileges and system access control</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(profile.systemAccess).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </p>
                            </div>
                            <Badge className={value ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"}>
                              {value ? "Granted" : "Denied"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Personal Information */}
                <Card className="shadow-lg border-gray-200/50 dark:border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <User className="h-5 w-5 text-purple-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={formData?.name || ''}
                            onChange={(e) => setFormData({...formData!, name: e.target.value})}
                            className="mt-2"
                          />
                        ) : (
                          <p className="text-sm mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{profile.name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email Address</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={formData?.email || ''}
                            onChange={(e) => setFormData({...formData!, email: e.target.value})}
                            className="mt-2"
                          />
                        ) : (
                          <p className="text-sm mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{profile.email}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={formData?.phone || ''}
                            onChange={(e) => setFormData({...formData!, phone: e.target.value})}
                            className="mt-2"
                          />
                        ) : (
                          <p className="text-sm mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{profile.phone || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="location" className="text-gray-700 dark:text-gray-300 font-medium">Location</Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={formData?.location || ''}
                            onChange={(e) => setFormData({...formData!, location: e.target.value})}
                            className="mt-2"
                          />
                        ) : (
                          <p className="text-sm mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{profile.location || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300 font-medium">Administrator Bio</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={formData?.bio || ''}
                          onChange={(e) => setFormData({...formData!, bio: e.target.value})}
                          className="mt-2"
                          rows={4}
                          placeholder="Describe your administrative role and experience..."
                        />
                      ) : (
                        <p className="text-sm mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg leading-relaxed">{profile.bio || 'No bio available'}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Preferences */}
                <Card className="shadow-lg border-gray-200/50 dark:border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-blue-600" />
                      Administrator Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div>
                          <Label className="font-medium">Email Notifications</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">System alerts and updates</p>
                        </div>
                        <Switch
                          checked={formData?.preferences?.emailNotifications || false}
                          onCheckedChange={(checked) => 
                            setFormData({
                              ...formData!, 
                              preferences: {...formData!.preferences!, emailNotifications: checked}
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div>
                          <Label className="font-medium">Security Alerts</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Security breach notifications</p>
                        </div>
                        <Switch
                          checked={formData?.preferences?.securityAlerts || false}
                          onCheckedChange={(checked) => 
                            setFormData({
                              ...formData!, 
                              preferences: {...formData!.preferences!, securityAlerts: checked}
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div>
                          <Label className="font-medium">System Notifications</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">System maintenance alerts</p>
                        </div>
                        <Switch
                          checked={formData?.preferences?.systemNotifications || false}
                          onCheckedChange={(checked) => 
                            setFormData({
                              ...formData!, 
                              preferences: {...formData!.preferences!, systemNotifications: checked}
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div>
                          <Label className="font-medium">Push Notifications</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Real-time browser notifications</p>
                        </div>
                        <Switch
                          checked={formData?.preferences?.pushNotifications || false}
                          onCheckedChange={(checked) => 
                            setFormData({
                              ...formData!, 
                              preferences: {...formData!.preferences!, pushNotifications: checked}
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <Label className="font-medium text-gray-700 dark:text-gray-300">Language</Label>
                        {isEditing ? (
                          <Select
                            value={formData?.preferences?.language || "English"}
                            onValueChange={(value) => 
                              setFormData({
                                ...formData!, 
                                preferences: {...formData!.preferences!, language: value}
                              })
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Hindi">Hindi</SelectItem>
                              <SelectItem value="Malayalam">Malayalam</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{profile.preferences?.language || 'English'}</p>
                        )}
                      </div>
                      <div>
                        <Label className="font-medium text-gray-700 dark:text-gray-300">Timezone</Label>
                        {isEditing ? (
                          <Select
                            value={formData?.preferences?.timezone || "Asia/Kolkata"}
                            onValueChange={(value) => 
                              setFormData({
                                ...formData!, 
                                preferences: {...formData!.preferences!, timezone: value}
                              })
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="America/New_York">Eastern Time</SelectItem>
                              <SelectItem value="Europe/London">GMT</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{profile.preferences?.timezone || 'Asia/Kolkata'}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Security Section */}
                <Card className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200/50 dark:border-red-800/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-red-800 dark:text-red-300">
                      <ShieldCheck className="h-6 w-6" />
                      Security & Access Control
                    </CardTitle>
                    <p className="text-red-600 dark:text-red-400">Administrative security settings and access management</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto p-4 justify-start bg-white dark:bg-gray-800 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <div className="flex items-center gap-3">
                          <Lock className="h-5 w-5 text-red-600" />
                          <div className="text-left">
                            <p className="font-medium">Change Admin Password</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Update your administrative password</p>
                          </div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start bg-white dark:bg-gray-800 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <div className="flex items-center gap-3">
                          <Key className="h-5 w-5 text-red-600" />
                          <div className="text-left">
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Enhanced security for admin access</p>
                          </div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start bg-white dark:bg-gray-800 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-red-600" />
                          <div className="text-left">
                            <p className="font-medium">Activity Logs</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">View administrative activity history</p>
                          </div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 justify-start bg-white dark:bg-gray-800 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-red-600" />
                          <div className="text-left">
                            <p className="font-medium">System Backup</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Configure automated backups</p>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
