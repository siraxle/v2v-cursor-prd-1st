'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Check, 
  ArrowLeft, 
  Mic, 
  BarChart3, 
  Users, 
  Zap,
  Crown,
  Building
} from 'lucide-react';

const pricingPlans = [
  {
    name: 'Starter',
    price: 29,
    period: 'month',
    description: 'Perfect for individual sales professionals getting started',
    features: [
      '100 minutes of AI training per month',
      '5 training sessions per day',
      'Basic performance analytics',
      'Voice analysis and feedback',
      'Email support',
      'Mobile app access'
    ],
    limitations: [
      'No team features',
      'Standard AI models only',
      'Basic reporting'
    ],
    popular: false,
    ctaText: 'Start Free Trial',
    ctaLink: '/register?plan=starter'
  },
  {
    name: 'Professional',
    price: 79,
    period: 'month',
    description: 'For serious sales professionals who want advanced features',
    features: [
      '500 minutes of AI training per month',
      'Unlimited training sessions',
      'Advanced performance analytics',
      'Custom AI scenarios and objections',
      'Detailed conversation analysis',
      'Priority email support',
      'Advanced voice metrics',
      'Export session recordings',
      'Performance trending',
      'Integration with CRM systems'
    ],
    limitations: [],
    popular: true,
    ctaText: 'Start Free Trial',
    ctaLink: '/register?plan=professional'
  },
  {
    name: 'Team',
    price: 149,
    period: 'month',
    description: 'For sales teams and managers who need collaboration features',
    features: [
      '1,500 minutes shared across team',
      'Up to 10 team members',
      'Team performance dashboard',
      'Manager oversight and reporting',
      'Custom training scenarios',
      'Team leaderboards and goals',
      'Advanced analytics and insights',
      'Priority phone & email support',
      'Custom integrations',
      'Bulk user management',
      'Role-based permissions'
    ],
    limitations: [],
    popular: false,
    ctaText: 'Contact Sales',
    ctaLink: '/contact?plan=team'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large organizations with custom requirements',
    features: [
      'Unlimited training minutes',
      'Unlimited team members',
      'Custom AI model training',
      'White-label solution available',
      'Advanced security & compliance',
      'Dedicated customer success manager',
      'Custom integrations & API access',
      'Advanced reporting & analytics',
      'On-premise deployment options',
      'SLA guarantees',
      'Custom training content',
      '24/7 phone support'
    ],
    limitations: [],
    popular: false,
    ctaText: 'Contact Sales',
    ctaLink: '/contact?plan=enterprise'
  }
];

const faqs = [
  {
    question: 'How does the AI voice training work?',
    answer: 'Our AI uses advanced conversational AI technology from ElevenLabs to simulate real sales conversations. The AI responds naturally to your voice, presents realistic objections, and provides detailed feedback on your performance including tone, pace, and conversation structure.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period, and you won\'t be charged for the next cycle.'
  },
  {
    question: 'What happens to my unused minutes?',
    answer: 'Unused minutes do not roll over to the next month. However, if you upgrade your plan mid-cycle, you\'ll get immediate access to your new minute allocation.'
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes! All paid plans come with a 14-day free trial. You can explore all features without any commitment. No credit card required to start.'
  },
  {
    question: 'How accurate is the AI feedback?',
    answer: 'Our AI is trained on thousands of successful sales conversations and uses advanced natural language processing to analyze your performance. The feedback focuses on proven sales techniques and communication best practices.'
  },
  {
    question: 'Can I integrate with my existing CRM?',
    answer: 'Professional and higher plans include integrations with popular CRM systems like Salesforce, HubSpot, and Pipedrive. This allows you to track your training progress alongside your actual sales performance.'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Sales AI Trainer</span>
            </div>
            <Link 
              href="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Choose Your Training Plan
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Start improving your sales conversations today with AI-powered voice training and real-time feedback.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full mb-8"
          >
            <Zap className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">14-day free trial • No credit card required</span>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                  plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      <Crown className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    {plan.price === 'Custom' ? (
                      <span className="text-3xl font-bold text-gray-900">Custom</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600 ml-1">/{plan.period}</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaLink}
                  className={`w-full block text-center py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plan.ctaText}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Sales AI Trainer?
            </h2>
            <p className="text-xl text-gray-600">
              Advanced AI technology meets proven sales methodology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Natural Conversations</h3>
              <p className="text-gray-600">
                Practice with AI that responds naturally, presents realistic objections, and adapts to your conversation style.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Analytics</h3>
              <p className="text-gray-600">
                Get comprehensive feedback on your tone, pace, confidence level, and conversation structure with actionable insights.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Team Collaboration</h3>
              <p className="text-gray-600">
                Share best practices, compete in team challenges, and track progress across your entire sales organization.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Sales Performance?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of sales professionals who are already improving their skills with AI-powered training.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?plan=professional"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/session"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Try Demo First
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
