'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../../context/ThemeContext'
import { useCart } from '../../../context/CartContext'
import { OrderFormData, DeliveryType, MultilingualText } from '../../../types/takeaway'
import { motion } from 'framer-motion'

export default function CheckoutPage() {
  const { t, i18n } = useTranslation('common')
  const { theme } = useTheme()
  const { cart } = useCart()
  const router = useRouter()

  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_type: 'pickup',
    delivery_address: {
      street: '',
      city: '',
      postal_code: '',
      country: 'Belgium'
    },
    delivery_date: '',
    delivery_time: '',
    additional_notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push('/takeaway')
    }
  }, [cart.items.length, router])

  // Set minimum date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setFormData(prev => ({ ...prev, delivery_date: today }))
  }, [])

  // Get product name and description in current language
  const getLocalizedText = (multilingualText: MultilingualText) => {
    const currentLang = i18n.language as keyof MultilingualText
    return multilingualText[currentLang] || multilingualText.en || ''
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = t('checkout.validation.nameRequired')
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = t('checkout.validation.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = t('checkout.validation.emailInvalid')
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = t('checkout.validation.phoneRequired')
    } else if (formData.customer_phone.replace(/\D/g, '').length < 10) {
      newErrors.customer_phone = t('checkout.validation.phoneInvalid')
    }

    if (!formData.delivery_date) {
      newErrors.delivery_date = t('checkout.validation.dateRequired')
    }

    if (!formData.delivery_time) {
      newErrors.delivery_time = t('checkout.validation.timeRequired')
    }

    if (formData.delivery_type === 'delivery') {
      if (!formData.delivery_address?.street.trim()) {
        newErrors.delivery_street = t('checkout.validation.streetRequired')
      }
      if (!formData.delivery_address?.city.trim()) {
        newErrors.delivery_city = t('checkout.validation.cityRequired')
      }
      if (!formData.delivery_address?.postal_code.trim()) {
        newErrors.delivery_postal_code = t('checkout.validation.postalCodeRequired')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Create order
      const orderData = {
        ...formData,
        total_amount: cart.total,
        language: i18n.language,
        items: cart.items.map(item => ({
          product_id: item.product.id,
          product_name: getLocalizedText(item.product.name),
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity
        }))
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      let result: any
      result = await response.json()
      if (!response.ok) {
        throw new Error(`Order API ${response.status}: ${result?.error || JSON.stringify(result)}`)
      }

      if (result.success) {
        // Create Stripe payment intent
        const paymentResponse = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: result.data.id,
            amount: cart.total,
            currency: 'eur'
          })
        })

        let paymentResult: any
        paymentResult = await paymentResponse.json()
        if (!paymentResponse.ok) {
          throw new Error(`Payment API ${paymentResponse.status}: ${paymentResult?.error || JSON.stringify(paymentResult)}`)
        }

        if (paymentResult.success) {
          // Redirect to payment page
          router.push(`/takeaway/payment?order_id=${result.data.id}&client_secret=${paymentResult.data.client_secret}`)
        } else {
          throw new Error(paymentResult.error || 'Payment setup failed')
        }
      } else {
        throw new Error(result.error || 'Order creation failed')
      }
      } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error?.message || t('checkout.error'))
    } finally {
      setLoading(false)
    }
  }

  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    if (field.startsWith('delivery_address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        delivery_address: {
          ...prev.delivery_address!,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  if (cart.items.length === 0) {
    return null // Will redirect
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
            {t('checkout.title')}
          </motion.h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <motion.div 
            className={`p-8 rounded-xl ${
              theme === 'dark' 
                ? 'bg-[#1A1A1A]/20  border border-[#A8D5BA]/20' 
                : 'bg-white/80  border border-[#A8D5BA]/20 shadow-lg'
            }`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">{t('checkout.orderSummary')}</h2>
            
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.product.id} className={`flex items-center space-x-4 p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-[#1A1A1A]/20' : 'bg-gray-50'
                }`}>
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.image_url}
                      alt={getLocalizedText(item.product.name)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{getLocalizedText(item.product.name)}</h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-[#F5F0E6]/70' : 'text-[#1A1A1A]/70'
                    }`}>
                      €{item.product.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#A8D5BA]">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`border-t pt-6 ${
              theme === 'dark' ? 'border-[#A8D5BA]/20' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-center text-2xl font-bold">
                <span>{t('checkout.total')}</span>
                <span className="text-[#A8D5BA]">€{cart.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Checkout Form */}
          <motion.div 
            className={`p-8 rounded-xl ${
              theme === 'dark' 
                ? 'bg-[#1A1A1A]/20  border border-[#A8D5BA]/20' 
                : 'bg-white/80  border border-[#A8D5BA]/20 shadow-lg'
            }`}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">{t('checkout.orderDetails')}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('checkout.customerInfo')}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="customer_name" className="block text-sm font-medium mb-2">
                      {t('checkout.form.name')} *
                    </label>
                    <input
                      type="text"
                      id="customer_name"
                      value={formData.customer_name}
                      onChange={(e) => handleChange('customer_name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        errors.customer_name
                          ? 'border-red-500'
                          : theme === 'dark'
                            ? 'border-[#A8D5BA]/30 bg-[#1A1A1A]/20 text-[#F5F0E6]'
                            : 'border-[#A8D5BA]/30 bg-white text-[#1A1A1A]'
                      }`}
                      placeholder={t('checkout.form.namePlaceholder')}
                    />
                    {errors.customer_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="customer_email" className="block text-sm font-medium mb-2">
                      {t('checkout.form.email')} *
                    </label>
                    <input
                      type="email"
                      id="customer_email"
                      value={formData.customer_email}
                      onChange={(e) => handleChange('customer_email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        errors.customer_email
                          ? 'border-red-500'
                          : theme === 'dark'
                            ? 'border-[#A8D5BA]/30 bg-[#1A1A1A]/20 text-[#F5F0E6]'
                            : 'border-[#A8D5BA]/30 bg-white text-[#1A1A1A]'
                      }`}
                      placeholder={t('checkout.form.emailPlaceholder')}
                    />
                    {errors.customer_email && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="customer_phone" className="block text-sm font-medium mb-2">
                      {t('checkout.form.phone')} *
                    </label>
                    <input
                      type="tel"
                      id="customer_phone"
                      value={formData.customer_phone}
                      onChange={(e) => handleChange('customer_phone', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        errors.customer_phone
                          ? 'border-red-500'
                          : theme === 'dark'
                            ? 'border-[#A8D5BA]/30 bg-[#1A1A1A]/20 text-[#F5F0E6]'
                            : 'border-[#A8D5BA]/30 bg-white text-[#1A1A1A]'
                      }`}
                      placeholder={t('checkout.form.phonePlaceholder')}
                    />
                    {errors.customer_phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('checkout.deliveryOptions')}</h3>
                
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <label className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.delivery_type === 'pickup'
                        ? theme === 'dark'
                          ? 'border-[#A8D5BA] bg-[#A8D5BA]/10'
                          : 'border-[#A8D5BA] bg-[#A8D5BA]/10'
                        : theme === 'dark'
                          ? 'border-[#A8D5BA]/30 hover:border-[#A8D5BA]/50'
                          : 'border-[#A8D5BA]/30 hover:border-[#A8D5BA]/50'
                    }`}>
                      <input
                        type="radio"
                        name="delivery_type"
                        value="pickup"
                        checked={formData.delivery_type === 'pickup'}
                        onChange={(e) => handleChange('delivery_type', e.target.value as DeliveryType)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-2xl mb-2">🏪</div>
                        <div className="font-semibold">{t('checkout.pickup.title')}</div>
                        <div className="text-sm opacity-70">{t('checkout.pickup.description')}</div>
                      </div>
                    </label>

                    <label className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.delivery_type === 'delivery'
                        ? theme === 'dark'
                          ? 'border-[#A8D5BA] bg-[#A8D5BA]/10'
                          : 'border-[#A8D5BA] bg-[#A8D5BA]/10'
                        : theme === 'dark'
                          ? 'border-[#A8D5BA]/30 hover:border-[#A8D5BA]/50'
                          : 'border-[#A8D5BA]/30 hover:border-[#A8D5BA]/50'
                    }`}>
                      <input
                        type="radio"
                        name="delivery_type"
                        value="delivery"
                        checked={formData.delivery_type === 'delivery'}
                        onChange={(e) => handleChange('delivery_type', e.target.value as DeliveryType)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-2xl mb-2">🚚</div>
                        <div className="font-semibold">{t('checkout.delivery.title')}</div>
                        <div className="text-sm opacity-70">{t('checkout.delivery.description')}</div>
                      </div>
                    </label>
                  </div>

                  {/* Delivery Address - only show if delivery is selected */}
                  {formData.delivery_type === 'delivery' && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <label htmlFor="delivery_street" className="block text-sm font-medium mb-2">
                          {t('checkout.form.street')} *
                        </label>
                        <input
                          type="text"
                          id="delivery_street"
                          value={formData.delivery_address?.street || ''}
                          onChange={(e) => handleChange('delivery_address.street', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            errors.delivery_street
                              ? 'border-red-500'
                              : theme === 'dark'
                                ? 'border-[#A8D5BA]/30 bg-[#1A1A1A]/20 text-[#F5F0E6]'
                                : 'border-[#A8D5BA]/30 bg-white text-[#1A1A1A]'
                          }`}
                          placeholder={t('checkout.form.streetPlaceholder')}
                        />
                        {errors.delivery_street && (
                          <p className="text-red-500 text-sm mt-1">{errors.delivery_street}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="delivery_city" className="block text-sm font-medium mb-2">
                            {t('checkout.form.city')} *
                          </label>
                          <input
                            type="text"
                            id="delivery_city"
                            value={formData.delivery_address?.city || ''}
                            onChange={(e) => handleChange('delivery_address.city', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                              errors.delivery_city
                                ? 'border-red-500'
                                : theme === 'dark'
                                  ? 'border-[#A8D5BA]/30 bg-[#1A1A1A]/20 text-[#F5F0E6]'
                                  : 'border-[#A8D5BA]/30 bg-white text-[#1A1A1A]'
                            }`}
                            placeholder={t('checkout.form.cityPlaceholder')}
                          />
                          {errors.delivery_city && (
                            <p className="text-red-500 text-sm mt-1">{errors.delivery_city}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="delivery_postal_code" className="block text-sm font-medium mb-2">
                            {t('checkout.form.postalCode')} *
                          </label>
                          <input
                            type="text"
                            id="delivery_postal_code"
                            value={formData.delivery_address?.postal_code || ''}
                            onChange={(e) => handleChange('delivery_address.postal_code', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                              errors.delivery_postal_code
                                ? 'border-red-500'
                                : theme === 'dark'
                                  ? 'border-[#A8D5BA]/30 bg-[#1A1A1A]/20 text-[#F5F0E6]'
                                  : 'border-[#A8D5BA]/30 bg-white text-[#1A1A1A]'
                            }`}
                            placeholder={t('checkout.form.postalCodePlaceholder')}
                          />
                          {errors.delivery_postal_code && (
                            <p className="text-red-500 text-sm mt-1">{errors.delivery_postal_code}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Date and Time */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('checkout.dateTime')}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="delivery_date" className="block text-sm font-medium mb-2">
                      {t('checkout.form.date')} *
                    </label>
                    <input
                      type="date"
                      id="delivery_date"
                      value={formData.delivery_date}
                      onChange={(e) => handleChange('delivery_date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        errors.delivery_date
                          ? 'border-red-500'
                          : theme === 'dark'
                            ? 'border-[#A8D5BA]/30 bg-[#1A1A1A]/20 text-[#F5F0E6]'
                            : 'border-[#A8D5BA]/30 bg-white text-[#1A1A1A]'
                      }`}
                    />
                    {errors.delivery_date && (
                      <p className="text-red-500 text-sm mt-1">{errors.delivery_date}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="delivery_time" className="block text-sm font-medium mb-2">
                      {t('checkout.form.time')} *
                    </label>
                    <input
                      type="time"
                      id="delivery_time"
                      value={formData.delivery_time}
                      onChange={(e) => handleChange('delivery_time', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        errors.delivery_time
                          ? 'border-red-500'
                          : theme === 'dark'
                            ? 'border-[#A8D5BA]/30 bg-[#1A1A1A]/20 text-[#F5F0E6]'
                            : 'border-[#A8D5BA]/30 bg-white text-[#1A1A1A]'
                      }`}
                    />
                    {errors.delivery_time && (
                      <p className="text-red-500 text-sm mt-1">{errors.delivery_time}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="additional_notes" className="block text-sm font-medium mb-2">
                  {t('checkout.form.notes')}
                </label>
                <textarea
                  id="additional_notes"
                  value={formData.additional_notes}
                  onChange={(e) => handleChange('additional_notes', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'border-[#A8D5BA]/30 bg-[#1A1A1A]/20 text-[#F5F0E6]'
                      : 'border-[#A8D5BA]/30 bg-white text-[#1A1A1A]'
                  }`}
                  placeholder={t('checkout.form.notesPlaceholder')}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] text-white py-4 rounded-lg text-lg font-semibold hover:from-[#A8D5BA] hover:to-[#1A1A1A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('checkout.processing') : t('checkout.proceedToPayment')}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
