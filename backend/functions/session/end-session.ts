import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '../../lib/supabase';
import { z } from 'zod';

const endSessionSchema = z.object({
  session_id: z.string().uuid(),
  duration_seconds: z.number().positive(),
  audio_quality: z.record(z.any()).optional(),
  audio_file_url: z.string().url().optional(),
  audio_file_size: z.number().positive().optional(),
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
    const validatedData = endSessionSchema.parse(body);

    // Get the session and verify ownership
    const { data: session, error: sessionError } = await supabase
      .from(TABLES.SESSIONS)
      .select('*')
      .eq('id', validatedData.session_id)
      .eq('profile_id', profile.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found or access denied' }, { status: 404 });
    }

    if (session.status !== 'active') {
      return NextResponse.json({ error: 'Session is not active' }, { status: 400 });
    }

    // Calculate minute cost based on duration
    const minutesUsed = Math.ceil(validatedData.duration_seconds / 60);
    const minuteCost = minutesUsed * 0.1; // $0.1 per minute (example pricing)

    // Update the session
    const { data: updatedSession, error: updateError } = await supabase
      .from(TABLES.SESSIONS)
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        duration_seconds: validatedData.duration_seconds,
        audio_quality: validatedData.audio_quality,
        audio_file_url: validatedData.audio_file_url,
        audio_file_size: validatedData.audio_file_size,
        minute_cost: minuteCost,
        processing_status: 'analyzing'
      })
      .eq('id', validatedData.session_id)
      .select()
      .single();

    if (updateError) {
      console.error('Session update error:', updateError);
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }

    // Update subscription usage
    const { data: subscription } = await supabase
      .from(TABLES.SUBSCRIPTIONS)
      .select('*')
      .eq('profile_id', profile.id)
      .eq('status', 'active')
      .single();

    if (subscription) {
      await supabase
        .from(TABLES.SUBSCRIPTIONS)
        .update({ 
          minutes_used: subscription.minutes_used + minutesUsed 
        })
        .eq('id', subscription.id);

      // Record usage
      await supabase.from(TABLES.USAGE).insert({
        profile_id: profile.id,
        company_id: profile.company_id,
        minutes_used: minutesUsed,
        session_id: validatedData.session_id,
        period_start: subscription.current_period_start,
        period_end: subscription.current_period_end
      });
    }

    // Log audit trail
    await supabase.from(TABLES.AUDIT_LOGS).insert({
      user_id: user.id,
      company_id: profile.company_id,
      event_type: 'session',
      resource: 'sessions',
      action: 'complete',
      details: {
        session_id: validatedData.session_id,
        duration_seconds: validatedData.duration_seconds,
        minutes_used: minutesUsed,
        minute_cost: minuteCost,
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json({
      session: {
        id: updatedSession.id,
        status: updatedSession.status,
        ended_at: updatedSession.ended_at,
        duration_seconds: updatedSession.duration_seconds,
        minute_cost: minuteCost,
        minutes_used: minutesUsed
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: error.errors 
      }, { status: 400 });
    }

    console.error('Error in end-session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
