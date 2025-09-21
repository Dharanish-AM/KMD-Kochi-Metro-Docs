import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Target
} from "lucide-react"

interface DepartmentStatsProps {
  department: string
}

interface StatsData {
  totalFiles: number
  pendingFiles: number
  acceptedFiles: number
  rejectedFiles: number
  avgProcessingTime: number
  monthlyUploads: number
  monthlyComparison: number
  activeUsers: number
  completionRate: number
  topCategories: Array<{ name: string; count: number; percentage: number }>
  recentTrends: Array<{ period: string; uploads: number; approvals: number }>
}

// Mock data for different departments
const departmentStats: Record<string, StatsData> = {
  "Engineering": {
    totalFiles: 156,
    pendingFiles: 12,
    acceptedFiles: 132,
    rejectedFiles: 12,
    avgProcessingTime: 2.5,
    monthlyUploads: 34,
    monthlyComparison: 12,
    activeUsers: 15,
    completionRate: 85,
    topCategories: [
      { name: "Technical Reports", count: 45, percentage: 29 },
      { name: "Project Plans", count: 38, percentage: 24 },
      { name: "Specifications", count: 32, percentage: 21 },
      { name: "Test Results", count: 25, percentage: 16 },
      { name: "Drawings", count: 16, percentage: 10 }
    ],
    recentTrends: [
      { period: "This Week", uploads: 8, approvals: 7 },
      { period: "Last Week", uploads: 12, approvals: 10 },
      { period: "2 Weeks Ago", uploads: 9, approvals: 8 },
      { period: "3 Weeks Ago", uploads: 11, approvals: 9 }
    ]
  },
  "HR": {
    totalFiles: 89,
    pendingFiles: 5,
    acceptedFiles: 78,
    rejectedFiles: 6,
    avgProcessingTime: 1.8,
    monthlyUploads: 22,
    monthlyComparison: 8,
    activeUsers: 8,
    completionRate: 88,
    topCategories: [
      { name: "Employee Records", count: 28, percentage: 31 },
      { name: "Policies", count: 22, percentage: 25 },
      { name: "Training Materials", count: 18, percentage: 20 },
      { name: "Assessments", count: 12, percentage: 13 },
      { name: "Contracts", count: 9, percentage: 10 }
    ],
    recentTrends: [
      { period: "This Week", uploads: 6, approvals: 5 },
      { period: "Last Week", uploads: 4, approvals: 4 },
      { period: "2 Weeks Ago", uploads: 7, approvals: 6 },
      { period: "3 Weeks Ago", uploads: 5, approvals: 5 }
    ]
  },
  // Add more departments as needed
}

export const DepartmentStats = ({ department }: DepartmentStatsProps) => {
  const stats = departmentStats[department] || departmentStats["Engineering"]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFiles}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+{stats.monthlyComparison}%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingFiles}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Avg processing: </span>
              <span className="text-gray-900 dark:text-white font-medium ml-1">
                {stats.avgProcessingTime} days
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.acceptedFiles}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Approval rate: </span>
              <span className="text-green-600 font-medium ml-1">
                {Math.round((stats.acceptedFiles / stats.totalFiles) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">This month: </span>
              <span className="text-purple-600 font-medium ml-1">
                {stats.monthlyUploads} uploads
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Document Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.topCategories.map((category, index) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                  <span className="text-gray-500">
                    {category.count} files ({category.percentage}%)
                  </span>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentTrends.map((trend, index) => (
              <div key={trend.period} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {trend.period}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {trend.uploads} uploads
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {trend.approvals} approved
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Department Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stats.completionRate}%
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Document Completion Rate
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Target: 90%
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                {stats.avgProcessingTime}d
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Avg Processing Time
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Target: &lt; 3 days
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {Math.round((stats.acceptedFiles / stats.totalFiles) * 100)}%
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Approval Rate
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Target: &gt; 85%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}