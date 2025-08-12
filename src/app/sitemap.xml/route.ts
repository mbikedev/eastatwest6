import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://eastatwest.com'
  const currentDate = new Date().toISOString()

  // Define static pages with their priorities and change frequencies
  const staticPages = [
    {
      url: '',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: '/menu',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: '/gallery',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: '/about',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      url: '/contact',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      url: '/reservations',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: '/takeaway',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: '/events-catering',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6
    },
    {
      url: '/blog',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.6
    }
  ]

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${page.url}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/fr${page.url}"/>
    <xhtml:link rel="alternate" hreflang="nl" href="${baseUrl}/nl${page.url}"/>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}