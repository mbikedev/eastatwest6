import { createClient } from '@/utils/supabase/client'
import type { Blog, BlogListParams } from '@/types/blog'
import { SAMPLE_BLOGS } from './sampleBlogs'
import { checkSupabaseConfig } from './envCheck'

// Lazily create Supabase client only when configuration is valid
function getSupabase() {
  return createClient()
}

/**
 * Get language-specific slug pattern
 */
function getLanguageSlugPattern(language: string): string {
  switch (language) {
    case 'fr':
      return '%vegetarien%'
    case 'nl':
      return '%vegetarisch%'
    default:
      return '%vegetarian%'
  }
}

/**
 * Fetch all published blog posts
 */
export async function getBlogPosts(params: BlogListParams = {}, language: string = 'en') {
  const {
    limit = 10,
    offset = 0,
    featured,
    tags,
    search
  } = params

  // Dev fallback if Supabase is not configured
  if (process.env.NODE_ENV !== 'production' && !checkSupabaseConfig()) {
    const {
      limit = 10,
      offset = 0,
      featured,
      tags,
      search
    } = params

    // Language filtering via slug pattern
    const pattern = getLanguageSlugPattern(language).replace(/%/g, '')
    let items = SAMPLE_BLOGS.filter(b => b.slug.includes(pattern))
    if (featured !== undefined) items = items.filter(b => b.featured === featured)
    if (tags && tags.length > 0) items = items.filter(b => b.tags.some(t => tags.includes(t)))
    if (search) {
      const s = search.toLowerCase()
      items = items.filter(b =>
        b.title.toLowerCase().includes(s) || (b.excerpt || '').toLowerCase().includes(s)
      )
    }
    return items.slice(offset, offset + limit)
  }

  const supabase = getSupabase()
  let query = supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  // Filter by language based on slug pattern
  const slugPattern = getLanguageSlugPattern(language)
  query = query.like('slug', slugPattern)

  // Filter by featured status
  if (featured !== undefined) {
    query = query.eq('featured', featured)
  }

  // Filter by tags
  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags)
  }

  // Search in title and excerpt
  if (search) {
    query = query.or(`title.ilike.%${search}%, excerpt.ilike.%${search}%`)
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog posts:', error)
    throw new Error(`Failed to fetch blog posts: ${error.message}`)
  }

  return data as Blog[]
}

/**
 * Fetch a single blog post by slug, with language fallback
 */
export async function getBlogPostBySlug(slug: string, language: string = 'en') {
  if (process.env.NODE_ENV !== 'production' && !checkSupabaseConfig()) {
    const exact = SAMPLE_BLOGS.find(b => b.slug === slug)
    if (exact) return exact
    const pattern = getLanguageSlugPattern(language).replace(/%/g, '')
    return SAMPLE_BLOGS.find(b => b.slug.includes(pattern)) || null
  }
  // First try to get the exact slug
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  // If not found and it's a language-specific request, try to find equivalent in that language
  if (error && error.code === 'PGRST116') {
    // Get the language-specific pattern to search for similar posts
    const languagePattern = getLanguageSlugPattern(language)
    
    const { data: altData, error: altError } = await supabase
      .from('blogs')
      .select('*')
      .like('slug', languagePattern)
      .eq('published', true)
      .single()

    if (!altError) {
      return altData as Blog
    }
  }

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    console.error('Error fetching blog post:', error)
    throw new Error(`Failed to fetch blog post: ${error.message}`)
  }

  return data as Blog
}

/**
 * Fetch featured blog posts for homepage
 */
export async function getFeaturedBlogPosts(limit: number = 3, language: string = 'en') {
  return getBlogPosts({ featured: true, limit }, language)
}

/**
 * Fetch related blog posts based on tags
 */
export async function getRelatedBlogPosts(currentSlug: string, tags: string[], limit: number = 3) {
  if (process.env.NODE_ENV !== 'production' && !checkSupabaseConfig()) {
    return SAMPLE_BLOGS.filter(b => b.slug !== currentSlug && b.tags.some(t => tags.includes(t)))
      .slice(0, limit)
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .neq('slug', currentSlug)
    .overlaps('tags', tags)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching related blog posts:', error)
    return []
  }

  return data as Blog[]
}

/**
 * Get all unique tags from published blog posts for a specific language
 */
export async function getBlogTags(language: string = 'en') {
  if (process.env.NODE_ENV !== 'production' && !checkSupabaseConfig()) {
    const pattern = getLanguageSlugPattern(language).replace(/%/g, '')
    const filtered = SAMPLE_BLOGS.filter(b => b.slug.includes(pattern))
    const tags = filtered.flatMap(b => b.tags || [])
    return [...new Set(tags)].sort()
  }
  // Get the language-specific slug pattern to filter posts
  const slugPattern = getLanguageSlugPattern(language)
  
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('blogs')
    .select('tags')
    .eq('published', true)
    .like('slug', slugPattern)

  if (error) {
    console.error('Error fetching blog tags:', error)
    return []
  }

  // Flatten and deduplicate tags
  const allTags = data.flatMap(blog => blog.tags || [])
  return [...new Set(allTags)].sort()
}

/**
 * Get blog posts count
 */
export async function getBlogPostsCount() {
  if (process.env.NODE_ENV !== 'production' && !checkSupabaseConfig()) {
    return SAMPLE_BLOGS.length
  }
  const supabase = getSupabase()
  const { count, error } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)

  if (error) {
    console.error('Error fetching blog posts count:', error)
    return 0
  }

  return count || 0
}

/**
 * Calculate estimated reading time based on content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Generate excerpt from content if not provided
 */
export function generateExcerpt(content: string, length: number = 200): string {
  // Remove markdown syntax and HTML tags
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim()

  if (plainText.length <= length) {
    return plainText
  }

  return plainText.substring(0, length).replace(/\s+\S*$/, '') + '...'
}

/**
 * Format date for display
 */
export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Generate SEO-friendly URL slug from title
 */
export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
} 