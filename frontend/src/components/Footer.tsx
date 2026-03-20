import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-primary border-t border-white/5 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex flex-col items-start leading-none group mb-6">
            <span className="text-3xl font-black italic tracking-tighter text-white group-hover:text-accent transition-colors">
              SHRIYANS
            </span>
            <span className="text-[11px] font-bold tracking-[0.3em] text-white/50 self-end -mt-1 group-hover:text-white transition-colors uppercase">
              Lotus Seeds
            </span>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed">
            Bringing you the finest quality Makhana with hand-crafted flavors since 2026. Crunchy, healthy, and delicious.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Quick Links</h4>
          <ul className="flex flex-col gap-4 text-white/60 text-sm">
            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-accent transition-colors">Products</Link></li>
            <li><Link to="/recipes" className="hover:text-accent transition-colors">Recipes</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Contact Us</h4>
          <ul className="flex flex-col gap-4 text-white/60 text-sm">
            <li className="flex items-center gap-3 text-white/80"><Mail className="w-4 h-4 text-accent" /> hello@shriyans.com</li>
            <li>Mumbai, Maharashtra, India</li>
            <li>+91 98765 43210</li>
          </ul>
        </div>

        {/* Social Support */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Follow Us</h4>
          <div className="flex items-center gap-4">
             <a href="#" className="p-3 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full transition-all text-white"><Instagram className="w-5 h-5" /></a>
             <a href="#" className="p-3 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full transition-all text-white"><Facebook className="w-5 h-5" /></a>
             <a href="#" className="p-3 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full transition-all text-white"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-10 text-center">
        <p className="text-white/20 text-xs tracking-[0.2em] uppercase">
          &copy; 2026 Shriyans Lotus Seeds. Crafting the perfect crunch.
        </p>
      </div>
    </footer>
  )
}

export default Footer
