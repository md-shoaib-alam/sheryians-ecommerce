import { useState, useEffect } from 'react'
import { useAuth } from "@clerk/react"
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  PlusCircle,
  BarChart3,
  Loader2,
} from 'lucide-react'

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalProducts: number
  recentOrders: any[]
}

const StatCard = ({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: string | number; trend?: string; color: string }) => (
  <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-3xl">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[8px] font-black uppercase text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
          <TrendingUp className="w-2.5 h-2.5" />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-3xl font-black font-syne italic uppercase tracking-tighter text-white">{value}</h3>
    <p className="text-white/30 font-bold uppercase text-[10px] tracking-widest font-syne">{label}</p>
  </div>
)

const AdminDashboard = () => {
  const { getToken } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken()
        const data = await api('/api/admin/stats', { token })
        setStats(data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [getToken])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 md:gap-12">
        <header className="flex flex-col sm:flex-row items-center sm:justify-between gap-6 px-4 md:px-0">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-5xl font-black font-syne italic uppercase tracking-tighter text-white">Dashboard Overview</h1>
            <p className="text-white/30 font-bold uppercase text-[10px] tracking-[0.2em] font-poppins">Real-time store performance analytics</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-full backdrop-blur-2xl">
              <Calendar className="w-4 h-4 text-white/50" />
              <span className="text-[10px] font-black font-syne uppercase tracking-widest text-white/60">
                 {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
          </div>
        </header>

        {/* Global Key Stats Discovery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
          <StatCard icon={BarChart3} label="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} color="bg-green-500/20" trend="+12.4%" />
          <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders || 0} color="bg-amber-500/20" trend="+8.2%" />
          <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="bg-blue-500/20" />
          <StatCard icon={Package} label="Total Products" value={stats?.totalProducts || 0} color="bg-red-500/20" />
        </div>

        {/* Orders Frictionless Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 px-4 md:px-0">
          {/* Latest Orders List Content */}
          <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 backdrop-blur-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2.5 rounded-xl"><Clock className="w-4 h-4 text-white" /></div>
                <h3 className="text-xl font-black font-syne italic uppercase tracking-tight text-white/80">Recent Orders</h3>
              </div>
              <Link to="/admin/orders" className="text-[9px] font-black uppercase tracking-widest font-syne text-amber-400 hover:text-white transition-colors">See all</Link>
            </div>

            <div className="space-y-3 overflow-x-auto custom-scrollbar-horizontal pr-2 pb-4">
              {stats?.recentOrders?.length === 0 ? (
                <div className="text-center py-12 opacity-20 italic font-syne uppercase tracking-widest">No orders yet</div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">
                      <th className="pb-4 pr-4">Order ID</th>
                      <th className="pb-4 pr-4">Customer</th>
                      <th className="pb-4 pr-4">Total</th>
                      <th className="pb-4 pr-4">Status</th>
                      <th className="pb-4 pr-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-bold text-white/80">
                    {stats?.recentOrders?.map((order: any) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                        <td className="py-5 pr-4 text-white font-syne font-black uppercase text-[10px] tracking-tight">#{order.id.slice(0, 8)}</td>
                        <td className="py-5 pr-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center font-black italic text-sm text-amber-500">
                                {order.user?.name?.[0] || 'U'}
                            </div>
                            <div className="flex flex-col">
                                <p className="text-xs font-black font-syne uppercase tracking-tight">{order.user?.name || 'Anonymous'}</p>
                                <p className="text-[8px] text-white/30 font-poppins">{order.user?.email}</p>
                            </div>
                        </td>
                        <td className="py-5 pr-4 font-black font-poppins text-xs">₹{order.total}</td>
                        <td className="py-5 pr-4">
                           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border 
                            ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-400 border-green-500/10' : 
                              order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/10' : 
                              'bg-white/10 text-white/50 border-white/10'}`}>
                                {order.status}
                           </span>
                        </td>
                        <td className="py-5 pr-4 text-right opacity-30 font-poppins">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Quick Shortcuts Discovery Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 backdrop-blur-3xl shadow-xl">
               <div className="flex items-center gap-4 mb-8">
                 <div className="bg-white/10 p-2.5 rounded-xl"><PlusCircle className="w-4 h-4 text-white" /></div>
                 <h3 className="text-xl font-black font-syne italic uppercase tracking-tight text-white/80">Quick Actions</h3>
               </div>
               <div className="flex flex-col gap-3">
                 <Link to="/admin/products" className="group flex items-center justify-between bg-white text-black py-4 px-6 rounded-2xl font-black font-syne uppercase text-[10px] tracking-widest hover:bg-amber-400 transition-all">
                    Add New Product
                    <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-all duration-500" />
                 </Link>
                 <Link to="/admin/orders" className="flex items-center justify-between border border-white/10 hover:bg-white/5 text-white/60 hover:text-white py-4 px-6 rounded-2xl font-black font-syne uppercase text-[10px] tracking-widest transition-all">
                    View Orders
                    <ShoppingBag className="w-4 h-4" />
                 </Link>
               </div>
            </div>

            <div className="bg-gradient-to-br from-red-600/20 to-amber-600/10 border border-white/10 rounded-[40px] p-8 md:p-10 backdrop-blur-3xl shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-all duration-1000" />
                <h3 className="text-3xl font-black font-syne italic uppercase tracking-tighter text-white mb-2 leading-tight">Shriyans <br/> Lotus Seeds</h3>
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40 mb-8">System status: All systems operational</p>
                <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px] font-black font-syne uppercase tracking-widest">Active</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
