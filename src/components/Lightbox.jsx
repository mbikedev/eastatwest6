'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTheme } from '../context/ThemeContext'

export default function Lightbox({ 
  isOpen, 
  imageSrc, 
  imageAlt, 
  onClose, 
  images = [], 
  currentIndex = 0, 
  onNext, 
  onPrevious 
}) {
  const { theme } = useTheme()
  const lightboxRef = useRef(null)
  const imageRef = useRef(null)

  const hasMultipleImages = images.length > 1
  const canGoNext = hasMultipleImages && currentIndex < images.length - 1
  const canGoPrevious = hasMultipleImages && currentIndex > 0

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          if (canGoPrevious && onPrevious) onPrevious()
          break
        case 'ArrowRight':
          if (canGoNext && onNext) onNext()
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, canGoNext, canGoPrevious, onNext, onPrevious])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && lightboxRef.current) {
      lightboxRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      ref={lightboxRef}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={handleBackdropClick}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Backdrop */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-black/95 backdrop-blur-md' 
          : 'bg-black/90 backdrop-blur-md'
      }`} />

      {/* Content Container - Full Viewport */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 z-10 p-3 rounded-full transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-zinc-800/90 text-white hover:bg-zinc-700'
              : 'bg-white/90 text-gray-900 hover:bg-white'
          } backdrop-blur-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-500/50`}
          aria-label="Close lightbox"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Previous Button */}
        {hasMultipleImages && canGoPrevious && (
          <button
            onClick={onPrevious}
            className={`absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-4 rounded-full transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-zinc-800/90 text-white hover:bg-zinc-700'
                : 'bg-white/90 text-gray-900 hover:bg-white'
            } backdrop-blur-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-500/50`}
            aria-label="Previous image"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Button */}
        {hasMultipleImages && canGoNext && (
          <button
            onClick={onNext}
            className={`absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-4 rounded-full transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-zinc-800/90 text-white hover:bg-zinc-700'
                : 'bg-white/90 text-gray-900 hover:bg-white'
            } backdrop-blur-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-500/50`}
            aria-label="Next image"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Image - Full Viewport Display */}
        <div className={`relative w-full h-full flex items-center justify-center p-4 md:p-16 transition-all duration-500 transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          <Image
            ref={imageRef}
            src={imageSrc}
            alt={imageAlt}
            width={1920}
            height={1920}
            className="lightbox-image object-contain rounded-lg shadow-2xl"
            style={{
              minWidth: '300px',
              minHeight: '300px',
              maxWidth: 'calc(100vw - 8rem)',
              maxHeight: 'calc(100vh - 8rem)',
              width: 'auto',
              height: 'auto'
            }}
            priority
            quality={95}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
          />
          
          {/* Image Counter */}
          {hasMultipleImages && (
            <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full ${
              theme === 'dark'
                ? 'bg-zinc-800/90 text-white'
                : 'bg-white/90 text-gray-900'
            } backdrop-blur-sm shadow-lg text-base font-medium`}>
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 