'use client'

import { createContext, useContext, useState } from 'react'

const LightboxContext = createContext()

export function LightboxProvider({ children }) {
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    imageSrc: '',
    imageAlt: '',
    images: [],
    currentIndex: 0
  })

  const openLightbox = (imageSrc, imageAlt, images = [], currentIndex = 0) => {
    setLightboxState({
      isOpen: true,
      imageSrc,
      imageAlt,
      images,
      currentIndex
    })
  }

  const closeLightbox = () => {
    setLightboxState(prev => ({
      ...prev,
      isOpen: false
    }))
  }

  const goToNext = () => {
    if (lightboxState.images.length > 0 && lightboxState.currentIndex < lightboxState.images.length - 1) {
      const nextIndex = lightboxState.currentIndex + 1
      const nextImage = lightboxState.images[nextIndex]
      setLightboxState(prev => ({
        ...prev,
        currentIndex: nextIndex,
        imageSrc: nextImage.src,
        imageAlt: nextImage.alt
      }))
    }
  }

  const goToPrevious = () => {
    if (lightboxState.images.length > 0 && lightboxState.currentIndex > 0) {
      const prevIndex = lightboxState.currentIndex - 1
      const prevImage = lightboxState.images[prevIndex]
      setLightboxState(prev => ({
        ...prev,
        currentIndex: prevIndex,
        imageSrc: prevImage.src,
        imageAlt: prevImage.alt
      }))
    }
  }

  const value = {
    ...lightboxState,
    openLightbox,
    closeLightbox,
    goToNext,
    goToPrevious
  }

  return (
    <LightboxContext.Provider value={value}>
      {children}
    </LightboxContext.Provider>
  )
}

export function useLightbox() {
  const context = useContext(LightboxContext)
  if (!context) {
    throw new Error('useLightbox must be used within a LightboxProvider')
  }
  return context
} 