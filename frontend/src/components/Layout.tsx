import { Toaster } from "@/components/ui/sonner"
import { Header } from "./Header"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">{children}</main>
      <Toaster />
    </div>
  )
}
