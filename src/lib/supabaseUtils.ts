import { supabase } from './supabaseClient'

// Types for restaurant data
export interface Reservation {
  id?: string
  name: string
  email: string
  phone: string
  date: string
  start_time: string
  end_time: string
  guests: number
  special_requests?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at?: string
}

export interface MenuItem {
  id?: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  available: boolean
  created_at?: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: 'customer' | 'admin'
  created_at?: string
}

// Reservation functions
export async function createReservation(reservation: Omit<Reservation, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('reservations')
    .insert([reservation])
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating reservation: ${error.message}`)
  }

  return data
}

export async function getReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Error fetching reservations: ${error.message}`)
  }

  return data
}

export async function updateReservationStatus(id: string, status: Reservation['status']) {
  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error updating reservation: ${error.message}`)
  }

  return data
}

// Menu functions
export async function getMenuItems() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true)
    .order('category', { ascending: true })

  if (error) {
    throw new Error(`Error fetching menu items: ${error.message}`)
  }

  return data
}

export async function getMenuItemsByCategory(category: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category', category)
    .eq('available', true)
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Error fetching menu items: ${error.message}`)
  }

  return data
}

// User authentication functions
export async function signUp(email: string, password: string, name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: 'customer'
      }
    }
  })

  if (error) {
    throw new Error(`Error signing up: ${error.message}`)
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw new Error(`Error signing in: ${error.message}`)
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(`Error signing out: ${error.message}`)
  }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    throw new Error(`Error getting user: ${error.message}`)
  }

  return user
}

// File upload function
export async function uploadImage(file: File, bucket: string = 'restaurant-images') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(`Error uploading image: ${uploadError.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
} 