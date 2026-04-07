'use client'

import { Home, Bot, Wrench, BarChart3, Shield, Settings, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const navItems = [
  { title: 'Overview', href: '/dashboard', icon: Home },
  { title: 'Agents', href: '/dashboard/agents', icon: Bot },
  { title: 'Tools', href: '/dashboard/tools', icon: Wrench },
  { title: 'Applications', href: '/dashboard/applications', icon: Wrench },
  { title: 'Marketer', href: '/dashboard/marketer', icon: Wrench },
  { title: 'Operations', href: '/dashboard/operations', icon: BarChart3 },
  { title: 'Security', href: '/dashboard/security', icon: Shield },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">Xander Nexus</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive ? 'bg-accent text-accent-foreground' : 'transparent text-muted-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
        {session?.user && (
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <p className="font-medium">{(session.user as any).name || session.user.email}</p>
                <p className="text-muted-foreground text-xs truncate">{session.user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
