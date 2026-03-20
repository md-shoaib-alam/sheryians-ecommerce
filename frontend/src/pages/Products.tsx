import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { api } from '../lib/api'
import { Loader2, SlidersHorizontal, ChevronDown } from 'lucide-react'

const Products = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('featured')
  const [filterRating, setFilterRating] = useState(0)
  const [priceRange, setPriceRange] = useState(1000)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => (p.rating || 5) >= filterRating && (p.price || 0) <= priceRange)
    
    if (sortBy === 'price-low') {
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === 'price-high') {
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy === 'bestselling') {
        result.sort((a, b) => (b.ordersCount || 0) - (a.ordersCount || 0))
    }
    return result
  }, [products, sortBy, filterRating, priceRange])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">Products</h1>
                <p className="text-primary/60 font-medium uppercase tracking-widest text-[10px]">Premium Lotus seed collection</p>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 border px-6 py-2.5 rounded-xl transition-all font-bold text-xs
                      ${isFilterOpen ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-gray-200 hover:border-primary'}`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </button>
                
                <div className="relative group">
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-primary text-white px-8 py-2.5 rounded-xl font-bold text-xs cursor-pointer hover:bg-primary/95 transition-all outline-none pr-12 shadow-lg shadow-primary/10"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="bestselling">Bestselling</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                </div>
            </div>
        </div>

        <AnimatePresence>
            {isFilterOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-12"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                        <div className="flex flex-col gap-4">
                            <label className="text-primary/60 font-bold uppercase tracking-widest text-[10px]">Max Price: ₹{priceRange}</label>
                            <input 
                                type="range" 
                                min="0" 
                                max="1000" 
                                step="50" 
                                value={priceRange} 
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="accent-primary h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-primary/60 font-bold uppercase tracking-widest text-[10px]">Minimum Rating: {filterRating}+ Stars</label>
                            <div className="flex gap-2">
                                {[0, 3, 4, 5].map(r => (
                                    <button 
                                        key={r}
                                        onClick={() => setFilterRating(r)}
                                        className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${filterRating === r ? 'bg-primary text-white shadow-md' : 'bg-white text-primary border border-gray-200 hover:border-primary/30'}`}
                                    >
                                        {r === 0 ? 'All' : `${r}★`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredAndSortedProducts.map((product) => (
                <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <ProductCard 
                        id={product.id}
                        name={product.name}
                        image={product.imageUrl || product.image}
                        currentPrice={product.price?.toString()}
                        oldPrice={product.mrp?.toString()}
                        rating={product.rating || 5}
                        reviews={product._count?.reviews || 0}
                    />
                </motion.div>
            ))}
        </div>
        
        {filteredAndSortedProducts.length === 0 && (
            <div className="py-20 text-center space-y-4">
                <p className="text-primary/40 font-serif text-2xl">No products found matching your filters.</p>
                <button 
                  onClick={() => { setFilterRating(0); setPriceRange(1000); }} 
                  className="bg-primary text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md"
                >
                  Reset Filters
                </button>
            </div>
        )}
      </div>
    </div>
  )
}

export default Products
