'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function RecoveryPlanModal({ isOpen, userId, statsId }: { isOpen: boolean, userId: string, statsId?: string }) {
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return

    setLoading(true)
    
    // 1. Update Profile back to 'Ready'
    await supabase.from('profiles').update({ current_status: 'Ready' }).eq('id', userId)

    // 2. Save recovery note to today's stats if statsId exists
    if (statsId) {
      await supabase.from('daily_stats').update({ recovery_note: note }).eq('id', statsId)
    }

    router.refresh()
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] border-destructive [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-destructive font-bold">RED ZONE PENALTY</DialogTitle>
          <DialogDescription>
            You failed to hit your 4 hours of deep work yesterday. To unlock the dashboard, you must submit a recovery plan detailing why you failed and how you will fix it today.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <textarea 
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="I failed because... Today I will..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
          <Button type="submit" variant="destructive" className="w-full" disabled={loading || !note.trim()}>
            {loading ? 'Submitting...' : 'Submit Recovery Plan'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
