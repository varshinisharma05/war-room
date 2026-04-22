'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DailyStats, Profile } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Terminal } from 'lucide-react'

export function EvidenceFeed({ stats, profiles, currentUserId, isHistory }: { stats: DailyStats[], profiles: Profile[], currentUserId: string, isHistory?: boolean }) {
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const allEvidence = stats.flatMap(s => {
    const profile = profiles.find(p => p.id === s.user_id)
    return (s.evidence_links || []).map(link => ({
      username: profile?.username || 'Unknown',
      link,
      date: s.date
    }))
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!link.trim()) return

    const myStats = stats.find(s => s.user_id === currentUserId)
    if (!myStats) return

    setLoading(true)
    const newLinks = [...(myStats.evidence_links || []), link.trim()]
    
    await supabase.from('daily_stats').update({
      evidence_links: newLinks
    }).eq('id', myStats.id)

    setLink('')
    setLoading(false)
    router.refresh()
  }

  return (
    <Card className="h-full border-2 border-emerald-900 bg-black/80 backdrop-blur-md rounded-none flex flex-col">
      <CardHeader className="border-b border-emerald-900 pb-4 shrink-0">
        <CardTitle className="text-xl font-bold font-mono text-emerald-500 flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          EVIDENCE_LOG
        </CardTitle>
        <p className="text-xs text-emerald-700 font-mono mt-1">
          * Remember to post your daily work in the Still Enthusiasts group!
        </p>
      </CardHeader>
      <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
        {!isHistory && (
          <div className="p-4 border-b border-emerald-900/50 bg-black shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input 
                placeholder="Log evidence or paste URL..." 
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="bg-emerald-950/20 border-emerald-900 text-emerald-500 font-mono text-xs focus-visible:ring-emerald-500"
              />
              <Button type="submit" disabled={loading} variant="outline" className="border-emerald-900 text-emerald-500 hover:bg-emerald-900 hover:text-emerald-100 font-mono text-xs">
                POST
              </Button>
            </form>
          </div>
        )}
        
        <ScrollArea className="flex-1 p-4">
          {allEvidence.length === 0 ? (
            <p className="text-emerald-900 italic font-mono text-sm">Waiting for incoming transmission...</p>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {allEvidence.map((e, i) => {
                const isUrl = e.link.startsWith('http://') || e.link.startsWith('https://');
                return (
                  <div key={i} className="flex flex-col gap-1 border-b border-emerald-900/30 pb-2">
                    <span className="font-bold text-emerald-400">[{e.username}]</span>
                    {isUrl ? (
                      <a href={e.link} target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-300 break-all transition-colors">
                        {e.link}
                      </a>
                    ) : (
                      <span className="text-emerald-600 break-words">{e.link}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
