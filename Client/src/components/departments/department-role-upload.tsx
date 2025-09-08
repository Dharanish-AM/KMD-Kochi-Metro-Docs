import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  User,
  Tag
} from "lucide-react"

interface UploadFile {
  id: string
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  type: string
}

interface DepartmentRoleUploadProps {
  departmentName: string
}

export function DepartmentRoleUpload({ departmentName }: DepartmentRoleUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [documentTitle, setDocumentTitle] = useState("")
  const [documentDescription, setDocumentDescription] = useState("")
  const [documentCategory, setDocumentCategory] = useState("")

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const newFiles: UploadFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading",
      type: file.type.includes("image") ? "image" : 
            file.type.includes("pdf") ? "pdf" : "document"
    }))

    setUploadFiles(prev => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach(uploadFile => {
      const interval = setInterval(() => {
        setUploadFiles(prev => 
          prev.map(f => {
            if (f.id === uploadFile.id) {
              const newProgress = Math.min(f.progress + Math.random() * 30, 100)
              return {
                ...f,
                progress: newProgress,
                status: newProgress >= 100 ? "completed" : "uploading"
              }
            }
            return f
          })
        )
      }, 500)

      setTimeout(() => clearInterval(interval), 3500)
    })
  }

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-5 w-5" />
      case "pdf":
        return <FileText className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Submitting document:", {
      title: documentTitle,
      description: documentDescription,
      category: documentCategory,
      files: uploadFiles
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome to {departmentName} Document Portal
        </h1>
        <p className="text-muted-foreground">
          Upload and manage your department documents securely
        </p>
      </div>

      {/* Upload Form */}
      <Card className="gradient-card shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Document Upload
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Document Title *
                </Label>
                <Input
                  id="title"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Enter document title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Category
                </Label>
                <Input
                  id="category"
                  value={documentCategory}
                  onChange={(e) => setDocumentCategory(e.target.value)}
                  placeholder="e.g., Reports, Invoices, Policies"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                placeholder="Brief description of the document content"
                rows={3}
              />
            </div>

            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                dragActive 
                  ? "border-primary bg-primary-light shadow-glow" 
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className={`h-16 w-16 mx-auto mb-4 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
              <h3 className="text-xl font-semibold mb-2">
                {dragActive ? "Drop files here" : "Upload Your Documents"}
              </h3>
              <p className="text-muted-foreground mb-6">
                Drag and drop files here, or click to browse
              </p>
              
              <div className="space-y-2 mb-6">
                <p className="text-sm text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG
                </p>
                <p className="text-sm text-muted-foreground">
                  Maximum file size: 10MB per file
                </p>
              </div>

              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <Label htmlFor="file-input">
                <Button 
                  type="button" 
                  size="lg"
                  className={dragActive ? "gradient-primary shadow-glow" : ""}
                  variant={dragActive ? "default" : "outline"}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </Label>
            </div>

            {/* File List */}
            {uploadFiles.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Uploaded Files ({uploadFiles.length})</h4>
                <div className="grid gap-3">
                  {uploadFiles.map((uploadFile) => (
                    <div key={uploadFile.id} className="flex items-center space-x-4 p-4 border rounded-lg bg-muted/20">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary-light">
                          {getFileIcon(uploadFile.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-foreground">
                            {uploadFile.file.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex-1 max-w-xs">
                        {uploadFile.status === "uploading" && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Uploading...</span>
                              <span>{Math.round(uploadFile.progress)}%</span>
                            </div>
                            <Progress value={uploadFile.progress} className="h-2" />
                          </div>
                        )}
                        {uploadFile.status === "completed" && (
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(uploadFile.status)}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(uploadFile.id)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <Button 
                type="submit" 
                className="w-full gradient-primary" 
                size="lg"
                disabled={!documentTitle || uploadFiles.length === 0}
              >
                <Upload className="h-5 w-5 mr-2" />
                Submit Documents for Processing
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Processing Time</h3>
                <p className="text-sm text-muted-foreground">Documents are processed within 24 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">Automatic extraction of key insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Secure Access</h3>
                <p className="text-sm text-muted-foreground">Role-based access and audit trails</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}