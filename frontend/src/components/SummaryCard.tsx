import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SummaryCardProps {
  label: string
  value: string
  icon: LucideIcon
  iconClassName?: string
  iconColorClassName?: string
  valueClassName?: string
  /** Figma categories: large value above label */
  valueFirst?: boolean
}

export function SummaryCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  iconColorClassName,
  valueClassName,
  valueFirst = false,
}: SummaryCardProps) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="flex items-center gap-4 p-6">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
            iconClassName
          )}
        >
          <Icon className={cn("h-6 w-6", iconColorClassName)} />
        </div>
        <div className="min-w-0">
          {valueFirst ? (
            <>
              <p
                className={cn(
                  "truncate text-2xl font-bold text-gray-800",
                  valueClassName
                )}
              >
                {value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                {label}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {label}
              </p>
              <p className={cn("text-2xl font-bold text-gray-800", valueClassName)}>
                {value}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
