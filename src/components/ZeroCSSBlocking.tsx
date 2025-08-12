'use client'

import { useEffect, useState } from 'react'

// Ultra-minimal critical CSS - only absolute essentials for first paint
const ultraCriticalCSS = `*,::before,::after{box-sizing:border-box}html,body{margin:0;padding:0}body{font-family:system-ui,-apple-system,sans-serif}:root{--bg:#fff;--fg:#000}@media(prefers-color-scheme:dark){:root{--bg:#000;--fg:#fff}}body{background:var(--bg);color:var(--fg)}.min-h-screen{min-height:100vh}.flex{display:flex}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.inset-0{top:0;right:0;bottom:0;left:0}.z-20{z-index:20}.z-50{z-index:50}.w-full{width:100%}.h-screen{height:100vh}.text-center{text-align:center}.font-black{font-weight:900}.lcp-text{opacity:1!important;transform:none!important;font-size:1.25rem;color:rgba(245,241,236,0.9);margin:2.5rem auto;max-width:48rem;font-weight:300}@media(min-width:640px){.lcp-text{font-size:1.5rem}}`

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
    // Immediately inject ultra-critical CSS for first paint
    const criticalStyle = document.createElement('style')
    criticalStyle.textContent = ultraCriticalCSS
    criticalStyle.setAttribute('data-critical', 'true')
    document.head.insertBefore(criticalStyle, document.head.firstChild)

    // Load non-critical CSS after first paint
    const loadNonCriticalCSS = () => {
      if (isLoaded) return
      
      const nonCriticalStyle = document.createElement('style')
      nonCriticalStyle.textContent = nonCriticalCSS
      nonCriticalStyle.setAttribute('data-non-critical', 'true')
      document.head.appendChild(nonCriticalStyle)
      
      setIsLoaded(true)
    }

    // Use requestIdleCallback for non-critical CSS if available
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadNonCriticalCSS, { timeout: 100 })
    } else {
      setTimeout(loadNonCriticalCSS, 50)
    }

    // Also load on user interaction
    const events = ['mousedown', 'touchstart', 'keydown', 'scroll']
    const handleInteraction = () => {
      loadNonCriticalCSS()
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction)
      })
    }

    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { passive: true } as AddEventListenerOptions)
    })

    return () => {
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
