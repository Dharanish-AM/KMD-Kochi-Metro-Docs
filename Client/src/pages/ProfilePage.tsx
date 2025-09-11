import { useState } from "react"
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
  Settings
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  department: string
  role: string
  location: string
  bio: string
  avatar: string
  joinedDate: string
  lastLogin: string
  status: "active" | "inactive" | "pending"
  permissions: string[]
  preferences: {
    emailNotifications: boolean
    pushNotifications: boolean
    darkMode: boolean
    language: string
    timezone: string
  }
}

const mockUserProfile: UserProfile = {
  id: "u001",
  name: "Admin User",
  email: "admin@metro.com",
  phone: "+91 9876543210",
  department: "Administration",
  role: "System Administrator",
  location: "Kochi, Kerala",
  bio: "Experienced system administrator with over 5 years in metro operations and document management systems.",
  avatar: "",
  joinedDate: "2022-01-15",
  lastLogin: "2 hours ago",
  status: "active",
  permissions: ["read", "write", "delete", "admin"],
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    language: "English",
    timezone: "Asia/Kolkata"
  }
}

export function ProfilePage() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile)
  const [formData, setFormData] = useState(profile)

  const handleSave = () => {
    setProfile(formData)
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: '256px' }}>
        <Header title="Profile" />
        <main className="p-6 space-y-6">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Profile Settings
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage your account settings and preferences
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Overview */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="text-center">
                    <div className="relative mx-auto w-32 h-32 mb-4">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute bottom-0 right-0 w-8 h-8 rounded-full p-0"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <CardTitle className="text-xl">{profile.name}</CardTitle>
                    <p className="text-gray-500 dark:text-gray-400">{profile.role}</p>
                    <Badge className={`${getStatusColor(profile.status)} mt-2`}>
                      {profile.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span>{profile.department}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Bio</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{profile.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm mt-1">{profile.name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm mt-1">{profile.email}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm mt-1">{profile.phone}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm mt-1">{profile.location}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm mt-1">{profile.bio}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={formData.preferences.emailNotifications}
                        onCheckedChange={(checked) => 
                          setFormData({
                            ...formData, 
                            preferences: {...formData.preferences, emailNotifications: checked}
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive push notifications</p>
                      </div>
                      <Switch
                        checked={formData.preferences.pushNotifications}
                        onCheckedChange={(checked) => 
                          setFormData({
                            ...formData, 
                            preferences: {...formData.preferences, pushNotifications: checked}
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Language</Label>
                        {isEditing ? (
                          <Select
                            value={formData.preferences.language}
                            onValueChange={(value) => 
                              setFormData({
                                ...formData, 
                                preferences: {...formData.preferences, language: value}
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Hindi">Hindi</SelectItem>
                              <SelectItem value="Malayalam">Malayalam</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm mt-1">{profile.preferences.language}</p>
                        )}
                      </div>
                      <div>
                        <Label>Timezone</Label>
                        {isEditing ? (
                          <Select
                            value={formData.preferences.timezone}
                            onValueChange={(value) => 
                              setFormData({
                                ...formData, 
                                preferences: {...formData.preferences, timezone: value}
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                              <SelectItem value="UTC">UTC</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm mt-1">{profile.preferences.timezone}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="h-4 w-4 mr-2" />
                        Two-Factor Authentication
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
