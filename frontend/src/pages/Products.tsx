import { useState, useEffect } from 'react'
import ProductSection from '../components/ProductSection'
import { api } from '../lib/api'
import { Loader2 } from 'lucide-react'

const Products = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api('/api/products')
        setProducts(data.products || [])
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <Loader2 className="w-10 h-10 text-brand-red/20 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      <ProductSection 
        title="Our Full Collection"
        products={products} 
        showSort={true} 
        showNoMore={products.length > 0} 
      />
    </div>
  )
}

export default Products
