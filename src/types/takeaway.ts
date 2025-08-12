// Language types
export type Language = 'en' | 'fr' | 'nl'

export interface MultilingualText {
  en: string
  fr: string
  nl: string
}

// Product types
export interface Product {
  id: string
  name: MultilingualText
  description: MultilingualText
  price: number
  category: string
  image_url: string
  available: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// Cart types
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// Order types
export type DeliveryType = 'pickup' | 'delivery'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'

export interface DeliveryAddress {
  street: string
  city: string
  postal_code: string
  country: string
}

export interface OrderFormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_type: DeliveryType
  delivery_address?: DeliveryAddress
  delivery_date: string
  delivery_time: string
  additional_notes?: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: MultilingualText
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_type: DeliveryType
  delivery_address?: DeliveryAddress
  delivery_date: string
  delivery_time: string
  additional_notes?: string
  total_amount: number
  stripe_payment_intent_id?: string
  payment_status: PaymentStatus
  order_status: OrderStatus
  language: Language
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

// Stripe types
export interface PaymentIntent {
  id: string
  client_secret: string
  amount: number
  currency: string
  status: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Categories
export const PRODUCT_CATEGORIES = [
  'set-menus',
  'cold-mezzes',
  'hot-mezzes',
  'salads',
  'sandwiches',
  'lunch-dishes',
  'skewers',
  'desserts',
  'drinks'
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number] 