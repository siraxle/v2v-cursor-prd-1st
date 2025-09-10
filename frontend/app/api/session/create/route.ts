import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '../../../../lib/supabase-backend';

const createSessionSchema = {
  title: (value: any) => typeof value === 'string' && value.length >= 1 && value.length <= 255,
  company_id: (value: any) => !value || (typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value))
};

function validateSchema(data: any, schema: any) {
  for (const [key, validator] of Object.entries(schema)) {
    if (data[key] !== undefined && !validator(data[key])) {
      throw new Error(`Invalid ${key}`);
    }
  }
  return data;
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body first
    const body = await req.json();
    
    // Handle demo sessions (when userId is 'demo-user' or no auth header)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || body.userId === 'demo-user') {
      console.log('🎭 Creating demo session for user:', body.userId);
      
      const demoSessionId = `demo-session-${Date.now()}`;
      
      return NextResponse.json({
        session: {
          id: demoSessionId,
          title: body.title || 'Demo Voice Training Session',
          status: 'active',
          started_at: new Date().toISOString(),
          processing_status: 'ready',
          isDemo: true
        }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the user token with Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from(TABLES.PROFILES)
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Body already parsed above, validate it
    const validatedData = validateSchema(body, createSessionSchema);

    // Check if user has available minutes (if they have a subscription)
    const { data: subscription, error: subError } = await supabase
      .from(TABLES.SUBSCRIPTIONS)
      .select('*')
      .eq('profile_id', profile.id)
      .eq('status', 'active')
      .single();

    if (subscription && subscription.minutes_used >= subscription.minutes_limit) {
      return NextResponse.json({ 
        error: 'Subscription minute limit reached. Please upgrade your plan.' 
      }, { status: 400 });
    }

    // Create the session
    const { data: session, error: sessionError } = await supabase
      .from(TABLES.SESSIONS)
      .insert({
        profile_id: profile.id,
        company_id: validatedData.company_id || profile.company_id,
        title: validatedData.title,
        status: 'active',
        processing_status: 'ready'
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    // Log audit trail
    await supabase.from(TABLES.AUDIT_LOGS).insert({
      user_id: user.id,
      company_id: profile.company_id,
      event_type: 'session',
      resource: 'sessions',
      action: 'create',
      details: {
        session_id: session.id,
        title: validatedData.title,
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json({
      session: {
        id: session.id,
        title: session.title,
        status: session.status,
        started_at: session.started_at,
        processing_status: session.processing_status
      }
    });

  } catch (error) {
    console.error('Error in create-session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
