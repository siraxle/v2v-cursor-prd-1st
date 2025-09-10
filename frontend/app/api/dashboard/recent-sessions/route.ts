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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get authenticated user
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      console.log('❌ No authenticated session for recent sessions');
      // Return demo sessions for non-authenticated users
      return NextResponse.json([
        {
          id: 'demo-1',
          title: 'Demo Session - Please Login',
          duration: 0,
          score: 0,
          date: new Date().toISOString(),
          status: 'demo',
          improvement: 0,
          feedback: 'Please login to see your real session data',
          topics: ['Demo mode - login required']
        }
      ]);
    }

    console.log('✅ Getting real sessions for user:', session.user.id);

    // Get user profile
    const { data: profile } = await supabase
      .from('salesai_profiles')
      .select('id')
      .eq('auth_id', session.user.id)
      .single();

    if (!profile) {
      console.warn('⚠️ User profile not found');
      return NextResponse.json([]);
    }

    // Get recent sessions
    const { data: sessions } = await supabase
      .from('salesai_sessions')
      .select(`
        id,
        session_type,
        duration_seconds,
        overall_score,
        created_at,
        status,
        scenario_topic,
        feedback_summary,
        conversation_log
      `)
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!sessions) {
      console.log('📋 No sessions found for user');
      return NextResponse.json([]);
    }

    // Format sessions for frontend
    const recentSessions = sessions.map(session => {
      const conversationLog = session.conversation_log ? JSON.parse(session.conversation_log) : null;
      const topics = conversationLog?.topics || [session.scenario_topic || session.session_type];
      
      return {
        id: session.id,
        title: session.scenario_topic || `${session.session_type} Training`,
        duration: Math.floor(session.duration_seconds / 60),
        score: session.overall_score || 0,
        date: session.created_at,
        status: session.status,
        improvement: 0, // TODO: Calculate improvement based on historical data
        feedback: session.feedback_summary || 'Session analysis pending...',
        topics: Array.isArray(topics) ? topics : [topics]
      };
    });

    console.log(`📋 Found ${recentSessions.length} real sessions for user`);
    return NextResponse.json(recentSessions);

  } catch (error) {
    console.error('❌ Recent sessions error:', error);
    
    // Fallback to empty array if database query fails
    return NextResponse.json([]);
  }
}
