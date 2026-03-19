import { useState, useEffect } from 'react'
import HeroBanner from '../components/HeroBanner'
import ProductSection from '../components/ProductSection'
import { api } from '../lib/api'

const Home = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api('/api/products?limit=10')
        setProducts(data.products || [])
      } catch (err) {
        console.error('Failed to fetch home products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const newArrivals = products.slice(0, 4)
  const bestSellers = products.slice(4, 10)

  return (
    <div className="pb-20">
      <HeroBanner />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* New Arrivals with Scrolling mobile row */}
        {loading ? (
             <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" /></div>
        ) : (
          <ProductSection 
            title="NEW ARRIVALS" 
            products={newArrivals} 
            isScrollable={true}
          />
        )}

        {/* Best Sellers with Grid mobile layout */}
        <div className="mt-6 md:mt-32">
          {!loading && (
            <ProductSection 
              title="BEST SELLERS" 
              products={bestSellers} 
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
