export interface Comment {
  id: string
  blog_post_id: string
  parent_comment_id?: string
  author_name: string
  author_email: string
  author_website?: string
  content: string
  is_approved: boolean
  is_admin_reply: boolean
  created_at: string
  updated_at: string
  replies?: Comment[]
}

export interface CommentFormData {
  author_name: string
  author_email: string
  author_website: string
  content: string
}

export interface CommentSectionProps {
  blogPostId: string
} 