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
        className="relative w-full aspect-[3/4] rounded-[32px] md:rounded-[40px] shadow-2xl cursor-pointer flex items-center justify-center p-2 border border-white/20 bg-white/10 backdrop-blur-3xl transition-transform duration-500 md:group-hover:scale-[1.02] overflow-hidden"
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
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      {/* Product Info below the card - Fixed Heights for stability */}
      <div className="flex flex-col items-start text-left w-full px-1">
        <Link to={`/product/${id}`} className="block w-full">
            <div className="h-10 md:h-9 flex items-start">
              <h3 className="text-white font-bold text-sm md:text-lg leading-tight font-syne uppercase tracking-tight line-clamp-2 w-full hover:text-amber-400 transition-colors">
                {name}
              </h3>
            </div>
        </Link>
        
        <div className="flex items-center gap-1 mb-2 md:mb-1 h-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              strokeWidth={1}
              className={`w-3.5 h-3.5 md:w-3.5 md:h-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} 
            />
          ))}
          <span className="text-white/40 text-[9px] md:text-[9px] ml-1 font-poppins font-bold tracking-widest">({reviews})</span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 mb-4 font-bold tracking-widest font-poppins h-8">
            {oldPrice && <span className="text-white/30 line-through text-[10px] md:text-sm">₹{oldPrice}</span>}
            <span className="text-amber-400 text-lg md:text-xl font-black tracking-tighter">₹{currentPrice}</span>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`w-full md:w-auto px-4 md:px-8 py-2.5 md:py-2.5 border-2 rounded-full font-extrabold transition-all duration-300 uppercase tracking-widest text-[11px] md:text-sm font-poppins whitespace-nowrap shadow-xl flex items-center justify-center gap-2 active:scale-95
            ${isAdded 
              ? 'bg-amber-400 border-amber-400 text-red-950 scale-105' 
              : 'bg-white md:bg-transparent text-black md:text-white border-white md:hover:bg-white md:hover:text-black md:hover:scale-105'
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
