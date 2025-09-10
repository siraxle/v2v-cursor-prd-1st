-- Enable Row Level Security on all tables
ALTER TABLE salesai_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE salesai_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE salesai_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE salesai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE salesai_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE salesai_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE salesai_session_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE salesai_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE salesai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE salesai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE salesai_audit_logs ENABLE ROW LEVEL SECURITY;

-- Companies table policies
CREATE POLICY "Super Admins can see all companies" 
  ON salesai_companies FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Admins can see their own company" 
  ON salesai_companies FOR SELECT
  USING (id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "Super Admins can insert companies" 
  ON salesai_companies FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Super Admins can update companies" 
  ON salesai_companies FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Super Admins can delete companies" 
  ON salesai_companies FOR DELETE
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Profiles table policies
CREATE POLICY "Users can see own profile" 
  ON salesai_profiles FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Admins can see profiles in their company" 
  ON salesai_profiles FOR SELECT
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid 
    AND (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  );

CREATE POLICY "Super Admins can see all profiles" 
  ON salesai_profiles FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Users can update own profile" 
  ON salesai_profiles FOR UPDATE
  USING (auth.uid() = auth_id);

CREATE POLICY "Admins can update profiles in their company" 
  ON salesai_profiles FOR UPDATE
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid 
    AND (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  );

CREATE POLICY "Super Admins can update all profiles" 
  ON salesai_profiles FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- API Keys table policies
CREATE POLICY "Users can see own API keys" 
  ON salesai_api_keys FOR SELECT
  USING (profile_id IN (
    SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can manage own API keys" 
  ON salesai_api_keys FOR INSERT
  WITH CHECK (profile_id IN (
    SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can update own API keys" 
  ON salesai_api_keys FOR UPDATE
  USING (profile_id IN (
    SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can delete own API keys" 
  ON salesai_api_keys FOR DELETE
  USING (profile_id IN (
    SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
  ));

-- Sessions table policies
CREATE POLICY "Users can see own sessions" 
  ON salesai_sessions FOR SELECT
  USING (profile_id IN (
    SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Admins can see sessions in their company" 
  ON salesai_sessions FOR SELECT
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid 
    AND (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  );

CREATE POLICY "Super Admins can see all sessions" 
  ON salesai_sessions FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Users can create sessions" 
  ON salesai_sessions FOR INSERT
  WITH CHECK (profile_id IN (
    SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can update own sessions" 
  ON salesai_sessions FOR UPDATE
  USING (profile_id IN (
    SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
  ));

-- Transcripts table policies
CREATE POLICY "Users can see own transcripts" 
  ON salesai_transcripts FOR SELECT
  USING (session_id IN (
    SELECT id FROM salesai_sessions WHERE profile_id IN (
      SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
    )
  ));

CREATE POLICY "Admins can see transcripts in their company" 
  ON salesai_transcripts FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM salesai_sessions WHERE company_id = (auth.jwt() ->> 'company_id')::uuid
    ) 
    AND (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  );

CREATE POLICY "Super Admins can see all transcripts" 
  ON salesai_transcripts FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Analysis results table policies
CREATE POLICY "Users can see own analysis results" 
  ON salesai_analysis_results FOR SELECT
  USING (session_id IN (
    SELECT id FROM salesai_sessions WHERE profile_id IN (
      SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
    )
  ));

CREATE POLICY "Admins can see analysis results in their company" 
  ON salesai_analysis_results FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM salesai_sessions WHERE company_id = (auth.jwt() ->> 'company_id')::uuid
    ) 
    AND (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  );

CREATE POLICY "Super Admins can see all analysis results" 
  ON salesai_analysis_results FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Session analytics table policies
CREATE POLICY "Users can see own analytics" 
  ON salesai_session_analytics FOR SELECT
  USING (profile_id IN (
    SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Admins can see analytics in their company" 
  ON salesai_session_analytics FOR SELECT
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid 
    AND (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  );

CREATE POLICY "Super Admins can see all analytics" 
  ON salesai_session_analytics FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Subscriptions table policies
CREATE POLICY "Users can see own subscriptions" 
  ON salesai_subscriptions FOR SELECT
  USING (profile_id IN (
    SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Admins can see subscriptions in their company" 
  ON salesai_subscriptions FOR SELECT
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid 
    AND (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  );

CREATE POLICY "Super Admins can see all subscriptions" 
  ON salesai_subscriptions FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Super Admins can manage subscriptions" 
  ON salesai_subscriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Usage table policies
CREATE POLICY "Users can see own usage" 
  ON salesai_usage FOR SELECT
  USING (profile_id IN (
    SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Admins can see usage in their company" 
  ON salesai_usage FOR SELECT
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid 
    AND (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  );

CREATE POLICY "Super Admins can see all usage" 
  ON salesai_usage FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Feedback table policies
CREATE POLICY "Users can manage own feedback" 
  ON salesai_feedback FOR ALL
  USING (profile_id IN (
    SELECT id FROM salesai_profiles WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Admins can see feedback in their company" 
  ON salesai_feedback FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM salesai_profiles WHERE company_id = (auth.jwt() ->> 'company_id')::uuid
    ) 
    AND (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  );

CREATE POLICY "Super Admins can see all feedback" 
  ON salesai_feedback FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Audit logs table policies
CREATE POLICY "Super Admins can see all audit logs" 
  ON salesai_audit_logs FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Admins can see audit logs for their company" 
  ON salesai_audit_logs FOR SELECT
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid 
    AND (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  );

-- GDPR Data Deletion Function
CREATE OR REPLACE FUNCTION salesai_gdpr_delete_user_data(user_auth_id UUID)
RETURNS void AS $$
DECLARE
  user_profile_id UUID;
BEGIN
  -- Get the profile ID
  SELECT id INTO user_profile_id FROM salesai_profiles WHERE auth_id = user_auth_id;
  
  -- Delete related data
  DELETE FROM salesai_api_keys WHERE profile_id = user_profile_id;
  DELETE FROM salesai_feedback WHERE profile_id = user_profile_id;
  DELETE FROM salesai_usage WHERE profile_id = user_profile_id;
  DELETE FROM salesai_subscriptions WHERE profile_id = user_profile_id;
  
  -- Anonymize transcripts
  UPDATE salesai_transcripts
  SET 
    content = '[ANONYMIZED BY USER REQUEST]',
    structured_content = jsonb_build_object('anonymized', true, 'timestamp', now()),
    is_anonymized = true,
    anonymized_at = now()
  WHERE session_id IN (
    SELECT id FROM salesai_sessions WHERE profile_id = user_profile_id
  );
  
  -- Anonymize analysis results
  UPDATE salesai_analysis_results
  SET results = results - 'personal_context' - 'audio_samples'
  WHERE session_id IN (
    SELECT id FROM salesai_sessions WHERE profile_id = user_profile_id
  );
  
  -- Update sessions (remove audio files but keep statistics)
  UPDATE salesai_sessions
  SET 
    audio_file_url = null,
    title = '[ANONYMIZED SESSION]'
  WHERE profile_id = user_profile_id;
  
  -- Finally delete the profile
  DELETE FROM salesai_profiles WHERE id = user_profile_id;
  
  -- Log the deletion
  INSERT INTO salesai_audit_logs (
    user_id,
    event_type,
    resource,
    action,
    details
  ) VALUES (
    user_auth_id,
    'gdpr',
    'profile',
    'delete',
    jsonb_build_object('timestamp', now(), 'reason', 'GDPR request')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
