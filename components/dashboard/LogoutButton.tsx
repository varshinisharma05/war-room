'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-destructive/20 hover:text-destructive transition-colors" title="Logout">
      <LogOut className="w-5 h-5" />
    </Button>
  )
}
