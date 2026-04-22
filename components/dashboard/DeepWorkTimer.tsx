'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { playClick, playSuccessChime } from '@/lib/sound'
import { useStatusContext } from '@/components/dashboard/RealtimeProvider'

type Duration = '25' | '45' | '60'

export function DeepWorkTimer({ initialSeconds, statsId }: { initialSeconds: number, statsId?: string }) {
  const [duration, setDuration] = useState<Duration>('45')
  const [timeLeft, setTimeLeft] = useState(45 * 60)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  
  // Use optional chaining just in case context isn't available (like in history view)
  const statusCtx = useStatusContext()

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(parseInt(duration) * 60)
    }
  }, [duration, isActive])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      handleSessionComplete()
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const handleSessionComplete = async () => {
    if (!statsId) return
    setLoading(true)
    setIsActive(false)
    statusCtx?.broadcastTimerStop()
    
    const sessionSeconds = parseInt(duration) * 60
    const newTotal = initialSeconds + sessionSeconds

    if (initialSeconds < 14400 && newTotal >= 14400) {
      playSuccessChime()
    }

    await supabase.from('daily_stats').update({
      total_seconds_worked: newTotal
    }).eq('id', statsId)

    setLoading(false)
    router.refresh()
  }

  const toggleTimer = () => {
    if (isActive) {
      setIsActive(false)
      setTimeLeft(parseInt(duration) * 60)
      statusCtx?.broadcastTimerStop()
    } else {
      setIsActive(true)
      playClick()
      statusCtx?.broadcastTimerStart()
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 border-y border-border">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Protocol</span>
        {/* @ts-ignore */}
        <ToggleGroup type="single" value={duration} onValueChange={(v) => { 
          const val = Array.isArray(v) ? v[0] : v;
          if(val && !isActive) setDuration(val as Duration) 
        }}>
          <ToggleGroupItem value="25" disabled={isActive} className="text-xs h-8 px-2 font-mono">25m</ToggleGroupItem>
          <ToggleGroupItem value="45" disabled={isActive} className="text-xs h-8 px-2 font-mono">45m</ToggleGroupItem>
          <ToggleGroupItem value="60" disabled={isActive} className="text-xs h-8 px-2 font-mono">60m</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className={`text-center font-mono text-5xl font-bold tracking-widest ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
        {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
        {String(timeLeft % 60).padStart(2, '0')}
      </div>

      <Button 
        onClick={toggleTimer} 
        disabled={loading}
        variant={isActive ? "destructive" : "default"}
        className="w-full font-bold uppercase tracking-widest"
      >
        {isActive ? 'ABORT PROTOCOL (FORFEIT)' : 'ENGAGE DEEP WORK'}
      </Button>
    </div>
  )
}
