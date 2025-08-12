'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../../../context/ThemeContext'
import { useCart } from '../../../../context/CartContext'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, Clock, MapPin } from 'lucide-react'

interface OrderDetails {
  id: string
  customer_name: string
  customer_email: string
  total_amount: number
  delivery_type: 'pickup' | 'delivery'
  delivery_date: string
  delivery_time: string
  delivery_address?: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  items: Array<{
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
  status: string
  created_at: string
}

export default function PaymentSuccessPage() {
  const { t } = useTranslation('common')
  const { theme } = useTheme()
  const { clearCart } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const orderId = searchParams.get('order_id')
    
    if (!orderId) {
      setError('No order ID provided')
      setLoading(false)
      return
    }

    // Fetch order details
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrderDetails(data.data)
          // Clear cart after successful payment
          clearCart()
        } else {
          setError('Failed to load order details')
        }
      })
      .catch(() => {
        setError('Failed to load order details')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [searchParams, clearCart])

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
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold mb-4">{t('payment.loading')}</h2>
          <p className="text-lg opacity-70">{t('payment.preparing')}</p>
        </motion.div>
      </div>
    )
  }

  if (error || !orderDetails) {
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
          <p className="text-lg opacity-70 mb-6">{error || t('payment.orderNotFound')}</p>
          <button
            onClick={() => router.push('/takeaway')}
            className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#A8D5BA] hover:to-[#1A1A1A] transition-all duration-300"
          >
            {t('payment.backToMenu')}
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
          <motion.div 
            className="text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${
              theme === 'dark' 
                ? 'text-white' 
                : 'bg-gradient-to-r from-[#A8D5BA] via-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent'
            }`}>
              {t('payment.success.title')}
            </h1>
            <p className="text-xl opacity-70">
              {t('payment.success.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Confirmation */}
          <motion.div 
            className={`p-8 rounded-xl ${
              theme === 'dark' 
                ? 'bg-[#1A1A1A]/20  border border-[#A8D5BA]/20' 
                : 'bg-white/80  border border-[#A8D5BA]/20 shadow-lg'
            }`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold">{t('payment.success.orderConfirmed')}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-semibold">{t('payment.success.orderId')}: </span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                  {orderDetails.id}
                </span>
              </div>

              <div>
                <span className="font-semibold">{t('payment.success.customerName')}: </span>
                <span>{orderDetails.customer_name}</span>
              </div>

              <div>
                <span className="font-semibold">{t('payment.success.totalAmount')}: </span>
                <span className="text-[#A8D5BA] font-bold">€{orderDetails.total_amount.toFixed(2)}</span>
              </div>

              <div>
                <span className="font-semibold">{t('payment.success.deliveryType')}: </span>
                <span className="capitalize">
                  {orderDetails.delivery_type === 'pickup' 
                    ? t('payment.success.pickup') 
                    : t('payment.success.delivery')
                  }
                </span>
              </div>

              <div>
                <span className="font-semibold">{t('payment.success.deliveryDate')}: </span>
                <span>{new Date(orderDetails.delivery_date).toLocaleDateString()}</span>
              </div>

              <div>
                <span className="font-semibold">{t('payment.success.deliveryTime')}: </span>
                <span>{orderDetails.delivery_time}</span>
              </div>

              {orderDetails.delivery_type === 'delivery' && orderDetails.delivery_address && (
                <div>
                  <span className="font-semibold">{t('payment.success.deliveryAddress')}: </span>
                  <div className="mt-1 text-sm opacity-70">
                    {orderDetails.delivery_address.street}<br />
                    {orderDetails.delivery_address.postal_code} {orderDetails.delivery_address.city}<br />
                    {orderDetails.delivery_address.country}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div 
            className={`p-8 rounded-xl ${
              theme === 'dark' 
                ? 'bg-[#1A1A1A]/20  border border-[#A8D5BA]/20' 
                : 'bg-white/80  border border-[#A8D5BA]/20 shadow-lg'
            }`}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">{t('payment.success.orderItems')}</h2>
            
            <div className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-[#1A1A1A]/20' : 'bg-gray-50'
                }`}>
                  <div>
                    <div className="font-semibold">{item.product_name}</div>
                    <div className="text-sm opacity-70">
                      {t('payment.success.quantity')}: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#A8D5BA]">
                      €{item.total_price.toFixed(2)}
                    </div>
                    <div className="text-sm opacity-70">
                      €{item.unit_price.toFixed(2)} {t('payment.success.each')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`border-t mt-6 pt-4 ${
              theme === 'dark' ? 'border-[#A8D5BA]/20' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-center text-xl font-bold">
                <span>{t('payment.success.total')}</span>
                <span className="text-[#A8D5BA]">€{orderDetails.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Next Steps */}
        <motion.div 
          className={`mt-8 p-8 rounded-xl ${
            theme === 'dark' 
              ? 'bg-[#1A1A1A]/20  border border-[#A8D5BA]/20' 
              : 'bg-white/80  border border-[#A8D5BA]/20 shadow-lg'
          }`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">{t('payment.success.nextSteps')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Mail className="w-12 h-12 text-[#A8D5BA] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('payment.success.emailSent')}</h3>
              <p className="text-sm opacity-70">{t('payment.success.emailDescription')}</p>
            </div>

            <div className="text-center">
              <Clock className="w-12 h-12 text-[#A8D5BA] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('payment.success.preparation')}</h3>
              <p className="text-sm opacity-70">{t('payment.success.preparationDescription')}</p>
            </div>

            <div className="text-center">
              <MapPin className="w-12 h-12 text-[#A8D5BA] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">
                {orderDetails.delivery_type === 'pickup' 
                  ? t('payment.success.pickupReady') 
                  : t('payment.success.deliveryOnWay')
                }
              </h3>
              <p className="text-sm opacity-70">
                {orderDetails.delivery_type === 'pickup' 
                  ? t('payment.success.pickupDescription') 
                  : t('payment.success.deliveryDescription')
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button
            onClick={() => router.push('/takeaway')}
            className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white px-8 py-4 rounded-lg font-semibold hover:from-[#A8D5BA] hover:to-[#1A1A1A] transition-all duration-300"
          >
            {t('payment.success.orderAgain')}
          </button>

          <button
            onClick={() => router.push('/')}
            className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              theme === 'dark'
                ? 'border border-[#A8D5BA]/30 text-[#A8D5BA] hover:bg-[#A8D5BA]/10'
                : 'border border-[#A8D5BA]/30 text-[#A8D5BA] hover:bg-[#A8D5BA]/10'
            }`}
          >
            {t('payment.success.backToHome')}
          </button>
        </motion.div>
      </div>
    </div>
  )
} 