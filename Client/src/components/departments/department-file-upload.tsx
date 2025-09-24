import { useState, useCallback, useEffect } from "react"
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
  Loader2,
  Clock,
  Trash2,
  Eye,
  Download,
  Calendar,
  User,
  FolderOpen
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axiosInstance from "@/Utils/Auth/axiosInstance"
import { documentAPI, DocumentFromAPI } from "@/lib/api"
import { getUser } from "@/Utils/Auth/token"

interface DepartmentFileUploadProps {
  department: string
}

interface UploadFile {
  id: string
  file: File
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  description?: string
  category?: string
}

// Department theme configuration
const departmentThemes = {
  // KMRL Departments with new themes
  "Operations & Maintenance": {
    primary: "from-cyan-600 via-sky-700 to-blue-800",
    secondary: "from-cyan-50 to-sky-50",
    accent: "bg-cyan-500",
    text: "text-cyan-600",
    lightBg: "from-cyan-50 to-sky-100",
    darkBg: "from-cyan-900/20 to-sky-800/20",
    border: "border-cyan-200 dark:border-cyan-700"
  },
  "Engineering & Infrastructure": {
    primary: "from-blue-600 via-blue-700 to-indigo-800",
    secondary: "from-blue-50 to-indigo-50",
    accent: "bg-blue-500",
    text: "text-blue-600",
    lightBg: "from-blue-50 to-blue-100",
    darkBg: "from-blue-900/20 to-blue-800/20",
    border: "border-blue-200 dark:border-blue-700"
  },
  "Electrical & Mechanical": {
    primary: "from-orange-600 via-amber-700 to-yellow-800",
    secondary: "from-orange-50 to-amber-50",
    accent: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "from-orange-50 to-amber-100",
    darkBg: "from-orange-900/20 to-amber-800/20",
    border: "border-orange-200 dark:border-orange-700"
  },
  "Finance & Accounts": {
    primary: "from-yellow-600 via-amber-700 to-orange-800",
    secondary: "from-yellow-50 to-amber-50",
    accent: "bg-yellow-500",
    text: "text-yellow-600",
    lightBg: "from-yellow-50 to-amber-100",
    darkBg: "from-yellow-900/20 to-amber-800/20",
    border: "border-yellow-200 dark:border-yellow-700"
  },
  "Human Resources": {
    primary: "from-emerald-600 via-green-700 to-teal-800",
    secondary: "from-emerald-50 to-green-50",
    accent: "bg-emerald-500",
    text: "text-emerald-600",
    lightBg: "from-emerald-50 to-green-100",
    darkBg: "from-emerald-900/20 to-green-800/20",
    border: "border-emerald-200 dark:border-emerald-700"
  },
  "Legal & Compliance": {
    primary: "from-purple-600 via-violet-700 to-indigo-800",
    secondary: "from-purple-50 to-violet-50",
    accent: "bg-purple-500",
    text: "text-purple-600",
    lightBg: "from-purple-50 to-violet-100",
    darkBg: "from-purple-900/20 to-violet-800/20",
    border: "border-purple-200 dark:border-purple-700"
  },
  "Procurement & Contracts": {
    primary: "from-teal-600 via-emerald-700 to-green-800",
    secondary: "from-teal-50 to-emerald-50",
    accent: "bg-teal-500",
    text: "text-teal-600",
    lightBg: "from-teal-50 to-emerald-100",
    darkBg: "from-teal-900/20 to-emerald-800/20",
    border: "border-teal-200 dark:border-teal-700"
  },
  "Corporate Communications": {
    primary: "from-pink-600 via-rose-700 to-red-800",
    secondary: "from-pink-50 to-rose-50",
    accent: "bg-pink-500",
    text: "text-pink-600",
    lightBg: "from-pink-50 to-rose-100",
    darkBg: "from-pink-900/20 to-rose-800/20",
    border: "border-pink-200 dark:border-pink-700"
  },
  "Business Development": {
    primary: "from-indigo-600 via-blue-700 to-cyan-800",
    secondary: "from-indigo-50 to-blue-50",
    accent: "bg-indigo-500",
    text: "text-indigo-600",
    lightBg: "from-indigo-50 to-blue-100",
    darkBg: "from-indigo-900/20 to-blue-800/20",
    border: "border-indigo-200 dark:border-indigo-700"
  },
  "Vigilance & Security": {
    primary: "from-red-600 via-rose-700 to-pink-800",
    secondary: "from-red-50 to-rose-50",
    accent: "bg-red-500",
    text: "text-red-600",
    lightBg: "from-red-50 to-rose-100",
    darkBg: "from-red-900/20 to-rose-800/20",
    border: "border-red-200 dark:border-red-700"
  },
  "Information Technology & Systems": {
    primary: "from-violet-600 via-purple-700 to-indigo-800",
    secondary: "from-violet-50 to-purple-50",
    accent: "bg-violet-500",
    text: "text-violet-600",
    lightBg: "from-violet-50 to-purple-100",
    darkBg: "from-violet-900/20 to-purple-800/20",
    border: "border-violet-200 dark:border-violet-700"
  },
  "Planning & Development": {
    primary: "from-lime-600 via-green-700 to-emerald-800",
    secondary: "from-lime-50 to-green-50",
    accent: "bg-lime-500",
    text: "text-lime-600",
    lightBg: "from-lime-50 to-green-100",
    darkBg: "from-lime-900/20 to-green-800/20",
    border: "border-lime-200 dark:border-lime-700"
  },
  "Environment & Sustainability": {
    primary: "from-green-600 via-emerald-700 to-teal-800",
    secondary: "from-green-50 to-emerald-50",
    accent: "bg-green-500",
    text: "text-green-600",
    lightBg: "from-green-50 to-emerald-100",
    darkBg: "from-green-900/20 to-emerald-800/20",
    border: "border-green-200 dark:border-green-700"
  },
  "Customer Relations & Services": {
    primary: "from-sky-600 via-blue-700 to-indigo-800",
    secondary: "from-sky-50 to-blue-50",
    accent: "bg-sky-500",
    text: "text-sky-600",
    lightBg: "from-sky-50 to-blue-100",
    darkBg: "from-sky-900/20 to-blue-800/20",
    border: "border-sky-200 dark:border-sky-700"
  },
  "Project Management": {
    primary: "from-orange-600 via-amber-700 to-yellow-800",
    secondary: "from-orange-50 to-amber-50",
    accent: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "from-orange-50 to-amber-100",
    darkBg: "from-orange-900/20 to-amber-800/20",
    border: "border-orange-200 dark:border-orange-700"
  },
  // Legacy department mappings (for backward compatibility)
  "Engineering": {
    primary: "from-blue-600 via-blue-700 to-indigo-800",
    secondary: "from-blue-50 to-indigo-50",
    accent: "bg-blue-500",
    text: "text-blue-600",
    lightBg: "from-blue-50 to-blue-100",
    darkBg: "from-blue-900/20 to-blue-800/20",
    border: "border-blue-200 dark:border-blue-700"
  },
  "HR": {
    primary: "from-emerald-600 via-green-700 to-teal-800",
    secondary: "from-emerald-50 to-green-50",
    accent: "bg-emerald-500",
    text: "text-emerald-600",
    lightBg: "from-emerald-50 to-green-100",
    darkBg: "from-emerald-900/20 to-green-800/20",
    border: "border-emerald-200 dark:border-emerald-700"
  },
  "Legal": {
    primary: "from-purple-600 via-violet-700 to-indigo-800",
    secondary: "from-purple-50 to-violet-50",
    accent: "bg-purple-500",
    text: "text-purple-600",
    lightBg: "from-purple-50 to-violet-100",
    darkBg: "from-purple-900/20 to-violet-800/20",
    border: "border-purple-200 dark:border-purple-700"
  },
  "Finance": {
    primary: "from-amber-600 via-yellow-700 to-orange-800",
    secondary: "from-amber-50 to-yellow-50",
    accent: "bg-amber-500",
    text: "text-amber-600",
    lightBg: "from-amber-50 to-yellow-100",
    darkBg: "from-amber-900/20 to-yellow-800/20",
    border: "border-amber-200 dark:border-amber-700"
  },
  "Safety": {
    primary: "from-red-600 via-rose-700 to-pink-800",
    secondary: "from-red-50 to-rose-50",
    accent: "bg-red-500",
    text: "text-red-600",
    lightBg: "from-red-50 to-rose-100",
    darkBg: "from-red-900/20 to-rose-800/20",
    border: "border-red-200 dark:border-red-700"
  },
  "Operations": {
    primary: "from-cyan-600 via-sky-700 to-blue-800",
    secondary: "from-cyan-50 to-sky-50",
    accent: "bg-cyan-500",
    text: "text-cyan-600",
    lightBg: "from-cyan-50 to-sky-100",
    darkBg: "from-cyan-900/20 to-sky-800/20",
    border: "border-cyan-200 dark:border-cyan-700"
  },
  "Procurement": {
    primary: "from-teal-600 via-emerald-700 to-green-800",
    secondary: "from-teal-50 to-emerald-50",
    accent: "bg-teal-500",
    text: "text-teal-600",
    lightBg: "from-teal-50 to-emerald-100",
    darkBg: "from-teal-900/20 to-emerald-800/20",
    border: "border-teal-200 dark:border-teal-700"
  },
  "Admin": {
    primary: "from-slate-600 via-gray-700 to-zinc-800",
    secondary: "from-slate-50 to-gray-50",
    accent: "bg-slate-500",
    text: "text-slate-600",
    lightBg: "from-slate-50 to-gray-100",
    darkBg: "from-slate-900/20 to-gray-800/20",
    border: "border-slate-200 dark:border-slate-700"
  },
  "Maintenance": {
    primary: "from-orange-600 via-red-700 to-rose-800",
    secondary: "from-orange-50 to-red-50",
    accent: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "from-orange-50 to-red-100",
    darkBg: "from-orange-900/20 to-red-800/20",
    border: "border-orange-200 dark:border-orange-700"
  },
  "Security": {
    primary: "from-indigo-600 via-purple-700 to-violet-800",
    secondary: "from-indigo-50 to-purple-50",
    accent: "bg-indigo-500",
    text: "text-indigo-600",
    lightBg: "from-indigo-50 to-purple-100",
    darkBg: "from-indigo-900/20 to-purple-800/20",
    border: "border-indigo-200 dark:border-indigo-700"
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
  const [userDocuments, setUserDocuments] = useState<DocumentFromAPI[]>([])
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { toast } = useToast()
  
  // Get department theme
  const theme = departmentThemes[department as keyof typeof departmentThemes] || departmentThemes["Engineering"]
  const categories = fileCategories[department as keyof typeof fileCategories] || fileCategories["Engineering"]

  // Fetch current user and their documents
  useEffect(() => {
    const fetchUserDocuments = async () => {
      try {
        const user = getUser()
        if (!user || !user.id) {
          console.error('No user found')
          setIsLoadingDocuments(false)
          return
        }
        
        setCurrentUser(user)
        const documents = await documentAPI.getDocumentsByUser(user.id)
        setUserDocuments(documents)
      } catch (error) {
        console.error('Failed to fetch user documents:', error)
        toast({
          title: "Error",
          description: "Failed to load your documents",
          variant: "destructive"
        })
      } finally {
        setIsLoadingDocuments(false)
      }
    }

    fetchUserDocuments()
  }, [])

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
    // Validate file types and size
    const validFiles = newFiles.filter(file => {
      const maxSize = 50 * 1024 * 1024; // 50MB as per backend
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ];

      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 50MB limit.`,
          variant: "destructive"
        });
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive"
        });
        return false;
      }

      return true;
    });

    const uploadFiles: UploadFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "pending" as const,
      description: uploadDescription || file.name,
      category: selectedCategory
    }))

    setFiles(prev => [...prev, ...uploadFiles])
  }

  const uploadFileToBackend = async (uploadFile: UploadFile) => {
    const { file, description, category } = uploadFile;
    
    try {
      // Set status to uploading when upload actually starts
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: "uploading", progress: 0 }
          : f
      ));

      // Get user data from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        throw new Error("User not authenticated");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", description || file.name);
      formData.append("category", category || "");
      
      // Department will be automatically fetched from user's profile in backend
      
      const response = await axiosInstance.post(
        `/api/documents/upload?userId=${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setFiles(prev => prev.map(f => 
                f.id === uploadFile.id 
                  ? { ...f, progress, status: "uploading" }
                  : f
              ));
            }
          }
        }
      );

      // Update file status to completed
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, progress: 100, status: "completed" }
          : f
      ));

      return response.data;
    } catch (error: any) {
      console.error("Upload error:", error);
      
      // Update file status to error
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: "error" }
          : f
      ));

      throw error;
    }
  };

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

    if (pendingFiles === 0) {
      toast({
        title: "No Files to Upload",
        description: "All files have already been processed.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Only upload pending files
      const pendingFilesToUpload = files.filter(f => f.status === "pending");
      const uploadPromises = pendingFilesToUpload.map(file => uploadFileToBackend(file));
      
      // Wait for all uploads to complete
      const results = await Promise.allSettled(uploadPromises);
      
      // Check results
      const successCount = results.filter(result => result.status === 'fulfilled').length;
      const errorCount = results.filter(result => result.status === 'rejected').length;

      if (successCount > 0) {
        toast({
          title: "Upload Successful!",
          description: `${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully${errorCount > 0 ? `. ${errorCount} file${errorCount > 1 ? 's' : ''} failed.` : '.'}`,
          variant: successCount === pendingFilesToUpload.length ? "default" : "destructive"
        });
      }

      if (errorCount === pendingFilesToUpload.length) {
        toast({
          title: "Upload Failed",
          description: "All files failed to upload. Please check your connection and try again.",
          variant: "destructive"
        });
      }

      // Clear completed and pending files after successful submission
      if (successCount > 0) {
        // Refresh the user documents list
        refreshDocuments()
        
        setTimeout(() => {
          setFiles(prev => prev.filter(f => f.status === "error")) // Keep only error files
          setUploadDescription("")
          // Don't clear category in case user wants to upload more files
        }, 2000)
      }

    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Upload Error",
        description: error.response?.data?.error || "Failed to upload files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDeleteDocument = async (documentId: string, fileName: string) => {
    if (!currentUser) return

    const confirmDelete = window.confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)
    if (!confirmDelete) return

    try {
      await documentAPI.deleteDocument(documentId, currentUser.id)
      setUserDocuments(prev => prev.filter(doc => doc._id !== documentId))
      toast({
        title: "Success",
        description: `"${fileName}" has been deleted successfully`,
        variant: "default"
      })
    } catch (error) {
      console.error('Failed to delete document:', error)
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive"
      })
    }
  }

  const refreshDocuments = async () => {
    if (!currentUser) return
    
    setIsLoadingDocuments(true)
    try {
      const documents = await documentAPI.getDocumentsByUser(currentUser.id)
      setUserDocuments(documents)
    } catch (error) {
      console.error('Failed to refresh documents:', error)
      toast({
        title: "Error",
        description: "Failed to refresh your documents",
        variant: "destructive"
      })
    } finally {
      setIsLoadingDocuments(false)
    }
  }

  const completedFiles = files.filter(f => f.status === "completed").length
  const pendingFiles = files.filter(f => f.status === "pending").length
  const uploadingFiles = files.filter(f => f.status === "uploading").length
  const errorFiles = files.filter(f => f.status === "error").length
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
      <Card className={`border-2 border-dashed ${theme.border} shadow-lg`}>
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
                : `border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50`
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
                className={`bg-gradient-to-r ${theme.primary} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </label>
              </Button>
            </div>
          </div>

          {/* Upload Guidelines */}
          <Alert className={`${theme.border} bg-gradient-to-r ${theme.lightBg} dark:${theme.darkBg}`}>
            <AlertCircle className={`h-4 w-4 ${theme.text}`} />
            <AlertDescription className={`${theme.text} dark:text-white`}>
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
                      {pendingFiles} Files Ready for Submission
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total size: {formatFileSize(totalSize)} • Category: {selectedCategory || "Not selected"}
                      {completedFiles > 0 && <span className="ml-2 text-green-600">• {completedFiles} uploaded</span>}
                      {errorFiles > 0 && <span className="ml-2 text-red-600">• {errorFiles} failed</span>}
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
                          {file.status === "pending" ? "Ready" : `${Math.round(file.progress)}%`}
                        </span>
                        <div className="min-w-[1.5rem] flex justify-center">
                          {file.status === "completed" && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {file.status === "uploading" && (
                            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                          )}
                          {file.status === "error" && (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                          {file.status === "pending" && (
                            <Clock className="h-5 w-5 text-gray-400" />
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

      {/* User Documents Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FolderOpen className="h-5 w-5" />
                <span>Recent Documents</span>
                <Badge variant="secondary" className="ml-2">
                  {userDocuments.length > 3 ? '3 of ' + userDocuments.length : userDocuments.length} documents
                </Badge>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshDocuments}
                disabled={isLoadingDocuments}
                className="flex items-center space-x-2"
              >
                {isLoadingDocuments ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span>Refresh</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingDocuments ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Loading your documents...</span>
              </div>
            ) : userDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No documents yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Upload your first document using the form above
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userDocuments.slice(-3).map((document) => (
                  <div
                    key={document._id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <FileText className="h-10 w-10 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate pr-2">
                            {document.title}
                          </h4>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span className="flex items-center space-x-1">
                            <FileText className="h-3 w-3" />
                            <span>{document.fileName}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>{formatFileSize(document.fileSize)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(document.createdAt)}</span>
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {document.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {document.classification}
                          </Badge>
                          {document.detected_language && document.detected_language !== 'unknown' && (
                            <Badge variant="secondary" className="text-xs">
                              {document.detected_language.toUpperCase()}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {document.department.name}
                          </Badge>
                        </div>
                        
                        {document.summary && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                            {document.summary}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Implement document view/download
                          toast({
                            title: "Feature Coming Soon",
                            description: "Document viewing will be available soon",
                            variant: "default"
                          })
                        }}
                        className="h-8 w-8 p-0"
                        title="View Document"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(document._id, document.fileName)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete Document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}