import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { Show, useUser } from "@clerk/react";
import SearchDrawer from './SearchDrawer'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { useCart } from '../context/CartContext'

const ProfileAvatar = ({ size = 'sm' }: { size?: 'sm' | 'lg' }) => {
  const { user } = useUser()
  const sizeClass = size === 'lg' ? 'w-14 h-14 text-xl' : 'w-9 h-9 text-sm'
  return (
    <Link
      to="/profile"
      className={`${sizeClass} rounded-full border-2 border-brand-red/20 hover:border-brand-red transition-all overflow-hidden flex items-center justify-center bg-brand-red font-black text-white hover:scale-110 scale-100 duration-200`}
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
  const isOrders = location.pathname.startsWith('/profile/order') || location.pathname.startsWith('/checkout')

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

  // Background and appearance logic
  const getNavBackground = () => {
    if (isSearchOpen) return 'bg-transparent'
    if (isScrolled || isMenuOpen) return 'bg-primary/90 backdrop-blur-md border-b border-white/10 shadow-lg py-2'
    return 'bg-primary py-4' // Solid primary color (#5B0F2E) at the top
  }

  const getTextColor = () => {
    return 'text-white' // Always white for consistency in this dark theme
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (location.pathname === to) {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 py-3 px-4 md:px-8 z-50 flex items-center justify-between transition-all duration-500 ${getNavBackground()}`}>
        {/* Logo Section */}
        <Link 
          to="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="flex flex-col items-start leading-none group cursor-pointer"
        >
          <span className={`text-xl md:text-2xl font-black tracking-tight transition-colors ${getTextColor()}`}>
            SHRIYANS
          </span>
          <span className={`text-[10px] md:text-[12px] font-bold tracking-[0.4em] self-end -mt-1 transition-colors uppercase ${isScrolled || isMenuOpen || !isHome && !isOrders ? 'text-white/70' : 'text-white/50'}`}>
            Lotus Seeds
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="relative">
            <ul ref={navRef} className={`flex items-center gap-8 text-sm uppercase tracking-widest ${getTextColor()}`}>
              <li>
                <NavLink to="/" onClick={(e) => handleLinkClick(e, '/')} className={({ isActive }) => `relative py-2 font-bold transition-colors duration-300 ${isActive ? 'active opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/products" onClick={(e) => handleLinkClick(e, '/products')} className={({ isActive }) => `relative py-2 font-bold transition-colors duration-300 ${isActive ? 'active opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/recipes" onClick={(e) => handleLinkClick(e, '/recipes')} className={({ isActive }) => `relative py-2 font-bold transition-colors duration-300 ${isActive ? 'active opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                  Recipes
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" onClick={(e) => handleLinkClick(e, '/about')} className={({ isActive }) => `relative py-2 font-bold transition-colors duration-300 ${isActive ? 'active opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className={({ isActive }) => `relative py-2 font-bold transition-colors duration-300 ${isActive ? 'active opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                  Contact
                </NavLink>
              </li>
            </ul>
            {/* Sliding Single Indicator (Desktop only) */}
            <span 
              className="absolute bottom-0 h-0.5 bg-accent transition-all duration-[800ms] ease-out pointer-events-none"
              style={{ 
                left: `${indicatorStyle.left}px`, 
                width: `${indicatorStyle.width}px` 
              }}
            />
          </div>
        </div>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex relative group items-center">
            <input 
              type="text" 
              placeholder="Search products..."
              onFocus={() => setIsSearchOpen(true)}
              className={`bg-secondary/20 hover:bg-secondary/40 border border-white/10 rounded-full px-6 py-1.5 w-48 lg:w-64 focus:w-80 focus:bg-white focus:text-primary transition-all duration-300 text-sm font-bold outline-none shadow-sm ${getTextColor()}`}
            />
            <Search className={`absolute right-4 w-4 h-4 transition-colors pointer-events-none ${isScrolled || isMenuOpen || !isHome ? 'text-white/40 group-focus-within:text-white' : 'text-primary/40 group-focus-within:text-primary'}`} />
          </div>

          <button 
            onClick={() => setIsSearchOpen(true)}
            className={`md:hidden p-2 hover:bg-secondary/20 rounded-full transition-all ${getTextColor()}`}
          >
            <Search className="w-6 h-6" />
          </button>
          
          <Link to="/cart" onClick={(e) => handleLinkClick(e, '/cart')} className={`p-2 hover:bg-secondary/20 rounded-full transition-all relative group ${getTextColor()}`}>
            <ShoppingCart className="w-5 md:w-6 h-5 md:h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] md:text-xs font-black flex items-center justify-center rounded-full shadow-lg border-2 border-primary animate-in zoom-in duration-300">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
          
          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center">
            <Show when="signed-out">
                <Link to="/sign-in" className="bg-accent text-white px-6 py-1.5 rounded-full font-bold text-sm hover:scale-105 transition-all cursor-pointer block shadow-lg shadow-black/20">
                    Sign In
                </Link>
            </Show>
            <Show when="signed-in">
                <ProfileAvatar />
            </Show>
          </div>
          
          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 hover:bg-secondary/20 rounded-lg transition-all ${getTextColor()}`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed top-[65px] left-0 right-0 bottom-0 bg-primary/95 backdrop-blur-3xl z-40 md:hidden flex flex-col items-center justify-center gap-10 transition-all duration-500 overflow-hidden ${isMenuOpen ? 'opacity-100 h-[calc(100vh-65px)]' : 'opacity-0 h-0'}`}>
          <ul className="flex flex-col items-center gap-6 text-lg font-black uppercase text-white">
            <li>
              <NavLink to="/" onClick={(e) => { setIsMenuOpen(false); handleLinkClick(e, '/'); }} className={({ isActive }) => isActive ? 'text-accent' : 'hover:text-accent transition-colors'}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/products" onClick={(e) => { setIsMenuOpen(false); handleLinkClick(e, '/products'); }} className={({ isActive }) => isActive ? 'text-accent' : 'hover:text-accent transition-colors'}>Products</NavLink>
            </li>
            <li>
              <NavLink to="/recipes" onClick={(e) => { setIsMenuOpen(false); handleLinkClick(e, '/recipes'); }} className={({ isActive }) => isActive ? 'text-accent' : 'hover:text-accent transition-colors'}>Recipes</NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={(e) => { setIsMenuOpen(false); handleLinkClick(e, '/about'); }} className={({ isActive }) => isActive ? 'text-accent' : 'hover:text-accent transition-colors'}>About</NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={(e) => { setIsMenuOpen(false); handleLinkClick(e, '/contact'); }} className={({ isActive }) => isActive ? 'text-accent' : 'hover:text-accent transition-colors'}>Contact</NavLink>
            </li>
          </ul>
          
          <div className="scale-125">
            <Show when="signed-out">
                <Link to="/sign-in" className="bg-accent text-white px-12 py-3 rounded-full font-black uppercase text-lg tracking-widest cursor-pointer block" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                </Link>
            </Show>
            <Show when="signed-in">
                <div className="flex flex-col items-center gap-4">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-2 group">
                        <ProfileAvatar size="lg" />
                        <span className="text-white/60 font-black uppercase text-[10px] tracking-widest group-hover:text-white transition-colors">My Profile</span>
                    </Link>
                </div>
            </Show>
          </div>
        </div>
      </nav>
      {/* Modular Search Drawer Component */}
      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Navbar
