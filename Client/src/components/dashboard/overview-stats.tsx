import { StatCard } from "@/components/ui/stat-card"
import { FileText, Upload, Users, Clock, AlertTriangle, CheckCircle, TrendingUp, Activity, Target } from "lucide-react"
import { useState, useEffect } from "react"

export function OverviewStats() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      title: "Total Documents",
      value: "7",
      change: "+1% from last month",
      changeValue: "+1%",
      trend: "up",
      icon: FileText,
      variant: "default" as const,
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "from-blue-500 to-cyan-500",
      delay: 0
    },
    {
      title: "Processed Today",
      value: "2",
      change: "+1 from yesterday",
      changeValue: "+2",
      trend: "up",
      icon: Upload,
      variant: "success" as const,
      bgGradient: "from-green-500/10 to-emerald-500/10",
      iconBg: "from-green-500 to-emerald-500",
      delay: 100
    },
    {
      title: "Pending Review",
      value: "0",
      change: "-8 from yesterday",
      changeValue: "-1",
      trend: "down",
      icon: Clock,
      variant: "warning" as const,
      bgGradient: "from-orange-500/10 to-yellow-500/10",
      iconBg: "from-orange-500 to-yellow-500",
      delay: 200
    },
    {
      title: "Active Users",
      value: "3",
      change: "+5 this week",
      changeValue: "+5",
      trend: "up",
      icon: Users,
      variant: "default" as const,
      bgGradient: "from-purple-500/10 to-pink-500/10",
      iconBg: "from-purple-500 to-pink-500",
      delay: 300
    },
    {
      title: "Compliance Issues",
      value: "3",
      change: "Requires attention",
      changeValue: "3",
      trend: "neutral",
      icon: AlertTriangle,
      variant: "destructive" as const,
      bgGradient: "from-red-500/10 to-rose-500/10",
      iconBg: "from-red-500 to-rose-500",
      delay: 400
    },
    {
      title: "Completion Rate",
      value: "94.2%",
      change: "+2.1% improvement",
      changeValue: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      variant: "success" as const,
      bgGradient: "from-teal-500/10 to-green-500/10",
      iconBg: "from-teal-500 to-green-500",
      delay: 500
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-16" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Activity className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">System Overview</h2>
              <p className="text-blue-100 text-lg">Real-time analytics and performance metrics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-sm text-blue-100">Active Departments</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1">98.5%</div>
              <div className="text-sm text-blue-100">System Uptime</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm text-blue-100">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`group relative transform transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: `${stat.delay}ms` }}
          >
            {/* Enhanced Stat Card */}
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2`}>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
              
              <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.iconBg} shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Trend Indicator */}
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-700' :
                    stat.trend === 'down' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                    {stat.trend === 'down' && <TrendingUp className="h-3 w-3 rotate-180" />}
                    {stat.trend === 'neutral' && <Target className="h-3 w-3" />}
                    {stat.changeValue}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.change}
                  </p>
                </div>

                {/* Progress Bar for Completion Rate */}
                {stat.title === "Completion Rate" && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: isVisible ? stat.value : '0%' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Hover Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View detailed analytics and trends</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monitor system status and alerts</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
        </div>
      </div>
    </div>
  )
}