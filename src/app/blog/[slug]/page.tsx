'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '../../../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { getBlogPostBySlug, getRelatedBlogPosts, formatBlogDate } from '@/lib/blog'
import type { Blog } from '@/types/blog'
import CommentSection from '../../../components/CommentSection'
import Head from 'next/head'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const { theme } = useTheme()
  const { t, i18n } = useTranslation('common')
  
  const [blog, setBlog] = useState<Blog | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const loadBlogPost = useCallback(async () => {
    try {
      setLoading(true)
      const blogData = await getBlogPostBySlug(slug, i18n.language)
      
      if (!blogData) {
        notFound()
        return
      }
      
      setBlog(blogData)
      
      // Load related posts based on tags
      if (blogData.tags && blogData.tags.length > 0) {
        const related = await getRelatedBlogPosts(blogData.slug, blogData.tags, 3)
        setRelatedPosts(related)
      }
      
      setError(null)
    } catch (err) {
      console.error('Error loading blog post:', err)
      setError('Failed to load blog post. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [slug, i18n.language])

  useEffect(() => {
    if (slug) {
      loadBlogPost()
    }
  }, [slug, loadBlogPost])

  // Convert markdown-like content to JSX (modern blog styling)
  const renderContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactElement[] = []
    let inList = false
    let listItems: React.ReactElement[] = []
    
    const flushList = () => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className={`mb-8 space-y-3 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {listItems}
          </ul>
        )
        listItems = []
        inList = false
      }
    }
    
    // Helper function to process text with bold and italic formatting
    const processText = (text: string) => {
      // Handle bold text **text**
      text = text.replace(/\*\*(.*?)\*\*/g, `<strong class="font-bold text-[#A8D5BA]">$1</strong>`)
      // Handle italic text *text*
      text = text.replace(/\*(.*?)\*/g, `<em class="italic font-medium">$1</em>`)
      return <span dangerouslySetInnerHTML={{ __html: text }} />
    }
    
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      
      if (trimmed.startsWith('# ')) {
        flushList()
        elements.push(
          <header key={index} className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#A8D5BA] via-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent">
                {trimmed.substring(2)}
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] mx-auto rounded-full"></div>
          </header>
        )
      } else if (trimmed.startsWith('## ')) {
        flushList()
        const headingText = trimmed.substring(3)
        const headingId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        
        elements.push(
          <section key={index} className="mb-10 mt-16" id={headingId}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center gap-4 scroll-mt-24">
              <span className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent">
                {headingText}
              </span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#A8D5BA]/30 to-transparent"></div>
            </h2>
          </section>
        )
      } else if (trimmed.startsWith('### ')) {
        flushList()
        const heading = trimmed.substring(4)
        const emoji = heading.match(/^(\p{Emoji})\s*/u)?.[1] || ''
        const cleanHeading = heading.replace(/^(\p{Emoji})\s*/u, '')
        const headingId = cleanHeading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        
        elements.push(
          <div key={index} className="mb-8 mt-10" id={headingId}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center gap-3 scroll-mt-24 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {emoji && <span className="text-3xl">{emoji}</span>}
              <span className="text-[#A8D5BA]">{cleanHeading}</span>
            </h3>
          </div>
        )
      } else if (trimmed.startsWith('- ')) {
        if (!inList) {
          inList = true
        }
        listItems.push(
          <li key={index} className="flex items-start gap-3 text-lg leading-relaxed">
            <span className="w-2 h-2 bg-[#A8D5BA] rounded-full mt-3 flex-shrink-0"></span>
            <span>{processText(trimmed.substring(2))}</span>
          </li>
        )
      } else if (trimmed === '') {
        flushList()
        // Add some spacing for empty lines
        if (elements.length > 0) {
          elements.push(<div key={index} className="mb-6"></div>)
        }
      } else if (trimmed !== '') {
        flushList()
        
        // Check if this is a special formatted paragraph (starts with **)
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          elements.push(
            <div key={index} className={`mb-6 p-4 rounded-xl border-l-4 border-[#A8D5BA] ${
              theme === 'dark' ? 'bg-white/5' : 'bg-[#A8D5BA]/5'
            }`}>
              <p className="text-lg font-semibold text-[#A8D5BA]">
                {processText(trimmed)}
              </p>
            </div>
          )
        } else {
          elements.push(
            <p key={index} className={`text-lg leading-relaxed mb-6 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {processText(trimmed)}
            </p>
          )
        }
      }
    })
    
    // Flush any remaining list items
    flushList()
    
    return elements
  }

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-[#F5F0E6] via-[#FFFFFF] to-[#F5F0E6]'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#A8D5BA] border-t-transparent rounded-full animate-spin"></div>
            <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Loading blog post...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-[#F5F0E6] via-[#FFFFFF] to-[#F5F0E6]'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className={`text-center p-8 rounded-2xl ${
            theme === 'dark' ? 'bg-red-900/20 text-white' : 'bg-red-50 text-red-900'
          }`}>
            <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
            <p className="mb-6">{error || 'The blog post you\'re looking for doesn\'t exist.'}</p>
            <Link href="/blog">
              <button className="px-6 py-3 bg-[#A8D5BA] hover:bg-[#1A1A1A] text-white rounded-lg transition-colors duration-300">
                Back to Blog
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt || blog.meta_description,
    "author": {
      "@type": "Person",
      "name": blog.author_name || "East at West Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "East at West",
      "logo": {
        "@type": "ImageObject",
        "url": "https://eastatwest.com/images/logo.webp"
      }
    },
    "datePublished": blog.published_at,
    "dateModified": blog.updated_at,
    "image": blog.cover_image_url,
    "url": `https://eastatwest.com/blog/${blog.slug}`
  }

  return (
    <>
      <Head>
        <title>{blog.meta_title || blog.title} - East at West</title>
        <meta name="description" content={blog.meta_description || blog.excerpt || 'Read more on the East at West blog'} />
        <meta name="keywords" content={blog.tags?.join(', ') || 'Lebanese cuisine, Brussels restaurant'} />
        
        {/* Open Graph */}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt || blog.meta_description || ''} />
        <meta property="og:image" content={blog.cover_image_url || '/images/logo.webp'} />
        <meta property="og:url" content={`https://eastatwest.com/blog/${blog.slug}`} />
        <meta property="og:type" content="article" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt || blog.meta_description || ''} />
        <meta name="twitter:image" content={blog.cover_image_url || '/images/logo.webp'} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]' : 'bg-gradient-to-br from-[#F5F0E6] via-[#FFFFFF] to-[#F5F0E6]'
      }`}>
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={blog.cover_image_url || '/images/gallery/falafel.webp'}
              alt={blog.title}
              fill
              className="object-cover transform scale-105 transition-transform duration-[3s] hover:scale-110"
              priority
              sizes="100vw"
              quality={80}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#A8D5BA]/20 to-[#A8D5BA]/20"></div>
          </div>
          
          {/* Breadcrumb */}
          <div className="absolute top-8 left-8 z-10">
            <Link href="/blog">
              <span className="bg-black/50  text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/70 transition-colors duration-300">
                ← {t('blog.backToBlog')}
              </span>
            </Link>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <motion.div
              className="text-center text-white max-w-4xl"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {blog.tags.map(tag => (
                    <span key={tag} className="bg-[#A8D5BA]/80  text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">
                  {blog.title}
                </span>
              </h1>
              
              {blog.excerpt && (
                <p className="text-xl font-light mb-8 max-w-3xl mx-auto opacity-90">
                  {blog.excerpt}
                </p>
              )}
              
              <motion.div
                className="flex flex-wrap items-center justify-center gap-6 text-lg font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                {blog.author_name && (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#A8D5BA] rounded-full"></div>
                    {blog.author_name}
                  </span>
                )}
                {blog.published_at && (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#A8D5BA] rounded-full"></div>
                    {formatBlogDate(blog.published_at)}
                  </span>
                )}
                {blog.reading_time && (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    {blog.reading_time} {t('blog.minRead')}
                  </span>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <motion.article
          className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Table of Contents */}
          <motion.div 
            variants={itemVariants}
            className={`relative z-10 p-6 rounded-2xl  border mb-8 ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/80 border-gray-200 shadow-lg'
            }`}
          >
            <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <span>📚</span>
              {t('blog.tableOfContents')}
            </h2>
            <nav className="space-y-2">
              {blog.content.split('\n')
                .filter(line => line.startsWith('## ') || line.startsWith('### '))
                .map((heading, index) => {
                  const level = heading.startsWith('### ') ? 3 : 2
                  const text = heading.replace(/^#{2,3}\s/, '').replace(/🍟|🥔|🥬|🧀/g, '').trim()
                  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                  
                  return (
                    <a
                      key={index}
                      href={`#${slug}`}
                      className={`block hover:text-[#A8D5BA] transition-colors duration-200 ${
                        level === 3 ? 'ml-4 text-sm' : 'font-medium'
                      } ${theme === 'dark' ? 'text-gray-300 hover:text-[#A8D5BA]' : 'text-gray-600 hover:text-[#A8D5BA]'}`}
                    >
                      {text}
                    </a>
                  )
                })}
            </nav>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            variants={itemVariants}
            className={`relative z-10 p-8 rounded-3xl  border ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/80 border-gray-200 shadow-lg'
            }`}
          >
            <article className="prose prose-lg max-w-none">
              {renderContent(blog.content)}
            </article>
          </motion.div>

          {/* Author Info */}
          {blog.author_name && (
            <motion.div 
              variants={itemVariants}
              className={`relative z-10 mt-12 p-6 rounded-2xl  border ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/80 border-gray-200 shadow-lg'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {blog.author_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{blog.author_name}</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                    {t('blog.authorAt')} East at West
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Share Section */}
          <motion.div 
            variants={itemVariants}
            className={`relative z-10 mt-12 p-6 rounded-2xl  border ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/80 border-gray-200 shadow-lg'
            }`}
          >
            <h3 className="text-xl font-bold mb-4">{t('blog.shareArticle')}</h3>
            <div className="flex items-center gap-4">
              <button className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                theme === 'dark' 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-gray-100 hover:bg-[#A8D5BA] hover:text-white text-gray-700'
              }`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              
              <button className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                theme === 'dark' 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-gray-100 hover:bg-[#A8D5BA] hover:text-white text-gray-700'
              }`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </button>
              
              <button className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                theme === 'dark' 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-gray-100 hover:bg-[#A8D5BA] hover:text-white text-gray-700'
              }`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <motion.h2 
              className={`text-3xl font-bold mb-8 text-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t('blog.relatedArticles')}
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-white/5  border border-white/10 hover:bg-white/10' 
                      : 'bg-white shadow-lg border border-gray-100 hover:shadow-xl'
                  }`}
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="relative h-48">
                      <Image
                        src={relatedPost.cover_image_url || '/images/gallery/falafel.webp'}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        quality={70}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className={`text-lg font-bold mb-2 leading-tight ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {relatedPost.title}
                      </h3>
                      
                      <p className={`text-sm leading-relaxed mb-4 ${
                        theme === 'dark' ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {relatedPost.excerpt || t('blog.readMore')}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        {relatedPost.published_at && (
                          <span className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                            {formatBlogDate(relatedPost.published_at)}
                          </span>
                        )}
                        <div className="text-[#A8D5BA] hover:text-[#A8D5BA] transition-colors duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* Comment Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <CommentSection blogPostId={blog.slug} />
        </section>
      </div>
    </>
  )
}
