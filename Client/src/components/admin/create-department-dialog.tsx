import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Building2 } from "lucide-react"
import axiosInstance from "@/Utils/Auth/axiosInstance"
import { showToast } from "@/Utils/toaster"

interface Department {
  id: string
  name: string
  description: string
  totalDocs: number
  pendingDocs: number
  activeUsers: number
  completionRate: number
  lastUpdated: string
  status: "active" | "maintenance" | "inactive"
}

interface CreateDepartmentDialogProps {
  onDepartmentCreate: (department: Department) => void
}

export function CreateDepartmentDialog({ onDepartmentCreate }: CreateDepartmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      showToast.error("Validation Error", "Please enter a department name")
      return
    }

    setIsLoading(true)

    try {
      // Send data to backend
      const response = await axiosInstance.post("/api/departments/create-department", {
        name: formData.name,
        description: formData.description
      })

      const createdDepartment = response.data.department

      // Create department object for frontend state
      const newDepartment: Department = {
        id: createdDepartment._id,
        name: createdDepartment.name,
        description: createdDepartment.description,
        totalDocs: 0,
        pendingDocs: 0,
        activeUsers: 0,
        completionRate: 0,
        lastUpdated: "Just created",
        status: "active"
      }

      // Update parent component state
      onDepartmentCreate(newDepartment)
      
      // Show success toast
      showToast.success(
        "Department Created",
        `${formData.name} department has been successfully created`
      )

      // Reset form and close dialog
      setFormData({ name: "", description: "" })
      setOpen(false)

    } catch (error: any) {
      console.error("Error creating department:", error)
      
      // Show error toast
      if (error.response?.data?.message) {
        showToast.error("Creation Failed", error.response.data.message)
      } else {
        showToast.error(
          "Creation Failed",
          "Failed to create department. Please try again."
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] gradient-card">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Create New Department
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., IT Services, Quality Assurance"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Brief description of department responsibilities"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gradient-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Department"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}