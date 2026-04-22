import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserCard } from '@/components/dashboard/UserCard'
import { EvidenceFeed } from '@/components/dashboard/EvidenceFeed'
import { MorningLockInModal } from '@/components/dashboard/MorningLockInModal'
import { RecoveryPlanModal } from '@/components/dashboard/RecoveryPlanModal'
import { RealtimeProvider } from '@/components/dashboard/RealtimeProvider'
import { Header } from '@/components/dashboard/Header'
import { DateNavigator } from '@/components/dashboard/DateNavigator'
import { Profile, DailyStats } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams }: { searchParams: { date?: string } }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profiles } = await supabase.from('profiles').select('*')
  
  const todayRaw = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
  const targetDate = searchParams.date || todayRaw
  const isHistory = targetDate !== todayRaw
  
  const { data: currentStats } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('date', targetDate)

  const myProfile = profiles?.find(p => p.id === user.id)
  const myStats = currentStats?.find(s => s.user_id === user.id)

  const showMorningLockIn = !isHistory && (!myStats || (myStats.locked_goals || []).length === 0)
  const showRecoveryPlan = !isHistory && (myProfile?.current_status === 'Red')

  const maxSeconds = Math.max(...(currentStats?.map(s => s.total_seconds_worked) || [0]))

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1e1b4b] to-[#020617] bg-fixed">
      {!isHistory ? (
        <RealtimeProvider currentUserId={user.id} profiles={profiles || []}>
          <div className="min-h-screen p-4 md:p-8 flex flex-col">
            <Header username={myProfile?.username || user.email || 'Unknown'} />
            
            <DateNavigator currentDate={targetDate} today={todayRaw} />

            <div className="flex-1 flex flex-col xl:flex-row gap-6 h-full mt-6">
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                  {profiles?.map((profile: Profile) => {
                    const stats = currentStats?.find(s => s.user_id === profile.id) || null
                    const isLeader = maxSeconds > 0 && stats?.total_seconds_worked === maxSeconds
                    return (
                      <UserCard 
                        key={profile.id}
                        profile={profile}
                        stats={stats}
                        isCurrentUser={profile.id === user.id}
                        isLeader={isLeader}
                        isHistory={isHistory}
                      />
                    )
                  })}
                </div>
              </div>

              <div className="w-full xl:w-[400px] shrink-0 h-[600px] xl:h-[calc(100vh-220px)] xl:sticky xl:top-24">
                <EvidenceFeed stats={currentStats || []} profiles={profiles || []} currentUserId={user.id} isHistory={isHistory} />
              </div>
            </div>

            {showMorningLockIn && <MorningLockInModal isOpen={true} userId={user.id} />}
            {showRecoveryPlan && <RecoveryPlanModal isOpen={true} userId={user.id} statsId={myStats?.id} />}
          </div>
        </RealtimeProvider>
      ) : (
        <div className="min-h-screen p-4 md:p-8 flex flex-col">
          <Header username={myProfile?.username || user.email || 'Unknown'} />
          
          <DateNavigator currentDate={targetDate} today={todayRaw} />

          <div className="flex-1 flex flex-col xl:flex-row gap-6 h-full mt-6">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                {profiles?.map((profile: Profile) => {
                  const stats = currentStats?.find(s => s.user_id === profile.id) || null
                  const isLeader = maxSeconds > 0 && stats?.total_seconds_worked === maxSeconds
                  return (
                    <UserCard 
                      key={profile.id}
                      profile={profile}
                      stats={stats}
                      isCurrentUser={profile.id === user.id}
                      isLeader={isLeader}
                      isHistory={isHistory}
                    />
                  )
                })}
              </div>
            </div>

            <div className="w-full xl:w-[400px] shrink-0 h-[600px] xl:h-[calc(100vh-220px)] xl:sticky xl:top-24">
              <EvidenceFeed stats={currentStats || []} profiles={profiles || []} currentUserId={user.id} isHistory={isHistory} />
            </div>
          </div>

          {showRecoveryPlan && <RecoveryPlanModal isOpen={true} userId={user.id} statsId={myStats?.id} />}
        </div>
      )}
    </div>
  )
}
