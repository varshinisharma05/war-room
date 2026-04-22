'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Flame } from 'lucide-react'
import { useState } from 'react'

export function NudgeButton({ receiverId }: { receiverId: string }) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleNudge = async () => {
    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      setLoading(false)
      return
    }

    const { error } = await supabase.from('nudges').insert({
      sender_id: userData.user.id,
      receiver_id: receiverId
    })

    if (!error) {
      toast("Nudge Sent!", {
        description: "They've been pinged.",
      })
    }
    setLoading(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleNudge} disabled={loading} className="gap-2">
      <Flame className="w-4 h-4 text-orange-500" />
      Nudge
    </Button>
  )
}
