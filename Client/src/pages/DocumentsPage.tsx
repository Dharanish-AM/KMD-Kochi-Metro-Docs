import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Filter, Download, Upload, Eye } from "lucide-react"

const mockDocuments = [
  {
    id: "1",
    name: "Metro Safety Guidelines 2024",
    department: "Safety",
    type: "PDF",
    size: "2.4 MB",
    uploadDate: "2024-09-10",
    lastModified: "2024-09-11",
    status: "approved",
    version: "v2.1"
  },
  {
    id: "2",
    name: "Engineering Standards Manual",
    department: "Engineering",
    type: "PDF",
    size: "15.7 MB",
    uploadDate: "2024-09-08",
    lastModified: "2024-09-09",
    status: "under_review",
    version: "v1.3"
  },
  {
    id: "3",
    name: "HR Policy Document",
    department: "HR",
    type: "DOCX",
    size: "1.2 MB",
    uploadDate: "2024-09-07",
    lastModified: "2024-09-07",
    status: "approved",
    version: "v3.0"
  },
  {
    id: "4",
    name: "Financial Audit Report Q2",
    department: "Finance",
    type: "PDF",
    size: "8.9 MB",
    uploadDate: "2024-09-05",
    lastModified: "2024-09-06",
    status: "pending",
    version: "v1.0"
  },
  {
    id: "5",
    name: "Operations Manual",
    department: "Operations",
    type: "PDF",
    size: "12.3 MB",
    uploadDate: "2024-09-03",
    lastModified: "2024-09-04",
    status: "approved",
    version: "v2.5"
  }
]

export function DocumentsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "under_review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300" style={{ marginLeft: '256px' }}>
        <Header 
          title="Documents" 
          description="Comprehensive document management across all departments"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6 space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Documents Grid */}
            <div className="grid gap-6">
              {mockDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {document.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <span>{document.department}</span>
                            <span>•</span>
                            <span>{document.type}</span>
                            <span>•</span>
                            <span>{document.size}</span>
                            <span>•</span>
                            <span>{document.version}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Uploaded: {document.uploadDate}</span>
                            <span>Modified: {document.lastModified}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(document.status)}>
                          {document.status.replace('_', ' ')}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upload Area */}
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
              <CardContent className="p-12 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Documents
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Drag and drop files here, or click to browse
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
