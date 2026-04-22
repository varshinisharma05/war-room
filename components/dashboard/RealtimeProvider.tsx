'use client'

import { useEffect, useState, createContext, useContext } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Profile } from '@/lib/supabase/types'

// Create context for status
interface StatusContextType {
  activeTimers: Record<string, boolean>;
  broadcastTimerStart: () => void;
  broadcastTimerStop: () => void;
}

const StatusContext = createContext<StatusContextType>({
  activeTimers: {},
  broadcastTimerStart: () => {},
  broadcastTimerStop: () => {}
})

export const useStatusContext = () => useContext(StatusContext)

export function RealtimeProvider({ currentUserId, profiles, children }: { currentUserId: string, profiles: Profile[], children?: React.ReactNode }) {
  const supabase = createClient()
  const [activeTimers, setActiveTimers] = useState<Record<string, boolean>>({})
  const [statusChannel, setStatusChannel] = useState<any>(null)

  useEffect(() => {
    // Nudges Channel
    const nudgesChannel = supabase
      .channel('realtime_nudges')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'nudges',
          filter: `receiver_id=eq.${currentUserId}`
        },
        (payload) => {
          const senderId = payload.new.sender_id
          const senderProfile = profiles.find(p => p.id === senderId)
          const senderName = senderProfile?.username || 'Someone'

          toast(`${senderName} says: GET TO WORK!`, {
            duration: 5000,
            position: 'top-center',
            className: 'text-2xl font-bold bg-destructive text-destructive-foreground font-mono p-4 border-4 border-red-500 shadow-2xl'
          })

          document.body.classList.add('animate-shake')
          setTimeout(() => {
            document.body.classList.remove('animate-shake')
          }, 1000)
        }
      )
      .subscribe()

    // Status Broadcast Channel
    const statusCh = supabase.channel('status_broadcast', {
      config: {
        broadcast: { ack: false }
      }
    })

    statusCh
      .on('broadcast', { event: 'timer_active' }, (payload) => {
        setActiveTimers(prev => ({ ...prev, [payload.payload.userId]: true }))
      })
      .on('broadcast', { event: 'timer_stopped' }, (payload) => {
        setActiveTimers(prev => ({ ...prev, [payload.payload.userId]: false }))
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setStatusChannel(statusCh)
        }
      })

    return () => {
      supabase.removeChannel(nudgesChannel)
      supabase.removeChannel(statusCh)
    }
  }, [currentUserId, profiles, supabase])

  const broadcastTimerStart = () => {
    if (statusChannel) {
      statusChannel.send({
        type: 'broadcast',
        event: 'timer_active',
        payload: { userId: currentUserId }
      })
      setActiveTimers(prev => ({ ...prev, [currentUserId]: true }))
    }
  }

  const broadcastTimerStop = () => {
    if (statusChannel) {
      statusChannel.send({
        type: 'broadcast',
        event: 'timer_stopped',
        payload: { userId: currentUserId }
      })
      setActiveTimers(prev => ({ ...prev, [currentUserId]: false }))
    }
  }

  return (
    <StatusContext.Provider value={{ activeTimers, broadcastTimerStart, broadcastTimerStop }}>
      {children}
    </StatusContext.Provider>
  )
}
