import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Plus, Building2, ChevronDown, Copy, CheckCircle2, Eye } from "lucide-react"

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

interface CustomCreateDepartmentDialogProps {
  onDepartmentCreate: (department: any) => void
  trigger?: React.ReactNode
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
]

export function CustomCreateDepartmentDialog({ onDepartmentCreate, trigger }: CustomCreateDepartmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })
  const [selectedFromList, setSelectedFromList] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [showPredefined, setShowPredefined] = useState(true)
  const [previewDepartment, setPreviewDepartment] = useState<Department | null>(null)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate preview
    if (field === "name" && value.trim()) {
      const preview: Department = {
        id: "preview",
        name: value,
        description: formData.description,
        totalDocs: 0,
        pendingDocs: 0,
        activeUsers: 1,
        completionRate: 0,
        lastUpdated: "Just now",
        status: "active"
      }
      setPreviewDepartment(preview)
    } else if (!value.trim()) {
      setPreviewDepartment(null)
    }
  }

  const handlePredefinedSelect = (deptName: string) => {
    setSelectedFromList(deptName)
    setFormData({
      name: deptName,
      description: `Official ${deptName} department for KMRL operations and management.`
    })
    
    const preview: Department = {
      id: "preview",
      name: deptName,
      description: `Official ${deptName} department for KMRL operations and management.`,
      totalDocs: 0,
      pendingDocs: 0,
      activeUsers: 1,
      completionRate: 0,
      lastUpdated: "Just now",
      status: "active"
    }
    setPreviewDepartment(preview)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) return

    setIsCreating(true)
    try {
      const newDepartment: Department = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        totalDocs: 0,
        pendingDocs: 0,
        activeUsers: 1,
        completionRate: 0,
        lastUpdated: new Date().toLocaleDateString(),
        status: "active"
      }

      onDepartmentCreate(newDepartment)
      
      // Reset form
      setFormData({ name: "", description: "" })
      setSelectedFromList("")
      setPreviewDepartment(null)
      setOpen(false)
    } catch (error) {
      console.error("Failed to create department:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const copyDepartmentName = (name: string) => {
    navigator.clipboard.writeText(name)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] gradient-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Building2 className="h-6 w-6 mr-3 text-blue-600" />
            Create New Department
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Predefined Departments Section */}
          <Collapsible open={showPredefined} onOpenChange={setShowPredefined}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between hover:bg-blue-50">
                <span className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  Choose from KMRL Departments
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showPredefined ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              <div className="max-h-60 overflow-y-auto space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {KMRL_DEPARTMENTS.map((dept) => (
                  <div
                    key={dept}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedFromList === dept 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-25'
                    }`}
                    onClick={() => handlePredefinedSelect(dept)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${selectedFromList === dept ? 'bg-blue-500' : 'bg-gray-300'}`} />
                      <span className="text-sm font-medium">{dept}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyDepartmentName(dept)
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Custom Department Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Department Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter department name..."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of the department's role and responsibilities..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="min-h-[80px] focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Preview Section */}
            {previewDepartment && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Label>
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {previewDepartment.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {previewDepartment.description || "No description provided"}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                    <div className="flex items-center text-xs text-gray-500">
                      <span>0 Documents • 1 User • 0% Complete</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {previewDepartment.lastUpdated}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name.trim() || isCreating}
              className="gradient-primary min-w-[120px]"
            >
              {isCreating ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Create Department
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}