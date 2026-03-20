import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, Mail, Phone, MapPin, Clock, ShieldCheck, Heart, Sparkles } from 'lucide-react'

export const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-24 relative">
            <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-[0.03]">
                <h1 className="text-[200px] font-serif font-black italic">Shriyans</h1>
            </div>
          <h1 className="text-5xl md:text-8xl font-serif font-black text-primary mb-6 italic tracking-tight">Our Story</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary/60 font-medium leading-relaxed">
            Redefining the essence of healthy snacking through the purity of nature and the crunch of tradition.
          </p>
        </div>

        {/* Company Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary">Healthy, Hand-Crafted, Honest</h2>
            <p className="text-primary/70 leading-relaxed text-lg italic">
              "Shriyans Lotus Seeds was born out of a passion for healthy, flavorful snacking. Our fox nuts (Makhana) are hand-picked from the pristine waters of natural ponds and roasted to perfection with hand-crafted spice blends."
            </p>
            <p className="text-primary/70 leading-relaxed text-lg">
              We believe that nature provides the best ingredients. That's why we use no preservatives, no artificial colors—just pure, crunch-tastic goodness that fueled generations before us.
            </p>
            <div className="pt-8 grid grid-cols-3 gap-8">
              <div className="text-center p-6 bg-secondary/10 rounded-3xl border border-primary/5">
                <p className="text-3xl font-black text-primary italic">100%</p>
                <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-2">Organic</p>
              </div>
              <div className="text-center p-6 bg-secondary/10 rounded-3xl border border-primary/5">
                <p className="text-3xl font-black text-primary italic">0%</p>
                <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-2">Additives</p>
              </div>
              <div className="text-center p-6 bg-secondary/10 rounded-3xl border border-primary/5">
                <p className="text-3xl font-black text-primary italic">Pure</p>
                <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-2">Joy</p>
              </div>
            </div>
          </div>
          <div className="relative group">
              <div className="absolute -inset-4 bg-accent/5 rounded-[60px] blur-2xl group-hover:bg-accent/10 transition-all"></div>
              <div className="relative aspect-square bg-white p-6 rounded-[60px] shadow-soft border border-primary/5 overflow-hidden">
                 <div className="w-full h-full bg-secondary/10 rounded-[40px] flex items-center justify-center">
                    <Sparkles className="w-32 h-32 text-accent/20 animate-pulse" />
                 </div>
              </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
            <div className="bg-primary p-12 rounded-[48px] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <h3 className="text-3xl font-serif font-bold mb-6 italic text-accent">Our Vision</h3>
                <p className="text-white/70 text-lg leading-relaxed">
                    To become the global ambassador of traditional Indian superfoods, making healthy snacking an exquisite, accessible, and delightful experience for every household.
                </p>
            </div>
            <div className="bg-secondary/20 p-12 rounded-[48px] text-primary relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                <h3 className="text-3xl font-serif font-bold mb-6 italic block">Our Mission</h3>
                <p className="text-primary/60 text-lg leading-relaxed">
                    To empower health-conscious snackers by providing ethically sourced, nutritionally dense makhana products that honor traditional craftsmanship while embracing modern flavors.
                </p>
            </div>
        </div>

        {/* Values */}
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4 italic">Core Values</h2>
            <div className="w-12 h-1 bg-accent mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Quality", desc: "Rigorous standards for every seed. Only the 'Big-N-Bold' make the cut." },
            { icon: Heart, title: "Transparency", desc: "Honest sourcing and clear communication about what goes into your bag." },
            { icon: Sparkles, title: "Innovation", desc: "Constantly experimenting with gourmet flavors to keep your snack bowl exciting." }
          ].map((v, i) => (
            <div key={i} className="bg-white p-10 rounded-[40px] border border-primary/5 shadow-soft hover:shadow-lg transition-all text-center group">
              <div className="mb-8 p-4 bg-secondary/10 rounded-3xl inline-block group-hover:bg-accent group-hover:text-white transition-colors">
                <v.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4 uppercase tracking-widest">{v.title}</h3>
              <p className="text-primary/60 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const Contact = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-8xl font-serif font-black text-primary mb-6 italic tracking-tight uppercase">Get in Touch</h1>
          <p className="text-primary/40 font-black tracking-[0.4em] uppercase text-xs">Elevate Your Queries to Our Concierge</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-stretch">
          {/* Contact Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-primary p-12 rounded-[48px] text-white flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <h2 className="text-3xl font-serif font-bold mb-10 italic text-accent">Contact Information</h2>
                
                <div className="space-y-10">
                    <div className="flex items-start gap-6 group">
                        <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-accent transition-colors">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Email Concierge</p>
                            <p className="text-xl font-serif">hello@shriyans.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                        <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-accent transition-colors">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Customer Care</p>
                            <p className="text-xl font-serif">+91 98765 43210</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                        <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-accent transition-colors">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Business Hours</p>
                            <p className="text-xl font-serif">Mon - Sat: 10AM - 7PM</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-secondary/20 p-8 rounded-[40px] flex-1">
                 <h3 className="text-xl font-serif font-bold mb-4 text-primary italic">Our Address</h3>
                 <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-accent shrink-0" />
                    <p className="text-primary/70 font-medium leading-relaxed">
                        Sector 62, Noida, Uttar Pradesh 201301<br/>
                        India
                    </p>
                 </div>
                 
                 {/* Map Placeholder */}
                 <div className="mt-8 relative aspect-video rounded-3xl overflow-hidden shadow-soft border border-primary/5">
                    <iframe 
                      title="location-map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112123.63371900138!2d77.3001!3d28.6272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c3f1c74a!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1710921234567!5m2!1sen!2sin" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                    />
                 </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-16 rounded-[60px] border border-primary/5 shadow-soft h-full">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-12 italic">Send a Message</h2>
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-2">Full Name</label>
                    <input type="text" placeholder="Your Name" className="w-full bg-secondary/10 border-none rounded-3xl px-8 py-5 outline-none focus:bg-white focus:ring-4 ring-accent/5 transition-all font-medium text-primary text-sm shadow-soft" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-2">Email Address</label>
                    <input type="email" placeholder="Your Email" className="w-full bg-secondary/10 border-none rounded-3xl px-8 py-5 outline-none focus:bg-white focus:ring-4 ring-accent/5 transition-all font-medium text-primary text-sm shadow-soft" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-2">Your Message</label>
                  <textarea rows={6} placeholder="How can we help your snack cravings?" className="w-full bg-secondary/10 border-none rounded-[40px] px-8 py-6 outline-none focus:bg-white focus:ring-4 ring-accent/5 transition-all font-medium text-primary text-sm resize-none shadow-soft"></textarea>
                </div>
                <button className="w-full bg-accent text-white py-6 rounded-full font-black uppercase tracking-[0.4em] text-sm hover:scale-[1.02] transition-all shadow-2xl shadow-accent/20 active:scale-95 duration-300 cursor-pointer">
                  Submit Request
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full text-center space-y-8">
           <div className="mx-auto w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10">
              <ShoppingBag className="w-12 h-12 text-primary/40" />
           </div>
           
           <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Your cart is empty</h1>
              <p className="text-primary/60 font-medium uppercase tracking-widest text-xs">Looks like you haven't added anything yet</p>
           </div>

           <Link to="/products" className="inline-block bg-primary text-white px-12 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
             Start Shopping
           </Link>
        </div>
      </div>
    )
  }

  const subtotal = getCartTotal()
  const shipping = subtotal >= 499 ? 0 : 49
  const total = subtotal + shipping

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 md:px-8 bg-gray-50/30">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
          {/* Left Side: Product List */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => (
               <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-4 md:gap-6 group">
                 <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-between py-1">
                   <div className="pr-10 relative">
                     <h3 className="font-bold text-primary text-base md:text-lg line-clamp-1">{item.name}</h3>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mt-1">Makhana</p>
                     
                     <button
                       onClick={() => removeFromCart(item.id)}
                       className="absolute -top-1 right-0 text-primary/20 hover:text-red-500 transition-colors p-2"
                     >
                       <Trash2 className="w-5 h-5" />
                     </button>
                   </div>
                   
                   <div className="flex items-end justify-between mt-4">
                     <p className="text-xl font-bold text-primary">₹{item.currentPrice}</p>
                     
                     <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
                       <button
                         onClick={() => updateQuantity(item.id, -1)}
                         className="w-6 h-6 flex items-center justify-center text-primary/40 hover:text-primary transition-colors text-lg font-bold"
                       >
                         -
                       </button>
                       <span className="text-sm font-bold w-6 text-center text-primary">{item.quantity}</span>
                       <button
                         onClick={() => updateQuantity(item.id, 1)}
                         className="w-6 h-6 flex items-center justify-center text-primary/40 hover:text-primary transition-colors text-lg font-bold"
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
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-8">
              <h2 className="text-2xl font-serif font-bold text-primary">Order Summary</h2>

              <div className="space-y-4 border-b border-gray-100 pb-6">
                <div className="flex justify-between items-center text-xs font-medium text-primary/60">
                  <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-bold text-primary">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-primary/60">
                  <span className="uppercase tracking-widest text-[10px]">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-primary font-bold'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && <p className="text-[10px] text-primary/40 italic">Free shipping on orders above ₹499</p>}
              </div>

              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold uppercase tracking-widest text-primary">Total Amount</span>
                <span className="text-3xl font-bold text-primary">₹{total}</span>
              </div>

              <Link to="/checkout" className="w-full bg-primary text-white py-5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-primary/95 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/10 cursor-pointer">
                Proceed to Checkout
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center bg-gray-50 rounded-xl p-1 shadow-inner px-2">
                  <input 
                    type="text" 
                    placeholder="PROMO CODE" 
                    className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-[10px] font-bold tracking-widest text-primary placeholder:text-primary/30"
                  />
                  <button className="bg-white border border-gray-200 text-primary px-6 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                    Apply
                  </button>
                </div>
                
                <p className="text-center text-primary/30 text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-primary/30" />
                    Secure Checkout Powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
