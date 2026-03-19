import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import SearchDrawer from './SearchDrawer'

import { useCart } from '../context/CartContext'

const ProfileAvatar = ({ size = 'sm' }: { size?: 'sm' | 'lg' }) => {
  const { user } = useUser()
  const sizeClass = size === 'lg' ? 'w-14 h-14 text-xl' : 'w-9 h-9 text-sm'
  return (
    <Link
      to="/profile"
      className={`${sizeClass} rounded-full border-2 border-white/30 hover:border-white transition-all overflow-hidden flex items-center justify-center bg-amber-500 font-black font-syne text-black hover:scale-110 scale-100 duration-200`}
    >
      {user?.imageUrl
        ? <img src={user.imageUrl} alt={user?.firstName || 'Profile'} className="w-full h-full object-cover" />
        : <span>{(user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || 'U').toUpperCase()}</span>
      }
    </Link>
  )
}

const Navbar = () => {
  const { cart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
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

  // Close overlays on navigation
  useEffect(() => {
    setIsMenuOpen(false)
    setIsSearchOpen(false)
  }, [location.pathname])

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
    } else {
      // Hide indicator if no link is active (e.g., on Cart or Product Details page)
      setIndicatorStyle({
        left: 0,
        width: 0
      })
    }
  }, [location.pathname])

  // Background and appearance logic - Restoring exact background patterns
  const getNavBackground = () => {
    if (isSearchOpen) return 'bg-transparent'
    if (isScrolled || isMenuOpen) return 'bg-red-950/90 backdrop-blur-3xl border-b border-white/10 shadow-2xl py-2'
    if (isHome) return 'bg-red-700 shadow-md border-b border-white/10'
    return 'bg-transparent border-b border-transparent py-4'
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    // If clicking the current path, perform a manual smooth scroll to top
    if (location.pathname === to) {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 py-3 px-4 md:px-8 z-50 flex items-center justify-between transition-all duration-500 ${getNavBackground()}`}>
        {/* Logo Section - Preserving original mixed-case branding */}
        <Link 
          to="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="flex flex-col items-start leading-none group cursor-pointer"
        >
          <span className="text-2xl md:text-3xl font-black italic tracking-tighter text-white group-hover:text-amber-500 transition-colors font-syne">
            SHRIYANS
          </span>
          <span className="text-[10px] md:text-[12px] font-bold tracking-[0.4em] text-white/70 self-end -mt-1 group-hover:text-white transition-colors uppercase font-poppins">
            Lotus Seeds
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="relative">
            <ul ref={navRef} className="flex items-center gap-8 text-sm uppercase tracking-widest font-syne">
              <li>
                <NavLink to="/" onClick={(e) => handleLinkClick(e, '/')} className={({ isActive }) => `relative py-2 font-normal transition-colors duration-300 ${isActive ? 'text-white active' : 'text-white/60 hover:text-white'}`}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/products" onClick={(e) => handleLinkClick(e, '/products')} className={({ isActive }) => `relative py-2 font-normal transition-colors duration-300 ${isActive ? 'text-white active' : 'text-white/60 hover:text-white'}`}>
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" onClick={(e) => handleLinkClick(e, '/about')} className={({ isActive }) => `relative py-2 font-normal transition-colors duration-300 ${isActive ? 'text-white active' : 'text-white/60 hover:text-white'}`}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className={({ isActive }) => `relative py-2 font-normal transition-colors duration-300 ${isActive ? 'text-white active' : 'text-white/60 hover:text-white'}`}>
                  Contact
                </NavLink>
              </li>
            </ul>
            {/* Sliding Single Indicator (Desktop only) */}
            <span 
              className="absolute bottom-0 h-0.5 bg-white transition-all duration-[800ms] ease-out pointer-events-none"
              style={{ 
                left: `${indicatorStyle.left}px`, 
                width: `${indicatorStyle.width}px` 
              }}
            />
          </div>
        </div>

        {/* Action Buttons & Mobile Toggle - Optimized with Inline Desktop Search */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Search Capsule - Matching user pill design */}
          <div className="hidden md:flex relative group items-center">
            <input 
              type="text" 
              placeholder="Search products..."
              onFocus={() => setIsSearchOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white placeholder:text-white/40 border border-white/20 rounded-full px-6 py-1.5 w-48 lg:w-64 focus:w-80 focus:bg-white focus:text-red-950 focus:placeholder:text-red-950/30 transition-all duration-300 font-syne text-sm font-bold outline-none shadow-xl"
            />
            <Search className="absolute right-4 w-4 h-4 text-white group-focus-within:text-red-950 transition-colors pointer-events-none" />
          </div>

          {/* Mobile Search Button - Keeping icon-only for space */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 hover:bg-white/20 rounded-full transition-all text-white group"
          >
            <Search className="w-6 h-6" />
          </button>
          
          <Link to="/cart" onClick={(e) => handleLinkClick(e, '/cart')} className="p-2 hover:bg-white/20 rounded-full transition-all relative group">
            <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-white" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-red-950 text-[10px] md:text-xs font-black flex items-center justify-center rounded-full shadow-lg border-2 border-red-950 animate-in zoom-in duration-300">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
          
          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center">
            <SignedOut>
                <Link to="/sign-in" className="bg-black text-white px-6 py-1.5 rounded-full font-bold text-sm hover:bg-white hover:text-black transition-all border-2 border-transparent font-poppins cursor-pointer block">
                    Sign In
                </Link>
            </SignedOut>
            <SignedIn>
                <ProfileAvatar />
            </SignedIn>
          </div>
          
          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg text-white transition-all"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay - Restoring top-[65px] layout pattern */}
        <div className={`fixed top-[65px] left-0 right-0 bottom-0 bg-red-950/95 backdrop-blur-3xl z-40 md:hidden flex flex-col items-center justify-center gap-10 transition-all duration-500 overflow-hidden ${isMenuOpen ? 'opacity-100 h-[calc(100vh-65px)]' : 'opacity-0 h-0'}`}>
          <ul className="flex flex-col items-center gap-8 text-2xl font-black italic tracking-tighter font-syne uppercase text-white">
            <li>
              <NavLink to="/" onClick={(e) => { setIsMenuOpen(false); handleLinkClick(e, '/'); }} className={({ isActive }) => isActive ? 'text-amber-500' : 'text-white hover:text-amber-500 transition-colors'}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/products" onClick={(e) => { setIsMenuOpen(false); handleLinkClick(e, '/products'); }} className={({ isActive }) => isActive ? 'text-amber-500' : 'text-white hover:text-amber-500 transition-colors'}>Products</NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={(e) => { setIsMenuOpen(false); handleLinkClick(e, '/about'); }} className={({ isActive }) => isActive ? 'text-amber-500' : 'text-white hover:text-amber-500 transition-colors'}>About</NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={(e) => { setIsMenuOpen(false); handleLinkClick(e, '/contact'); }} className={({ isActive }) => isActive ? 'text-amber-500' : 'text-white hover:text-amber-500 transition-colors'}>Contact</NavLink>
            </li>
          </ul>
          
          {/* Mobile Auth Experience */}
          <div className="scale-125">
            <SignedOut>
                <Link to="/sign-in" className="bg-white text-black px-12 py-3 rounded-full font-black uppercase text-lg tracking-widest font-syne cursor-pointer block" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                </Link>
            </SignedOut>
            <SignedIn>
                <div className="flex flex-col items-center gap-4">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-2 group">
                        <ProfileAvatar size="lg" />
                        <span className="text-white/60 font-syne font-black uppercase text-[10px] tracking-widest group-hover:text-white transition-colors">My Profile</span>
                    </Link>
                </div>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Modular Search Drawer Component */}
      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export default Navbar
