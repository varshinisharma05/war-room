'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function DateNavigator({ currentDate, today }: { currentDate: string, today: string }) {
  const router = useRouter()

  const handleDateChange = (days: number) => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + days)
    const newDateStr = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
    if (newDateStr === today) {
      router.push('/')
    } else {
      router.push(`/?date=${newDateStr}`)
    }
  }

  const isToday = currentDate === today

  return (
    <div className="flex items-center gap-4 bg-black/40 p-2 rounded-lg border border-border/50 backdrop-blur-md self-start">
      <Button variant="ghost" size="icon" onClick={() => handleDateChange(-1)}>
        <ChevronLeft className="w-5 h-5 text-emerald-500" />
      </Button>
      <div className="flex items-center gap-2 text-sm font-mono font-bold text-foreground min-w-[120px] justify-center">
        <Calendar className="w-4 h-4 text-emerald-500" />
        {isToday ? 'TODAY' : currentDate}
      </div>
      <Button variant="ghost" size="icon" onClick={() => handleDateChange(1)} disabled={isToday}>
        <ChevronRight className={`w-5 h-5 ${isToday ? 'text-muted-foreground' : 'text-emerald-500'}`} />
      </Button>
    </div>
  )
}
