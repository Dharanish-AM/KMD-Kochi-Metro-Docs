import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload,
  X,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DepartmentFileUploadProps {
  department: string
}

interface UploadFile {
  id: string
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  description?: string
  category?: string
}

// Department theme configuration
const departmentThemes = {
  "Engineering": {
    primary: "from-blue-600 via-blue-700 to-indigo-800",
    accent: "bg-blue-500",
    text: "text-blue-600",
    lightBg: "from-blue-50 to-blue-100",
    darkBg: "from-blue-900/20 to-blue-800/20",
    border: "border-blue-200 dark:border-blue-700",
    hoverBorder: "hover:border-blue-400"
  },
  "HR": {
    primary: "from-emerald-600 via-green-700 to-teal-800",
    accent: "bg-emerald-500",
    text: "text-emerald-600",
    lightBg: "from-emerald-50 to-green-100",
    darkBg: "from-emerald-900/20 to-green-800/20",
    border: "border-emerald-200 dark:border-emerald-700",
    hoverBorder: "hover:border-emerald-400"
  },
  "Legal": {
    primary: "from-purple-600 via-violet-700 to-indigo-800",
    accent: "bg-purple-500",
    text: "text-purple-600",
    lightBg: "from-purple-50 to-violet-100",
    darkBg: "from-purple-900/20 to-violet-800/20",
    border: "border-purple-200 dark:border-purple-700",
    hoverBorder: "hover:border-purple-400"
  },
  "Finance": {
    primary: "from-amber-600 via-yellow-700 to-orange-800",
    accent: "bg-amber-500",
    text: "text-amber-600",
    lightBg: "from-amber-50 to-yellow-100",
    darkBg: "from-amber-900/20 to-yellow-800/20",
    border: "border-amber-200 dark:border-amber-700",
    hoverBorder: "hover:border-amber-400"
  },
  "Safety": {
    primary: "from-red-600 via-rose-700 to-pink-800",
    accent: "bg-red-500",
    text: "text-red-600",
    lightBg: "from-red-50 to-rose-100",
    darkBg: "from-red-900/20 to-rose-800/20",
    border: "border-red-200 dark:border-red-700",
    hoverBorder: "hover:border-red-400"
  },
  "Operations": {
    primary: "from-cyan-600 via-sky-700 to-blue-800",
    accent: "bg-cyan-500",
    text: "text-cyan-600",
    lightBg: "from-cyan-50 to-sky-100",
    darkBg: "from-cyan-900/20 to-sky-800/20",
    border: "border-cyan-200 dark:border-cyan-700",
    hoverBorder: "hover:border-cyan-400"
  },
  "Procurement": {
    primary: "from-teal-600 via-emerald-700 to-green-800",
    accent: "bg-teal-500",
    text: "text-teal-600",
    lightBg: "from-teal-50 to-emerald-100",
    darkBg: "from-teal-900/20 to-emerald-800/20",
    border: "border-teal-200 dark:border-teal-700",
    hoverBorder: "hover:border-teal-400"
  },
  "Admin": {
    primary: "from-slate-600 via-gray-700 to-zinc-800",
    accent: "bg-slate-500",
    text: "text-slate-600",
    lightBg: "from-slate-50 to-gray-100",
    darkBg: "from-slate-900/20 to-gray-800/20",
    border: "border-slate-200 dark:border-slate-700",
    hoverBorder: "hover:border-slate-400"
  },
  "Maintenance": {
    primary: "from-orange-600 via-red-700 to-rose-800",
    accent: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "from-orange-50 to-red-100",
    darkBg: "from-orange-900/20 to-red-800/20",
    border: "border-orange-200 dark:border-orange-700",
    hoverBorder: "hover:border-orange-400"
  },
  "Security": {
    primary: "from-indigo-600 via-purple-700 to-violet-800",
    accent: "bg-indigo-500",
    text: "text-indigo-600",
    lightBg: "from-indigo-50 to-purple-100",
    darkBg: "from-indigo-900/20 to-purple-800/20",
    border: "border-indigo-200 dark:border-indigo-700",
    hoverBorder: "hover:border-indigo-400"
  }
}

const fileCategories = {
  "Engineering": ["Technical Reports", "Project Plans", "Specifications", "Drawings", "Test Results"],
  "HR": ["Employee Records", "Policies", "Training Materials", "Assessments", "Contracts"],
  "Legal": ["Contracts", "Legal Opinions", "Compliance Reports", "Court Documents", "Agreements"],
  "Finance": ["Financial Reports", "Budgets", "Invoices", "Audit Reports", "Tax Documents"],
  "Safety": ["Safety Protocols", "Incident Reports", "Training Records", "Inspections", "Certifications"],
  "Operations": ["Procedures", "Schedules", "Performance Reports", "Quality Control", "Maintenance Logs"],
  "Procurement": ["Purchase Orders", "Vendor Documents", "Contracts", "Specifications", "Invoices"],
  "Admin": ["Memos", "Correspondence", "Policies", "Meeting Minutes", "Reports"],
  "Maintenance": ["Work Orders", "Inspection Reports", "Equipment Manuals", "Schedules", "Parts Lists"],
  "Security": ["Protocols", "Incident Reports", "Access Records", "Training Materials", "Procedures"]
}

export const DepartmentFileUpload = ({ department }: DepartmentFileUploadProps) => {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadDescription, setUploadDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  // Get department theme
  const theme = departmentThemes[department as keyof typeof departmentThemes] || departmentThemes["Engineering"]
  const categories = fileCategories[department as keyof typeof fileCategories] || fileCategories["Engineering"]

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading" as const,
      description: uploadDescription,
      category: selectedCategory
    }))

    setFiles(prev => [...prev, ...uploadFiles])
  }

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 15, 100)
          const isCompleted = newProgress >= 100
          
          return {
            ...file,
            progress: newProgress,
            status: isCompleted ? "completed" : "uploading"
          }
        }
        return file
      }))
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, progress: 100, status: "completed" }
          : file
      ))
    }, 3000)
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const handleSubmitAll = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files before submitting.",
        variant: "destructive"
      })
      return
    }

    if (!selectedCategory) {
      toast({
        title: "Category Required",
        description: "Please select a document category before submitting.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    // Simulate upload process for all files
    files.forEach(file => {
      simulateUpload(file.id)
    })

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Files Submitted Successfully!",
        description: `${files.length} files have been submitted for review.`,
      })
      
      // Clear form after successful submission
      setTimeout(() => {
        setFiles([])
        setUploadDescription("")
        setSelectedCategory("")
      }, 2000)
    }, 3500)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const completedFiles = files.filter(f => f.status === "completed").length
  const totalSize = files.reduce((acc, file) => acc + file.file.size, 0)

  return (
    <div className="space-y-8">
      {/* Header Section - Now uses department theme colors */}
      <div className={`bg-gradient-to-br ${theme.primary} rounded-xl p-6 text-white shadow-2xl`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Upload className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">Upload Documents</h2>
        </div>
        <p className="text-white/90 font-medium">Submit your documents for {department} department review and approval</p>
      </div>

      {/* Upload Configuration */}
      <Card className={`border-2 border-dashed ${theme.border} ${theme.hoverBorder} shadow-lg`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${theme.text}`}>
            <FileText className="h-5 w-5" />
            <span>Document Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Document Category *
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select document category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Input
                id="description"
                placeholder="Brief description of the documents"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragging
                ? `${theme.border.replace('border-', 'border-').replace('-200', '-400')} bg-gradient-to-br ${theme.lightBg} ${theme.darkBg} scale-105`
                : `border-gray-300 dark:border-gray-600 ${theme.hoverBorder} hover:bg-gray-50 dark:hover:bg-gray-700/50`
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            <div className="space-y-4">
              <div className={`mx-auto w-16 h-16 ${isDragging ? theme.accent : 'bg-gray-100 dark:bg-gray-700'} rounded-xl flex items-center justify-center transition-all duration-300`}>
                <Upload className={`h-8 w-8 transition-colors ${
                  isDragging ? "text-white" : "text-gray-400"
                }`} />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  {isDragging ? "Drop your files here" : "Drag & drop files here"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or click the button below to browse files
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Supports: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max 10MB per file)
                </p>
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </label>
              </Button>
            </div>
          </div>

          {/* Upload Guidelines */}
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              <strong>Important:</strong> Ensure all documents are properly named and contain relevant information for the {department} department. 
              Files will be reviewed by administrators before approval.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* File List & Submit Section */}
      {files.length > 0 && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className={`bg-gradient-to-br ${theme.lightBg} ${theme.darkBg} ${theme.border} shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${theme.accent} rounded-full flex items-center justify-center`}>
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {files.length} Files Ready for Submission
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total size: {formatFileSize(totalSize)} • Category: {selectedCategory || "Not selected"}
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmitAll}
                  disabled={isSubmitting || !selectedCategory}
                  size="lg"
                  className={`bg-gradient-to-r ${theme.primary} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit All Files
                    </>
                  )}
                </Button>
              </div>
              
              {completedFiles > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Upload Progress</span>
                    <span>{completedFiles} of {files.length} completed</span>
                  </div>
                  <Progress value={(completedFiles / files.length) * 100} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* File List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Selected Files</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <FileText className="h-10 w-10 text-blue-500 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.file.name}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span>{formatFileSize(file.file.size)}</span>
                        {file.category && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {file.category}
                            </Badge>
                          </>
                        )}
                        {file.description && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-xs">{file.description}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Progress value={file.progress} className="flex-1 h-2" />
                        <span className="text-xs font-medium text-gray-900 dark:text-white min-w-[3rem] text-right">
                          {Math.round(file.progress)}%
                        </span>
                        <div className="min-w-[1.5rem] flex justify-center">
                          {file.status === "completed" && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {file.status === "uploading" && (
                            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}