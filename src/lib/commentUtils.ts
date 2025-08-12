import { supabase } from './supabaseClient'
import type { Comment } from '../types/comments'

/**
 * Fetch all comments for a specific blog post
 */
export const fetchComments = async (blogPostId: string, includeUnapproved = false): Promise<Comment[]> => {
  try {
    let query = supabase
      .from('comments')
      .select('*')
      .eq('blog_post_id', blogPostId)
      .order('created_at', { ascending: true })

    if (!includeUnapproved) {
      query = query.eq('is_approved', true)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

/**
 * Submit a new comment
 */
export const submitComment = async (commentData: {
  blog_post_id: string
  parent_comment_id?: string
  author_name: string
  author_email: string
  author_website?: string
  content: string
  is_admin_reply?: boolean
}): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('comments')
      .insert([{
        ...commentData,
        is_approved: commentData.is_admin_reply || false
      }])

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error submitting comment:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Approve a comment (admin functionality)
 */
export const approveComment = async (commentId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('comments')
      .update({ is_approved: true })
      .eq('id', commentId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error approving comment:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Delete a comment (admin functionality)
 */
export const deleteComment = async (commentId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting comment:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Organize comments into a hierarchical structure
 */
export const organizeComments = (comments: Comment[]): Comment[] => {
  const topLevel = comments.filter(comment => !comment.parent_comment_id)
  const replies = comments.filter(comment => comment.parent_comment_id)
  
  return topLevel.map(comment => ({
    ...comment,
    replies: replies.filter(reply => reply.parent_comment_id === comment.id)
  }))
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize comment content (basic sanitization)
 */
export const sanitizeContent = (content: string): string => {
  return content
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .substring(0, 2000) // Limit length
}

/**
 * Format date for display
 */
export const formatCommentDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
} 