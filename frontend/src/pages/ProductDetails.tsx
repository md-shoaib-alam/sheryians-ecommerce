import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
            <div className="min-h-screen flex items-center justify-center bg-black pt-32">
                <Loader2 className="w-10 h-10 text-white/20 animate-spin" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-black">
                <h1 className="text-4xl font-black font-syne uppercase italic mb-6 text-white">Flavor Not Found</h1>
                <Link to="/products" className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-amber-400 transition-all">
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

    const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean)

    return (
        <div className="min-h-screen bg-black pt-24 pb-20 md:pt-40 px-5 md:px-12 lg:px-20 overflow-hidden">
            {/* Dynamic Back Navigation */}
            <Link 
                to="/products" 
                className="inline-flex items-center gap-2 text-white/30 hover:text-white mb-12 transition-all group tracking-widest text-[10px] uppercase font-black font-syne"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Collection
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
                
                {/* ─ Cinematic Gallery System ────────────────────────────── */}
                <div className="lg:col-span-6 flex items-start gap-8">
                    {/* Thumbnails Sidebar (Desktop) */}
                    {allImages.length > 1 && (
                        <div className="hidden lg:flex flex-col gap-4 overflow-y-auto no-scrollbar shrink-0 w-24">
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

                    <div className="relative flex-1">
                        {/* Main Backdrop Glow */}
                        <div 
                            className="absolute inset-0 blur-[120px] opacity-20 -z-10 rounded-full"
                            style={{ backgroundColor: product.bgColor || '#5D1A1E' }}
                        ></div>
                        
                        <div className="relative aspect-[4/5] bg-white/5 border border-white/10 rounded-[60px] md:rounded-[100px] overflow-hidden backdrop-blur-3xl shadow-3xl flex items-center justify-center p-12 transition-all hover:bg-white/[0.07] duration-700">
                             <AnimatePresence mode="wait">
                                <motion.img 
                                    key={selectedImage}
                                    src={selectedImage} 
                                    alt={product.name} 
                                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                    animate={{ opacity: 1, scale: 1.1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 1.2, rotate: 5 }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-full h-full object-cover drop-shadow-[0_45px_45px_rgba(0,0,0,0.5)]" 
                                    loading="lazy"
                                />
                             </AnimatePresence>
                             
                             <div className="absolute top-10 left-10 bg-white/10 border border-white/10 backdrop-blur-2xl px-5 py-2 rounded-full flex items-center gap-2">
                                 <Leaf className="w-3.5 h-3.5 text-amber-400" />
                                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Pure Handpicked</span>
                             </div>
                        </div>

                        {/* Mobile Dynamic Thumbnails Row */}
                        {allImages.length > 1 && (
                            <div className="flex lg:hidden gap-3 mt-8 overflow-x-auto no-scrollbar pb-2">
                                {allImages.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative w-20 h-20 rounded-3xl overflow-hidden border-2 transition-all shrink-0
                                            ${selectedImage === img ? 'border-amber-400' : 'border-white/10 opacity-60'}
                                        `}
                                    >
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
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

                        <h1 className="text-3xl md:text-6xl font-black font-syne uppercase italic tracking-tighter text-white leading-none mb-6">
                            {product.name}
                        </h1>

                        <div className="flex items-end gap-5 mb-10">
                             <span className="text-4xl md:text-6xl font-black font-poppins text-white leading-none">₹{product.price}</span>
                             <div className="flex flex-col">
                                 {product.mrp > product.price && (
                                     <span className="text-white/20 line-through font-bold text-lg font-poppins">₹{product.mrp}</span>
                                 )}
                                 <span className="text-amber-400 text-[8px] font-black uppercase tracking-widest font-syne">Limited Drop</span>
                             </div>
                        </div>

                        <p className="text-white/40 text-sm md:text-base font-medium font-poppins max-w-xl leading-relaxed">
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
                            className={`flex-1 py-5 md:py-7 rounded-full font-black uppercase tracking-[0.2em] text-[10px] md:text-xs font-syne transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 active:scale-95
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
                            className="flex-1 py-5 md:py-7 rounded-full bg-amber-400 text-black font-black uppercase tracking-[0.2em] text-[10px] md:text-xs font-syne transition-all duration-500 shadow-2xl hover:bg-white hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mt-16">
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
