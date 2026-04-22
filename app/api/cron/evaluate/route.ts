import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// We fall back to the anon key if service role is missing, though cron scripts usually need service role
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  // Check authorization header if you secure the cron via Vercel Cron Secret
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const now = new Date();
  now.setDate(now.getDate() - 1);
  const yesterday = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

  const { data: profiles } = await supabase.from('profiles').select('*');
  if (!profiles) return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });

  const { data: stats } = await supabase.from('daily_stats').select('*').eq('date', yesterday);
  const statsMap = new Map(stats?.map(s => [s.user_id, s.total_seconds_worked]) || []);

  for (const profile of profiles) {
    const secondsWorked = statsMap.get(profile.id) || 0;
    
    let newStreak = profile.total_streak;
    let newStatus = 'Ready';

    if (secondsWorked >= 14400) {
      newStreak += 1;
    } else {
      newStreak = 0;
      newStatus = 'Red';
    }

    await supabase.from('profiles').update({
      total_streak: newStreak,
      current_status: newStatus
    }).eq('id', profile.id);
  }

  return NextResponse.json({ success: true, evaluatedDate: yesterday });
}
