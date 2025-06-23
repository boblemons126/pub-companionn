"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Users, Calendar, Settings } from "lucide-react"

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Users, label: "Groups", path: "/groups" },
    { icon: Calendar, label: "Sessions", path: "/sessions" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-white/10">
      <div className="container mx-auto max-w-md">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => router.push(item.path)}
                className={`flex-col h-12 px-3 ${
                  isActive ? "text-blue-400 bg-blue-500/20" : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
