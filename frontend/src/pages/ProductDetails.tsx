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
        <h1 className="text-4xl font-black font-syne uppercase italic mb-6 text-brand-dark">Flavor Not Found</h1>
        <Link to="/products" className="bg-brand-red text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-brand-dark transition-all">
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
        className="inline-flex items-center gap-2 text-brand-dark/40 hover:text-brand-red mb-8 md:mb-16 transition-all group tracking-widest text-[10px] md:text-xs font-black"
      >
        <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Discover
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 items-start">
        
        {/* Cinematic Product Gallery Sidebar (Left - 5 Columns) */}
        <div className="lg:col-span-5 relative group px-2 md:px-0">
          {/* Main Backdrop Glow matching product color */}
          <div 
            className="absolute inset-0 blur-[80px] md:blur-[120px] opacity-10 -z-10 rounded-full"
            style={{ backgroundColor: product.bgColor }}
          ></div>
          
          <div className="relative aspect-square md:aspect-[4/5] bg-brand-pink/30 border border-brand-red/5 rounded-[40px] md:rounded-[100px] overflow-hidden backdrop-blur-sm shadow-xl flex items-center justify-center p-8 md:p-12 transition-all group-hover:bg-brand-pink/50 duration-700">
             <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover scale-[1.15] md:scale-125 drop-shadow-[0_25px_25px_rgba(93,26,30,0.2)] transition-transform duration-700 md:group-hover:scale-135 md:group-hover:-rotate-3" 
                loading="lazy"
             />
             
             {/* Gourmet Batch Tag */}
             <div className="absolute top-5 left-5 md:top-10 md:left-10 bg-white/60 border border-brand-red/10 backdrop-blur-md px-4 md:px-5 py-1.5 md:py-2 rounded-full flex items-center gap-2">
                 <Leaf className="w-3 h-3 md:w-4 md:h-4 text-brand-red" />
                 <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark">Pure Handpicked</span>
             </div>
          </div>
        </div>

        {/* Brand-Focused Product Information Panel (Right - 7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6 md:gap-12 py-2 md:py-4">
          
          {/* Header & Identification */}
          <div>
            <div className="flex items-center gap-4 mb-4 md:mb-6">
               <div className="flex items-center gap-1 bg-brand-red text-white px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-black">
                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-white" />
                    <span>{product.rating}</span>
               </div>
               <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-brand-dark/30">{product.reviews} Feedbacks</span>
            </div>
            
            <h1 className="text-3xl md:text-7xl font-black uppercase italic tracking-tighter text-brand-dark leading-[0.95] md:leading-[0.9] mb-4">
                {product.name}
            </h1>
            <p className="text-brand-dark/60 text-sm md:text-xl font-medium max-w-xl leading-relaxed md:leading-relaxed">
                Elevate your snacking experience with our signature {product.name.toLowerCase()} blend. Hand-crafted using ancient techniques and the finest lotus seeds from natural ponds.
            </p>
          </div>

          {/* Pricing & High-Velocity Purchase Actions */}
          <div className="bg-brand-pink/50 border border-brand-red/10 p-6 md:p-12 rounded-[40px] md:rounded-[50px] shadow-sm">
              <div className="flex items-end gap-4 md:gap-6 mb-8 md:mb-10 text-brand-dark">
                  <span className="text-4xl md:text-8xl font-black leading-none text-brand-red">₹{product.currentPrice}</span>
                  <div className="flex flex-col mb-1 md:mb-2 text-brand-dark/30">
                      <span className="line-through font-bold text-lg md:text-2xl tracking-tighter whitespace-nowrap">₹{product.oldPrice}</span>
                      <span className="text-brand-red text-[8px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Launch Offer</span>
                  </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`flex-[2] py-4 md:py-7 rounded-full font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-sm md:text-xl transition-all duration-500 shadow-xl shadow-brand-red/10 flex items-center justify-center gap-2 md:gap-3 active:scale-95
                        ${isAdded 
                            ? 'bg-brand-red text-white scale-[1.02]' 
                            : 'bg-brand-red text-white hover:bg-brand-dark hover:scale-[1.02]'
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
                  
                  <button className="flex-1 py-4 md:py-7 rounded-full border border-brand-red/10 hover:border-brand-red transition-all text-brand-dark font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-brand-pink">
                      Save for Later
                  </button>
              </div>
          </div>

          {/* Boutique Brand Value Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 border-t border-brand-red/5 pt-8 md:pt-4">
              <div className="flex items-center md:flex-col gap-3 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-pink/50 border border-brand-red/5 flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shrink-0 text-brand-red">
                      <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-[8px] md:text-xs font-black uppercase tracking-widest font-syne text-brand-dark/60">100% Organic</span>
              </div>
              <div className="flex items-center md:flex-col gap-3 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-pink/50 border border-brand-red/5 flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shrink-0 text-brand-red">
                      <Zap className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-[8px] md:text-xs font-black uppercase tracking-widest font-syne text-brand-dark/60">High Protein</span>
              </div>
              <div className="flex items-center md:flex-col gap-3 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-pink/50 border border-brand-red/5 flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shrink-0 text-brand-red">
                      <Leaf className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-[8px] md:text-xs font-black uppercase tracking-widest font-syne text-brand-dark/60">Eco-Crafted</span>
              </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductDetails
