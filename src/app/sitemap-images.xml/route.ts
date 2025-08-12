import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://eastatwest.com'
  const currentDate = new Date().toISOString()

  // Define important images for SEO
  const images = [
    {
      loc: `${baseUrl}/`,
      images: [
        {
          url: `${baseUrl}/images/banner.webp`,
          caption: 'East @ West Lebanese Restaurant interior in Brussels',
          title: 'East @ West Restaurant',
          geoLocation: 'Brussels, Belgium'
        },
        {
          url: `${baseUrl}/images/gallery/falafel.webp`,
          caption: 'Golden-fried chickpea fritters served with tahini sauce and fresh herbs',
          title: 'Traditional Lebanese Falafel'
        },
        {
          url: `${baseUrl}/images/gallery/kebbe.webp`,
          caption: 'Traditional bulgur croquettes stuffed with seasoned minced beef and walnuts',
          title: 'Lebanese Kebbe'
        }
      ]
    },
    {
      loc: `${baseUrl}/menu`,
      images: [
        {
          url: `${baseUrl}/images/gallery/mezze-selection.webp`,
          caption: 'Traditional Lebanese mezze selection at East @ West',
          title: 'Lebanese Mezze Platter'
        }
      ]
    },
    {
      loc: `${baseUrl}/gallery`,
      images: [
        {
          url: `${baseUrl}/images/gallery/aish el saraya.webp`,
          caption: 'Layered dessert with sweetened biscuits, vegan pudding, and orange blossom water',
          title: 'Aish el Saraya Dessert'
        },
        {
          url: `${baseUrl}/images/gallery/houmos.webp`,
          caption: 'Traditional Lebanese hummus with olive oil and spices',
          title: 'Lebanese Hummus'
        }
      ]
    },
    {
      loc: `${baseUrl}/about`,
      images: [
        {
          url: `${baseUrl}/images/about-us.webp`,
          caption: 'East @ West Lebanese Restaurant team and story',
          title: 'About East @ West Restaurant'
        }
      ]
    }
  ]

  // Generate Images XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${currentDate}</lastmod>
${page.images.map(img => `    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:caption>${img.caption}</image:caption>
      <image:title>${img.title}</image:title>
      ${img.geoLocation ? `<image:geo_location>${img.geoLocation}</image:geo_location>` : ''}
    </image:image>`).join('\n')}
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}