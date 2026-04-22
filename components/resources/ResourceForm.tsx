'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function ResourceForm({ currentUserId }: { currentUserId: string }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !url || !category) return

    setLoading(true)
    const { error } = await supabase.from('resources').insert({
      user_id: currentUserId,
      title,
      url,
      category: category.toUpperCase(),
      description
    })

    if (!error) {
      setTitle('')
      setUrl('')
      setCategory('')
      setDescription('')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Card className="bg-background/40 backdrop-blur-md border-border/50">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              placeholder="Title (e.g. Master DHCP)" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              className="font-mono bg-black/50"
            />
            <Input 
              placeholder="URL" 
              type="url"
              value={url} 
              onChange={e => setUrl(e.target.value)} 
              required 
              className="font-mono bg-black/50"
            />
            <Input 
              placeholder="Category (e.g. CN, DSA, SQL)" 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              required 
              className="font-mono bg-black/50 uppercase"
            />
          </div>
          <Textarea 
            placeholder="Short description of why this is valuable..." 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            className="font-mono bg-black/50 min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="font-mono font-bold tracking-widest">
              {loading ? 'ARCHIVING...' : 'ARCHIVE RESOURCE'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
