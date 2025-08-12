export function checkSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not configured');
    return false;
  }
  
  if (!key) {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured');
    return false;
  }
  
  if (!url.startsWith('https://')) {
    console.error('NEXT_PUBLIC_SUPABASE_URL should start with https://');
    return false;
  }
  
  if (key.length < 20) {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)');
    return false;
  }
  
  return true;
}

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    isConfigured: checkSupabaseConfig()
  };
}

// Debug function to help troubleshoot
export function debugSupabaseConfig() {
  const config = getSupabaseConfig();
  console.log('🔍 Supabase Configuration Debug:');
  console.log('URL exists:', !!config.url);
  console.log('Key exists:', !!config.key);
  console.log('URL starts with https:', config.url?.startsWith('https://'));
  console.log('Key length:', config.key?.length);
  console.log('Is configured:', config.isConfigured);
  
  if (!config.isConfigured) {
    console.log('❌ Supabase is not properly configured');
    console.log('📝 Please check your .env.local file');
  } else {
    console.log('✅ Supabase appears to be configured correctly');
  }
  
  return config;
} 