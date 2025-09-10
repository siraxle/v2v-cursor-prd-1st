'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle,
  AlertTriangle,
  Award,
  FileText,
  Printer,
  Loader
} from 'lucide-react';
import { useParams } from 'next/navigation';

interface DetailedSessionAnalysis {
  id: string;
  title: string;
  duration: number;
  overallScore: number;
  date: Date;
  
  // Core analysis
  strengths: string[];
  areasForImprovement: string[];
  
  // Sales techniques analysis
  effectiveTechniques: string[];
  techniquesNeedingWork: string[];
  
  // Specific analysis areas
  objectionHandling: {
    score: number;
    analysis: string;
  };
  
  closingEffectiveness: {
    score: number;
    analysis: string;
  };
  
  // Key recommendations
  keyRecommendations: string[];
  
  // Detailed analysis
  detailedAnalysis: string;
}

export default function SessionResultsPage() {
  const params = useParams();
  const sessionId = params.id as string;
  
  const [sessionAnalysis, setSessionAnalysis] = useState<DetailedSessionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const loadSessionAnalysis = async () => {
      try {
        setIsLoading(true);
        
        // Get demo user data if available for personalization
        const demoUser = JSON.parse(localStorage.getItem('demo-user') || '{}');
        
        // Try to get real session data from localStorage or API
        const demoSessions = JSON.parse(localStorage.getItem('demo-sessions') || '[]');
        const currentSession = demoSessions.find((session: any) => session.id === sessionId);
        
        // Prepare analysis request
        const analysisData = {
          sessionId,
          transcript: currentSession?.transcript || '',
          duration: currentSession?.duration || 0,
          userInfo: demoUser.name ? {
            name: demoUser.name,
            company: demoUser.company || 'Demo Company',
            role: demoUser.role || 'Sales Representative'
          } : undefined
        };

        // Call analysis API
        const response = await fetch('/api/session/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(analysisData)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analysis');
        }

        const result = await response.json();
        setSessionAnalysis(result.analysis);
        setIsDemo(result.isDemo);
        
      } catch (error) {
        console.error('Error loading session analysis:', error);
        
        // Fallback to basic analysis if API fails
        setSessionAnalysis({
          id: sessionId,
          title: 'Voice Training Session Analysis',
          duration: 15,
          overallScore: 6,
          date: new Date(),
          strengths: [
            'Maintained professional demeanor throughout',
            'Showed good product knowledge',
            'Asked relevant questions'
          ],
          areasForImprovement: [
            'Could improve active listening',
            'More specific value propositions needed',
            'Better objection handling required'
          ],
          effectiveTechniques: [
            'Professional introduction',
            'Question-based approach'
          ],
          techniquesNeedingWork: [
            'Needs discovery',
            'Closing techniques',
            'Follow-up planning'
          ],
          objectionHandling: {
            score: 5,
            analysis: 'Basic objection handling was attempted but could be more systematic.'
          },
          closingEffectiveness: {
            score: 4,
            analysis: 'Limited closing attempts were made during the conversation.'
          },
          keyRecommendations: [
            'Practice active listening techniques',
            'Develop stronger value propositions',
            'Improve objection handling framework',
            'Focus on clear next steps'
          ],
          detailedAnalysis: 'This session showed promise with good foundational skills. Focus on developing more structured sales methodology and practicing specific scenarios to improve overall effectiveness.'
        });
        setIsDemo(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      loadSessionAnalysis();
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Analyzing your session...</p>
          <p className="text-sm text-gray-500 mt-2">AI is processing your conversation data</p>
        </div>
      </div>
    );
  }

  if (!sessionAnalysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Not Available</h2>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-50';
    if (score >= 6) return 'bg-blue-50';
    if (score >= 4) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Performance Analysis</h1>
            <p className="text-gray-600 mb-6">Detailed feedback on your conversation with AI-powered insights</p>
            
            {/* Demo mode indicator */}
            {isDemo && (
              <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-4">
                🎭 Demo Analysis - Sign up for real AI-powered insights
              </div>
            )}
            
            {/* Overall Score */}
            <div className={`inline-block px-8 py-6 rounded-2xl ${getScoreBgColor(sessionAnalysis.overallScore)} mb-4`}>
              <div className={`text-6xl font-bold ${getScoreColor(sessionAnalysis.overallScore)} mb-2`}>
                {sessionAnalysis.overallScore}/10
              </div>
              <div className="text-gray-700 font-medium">Overall Performance Score</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Strengths & Areas for Improvement */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6"
          >
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-bold text-green-800">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {sessionAnalysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start text-green-700">
                  <span className="text-green-500 mr-3 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Areas for Improvement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6"
          >
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-xl font-bold text-red-800">Areas for Improvement</h3>
            </div>
            <ul className="space-y-3">
              {sessionAnalysis.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start text-red-700">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Sales Techniques Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Sales Techniques Analysis</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Effective Techniques */}
            <div>
              <h4 className="font-semibold text-green-700 mb-4">Effective Techniques Used</h4>
              <div className="space-y-2">
                {sessionAnalysis.effectiveTechniques.map((technique, index) => (
                  <div key={index} className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-3" />
                    <span className="text-gray-700">{technique}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Techniques Needing Work */}
            <div>
              <h4 className="font-semibold text-red-700 mb-4">Techniques Needing Work</h4>
              <div className="space-y-2">
                {sessionAnalysis.techniquesNeedingWork.map((technique, index) => (
                  <div key={index} className="flex items-center text-red-600">
                    <AlertTriangle className="w-4 h-4 mr-3" />
                    <span className="text-gray-700">{technique}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Specific Analysis Areas */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Objection Handling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-blue-800 mb-4">Objection Handling</h3>
            <p className="text-blue-700 mb-4 leading-relaxed">
              {sessionAnalysis.objectionHandling.analysis}
            </p>
            <div className="text-sm text-blue-600">
              <strong>Score: {sessionAnalysis.objectionHandling.score}/10</strong>
            </div>
          </motion.div>

          {/* Closing Effectiveness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-purple-50 border border-purple-200 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-purple-800 mb-4">Closing Effectiveness</h3>
            <p className="text-purple-700 mb-4 leading-relaxed">
              {sessionAnalysis.closingEffectiveness.analysis}
            </p>
            <div className="text-sm text-purple-600">
              <strong>Score: {sessionAnalysis.closingEffectiveness.score}/10</strong>
            </div>
          </motion.div>
        </div>

        {/* Key Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
        >
          <div className="flex items-center mb-6">
            <Award className="w-6 h-6 text-yellow-600 mr-3" />
            <h3 className="text-xl font-bold text-yellow-800">Key Recommendations</h3>
          </div>
          
          <div className="space-y-4">
            {sessionAnalysis.keyRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-yellow-800 leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-gray-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Detailed Analysis</h3>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              {sessionAnalysis.detailedAnalysis}
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/session"
            className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center text-lg"
          >
            Start New Session
          </Link>
          
          <button
            onClick={() => window.print()}
            className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center text-lg"
          >
            <Printer className="w-5 h-5 mr-2" />
            Print Report
          </button>
        </motion.div>
      </div>
    </div>
  );
}
