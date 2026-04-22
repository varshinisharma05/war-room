'use client'

import { ProtocolModal } from './ProtocolModal'
import { LogoutButton } from './LogoutButton'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function Header({ username }: { username: string }) {
  const pathname = usePathname()
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="mb-8 flex flex-col xl:flex-row justify-between items-center gap-4 bg-black/40 p-4 rounded-lg border border-border/50 backdrop-blur-md relative overflow-hidden">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase flex items-center gap-2">
            WAR<span className="text-primary">ROOM</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">Deep work or nothing.</p>
        </div>
        
        <nav className="flex items-center gap-2 border-l border-border/50 pl-6 h-10">
          <Link href="/">
            <span className={`font-mono uppercase text-sm font-bold px-3 py-1.5 rounded-md transition-colors ${pathname === '/' || pathname.startsWith('/?date') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              Dashboard
            </span>
          </Link>
          <Link href="/resources">
            <span className={`font-mono uppercase text-sm font-bold px-3 py-1.5 rounded-md transition-colors ${pathname === '/resources' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              Vault
            </span>
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {time && (
          <div className="hidden md:block font-mono text-xs tracking-widest text-primary/80 border border-primary/20 bg-primary/5 px-3 py-1.5 rounded uppercase">
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' })} • {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        )}
        <ProtocolModal />
        <div className="flex items-center gap-2 border-l border-border/50 pl-4">
          <p className="text-sm font-bold text-muted-foreground font-mono uppercase">
            Operative: <span className="text-primary">{username}</span>
          </p>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}

