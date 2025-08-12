export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  author_name: string | null
  cover_image_url: string | null
  tags: string[]
  published: boolean
  featured: boolean
  meta_title: string | null
  meta_description: string | null
  reading_time: number | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface BlogInsert {
  title: string
  slug: string
  excerpt?: string
  content: string
  author_name?: string
  cover_image_url?: string
  tags?: string[]
  published?: boolean
  featured?: boolean
  meta_title?: string
  meta_description?: string
  reading_time?: number
  published_at?: string
}

export interface BlogUpdate {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  author_name?: string
  cover_image_url?: string
  tags?: string[]
  published?: boolean
  featured?: boolean
  meta_title?: string
  meta_description?: string
  reading_time?: number
  published_at?: string
}

export interface BlogListParams {
  limit?: number
  offset?: number
  featured?: boolean
  tags?: string[]
  search?: string
}

export interface BlogMetadata {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
} 