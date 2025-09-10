import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client for server-side
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete(name);
          },
        },
      }
    );

    // Get authenticated user
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      console.log('❌ No authenticated session for stats');
      // Return demo stats for non-authenticated users
      return NextResponse.json({
        minutesLeft: 100,
        sessionsToday: 0,
        progressScore: 0,
        streakDays: 0,
        totalMinutesUsed: 0,
        totalSessions: 0,
        averageScore: 0,
        isDemo: true
      });
    }

    console.log('✅ Getting real stats for user:', session.user.id);

    // Get user profile
    const { data: profile } = await supabase
      .from('salesai_profiles')
      .select('*')
      .eq('auth_id', session.user.id)
      .single();

    if (!profile) {
      console.warn('⚠️ User profile not found');
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Get user's subscription to determine minutes left
    const { data: subscription } = await supabase
      .from('salesai_subscriptions')
      .select('*')
      .eq('profile_id', profile.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Calculate minutes left based on subscription tier
    const tierLimits = {
      'starter': 100,
      'professional': 500,
      'team': 1500,
      'enterprise': 999999
    };

    const maxMinutes = subscription ? tierLimits[subscription.tier as keyof typeof tierLimits] || 100 : 100;

    // Get usage statistics
    const { data: usage } = await supabase
      .from('salesai_usage')
      .select('minutes_used')
      .eq('profile_id', profile.id)
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    const totalMinutesUsed = usage?.reduce((sum, record) => sum + record.minutes_used, 0) || 0;
    const minutesLeft = Math.max(0, maxMinutes - totalMinutesUsed);

    // Get sessions for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: todaySessions, count: sessionsToday } = await supabase
      .from('salesai_sessions')
      .select('*', { count: 'exact' })
      .eq('profile_id', profile.id)
      .gte('created_at', today.toISOString());

    // Get all completed sessions for statistics
    const { data: allSessions } = await supabase
      .from('salesai_sessions')
      .select('overall_score, created_at')
      .eq('profile_id', profile.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(100);

    // Calculate average score
    const averageScore = allSessions && allSessions.length > 0 
      ? allSessions.reduce((sum, session) => sum + (session.overall_score || 0), 0) / allSessions.length
      : 0;

    // Calculate streak days (consecutive days with sessions)
    let streakDays = 0;
    if (allSessions && allSessions.length > 0) {
      const sessionDates = allSessions.map(s => new Date(s.created_at).toDateString());
      const uniqueDates = [...new Set(sessionDates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      const todayStr = new Date().toDateString();
      if (uniqueDates[0] === todayStr || uniqueDates[0] === new Date(Date.now() - 24*60*60*1000).toDateString()) {
        streakDays = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
          const currentDate = new Date(uniqueDates[i-1]);
          const prevDate = new Date(uniqueDates[i]);
          const daysDiff = (currentDate.getTime() - prevDate.getTime()) / (24*60*60*1000);
          
          if (daysDiff === 1) {
            streakDays++;
          } else {
            break;
          }
        }
      }
    }

    const stats = {
      minutesLeft,
      sessionsToday: sessionsToday || 0,
      progressScore: Math.round(averageScore * 10) / 10,
      streakDays,
      totalMinutesUsed,
      totalSessions: allSessions?.length || 0,
      averageScore: Math.round(averageScore * 10) / 10,
      subscriptionTier: subscription?.tier || 'starter',
      isDemo: false
    };

    console.log('📊 Real user stats calculated:', stats);
    return NextResponse.json(stats);

  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    
    // Fallback to demo stats if database query fails
    return NextResponse.json({
      minutesLeft: 100,
      sessionsToday: 0,
      progressScore: 0,
      streakDays: 0,
      totalMinutesUsed: 0,
      totalSessions: 0,
      averageScore: 0,
      isDemo: true,
      error: 'Could not load real stats'
    });
  }
}
