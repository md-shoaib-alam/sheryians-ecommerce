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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF6F6] pt-32">
                <Loader2 className="w-10 h-10 text-brand-red/30 animate-spin" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center pt-32 bg-[#FAF6F6]">
                <h1 className="text-4xl font-black font-syne uppercase italic mb-6 text-brand-dark">Flavor Not Discovered</h1>
                <Link to="/products" className="bg-brand-red text-white px-12 py-4 rounded-full font-black uppercase tracking-widest font-syne text-[10px] hover:bg-brand-dark transition-all">
                    Back to Collection
                </Link>
            </div>
        )
    }

    const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean)

    return (
        <div className="min-h-screen bg-[#FAF6F6] pt-24 pb-20 md:pt-40 px-5 md:px-12 lg:px-20 max-w-[1440px] mx-auto scrollbar-hide">
            {/* Navigation Backdrop Layer */}
            <Link 
                to="/products" 
                className="inline-flex items-center gap-2 text-brand-dark/40 hover:text-brand-red mb-10 transition-all group font-syne uppercase tracking-widest text-[10px] font-black"
            >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Return to Shop
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-32">
                
                {/* ─ Mobile-First Swipe Gallery (Visible on Mobile only) ───────── */}
                <div className="lg:hidden -mx-5 px-5 mb-4 overflow-hidden">
                    <div 
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scrollbar-hide gap-4 pb-4"
                        onScroll={(e) => {
                            const container = e.currentTarget
                            const index = Math.round(container.scrollLeft / container.clientWidth)
                            if (allImages[index] && selectedImage !== allImages[index]) {
                                setSelectedImage(allImages[index])
                            }
                        }}
                    >
                        {allImages.map((img, idx) => (
                            <div key={idx} className="min-w-full snap-center">
                                <div className="relative aspect-[4/5] bg-brand-pink/30 border border-brand-red/5 rounded-[40px] overflow-hidden backdrop-blur-sm shadow-xl">
                                    <img 
                                        src={img} 
                                        loading="lazy"
                                        alt={`${product.name} view ${idx + 1}`} 
                                        className="w-full h-full object-cover" 
                                    />
                                    {/* Tag mapping */}
                                    <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                                        {product.category && (
                                            <span className="bg-white/60 border border-brand-red/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[7px] font-black uppercase tracking-widest font-syne text-brand-red">
                                                {product.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Dynamic Thumbnails Row */}
                    {allImages.length > 1 && (
                        <div className="flex overflow-x-auto no-scrollbar scrollbar-hide gap-3 py-2 -mx-2 px-2 items-center">
                            {allImages.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => {
                                        setSelectedImage(img)
                                        if (scrollContainerRef.current) {
                                            scrollContainerRef.current.scrollTo({
                                                left: scrollContainerRef.current.clientWidth * idx,
                                                behavior: 'smooth'
                                            })
                                        }
                                    }}
                                    className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all shrink-0
                                        ${selectedImage === img ? 'border-brand-red scale-110 shadow-md' : 'border-brand-red/5 opacity-40'}
                                    `}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─ Cinematic Desktop Gallery (Visible on Desktop only) ─────── */}
                <div className="hidden lg:col-span-6 lg:flex flex-row-reverse gap-6">
                    {/* Main Showcase */}
                    <div className="relative flex-1 group">
                        <div 
                            className="absolute inset-0 blur-[100px] opacity-10 -z-10 rounded-full"
                            style={{ backgroundColor: product.bgColor || '#5D1A1E' }}
                        ></div>
                        
                        <div className="relative aspect-[4/5] bg-brand-pink/30 border border-brand-red/5 rounded-[60px] overflow-hidden backdrop-blur-sm shadow-xl">
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={selectedImage}
                                    src={selectedImage} 
                                    alt={product.name} 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="w-full h-full object-cover absolute inset-0" 
                                />
                            </AnimatePresence>
                            
                            {/* Tags layer */}
                            <div className="absolute bottom-10 left-10 flex flex-wrap gap-2">
                                {product.category && (
                                    <span className="bg-white/60 border border-brand-red/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest font-syne text-brand-red">
                                        {product.category}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails Sidebar */}
                    {allImages.length > 1 && (
                        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar scrollbar-hide shrink-0 w-24">
                            {allImages.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-24 h-24 rounded-[32px] overflow-hidden border-2 transition-all shrink-0
                                        ${selectedImage === img ? 'border-brand-red scale-105 shadow-md' : 'border-brand-red/5 opacity-60 hover:opacity-100'}
                                    `}
                                >
                                    <img src={img} loading="lazy" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─ Product Information Architecture ─────────────────────── */}
                <div className="lg:col-span-6 flex flex-col gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-brand-red text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] font-syne italic shrink-0">
                                {product.category}
                            </span>
                            <div className="flex items-center gap-2 bg-brand-pink/50 border border-brand-red/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
                                <Star className="w-2.5 h-2.5 fill-brand-red text-brand-red" />
                                <span className="text-[10px] font-black font-syne text-brand-dark">4.9</span>
                                <div className="w-[1px] h-3 bg-brand-red/10 mx-1" />
                                <span className="text-[8px] font-black text-brand-dark/30 uppercase tracking-widest font-syne">{product._count?.reviews || 0} REVIEWS</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black font-syne uppercase italic tracking-tighter text-brand-dark leading-none mb-6">
                            {product.name}
                        </h1>

                        <div className="flex items-center md:items-end gap-5 mb-10">
                             <span className="text-3xl md:text-6xl font-black font-poppins text-brand-red leading-none">₹{product.price}</span>
                             <div className="flex flex-col">
                                 {product.mrp > product.price && (
                                     <span className="text-brand-dark/20 line-through font-bold text-sm md:text-lg font-poppins">₹{product.mrp}</span>
                                 )}
                                 <span className="text-brand-red text-[8px] font-black uppercase tracking-widest font-syne">Handmade Box</span>
                             </div>
                        </div>

                        <p className="text-brand-dark/60 text-xs md:text-lg font-medium font-poppins max-w-xl leading-relaxed">
                            {product.description || "Discover the essence of pure snacking perfection. Slow-roasted and infused with premium ingredients, our makhana offers a crunch that's as healthy as it is satisfying."}
                        </p>
                    </div>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-6 bg-brand-pink/30 border border-brand-red/5 rounded-[32px] backdrop-blur-sm">
                        {[
                            { label: 'Weight', value: product.weight || '100g', icon: Zap },
                            { label: 'Flavour', value: product.flavour || 'Organic', icon: Leaf },
                            { label: 'Quality', value: 'Prime', icon: ShieldCheck }
                        ].map((spec, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                                <span className="text-brand-dark/30 uppercase text-[7px] font-black font-syne tracking-widest">{spec.label}</span>
                                <div className="flex items-center gap-2 text-brand-dark">
                                    <spec.icon className="w-3 h-3 text-brand-red" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider font-syne">{spec.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Purchase Logic */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={handleAddToCart}
                            disabled={isAdded || product.stock <= 0}
                            className={`flex-1 py-5 md:py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] md:text-xs font-syne transition-all duration-500 shadow-xl flex items-center justify-center gap-3 active:scale-95
                                ${isAdded 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-brand-red text-white hover:bg-brand-dark shadow-brand-red/20'
                                }
                                ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            {product.stock <= 0 ? (
                                <span>Sold Out</span>
                            ) : isAdded ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>Added to Bag</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>Add to Bag</span>
                                </>
                            )}
                        </button>

                        <button 
                            onClick={handleDirectBuy}
                            disabled={product.stock <= 0}
                            className="flex-1 py-5 md:py-6 rounded-full border-2 border-brand-red text-brand-red font-black uppercase tracking-[0.2em] text-[10px] md:text-xs font-syne transition-all duration-500 shadow-sm hover:bg-brand-red hover:text-white active:scale-95 disabled:opacity-50"
                        >
                            Direct Buy
                        </button>
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
