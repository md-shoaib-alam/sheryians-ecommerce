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

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
  <div className="bg-white border border-brand-red/10 rounded-xl p-6 flex items-center gap-5 hover:border-brand-red/30 transition-all shadow-sm group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shrink-0 shadow-inner bg-opacity-10`}>
      <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-').replace('/20', '')}`} />
    </div>
    <div className="truncate">
      <p className="text-brand-dark/30 font-bold uppercase text-[9px] tracking-widest font-syne mb-0.5">{label}</p>
      <h3 className="text-xl font-black font-syne text-brand-dark truncate">{value}</h3>
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
          <Loader2 className="w-8 h-8 text-brand-dark/20 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 md:gap-12">
        <header className="flex flex-col sm:flex-row items-center sm:justify-between gap-6 px-4 md:px-0">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-brand-red">DASHBOARD OVERVIEW</h1>
            <p className="text-brand-dark/30 font-bold uppercase text-[10px] tracking-[0.2em] font-sans">Real-time store performance analytics</p>
          </div>
          <div className="flex items-center gap-3 bg-brand-red/5 border border-brand-red/10 px-5 py-3 rounded-full">
              <Calendar className="w-4 h-4 text-brand-dark/40" />
              <span className="text-[10px] font-black font-sans uppercase tracking-widest text-brand-dark/60">
                 {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
          </div>
        </header>

        {/* Global Key Stats Discovery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0 mb-10">
          <StatCard icon={BarChart3} label="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} color="bg-brand-red/20" />
          <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders || 0} color="bg-orange-500/20" />
          <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="bg-blue-500/20" />
          <StatCard icon={Package} label="Total Products" value={stats?.totalProducts || 0} color="bg-purple-500/20" />
        </div>

        {/* Orders Frictionless Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 px-4 md:px-0">
          {/* Latest Orders List Content */}
          <div className="lg:col-span-8 bg-white border border-brand-red/10 rounded-xl p-6 md:p-8 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-red/5">
              <div className="flex items-center gap-3">
                <div className="bg-brand-red/5 p-2 rounded-lg text-brand-red"><Clock className="w-4 h-4" /></div>
                <h3 className="text-lg font-black uppercase tracking-tight text-brand-red">RECENT ORDERS</h3>
              </div>
              <Link to="/admin/orders" className="text-[9px] font-black uppercase tracking-widest text-brand-red hover:bg-brand-red/5 px-3 py-1.5 rounded-lg transition-all">SEE ALL</Link>
            </div>

            <div className="space-y-3 overflow-x-auto custom-scrollbar-horizontal pr-2 pb-4">
              {stats?.recentOrders?.length === 0 ? (
                <div className="text-center py-12 opacity-20 italic font-syne uppercase tracking-widest">No orders yet</div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-widest text-brand-dark/30 border-b border-brand-red/5">
                      <th className="pb-4 pr-4 uppercase">Order Info</th>
                      <th className="pb-4 pr-4 uppercase">Customer</th>
                      <th className="pb-4 pr-4 uppercase">Total</th>
                      <th className="pb-4 pr-4 uppercase">Status</th>
                      <th className="pb-4 pr-4 text-right uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-bold text-brand-dark/80">
                    {stats?.recentOrders?.map((order: any) => (
                      <tr key={order.id} className="border-b border-brand-red/5 hover:bg-brand-red/5 transition-all group">
                        <td className="py-5 pr-4 font-black font-syne uppercase text-[10px] tracking-tight text-brand-dark">#{order.id.slice(0, 8)}</td>
                        <td className="py-5 pr-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center font-black italic text-xs text-brand-red">
                                {order.user?.name?.[0] || 'U'}
                            </div>
                            <div className="flex flex-col">
                                <p className="text-xs font-black font-syne uppercase tracking-tight text-brand-dark">{order.user?.name || 'Anonymous'}</p>
                                <p className="text-[8px] text-brand-dark/30 font-poppins">{order.user?.email}</p>
                            </div>
                        </td>
                        <td className="py-5 pr-4 font-black font-poppins text-xs text-brand-dark">₹{order.total}</td>
                        <td className="py-5 pr-4">
                           <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border 
                            ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 border-green-200' : 
                              order.status === 'PENDING' ? 'bg-brand-red/10 text-brand-red border-brand-red/10' : 
                              'bg-brand-pink text-brand-dark/50 border-brand-red/5'}`}>
                                {order.status}
                           </span>
                        </td>
                        <td className="py-5 pr-4 text-right text-brand-dark/40 font-poppins">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Quick Shortcuts Discovery Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-brand-red/10 rounded-xl p-6 md:p-8 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <div className="bg-brand-red/5 p-2 rounded-lg text-brand-red"><PlusCircle className="w-4 h-4 text-brand-red" /></div>
                 <h3 className="text-lg font-black uppercase tracking-tight text-brand-red">QUICK ACTIONS</h3>
               </div>
               <div className="flex flex-col gap-3">
                 <Link to="/admin/products" className="group flex items-center justify-between bg-brand-red text-white py-4 px-6 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-brand-dark transition-all shadow-sm">
                    ADD NEW PRODUCT
                    <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-all duration-500" />
                 </Link>
                 <Link to="/admin/orders" className="flex items-center justify-between bg-[#FAF6F6] border border-brand-red/5 hover:border-brand-red/20 text-brand-dark py-4 px-6 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all shadow-sm">
                    VIEW ORDERS
                    <ShoppingBag className="w-4 h-4 text-brand-red" />
                 </Link>
               </div>
            </div>

            <div className="bg-white border border-brand-red/10 rounded-xl p-6 md:p-8 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-all duration-1000" />
                <h3 className="text-xl font-black uppercase tracking-tight text-brand-red mb-2 leading-tight">SYSTEM STATUS</h3>
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-brand-dark/30 mb-8">ALL SYSTEMS OPERATIONAL</p>
                <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">ACTIVE</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
