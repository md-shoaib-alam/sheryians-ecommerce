import { useParams, Link } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { Star, Check, ShoppingBag, ArrowLeft, ShieldCheck, Zap, Leaf } from 'lucide-react'
import { allProducts } from '../data/products'
import { useCart } from '../context/CartContext'

const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  // Find product by id from the global storage
  const product = useMemo(() => {
    return allProducts.find(p => p.id === Number(id))
  }, [id])

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black font-syne uppercase italic mb-6">Flavor Not Found</h1>
        <Link to="/products" className="bg-white text-red-950 px-8 py-3 rounded-full font-bold uppercase tracking-widest">
            Back to Shop
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 md:pt-40 px-5 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Dynamic Back Navigation */}
      <Link 
        to="/products" 
        className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 md:mb-16 transition-all group font-syne uppercase tracking-widest text-[10px] md:text-xs font-black"
      >
        <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Discover
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 items-start">
        
        {/* Cinematic Product Gallery Sidebar (Left - 5 Columns) */}
        <div className="lg:col-span-5 relative group px-2 md:px-0">
          {/* Main Backdrop Glow matching product color */}
          <div 
            className="absolute inset-0 blur-[80px] md:blur-[120px] opacity-20 -z-10 rounded-full"
            style={{ backgroundColor: product.bgColor }}
          ></div>
          
          <div className="relative aspect-square md:aspect-[4/5] bg-white/5 border border-white/10 rounded-[40px] md:rounded-[100px] overflow-hidden backdrop-blur-3xl shadow-3xl flex items-center justify-center p-8 md:p-12 transition-all group-hover:bg-white/10 duration-700">
             <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover scale-[1.15] md:scale-125 drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)] transition-transform duration-700 md:group-hover:scale-135 md:group-hover:-rotate-3" 
             />
             
             {/* Gourmet Batch Tag */}
             <div className="absolute top-5 left-5 md:top-10 md:left-10 bg-white/10 border border-white/20 backdrop-blur-md px-4 md:px-5 py-1.5 md:py-2 rounded-full flex items-center gap-2">
                 <Leaf className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                 <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] font-syne">Pure Handpicked</span>
             </div>
          </div>
        </div>

        {/* Brand-Focused Product Information Panel (Right - 7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6 md:gap-12 py-2 md:py-4">
          
          {/* Header & Identification */}
          <div>
            <div className="flex items-center gap-4 mb-4 md:mb-6">
               <div className="flex items-center gap-1 bg-amber-400 text-red-950 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-black">
                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-red-950" />
                    <span>{product.rating}</span>
               </div>
               <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-white/30 font-poppins">{product.reviews} Feedbacks</span>
            </div>
            
            <h1 className="text-3xl md:text-7xl font-black font-syne uppercase italic tracking-tighter text-white leading-[0.95] md:leading-[0.9] mb-4">
                {product.name}
            </h1>
            <p className="text-white/60 text-sm md:text-xl font-medium font-poppins max-w-xl leading-relaxed md:leading-relaxed">
                Elevate your snacking experience with our signature {product.name.toLowerCase()} blend. Hand-crafted using ancient techniques and the finest lotus seeds from natural ponds.
            </p>
          </div>

          {/* Pricing & High-Velocity Purchase Actions */}
          <div className="bg-white/5 border border-white/10 p-6 md:p-12 rounded-[40px] md:rounded-[50px] shadow-2xl backdrop-blur-2xl">
              <div className="flex items-end gap-4 md:gap-6 mb-8 md:mb-10">
                  <span className="text-4xl md:text-8xl font-black font-poppins leading-none">₹{product.currentPrice}</span>
                  <div className="flex flex-col mb-1 md:mb-2">
                      <span className="text-white/30 line-through font-bold text-lg md:text-2xl font-poppins tracking-tighter">₹{product.oldPrice}</span>
                      <span className="text-amber-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest font-syne whitespace-nowrap">Launch Offer</span>
                  </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`flex-[2] py-4 md:py-7 rounded-full font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-sm md:text-xl font-syne transition-all duration-500 shadow-3xl flex items-center justify-center gap-2 md:gap-3 active:scale-95
                        ${isAdded 
                            ? 'bg-amber-400 text-red-950 scale-[1.02]' 
                            : 'bg-white text-red-950 hover:bg-amber-400 hover:scale-[1.02]'
                        }
                    `}
                  >
                    {isAdded ? (
                        <>
                            <Check className="w-5 h-5 md:w-6 md:h-6" />
                            <span>Added to bag</span>
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                            <span>Bag this flavor</span>
                        </>
                    )}
                  </button>
                  
                  <button className="flex-1 py-4 md:py-7 rounded-full border border-white/10 hover:border-white transition-all text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs font-syne hover:bg-white/5">
                      Save for Later
                  </button>
              </div>
          </div>

          {/* Boutique Brand Value Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 border-t border-white/5 pt-8 md:pt-4">
              <div className="flex items-center md:flex-col gap-3 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-red-950 transition-all duration-500 shrink-0">
                      <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-[8px] md:text-xs font-black uppercase tracking-widest font-syne">100% Organic</span>
              </div>
              <div className="flex items-center md:flex-col gap-3 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-red-950 transition-all duration-500 shrink-0">
                      <Zap className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-[8px] md:text-xs font-black uppercase tracking-widest font-syne">High Protein</span>
              </div>
              <div className="flex items-center md:flex-col gap-3 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-red-950 transition-all duration-500 shrink-0">
                      <Leaf className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-[8px] md:text-xs font-black uppercase tracking-widest font-syne">Eco-Crafted</span>
              </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductDetails
