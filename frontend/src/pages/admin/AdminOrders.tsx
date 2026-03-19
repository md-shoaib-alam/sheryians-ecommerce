import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import {
  ShoppingBag,
  Search,
  ChevronDown,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  Loader2,
  MapPin,
  Mail,
  MoreVertical,
} from 'lucide-react'

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

const AdminOrders = () => {
  const { getToken } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      const token = await getToken()
      const data = await api(`/api/admin/orders?status=${statusFilter}`, { token })
      setOrders(data.orders || [])
    } catch {
      // not available
    } finally {
      setLoading(false)
    }
  }, [getToken, statusFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const token = await getToken()
      await api(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        token,
        body: { status },
      })
      fetchOrders()
    } catch {
      alert('Failed to update order status.')
    } finally {
      setUpdating(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case 'SHIPPED':   return <Truck className="w-4 h-4 text-blue-400" />
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-400" />
      case 'PENDING':   return <Clock className="w-4 h-4 text-amber-400" />
      default:          return <Package className="w-4 h-4 text-white/40" />
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'SHIPPED':   return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'CANCELLED': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'PENDING':   return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'PROCESSING': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      default:          return 'bg-white/10 text-white/50 border-white/20'
    }
  }

  const filtered = orders.filter(o => 
    !search || 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="flex flex-col gap-10">
         <header className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
               <h1 className="text-3xl md:text-5xl font-black font-syne italic uppercase tracking-tighter text-white">Order Management</h1>
               <div className="flex items-center gap-3 mt-2">
                  <span className="text-amber-400 font-bold uppercase text-[10px] tracking-widest font-syne">{orders.length} ACTIVE ORDERS</span>
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-white/30 font-bold uppercase text-[10px] tracking-widest font-syne">Fulfillment discovery center</span>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                  <input
                    placeholder="Search orders..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/20 pl-12 pr-6 py-4 rounded-full outline-none font-syne font-bold text-[10px] tracking-widest uppercase transition-all"
                  />
               </div>
               
               <div className="relative group">
                  <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="appearance-none bg-white/5 border border-white/10 focus:border-white/40 text-white pl-12 pr-10 py-4 rounded-full outline-none font-syne font-black text-[10px] tracking-widest uppercase transition-all cursor-pointer"
                  >
                     <option value="">All Statuses</option>
                     {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none transition-transform group-hover:rotate-180" />
               </div>
            </div>
         </header>

         {loading ? (
            <div className="py-40 flex items-center justify-center">
               <Loader2 className="w-10 h-10 text-white/10 animate-spin" />
            </div>
         ) : filtered.length === 0 ? (
            <div className="py-32 border-2 border-dashed border-white/5 rounded-[50px] flex flex-col items-center gap-6 justify-center text-center px-10">
               <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 animate-pulse"><ShoppingBag className="w-8 h-8" /></div>
               <div>
                  <h3 className="text-white/80 font-black font-syne uppercase text-xl mb-2">No Orders Found</h3>
                  <p className="text-white/30 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">Either you are wait-listed for gourmet orders or try a different fulfillment filter.</p>
               </div>
            </div>
         ) : (
            <div className="space-y-6">
               {filtered.map(order => (
                  <div key={order.id} className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-3xl hover:bg-white/10 transition-all group shadow-2xl">
                     <div className="p-8 md:p-10">
                        {/* Order Meta Header Visibility */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-10 border-b border-white/5">
                           <div className="flex items-center gap-5">
                              <div className="w-16 h-16 bg-white rounded-3xl flex flex-col items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                 <p className="text-black font-black font-syne italic text-2xl leading-none">#{order.id.slice(0, 2)}</p>
                                 <p className="text-black/30 font-black font-syne text-[8px] uppercase tracking-tighter">{order.id.slice(2, 5)}</p>
                              </div>
                              <div>
                                 <h3 className="text-xl font-black font-syne italic uppercase tracking-tighter text-white/90">Order #{order.id.split('-')[0].toUpperCase()}</h3>
                                 <div className="flex items-center gap-3 mt-1 scale-90 origin-left">
                                    <Clock className="w-3.5 h-3.5 text-white/20" />
                                    <p className="text-white/30 font-bold uppercase text-[9px] tracking-widest font-syne">{new Date(order.createdAt).toLocaleString()}</p>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-3 w-full md:w-auto">
                              <div className="flex flex-col items-end md:items-center mr-0 md:mr-6 text-right md:text-center">
                                 <p className="text-2xl font-black font-poppins text-white">₹{order.total}</p>
                                 <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 font-syne">{order.paymentMethod} • {order.paymentStatus}</p>
                              </div>
                              
                              <div className="hidden md:block w-px h-10 bg-white/10" />

                              <div className={`flex items-center gap-3 px-6 py-4 rounded-3xl border transition-all ${getStatusStyles(order.status)}`}>
                                 {updating === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : getStatusIcon(order.status)}
                                 <span className="text-[10px] font-black uppercase tracking-widest font-syne">{order.status}</span>
                              </div>
                              
                              <div className="relative group/menu">
                                 <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-white/40 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                                 <div className="absolute top-full right-0 mt-2 w-56 bg-black border border-white/10 rounded-3xl shadow-3xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 z-50 overflow-hidden backdrop-blur-3xl">
                                    <div className="px-5 py-3 border-b border-white/5 bg-white/5"><p className="text-[8px] font-black uppercase tracking-widest text-white/20">Update Order Status</p></div>
                                    <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                                       {ORDER_STATUSES.map(s => (
                                          <button
                                            key={s}
                                            disabled={updating === order.id}
                                            onClick={() => handleUpdateStatus(order.id, s)}
                                            className={`w-full text-left px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest font-syne transition-all ${order.status === s ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                          >
                                             {s}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Customer & Address Insight Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                           <div className="space-y-8">
                              <div>
                                 <div className="flex items-center gap-3 mb-5">
                                    <div className="bg-white/10 p-2 rounded-xl"><Mail className="w-3.5 h-3.5 text-white/60" /></div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest font-syne text-white/30">Customer Insight</h4>
                                 </div>
                                 <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-5 rounded-[32px]">
                                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center font-black italic text-xl text-black">{order.user?.name?.[0] || 'U'}</div>
                                    <div>
                                       <p className="text-sm font-black font-syne uppercase tracking-tight text-white/90">{order.user?.name || 'Explorer'}</p>
                                       <p className="text-[10px] text-white/30 font-poppins">{order.user?.email}</p>
                                    </div>
                                 </div>
                              </div>

                              <div>
                                 <div className="flex items-center gap-3 mb-5">
                                    <div className="bg-white/10 p-2 rounded-xl"><MapPin className="w-3.5 h-3.5 text-white/60" /></div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest font-syne text-white/30">Delivery Coordinates</h4>
                                 </div>
                                 <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] md:rounded-full md:px-10">
                                    <p className="text-xs font-bold font-poppins text-white/70 leading-relaxed">
                                       {order.address ? (
                                          <>{order.address.line1}, {order.address.line2 && order.address.line2 + ', '}{order.address.city}, {order.address.state} {order.address.zip}</>
                                       ) : (
                                          <span className="italic opacity-50 font-syne uppercase tracking-widest">No address data found in discovery</span>
                                       )}
                                    </p>
                                 </div>
                              </div>
                           </div>

                           {/* Order Item Visualization Discovery */}
                           <div>
                              <div className="flex items-center gap-3 mb-5">
                                 <div className="bg-white/10 p-2 rounded-xl"><Package className="w-3.5 h-3.5 text-white/60" /></div>
                                 <h4 className="text-[10px] font-black uppercase tracking-widest font-syne text-white/30">Manifest ({order.items?.length || 0} Items)</h4>
                              </div>
                              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                 {order.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between gap-6 bg-white/5 border border-white/10 p-4 px-6 rounded-full hover:bg-white/10 transition-all cursor-default group/item">
                                       <div className="flex items-center gap-4 truncate">
                                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black font-poppins group-hover/item:bg-white group-hover/item:text-black transition-all">{item.quantity}</div>
                                          <p className="text-[11px] font-black font-syne uppercase tracking-tight text-white/80 truncate">{item.name}</p>
                                       </div>
                                       <p className="text-[11px] font-black font-poppins text-amber-400 shrink-0">₹{item.price * item.quantity}</p>
                                    </div>
                                 ))}
                              </div>
                              <div className="mt-6 flex justify-between items-center px-6">
                                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Manifest Total</p>
                                 <p className="text-lg font-black font-poppins text-white/40">₹{order.subtotal}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    </AdminLayout>
  )
}

export default AdminOrders
