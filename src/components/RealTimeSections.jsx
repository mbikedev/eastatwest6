'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'
import Image from 'next/image'

const RealTimeSections = () => {
  const { t } = useTranslation('common')
  const { theme } = useTheme()

  // Mock data - in a real app, this would come from a CMS or API
  const [todaysSpecials] = useState([
    {
      id: 1,
      nameKey: "specials.taratorChicken.title",
      descriptionKey: "specials.taratorChicken.description",
      price: "€8.50",
      image: "/images/gallery/poulet-torator.webp"
    },
    {
      id: 2,
      nameKey: "specials.kibbeh.title",
      descriptionKey: "specials.kibbeh.description",
      price: "€5.00",
      image: "/images/gallery/kebbe.webp"
    },
    {
      id: 3,
      nameKey: "specials.vegan.title",
      descriptionKey: "specials.vegan.description",
      price: "€18.50",
      image: "/images/gallery/eggplant.jpg"
    }
  ])

  const [upcomingEvents] = useState([
    {
      id: 1,
      title: "Wine Tasting Evening",
      date: "February 15, 2025",
      time: "7:00 PM",
      description: "Join us for an exclusive wine tasting featuring Mediterranean wines paired with our signature dishes."
    },
    {
      id: 2,
      title: "Chef's Table Experience",
      date: "February 22, 2025",
      time: "6:30 PM",
      description: "An intimate dining experience with Chef Hanna featuring a 7-course tasting menu."
    },
    {
      id: 3,
      title: "Mediterranean Cooking Class",
      date: "March 1, 2025",
      time: "2:00 PM",
      description: "Learn to prepare authentic Mediterranean dishes with our head chef."
    }
  ])

  const [seasonalPromotions] = useState([
    {
      id: 1,
      title: "Winter Warmth Menu",
      description: "Hearty Mediterranean dishes to warm your soul during the cold months",
      discount: "15% off",
      validUntil: "March 31, 2025"
    },
    {
      id: 2,
      title: "Valentine's Special",
      description: "Romantic dinner for two with complimentary champagne",
      discount: "Special Price €89",
      validUntil: "February 14, 2025"
    }
  ])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <div className={`py-5 px-4 sm:px-6 lg:px-8 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Today's Specials */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{fontFamily: 'Times New Roman, serif'}}>
              {t('realtime.todaysSpecials')}
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {todaysSpecials.map((special, index) => (
              <motion.div
                key={special.id}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48">
                  <Image
                    src={special.image}
                    alt={t(special.nameKey)}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-semibold">
                    {special.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`} style={{fontFamily: 'Times New Roman, serif'}}>
                    {t(special.nameKey)}
                  </h3>
                  <p className={`text-sm text-black`}>
                    {t(special.descriptionKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>


      </div>
    </div>
  )
}

export default RealTimeSections
