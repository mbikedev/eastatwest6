'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'

interface BreadcrumbItem {
  label: string
  href: string
}

export default function Breadcrumbs() {
  const pathname = usePathname()
  const { t } = useTranslation('common')
  const { theme } = useTheme()

  // Skip breadcrumbs on homepage
  if (pathname === '/' || pathname === '') {
    return null
  }

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(path => path)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t('breadcrumbs.home'), href: '/' }
    ]

    // Build breadcrumb path
    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      
      // Skip dynamic routes like [slug]
      if (path.startsWith('[') && path.endsWith(']')) {
        return
      }

      let label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
      
      // Custom labels for specific pages
      const labelMap: Record<string, string> = {
        'menu': t('breadcrumbs.menu'),
        'gallery': t('breadcrumbs.gallery'),
        'about': t('breadcrumbs.about'),
        'contact': t('breadcrumbs.contact'),
        'reservations': t('breadcrumbs.reservations'),
        'takeaway': t('breadcrumbs.takeaway'),
        'events-catering': t('breadcrumbs.eventsCatering'),
        'blog': t('breadcrumbs.blog'),
        'admin': t('breadcrumbs.admin'),
        'checkout': t('breadcrumbs.checkout'),
        'payment': t('breadcrumbs.payment'),
        'success': t('breadcrumbs.success'),
        'comments': t('breadcrumbs.comments')
      }

      if (labelMap[path]) {
        label = labelMap[path]
      }

      breadcrumbs.push({
        label,
        href: currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Generate JSON-LD structured data for breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.label,
      "item": `https://eastatwest.com${crumb.href === '/' ? '' : crumb.href}`
    }))
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb navigation"
        className={`px-4 sm:px-6 lg:px-8 py-3 border-b ${
          theme === 'dark' 
            ? 'bg-[#1A1A1A] border-gray-700 text-gray-300' 
            : 'bg-gray-50 border-gray-200 text-gray-600'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 mx-2 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                
                {index === breadcrumbs.length - 1 ? (
                  <span
                    className={`font-medium ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}
                    aria-current="page"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className={`hover:text-orange-600 transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'text-gray-300 hover:text-orange-400' 
                        : 'text-gray-600 hover:text-orange-600'
                    }`}
                    itemProp="item"
                  >
                    <span itemProp="name">{crumb.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  )
}