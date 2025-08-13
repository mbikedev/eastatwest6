// Cache policy configurations for different asset types

export const CACHE_POLICIES = {
  // Immutable assets that never change (1 year)
  IMMUTABLE: 'public, max-age=31536000, immutable',
  
  // Long-term caching for static assets (6 months)
  LONG_TERM: 'public, max-age=15768000',
  
  // Medium-term caching for assets that might change (30 days)
  MEDIUM_TERM: 'public, max-age=2592000',
  
  // Short-term caching for dynamic content (5 minutes)
  SHORT_TERM: 'public, max-age=300',
  
  // No caching for sensitive/dynamic data
  NO_CACHE: 'private, no-cache, no-store, max-age=0, must-revalidate',
} as const;

export const ASSET_CACHE_RULES = [
  // Next.js generated assets (with content hashes) - immutable
  {
    pattern: /^\/_next\/static\//,
    policy: CACHE_POLICIES.IMMUTABLE,
    description: 'Next.js static assets with content hashes'
  },
  
  // Restaurant Guru assets (the specific asset from performance audit)
  {
    pattern: /^\/assets\/restaurant-guru\//,
    policy: CACHE_POLICIES.IMMUTABLE,
    description: 'Restaurant Guru badge assets'
  },
  
  // SVG files (usually don't change often)
  {
    pattern: /\.svg$/,
    policy: CACHE_POLICIES.IMMUTABLE,
    description: 'SVG vector graphics'
  },
  
  // Font files (rarely change)
  {
    pattern: /\.(woff|woff2|ttf|eot)$/,
    policy: CACHE_POLICIES.IMMUTABLE,
    description: 'Web font files'
  },
  
  // Images and media files
  {
    pattern: /\.(jpg|jpeg|png|gif|webp|avif|mp4|webm)$/,
    policy: CACHE_POLICIES.LONG_TERM,
    description: 'Image and video files'
  },
  
  // PDF files (might be updated occasionally)
  {
    pattern: /\.pdf$/,
    policy: CACHE_POLICIES.MEDIUM_TERM,
    description: 'PDF documents'
  },
  
  // CSS and JS files in assets directory
  {
    pattern: /^\/assets\/.*\.(css|js)$/,
    policy: CACHE_POLICIES.LONG_TERM,
    description: 'Static CSS and JavaScript files'
  }
];

export function getCachePolicy(pathname: string): string | null {
  for (const rule of ASSET_CACHE_RULES) {
    if (rule.pattern.test(pathname)) {
      return rule.policy;
    }
  }
  return null;
}

export function shouldCache(pathname: string): boolean {
  return getCachePolicy(pathname) !== null;
}

// Generate cache headers with additional metadata
export function generateCacheHeaders(pathname: string) {
  const policy = getCachePolicy(pathname);
  if (!policy) return {};
  
  const headers: Record<string, string> = {
    'Cache-Control': policy,
    'Vary': 'Accept-Encoding',
  };
  
  // Add ETag for better cache validation
  if (policy.includes('immutable')) {
    headers['ETag'] = `"${Buffer.from(pathname).toString('base64')}"`;
  }
  
  // Add content type for SVGs
  if (pathname.endsWith('.svg')) {
    headers['Content-Type'] = 'image/svg+xml';
  }
  
  return headers;
}