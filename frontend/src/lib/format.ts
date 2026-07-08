import type { LucideIcon } from "lucide-react"
import {
  ArrowUpDown,
  Book,
  Briefcase,
  Car,
  Clipboard,
  Dumbbell,
  Gift,
  HeartPulse,
  Home,
  Package,
  PawPrint,
  PiggyBank,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Ticket,
  Utensils,
  Wallet,
} from "lucide-react"
import type { CategoryColor } from "@/types"

const ICON_MAP: Record<string, LucideIcon> = {
  ArrowUpDown,
  Book,
  Briefcase,
  Car,
  Clipboard,
  Dumbbell,
  Gift,
  HeartPulse,
  Home,
  Package,
  PawPrint,
  PiggyBank,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Ticket,
  Utensils,
  Wallet,
}

export const CATEGORY_ICON_OPTIONS = [
  "Briefcase",
  "Car",
  "HeartPulse",
  "PiggyBank",
  "ShoppingCart",
  "Ticket",
  "Gift",
  "Utensils",
  "PawPrint",
  "Home",
  "Package",
  "Dumbbell",
  "Book",
  "ShoppingBag",
  "Wallet",
  "Clipboard",
] as const

export const CATEGORY_COLOR_OPTIONS: CategoryColor[] = [
  "green",
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
]

export const CATEGORY_COLOR_HEX: Record<CategoryColor, string> = {
  green: "#16A34A",
  blue: "#2563EB",
  purple: "#9333EA",
  pink: "#DB2777",
  red: "#DC2626",
  orange: "#EA580C",
  yellow: "#CA8A04",
}

export function getCategoryIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? Tag
}

export function getCategoryColorClasses(color: CategoryColor) {
  const map: Record<
    CategoryColor,
    { bg: string; text: string; iconBg: string; iconText: string }
  > = {
    blue: {
      bg: "bg-cat-blue-light",
      text: "text-cat-blue-base",
      iconBg: "bg-cat-blue-light",
      iconText: "text-cat-blue-base",
    },
    purple: {
      bg: "bg-cat-purple-light",
      text: "text-cat-purple-base",
      iconBg: "bg-cat-purple-light",
      iconText: "text-cat-purple-base",
    },
    pink: {
      bg: "bg-cat-pink-light",
      text: "text-cat-pink-base",
      iconBg: "bg-cat-pink-light",
      iconText: "text-cat-pink-base",
    },
    red: {
      bg: "bg-cat-red-light",
      text: "text-cat-red-base",
      iconBg: "bg-cat-red-light",
      iconText: "text-cat-red-base",
    },
    orange: {
      bg: "bg-cat-orange-light",
      text: "text-cat-orange-base",
      iconBg: "bg-cat-orange-light",
      iconText: "text-cat-orange-base",
    },
    yellow: {
      bg: "bg-cat-yellow-light",
      text: "text-cat-yellow-dark",
      iconBg: "bg-cat-yellow-light",
      iconText: "text-cat-yellow-dark",
    },
    green: {
      bg: "bg-cat-green-light",
      text: "text-cat-green-base",
      iconBg: "bg-cat-green-light",
      iconText: "text-cat-green-base",
    },
  }
  return map[color]
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function toDateInputValue(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, "")
  if (!digits) return 0
  return Number(digits) / 100
}

export function formatCurrencyInput(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function getMonthYearLabel(month: number, year: number): string {
  return `${MONTH_NAMES[month - 1]} / ${year}`
}
