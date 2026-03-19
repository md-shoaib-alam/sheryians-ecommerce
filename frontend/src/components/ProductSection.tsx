import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import ProductCard from './ProductCard'
import SectionHeading from './SectionHeading'

interface ProductSectionProps {
  title: string
  products: any[]
  isScrollable?: boolean
  showSort?: boolean
  showNoMore?: boolean
}

const ProductSection = ({ title, products, isScrollable = false, showSort = false, showNoMore = false }: ProductSectionProps) => {
  const [sortBy, setSortBy] = useState('featured')
  const [isOpen, setIsOpen] = useState(false)

  // Sophisticated sorting logic
  const sortedProducts = useMemo(() => {
    let result = [...products]
    if (sortBy === 'price-low') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }
    return result
  }, [products, sortBy])

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
  ]

  return (
    <section className="mb-10 lg:mb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between items-start mb-2 md:mb-10 gap-6">
        {/* Signature Branding Heading */}
        <div className="flex-1">
          <SectionHeading title={title} />
        </div>

        {/* Pixel-Perfect Custom Branded Dropdown - Positioned Right on Mobile */}
        {showSort && (
          <div className="relative md:mb-2 z-20 self-end md:self-auto">
            <div 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 border border-brand-red/20 px-5 py-1.5 rounded-full cursor-pointer hover:bg-brand-pink transition-all"
            >
              <span className="text-brand-dark text-sm font-bold lowercase tracking-tighter">sort by</span>
              <ChevronDown className={`w-4 h-4 text-brand-dark transition-transform ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
            </div>
            
            {isOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-white backdrop-blur-2xl border border-brand-red/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                {sortOptions.map((option) => (
                  <div 
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value)
                      setIsOpen(false)
                    }}
                    className={`px-5 py-3 text-[10px] md:text-xs uppercase font-black cursor-pointer transition-colors whitespace-nowrap
                      ${sortBy === option.value ? 'bg-brand-red text-white' : 'text-brand-dark hover:bg-brand-pink'}
                    `}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid Layout - 2 columns on mobile (or scroll), 4 on desktop */}
      <div className={`
        ${isScrollable ? 'flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide md:grid' : 'grid grid-cols-2'} 
        md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-16 md:gap-12 md:justify-items-center pt-0 pb-4 md:py-4
      `}>
        {sortedProducts.map((product) => (
          <div key={product.id} className={isScrollable ? 'w-[43vw] max-w-[275px] flex-shrink-0 md:w-auto' : ''}>
            <ProductCard 
              id={product.id}
              name={product.name}
              image={product.imageUrl || product.image}
              currentPrice={product.price?.toString()}
              oldPrice={product.mrp?.toString()}
              rating={product.rating || 5}
              reviews={product._count?.reviews || 0}
            />
          </div>
        ))}
      </div>

      {/* High-Fidelity "No More Items" Signal */}
      {showNoMore && products.length > 0 && (
          <div className="w-full flex flex-col items-center justify-center pt-20 pb-10 gap-4 opacity-30 text-brand-dark">
              <div className="h-[1px] w-20 bg-brand-dark"></div>
               <p className="font-black uppercase tracking-[0.4em] text-[10px] md:text-xs text-center">
                  no more items found
              </p>
              <div className="h-[1px] w-20 bg-brand-dark"></div>
          </div>
      )}
    </section>
  )
}

export default ProductSection
