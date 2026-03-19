export const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-40 text-center">
      <h1 className="text-6xl font-extrabold uppercase italic font-syne mb-10 tracking-tighter">About Us</h1>
      <p className="text-white/80 text-lg leading-relaxed mb-6">Shriyans Lotus Seeds was born out of a passion for healthy, flavorful snacking. Our fox nuts are hand-picked from the pristine waters of natural ponds and roasted to perfection with hand-crafted spice blends.</p>
      <p className="text-white/80 text-lg leading-relaxed">No preservatives, no artificial colors—just pure, crunch-tastic goodness.</p>
    </div>
  )
}

export const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-40 text-center">
      <h1 className="text-6xl font-extrabold uppercase italic font-syne mb-10 tracking-tighter">Contact Us</h1>
      <div className="bg-red-800/20 border border-white/10 p-12 rounded-3xl backdrop-blur-md">
        <p className="text-2xl font-bold mb-4 font-syne italic">Get in touch</p>
        <p className="text-white/70 mb-2">Email: hello@shriyans.com</p>
        <p className="text-white/70">Phone: +91 98765 43210</p>
      </div>
    </div>
  )
}

export const Cart = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-40 text-center">
      <h1 className="text-6xl font-extrabold uppercase italic font-syne mb-10 tracking-tighter">Your Cart</h1>
      <div className="py-20 bg-black/30 rounded-3xl border border-white/5 font-syne italic text-2xl opacity-50 uppercase tracking-widest">
        Your cart is empty
      </div>
      <button className="mt-12 bg-white text-red-900 px-12 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl font-syne">
        Back to Shopping
      </button>
    </div>
  )
}
