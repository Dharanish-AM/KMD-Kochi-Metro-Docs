import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Building2,
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
  Award,
  Target
} from "lucide-react"
import { DepartmentFileUpload } from "@/components/departments/department-file-upload"
import { DepartmentFileHistory } from "@/components/departments/department-file-history"
import { DepartmentStats } from "@/components/departments/department-stats"
import { DepartmentSidebarLayout } from "@/components/layout/DepartmentSidebarLayout"

interface DepartmentDashboardProps {
  department: string
}

interface DepartmentInfo {
  name: string
  description: string
  totalFiles: number
  pendingFiles: number
  acceptedFiles: number
  rejectedFiles: number
  lastActivity: string
  staff: number
}

// Mock data for different departments
const departmentData: Record<string, DepartmentInfo> = {
  "Engineering": {
    name: "Engineering Department",
    description: "Technical documentation, project plans, and engineering reports",
    totalFiles: 156,
    pendingFiles: 12,
    acceptedFiles: 132,
    rejectedFiles: 12,
    lastActivity: "2 hours ago",
    staff: 15
  },
  "HR": {
    name: "Human Resources",
    description: "Employee records, policies, and HR documentation",
    totalFiles: 89,
    pendingFiles: 5,
    acceptedFiles: 78,
    rejectedFiles: 6,
    lastActivity: "1 hour ago",
    staff: 8
  },
  "Legal": {
    name: "Legal Department",
    description: "Contracts, legal documents, and compliance reports",
    totalFiles: 134,
    pendingFiles: 8,
    acceptedFiles: 118,
    rejectedFiles: 8,
    lastActivity: "3 hours ago",
    staff: 6
  },
  "Finance": {
    name: "Finance Department",
    description: "Financial reports, budgets, and accounting documents",
    totalFiles: 203,
    pendingFiles: 15,
    acceptedFiles: 175,
    rejectedFiles: 13,
    lastActivity: "30 mins ago",
    staff: 12
  },
  "Safety": {
    name: "Safety Department",
    description: "Safety protocols, incident reports, and compliance documentation",
    totalFiles: 67,
    pendingFiles: 3,
    acceptedFiles: 58,
    rejectedFiles: 6,
    lastActivity: "45 mins ago",
    staff: 9
  },
  "Operations": {
    name: "Operations Department",
    description: "Operational procedures, schedules, and performance reports",
    totalFiles: 198,
    pendingFiles: 18,
    acceptedFiles: 167,
    rejectedFiles: 13,
    lastActivity: "1 hour ago",
    staff: 22
  },
  "Procurement": {
    name: "Procurement Department",
    description: "Purchase orders, vendor documents, and procurement reports",
    totalFiles: 112,
    pendingFiles: 7,
    acceptedFiles: 95,
    rejectedFiles: 10,
    lastActivity: "4 hours ago",
    staff: 8
  },
  "Admin": {
    name: "Administration",
    description: "Administrative documents, memos, and general correspondence",
    totalFiles: 145,
    pendingFiles: 9,
    acceptedFiles: 128,
    rejectedFiles: 8,
    lastActivity: "2 hours ago",
    staff: 12
  },
  "Maintenance": {
    name: "Maintenance Department",
    description: "Maintenance schedules, repair reports, and equipment documentation",
    totalFiles: 98,
    pendingFiles: 6,
    acceptedFiles: 84,
    rejectedFiles: 8,
    lastActivity: "1 hour ago",
    staff: 14
  },
  "Security": {
    name: "Security Department",
    description: "Security protocols, incident reports, and access control documentation",
    totalFiles: 78,
    pendingFiles: 4,
    acceptedFiles: 68,
    rejectedFiles: 6,
    lastActivity: "3 hours ago",
    staff: 16
  }
}

const DepartmentDashboard = ({ department }: DepartmentDashboardProps) => {
  const [activeSection, setActiveSection] = useState("overview")
  const deptInfo = departmentData[department] || departmentData["Engineering"]
  
  const completionRate = Math.round((deptInfo.acceptedFiles / deptInfo.totalFiles) * 100)

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DepartmentOverview department={department} deptInfo={deptInfo} />
      case "upload":
        return <DepartmentFileUpload department={department} />
      case "history":
        return <DepartmentFileHistory department={department} />
      case "accepted":
        return <DepartmentFileHistory department={department} filter="accepted" />
      default:
        return <DepartmentOverview department={department} deptInfo={deptInfo} />
    }
  }

  return (
    <DepartmentSidebarLayout
      department={department}
      userName="John Doe"
      userRole="Document Manager"
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </DepartmentSidebarLayout>
  )
}

// Overview Component
const DepartmentOverview = ({ department, deptInfo }: { department: string, deptInfo: any }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to {deptInfo.name}</h1>
              <p className="text-blue-100 text-lg">{deptInfo.description}</p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{deptInfo.totalFiles}</div>
                <div className="text-blue-200 text-sm">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{deptInfo.acceptedFiles}</div>
                <div className="text-blue-200 text-sm">Approved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Files</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{deptInfo.totalFiles}</p>
              </div>
              <FileText className="h-12 w-12 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{deptInfo.pendingFiles}</p>
              </div>
              <Clock className="h-12 w-12 text-yellow-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Target className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-gray-600">Avg: 2.5 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Approved</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{deptInfo.acceptedFiles}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Award className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">{Math.round((deptInfo.acceptedFiles / deptInfo.totalFiles) * 100)}%</span>
              <span className="text-gray-500 ml-1">approval rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Active Staff</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{deptInfo.staff}</p>
              </div>
              <Users className="h-12 w-12 text-purple-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Calendar className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-purple-600 font-medium">Last: {deptInfo.lastActivity}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Department Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Approval Rate</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{Math.round((deptInfo.acceptedFiles / deptInfo.totalFiles) * 100)}%</span>
              </div>
              <Progress value={Math.round((deptInfo.acceptedFiles / deptInfo.totalFiles) * 100)} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {Math.round((deptInfo.acceptedFiles / deptInfo.totalFiles) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Target: 90%</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">2.5d</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Processing</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Target: &lt; 3 days</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {deptInfo.staff}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Staff</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Online Now</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-green-600" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              { time: "2 hours ago", action: "Document approved", file: "Q4_Financial_Report.pdf", type: "approved" },
              { time: "5 hours ago", action: "New upload", file: "Safety_Protocol_Rev3.pdf", type: "upload" },
              { time: "1 day ago", action: "Document rejected", file: "Incomplete_Form.docx", type: "rejected" },
              { time: "2 days ago", action: "Document approved", file: "Training_Materials.pptx", type: "approved" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'approved' ? 'bg-green-500' :
                  activity.type === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.file}</p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DepartmentDashboard