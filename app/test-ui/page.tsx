'use client'

import { Header } from '@/components/dashboard/Header'
import { UserCard } from '@/components/dashboard/UserCard'
import { MorningLockInModal } from '@/components/dashboard/MorningLockInModal'
import { StatusContext } from '@/components/dashboard/RealtimeProvider' // Wait, StatusContext is not exported. Let's just mock the UI directly.
import { useState } from 'react'

export default function TestUIPage() {
  const [showModal, setShowModal] = useState(false)

  const mockProfile = {
    id: '1',
    username: 'GHOST',
    email: 'ghost@warroom.com',
    current_status: 'Green',
    total_streak: 14,
    created_at: new Date().toISOString()
  }

  const mockStats = {
    id: '1',
    user_id: '1',
    date: new Date().toISOString(),
    locked_goals: ['Finish API', 'Deploy to Vercel', 'Workout'],
    total_seconds_worked: 14500,
    teach_back: 'Learned a lot about Web Audio API today.',
    created_at: new Date().toISOString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1e1b4b] to-[#020617] bg-fixed">
      <div className="min-h-screen p-4 md:p-8 flex flex-col relative z-10">
        <Header username="GHOST" />
        
        <div className="flex-1 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UserCard 
              profile={mockProfile}
              stats={mockStats}
              isCurrentUser={true}
              isLeader={true}
              isHistory={false}
            />
          </div>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="fixed bottom-4 right-4 bg-primary text-background px-4 py-2 font-mono font-bold"
        >
          SHOW BOOT SEQUENCE
        </button>

        {showModal && <MorningLockInModal isOpen={true} userId="1" />}
      </div>
    </div>
  )
}
