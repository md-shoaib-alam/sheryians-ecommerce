import { useState, useEffect, useRef } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const location = useLocation()
  const navRef = useRef<HTMLUListElement>(null)
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update sliding indicator position
  useEffect(() => {
    if (!navRef.current) return

    // Find the active link element
    const activeLink = navRef.current.querySelector('.active') as HTMLElement
    if (activeLink) {
      setIndicatorStyle({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth
      })
    }
  }, [location.pathname])

  // Background and appearance logic
  const getNavBackground = () => {
    if (isScrolled) return 'bg-red-950/80 backdrop-blur-3xl border-b border-white/10 shadow-2xl py-2'
    if (isHome) return 'bg-red-700 shadow-md border-b border-white/10'
    return 'bg-transparent border-b border-transparent py-4'
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 py-3 px-8 z-50 flex items-center justify-between transition-all duration-500 ${getNavBackground()}`}>
      <Link 
        to="/"
        className="flex flex-col items-start leading-none group cursor-pointer"
      >
        <span className="text-3xl font-black italic tracking-tighter text-white group-hover:text-amber-500 transition-colors font-syne">
          SHRIYANS
        </span>
        <span className="text-[12px] font-bold tracking-[0.4em] text-white/70 self-end -mt-1 group-hover:text-white transition-colors uppercase font-poppins">
          Lotus Seeds
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <div className="relative">
          <ul ref={navRef} className="flex items-center gap-8 text-sm uppercase tracking-widest font-syne">
            <li>
              <NavLink to="/" className={({ isActive }) => `relative py-2 font-normal transition-colors duration-300 ${isActive ? 'text-white active' : 'text-white/60 hover:text-white'}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={({ isActive }) => `relative py-2 font-normal transition-colors duration-300 ${isActive ? 'text-white active' : 'text-white/60 hover:text-white'}`}>
                Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => `relative py-2 font-normal transition-colors duration-300 ${isActive ? 'text-white active' : 'text-white/60 hover:text-white'}`}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `relative py-2 font-normal transition-colors duration-300 ${isActive ? 'text-white active' : 'text-white/60 hover:text-white'}`}>
                Contact
              </NavLink>
            </li>
          </ul>
          {/* Sliding Single Indicator */}
          <span 
            className="absolute bottom-0 h-0.5 bg-white transition-all duration-[800ms] ease-out pointer-events-none"
            style={{ 
              left: `${indicatorStyle.left}px`, 
              width: `${indicatorStyle.width}px` 
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/cart" className="p-2 hover:bg-white/20 rounded-full transition-all relative group">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
        </Link>
        <button className="bg-black text-white px-6 py-1.5 rounded-full font-bold text-sm hover:bg-white hover:text-black transition-all border-2 border-transparent">
          Login
        </button>
      </div>
    </nav>
  )
}

export default Navbar
