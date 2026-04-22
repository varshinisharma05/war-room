'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Resource, Profile } from '@/lib/supabase/types'
import { useState } from 'react'

export function ResourceList({ resources, profiles }: { resources: Resource[], profiles: Profile[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(resources.map(r => r.category)))

  const filteredResources = activeCategory 
    ? resources.filter(r => r.category === activeCategory)
    : resources

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={activeCategory === null ? 'default' : 'outline'}
          className="cursor-pointer hover:bg-primary/80 transition-colors font-mono"
          onClick={() => setActiveCategory(null)}
        >
          ALL
        </Badge>
        {categories.map(cat => (
          <Badge 
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/80 transition-colors font-mono"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => {
          const profile = profiles.find(p => p.id === resource.user_id)
          return (
            <Card key={resource.id} className="bg-background/60 backdrop-blur-md border-border/50 hover:border-primary/50 transition-colors flex flex-col">
              <CardHeader className="pb-2 flex-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <Badge variant="secondary" className="font-mono text-emerald-500 bg-emerald-950/30 border-emerald-900">{resource.category}</Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(resource.created_at).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold font-mono text-primary leading-tight">
                  <a href={resource.url} target="_blank" rel="noreferrer" className="hover:underline">
                    {resource.title}
                  </a>
                </CardTitle>
                {resource.description && (
                  <CardDescription className="text-muted-foreground mt-2 font-sans line-clamp-3">
                    {resource.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0 shrink-0">
                <div className="text-xs text-muted-foreground font-mono mt-4 pt-4 border-t border-border/50">
                  Archived by: <span className="text-foreground">{profile?.username || 'Unknown'}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {filteredResources.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground font-mono italic border border-dashed border-border/50 rounded-lg">
            No intelligence archived yet.
          </div>
        )}
      </div>
    </div>
  )
}
