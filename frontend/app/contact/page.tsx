'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Bot, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MessageSquare, 
  Building,
  Users,
  Zap,
  Calendar,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  teamSize: string;
  plan: string;
  message: string;
  urgency: string;
  budget: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    teamSize: '',
    plan: '',
    message: '',
    urgency: '',
    budget: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});

  // Get plan from URL params if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    if (planParam) {
      setFormData(prev => ({ ...prev, plan: planParam }));
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.teamSize) newErrors.teamSize = 'Team size is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // In production: Send to sales team API
      /*
      const response = await fetch('/api/sales/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      */
      
      // Demo mode: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Thank you! Our sales team will contact you within 24 hours.');
      
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        role: '',
        teamSize: '',
        plan: '',
        message: '',
        urgency: '',
        budget: ''
      });
      
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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
              href="/pricing" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Link>
          </div>
        </div>
      </header>

      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  Let's Talk About Your Sales Training Needs
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Ready to transform your sales team's performance? Our experts are here to help you find the perfect solution.
                </p>
              </div>

              {/* Contact methods */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Us</h3>
                    <p className="text-gray-600">sales@salesaitrainer.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Call Us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Schedule a Demo</h3>
                    <p className="text-gray-600">Book a personalized walkthrough</p>
                  </div>
                </div>
              </div>

              {/* Response time info */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Email inquiries: Within 4 hours</li>
                      <li>• Enterprise demos: Same day scheduling</li>
                      <li>• Phone calls: Within 24 hours</li>
                      <li>• Urgent requests: Contact directly at sales@salesaitrainer.com</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Send us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and our sales team will get back to you quickly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@company.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Company info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.company ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your Company"
                    />
                    {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Role *
                    </label>
                    <input
                      type="text"
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.role ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Sales Manager"
                    />
                    {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                  </div>
                </div>

                {/* Team size and plan */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">
                      Team Size *
                    </label>
                    <select
                      id="teamSize"
                      value={formData.teamSize}
                      onChange={(e) => handleInputChange('teamSize', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.teamSize ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select team size</option>
                      <option value="5-10">5-10 people</option>
                      <option value="10-25">10-25 people</option>
                      <option value="25-50">25-50 people</option>
                      <option value="50-100">50-100 people</option>
                      <option value="100+">100+ people</option>
                    </select>
                    {errors.teamSize && <p className="mt-1 text-sm text-red-600">{errors.teamSize}</p>}
                  </div>

                  <div>
                    <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
                      Interested Plan
                    </label>
                    <select
                      id="plan"
                      value={formData.plan}
                      onChange={(e) => handleInputChange('plan', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select a plan</option>
                      <option value="team">Team Plan ($149/month)</option>
                      <option value="enterprise">Enterprise Plan (Custom)</option>
                      <option value="not-sure">Not sure yet</option>
                    </select>
                  </div>
                </div>

                {/* Budget and urgency */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-500">Under $500/month</option>
                      <option value="500-1500">$500 - $1,500/month</option>
                      <option value="1500-5000">$1,500 - $5,000/month</option>
                      <option value="5000-15000">$5,000 - $15,000/month</option>
                      <option value="15000+">$15,000+/month</option>
                      <option value="discuss">Let's discuss</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline
                    </label>
                    <select
                      id="urgency"
                      value={formData.urgency}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP - Within 1 week</option>
                      <option value="month">Within 1 month</option>
                      <option value="quarter">Within 3 months</option>
                      <option value="exploring">Just exploring options</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your needs *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us about your current sales training challenges, goals, and what you're looking for in a solution..."
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Why Enterprise Teams Choose Us</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Zap className="w-5 h-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Quick Implementation</h4>
                      <p className="text-sm text-gray-600">Get your team training in under 48 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Team Management</h4>
                      <p className="text-sm text-gray-600">Advanced admin controls and reporting</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Building className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Custom Integration</h4>
                      <p className="text-sm text-gray-600">Connect with your existing CRM and tools</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MessageSquare className="w-5 h-5 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Dedicated Support</h4>
                      <p className="text-sm text-gray-600">Personal customer success manager</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-2">
                    {'★'.repeat(5)}
                  </div>
                  <p className="text-gray-700 italic mb-3">
                    "Sales AI Trainer transformed our team's performance. Our close rate increased by 35% in just 3 months."
                  </p>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-gray-600">VP of Sales, TechCorp Inc.</p>
                  </div>
                </div>
              </div>

              {/* Security notice */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border border-gray-200">
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-green-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
                  <div>
                    <strong>Enterprise Security:</strong> SOC 2 compliant, GDPR ready, and enterprise-grade security measures in place.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
