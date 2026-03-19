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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent pt-32">
                <Loader2 className="w-10 h-10 text-white/10 animate-spin" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center pt-32">
                <h1 className="text-4xl font-black font-syne uppercase italic mb-6">Flavor Not Discovered</h1>
                <Link to="/products" className="bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest font-syne text-[10px] hover:bg-amber-400 transition-all">
                    Back to Collection
                </Link>
            </div>
        )
    }

    // Combine hero image with gallery images if any
    const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean)

    return (
        <div className="min-h-screen pt-24 pb-20 md:pt-40 px-5 md:px-8 max-w-7xl mx-auto">
            {/* Navigation Backdrop Layer */}
            <Link 
                to="/products" 
                className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-10 transition-all group font-syne uppercase tracking-widest text-[10px] font-black"
            >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Return to Shop
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-32">
                
                {/* ─ Mobile-First Swipe Gallery (Visible on Mobile only) ───────── */}
                <div className="lg:hidden -mx-5 px-5 mb-4 overflow-hidden">
                    <div 
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pb-4"
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
                                <div className="relative aspect-[3/4] bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-3xl">
                                    <img 
                                        src={img} 
                                        loading="lazy"
                                        alt={`${product.name} view ${idx + 1}`} 
                                        className="w-full h-full object-cover" 
                                    />
                                    {/* Tag mapping */}
                                    <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                                        {product.tags?.slice(0, 1).map((tag: string) => (
                                            <span key={tag} className="bg-white/10 border border-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full text-[7px] font-black uppercase tracking-widest font-syne">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Dynamic Thumbnails Row */}
                    {allImages.length > 1 && (
                        <div className="flex overflow-x-auto no-scrollbar gap-3 py-2 -mx-2 px-2 items-center">
                            {allImages.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => {
                                        setSelectedImage(img)
                                        // Scroll the main container to the correct item using ref
                                        if (scrollContainerRef.current) {
                                            scrollContainerRef.current.scrollTo({
                                                left: scrollContainerRef.current.clientWidth * idx,
                                                behavior: 'smooth'
                                            })
                                        }
                                    }}
                                    className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all shrink-0
                                        ${selectedImage === img ? 'border-amber-400 scale-110' : 'border-white/5 opacity-40'}
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
                            style={{ backgroundColor: 'white' }}
                        ></div>
                        
                        <div className="relative aspect-[4/5] bg-white/5 border border-white/10 rounded-[60px] overflow-hidden backdrop-blur-3xl shadow-3xl">
                            <AnimatePresence>
                                <motion.img 
                                    key={selectedImage}
                                    src={selectedImage} 
                                    alt={product.name} 
                                    fetchPriority="high"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="w-full h-full object-cover absolute inset-0" 
                                />
                            </AnimatePresence>
                            
                            {/* Tags layer */}
                            <div className="absolute bottom-10 left-10 flex flex-wrap gap-2">
                                {product.tags?.slice(0, 2).map((tag: string) => (
                                    <span key={tag} className="bg-white/10 border border-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest font-syne">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails Sidebar */}
                    {allImages.length > 1 && (
                        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar shrink-0 w-24">
                            {allImages.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-24 h-24 rounded-[32px] overflow-hidden border-2 transition-all shrink-0
                                        ${selectedImage === img ? 'border-amber-400 bg-white/10' : 'border-white/5 bg-white/5 hover:border-white/20'}
                                    `}
                                >
                                    <img src={img} loading="lazy" className="w-full h-full object-cover opacity-80" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─ Product Information Architecture ─────────────────────── */}
                <div className="lg:col-span-6 flex flex-col gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-white text-black px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] font-syne italic shrink-0">
                                {product.category}
                            </span>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-xl">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                <span className="text-[10px] font-black font-syne text-white">4.9</span>
                                <div className="w-[1px] h-3 bg-white/10 mx-1" />
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest font-syne">{product._count?.reviews || 0} REVIEWS</span>
                            </div>
                        </div>

                        <h1 className="text-2xl md:text-5xl font-black font-syne uppercase italic tracking-tighter text-white leading-none mb-6 truncate max-w-full">
                            {product.name}
                        </h1>

                        <div className="flex items-center md:items-end gap-5 mb-10">
                             <span className="text-3xl md:text-5xl font-black font-poppins text-white leading-none">₹{product.price}</span>
                             <div className="flex flex-col">
                                 {product.mrp > product.price && (
                                     <span className="text-white/20 line-through font-bold text-sm md:text-lg font-poppins">₹{product.mrp}</span>
                                 )}
                                 <span className="text-amber-400 text-[8px] font-black uppercase tracking-widest font-syne">Limited Drop</span>
                             </div>
                        </div>

                        <p className="text-white/40 text-xs md:text-base font-medium font-poppins max-w-xl leading-relaxed">
                            {product.description || "Discover the essence of pure snacking perfection. Slow-roasted and infused with premium ingredients, our makhana offers a crunch that's as healthy as it is satisfying."}
                        </p>
                    </div>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-3xl">
                        {[
                            { label: 'Weight', value: product.weight || '100g', icon: Zap },
                            { label: 'Flavour', value: product.flavour || 'Organic', icon: Leaf },
                            { label: 'Quality', value: 'Prime', icon: ShieldCheck }
                        ].map((spec, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                                <span className="text-white/20 uppercase text-[7px] font-black font-syne tracking-widest">{spec.label}</span>
                                <div className="flex items-center gap-2 text-white">
                                    <spec.icon className="w-3 h-3 text-amber-400" />
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
                            className={`flex-1 py-5 md:py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] md:text-xs font-syne transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 active:scale-95
                                ${isAdded 
                                    ? 'bg-green-500 text-white border-green-500' 
                                    : 'bg-white text-black hover:bg-amber-400'
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
                            className="flex-1 py-5 md:py-6 rounded-full bg-amber-400 text-black font-black uppercase tracking-[0.2em] text-[10px] md:text-xs font-syne transition-all duration-500 shadow-2xl hover:bg-white hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Direct Buy
                        </button>
                    </div>
                </div>
            </div>

            {/* ─ Recommendations Discovery Section ─────────────────────────── */}
            {recommendations.length > 0 && (
                <div className="pt-20 border-t border-white/5">
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
