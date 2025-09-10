import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Admin client with full access
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Table names with salesai_ prefix
export const TABLES = {
  COMPANIES: 'salesai_companies',
  PROFILES: 'salesai_profiles',
  API_KEYS: 'salesai_api_keys',
  SESSIONS: 'salesai_sessions',
  TRANSCRIPTS: 'salesai_transcripts',
  ANALYSIS_RESULTS: 'salesai_analysis_results',
  SESSION_ANALYTICS: 'salesai_session_analytics',
  SUBSCRIPTIONS: 'salesai_subscriptions',
  USAGE: 'salesai_usage',
  FEEDBACK: 'salesai_feedback',
  AUDIT_LOGS: 'salesai_audit_logs'
};

export type Profile = {
  id: string;
  auth_id: string;
  company_id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  phone?: string;
  team_size?: number;
  role: 'user' | 'admin' | 'super_admin';
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type Session = {
  id: string;
  profile_id: string;
  company_id?: string;
  title: string;
  status: 'active' | 'completed' | 'analyzed' | 'archived';
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
  audio_quality?: Record<string, any>;
  audio_file_url?: string;
  audio_file_size?: number;
  minute_cost?: number;
  processing_status: string;
  analytics_summary?: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type ApiKey = {
  id: string;
  profile_id: string;
  service: string;
  encrypted_key: string;
  key_hash: string;
  created_at: string;
  last_used?: string;
  is_active: boolean;
};

export type Subscription = {
  id: string;
  profile_id: string;
  company_id?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  minutes_limit: number;
  minutes_used: number;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
  canceled_at?: string;
};
