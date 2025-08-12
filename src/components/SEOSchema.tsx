export interface RestaurantSchemaProps {
  name?: string
  description?: string
  address?: {
    street: string
    city: string
    region: string
    postalCode: string
    country: string
  }
  phone?: string
  email?: string
  url?: string
  image?: string[]
  priceRange?: string
  cuisine?: string[]
  openingHours?: Array<{
    day: string[]
    opens: string
    closes: string
  }>
  rating?: {
    value: number
    count: number
  }
  awards?: string[]
}

export interface MenuItemSchemaProps {
  name: string
  description: string
  image?: string
  price: string
  currency: string
  category: string
  nutrition?: {
    calories?: number
    protein?: string
    carbs?: string
    fat?: string
  }
  allergens?: string[]
  dietary?: string[] // vegetarian, vegan, gluten-free, etc.
}

export interface BlogPostSchemaProps {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  image?: string
  url: string
  category?: string
  tags?: string[]
}

export function generateRestaurantSchema(props: RestaurantSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${props.url}/#restaurant`,
    "name": props.name || "East @ West",
    "description": props.description || "Authentic Lebanese restaurant in Brussels",
    "url": props.url || "https://eastatwest.com",
    "image": props.image || ["https://eastatwest.com/images/banner.webp"],
    "servesCuisine": props.cuisine || ["Lebanese", "Mediterranean", "Middle Eastern"],
    "priceRange": props.priceRange || "€€",
    "currenciesAccepted": "EUR",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Bancontact"],
    "address": props.address ? {
      "@type": "PostalAddress",
      "streetAddress": props.address.street,
      "addressLocality": props.address.city,
      "addressRegion": props.address.region,
      "postalCode": props.address.postalCode,
      "addressCountry": props.address.country
    } : undefined,
    "telephone": props.phone,
    "email": props.email,
    "openingHoursSpecification": props.openingHours?.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hours.day,
      "opens": hours.opens,
      "closes": hours.closes
    })),
    "aggregateRating": props.rating ? {
      "@type": "AggregateRating",
      "ratingValue": props.rating.value,
      "reviewCount": props.rating.count,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "award": props.awards,
    "hasMenu": {
      "@type": "Menu",
      "url": `${props.url}/menu`,
      "inLanguage": ["en", "fr", "nl"]
    },
    "acceptsReservations": true,
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Takeaway Available",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Catering Services", 
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Vegetarian Options",
        "value": true
      }
    ]
  }
}

export function generateMenuItemSchema(props: MenuItemSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    "name": props.name,
    "description": props.description,
    "image": props.image,
    "offers": {
      "@type": "Offer",
      "price": props.price,
      "priceCurrency": props.currency,
      "availability": "https://schema.org/InStock"
    },
    "menuAddOn": props.category,
    "nutrition": props.nutrition ? {
      "@type": "NutritionInformation",
      "calories": props.nutrition.calories,
      "proteinContent": props.nutrition.protein,
      "carbohydrateContent": props.nutrition.carbs,
      "fatContent": props.nutrition.fat
    } : undefined,
    "suitableForDiet": props.dietary?.map(diet => `https://schema.org/${diet}Diet`),
    "allergens": props.allergens
  }
}

export function generateBlogPostSchema(props: BlogPostSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": props.title,
    "description": props.description,
    "author": {
      "@type": "Person",
      "name": props.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "East @ West",
      "logo": {
        "@type": "ImageObject",
        "url": "https://eastatwest.com/images/logo.webp"
      }
    },
    "datePublished": props.datePublished,
    "dateModified": props.dateModified || props.datePublished,
    "image": props.image,
    "url": props.url,
    "mainEntityOfPage": props.url,
    "articleSection": props.category,
    "keywords": props.tags?.join(", "),
    "inLanguage": "en",
    "isPartOf": {
      "@type": "Blog",
      "name": "East @ West Blog",
      "url": "https://eastatwest.com/blog"
    }
  }
}

interface SEOSchemaProps {
  type: 'restaurant' | 'menuItem' | 'blogPost'
  data: RestaurantSchemaProps | MenuItemSchemaProps | BlogPostSchemaProps
}

export default function SEOSchema({ type, data }: SEOSchemaProps) {
  let schema: any

  switch (type) {
    case 'restaurant':
      schema = generateRestaurantSchema(data as RestaurantSchemaProps)
      break
    case 'menuItem':
      schema = generateMenuItemSchema(data as MenuItemSchemaProps)
      break
    case 'blogPost':
      schema = generateBlogPostSchema(data as BlogPostSchemaProps)
      break
    default:
      return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}