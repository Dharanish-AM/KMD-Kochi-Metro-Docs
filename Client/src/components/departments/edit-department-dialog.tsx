import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { departmentAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Building2 } from "lucide-react"

interface Department {
  id: string
  name: string
  description?: string
  totalDocs: number
  activeUsers: number
}

interface EditDepartmentDialogProps {
  department: Department | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDepartmentUpdated: () => void
}

export function EditDepartmentDialog({
  department,
  open,
  onOpenChange,
  onDepartmentUpdated,
}: EditDepartmentDialogProps) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})

  // Reset form when dialog opens/closes or department changes
  useEffect(() => {
    if (open && department) {
      setName(department.name)
      setDescription(department.description || "")
      setErrors({})
    } else if (!open) {
      setName("")
      setDescription("")
      setErrors({})
    }
  }, [open, department])

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {}

    if (!name.trim()) {
      newErrors.name = "Department name is required"
    } else if (name.trim().length < 2) {
      newErrors.name = "Department name must be at least 2 characters"
    } else if (name.trim().length > 100) {
      newErrors.name = "Department name must be less than 100 characters"
    }

    if (description && description.length > 500) {
      newErrors.description = "Description must be less than 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!department) return
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      await departmentAPI.updateDepartment(department.id, {
        name: name.trim(),
        description: description.trim(),
      })

      toast({
        title: "Success!",
        description: "Department updated successfully!",
        variant: "default",
        className: "border-green-200 bg-green-50 text-green-800",
      })
      onDepartmentUpdated()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Failed to update department:", error)
      const errorMessage = error.response?.data?.message || "Failed to update department. Please try again."
      toast({
        title: "Error!",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!department) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Edit Department
          </DialogTitle>
          <DialogDescription>
            Update the department information. Make sure the name is unique.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Department Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter department name"
              className={errors.name ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter department description (optional)"
              className={errors.description ? "border-red-500" : ""}
              rows={3}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500">
              {description.length}/500 characters
            </p>
          </div>

          {/* Department Stats (Read-only) */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Stats</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Documents:</span>
                <span className="ml-2 font-medium">{department.totalDocs}</span>
              </div>
              <div>
                <span className="text-gray-500">Active Users:</span>
                <span className="ml-2 font-medium">{department.activeUsers}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Department"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}