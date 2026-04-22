'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { SquadTopic, WeeklyGoal, Profile } from '@/lib/supabase/types'

export function WeeklyDirectives({ 
  currentUserId, 
  squadTopic, 
  weeklyGoals,
  profiles,
  weekStartDate
}: { 
  currentUserId: string,
  squadTopic: SquadTopic | null,
  weeklyGoals: WeeklyGoal[],
  profiles: Profile[],
  weekStartDate: string
}) {
  const [editingTopic, setEditingTopic] = useState(false)
  const [topicInput, setTopicInput] = useState(squadTopic?.topic_text || '')
  
  const myGoal = weeklyGoals.find(g => g.user_id === currentUserId)
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState(myGoal?.goal_text || '')
  
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSaveTopic = async () => {
    if (!topicInput.trim()) return
    setLoading(true)
    await supabase.from('squad_topics').upsert({
      week_start_date: weekStartDate,
      topic_text: topicInput
    }, { onConflict: 'week_start_date' })
    setEditingTopic(false)
    setLoading(false)
    router.refresh()
  }

  const handleSaveGoal = async () => {
    if (!goalInput.trim()) return
    setLoading(true)
    await supabase.from('weekly_goals').upsert({
      user_id: currentUserId,
      week_start_date: weekStartDate,
      goal_text: goalInput
    }, { onConflict: 'user_id,week_start_date' })
    setEditingGoal(false)
    setLoading(false)
    router.refresh()
  }

  return (
    <Card className="border-2 border-border bg-background/60 backdrop-blur-md mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      <CardHeader className="pb-2 border-b border-border/50 bg-black/20">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold font-mono tracking-widest uppercase text-primary drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
            SQUAD DIRECTIVES (WEEK OF {new Date(weekStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 xl:grid-cols-4 gap-6 pt-6">
        {/* Squad Topic */}
        <div className="xl:col-span-1 border-r-0 xl:border-r border-border/50 pr-0 xl:pr-6 space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex justify-between items-center">
            Common Topic
            {!editingTopic && (
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => setEditingTopic(true)}>
                EDIT
              </Button>
            )}
          </h3>
          {editingTopic ? (
            <div className="space-y-2">
              <Input 
                value={topicInput} 
                onChange={(e) => setTopicInput(e.target.value)} 
                placeholder="E.g. System Design, WebSockets..."
                className="font-mono text-sm bg-black/50"
                disabled={loading}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveTopic} disabled={loading} className="w-full">SAVE</Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditingTopic(false); setTopicInput(squadTopic?.topic_text || '') }}>CANCEL</Button>
              </div>
            </div>
          ) : (
            <div className="font-mono text-sm p-4 bg-primary/10 border border-primary/20 rounded-md text-primary">
              {squadTopic?.topic_text || <span className="italic text-muted-foreground">No squad topic set.</span>}
            </div>
          )}
        </div>

        {/* Individual Weekly Goals */}
        <div className="xl:col-span-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Operative Weekly Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profiles.map(profile => {
              const isMe = profile.id === currentUserId
              const goal = weeklyGoals.find(g => g.user_id === profile.id)
              
              return (
                <div key={profile.id} className={`p-3 rounded-md border ${isMe ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-black/20'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold font-mono text-sm text-foreground">{profile.username}</span>
                    {isMe && !editingGoal && (
                      <Button variant="ghost" size="sm" className="h-5 text-[10px] px-2" onClick={() => setEditingGoal(true)}>
                        UPDATE
                      </Button>
                    )}
                  </div>
                  
                  {isMe && editingGoal ? (
                    <div className="space-y-2 mt-2">
                      <Input 
                        value={goalInput} 
                        onChange={(e) => setGoalInput(e.target.value)} 
                        placeholder="E.g. Complete DSA Array module"
                        className="font-mono text-xs bg-black/50 h-8"
                        disabled={loading}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" className="h-6 text-xs w-full" onClick={handleSaveGoal} disabled={loading}>SAVE</Button>
                        <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => { setEditingGoal(false); setGoalInput(myGoal?.goal_text || '') }}>X</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="font-mono text-xs text-muted-foreground">
                      {goal?.goal_text || <span className="italic opacity-50">No goal locked.</span>}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
