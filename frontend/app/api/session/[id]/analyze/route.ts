import { NextRequest, NextResponse } from 'next/server';

interface AnalysisRequest {
  transcript: string[];
  sessionId: string;
  userId: string;
}

// Mock GPT-4o analysis response
const mockAnalysisResult = {
  overall_score: 4.2,
  feedback: "Great improvement in confidence and clarity. Your opening was strong and you maintained good energy throughout the call.",
  metrics: {
    confidence: 85,
    clarity: 78, 
    pace: 72,
    engagement: 88
  },
  analysis: {
    strengths: [
      "Strong opening with name and company",
      "Acknowledged the prospect's time constraints",
      "Used a problem-focused approach"
    ],
    improvements: [
      "Could have been more specific about the value proposition",
      "Missed opportunity to ask qualifying questions earlier", 
      "Voice pace could be slightly slower for better clarity"
    ],
    recommendations: [
      "Practice the elevator pitch for more concise value delivery",
      "Prepare 2-3 open-ended qualifying questions",
      "Record yourself to monitor speaking pace and clarity"
    ]
  },
  detailed_insights: {
    opening_effectiveness: 4.5,
    rapport_building: 3.8,
    needs_discovery: 3.2,
    value_presentation: 3.9,
    objection_handling: 4.0,
    closing_attempt: 3.5
  },
  improvement_trend: "+0.3 from last session",
  next_focus_areas: ["needs_discovery", "closing_techniques"]
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await request.json();
    
    // In production: Verify auth and get user context
    /*
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }
    */

    // Validate request body
    if (!body.transcript || !Array.isArray(body.transcript)) {
      return NextResponse.json(
        { error: 'Transcript is required and must be an array' },
        { status: 400 }
      );
    }

    // Demo mode: Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In production: Send to OpenAI GPT-4o for analysis
    /*
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert sales trainer analyzing a sales conversation. 
                     Provide detailed feedback on performance, strengths, areas for improvement, 
                     and specific recommendations. Focus on: opening, rapport building, 
                     needs discovery, value proposition, objection handling, and closing.
                     
                     Return analysis in this exact JSON format: ${JSON.stringify(mockAnalysisResult)}`
          },
          {
            role: 'user', 
            content: `Analyze this sales conversation transcript: ${body.transcript.join('\n')}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI analysis failed');
    }

    const aiResult = await openaiResponse.json();
    const analysis = JSON.parse(aiResult.choices[0].message.content);
    */

    // Demo mode: Return mock analysis
    const analysis = {
      ...mockAnalysisResult,
      session_id: sessionId,
      analyzed_at: new Date().toISOString(),
      transcript_length: body.transcript.length,
      processing_time: "1.2s"
    };

    // In production: Save analysis to Supabase salesai_analysis_results table
    /*
    const { error } = await supabase
      .from('salesai_analysis_results')
      .insert({
        session_id: sessionId,
        user_id: body.userId,
        analysis_data: analysis,
        overall_score: analysis.overall_score,
        created_at: new Date().toISOString()
      });
    */

    return NextResponse.json({
      success: true,
      analysis: analysis,
      message: 'Demo analysis completed. In production, this would use OpenAI GPT-4o and save to database.'
    });

  } catch (error) {
    console.error('Session analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze session' },
      { status: 500 }
    );
  }
}
