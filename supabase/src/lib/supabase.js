import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xauukbvbcljkpotkness.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhdXVrYnZiY2xqa3BvdGtuZXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTYxMjcsImV4cCI6MjA2NjI3MjEyN30.WaAkCMdkkpLv9sJrXznITKN-Z_KZ0Jp_k6bEy9lnAxY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);