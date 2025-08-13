'use client'

import { useEffect, useState } from 'react'

// Enhanced critical CSS for above-the-fold content - eliminates render blocking
const ultraCriticalCSS = `
/* Reset and base */
*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid}
html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
body{margin:0;line-height:inherit;background:var(--bg,#fff);color:var(--fg,#000)}
:root{--bg:#fff;--fg:#000}@media(prefers-color-scheme:dark){:root{--bg:#0a0a0a;--fg:#ededed}}

/* Critical layout */
.min-h-screen{min-height:100vh}.h-screen{height:100vh}.w-full{width:100%}.h-full{height:100%}
.flex{display:flex}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}
.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.inset-0{inset:0}
.z-10{z-index:10}.z-20{z-index:20}.z-50{z-index:50}

/* Critical typography */
.text-center{text-align:center}.font-black{font-weight:900}.font-bold{font-weight:700}.font-light{font-weight:300}
.text-sm{font-size:0.875rem;line-height:1.25rem}.text-base{font-size:1rem;line-height:1.5rem}
.text-lg{font-size:1.125rem;line-height:1.75rem}.text-xl{font-size:1.25rem;line-height:1.75rem}
.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}
.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-5xl{font-size:3rem;line-height:1}
.text-6xl{font-size:3.75rem;line-height:1}.text-7xl{font-size:4.5rem;line-height:1}.text-8xl{font-size:6rem;line-height:1}

/* Critical spacing */
.p-4{padding:1rem}.px-4{padding:0 1rem}.px-6{padding:0 1.5rem}.px-8{padding:0 2rem}
.py-3{padding:0.75rem 0}.py-4{padding:1rem 0}.py-5{padding:1.25rem 0}
.mb-2{margin-bottom:0.5rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}
.mb-8{margin-bottom:2rem}.mb-10{margin-bottom:2.5rem}.mx-auto{margin:0 auto}

/* Critical colors */
.text-white{color:#fff}.bg-black{background-color:#000}.bg-white{background-color:#fff}

/* Critical effects */
.shadow-2xl{box-shadow:0 25px 50px -12px rgba(0,0,0,0.25)}
.rounded-xl{border-radius:0.75rem}.rounded-2xl{border-radius:1rem}
.transition-all{transition:all 0.15s cubic-bezier(0.4,0,0.2,1)}.duration-300{transition-duration:0.3s}

/* LCP text - CRITICAL for performance */
.lcp-text{opacity:1!important;transform:none!important;font-size:1.25rem;line-height:1.75rem;color:rgba(245,241,236,0.9);margin-bottom:2.5rem;max-width:48rem;margin-left:auto;margin-right:auto;font-weight:300;font-family:system-ui,-apple-system,sans-serif!important;contain:layout style paint;will-change:auto}

/* Critical header styles */
.header-bg{background:rgba(92,67,0,0.9);backdrop-filter:blur(12px)}

/* Responsive breakpoints */
@media(min-width:640px){.sm\\:text-lg{font-size:1.125rem;line-height:1.75rem}.sm\\:text-6xl{font-size:3.75rem;line-height:1}.sm\\:text-8xl{font-size:6rem;line-height:1}.sm\\:mb-6{margin-bottom:1.5rem}.sm\\:mb-8{margin-bottom:2rem}.sm\\:px-6{padding-left:1.5rem;padding-right:1.5rem}.sm\\:py-3{padding-top:0.75rem;padding-bottom:0.75rem}.sm\\:flex-row{flex-direction:row}.lcp-text{font-size:1.5rem;line-height:2rem}}
@media(min-width:768px){.md\\:text-xl{font-size:1.25rem;line-height:1.75rem}.md\\:text-5xl{font-size:3rem;line-height:1}.md\\:text-7xl{font-size:4.5rem;line-height:1}.md\\:mb-10{margin-bottom:2.5rem}.md\\:px-8{padding-left:2rem;padding-right:2rem}.md\\:py-4{padding-top:1rem;padding-bottom:1rem}.lcp-text{font-size:1.125rem;line-height:1.75rem}}
@media(min-width:1024px){.lg\\:text-2xl{font-size:1.5rem;line-height:2rem}.lg\\:text-7xl{font-size:4.5rem;line-height:1}.lg\\:px-8{padding-left:2rem;padding-right:2rem}.lg\\:px-10{padding-left:2.5rem;padding-right:2.5rem}.lg\\:py-5{padding-top:1.25rem;padding-bottom:1.25rem}.lcp-text{font-size:1.25rem;line-height:1.875rem}}
@media(min-width:1280px){.xl\\:text-7xl{font-size:4.5rem;line-height:1}.xl\\:text-8xl{font-size:6rem;line-height:1}.lcp-text{font-size:1.5rem;line-height:2rem}}
@media(min-width:1536px){.\\32xl\\:text-8xl{font-size:6rem;line-height:1}}
`

// All non-critical CSS that will be loaded asynchronously
const nonCriticalCSS = `
/* Complete application styles - loaded after first paint */
.py-12{padding-top:3rem;padding-bottom:3rem}
.px-4{padding-left:1rem;padding-right:1rem}
.px-6{padding-left:1.5rem;padding-right:1.5rem}
.mb-6{margin-bottom:1.5rem}
.mb-10{margin-bottom:2.5rem}
.mx-auto{margin-left:auto;margin-right:auto}
.gap-6{gap:1.5rem}
.max-w-3xl{max-width:48rem}
.max-w-6xl{max-width:72rem}
.text-xl{font-size:1.25rem;line-height:1.75rem}
.text-2xl{font-size:1.5rem;line-height:2rem}
.text-4xl{font-size:2.25rem;line-height:2.5rem}
.text-5xl{font-size:3rem;line-height:1}
.text-6xl{font-size:3.75rem;line-height:1}
.font-bold{font-weight:700}
.font-light{font-weight:300}
.leading-relaxed{line-height:1.625}

/* Hero section complete styles */
.hero-section{
  height:100vh;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  background:linear-gradient(135deg,#5C4300 0%,#000 100%);
}
.hero-video{
  position:absolute;
  top:0;left:0;
  width:100%;height:100%;
  object-fit:cover;
}
.hero-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 50%,rgba(0,0,0,0.2) 100%);
}
.hero-content{
  position:relative;z-index:20;
  text-align:center;padding:1rem;
  max-width:96rem;
}
.hero-title{
  font-size:3rem;font-weight:900;
  margin-bottom:1.5rem;
  font-family:"Georgia","Times New Roman","Times",serif;
  background:linear-gradient(to right,#f99747,#bc906b,#5C4300);
  -webkit-background-clip:text;
  background-clip:text;
  -webkit-text-fill-color:transparent;
  color:transparent;
}

/* Buttons */
.btn-hero{
  display:inline-block;
  background:linear-gradient(90deg,#f99747 0%,#bc906b 100%);
  color:#F5F1EC;
  padding:1.25rem 2.5rem;
  border-radius:1rem;
  font-size:1.25rem;
  font-weight:700;
  text-decoration:none;
  transition:all 0.3s ease;
  box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);
}
.btn-hero:hover{
  transform:scale(1.05);
  box-shadow:0 25px 50px -12px rgba(249,151,71,0.25);
}
.btn-secondary{
  display:inline-block;
  border:3px solid #F5F1EC;
  background:rgba(245,241,236,0.1);

  color:#F5F1EC;
  padding:1.25rem 2.5rem;
  border-radius:1rem;
  font-size:1.25rem;
  font-weight:700;
  text-decoration:none;
  transition:all 0.3s ease;
  box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);
}
.btn-secondary:hover{
  background:#F5F1EC;
  color:#5C4300;
  transform:scale(1.05);
}

/* Navigation */
.nav-header{
  position:fixed;top:0;left:0;right:0;
  z-index:50;

  background:rgba(92,67,0,0.9);
}

/* Responsive breakpoints */
@media(min-width:640px){
  .sm\\:text-6xl{font-size:3.75rem;line-height:1}
  .sm\\:text-8xl{font-size:6rem;line-height:1}
  .sm\\:px-6{padding-left:1.5rem;padding-right:1.5rem}
  .sm\\:flex-row{flex-direction:row}
  .hero-title{font-size:3.75rem}
}
@media(min-width:768px){
  .md\\:text-5xl{font-size:3rem;line-height:1}
  .md\\:text-6xl{font-size:3.75rem;line-height:1}
}
@media(min-width:1024px){
  .lg\\:text-6xl{font-size:3.75rem;line-height:1}
  .lg\\:text-7xl{font-size:4.5rem;line-height:1}
  .lg\\:px-8{padding-left:2rem;padding-right:2rem}
  .hero-title{font-size:4.5rem}
}
@media(min-width:1280px){
  .xl\\:text-8xl{font-size:6rem;line-height:1}
  .hero-title{font-size:5rem}
}

/* Add all remaining styles here... */
`

export default function ZeroCSSBlocking() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load the full Tailwind CSS asynchronously after first paint
    const loadFullCSS = () => {
      if (isLoaded) return
      
      // Load the main stylesheet asynchronously
      const mainStylesheet = document.createElement('link')
      mainStylesheet.rel = 'stylesheet'
      mainStylesheet.href = '/css/deferred-styles.css' // Will be created by build process
      mainStylesheet.media = 'print' // Load as non-render-blocking
      mainStylesheet.onload = () => {
        mainStylesheet.media = 'all' // Switch to all media once loaded
      }
      
      // Fallback for browsers that don't support onload
      setTimeout(() => {
        if (mainStylesheet.media === 'print') {
          mainStylesheet.media = 'all'
        }
      }, 3000)
      
      document.head.appendChild(mainStylesheet)
      
      // Also load non-critical inline styles
      const nonCriticalStyle = document.createElement('style')
      nonCriticalStyle.textContent = nonCriticalCSS
      nonCriticalStyle.setAttribute('data-non-critical', 'true')
      document.head.appendChild(nonCriticalStyle)
      
      setIsLoaded(true)
    }

    // Strategy: Load after first paint is complete
    // 1. Use requestIdleCallback for optimal timing
    // 2. Use interaction-based loading as fallback
    // 3. Use timer as final fallback
    
    let loaded = false
    const executeLoad = () => {
      if (loaded) return
      loaded = true
      loadFullCSS()
    }

    // Primary: Use requestIdleCallback for ideal timing
    if ('requestIdleCallback' in window) {
      requestIdleCallback(executeLoad, { timeout: 100 })
    } else {
      setTimeout(executeLoad, 50)
    }

    // Secondary: Load on first user interaction
    const events = ['mousedown', 'touchstart', 'keydown', 'scroll', 'wheel']
    const handleInteraction = () => {
      executeLoad()
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction, { passive: true } as AddEventListenerOptions)
      })
    }

    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { passive: true } as AddEventListenerOptions)
    })

    // Tertiary: Ensure loading happens within reasonable time
    const fallbackTimer = setTimeout(executeLoad, 1000)

    return () => {
      clearTimeout(fallbackTimer)
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction)
      })
    }
  }, [isLoaded])

  // Optimize CSS loading and preload critical resources
  useEffect(() => {
    // Defer non-critical CSS loading to prevent render blocking
    const deferCSS = () => {
      const existingLinks = document.querySelectorAll('link[rel="stylesheet"][href*="layout.css"]')
      existingLinks.forEach(link => {
        const deferredLink = document.createElement('link')
        deferredLink.rel = 'stylesheet'
        deferredLink.href = (link as HTMLLinkElement).href
        deferredLink.media = 'print'
        deferredLink.onload = () => {
          deferredLink.media = 'all'
        }
        document.head.appendChild(deferredLink)
        link.remove()
      })
    }

    // Progressive loading strategy for large assets
    const implementProgressiveLoading = () => {
      // Preload critical images only
      const criticalImages = [
        '/images/banner.webp', // Used in multiple places
      ]
      
      criticalImages.forEach(src => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = src
        link.fetchPriority = 'high'
        document.head.appendChild(link)
      })

      // Prefetch non-critical images on idle
      const prefetchImages = () => {
        const nonCriticalImages = [
          '/images/parallax-image.webp',
          '/images/guru2023.webp',
          '/images/guru2024.webp',
        ]
        
        nonCriticalImages.forEach(src => {
          const link = document.createElement('link')
          link.rel = 'prefetch'
          link.as = 'image'
          link.href = src
          document.head.appendChild(link)
        })
      }

      // Use requestIdleCallback to prefetch non-critical assets
      if ('requestIdleCallback' in window) {
        requestIdleCallback(prefetchImages, { timeout: 2000 })
      } else {
        setTimeout(prefetchImages, 1000)
      }
    }

    implementProgressiveLoading()

    // Defer CSS loading on interaction or after idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(deferCSS, { timeout: 100 })
    } else {
      setTimeout(deferCSS, 50)
    }
  }, [])

  return null
}

// Export for use in layout
export { ultraCriticalCSS }
