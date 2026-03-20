import { useState, useEffect } from 'react'
import { useAuth } from "@clerk/react"
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import {
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

// ─── Stat Card Component ───────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
  <div className="bg-white border border-primary/5 rounded-[40px] p-8 flex items-center gap-6 hover:border-accent/20 transition-all shadow-soft group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-all duration-1000 opacity-0 group-hover:opacity-100" />
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shrink-0 shadow-lg shadow-white/10 group-hover:scale-110 transition-transform duration-500`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-').replace('/10', '')}`} />
    </div>
    <div className="truncate flex-1">
      <p className="text-primary/30 font-black uppercase text-[9px] tracking-[0.3em] mb-1">{label}</p>
      <h3 className="text-3xl font-serif font-black italic text-primary truncate tracking-tighter">{value}</h3>
    </div>
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
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-16 md:gap-24">
        <header className="flex flex-col sm:flex-row items-center sm:justify-between gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-black italic text-primary tracking-tighter mb-2">Omniscience.</h1>
            <p className="text-primary/30 font-black uppercase text-[10px] tracking-[0.5em] pl-1">Store Performance Hub</p>
          </div>
          <div className="flex items-center gap-4 bg-secondary/20 border border-primary/5 px-8 py-4 rounded-full shadow-soft backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-primary/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                 {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
          </div>
        </header>

        {/* Global Key Stats Discovery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard icon={BarChart3} label="Revenue Flow" value={formatCurrency(stats?.totalRevenue || 0)} color="bg-accent/10" />
          <StatCard icon={ShoppingBag} label="Orders count" value={stats?.totalOrders || 0} color="bg-primary/5" />
          <StatCard icon={Users} label="Active clients" value={stats?.totalUsers || 0} color="bg-secondary/20" />
          <StatCard icon={Package} label="Inventory items" value={stats?.totalProducts || 0} color="bg-green-500/10" />
        </div>

        {/* Orders Frictionless Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Latest Orders List Content */}
          <div className="lg:col-span-8 bg-white border border-primary/5 rounded-[48px] p-10 md:p-12 shadow-soft overflow-hidden">
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center border border-primary/5">
                   <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-3xl font-serif font-black italic text-primary tracking-tighter">Recent Exchanges</h3>
              </div>
              <Link to="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline transition-all">SEE ALL HISTORY</Link>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              {stats?.recentOrders?.length === 0 ? (
                <div className="text-center py-24 italic font-serif text-3xl text-primary/10">No recent transactions</div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/20 border-b border-primary/5">
                      <th className="pb-8 pr-6">IDENTITY</th>
                      <th className="pb-8 pr-6">CLIENT</th>
                      <th className="pb-8 pr-6">EXCHANGE</th>
                      <th className="pb-8 pr-6">STATE</th>
                      <th className="pb-8 text-right">MOMENT</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {stats?.recentOrders?.map((order: any) => (
                      <tr key={order.id} className="border-b border-primary/5 hover:bg-secondary/5 transition-all group">
                        <td className="py-8 pr-6 font-serif font-black italic text-primary tracking-tighter">#{order.id.slice(0, 8).toUpperCase()}</td>
                        <td className="py-8 pr-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center font-serif font-black italic text-sm text-primary group-hover:scale-110 transition-transform">
                                    {order.user?.name?.[0] || 'U'}
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-serif font-black italic text-primary leading-none mb-1">{order.user?.name || 'Private Client'}</p>
                                    <p className="text-[10px] text-primary/20 font-black uppercase tracking-widest leading-none">{order.user?.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="py-8 pr-6 font-black italic text-primary tracking-tighter text-lg">₹{order.total}</td>
                        <td className="py-8 pr-6">
                           <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border shadow-sm
                            ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-700 border-green-500/10' : 
                              order.status === 'PENDING' ? 'bg-primary/5 text-primary border-primary/5' : 
                              'bg-secondary/10 text-primary/40 border-primary/5'}`}>
                                {order.status}
                           </span>
                        </td>
                        <td className="py-8 text-right text-primary/30 font-black text-[10px] tracking-widest uppercase">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Quick Shortcuts Discovery Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-primary/5 rounded-[48px] p-10 md:p-12 shadow-soft">
               <div className="flex items-center gap-4 mb-12">
                 <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20">
                    <PlusCircle className="w-6 h-6 text-accent" />
                 </div>
                 <h3 className="text-3xl font-serif font-black italic text-primary tracking-tighter">Velocity</h3>
               </div>
               <div className="flex flex-col gap-4">
                 <Link to="/admin/products" className="group flex items-center justify-between bg-primary text-secondary py-6 px-10 rounded-full font-black uppercase text-[11px] tracking-[0.3em] overflow-hidden relative hover:scale-[1.02] transition-all shadow-2xl shadow-primary/20">
                    <span className="relative z-10">CURATE SELECTION</span>
                    <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-all duration-700 relative z-10" />
                    <div className="absolute inset-0 bg-accent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                 </Link>
                 <Link to="/admin/orders" className="flex items-center justify-between bg-secondary/10 border border-primary/5 hover:bg-secondary/20 text-primary py-6 px-10 rounded-full font-black uppercase text-[11px] tracking-[0.3em] transition-all">
                    AUDIT HISTORY
                    <ShoppingBag className="w-5 h-5 opacity-40" />
                 </Link>
               </div>
            </div>

            <div className="bg-primary border border-primary rounded-[48px] p-10 md:p-12 shadow-2xl overflow-hidden relative group">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent/20 rounded-full blur-[100px] -z-0 group-hover:scale-150 transition-all duration-1000" />
                <h3 className="text-3xl font-serif font-black italic text-white mb-2 leading-tight relative z-10">Guardian</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-10 relative z-10">SYSTEM PULSE CHECK</p>
                <div className="flex items-center gap-4 text-accent relative z-10">
                    <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white">NOMINAL STATE</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
