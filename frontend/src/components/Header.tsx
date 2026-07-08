import { Link, useLocation } from "react-router-dom"
import logo from "@/assets/Logo.svg"
import { useAuthStore } from "@/stores/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/categories", label: "Categories" },
]

export function Header() {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) return null

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Financy" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center justify-center gap-8 md:flex">
          {navItems.map(({ to, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "text-sm transition-colors",
                  active
                    ? "font-semibold text-brand-base"
                    : "font-medium text-gray-600 hover:text-gray-800"
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center justify-end">
          <Link
            to="/profile"
            className="rounded-full hover:opacity-80"
            title="Profile"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gray-200 text-sm font-medium text-gray-700">
                {user?.name ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
