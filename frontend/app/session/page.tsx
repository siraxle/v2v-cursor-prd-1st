'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VoiceSessionInterface from '../../components/voice-session/voice-session-interface';
import { toast } from 'react-hot-toast';
import { createClient } from '../../lib/supabase';

export default function SessionPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  // Create a new session when the page loads
  useEffect(() => {
    createNewSession();
  }, []);

  const createNewSession = async () => {
    try {
      setIsCreatingSession(true);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Check for personalized demo data from demo-request page
        const demoUserData = localStorage.getItem('demo-user');
        if (demoUserData) {
          const userData = JSON.parse(demoUserData);
          setUserInfo(userData);
          console.log('📋 Personalized demo for:', userData.name, 'from', userData.company);
        } else {
          // No auth and no demo data, redirect to demo request
          toast.error('Please login or fill out demo request to continue');
          router.push('/demo-request');
          return;
        }
      } else {
        // Get user profile information
        try {
          const { data: profile } = await supabase
            .from('salesai_profiles')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();
            
          if (profile) {
            setUserInfo({
              name: profile.full_name,
              email: session.user.email,
              company: profile.company_name,
              role: profile.role
            });
            console.log('✅ Authenticated user:', profile.full_name);
          }
        } catch (profileError) {
          console.warn('⚠️ Could not load user profile:', profileError);
        }
      }
      
      // Check if ElevenLabs is configured
      try {
        const testResponse = await fetch('/api/session/elevenlabs-signed-url');
        if (!testResponse.ok) {
          const errorData = await testResponse.json();
          if (errorData.setup) {
            toast.error('⚠️ ElevenLabs not configured. Check SETUP_INSTRUCTIONS.md');
            console.warn('❌ ElevenLabs configuration needed:', errorData.setup);
          }
        } else {
          console.log('✅ ElevenLabs backend configured correctly');
        }
      } catch (envError) {
        console.warn('⚠️ Could not verify ElevenLabs configuration:', envError);
      }

      // Create real session via backend API
      try {
        const sessionResponse = await fetch('/api/session/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(session && { 'Authorization': `Bearer ${session.access_token}` })
          },
          body: JSON.stringify({
            title: `Voice Training Session - ${new Date().toLocaleString()}`,
            userId: session?.user.id || 'demo-user',
            userInfo: userInfo
          })
        });

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          const realSessionId = sessionData.session?.id || sessionData.sessionId || `demo-${Date.now()}`;
          setSessionId(realSessionId);
          
          if (session) {
            toast.success(`Welcome back! Starting your training session.`);
          } else if (userInfo) {
            toast.success(`Welcome ${userInfo.name}! Starting your personalized demo session.`);
          }
          
          console.log('✅ Session created:', realSessionId);
        } else {
          // Fallback to demo session if backend fails
          const demoSessionId = `demo-session-${Date.now()}`;
          setSessionId(demoSessionId);
          console.warn('⚠️ Using demo session ID:', demoSessionId);
          toast('Starting demo session...', { icon: '🎭' });
        }
      } catch (createError) {
        // Fallback to demo session
        const demoSessionId = `demo-session-${Date.now()}`;
        setSessionId(demoSessionId);
        console.warn('⚠️ Session creation failed, using demo:', createError);
      }
      
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create training session');
      setIsCreatingSession(false);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleSessionEnd = async (duration: number, transcript?: any[]) => {
    if (!sessionId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const minutes = Math.ceil(duration / 60);
      console.log(`📊 Session ended: ${sessionId}, Duration: ${duration}s (${minutes} min)`);

      if (!session) {
        // Demo mode - still create a mock session record for analytics
        console.log('📋 Demo session completed - creating mock analytics');
        
        // Convert transcript to text for analysis
        const transcriptText = transcript && transcript.length > 0 
          ? transcript.map(msg => `${msg.speaker === 'ai' ? 'AI' : 'You'}: ${msg.content}`).join('\n')
          : '';
          
        console.log('📝 Demo session transcript:', transcriptText.length, 'characters');
        
        // Store demo session data in localStorage for dashboard demo
        const demoSession = {
          id: sessionId,
          title: 'Demo Voice Training Session',
          duration: duration,
          minutes: minutes,
          score: Math.round((Math.random() * 2 + 3.5) * 10) / 10, // 3.5-5.0 random score
          date: new Date().toISOString(),
          status: 'completed',
          improvement: Math.round((Math.random() * 0.5 + 0.1) * 10) / 10, // 0.1-0.6
          feedback: 'Great job in this demo session! Your opening was confident and you handled the mock objections well. In a real session, you would get detailed AI-powered feedback.',
          topics: ['Opening Pitch', 'Product Demo', 'Objection Handling'],
          transcript: transcriptText // ← Add real transcript!
        };
        
        // Store in localStorage for dashboard to show
        const existingSessions = JSON.parse(localStorage.getItem('demo-sessions') || '[]');
        existingSessions.unshift(demoSession); // Add to beginning
        localStorage.setItem('demo-sessions', JSON.stringify(existingSessions.slice(0, 10))); // Keep only last 10
        
        toast.success(`🎉 Demo session completed! Duration: ${minutes} minutes`);
        
        // Redirect to dashboard to see the "analytics"
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
        
        return;
      }

      // REAL USER SESSION - Save to database
      console.log('💾 Saving real session to database...');
      
      // Convert transcript to text for database storage
      const transcriptText = transcript && transcript.length > 0 
        ? transcript.map(msg => `${msg.speaker === 'ai' ? 'AI' : 'You'}: ${msg.content}`).join('\n')
        : '';
      
      console.log('📝 Real session transcript:', transcriptText.length, 'characters');
      
      const endResponse = await fetch('/api/session/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          session_id: sessionId,
          duration_seconds: duration,
          transcript: transcriptText, // ← Add real transcript!
          // Additional session data can be added here
          audio_quality: { sample_rate: 44100, bitrate: 128 },
          transcript_summary: transcriptText ? 'Voice training session with transcript' : 'Voice training session completed successfully'
        })
      });

      if (!endResponse.ok) {
        const error = await endResponse.json();
        console.error('❌ Failed to save session:', error);
        throw new Error(error.error || 'Failed to end session');
      }

      const sessionData = await endResponse.json();
      console.log('✅ Session saved to database:', sessionData);
      
      toast.success(`🎉 Session completed! Used ${sessionData.session?.minutes_used || minutes} minutes`);
      
      // Redirect to session results page (which will show detailed analytics)
      setTimeout(() => {
        router.push(`/session/${sessionId}/results`);
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error ending session:', error);
      
      // Even if there's an error, try to redirect to dashboard for some feedback
      toast.error('Session ended but there was an issue saving data');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  };

  if (isCreatingSession) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Setting up your training session...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to AI trainer...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Failed to create session</p>
          <button
            onClick={createNewSession}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <VoiceSessionInterface 
      sessionId={sessionId} 
      onSessionEnd={handleSessionEnd}
    />
  );
}
