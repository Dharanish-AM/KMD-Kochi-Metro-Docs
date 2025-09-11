import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlus, User } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: "active" | "inactive" | "pending"
  lastLogin: string
  permissions: string[]
  joinedDate: string
}

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onAddUser: (user: Partial<User>) => void
  departmentName: string
}

const availablePermissions = [
  { id: "read", label: "Read", description: "View documents and data" },
  { id: "write", label: "Write", description: "Create and edit documents" },
  { id: "delete", label: "Delete", description: "Remove documents and data" },
  { id: "admin", label: "Admin", description: "Full administrative access" }
]

const commonRoles = [
  "Manager",
  "Senior Engineer",
  "Engineer", 
  "Junior Engineer",
  "Specialist",
  "Analyst",
  "Coordinator",
  "Assistant",
  "Supervisor",
  "Director"
]

export function AddUserModal({ isOpen, onClose, onAddUser, departmentName }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "pending" as "active" | "inactive" | "pending",
    permissions: ["read"] as string[]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required"
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = "At least one permission is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onAddUser(formData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "pending",
      permissions: ["read"]
    })
    setErrors({})
    onClose()
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }))
  }

  const handleRoleSelect = (role: string) => {
    setFormData(prev => ({ ...prev, role }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full mx-auto max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-2xl font-semibold">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
              <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold">Add New User</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                Add a new user to the {departmentName} department
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-8 p-1">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    className={`h-11 ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  {errors.name && <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.name}
                  </p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@metro.com"
                    className={`h-11 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email}
                  </p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 234-567-8900"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">Role *</Label>
                  <Select value={formData.role} onValueChange={handleRoleSelect}>
                    <SelectTrigger className={`h-11 ${errors.role ? "border-red-500 focus:border-red-500" : ""}`}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Role...</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.role === "custom" && (
                    <Input
                      value={formData.role === "custom" ? "" : formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="Enter custom role"
                      className="mt-2 h-11"
                    />
                  )}
                  {errors.role && <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.role}
                  </p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Initial Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          Pending (Requires Approval)
                        </div>
                      </SelectItem>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Active
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Inactive
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            <div className="space-y-6 border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">P</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Permissions *</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {permission.label}
                      </Label>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {errors.permissions && <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.permissions}
              </p>}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-2 h-11 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-6 py-2 h-11 order-1 sm:order-2"
              >
                <User className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
