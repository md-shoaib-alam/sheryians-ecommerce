import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from "@clerk/react"
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  X,
  ExternalLink,
  ChevronRight,
  Bell,
  Search,
  Youtube,
  Menu as MenuIcon
} from 'lucide-react'

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-4 px-6 py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] transition-all
      ${active ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-primary/40 hover:text-primary hover:bg-secondary/20'}`}
  >
    <Icon className="w-4 h-4 shrink-0" />
    <span className="flex-1 whitespace-nowrap">{label}</span>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
  </Link>
)

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const { user } = useUser()

  const breadcrumbs = location.pathname.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1))

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-sans text-primary">
      
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-primary/5 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full py-10 px-6">
          
          {/* Logo */}
          <div className="flex items-center gap-4 mb-16 px-2">
             <Link to="/" className="flex flex-col items-start leading-none group">
                <span className="text-2xl font-black italic tracking-tighter text-primary group-hover:text-accent transition-colors">
                  SHRIYANS
                </span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-primary/30 self-end -mt-1 group-hover:text-primary transition-colors uppercase">
                  Admin Panel
                </span>
             </Link>
             <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto p-2 hover:bg-secondary/20 rounded-full transition-colors text-primary/20">
                <X className="w-4 h-4" />
             </button>
          </div>

          <nav className="flex-1 space-y-10 overflow-y-auto no-scrollbar">
            {/* MAIN Section */}
            <div>
               <p className="px-6 text-[9px] font-black text-primary/20 uppercase tracking-[0.4em] mb-4">Operations</p>
               <div className="space-y-2">
                  <SidebarItem to="/admin" icon={LayoutDashboard} label="Overview" active={location.pathname === '/admin'} />
                  <SidebarItem to="/admin/products" icon={Package} label="Inventory" active={location.pathname === '/admin/products'} />
                  <SidebarItem to="/admin/recipes" icon={Youtube} label="Theater" active={location.pathname === '/admin/recipes'} />
                  <SidebarItem to="/admin/orders" icon={ShoppingBag} label="Orders" active={location.pathname === '/admin/orders'} />
                  <SidebarItem to="/admin/users" icon={Users} label="Customers" active={location.pathname === '/admin/users'} />
               </div>
            </div>

            {/* OTHERS Section */}
            <div>
               <p className="px-6 text-[9px] font-black text-primary/20 uppercase tracking-[0.4em] mb-4">Resources</p>
               <div className="space-y-2">
                  <Link to="/" className="flex items-center gap-4 px-6 py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] text-accent hover:bg-accent/5 transition-all">
                     <ExternalLink className="w-4 h-4" />
                     Return To Store
                  </Link>
               </div>
            </div>
          </nav>

          {/* User Profile Footer */}
          <div className="mt-auto pt-8 border-t border-primary/5">
             <div className="flex items-center gap-4 p-4 rounded-[32px] bg-secondary/10 hover:bg-secondary/20 transition-all group cursor-pointer border border-primary/5">
                <div className="w-12 h-12 rounded-full border border-primary/10 overflow-hidden shadow-sm shrink-0">
                   <img src={user?.imageUrl} alt="Admin" className="w-full h-full object-cover" />
                </div>
                <div className="truncate flex-1">
                   <h4 className="text-[11px] font-black truncate uppercase tracking-widest text-primary">{user?.fullName || 'Administrator'}</h4>
                   <p className="text-[9px] text-primary/30 truncate uppercase font-bold tracking-widest">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth bg-[#fdfdfd]">
        
        {/* Header / Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-primary/5 px-6 md:px-12 py-6 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="lg:hidden p-3 bg-secondary/20 hover:bg-secondary/30 rounded-2xl transition-all"
              >
                <MenuIcon className="w-5 h-5 text-primary" />
              </button>
              
              <div className="hidden sm:block">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary/20 mb-1">
                    <span>Shriyans</span>
                    <ChevronRight className="w-2.5 h-2.5 opacity-30" />
                    <span className="text-accent">{breadcrumbs[breadcrumbs.length - 1] || 'Dashboard'}</span>
                 </div>
                 <h2 className="text-3xl font-serif font-black italic text-primary tracking-tighter capitalize">
                    {breadcrumbs[breadcrumbs.length - 1] || 'Dashboard'}
                 </h2>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center relative">
                 <Search className="absolute left-4 w-4 h-4 text-primary/20" />
                 <input 
                    placeholder="FIND DATA..." 
                    className="bg-secondary/10 border-none rounded-full pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 ring-primary/5 transition-all w-64 text-primary placeholder:text-primary/20"
                 />
              </div>
              <button className="p-4 bg-white border border-primary/5 text-primary/40 hover:text-accent rounded-full transition-all relative shadow-soft">
                 <Bell className="w-4 h-4" />
                 <span className="absolute top-4 right-4 w-1.5 h-1.5 bg-accent rounded-full border border-white" />
              </button>
           </div>
        </header>

        <div className="p-8 md:p-12 max-w-7xl mx-auto">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
             >
                {children}
             </motion.div>
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
