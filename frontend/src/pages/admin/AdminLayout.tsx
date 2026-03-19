import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ChevronRight,
  Menu,
  X,
  ExternalLink
} from 'lucide-react'

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-4 px-6 py-4 rounded-3xl font-syne font-black uppercase text-[10px] tracking-widest transition-all
      ${active ? 'bg-white text-black shadow-xl shadow-white/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
  >
    <Icon className="w-4 h-4" />
    <span className="flex-1">{label}</span>
    {active && <ChevronRight className="w-3 h-3" />}
  </Link>
)

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-black/40 backdrop-blur-3xl border-r border-white/5 transform transition-transform duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-8 px-6">
          <div className="flex items-center gap-4 mb-16 px-4">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
              <span className="text-black font-black text-xl font-syne italic">S</span>
            </div>
            <div>
              <h2 className="text-lg font-black font-syne italic uppercase tracking-tighter leading-none">Shriyans</h2>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] font-poppins">Admin Portal</p>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto p-2 bg-white/5 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem to="/admin" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/admin'} />
            <SidebarItem to="/admin/products" icon={Package} label="Inventory" active={location.pathname === '/admin/products'} />
            <SidebarItem to="/admin/orders" icon={ShoppingBag} label="Orders" active={location.pathname === '/admin/orders'} />
            <SidebarItem to="/admin/users" icon={Users} label="Customers" active={location.pathname === '/admin/users'} />
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5">
            <Link to="/" className="flex items-center gap-4 px-6 py-4 rounded-3xl font-syne font-black uppercase text-[10px] tracking-widest text-amber-400 hover:bg-amber-400/5 transition-all">
                <ExternalLink className="w-4 h-4" />
                Return to Store
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative h-screen custom-scrollbar">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
               <span className="text-black font-black text-sm font-syne italic">S</span>
             </div>
             <h2 className="text-sm font-black font-syne italic uppercase tracking-tighter">Admin</h2>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white/5 rounded-2xl">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </header>

        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </div>
  )
}

export default AdminLayout
