'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabaseClient'
import { debugSupabaseConfig } from '../lib/envCheck'

const CommentSection = ({ blogPostId = 'vegetarian-restaurant-brussels' }) => {
  const { theme } = useTheme()
  const { t } = useTranslation('common')
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    author_website: '',
    content: ''
  })
  const [replyForms, setReplyForms] = useState({})
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [configError, setConfigError] = useState(false)

  // Check authentication and fetch comments on component mount
  useEffect(() => {
    // Debug configuration first
    const config = debugSupabaseConfig()
    
    if (!config.isConfigured) {
      // Silent in dev to avoid noisy console when using fallbacks
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ Cannot initialize comments: Supabase not configured properly')
      }
      setConfigError(true)
      setLoading(false)
      setAuthLoading(false)
      return
    }
    
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          // Only log auth errors that are NOT "session missing" (which is expected for anonymous users)
          if (error.name !== 'AuthSessionMissingError') {
            console.error('Auth error:', error)
          }
        } else {
          setUser(user)
          console.log('User authenticated:', user ? 'Yes' : 'No')
        }
      } catch (error) {
        // Only log unexpected auth errors
        if (error.name !== 'AuthSessionMissingError') {
          console.error('Error checking auth:', error)
        }
      } finally {
        setAuthLoading(false)
      }
    }
    
    // Test connection first
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('comments').select('count').limit(1)
        if (error) {
          console.error('Supabase connection test failed:', error)
        } else {
          console.log('Supabase connection test successful')
        }
      } catch (error) {
        console.error('Supabase connection error:', error)
      }
    }
    
    checkAuth()
    testConnection()
    fetchComments()
  }, [blogPostId])

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('blog_post_id', blogPostId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Supabase error fetching comments:', error)
        throw error
      }
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error.message || error)
      setComments([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if user is authenticated
    if (user) {
      // ✅ THIS IS WHERE YOUR AUTHENTICATED CODE GOES:
              if (!formData.content.trim()) {
          alert('Please enter a comment.')
          return
        }

      setSubmitting(true)
      try {
        const { data, error } = await supabase
          .from('comments')
          .insert({
            blog_post_id: blogPostId,
            user_id: user.id,  // Make sure to set the user_id to the authenticated user's ID
            content: formData.content.trim(),
            author_name: user.user_metadata?.full_name || user.email.split('@')[0],
            author_email: user.email,
            is_approved: false // Comments still need approval
          })
          .select()

        if (error) {
          console.error('Supabase error:', error)
          throw new Error(error.message || 'Failed to submit comment')
        }

        // Reset form
        setFormData({
          author_name: '',
          author_email: '',
          author_website: '',
          content: ''
        })

        // Show success message
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)

      } catch (error) {
        console.error('Error submitting comment:', error.message || error)
        alert(`Error submitting comment: ${error.message || t('blog.checkBackLater')}`)
      } finally {
        setSubmitting(false)
      }
    } else {
      // ❌ Non-authenticated users (keep existing behavior)
      if (!formData.author_name.trim() || !formData.author_email.trim() || !formData.content.trim()) {
        alert('Please fill in all required fields.')
        return
      }

      setSubmitting(true)
      try {
        const commentData = {
          blog_post_id: blogPostId,
          author_name: formData.author_name.trim(),
          author_email: formData.author_email.trim(),
          author_website: formData.author_website.trim() || null,
          content: formData.content.trim(),
          is_approved: false // Comments need approval
        }

        const { data, error } = await supabase
          .from('comments')
          .insert([commentData])
          .select()

        if (error) {
          console.error('Supabase error:', error)
          throw new Error(error.message || 'Failed to submit comment')
        }

        // Reset form
        setFormData({
          author_name: '',
          author_email: '',
          author_website: '',
          content: ''
        })

        // Show success message
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)

      } catch (error) {
        console.error('Error submitting comment:', error.message || error)
        alert(`Error submitting comment: ${error.message || t('blog.checkBackLater')}`)
      } finally {
        setSubmitting(false)
      }
    }
  }

  const handleReplySubmit = async (parentCommentId, replyContent) => {
    if (!replyContent.trim()) return

    try {
      const replyData = {
        blog_post_id: blogPostId,
        parent_comment_id: parentCommentId,
        author_name: 'East@West Team',
        author_email: 'admin@eastatwest.com',
        content: replyContent.trim(),
        is_approved: true,
        is_admin_reply: true
      }

      const { data, error } = await supabase
        .from('comments')
        .insert([replyData])
        .select()

      if (error) {
        console.error('Supabase error submitting reply:', error)
        throw new Error(error.message || 'Failed to submit reply')
      }

      // Clear reply form
      setReplyForms(prev => ({
        ...prev,
        [parentCommentId]: ''
      }))

      // Refresh comments
      fetchComments()
          } catch (error) {
        console.error('Error submitting reply:', error.message || error)
        alert(`Error submitting reply: ${error.message || t('blog.checkBackLater')}`)
      }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const organizeComments = (comments) => {
    const topLevel = comments.filter(comment => !comment.parent_comment_id)
    const replies = comments.filter(comment => comment.parent_comment_id)
    
    return topLevel.map(comment => ({
      ...comment,
      replies: replies.filter(reply => reply.parent_comment_id === comment.id)
    }))
  }

  const organizedComments = organizeComments(comments)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <motion.section
      className={`relative mt-16 p-8 rounded-3xl backdrop-blur-sm border ${
        theme === 'dark' 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white shadow-xl border-gray-100'
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Section Header */}
      <motion.div 
        className="mb-12 text-center"
        variants={itemVariants}
      >
        <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-[#f99747] to-[#bc906b] bg-clip-text text-transparent flex items-center justify-center gap-3">
          <span className="text-4xl">💬</span>
          {t('blog.leaveReply') || 'Leave a Reply'}
        </h2>
        <div className="w-32 h-1.5 bg-gradient-to-r from-[#f99747] to-[#bc906b] mx-auto rounded-full"></div>
      </motion.div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            className="mb-8 p-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <p className="font-medium">{t('blog.thankYouMessage')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Form */}
      {!configError && (
        <motion.div 
          className={`mb-12 p-8 rounded-2xl ${
            theme === 'dark' 
              ? 'bg-white/5 border border-white/10' 
              : 'bg-gray-50 border border-gray-200'
          }`}
          variants={itemVariants}
        >
        <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
          {t('blog.emailNotPublished')} <span className="text-red-500">*</span>
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                name="author_name"
                placeholder={t('blog.enterName')}
                value={formData.author_name}
                onChange={handleInputChange}
                required
                className={`w-full p-4 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-[#f99747]/50 focus:border-[#f99747] ${
                  theme === 'dark'
                    ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <div>
              <input
                type="email"
                name="author_email"
                placeholder={t('blog.enterEmail')}
                value={formData.author_email}
                onChange={handleInputChange}
                required
                className={`w-full p-4 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-[#f99747]/50 focus:border-[#f99747] ${
                  theme === 'dark'
                    ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
          
          <div>
            <input
              type="url"
              name="author_website"
              placeholder={t('blog.enterWebsite')}
              value={formData.author_website}
              onChange={handleInputChange}
              className={`w-full p-4 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-[#f99747]/50 focus:border-[#f99747] ${
                theme === 'dark'
                  ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          
          <div>
            <textarea
              name="content"
              placeholder={t('blog.enterComments')}
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={6}
              className={`w-full p-4 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-[#f99747]/50 focus:border-[#f99747] resize-none ${
                theme === 'dark'
                  ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-[#f99747] to-[#bc906b] hover:from-[#bc906b] hover:to-[#5C4300] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {submitting ? t('blog.posting') : t('blog.postComment')}
          </motion.button>
        </form>
      </motion.div>
      )}

      {/* Comments Display */}
      {configError ? (
        <motion.div 
          className="text-center py-12"
          variants={itemVariants}
        >
          <span className="text-6xl mb-4 block">⚠️</span>
          <p className={`text-xl mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
            {t('blog.commentsUnavailable')}
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
            {t('blog.checkBackLater')}
          </p>
        </motion.div>
      ) : loading ? (
        <motion.div 
          className="text-center py-12"
          variants={itemVariants}
        >
          <div className="animate-spin w-8 h-8 border-4 border-[#f99747] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>{t('blog.loadingComments')}</p>
        </motion.div>
      ) : organizedComments.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          variants={itemVariants}
        >
          <span className="text-6xl mb-4 block">🎭</span>
          <p className={`text-xl ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
            {t('blog.beFirstComment')}
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-8"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#f99747] to-[#bc906b] bg-clip-text text-transparent">
              {t('blog.commentsCount')} ({organizedComments.length})
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#f99747] to-transparent"></div>
          </div>

          {organizedComments.map((comment) => (
            <motion.div
              key={comment.id}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white border-gray-200 hover:shadow-xl'
              }`}
              variants={itemVariants}
            >
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#f99747] to-[#bc906b] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{comment.author_name}</h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                      {formatDate(comment.created_at)}
                    </p>
                  </div>
                </div>
                {comment.is_admin_reply && (
                  <span className="bg-gradient-to-r from-[#f99747] to-[#bc906b] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {t('blog.team')}
                  </span>
                )}
              </div>

              {/* Comment Content */}
              <div className="mb-4">
                <p className="text-lg leading-relaxed">{comment.content}</p>
              </div>

              {/* Admin Reply Form */}
              {!comment.is_admin_reply && (
                <div className="pt-4 border-t border-gray-200/20">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder={t('blog.replyAsAdmin')}
                      value={replyForms[comment.id] || ''}
                      onChange={(e) => setReplyForms(prev => ({ ...prev, [comment.id]: e.target.value }))}
                      className={`flex-1 p-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-[#f99747]/50 focus:border-[#f99747] ${
                        theme === 'dark'
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <motion.button
                      onClick={() => handleReplySubmit(comment.id, replyForms[comment.id])}
                      className="bg-gradient-to-r from-[#f99747] to-[#bc906b] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                      whileTap={{ scale: 0.95 }}
                    >
                      {t('blog.reply')}
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-6 pl-8 border-l-4 border-[#f99747]/30 space-y-4">
                  {comment.replies.map((reply) => (
                    <motion.div
                      key={reply.id}
                      className={`p-4 rounded-xl ${
                        theme === 'dark'
                          ? 'bg-[#f99747]/10 border border-[#f99747]/20'
                          : 'bg-[#f99747]/5 border border-[#f99747]/20'
                      }`}
                      variants={itemVariants}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f99747] to-[#bc906b] flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {reply.author_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-bold flex items-center gap-2">
                            {reply.author_name}
                            <span className="bg-gradient-to-r from-[#f99747] to-[#bc906b] text-white px-2 py-0.5 rounded-full text-xs">
                              {t('blog.team')}
                            </span>
                          </h5>
                          <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                            {formatDate(reply.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className="leading-relaxed">{reply.content}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  )
}

export default CommentSection 