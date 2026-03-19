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
      {/* Container with Glassmorphism (Responsive Aspect Ratio) */}
      <Link 
        to={`/product/${id}`}
        className="relative w-full aspect-[275/400] rounded-[24px] md:rounded-[40px] shadow-2xl cursor-pointer flex items-center justify-center p-4 md:p-8 border border-white/20 bg-white/10 backdrop-blur-xl transition-transform duration-300 md:group-hover:scale-[1.03] overflow-hidden"
      >
        {/* Product Image - Zoomed to Cover (Desktop only) */}
        <div className="w-full h-full transform md:scale-110 md:group-hover:scale-130 transition-transform duration-500">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]"
          />
        </div>
      </Link>

      {/* Product Info below the card - Left Aligned */}
      <div className="flex flex-col items-start text-left w-full px-1">
        <Link to={`/product/${id}`} className="block w-full">
            <h3 className="text-white font-bold text-sm md:text-xl mb-1 leading-tight font-poppins uppercase tracking-tight truncate w-full hover:text-amber-400 transition-colors">
            {name}
            </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              strokeWidth={1}
              className={`w-[14px] h-[14px] md:w-4 md:h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} 
            />
          ))}
          <span className="text-white/60 text-[9px] md:text-[10px] ml-1 font-poppins font-normal">({reviews})</span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 mb-4 font-bold tracking-widest font-poppins">
            <span className="text-white/50 line-through text-xs md:text-lg">₹{oldPrice}</span>
            <span className="text-amber-400 text-xl md:text-2xl font-black tracking-tighter md:tracking-normal">₹{currentPrice}</span>
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
                <Check className="w-4 h-4 md:w-5 md:h-5 " />
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
