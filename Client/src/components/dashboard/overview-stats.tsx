import { StatCard } from "@/components/ui/stat-card"
import { FileText, Upload, Users, Clock, AlertTriangle, CheckCircle } from "lucide-react"

export function OverviewStats() {
  const stats = [
    {
      title: "Total Documents",
      value: "2,847",
      change: "+12% from last month",
      icon: FileText,
      variant: "default" as const
    },
    {
      title: "Processed Today",
      value: "156",
      change: "+23 from yesterday",
      icon: Upload,
      variant: "success" as const
    },
    {
      title: "Pending Review",
      value: "42",
      change: "-8 from yesterday",
      icon: Clock,
      variant: "warning" as const
    },
    {
      title: "Active Users",
      value: "89",
      change: "+5 this week",
      icon: Users,
      variant: "default" as const
    },
    {
      title: "Compliance Issues",
      value: "3",
      change: "Requires attention",
      icon: AlertTriangle,
      variant: "destructive" as const
    },
    {
      title: "Completion Rate",
      value: "94.2%",
      change: "+2.1% improvement",
      icon: CheckCircle,
      variant: "success" as const
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          variant={stat.variant}
        />
      ))}
    </div>
  )
}