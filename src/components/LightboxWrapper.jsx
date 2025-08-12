'use client'

import { useLightbox } from '../context/LightboxContext'
import Lightbox from './Lightbox'

export default function LightboxWrapper() {
  const {
    isOpen,
    imageSrc,
    imageAlt,
    images,
    currentIndex,
    closeLightbox,
    goToNext,
    goToPrevious
  } = useLightbox()

  return (
    <Lightbox
      isOpen={isOpen}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      onClose={closeLightbox}
      images={images}
      currentIndex={currentIndex}
      onNext={goToNext}
      onPrevious={goToPrevious}
    />
  )
} 