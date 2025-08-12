'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../../context/ThemeContext'
import { fetchComments, approveComment, deleteComment, formatCommentDate } from '../../../lib/commentUtils'
import type { Comment } from '../../../types/comments'

export default function CommentsAdminPage() {
  const { theme } = useTheme()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    setLoading(true)
    try {
      const allComments = await fetchComments('vegetarian-restaurant-brussels', true)
      setComments(allComments)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (commentId: string) => {
    const result = await approveComment(commentId)
    if (result.success) {
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, is_approved: true }
          : comment
      ))
    } else {
      alert('Error approving comment: ' + result.error)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    
    const result = await deleteComment(commentId)
    if (result.success) {
      setComments(prev => prev.filter(comment => comment.id !== commentId))
    } else {
      alert('Error deleting comment: ' + result.error)
    }
  }

  const filteredComments = comments.filter(comment => {
    switch (filter) {
      case 'pending':
        return !comment.is_approved
      case 'approved':
        return comment.is_approved
      default:
        return true
    }
  })

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
    <div className={`min-h-screen pt-16 transition-colors duration-500 ${
      theme === 'dark' ? 'bg-gradient-to-br from-[#5C4300] via-[#4a3700] to-[#5C4300]' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="mb-12 text-center"
          variants={itemVariants}
        >
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-[#f99747] to-[#bc906b] bg-clip-text text-transparent">
            💬 Comment Moderation
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#f99747] to-[#bc906b] mx-auto rounded-full"></div>
          <p className={`text-lg mt-6 ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
            Manage and moderate blog comments
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          className="mb-8 flex flex-wrap justify-center gap-4"
          variants={itemVariants}
        >
          {(['all', 'pending', 'approved'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                filter === filterType
                  ? 'bg-gradient-to-r from-[#f99747] to-[#bc906b] text-white shadow-lg'
                  : theme === 'dark'
                    ? 'bg-white/10 text-white/70 hover:bg-white/20'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === 'pending' && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {comments.filter(c => !c.is_approved).length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Comments List */}
        {loading ? (
          <motion.div 
            className="text-center py-12"
            variants={itemVariants}
          >
            <div className="animate-spin w-8 h-8 border-4 border-[#f99747] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>Loading comments...</p>
          </motion.div>
        ) : filteredComments.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            variants={itemVariants}
          >
            <span className="text-6xl mb-4 block">📭</span>
            <p className={`text-xl ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
              No {filter !== 'all' ? filter : ''} comments found
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
          >
            <AnimatePresence>
              {filteredComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  className={`p-6 rounded-2xl border transition-all duration-300 ${
                    comment.is_approved
                      ? theme === 'dark'
                        ? 'bg-green-500/10 border-green-500/20'
                        : 'bg-green-50 border-green-200'
                      : theme === 'dark'
                        ? 'bg-red-500/10 border-red-500/20'
                        : 'bg-red-50 border-red-200'
                  }`}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
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
                          {comment.author_email}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-white/40' : 'text-gray-400'}`}>
                          {formatCommentDate(comment.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        comment.is_approved
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-red-500/20 text-red-600'
                      }`}>
                        {comment.is_approved ? 'Approved' : 'Pending'}
                      </span>
                      {comment.is_admin_reply && (
                        <span className="bg-gradient-to-r from-[#f99747] to-[#bc906b] text-white px-3 py-1 rounded-full text-sm font-medium">
                          Admin Reply
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comment Content */}
                  <div className="mb-4">
                    <p className="text-lg leading-relaxed">{comment.content}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {!comment.is_approved && (
                      <motion.button
                        onClick={() => handleApprove(comment.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ✅ Approve
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => handleDelete(comment.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🗑️ Delete
                    </motion.button>
                  </div>

                  {/* Parent Comment Info */}
                  {comment.parent_comment_id && (
                    <div className="mt-4 pt-4 border-t border-gray-200/20">
                      <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                        💬 Reply to comment ID: {comment.parent_comment_id}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div 
          className={`mt-12 p-6 rounded-2xl ${
            theme === 'dark' 
              ? 'bg-white/5 border border-white/10' 
              : 'bg-white shadow-lg border border-gray-200'
          }`}
          variants={itemVariants}
        >
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#f99747] to-[#bc906b] bg-clip-text text-transparent">
            📊 Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-[#f99747] mb-2">{comments.length}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Total Comments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-green-500 mb-2">
                {comments.filter(c => c.is_approved).length}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Approved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-red-500 mb-2">
                {comments.filter(c => !c.is_approved).length}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Pending</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 