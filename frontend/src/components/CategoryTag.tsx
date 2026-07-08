import type { CategoryColor } from "@/types"
import { getCategoryColorClasses } from "@/lib/format"
import { cn } from "@/lib/utils"

interface CategoryTagProps {
  name: string
  color: CategoryColor
  className?: string
}

export function CategoryTag({ name, color, className }: CategoryTagProps) {
  const colors = getCategoryColorClasses(color)
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colors.bg,
        colors.text,
        className
      )}
    >
      {name}
    </span>
  )
}
