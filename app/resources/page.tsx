import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/dashboard/Header'
import { ResourceForm } from '@/components/resources/ResourceForm'
import { ResourceList } from '@/components/resources/ResourceList'

export const dynamic = 'force-dynamic'

export default async function ResourcesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profiles } = await supabase.from('profiles').select('*')
  const { data: resources } = await supabase.from('resources').select('*').order('created_at', { ascending: false })

  const myProfile = profiles?.find(p => p.id === user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1e1b4b] to-[#020617] bg-fixed p-4 md:p-8">
      <Header username={myProfile?.username || user.email || 'Unknown'} />
      
      <div className="max-w-6xl mx-auto space-y-8 mt-6">
        <div>
          <h2 className="text-2xl font-bold font-mono text-emerald-500 mb-2">KNOWLEDGE VAULT</h2>
          <p className="text-muted-foreground font-mono text-sm">Archived intelligence from all operatives. Accessible globally.</p>
        </div>

        <ResourceForm currentUserId={user.id} />
        
        <ResourceList resources={resources || []} profiles={profiles || []} />
      </div>
    </div>
  )
}
