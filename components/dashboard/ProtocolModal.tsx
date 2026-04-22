'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProtocolModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-primary/20 hover:text-primary transition-colors">
          <Info className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-md border-primary/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-mono text-primary border-b border-border pb-4">
            WAR ROOM PROTOCOLS
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4 font-mono text-sm leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-foreground mb-2">[1] THE 4-HOUR MINIMUM</h3>
            <p className="text-muted-foreground">
              Every operative must log a strict minimum of 14,400 seconds (4 hours) of Deep Work daily. Failing to meet this by 18:00 (6:00 PM) triggers the Red Zone Alert. Falling short by day's end requires a mandatory Recovery Plan submission before re-entry.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-bold text-foreground mb-2">[2] THE LOCK-IN RULE</h3>
            <p className="text-muted-foreground">
              No entry without intent. Before the dashboard unlocks, you must commit to 3 concrete goals for the day. These are broadcasted to all operatives and cannot be changed.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-2">[3] POMODORO ENGAGEMENT</h3>
            <p className="text-muted-foreground">
              Time is tracked strictly in Pomodoro blocks of 25, 45, or 60 minutes. You must complete a full block for the time to be committed to the database. Stopping early forfeits the block.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-2">[4] DAILY TEACH-BACK</h3>
            <p className="text-muted-foreground">
              True mastery requires teaching. You must summarize one concept you learned today in 20 words or less in your card's Teach-Back field.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-orange-500 mb-2">[5] NUDGE SYSTEM</h3>
            <p className="text-muted-foreground">
              If an operative appears idle or distracted, any other user may deploy a Nudge. This physically shakes their screen and issues an immediate alert. Use it ruthlessly.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
