import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Plus, Building2, ChevronDown, Copy, CheckCircle2, Eye } from "lucide-react"
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

// Official KMRL Department Names
const KMRL_DEPARTMENTS = [
  "Operations & Maintenance",
  "Engineering & Infrastructure", 
  "Electrical & Mechanical",
  "Finance & Accounts",
  "Human Resources",
  "Legal & Compliance",
  "Procurement & Contracts",
  "Corporate Communications",
  "Business Development",
  "Vigilance & Security",
  "Information Technology & Systems",
  "Planning & Development",
  "Environment & Sustainability",
  "Customer Relations & Services",
  "Project Management",
];

export function CreateDepartmentDialog({ onDepartmentCreate }: CreateDepartmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSamples, setShowSamples] = useState(false)
  const [copiedDept, setCopiedDept] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent double submission
    if (isLoading) {
      console.log("[FRONTEND] Prevented double submission - already loading");
      return
    }
    
    // Validate department name
    if (!formData.name.trim()) {
      showToast.error("Validation Error", "Please enter a department name")
      return
    }

    // Additional validation for minimum length
    if (formData.name.trim().length < 2) {
      showToast.error("Validation Error", "Department name must be at least 2 characters long")
      return
    }

    console.log(`[FRONTEND] Starting department creation for: "${formData.name.trim()}"`);
    setIsLoading(true)

    try {
      // Send data to backend with trimmed values
      const response = await axiosInstance.post("/api/departments/create-department", {
        name: formData.name.trim(),
        description: formData.description.trim()
      })

      console.log(`[FRONTEND] Department created successfully:`, response.data);
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
        `"${createdDepartment.name}" department has been successfully created`
      )

      // Reset form and close dialog
      setFormData({ name: "", description: "" })
      setOpen(false)

    } catch (error: any) {
      console.error(`[FRONTEND] Error creating department:`, error)
      
      // Handle different types of errors
      if (error.response?.status === 400) {
        // Bad request - validation or duplicate department
        const errorMessage = error.response?.data?.message || "Invalid department data"
        showToast.error("Validation Error", errorMessage)
      } else if (error.response?.status === 500) {
        // Server error
        showToast.error("Server Error", "Something went wrong on the server. Please try again.")
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        // Network error
        showToast.error("Connection Error", "Unable to connect to server. Please check your connection.")
      } else {
        // Generic error
        const errorMessage = error.response?.data?.message || "Failed to create department"
        showToast.error("Creation Failed", errorMessage)
      }
    } finally {
      console.log(`[FRONTEND] Department creation process completed, setting loading to false`);
      setIsLoading(false)
    }
  }

  const copyDepartmentName = async (deptName: string) => {
    try {
      await navigator.clipboard.writeText(deptName)
      setCopiedDept(deptName)
      showToast.success("Copied!", `"${deptName}" copied to clipboard`)
      
      // Reset copy indicator after 2 seconds
      setTimeout(() => setCopiedDept(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      showToast.error("Copy Failed", "Unable to copy to clipboard")
    }
  }

  const useDepartmentName = (deptName: string) => {
    setFormData({...formData, name: deptName})
    showToast.success("Applied!", `Department name set to "${deptName}"`)
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
          {/* Department Samples Section */}
          <div className="mb-4">
            <Collapsible open={showSamples} onOpenChange={setShowSamples}>
              <CollapsibleTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full justify-between hover:bg-blue-50 border-blue-200"
                >
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-600" />
                    Show Official KMRL Department Names
                  </div>
                  <ChevronDown className={`h-4 w-4 text-blue-600 transition-transform ${showSamples ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-blue-800 flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Official KMRL Departments
                    </h4>
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                      {KMRL_DEPARTMENTS.length} departments
                    </Badge>
                  </div>
                  <p className="text-xs text-blue-600 mb-3">
                    Click to copy or use these official department names directly
                  </p>
                  
                  {/* Scrollable Department List */}
                  <div className="relative">
                    <div className="max-h-24 overflow-y-auto border border-blue-200/50 rounded-md bg-white/70 backdrop-blur-sm scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
                      <div className="p-1 space-y-0.5">
                        {KMRL_DEPARTMENTS.map((dept, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-1.5 bg-white/80 rounded border border-blue-100/50 hover:border-blue-300 hover:bg-white hover:shadow-sm transition-all duration-200 group"
                          >
                            <span className="text-xs font-medium text-gray-800 flex-1 pr-2 leading-tight">
                              {dept}
                            </span>
                            <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => copyDepartmentName(dept)}
                                className="h-5 w-5 p-0 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                title="Copy"
                              >
                                {copiedDept === dept ? (
                                  <CheckCircle2 className="h-2.5 w-2.5 text-green-600" />
                                ) : (
                                  <Copy className="h-2.5 w-2.5" />
                                )}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => useDepartmentName(dept)}
                                className="h-5 px-1 text-green-600 hover:bg-green-100 text-xs font-medium rounded transition-colors"
                                title="Use"
                              >
                                Use
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Fade effect at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-white/70 to-transparent pointer-events-none rounded-b-md"></div>
                  </div>

                  {/* Compact Tip Section */}
                  <div className="mt-2 pt-2 border-t border-blue-200/50">
                    <div className="flex items-center space-x-1.5 p-1.5 bg-blue-100/50 rounded">
                      <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">💡</span>
                      </div>
                      <p className="text-xs text-blue-600">
                        Use official names for proper integration
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Department Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Operations & Maintenance, Human Resources"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              💡 Use the department samples above for official KMRL department names
            </p>
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
              disabled={isLoading || !formData.name.trim()}
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