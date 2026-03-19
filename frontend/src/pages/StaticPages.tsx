import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react'

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-40 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold uppercase italic font-syne mb-10 tracking-tighter">About Us</h1>
      <p className="text-white/80 text-lg leading-relaxed mb-6">Shriyans Lotus Seeds was born out of a passion for healthy, flavorful snacking. Our fox nuts are hand-picked from the pristine waters of natural ponds and roasted to perfection with hand-crafted spice blends.</p>
      <p className="text-white/80 text-lg leading-relaxed">No preservatives, no artificial colors—just pure, crunch-tastic goodness.</p>
    </div>
  )
}

export const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-40 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold uppercase italic font-syne mb-10 tracking-tighter">Contact Us</h1>
      <div className="bg-red-800/20 border border-white/10 p-12 rounded-3xl backdrop-blur-md">
        <p className="text-2xl font-bold mb-4 font-syne italic">Get in touch</p>
        <p className="text-white/70 mb-2">Email: hello@shriyans.com</p>
        <p className="text-white/70">Phone: +91 98765 43210</p>
      </div>
    </div>
  )
}

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-40 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase italic font-syne mb-10 tracking-tighter">Your Cart</h1>
        <div className="py-20 bg-black/30 rounded-3xl border border-white/5 font-syne italic text-2xl opacity-50 uppercase tracking-widest flex flex-col items-center gap-6">
          <ShoppingBag className="w-16 h-16 opacity-20" />
          <span>Your cart is empty</span>
        </div>
        <Link to="/products" className="inline-block mt-12 bg-white text-red-900 px-12 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl font-syne">
          Back to Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 md:py-40">
      <h1 className="text-4xl md:text-7xl font-extrabold uppercase italic font-syne mb-12 md:mb-20 tracking-tighter text-center md:text-left">Review Order</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start relative">
        {/* Left Side: Product List Content - High energy standard scroll */}
        <div className="lg:col-span-8 space-y-4 md:space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-[32px] md:rounded-full flex items-center justify-between gap-4 md:gap-8 backdrop-blur-2xl transition-all shadow-xl overflow-hidden group">
              {/* Bag Image Preview */}
              <Link to={`/product/${item.id}`} className="w-16 h-20 md:w-24 md:h-28 bg-white/10 rounded-2xl md:rounded-3xl overflow-hidden shrink-0 block">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover scale-150 drop-shadow-2xl transition-transform duration-700" loading="lazy" />
              </Link>
              
              <div className="flex-1 flex flex-col md:grid md:grid-cols-12 md:items-center gap-2 md:gap-4">
                {/* Name Display */}
                <div className="md:col-span-6">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-sm md:text-xl font-black font-syne uppercase tracking-tight hover:text-amber-400 transition-colors">{item.name}</h3>
                  </Link>
                  <p className="text-[9px] md:text-[10px] text-white/50 font-bold tracking-[0.2em] uppercase mt-1">Gourmet Selection</p>
                </div>
                
                {/* Reactive Quantity Discovery Controls */}
                <div className="md:col-span-3 flex items-center justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-white/10 p-1 rounded-full border border-white/10">
                      <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-white hover:text-red-950 transition-all text-white active:scale-90"
                      >
                          <Minus className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <span className="text-sm md:text-lg font-black font-poppins min-w-[2ch] text-center">{item.quantity}</span>
                      <button 
                           onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-white hover:text-red-950 transition-all text-white active:scale-90"
                      >
                          <Plus className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                  </div>
                </div>
                
                {/* Item Totals Display */}
                <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-4 text-right">
                  <p className="text-lg md:text-2xl font-black font-poppins text-amber-400">₹{parseInt(item.currentPrice) * item.quantity}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 md:p-3 hover:bg-red-500 hover:text-white rounded-full text-red-500/50 transition-all active:scale-90"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Frictionless Sticky Summary - NO cutting off from below */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 mb-20 md:mb-0">
          <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[40px] md:rounded-[50px] backdrop-blur-3xl shadow-3xl text-center md:text-left">
            <h2 className="text-2xl font-black font-syne uppercase italic tracking-tighter mb-8 text-white/40">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-white/60 font-bold uppercase text-[10px] tracking-[0.3em]">
                    <span>Standard Shipping</span>
                    <span className="text-amber-500">Free</span>
                </div>
                <div className="flex justify-between items-center text-white/60 font-bold uppercase text-[10px] tracking-[0.3em]">
                    <span>Estimated Tax</span>
                    <span>₹0</span>
                </div>
            </div>

            <div className="flex items-center justify-between mb-10 border-t border-white/10 pt-10">
                <span className="text-sm md:text-lg font-bold uppercase font-syne tracking-[0.4em] text-white">Total</span>
                <span className="text-4xl md:text-5xl font-black font-poppins text-white">₹{getCartTotal()}</span>
            </div>
            
            <div className="flex flex-col gap-4">
              <button className="w-full bg-white text-red-950 py-5 rounded-full font-black uppercase tracking-widest text-lg hover:bg-amber-400 transition-all shadow-2xl font-syne hover:scale-[1.02] active:scale-95 duration-300">
                Checkout now
              </button>
              <Link to="/products" className="w-full text-center py-5 rounded-full border border-white/20 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all font-syne text-white/40 hover:text-white">
                Continue Shopping
              </Link>
            </div>
            
            <p className="mt-8 text-[9px] uppercase tracking-[0.2em] font-bold text-white/20 font-poppins leading-loose">
                Includes GST and all applicable gourmet makhana taxes. Secure checkout powered by Shriyans.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
