'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../../context/ThemeContext'
import { useCart } from '../../../context/CartContext'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  AddressElement
} from '@stripe/react-stripe-js'

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  clientSecret: string
  orderId: string
  amount: number
}

const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret, orderId, amount }) => {
  const { t } = useTranslation('common')
  const { theme } = useTheme()
  const { cart } = useCart()
  const router = useRouter()
  
  const stripe = useStripe()
  const elements = useElements()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'Payment failed')
        setLoading(false)
        return
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/takeaway/payment/success?order_id=${orderId}`,
        },
      })

      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-4">{t('payment.processing')}</h2>
        <p className="text-lg opacity-70">{t('payment.redirecting')}</p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={`p-8 rounded-xl ${
        theme === 'dark' 
          ? 'bg-[#1A1A1A]/20  border border-[#A8D5BA]/20' 
          : 'bg-white/80  border border-[#A8D5BA]/20 shadow-lg'
      }`}>
        <h2 className="text-2xl font-bold mb-6">{t('payment.title')}</h2>
        
        {/* Order Summary */}
        <div className={`mb-6 p-4 rounded-lg ${
          theme === 'dark' ? 'bg-[#1A1A1A]/20' : 'bg-gray-50'
        }`}>
          <h3 className="font-semibold mb-2">{t('payment.orderSummary')}</h3>
          <div className="space-y-2">
            {cart.items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.product.name.en} × {item.quantity}</span>
                <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>{t('payment.total')}</span>
                <span>€{amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Billing Address */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('payment.billingAddress')}</h3>
            <AddressElement 
              options={{
                mode: 'billing',
                allowedCountries: ['BE', 'NL', 'FR', 'DE']
              }}
            />
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('payment.paymentMethod')}</h3>
            <PaymentElement 
              options={{
                layout: 'tabs',
                paymentMethodOrder: ['card', 'paypal', 'apple_pay', 'google_pay']
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !stripe}
            className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white hover:from-[#A8D5BA] hover:to-[#1A1A1A]'
                : 'bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white hover:from-[#A8D5BA] hover:to-[#1A1A1A]'
            }`}
          >
            {loading ? t('payment.processing') : t('payment.payNow')}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => router.push('/takeaway/checkout')}
            className={`w-full py-3 rounded-lg text-lg font-medium transition-all duration-300 ${
              theme === 'dark'
                ? 'border border-[#A8D5BA]/30 text-[#A8D5BA] hover:bg-[#A8D5BA]/10'
                : 'border border-[#A8D5BA]/30 text-[#A8D5BA] hover:bg-[#A8D5BA]/10'
            }`}
          >
            {t('payment.cancel')}
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default function PaymentPage() {
  const { t } = useTranslation('common')
  const { theme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const orderIdParam = searchParams.get('order_id')
    const clientSecretParam = searchParams.get('client_secret')

    if (!orderIdParam || !clientSecretParam) {
      setError('Invalid payment session')
      setLoading(false)
      return
    }

    setOrderId(orderIdParam)
    setClientSecret(clientSecretParam)

    // Fetch order details to get amount
    fetch(`/api/orders/${orderIdParam}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAmount(data.data.total_amount)
        }
      })
      .catch(() => {
        setError('Failed to load order details')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [searchParams])

  if (loading) {
    return (
      <div className={`min-h-screen pt-16 flex items-center justify-center ${
        theme === 'dark' ? 'bg-[#1A1A1A] text-[#F5F0E6]' : 'bg-[#F5F0E6] text-[#1A1A1A]'
      }`}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">💳</div>
          <h2 className="text-2xl font-bold mb-4">{t('payment.loading')}</h2>
          <p className="text-lg opacity-70">{t('payment.preparing')}</p>
        </motion.div>
      </div>
    )
  }

  if (error || !clientSecret || !orderId) {
    return (
      <div className={`min-h-screen pt-16 flex items-center justify-center ${
        theme === 'dark' ? 'bg-[#1A1A1A] text-[#F5F0E6]' : 'bg-[#F5F0E6] text-[#1A1A1A]'
      }`}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">{t('payment.error')}</h2>
          <p className="text-lg opacity-70 mb-6">{error || t('payment.invalidSession')}</p>
          <button
            onClick={() => router.push('/takeaway/checkout')}
            className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#A8D5BA] hover:to-[#1A1A1A] transition-all duration-300"
          >
            {t('payment.backToCheckout')}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#1A1A1A] text-[#F5F0E6]' : 'bg-[#F5F0E6] text-[#1A1A1A]'
    }`}>
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            className={`text-4xl sm:text-5xl font-bold mb-6 text-center ${
              theme === 'dark' 
                ? 'text-white' 
                : 'bg-gradient-to-r from-[#A8D5BA] via-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent'
            }`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {t('payment.title')}
          </motion.h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Elements 
          stripe={stripePromise} 
          options={{
            clientSecret,
            appearance: {
              theme: theme === 'dark' ? 'night' : 'stripe',
              variables: {
                colorPrimary: '#A8D5BA',
                colorBackground: theme === 'dark' ? '#1A1A1A' : '#F5F0E6',
                colorText: theme === 'dark' ? '#F5F0E6' : '#1A1A1A',
              },
            },
          }}
        >
          <PaymentForm 
            clientSecret={clientSecret} 
            orderId={orderId} 
            amount={amount}
          />
        </Elements>
      </div>
    </div>
  )
} 