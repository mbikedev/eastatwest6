import { createClient } from './supabaseServer'
import { Product, ProductCategory } from '../types/takeaway'

// Fetch all products
export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }

  return data || []
}

// Fetch products by category
export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('available', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching products by category:', error)
    throw new Error(`Failed to fetch products for category: ${category}`)
  }

  return data || []
}

// Fetch single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('available', true)
    .single()

  if (error) {
    console.error('Error fetching product by ID:', error)
    return null
  }

  return data
}

// Get product categories
export async function getProductCategories(): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('available', true)

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  // Get unique categories
  const categories = [...new Set(data?.map(item => item.category) || [])]
  return categories
} 