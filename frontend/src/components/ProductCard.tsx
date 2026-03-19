import { Star } from 'lucide-react'

interface ProductCardProps {
  image: string
  name: string
  rating: number
  reviews: number
  oldPrice: string
  currentPrice: string
  bgColor: string // Kept in props for theoretical future use, but ignored for glass style
}

const ProductCard = ({ image, name, rating, reviews, oldPrice, currentPrice }: ProductCardProps) => {
  return (
    <div className="group flex flex-col items-start gap-4 transition-all duration-300">
      {/* 275x400 Card Container with Glassmorphism (Transparent Blur) */}
      <div 
        className="relative w-[275px] h-[400px] rounded-[40px] shadow-2xl cursor-pointer flex items-center justify-center p-8 border border-white/20 bg-white/10 backdrop-blur-xl transition-transform duration-300 group-hover:scale-[1.03] overflow-hidden"
      >
        {/* Product Image - Zoomed to Cover (Persistent User Preference) */}
        <div className="w-full h-full transform scale-110 group-hover:scale-130 transition-transform duration-500">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]"
          />
        </div>
      </div>

      {/* Product Info below the card - Left Aligned */}
      <div className="flex flex-col items-start text-left w-full pl-1">
        <h3 className="text-white font-bold text-xl mb-1 leading-tight font-poppins uppercase tracking-tight">
          {name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              strokeWidth={1}
              className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} 
            />
          ))}
          <span className="text-white/60 text-[10px] ml-1 font-poppins font-normal">({reviews})</span>
        </div>
        
        <div className="flex items-center gap-3 mb-4 font-bold tracking-widest font-poppins">
            <span className="text-white/50 line-through text-lg">₹{oldPrice}</span>
            <span className="text-amber-400 text-2xl font-black">₹{currentPrice}</span>
        </div>
        
        <button className="px-8 py-2 bg-transparent border-2 border-white text-white font-extrabold rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-sm font-poppins">
          Add to cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
