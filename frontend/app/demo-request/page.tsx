'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, ArrowLeft, User, Mail, Building, Users, Phone, Target } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DemoRequestForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  teamSize: string;
  primaryGoal: string;
  currentChallenges: string[];
  heardAboutUs: string;
}

const roleOptions = [
  'Sales Representative',
  'Sales Manager', 
  'Sales Director',
  'VP of Sales',
  'Business Development',
  'Account Executive',
  'Sales Trainer',
  'Other'
];

const teamSizeOptions = [
  'Just me (1)',
  'Small team (2-10)',
  'Medium team (11-50)', 
  'Large team (51-200)',
  'Enterprise (200+)'
];

const goalOptions = [
  'Improve objection handling',
  'Better conversation confidence',
  'Increase close rates',
  'Reduce ramp time for new hires',
  'Standardize sales processes',
  'Track team performance',
  'Practice specific scenarios',
  'General sales skills improvement'
];

const challengeOptions = [
  'Inconsistent messaging across team',
  'Long ramp time for new hires',
  'Handling difficult objections',
  'Lack of practice opportunities',
  'No feedback on conversations',
  'Low confidence in calls',
  'Difficulty with discovery questions',
  'Poor closing techniques'
];

export default function DemoRequestPage() {
  const [formData, setFormData] = useState<DemoRequestForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    teamSize: '',
    primaryGoal: '',
    currentChallenges: [],
    heardAboutUs: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<DemoRequestForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<DemoRequestForm> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.role) newErrors.role = 'Please select your role';
    if (!formData.teamSize) newErrors.teamSize = 'Please select your team size';
    if (!formData.primaryGoal) newErrors.primaryGoal = 'Please select your primary goal';

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
      // In production: Send to lead capture API
      /*
      const response = await fetch('/api/leads/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      */
      
      // Demo mode: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user data in localStorage for personalized demo experience
      localStorage.setItem('demo-user', JSON.stringify({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company: formData.company,
        role: formData.role,
        teamSize: formData.teamSize,
        goal: formData.primaryGoal,
        challenges: formData.currentChallenges
      }));
      
      toast.success('Thank you! Your personalized demo is ready.');
      
      // Redirect to demo session with personalized experience
      setTimeout(() => {
        window.location.href = '/session?source=demo-request&personalized=true';
      }, 1500);
      
    } catch (error) {
      console.error('Demo request error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof DemoRequestForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleChallengeChange = (challenge: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      currentChallenges: checked 
        ? [...prev.currentChallenges, challenge]
        : prev.currentChallenges.filter(c => c !== challenge)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Demo request card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Bot className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Sales AI Trainer</h1>
          </div>

          {/* Form title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Get Your Personalized Demo</h2>
            <p className="text-gray-600">
              Tell us about your sales challenges and we'll customize a demo experience just for you.
            </p>
            <div className="mt-4 inline-flex items-center bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm">
              <Target className="w-4 h-4 mr-2" />
              Takes 2 minutes • Instant access
            </div>
          </div>

          {/* Demo request form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
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
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Company info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.company ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your Company"
                  />
                </div>
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Role *
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your role</option>
                  {roleOptions.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>
            </div>

            {/* Team size */}
            <div>
              <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">
                Sales Team Size *
              </label>
              <div className="relative">
                <Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  id="teamSize"
                  value={formData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.teamSize ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select team size</option>
                  {teamSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              {errors.teamSize && (
                <p className="mt-1 text-sm text-red-600">{errors.teamSize}</p>
              )}
            </div>

            {/* Primary goal */}
            <div>
              <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-700 mb-3">
                Primary Goal for AI Sales Training *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map(goal => (
                  <label key={goal} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="primaryGoal"
                      value={goal}
                      checked={formData.primaryGoal === goal}
                      onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
              {errors.primaryGoal && (
                <p className="mt-1 text-sm text-red-600">{errors.primaryGoal}</p>
              )}
            </div>

            {/* Current challenges */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Sales Challenges (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {challengeOptions.map(challenge => (
                  <label key={challenge} className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.currentChallenges.includes(challenge)}
                      onChange={(e) => handleChallengeChange(challenge, e.target.checked)}
                      className="mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{challenge}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* How did you hear about us */}
            <div>
              <label htmlFor="heardAboutUs" className="block text-sm font-medium text-gray-700 mb-2">
                How did you hear about us?
              </label>
              <select
                id="heardAboutUs"
                value={formData.heardAboutUs}
                onChange={(e) => handleInputChange('heardAboutUs', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Please select</option>
                <option value="google">Google Search</option>
                <option value="social">Social Media</option>
                <option value="referral">Friend/Colleague Referral</option>
                <option value="linkedin">LinkedIn</option>
                <option value="podcast">Podcast</option>
                <option value="blog">Blog/Article</option>
                <option value="event">Conference/Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Privacy notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
              By submitting this form, you agree to receive communications about Sales AI Trainer. 
              We respect your privacy and will never share your information with third parties.
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
              {isSubmitting ? 'Preparing Your Demo...' : 'Get My Personalized Demo'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
