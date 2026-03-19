import { ChevronDown } from 'lucide-react'
import ProductCard from './ProductCard'

interface ProductSectionProps {
  products: any[]
  showSort?: boolean
  showNoMore?: boolean
  columns?: number
  title?: string
}

const ProductSection = ({
  products,
  showSort = false,
  showNoMore = false,
  columns = 4,
  title
}: ProductSectionProps) => {
  return (
    <div className="w-full">
      {title && (
        <div className="mb-10 text-center">
          <h2 className="text-4xl sm:text-7xl font-black text-white uppercase italic tracking-tighter transform -skew-x-12 inline-block relative px-4 font-syne">
            {title}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-red-600 shadow-[0_4px_10px_rgba(255,0,0,0.5)]"></div>
          </h2>
        </div>
      )}

      {showSort && (
        <div className="flex justify-end mb-8">
          <button className="flex items-center gap-2 border-2 border-white px-6 py-2 rounded-full font-bold text-sm tracking-widest hover:bg-white hover:text-red-900 transition-all font-syne">
            SORT BY <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-x-8 gap-y-12`}>
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {showNoMore && (
        <div className="mt-24 mb-10 text-center">
          <p className="text-white text-lg font-bold tracking-[0.2em] opacity-80 font-syne uppercase">No More Items</p>
        </div>
      )}
    </div>
  )
}

export default ProductSection
