import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import herobanner from '../assets/prodcut8.png'

const HeroBanner = () => {
  return (
    <div className="relative w-full min-h-screen bg-primary pt-24 md:pt-32 overflow-hidden flex flex-col justify-center">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 blur-[150px] rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 blur-[150px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          
          {/* Column 1: Content (Left) */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="order-2 md:order-1 text-left flex flex-col justify-center py-10 md:py-0"
          >
            <span className="text-secondary uppercase tracking-[0.5em] font-black text-xs md:text-sm mb-6 block drop-shadow-sm">
                Premium Roasted Makhana
            </span>
            <h1 className="text-white text-6xl md:text-[7rem] font-serif font-black leading-[0.85] mb-8 max-w-2xl italic tracking-tighter drop-shadow-2xl">
                Crunchy. <br />
                Artisanal. <br />
                <span className="text-accent">Divine.</span>
            </h1>
            <p className="text-white/60 text-lg md:text-2xl max-w-lg mb-12 font-sans font-medium leading-relaxed drop-shadow-sm">
                Elevate your snacking experience with Shriyans Lotus Seeds. Hand-picked, expertly roasted, and seasoned for perfection. 
            </p>
            
            <div className="flex flex-wrap gap-10 items-center">
                <Link 
                    to="/products" 
                    className="bg-accent text-white px-14 py-6 rounded-full font-black uppercase text-sm tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-accent/20 cursor-pointer block border border-accent/20 text-center"
                >
                    Shop Now
                </Link>
                <div className="flex flex-col">
                    <span className="text-accent font-serif italic text-4xl font-black italic tracking-tighter">25% OFF</span>
                    <span className="text-white/30 uppercase text-[10px] tracking-[0.5em] font-black">On Your First Order</span>
                </div>
            </div>
          </motion.div>

          {/* Column 2: Showcase Card (Right) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="order-1 md:order-2 flex justify-center md:justify-end items-center"
          >
            <div className="relative w-full aspect-[4/5] max-w-[500px] overflow-hidden rounded-[64px] border border-white/10 shadow-2xl">
              {/* Premium Card Container */}
              <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent"></div>
              
              {/* Main Product Showcase */}
              <div className="relative h-full w-full flex items-center justify-center">
                 {/* Radial accent glow */}
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-accent/20 blur-[100px] rounded-full"></div>
                 
                 <motion.img 
                  animate={{ 
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  src={herobanner} 
                  alt="Premium Makhana" 
                  className="relative z-10 w-full h-full object-cover drop-shadow-[0_50px_80px_rgba(0,0,0,0.7)]"
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden md:block opacity-30">
          <div className="w-[1px] h-20 bg-gradient-to-b from-accent to-transparent flex justify-center pt-2">
              <div className="w-[3px] h-3 bg-accent rounded-full"></div>
          </div>
      </div>
    </div>
  )
}

export default HeroBanner
