import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '../../lib/supabase';
import { z } from 'zod';

const createSessionSchema = z.object({
  title: z.string().min(1).max(255),
  company_id: z.string().uuid().optional(),
});

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Get user from authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
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

    // Parse and validate request body
    const body = await req.json();
    const validatedData = createSessionSchema.parse(body);

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
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: error.errors 
      }, { status: 400 });
    }

    console.error('Error in create-session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
