import { useState } from 'react'
import { Star, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

interface ProductCardProps {
  id: number
  image: string
  name: string
  rating: number
  reviews: number
  oldPrice: string
  currentPrice: string
}

const ProductCard = ({ id, image, name, rating, reviews, oldPrice, currentPrice }: ProductCardProps) => {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart({ id, image, name, currentPrice })
    setIsAdded(true)
    
    // Reset back to "Add to cart" after 2 seconds for a fresh look
    setTimeout(() => {
        setIsAdded(false)
    }, 2000)
  }

  return (
    <div className="group flex flex-col items-start gap-3 md:gap-4 transition-all duration-300 w-full max-w-[275px]">
      {/* Container with Glassmorphism (Stable Aspect Ratio) */}
      <Link 
        to={`/product/${id}`}
        className="relative w-full aspect-[3/4] rounded-[32px] md:rounded-[40px] shadow-xl cursor-pointer flex items-center justify-center p-2 border border-brand-red/5 bg-brand-pink/30 hover:bg-brand-pink/50 backdrop-blur-sm transition-all duration-500 md:group-hover:scale-[1.02] overflow-hidden"
      >
        {/* Product Image - Fixed scaling and centering */}
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center rounded-[26px] md:rounded-[34px]">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110"
            loading="lazy"
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      {/* Product Info below the card - Fixed Heights for stability */}
      <div className="flex flex-col items-start text-left w-full px-1">
        <Link to={`/product/${id}`} className="block w-full">
            <div className="h-10 md:h-9 flex items-start">
              <h3 className="text-brand-dark font-bold text-sm md:text-lg leading-tight uppercase tracking-tight line-clamp-2 w-full hover:text-brand-red transition-colors">
                {name}
              </h3>
            </div>
        </Link>
        
        <div className="flex items-center gap-1 mb-2 md:mb-1 h-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              strokeWidth={1}
              className={`w-3.5 h-3.5 md:w-3.5 md:h-3.5 ${i < rating ? 'fill-brand-red text-brand-red' : 'text-brand-dark/10'}`} 
            />
          ))}
          <span className="text-brand-dark/30 text-[9px] md:text-[9px] ml-1 font-bold tracking-widest">({reviews})</span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 mb-4 font-bold tracking-widest h-8">
            {oldPrice && <span className="text-brand-dark/30 line-through text-[10px] md:text-sm">₹{oldPrice}</span>}
            <span className="text-brand-red text-lg md:text-xl font-black tracking-tighter">₹{currentPrice}</span>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`w-full md:w-auto px-4 md:px-8 py-2.5 md:py-2.5 border-2 rounded-full font-extrabold transition-all duration-300 uppercase tracking-widest text-[11px] md:text-sm whitespace-nowrap shadow-sm flex items-center justify-center gap-2 active:scale-95
            ${isAdded 
              ? 'bg-brand-red border-brand-red text-white scale-105' 
              : 'bg-white md:bg-transparent text-brand-dark md:text-brand-dark border-brand-red/10 md:hover:bg-brand-red md:hover:text-white md:hover:border-brand-red md:hover:scale-105'
            }
          `}
        >
          {isAdded ? (
            <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to cart</span>
            </>
          ) : (
            <span>Add to cart</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
