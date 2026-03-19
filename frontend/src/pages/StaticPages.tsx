import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, Mail, Phone, MapPin, Clock, ShieldCheck, Heart, Sparkles } from 'lucide-react'

export const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#FAF6F6]/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-brand-dark mb-6 tracking-tight uppercase">OUR STORY</h1>
          <div className="w-24 h-1.5 bg-brand-red mx-auto mb-8 rounded-full" />
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-brand-dark/70 font-medium leading-relaxed">
            From the heart of natural ponds to your snack bowl, we're redefining what it means to snack healthy without compromising on crunch or flavor.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-brand-red uppercase">Healthy, Hand-Crafted, Honest</h2>
            <p className="text-brand-dark/80 leading-relaxed text-lg">
              Shriyans Lotus Seeds was born out of a passion for healthy, flavorful snacking. Our fox nuts (Makhana) are hand-picked from the pristine waters of natural ponds and roasted to perfection with hand-crafted spice blends.
            </p>
            <p className="text-brand-dark/80 leading-relaxed text-lg">
              We believe that nature provides the best ingredients. That's why we use no preservatives, no artificial colors—just pure, crunch-tastic goodness that fueled generations before us.
            </p>
            <div className="pt-4 flex gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-dark">100%</p>
                <p className="text-xs font-bold text-brand-red uppercase tracking-widest">Natural</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-dark">0%</p>
                <p className="text-xs font-bold text-brand-red uppercase tracking-widest">Preservatives</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-dark">Premium</p>
                <p className="text-xs font-bold text-brand-red uppercase tracking-widest">Quality</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-[40px] shadow-2xl shadow-brand-red/5 border border-brand-red/10 rotate-2 hover:rotate-0 transition-transform duration-500">
             <div className="aspect-square bg-[#FAF6F6] rounded-[32px] overflow-hidden flex items-center justify-center">
                <Sparkles className="w-24 h-24 text-brand-red/20 animate-pulse" />
             </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Purity First", desc: "Every seed is quality-checked to ensure it meets our elite standards of size and crunch." },
            { icon: Heart, title: "Hand-Roasted", desc: "We don't do mass-produced. Our Makhana is roasted in small batches for peak flavor." },
            { icon: Sparkles, title: "Modern Flavors", desc: "Combining ancient wisdom with modern cravings through our unique spice blends." }
          ].map((v, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-brand-red/10 shadow-sm hover:shadow-md transition-shadow">
              <v.icon className="w-10 h-10 text-brand-red mb-6" />
              <h3 className="text-xl font-bold text-brand-dark mb-3 uppercase">{v.title}</h3>
              <p className="text-brand-dark/60 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const Contact = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#FAF6F6]/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-brand-dark mb-6 tracking-tight uppercase">CONTACT US</h1>
          <div className="w-24 h-1.5 bg-brand-red mx-auto mb-8 rounded-full" />
          <p className="text-brand-dark/60 font-medium">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-4">
            {[
              { icon: Mail, label: "Email Us", value: "hello@shriyans.com", sub: "Response within 24 hours" },
              { icon: Phone, label: "Call Us", value: "+91 98765 43210", sub: "Mon-Sat, 10am to 7pm" },
              { icon: MapPin, label: "Visit Us", value: "Sector 62, Noida", sub: "Uttar Pradesh, India" },
              { icon: Clock, label: "Working Hours", value: "10:00 AM - 07:00 PM", sub: "Open 6 days a week" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-brand-red/5 shadow-sm flex items-start gap-4">
                <div className="bg-brand-red/5 p-3 rounded-xl">
                  <item.icon className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-red uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-brand-dark">{item.value}</p>
                  <p className="text-xs text-brand-dark/40 font-medium">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-[40px] border border-brand-red/10 shadow-xl">
              <h2 className="text-2xl font-bold text-brand-dark mb-8 uppercase">Send a Message</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-red uppercase tracking-widest pl-4">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-[#FAF6F6] border-none rounded-full px-6 py-4 outline-none focus:ring-2 ring-brand-red/20 transition-all font-medium text-brand-dark text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-red uppercase tracking-widest pl-4">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-[#FAF6F6] border-none rounded-full px-6 py-4 outline-none focus:ring-2 ring-brand-red/20 transition-all font-medium text-brand-dark text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-red uppercase tracking-widest pl-4">Subject</label>
                  <input type="text" placeholder="How can we help?" className="w-full bg-[#FAF6F6] border-none rounded-full px-6 py-4 outline-none focus:ring-2 ring-brand-red/20 transition-all font-medium text-brand-dark text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-red uppercase tracking-widest pl-4">Your Message</label>
                  <textarea rows={5} placeholder="Tell us more about your query..." className="w-full bg-[#FAF6F6] border-none rounded-[30px] px-6 py-4 outline-none focus:ring-2 ring-brand-red/20 transition-all font-medium text-brand-dark text-sm resize-none"></textarea>
                </div>
                <button className="w-full bg-brand-red text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg hover:shadow-brand-red/20 active:scale-95 duration-300">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-40 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase italic mb-10 tracking-tighter text-brand-dark">Your Cart</h1>
        <div className="py-20 bg-brand-pink rounded-3xl border border-brand-red/5 italic text-2xl opacity-50 uppercase tracking-widest flex flex-col items-center gap-6 text-brand-dark">
          <ShoppingBag className="w-16 h-16 opacity-20" />
          <span>Your cart is empty</span>
        </div>
        <Link to="/products" className="inline-block mt-12 bg-brand-red text-white px-12 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-brand-dark transition-all shadow-xl">
          Back to Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 font-sans">
      <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-brand-dark mb-8 uppercase">YOUR CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        {/* Left Side: Product List */}
        <div className="lg:col-span-7 space-y-4">
          {cart.map((item) => (
             <div key={item.id} className="border border-gray-200 p-4 rounded-2xl flex gap-4 md:gap-6 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
               <div className="w-24 h-24 md:w-32 md:h-32 bg-[#F3F3F3] rounded-xl flex items-center justify-center shrink-0">
                 <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-md scale-75" loading="lazy" />
               </div>
               
               <div className="flex-1 flex flex-col justify-between py-1">
                 <div className="pr-8 relative">
                   <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-1">{item.name}</h3>
                   <p className="text-xs text-gray-500 mt-1">Size: Regular<br/>Color: Natural</p>
                   {/* Trash absolute top right */}
                   <button
                     onClick={() => removeFromCart(item.id)}
                     className="absolute -top-1 right-0 text-red-500 hover:text-red-700 transition-colors p-1"
                   >
                     <Trash2 className="w-4 h-4 md:w-5 md:h-5 fill-red-500" />
                   </button>
                 </div>
                 
                 <div className="flex items-end justify-between mt-4">
                   <p className="text-lg md:text-xl font-bold text-gray-900">₹{item.currentPrice}</p>
                   
                   <div className="flex items-center gap-3 md:gap-4 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                     <button
                       onClick={() => updateQuantity(item.id, -1)}
                       className="w-5 h-5 flex items-center justify-center hover:text-black transition-colors text-xl font-medium text-gray-600"
                     >
                       -
                     </button>
                     <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                     <button
                       onClick={() => updateQuantity(item.id, 1)}
                       className="w-5 h-5 flex items-center justify-center hover:text-black transition-colors text-xl font-medium text-gray-600"
                     >
                       +
                     </button>
                   </div>
                 </div>
               </div>
             </div>
          ))}
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="border border-gray-200 p-6 md:p-8 rounded-[24px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 text-sm md:text-base border-b border-gray-100 pb-6">
              <div className="flex justify-between items-center text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{getCartTotal()}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500">
                <span>Shipping</span>
                <span className="font-bold text-gray-900">₹{getCartTotal() >= 499 ? 0 : 49}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-2xl md:text-3xl font-bold text-gray-900">₹{getCartTotal() + (getCartTotal() >= 499 ? 0 : 49)}</span>
            </div>

            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-1.5 mb-6 focus-within:border-gray-400 transition-colors">
              <div className="pl-3 text-gray-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
              </div>
              <input 
                type="text" 
                placeholder="Add promo code" 
                className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-gray-700"
              />
              <button className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                Apply
              </button>
            </div>

            <Link to="/checkout" className="w-full bg-black text-white py-4 rounded-full font-medium text-base hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
              Go to Checkout
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
