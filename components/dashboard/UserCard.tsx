'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Profile, DailyStats } from '@/lib/supabase/types'
import { DeepWorkTimer } from './DeepWorkTimer'
import { NudgeButton } from './NudgeButton'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useStatusContext } from './RealtimeProvider'

interface UserCardProps {
  profile: Profile
  stats: DailyStats | null
  isCurrentUser: boolean
  isLeader: boolean
  isHistory?: boolean
}

export function UserCard({ profile, stats, isCurrentUser, isLeader, isHistory }: UserCardProps) {
  const [teachBack, setTeachBack] = useState(stats?.teach_back || '')
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()
  
  const statusCtx = useStatusContext()
  const isFocusing = statusCtx?.activeTimers[profile.id]

  const isRedStatus = profile.current_status === 'Red'
  const secondsWorked = stats?.total_seconds_worked || 0
  const progressPercent = Math.min((secondsWorked / 14400) * 100, 100)
  const isOverflow = secondsWorked >= 14400
  const isUnder4Hours = secondsWorked < 14400
  
  const [isAfter6PM, setIsAfter6PM] = useState(false)
  useEffect(() => {
    if (isHistory) return
    const checkTime = () => setIsAfter6PM(new Date().getHours() >= 18)
    checkTime()
    const timer = setInterval(checkTime, 60000)
    return () => clearInterval(timer)
  }, [isHistory])

  const isCriticalRedZone = !isHistory && isUnder4Hours && isAfter6PM

  const goals = stats?.locked_goals || []

  const handleTeachBackBlur = async () => {
    if (isHistory || !stats?.id || teachBack === stats.teach_back) return
    setIsSaving(true)
    await supabase.from('daily_stats').update({ teach_back: teachBack }).eq('id', stats.id)
    setIsSaving(false)
  }

  let cardClasses = "relative overflow-hidden border-2 bg-background/60 backdrop-blur-md transition-all duration-300"
  if (isLeader && !isHistory) cardClasses += " scale-[1.03] z-10 shadow-2xl"
  if (isCriticalRedZone) cardClasses += " border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.5)]"
  else if (isRedStatus && !isHistory) cardClasses += " border-destructive"
  else cardClasses += " border-border"

  let bgClasses = "absolute inset-0 z-[-1]"
  if (isUnder4Hours && !isOverflow && !isHistory) bgClasses += " bg-rose-900/10 animate-pulse"

  // LED logic
  let ledClass = "w-3 h-3 rounded-full mr-2 shadow-[0_0_8px] "
  if (isFocusing) {
    ledClass += "bg-green-500 shadow-green-500 animate-pulse"
  } else if (!isUnder4Hours) {
    ledClass += "bg-yellow-500 shadow-yellow-500"
  } else {
    ledClass += "bg-red-500 shadow-red-500"
  }

  return (
    <Card className={cardClasses}>
      <div className={bgClasses} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-2 font-mono">
            <div className={ledClass} title={isFocusing ? "Focusing" : (!isUnder4Hours ? "Idle" : "Under 4hrs")} />
            {profile.username}
            {profile.total_streak > 0 && (
              <span className="text-orange-500 text-lg flex items-center gap-1 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">
                🔥 {profile.total_streak}
              </span>
            )}
            {isCriticalRedZone && (
              <Badge variant="destructive" className="animate-bounce">LOW PRODUCTIVITY</Badge>
            )}
            {!isCriticalRedZone && isRedStatus && !isHistory && (
              <Badge variant="destructive">RED ZONE</Badge>
            )}
          </CardTitle>
          {!isCurrentUser && !isHistory && <NudgeButton receiverId={profile.id} />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-sm font-mono">
            <span className="text-muted-foreground">DEEP WORK</span>
            <span className={isOverflow ? 'text-yellow-500 font-bold' : ''}>
              {Math.floor(secondsWorked / 3600)}h {Math.floor((secondsWorked % 3600) / 60)}m
            </span>
          </div>
          <Progress 
            value={progressPercent} 
            className={isOverflow ? '[&>div]:bg-yellow-500' : isCriticalRedZone ? '[&>div]:bg-red-500' : '[&>div]:bg-primary'} 
          />
        </div>

        {isCurrentUser && !isHistory && <DeepWorkTimer initialSeconds={secondsWorked} statsId={stats?.id} />}

        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Locked Goals</h4>
          {goals.length > 0 ? (
            <ul className="text-sm space-y-1 list-disc list-inside font-mono text-muted-foreground">
              {goals.map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic font-mono">No intent detected.</p>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-border/50">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex justify-between">
            Daily Teach-Back
            {isSaving && <span className="text-primary animate-pulse">Saving...</span>}
          </h4>
          {isCurrentUser && !isHistory ? (
            <Textarea
              className="font-mono text-sm bg-background/50 focus-visible:ring-1 h-32"
              placeholder="Teach-Back: Explain what you learned today..."
              value={teachBack}
              onChange={(e) => setTeachBack(e.target.value)}
              onBlur={handleTeachBackBlur}
            />
          ) : (
            <div className="font-mono text-sm p-3 bg-muted/50 rounded-md min-h-[5rem]">
              {stats?.teach_back || <span className="italic text-muted-foreground">{isHistory ? 'No transmission.' : 'Awaiting transmission...'}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
