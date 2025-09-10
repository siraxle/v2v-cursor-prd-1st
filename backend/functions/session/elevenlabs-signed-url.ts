// Simplified real ElevenLabs integration for demo purposes
// Based on official ElevenLabs example implementation

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Use environment variables directly for demo
    const XI_API_KEY = process.env.ELEVENLABS_API_KEY;
    const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
    
    if (!XI_API_KEY) {
      console.error('❌ ELEVENLABS_API_KEY not found in environment');
      return new Response(JSON.stringify({ 
        error: 'ElevenLabs API key not configured',
        message: 'Please set ELEVENLABS_API_KEY environment variable'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!AGENT_ID) {
      console.error('❌ ELEVENLABS_AGENT_ID not found in environment');
      return new Response(JSON.stringify({ 
        error: 'ElevenLabs agent not configured',
        message: 'Please set ELEVENLABS_AGENT_ID environment variable'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('🔄 Requesting signed URL from ElevenLabs...');
    
    // Request signed URL from ElevenLabs API (matching the example exactly)
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${AGENT_ID}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': XI_API_KEY
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ElevenLabs API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return new Response(JSON.stringify({ 
        error: 'Failed to get signed URL from ElevenLabs',
        status: response.status,
        details: process.env.NODE_ENV === 'development' ? errorText : undefined
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    console.log('✅ ElevenLabs signed URL obtained successfully');

    return new Response(JSON.stringify({ 
      signedUrl: data.signed_url,
      agentId: AGENT_ID
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ ElevenLabs signed URL error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
