'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getBlogPosts, getBlogTags } from '@/lib/blog'
import { formatBlogDate } from '@/lib/blog'
import type { Blog } from '@/types/blog'
import Head from 'next/head'

export default function BlogPage() {
  const { t, i18n } = useTranslation('common')
  const { theme } = useTheme()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  }

  const loadBlogPosts = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        tags: selectedTag ? [selectedTag] : undefined,
        search: searchTerm || undefined
      }
      const data = await getBlogPosts(params, i18n.language)
      setBlogs(data)
      setError(null)
    } catch (err) {
      console.error('Error loading blog posts:', err)
      setError('Failed to load blog posts. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [selectedTag, searchTerm, i18n.language])

  const loadTags = useCallback(async () => {
    try {
      const tags = await getBlogTags(i18n.language)
      setAvailableTags(tags)
      
      // Reset selected tag if it doesn't exist in the new language
      if (selectedTag && !tags.includes(selectedTag)) {
        setSelectedTag(null)
      }
    } catch (err) {
      console.error('Error loading tags:', err)
    }
  }, [i18n.language, selectedTag])

  useEffect(() => {
    loadBlogPosts()
    loadTags()
  }, [loadBlogPosts, loadTags])

  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Search will be triggered by useEffect when searchTerm changes
  }

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-[#F5F0E6] via-[#FFFFFF] to-[#F5F0E6]'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 border-4 border-t-transparent rounded-full animate-spin ${
              theme === 'dark' ? 'border-[#1A1A1A]' : 'border-[#A8D5BA]'
            }`}></div>
            <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Loading blog posts...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-[#F5F0E6] via-[#FFFFFF] to-[#F5F0E6]'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className={`text-center p-8 rounded-2xl ${
            theme === 'dark' ? 'bg-red-900/20 text-white' : 'bg-red-50 text-red-900'
          }`}>
            <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
            <p className="mb-6">{error}</p>
            <button
              onClick={loadBlogPosts}
              className={`px-6 py-3 text-white rounded-lg transition-colors duration-300 ${
                theme === 'dark' ? 'bg-[#1A1A1A] hover:bg-[#FFFFFF] hover:text-[#1A1A1A]' : 'bg-[#A8D5BA] hover:bg-[#1A1A1A]'
              }`}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const featuredPost = blogs.find(blog => blog.featured)
  const regularPosts = blogs.filter(blog => !blog.featured)

  return (
    <>
      <Head>
        <title>Blog - East at West | Lebanese Restaurant Brussels</title>
        <meta name="description" content="Discover stories, recipes, and insights from East at West. Learn about Lebanese cuisine, hospitality, and our journey in Brussels." />
        <meta name="keywords" content="Lebanese cuisine, Brussels restaurant, Middle Eastern food, blog, recipes, culture" />
      </Head>

      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-[#F5F0E6] via-[#FFFFFF] to-[#F5F0E6]'
      }`}>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp"
              alt="East at West Blog"
              fill
              className="object-cover transform scale-105 transition-transform duration-[3s] hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#A8D5BA]/20 to-[#A8D5BA]/20"></div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <motion.div
              className="text-center text-white max-w-4xl"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">
                  {t('blog.title')}
                </span>
              </h1>
              
              <p className="text-xl font-light mb-8 max-w-2xl mx-auto">
                {t('blog.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`p-6 rounded-2xl  border ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/80 border-gray-200 shadow-lg'
          }`}>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('blog.searchPlaceholder')}
                    className={`w-full px-4 py-3 pl-12 rounded-xl border transition-colors duration-300 ${
                      theme === 'dark'
                        ? 'bg-black/20 border-white/20 text-white placeholder-white/50'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <svg className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-white/50' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>

              {/* Tag Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTagFilter(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    selectedTag === null
                      ? theme === 'dark' ? 'bg-[#1A1A1A] text-white' : 'bg-[#A8D5BA] text-white'
                      : theme === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('blog.filterAll')}
                </button>
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 capitalize ${
                      selectedTag === tag
                        ? theme === 'dark' ? 'bg-[#1A1A1A] text-white' : 'bg-[#A8D5BA] text-white'
                        : theme === 'dark'
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <motion.section
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t('blog.noPostsFound')}
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                {selectedTag || searchTerm 
                  ? t('blog.noPostsFoundDesc')
                  : t('blog.checkBackSoon')
                }
              </p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <motion.article
                  variants={itemVariants}
                  className={`mb-12 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] ${
                    theme === 'dark' 
                      ? 'bg-white/5  border border-white/10 hover:bg-white/10' 
                      : 'bg-white border border-gray-100 hover:shadow-3xl'
                  }`}
                >
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <div className="relative h-80 md:h-96">
                      <Image
                        src={featuredPost.cover_image_url || '/images/gallery/falafel.webp'}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                        priority
                        quality={75}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#A8D5BA] text-white px-3 py-1 rounded-full text-sm font-medium">
                          ✨ {t('blog.featured')}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center gap-4 mb-3 text-sm">
                          {featuredPost.author_name && (
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-[#A8D5BA] rounded-full"></div>
                              {featuredPost.author_name}
                            </span>
                          )}
                          {featuredPost.published_at && (
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-[#A8D5BA] rounded-full"></div>
                              {formatBlogDate(featuredPost.published_at)}
                            </span>
                          )}
                          {featuredPost.reading_time && (
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              {featuredPost.reading_time} {t('blog.minRead')}
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                          {featuredPost.title}
                        </h2>
                                                  <p className="text-lg opacity-90 leading-relaxed">
                            {featuredPost.excerpt || t('blog.readMore')}
                          </p>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              )}

              {/* Regular Blog Posts Grid */}
              {regularPosts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((blog) => (
                    <motion.article
                      key={blog.id}
                      variants={itemVariants}
                      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105 ${
                        theme === 'dark' 
                          ? 'bg-white/5  border border-white/10 hover:bg-white/10' 
                          : 'bg-white shadow-lg border border-gray-100 hover:shadow-xl'
                      }`}
                    >
                      <Link href={`/blog/${blog.slug}`}>
                        <div className="relative h-48">
                          <Image
                            src={blog.cover_image_url || '/images/gallery/falafel.webp'}
                            alt={blog.title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            quality={70}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-black/50  text-white px-2 py-1 rounded-lg text-xs font-medium capitalize">
                                {blog.tags[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-3 text-sm">
                            {blog.published_at && (
                              <span className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                                {formatBlogDate(blog.published_at)}
                              </span>
                            )}
                            {blog.reading_time && (
                              <>
                                <span className={`${theme === 'dark' ? 'text-white/50' : 'text-gray-400'}`}>•</span>
                                <span className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                                  {blog.reading_time} {t('blog.minRead')}
                                </span>
                              </>
                            )}
                          </div>
                          
                          <h3 className={`text-xl font-bold mb-3 leading-tight ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {blog.title}
                          </h3>
                          
                          <p className={`text-sm leading-relaxed mb-4 ${
                            theme === 'dark' ? 'text-white/80' : 'text-gray-600'
                          }`}>
                            {blog.excerpt || t('blog.readMore')}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            {blog.author_name && (
                              <span className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#A8D5BA]'
                              }`}>
                                {blog.author_name}
                              </span>
                            )}
                            <div className="text-[#A8D5BA] hover:text-[#A8D5BA] transition-colors duration-300">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.section>
      </div>
    </>
  )
}
