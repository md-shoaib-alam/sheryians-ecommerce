import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HeroBanner from '../components/HeroBanner'
import ProductSection from '../components/ProductSection'
import Benefits from '../components/Features'
import WhyChooseUs from '../components/WhyChooseUs'
import Certifications from '../components/Certifications'
import Testimonials from '../components/Testimonials'
import Marketplace from '../components/Marketplace'
import { api } from '../lib/api'

const Home = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api('/api/products?limit=12')
        setProducts(data.products || [])
      } catch (err) {
        console.error('Failed to fetch home products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const featuredProducts = products.slice(0, 8)

  return (
    <div className="bg-white">
      <HeroBanner />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Benefits />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-16 text-center">Featured Collection</h2>
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" /></div>
        ) : (
          <ProductSection
            title=""
            products={featuredProducts}
            isScrollable={true}
          />
        )}
      </div>

      <WhyChooseUs />

      <Certifications />

      <Testimonials />

      <Marketplace />
    </div>
  )
}

export default Home
