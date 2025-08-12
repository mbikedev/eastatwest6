import MenuHeroClient from '@/app/menu/MenuHeroClient'

export const metadata = {
  title: 'Lebanese Menu — Traditional Mezze, Grills & Desserts',
  description: 'Discover our authentic Lebanese menu featuring traditional mezze, grilled specialties, vegetarian options, and homemade desserts. Download our menu or order takeaway online.',
  keywords: [
    'Lebanese menu Brussels',
    'mezze Brussels',
    'Lebanese food menu',
    'authentic Lebanese dishes',
    'Mediterranean menu',
    'halal menu Brussels',
    'vegetarian Lebanese food',
    'Lebanese takeaway menu',
    'Middle Eastern food Brussels'
  ],
  openGraph: {
    title: 'Lebanese Menu — Traditional Mezze, Grills & Desserts | East @ West',
    description: 'Authentic Lebanese cuisine menu with traditional mezze, grilled specialties, and homemade desserts. Available for dine-in and takeaway in Brussels.',
    images: [
      {
        url: '/images/gallery/mezze-selection.webp',
        width: 1200,
        height: 630,
        alt: 'Lebanese mezze selection at East @ West Brussels'
      }
    ],
    url: 'https://eastatwest.com/menu',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lebanese Menu — Traditional Mezze, Grills & Desserts | East @ West',
    description: 'Authentic Lebanese cuisine menu with traditional mezze, grilled specialties, and homemade desserts.',
    images: ['/images/gallery/mezze-selection.webp'],
  },
  alternates: {
    canonical: 'https://eastatwest.com/menu'
  }
}

export default function MenuPage() {
  return <MenuHeroClient />
}


