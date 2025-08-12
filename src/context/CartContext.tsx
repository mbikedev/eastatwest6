'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Product, CartItem, Cart } from '../types/takeaway'

// Cart Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

// Cart Context Type
interface CartContextType {
  cart: Cart
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

// Calculate cart totals
const calculateCartTotals = (items: CartItem[]): { total: number; itemCount: number } => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

// Cart Reducer
const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.find(item => item.product.id === action.payload.id)
      if (existingItem) {
        return state.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...state, { product: action.payload, quantity: 1 }]
    }
    
    case 'REMOVE_ITEM':
      return state.filter(item => item.product.id !== action.payload)
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return state.filter(item => item.product.id !== action.payload.productId)
      }
      return state.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
    }
    
    case 'CLEAR_CART':
      return []
    
    case 'LOAD_CART':
      return action.payload
    
    default:
      return state
  }
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart Provider Component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [])
  const [isCartOpen, setIsCartOpen] = React.useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('takeaway-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('takeaway-cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Calculate cart totals
  const { total, itemCount } = calculateCartTotals(cartItems)

  const cart: Cart = {
    items: cartItems,
    total,
    itemCount
  }

  // Cart Actions
  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom Hook to use Cart Context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext 