import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Check, ShoppingBag, ArrowLeft, ShieldCheck, Zap, Leaf, Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'

const ProductDetails = () => {
    const { id } = useParams()
    const { addToCart } = useCart()
    const navigate = useNavigate()
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [product, setProduct] = useState<any>(null)
    const [recommendations, setRecommendations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<string>('')
    const [isAdded, setIsAdded] = useState(false)

    // Scroll to top on id change
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    // Fetch Product Data
    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true)
            try {
                // Fetch product details
                const data = await api(`/api/products/${id}`)
                setProduct(data)
                setSelectedImage(data.imageUrl)

                // Fetch Recommendations (Latest products by category)
                const recData = await api(`/api/products?category=${data.category}&limit=5`)
                if (recData && recData.products) {
                    setRecommendations(recData.products.filter((p: any) => p.id !== id).slice(0, 4))
                }
            } catch (err) {
                console.error("Discovery error:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchProductData()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF6F6] pt-32">
                <Loader2 className="w-10 h-10 text-brand-red/30 animate-spin" />
            </div>
        )
    }

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
        if (!product) return
        addToCart({
            id: product.id,
            name: product.name,
            currentPrice: product.price,
            image: product.imageUrl
        })
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    const handleDirectBuy = () => {
        if (!product) return
        // Direct buy bypasses the cart and goes straight to checkout
        navigate('/checkout', { 
            state: { 
                directBuyItem: {
                    productId: product.id,
                    name: product.name,
                    currentPrice: String(product.price),
                    image: product.imageUrl,
                    quantity: 1
                } 
            } 
        })
    }

    // Combine hero image with gallery images if any
    const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean)

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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 items-start mb-20">
                
                {/* Cinematic Product Gallery Sidebar (Left - 5 Columns) */}
                <div className="lg:col-span-5 relative group px-2 md:px-0">
                    {/* Main Backdrop Glow matching product color */}
                    <div 
                        className="absolute inset-0 blur-[80px] md:blur-[120px] opacity-10 -z-10 rounded-full"
                        style={{ backgroundColor: product.bgColor || '#5D1A1E' }}
                    ></div>
                    
                    <div className="relative aspect-square md:aspect-[4/5] bg-brand-pink/30 border border-brand-red/5 rounded-[40px] md:rounded-[100px] overflow-hidden backdrop-blur-sm shadow-xl flex items-center justify-center p-8 md:p-12 transition-all group-hover:bg-brand-pink/50 duration-700">
                         <AnimatePresence mode="wait">
                            <motion.img 
                                key={selectedImage}
                                src={selectedImage} 
                                alt={product.name} 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1.15 }}
                                exit={{ opacity: 0, scale: 1.2 }}
                                transition={{ duration: 0.5 }}
                                className="w-full h-full object-cover drop-shadow-[0_25px_25px_rgba(93,26,30,0.2)]" 
                                loading="lazy"
                            />
                         </AnimatePresence>
                         
                         {/* Gourmet Batch Tag */}
                         <div className="absolute top-5 left-5 md:top-10 md:left-10 bg-white/60 border border-brand-red/10 backdrop-blur-md px-4 md:px-5 py-1.5 md:py-2 rounded-full flex items-center gap-2">
                             <Leaf className="w-3 h-3 md:w-4 md:h-4 text-brand-red" />
                             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark">Pure Handpicked</span>
                         </div>
                    </div>

                    {/* Thumbnails row if multiple images */}
                    {allImages.length > 1 && (
                        <div className="flex gap-4 mt-6 overflow-x-auto no-scrollbar pb-2">
                            {allImages.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${selectedImage === img ? 'border-brand-red scale-105' : 'border-brand-red/5 opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Brand-Focused Product Information Panel (Right - 7 Columns) */}
                <div className="lg:col-span-7 flex flex-col gap-6 md:gap-12 py-2 md:py-4">
                    
                    {/* Header & Identification */}
                    <div>
                        <div className="flex items-center gap-4 mb-4 md:mb-6">
                             <div className="flex items-center gap-1 bg-brand-red text-white px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-black">
                                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-white" />
                                    <span>{product.rating || '4.9'}</span>
                             </div>
                             <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-brand-dark/30">{product._count?.reviews || 0} Feedbacks</span>
                             {product.category && (
                                <span className="text-[9px] md:text-[10px] bg-brand-pink text-brand-red px-3 py-1 rounded-full font-black uppercase tracking-widest italic">{product.category}</span>
                             )}
                        </div>
                        
                        <h1 className="text-3xl md:text-7xl font-black uppercase italic tracking-tighter text-brand-dark leading-[0.95] md:leading-[0.9] mb-4">
                                {product.name}
                        </h1>
                        <p className="text-brand-dark/60 text-sm md:text-xl font-medium max-w-xl leading-relaxed md:leading-relaxed">
                                {product.description || `Elevate your snacking experience with our signature ${product.name.toLowerCase()} blend. Hand-crafted using ancient techniques and the finest lotus seeds from natural ponds.`}
                        </p>
                    </div>

                    {/* Pricing & High-Velocity Purchase Actions */}
                    <div className="bg-brand-pink/50 border border-brand-red/10 p-6 md:p-12 rounded-[40px] md:rounded-[50px] shadow-sm">
                            <div className="flex items-end gap-4 md:gap-6 mb-8 md:mb-10 text-brand-dark">
                                    <span className="text-4xl md:text-8xl font-black leading-none text-brand-red">₹{product.price}</span>
                                    <div className="flex flex-col mb-1 md:mb-2 text-brand-dark/30">
                                            {product.mrp > product.price && (
                                                <span className="line-through font-bold text-lg md:text-2xl tracking-tighter whitespace-nowrap">₹{product.mrp}</span>
                                            )}
                                            <span className="text-brand-red text-[8px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Launch Offer</span>
                                    </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                    <button 
                                        onClick={handleAddToCart}
                                        disabled={isAdded || product.stock <= 0}
                                        className={`flex-1 py-4 md:py-7 rounded-full font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-sm md:text-xl transition-all duration-500 shadow-xl shadow-brand-red/10 flex items-center justify-center gap-2 md:gap-3 active:scale-95
                                                ${isAdded 
                                                        ? 'bg-green-600 text-white scale-[1.02]' 
                                                        : 'bg-brand-red text-white hover:bg-brand-dark hover:scale-[1.02]'
                                                }
                                                ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        {product.stock <= 0 ? (
                                            <span>Sold Out</span>
                                        ) : isAdded ? (
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
                                    
                                    <button 
                                        onClick={handleDirectBuy}
                                        disabled={product.stock <= 0}
                                        className="flex-1 py-4 md:py-7 rounded-full border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white transition-all font-black uppercase tracking-[0.2em] text-sm md:text-xl active:scale-95 disabled:opacity-50"
                                    >
                                            Direct Buy
                                    </button>
                            </div>
                    </div>

                    {/* Boutique Brand Value Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 border-t border-brand-red/5 pt-8 md:pt-4">
                            <div className="flex items-center md:flex-col gap-3 group">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-pink/50 border border-brand-red/5 flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shrink-0 text-brand-red">
                                            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <span className="text-[8px] md:text-xs font-black uppercase tracking-widest font-syne text-brand-dark/60">{product.flavour || '100% Organic'}</span>
                            </div>
                            <div className="flex items-center md:flex-col gap-3 group">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-pink/50 border border-brand-red/5 flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shrink-0 text-brand-red">
                                            <Zap className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <span className="text-[8px] md:text-xs font-black uppercase tracking-widest font-syne text-brand-dark/60">{product.weight || 'High Protein'}</span>
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

            {/* ─ Recommendations Discovery Section ─────────────────────────── */}
            {recommendations.length > 0 && (
                <div className="pt-20 border-t border-brand-red/5">
                    <SectionHeading 
                        title="Flavor Discoveries" 
                        subtitle={`More from the ${product.category} collection`} 
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16">
                        {recommendations.map((rec: any) => (
                            <ProductCard 
                                key={rec.id}
                                id={rec.id}
                                name={rec.name}
                                image={rec.imageUrl}
                                currentPrice={rec.price.toString()}
                                oldPrice={rec.mrp ? rec.mrp.toString() : ''}
                                rating={5}
                                reviews={rec._count?.reviews || 0}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}


export default ProductDetails
