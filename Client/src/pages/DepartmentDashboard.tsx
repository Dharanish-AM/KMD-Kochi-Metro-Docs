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
  Target,
  Loader
} from "lucide-react"
import { DepartmentFileUpload } from "@/components/departments/department-file-upload"
import { DepartmentFileHistory } from "@/components/departments/department-file-history"
import { DepartmentStats } from "@/components/departments/department-stats"
import { DepartmentSidebarLayout } from "@/components/layout/DepartmentSidebarLayout"
import { DepartmentProfileSettings } from "@/components/departments/department-profile-settings"
import { DepartmentNotifications } from "@/components/departments/department-notifications"
import { departmentAPI, documentAPI, type DocumentFromAPI } from "@/lib/api"
import axiosInstance from "@/Utils/Auth/axiosInstance"
import { useAuth } from "@/contexts/AuthContext"
import { format, isToday, parseISO } from "date-fns"
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

// Department theme configuration to match sidebar colors
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

// Mock data for different departments
const departmentData: Record<string, DepartmentInfo> = {
  // KMRL Departments
  "Operations & Maintenance": {
    name: "Operations & Maintenance",
    description: "Operational procedures, maintenance schedules, and performance reports",
    totalFiles: 245,
    pendingFiles: 18,
    acceptedFiles: 210,
    rejectedFiles: 17,
    lastActivity: "1 hour ago",
    staff: 28
  },
  "Engineering & Infrastructure": {
    name: "Engineering & Infrastructure",
    description: "Infrastructure planning, engineering designs, and technical documentation",
    totalFiles: 298,
    pendingFiles: 22,
    acceptedFiles: 265,
    rejectedFiles: 11,
    lastActivity: "2 hours ago",
    staff: 32
  },
  "Electrical & Mechanical": {
    name: "Electrical & Mechanical",
    description: "Electrical systems, mechanical equipment, and technical specifications",
    totalFiles: 187,
    pendingFiles: 14,
    acceptedFiles: 165,
    rejectedFiles: 8,
    lastActivity: "3 hours ago",
    staff: 24
  },
  "Finance & Accounts": {
    name: "Finance & Accounts",
    description: "Financial reports, budgets, accounts, and procurement documentation",
    totalFiles: 356,
    pendingFiles: 28,
    acceptedFiles: 312,
    rejectedFiles: 16,
    lastActivity: "30 minutes ago",
    staff: 18
  },
  "Human Resources": {
    name: "Human Resources",
    description: "Employee records, policies, training materials, and HR documentation",
    totalFiles: 142,
    pendingFiles: 9,
    acceptedFiles: 125,
    rejectedFiles: 8,
    lastActivity: "1 hour ago",
    staff: 12
  },
  "Legal & Compliance": {
    name: "Legal & Compliance",
    description: "Legal documents, contracts, compliance reports, and regulatory documentation",
    totalFiles: 198,
    pendingFiles: 15,
    acceptedFiles: 171,
    rejectedFiles: 12,
    lastActivity: "2 hours ago",
    staff: 8
  },
  "Procurement & Contracts": {
    name: "Procurement & Contracts",
    description: "Purchase orders, vendor contracts, procurement policies, and supplier documentation",
    totalFiles: 276,
    pendingFiles: 21,
    acceptedFiles: 240,
    rejectedFiles: 15,
    lastActivity: "4 hours ago",
    staff: 15
  },
  "Corporate Communications": {
    name: "Corporate Communications",
    description: "Public relations, internal communications, media releases, and corporate messaging",
    totalFiles: 89,
    pendingFiles: 6,
    acceptedFiles: 78,
    rejectedFiles: 5,
    lastActivity: "5 hours ago",
    staff: 6
  },
  "Business Development": {
    name: "Business Development",
    description: "Strategic planning, market analysis, partnership agreements, and growth initiatives",
    totalFiles: 134,
    pendingFiles: 11,
    acceptedFiles: 115,
    rejectedFiles: 8,
    lastActivity: "3 hours ago",
    staff: 10
  },
  "Vigilance & Security": {
    name: "Vigilance & Security",
    description: "Security protocols, incident reports, vigilance procedures, and safety documentation",
    totalFiles: 167,
    pendingFiles: 12,
    acceptedFiles: 145,
    rejectedFiles: 10,
    lastActivity: "1 hour ago",
    staff: 20
  },
  "Information Technology & Systems": {
    name: "Information Technology & Systems",
    description: "IT infrastructure, system documentation, software policies, and technical support",
    totalFiles: 223,
    pendingFiles: 17,
    acceptedFiles: 195,
    rejectedFiles: 11,
    lastActivity: "2 hours ago",
    staff: 16
  },
  "Planning & Development": {
    name: "Planning & Development",
    description: "Project planning, development strategies, urban planning, and strategic documentation",
    totalFiles: 189,
    pendingFiles: 14,
    acceptedFiles: 165,
    rejectedFiles: 10,
    lastActivity: "6 hours ago",
    staff: 14
  },
  "Environment & Sustainability": {
    name: "Environment & Sustainability",
    description: "Environmental impact assessments, sustainability reports, and green initiatives",
    totalFiles: 98,
    pendingFiles: 7,
    acceptedFiles: 85,
    rejectedFiles: 6,
    lastActivity: "4 hours ago",
    staff: 8
  },
  "Customer Relations & Services": {
    name: "Customer Relations & Services",
    description: "Customer feedback, service reports, complaint handling, and passenger services",
    totalFiles: 156,
    pendingFiles: 12,
    acceptedFiles: 135,
    rejectedFiles: 9,
    lastActivity: "30 minutes ago",
    staff: 22
  },
  "Project Management": {
    name: "Project Management",
    description: "Project documentation, timelines, resource management, and progress reports",
    totalFiles: 201,
    pendingFiles: 16,
    acceptedFiles: 175,
    rejectedFiles: 10,
    lastActivity: "1 hour ago",
    staff: 18
  },
  // Legacy department mappings (for backward compatibility)
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
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState("overview")
  const [departmentId, setDepartmentId] = useState<string | null>(null)
  const [fileCount, setFileCount] = useState(0)
  const [recentFiles, setRecentFiles] = useState<DocumentFromAPI[]>([])
  const [loadingRecentFiles, setLoadingRecentFiles] = useState(false)
  
  // Fetch departmentId based on department name
  useEffect(() => {
    const fetchDepartmentId = async () => {
      try {
        // Fetch all departments and find the one matching the current department name
        const departments = await departmentAPI.getDepartments()
        const foundDept = departments.find(d => d.name === department)
        setDepartmentId(foundDept?._id || null)
      } catch (error) {
        console.error("Failed to fetch department ID:", error)
        // Fallback: use a temporary mapping while the API might be unavailable
        const departmentNameToIdMap: Record<string, string> = {
          "Operations & Maintenance": "operations-maintenance-id",
          "Engineering & Infrastructure": "engineering-infrastructure-id",
          "Electrical & Mechanical": "electrical-mechanical-id",
          "Finance & Accounts": "finance-accounts-id",
          "Human Resources": "human-resources-id",
          "Legal & Compliance": "legal-compliance-id",
          "Procurement & Contracts": "procurement-contracts-id",
          "Corporate Communications": "corporate-communications-id",
          "Business Development": "business-development-id",
          "Vigilance & Security": "vigilance-security-id",
          "Information Technology & Systems": "it-systems-id",
          "Planning & Development": "planning-development-id",
          "Environment & Sustainability": "environment-sustainability-id",
          "Customer Relations & Services": "customer-services-id",
          "Project Management": "project-management-id"
        }
        setDepartmentId(departmentNameToIdMap[department] || null)
      }
    }

    fetchDepartmentId()
  }, [department])

  // Fetch file count and recent files for the sidebar badge
  useEffect(() => {
    const fetchFileData = async () => {
      if (!departmentId) return

      try {
        const documents = await documentAPI.getDocumentsByDepartment(departmentId)
        setFileCount(documents.length)
        
        // Filter documents uploaded today
        const today = new Date()
        const todaysFiles = documents.filter(doc => {
          try {
            const uploadDate = parseISO(doc.createdAt)
            return isToday(uploadDate)
          } catch (error) {
            console.warn("Invalid date format for document:", doc.fileName)
            return false
          }
        })
        
        // Sort by upload time (most recent first) and take latest 4
        const sortedRecentFiles = todaysFiles
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4)
        
        setRecentFiles(sortedRecentFiles)
      } catch (error) {
        console.error("Failed to fetch file data:", error)
        setFileCount(0)
        setRecentFiles([])
      }
    }

    fetchFileData()
  }, [departmentId])

  // Function to fetch recent files (can be called separately)
  const fetchRecentFiles = async () => {
    if (!departmentId) return
    
    setLoadingRecentFiles(true)
    try {
      const documents = await documentAPI.getDocumentsByDepartment(departmentId)
      
      // Filter documents uploaded today
      const today = new Date()
      const todaysFiles = documents.filter(doc => {
        try {
          const uploadDate = parseISO(doc.createdAt)
          return isToday(uploadDate)
        } catch (error) {
          console.warn("Invalid date format for document:", doc.fileName)
          return false
        }
      })
      
      // Sort by upload time (most recent first) and take latest 4
      const sortedRecentFiles = todaysFiles
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4)
      
      setRecentFiles(sortedRecentFiles)
    } catch (error) {
      console.error("Failed to fetch recent files:", error)
      setRecentFiles([])
    } finally {
      setLoadingRecentFiles(false)
    }
  }

  // Function to refresh file count (can be called by child components)
  const refreshFileCount = async () => {
    if (!departmentId) return

    try {
      const documents = await documentAPI.getDocumentsByDepartment(departmentId)
      setFileCount(documents.length)
    } catch (error) {
      console.error("Failed to refresh file count:", error)
    }
  }
 
  const deptInfo = departmentData[department] || departmentData["Human Resources"] || {
    name: department,
    description: "Department documentation and file management",
    totalFiles: 0,
    pendingFiles: 0,
    acceptedFiles: 0,
    rejectedFiles: 0,
    lastActivity: "Recently",
    staff: 0
  }
  
  // Get theme with fallback - try exact match first, then legacy mapping
  const getThemeForDepartment = (deptName: string) => {
    // Direct match
    if (departmentThemes[deptName as keyof typeof departmentThemes]) {
      return departmentThemes[deptName as keyof typeof departmentThemes]
    }
    
    // Fallback mapping for common variations
    const fallbackMap: Record<string, keyof typeof departmentThemes> = {
      "Engineering": "Engineering & Infrastructure",
      "HR": "Human Resources", 
      "Legal": "Legal & Compliance",
      "Finance": "Finance & Accounts",
      "Operations": "Operations & Maintenance",
      "Security": "Vigilance & Security",
      "IT": "Information Technology & Systems",
      "Procurement": "Procurement & Contracts"
    }
    
    const fallbackKey = fallbackMap[deptName]
    if (fallbackKey && departmentThemes[fallbackKey]) {
      return departmentThemes[fallbackKey]
    }
    
    // Default fallback
    return departmentThemes["Human Resources"]
  }
  
  const theme = getThemeForDepartment(department)
  const completionRate = Math.round((deptInfo.acceptedFiles / deptInfo.totalFiles) * 100) || 0

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DepartmentOverview 
          department={department} 
          deptInfo={deptInfo} 
          theme={theme} 
          recentFiles={recentFiles}
          loadingRecentFiles={loadingRecentFiles}
          onRefreshRecentFiles={fetchRecentFiles}
        />
      case "upload":
        return <DepartmentFileUpload department={department} />
      case "history":
        return departmentId ? <DepartmentFileHistory department={department} departmentId={departmentId} onFileCountChange={refreshFileCount} /> : <div>Loading...</div>
      case "accepted":
        return departmentId ? <DepartmentFileHistory department={department} departmentId={departmentId} filter="accepted" onFileCountChange={refreshFileCount} /> : <div>Loading...</div>
      case "profile":
        return <DepartmentProfileSettings department={department} userName={user?.name || "User"} userRole={user?.role || "Staff Member"} />
      case "notifications":
        return <DepartmentNotifications department={department} userName={user?.name || "User"} />
      default:
        return <DepartmentOverview 
          department={department} 
          deptInfo={deptInfo} 
          theme={theme} 
          recentFiles={recentFiles}
          loadingRecentFiles={loadingRecentFiles}
          onRefreshRecentFiles={fetchRecentFiles}
        />
    }
  }

  return (
    <DepartmentSidebarLayout
      department={department}
      userName={user?.name || "User"}
      userRole={user?.role || "Staff Member"}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      fileCount={fileCount}
    >
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </DepartmentSidebarLayout>
  )
}

// Overview Component
const DepartmentOverview = ({ 
  department, 
  deptInfo, 
  theme, 
  recentFiles, 
  loadingRecentFiles, 
  onRefreshRecentFiles 
}: { 
  department: string, 
  deptInfo: any, 
  theme: any,
  recentFiles: DocumentFromAPI[],
  loadingRecentFiles: boolean,
  onRefreshRecentFiles: () => Promise<void>
}) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner - Now uses department theme colors */}
      <div className={`bg-gradient-to-br ${theme.primary} rounded-xl p-8 text-white relative overflow-hidden shadow-2xl`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to {department}</h1>
              <p className="text-white/90 text-lg font-medium">{deptInfo.description}</p>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{deptInfo.totalFiles}</div>
                <div className="text-white/80 text-sm font-medium">Total Files</div>
              </div>
              <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{deptInfo.acceptedFiles}</div>
                <div className="text-white/80 text-sm font-medium">Approved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards - Now uses department theme colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`bg-gradient-to-br ${theme.lightBg} ${theme.darkBg} ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme.text} dark:${theme.text.replace('text-', 'text-').replace('-600', '-400')}`}>Total Files</p>
                <p className={`text-3xl font-bold ${theme.text.replace('-600', '-700')} dark:${theme.text.replace('text-', 'text-').replace('-600', '-300')}`}>{deptInfo.totalFiles}</p>
              </div>
              <div className={`w-12 h-12 ${theme.accent} rounded-xl flex items-center justify-center`}>
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{deptInfo.pendingFiles}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Target className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-gray-600">Avg: 2.5 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Approved</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{deptInfo.acceptedFiles}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Award className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">{Math.round((deptInfo.acceptedFiles / deptInfo.totalFiles) * 100)}%</span>
              <span className="text-gray-500 ml-1">approval rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Active Staff</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{deptInfo.staff}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Calendar className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-purple-600 font-medium">Last: 1h ago</span>
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span>Recent Activity</span>
              <Badge variant="secondary" className="ml-2">
                Today
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshRecentFiles}
              disabled={loadingRecentFiles}
              className="h-8"
            >
              {loadingRecentFiles ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loadingRecentFiles ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-sm text-gray-500">Loading recent files...</span>
            </div>
          ) : recentFiles.length > 0 ? (
            <div className="space-y-4">
              {recentFiles.map((file, index) => {
                const uploadTime = parseISO(file.createdAt)
                const timeAgo = format(uploadTime, 'HH:mm')
                const timeSinceUpload = Math.floor((new Date().getTime() - uploadTime.getTime()) / (1000 * 60))
                const displayTime = timeSinceUpload < 60 ? `${timeSinceUpload}m ago` : `${Math.floor(timeSinceUpload / 60)}h ago`
                
                return (
                  <div key={file._id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        New upload
                        {file.classification && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {file.classification}
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {file.fileName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Uploaded by {file.uploadedBy.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{displayTime}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{timeAgo}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No files uploaded today
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Files uploaded today will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DepartmentDashboard