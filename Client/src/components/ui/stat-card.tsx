import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  change?: string
  icon: LucideIcon
  variant?: "default" | "success" | "warning" | "destructive"
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, title, value, change, icon: Icon, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-card border-border",
      success: "bg-success-light border-success/20",
      warning: "bg-warning-light border-warning/20", 
      destructive: "bg-destructive/10 border-destructive/20"
    }

    const iconStyles = {
      default: "text-primary",
      success: "text-success",
      warning: "text-warning",
      destructive: "text-destructive"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "gradient-card rounded-lg border p-6 shadow-card transition-smooth hover:shadow-elevated",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <p className={cn(
                "text-xs",
                variant === "success" ? "text-success" : 
                variant === "warning" ? "text-warning" :
                variant === "destructive" ? "text-destructive" : "text-muted-foreground"
              )}>
                {change}
              </p>
            )}
          </div>
          <div className={cn(
            "rounded-full p-3",
            variant === "success" ? "bg-success/10" :
            variant === "warning" ? "bg-warning/10" :
            variant === "destructive" ? "bg-destructive/10" : "bg-primary-light"
          )}>
            <Icon className={cn("h-6 w-6", iconStyles[variant])} />
          </div>
        </div>
      </div>
    )
  }
)
StatCard.displayName = "StatCard"

export { StatCard }