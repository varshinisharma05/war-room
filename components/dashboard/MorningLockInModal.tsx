'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { startHum, stopHum } from '@/lib/sound'

export function MorningLockInModal({ isOpen, userId }: { isOpen: boolean, userId: string }) {
  const [goals, setGoals] = useState(['', '', ''])
  const [loading, setLoading] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (isOpen && !isUnlocked) {
      startHum()
    }
    return () => {
      stopHum()
    }
  }, [isOpen, isUnlocked])

  // Automatically trigger unlock sequence when all 3 are filled
  useEffect(() => {
    if (goals.every(g => g.trim().length > 0) && !isUnlocked && !loading) {
      handleUnlock()
    }
  }, [goals])

  const handleUnlock = async () => {
    setLoading(true)
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
    
    const { error } = await supabase.from('daily_stats').upsert({
      user_id: userId,
      date: today,
      locked_goals: goals
    }, { onConflict: 'user_id,date' })

    if (!error) {
      stopHum()
      setShowAnimation(true)
      setTimeout(() => {
        setIsUnlocked(true)
        router.refresh()
      }, 1500) // Duration of "System Online" animation
    } else {
      setLoading(false)
    }
  }

  if (!isOpen || isUnlocked) return null

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-1000 ${showAnimation ? 'opacity-0 backdrop-blur-none bg-transparent' : 'opacity-100 backdrop-blur-3xl bg-background/80'}`}>
      
      {showAnimation ? (
        <div className="text-primary font-mono text-5xl md:text-7xl font-bold tracking-[0.2em] animate-pulse drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">
          SYSTEM ONLINE
        </div>
      ) : (
        <div className="w-full max-w-md p-8 space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-mono font-bold tracking-widest text-primary drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
              INITIALIZE SEQUENCE
            </h1>
            <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
              Awaiting Target Acquisition...
            </p>
          </div>
          
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-0.5 bg-primary/20 blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                <div className="relative flex items-center bg-background/50 border border-border group-focus-within:border-primary/50">
                  <span className="px-4 font-mono text-xs text-muted-foreground border-r border-border group-focus-within:text-primary transition-colors">
                    TARGET_0{i + 1}
                  </span>
                  <Input 
                    className="border-0 bg-transparent rounded-none focus-visible:ring-0 font-mono text-lg h-14 pl-4 placeholder:text-muted-foreground/30"
                    placeholder="ENTER PARAMETER"
                    value={goals[i]}
                    onChange={(e) => {
                      const newGoals = [...goals]
                      newGoals[i] = e.target.value
                      setGoals(newGoals)
                    }}
                    disabled={loading || showAnimation}
                    autoFocus={i === 0}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 flex justify-center">
            {loading && !showAnimation && (
              <div className="text-primary font-mono text-sm uppercase animate-pulse tracking-widest">
                Processing input data...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
