import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { departmentAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle, Building2, Users, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Department {
  id: string
  name: string
  description?: string
  totalDocs: number
  activeUsers: number
}

interface DeleteDepartmentDialogProps {
  department: Department | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDepartmentDeleted: () => void
}

export function DeleteDepartmentDialog({
  department,
  open,
  onOpenChange,
  onDepartmentDeleted,
}: DeleteDepartmentDialogProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!department) return

    setIsDeleting(true)
    
    try {
      await departmentAPI.deleteDepartment(department.id)
      toast({
        title: "Success!",
        description: `Department "${department.name}" deleted successfully!`,
        variant: "default",
        className: "border-green-200 bg-green-50 text-green-800",
      })
      onDepartmentDeleted()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Failed to delete department:", error)
      const errorMessage = error.response?.data?.message || "Failed to delete department. Please try again."
      const errorDetails = error.response?.data?.details
      
      const description = errorDetails ? `${errorMessage} ${errorDetails}` : errorMessage
      toast({
        title: "Error!",
        description: description,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (!department) return null

  const hasEmployees = department.activeUsers > 0
  const hasDocuments = department.totalDocs > 0
  const canDelete = !hasEmployees && !hasDocuments

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Department
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please review the information below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Department Info */}
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <Building2 className="h-5 w-5 mt-0.5 text-gray-500" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{department.name}</h3>
              {department.description && (
                <p className="text-sm text-gray-500 mt-1">{department.description}</p>
              )}
            </div>
          </div>

          {/* Department Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{department.activeUsers}</p>
                <p className="text-xs text-gray-500">Active Users</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <FileText className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">{department.totalDocs}</p>
                <p className="text-xs text-gray-500">Documents</p>
              </div>
            </div>
          </div>

          {/* Warning Messages */}
          {!canDelete && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">
                <strong>Cannot delete this department:</strong>
                <ul className="mt-2 space-y-1">
                  {hasEmployees && (
                    <li>• Has {department.activeUsers} active user{department.activeUsers !== 1 ? 's' : ''} assigned</li>
                  )}
                  {hasDocuments && (
                    <li>• Has {department.totalDocs} document{department.totalDocs !== 1 ? 's' : ''} associated</li>
                  )}
                </ul>
                <p className="mt-2 text-sm">
                  Please reassign users and move documents before deleting this department.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {canDelete && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Warning:</strong> Deleting "{department.name}" will permanently remove it from the system. 
                This action cannot be undone.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || !canDelete}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Delete Department
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}