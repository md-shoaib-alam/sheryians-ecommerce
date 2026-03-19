import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from "@clerk/react"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  X,
  ExternalLink,
  ChevronRight,
  Bell,
  Search,
  Menu as MenuIcon
} from 'lucide-react'

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-syne font-black uppercase text-[10px] tracking-widest transition-all
      ${active ? 'bg-brand-red text-white shadow-md' : 'text-brand-dark/40 hover:text-brand-red hover:bg-brand-red/5'}`}
  >
    <Icon className="w-4 h-4" />
    <span className="flex-1">{label}</span>
    {active && <ChevronRight className="w-3 h-3 ml-auto" />}
  </Link>
)

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const { user } = useUser()

  const breadcrumbs = location.pathname.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1))

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex overflow-hidden font-poppins text-brand-dark">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-brand-red/10 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full py-6 px-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2">
             <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-sm">S</span>
             </div>
             <div>
                <h2 className="text-sm font-black font-syne uppercase tracking-tighter">Shriyans</h2>
                <p className="text-[7px] font-bold text-brand-dark/30 uppercase tracking-[0.2em] leading-none">Management UI</p>
             </div>
             <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto p-1.5 hover:bg-brand-red/5 rounded-full transition-colors">
                <X className="w-4 h-4 text-brand-dark/20" />
             </button>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
            {/* MAIN Section */}
            <div>
               <p className="px-4 text-[9px] font-black text-brand-dark/20 uppercase tracking-[0.3em] mb-3">Main</p>
               <div className="space-y-1">
                  <SidebarItem to="/admin" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/admin'} />
                  <SidebarItem to="/admin/products" icon={Package} label="Inventory" active={location.pathname === '/admin/products'} />
                  <SidebarItem to="/admin/orders" icon={ShoppingBag} label="Orders" active={location.pathname === '/admin/orders'} />
                  <SidebarItem to="/admin/users" icon={Users} label="Customers" active={location.pathname === '/admin/users'} />
               </div>
            </div>

            {/* OTHERS Section */}
            <div>
               <p className="px-4 text-[9px] font-black text-brand-dark/20 uppercase tracking-[0.3em] mb-3">Others</p>
               <div className="space-y-1">
                  <SidebarItem to="/profile" icon={Settings} label="Admin Settings" active={location.pathname === '/profile'} />
                  <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-syne font-black uppercase text-[10px] tracking-widest text-brand-red/60 hover:text-brand-red hover:bg-brand-red/5 transition-all">
                     <ExternalLink className="w-4 h-4" />
                     Return To Store
                  </Link>
               </div>
            </div>
          </nav>

          {/* User Profile Footer */}
          <div className="mt-auto pt-6 border-t border-brand-red/5">
             <div className="flex items-center gap-3 p-2 rounded-xl bg-brand-pink/30 hover:bg-brand-pink/50 transition-all group cursor-pointer">
                <div className="w-10 h-10 rounded-full border border-brand-red/10 overflow-hidden shadow-sm shrink-0">
                   <img src={user?.imageUrl} alt="Admin" className="w-full h-full object-cover" />
                </div>
                <div className="truncate flex-1">
                   <h4 className="text-[11px] font-black truncate font-syne uppercase">{user?.fullName || 'Admin'}</h4>
                   <p className="text-[8px] text-brand-dark/30 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
                <ChevronRight className="w-3 h-3 text-brand-dark/20 group-hover:text-brand-red transition-colors" />
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth bg-[#f8f9fa]">
        
        {/* Header / Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-brand-red/5 px-6 md:px-10 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="lg:hidden p-2 hover:bg-brand-red/5 rounded-lg transition-colors"
              >
                <MenuIcon className="w-5 h-5 text-brand-dark" />
              </button>
              
              <div className="hidden sm:block">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-dark/30 font-syne mb-1">
                    <span>Admin Panel</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                    <span className="text-brand-red">{breadcrumbs[breadcrumbs.length - 1] || 'Dashboard'}</span>
                 </div>
                 <h2 className="text-xl font-black font-syne uppercase tracking-tighter">
                    {breadcrumbs[breadcrumbs.length - 1] || 'Dashboard'}
                 </h2>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center relative mr-2">
                 <Search className="absolute left-3 w-3.5 h-3.5 text-brand-dark/20" />
                 <input 
                    placeholder="Search..." 
                    className="bg-brand-pink/50 border border-brand-red/5 rounded-lg pl-9 pr-4 py-2 text-[10px] font-bold outline-none focus:border-brand-red/20 transition-all w-48"
                 />
              </div>
              <button className="p-2.5 hover:bg-brand-red/5 text-brand-dark/40 hover:text-brand-red rounded-lg transition-all relative">
                 <Bell className="w-4 h-4" />
                 <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-red rounded-full" />
              </button>
           </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </div>
  )
}

export default AdminLayout
