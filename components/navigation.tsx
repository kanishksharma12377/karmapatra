"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GraduationCap, Home as HomeIcon, User, Shield } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/login?type=student", label: "Student", icon: User },
    { href: "/login?type=admin", label: "Teacher/Administration", icon: Shield },
  ]

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary">KarmaPatra</span>
              <span className="text-xs text-muted-foreground">(कर्मपत्र)</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "default" : "ghost"}
                  asChild
                  className="flex items-center space-x-2"
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <GraduationCap className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
