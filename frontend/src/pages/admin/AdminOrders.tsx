import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@clerk/react"
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import {
  ShoppingBag,
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
               <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-brand-red">ORDER MANAGEMENT</h1>
               <div className="flex items-center gap-3 mt-2">
                  <span className="text-brand-red font-bold uppercase text-[10px] tracking-widest">{orders.length} ACTIVE ORDERS</span>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <input
                    placeholder="SEARCH ORDERS..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-[#FAF6F6] border border-brand-red/10 focus:border-brand-red/30 text-brand-dark placeholder:text-brand-dark/20 px-4 py-2.5 rounded-lg outline-none font-bold text-[10px] tracking-widest uppercase transition-all shadow-sm"
                  />
               </div>
               
               <div className="relative group">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red/60" />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="appearance-none bg-[#FAF6F6] border border-brand-red/10 focus:border-brand-red/30 text-brand-dark pl-11 pr-10 py-2.5 rounded-lg outline-none font-bold text-[10px] tracking-widest uppercase transition-all cursor-pointer shadow-sm"
                  >
                     <option value="">ALL STATUSES</option>
                     {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/20 pointer-events-none transition-transform group-hover:rotate-180" />
               </div>
            </div>
         </header>

         {loading ? (
            <div className="py-40 flex items-center justify-center">
               <Loader2 className="w-10 h-10 text-brand-dark/10 animate-spin" />
            </div>
         ) : filtered.length === 0 ? (
            <div className="py-32 border-2 border-dashed border-brand-red/10 rounded-3xl flex flex-col items-center gap-6 justify-center text-center px-10">
               <div className="w-20 h-20 rounded-full bg-brand-red/5 flex items-center justify-center text-brand-red/40"><ShoppingBag className="w-8 h-8" /></div>
               <div>
                  <h3 className="text-brand-dark font-black uppercase text-xl mb-2">NO ORDERS FOUND</h3>
                  <p className="text-brand-dark/40 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">Try a different filter or search query.</p>
               </div>
            </div>
         ) : (
            <div className="space-y-6">
               {filtered.map(order => (
                  <div key={order.id} className="bg-white border border-brand-red/10 rounded-2xl overflow-hidden shadow-sm transition-all group">
                     <div className="p-8 md:p-10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-10 border-b border-brand-red/5">
                           <div className="flex items-center gap-5">
                              <div className="w-16 h-16 bg-brand-red/5 rounded-xl flex items-center justify-center shadow-sm">
                                 <p className="text-brand-red font-black text-2xl leading-none">#{order.id.slice(0, 2)}</p>
                              </div>
                              <div>
                                 <h3 className="text-xl font-black uppercase tracking-tight text-brand-dark">ORDER #{order.id.split('-')[0].toUpperCase()}</h3>
                                 <div className="flex items-center gap-2 mt-2">
                                    <Clock className="w-3.5 h-3.5 text-brand-dark/30" />
                                    <p className="text-brand-dark/40 font-bold uppercase text-[9px] tracking-widest">{new Date(order.createdAt).toLocaleString()}</p>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-3 w-full md:w-auto">
                              <div className="flex flex-col items-end md:items-center mr-0 md:mr-6 text-right md:text-center">
                                 <p className="text-2xl font-black text-brand-dark font-sans">₹{order.total}</p>
                                 <p className="text-[8px] font-bold uppercase tracking-widest text-brand-dark/40 mt-1">{order.paymentMethod} • {order.paymentStatus}</p>
                              </div>
                              
                              <div className="hidden md:block w-px h-10 bg-brand-red/10" />

                              <div className={`flex items-center gap-3 px-6 py-4 rounded-full border bg-[#FAF6F6] text-brand-dark border-brand-red/10`}>
                                 {updating === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : getStatusIcon(order.status)}
                                 <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                              </div>
                              
                              <div className="relative group/menu">
                                 <button className="p-4 bg-[#FAF6F6] border border-brand-red/10 hover:border-brand-red/30 rounded-full transition-all text-brand-dark"><MoreVertical className="w-4 h-4" /></button>
                                 <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-brand-red/10 rounded-2xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 z-50 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-brand-red/5 bg-brand-red/5"><p className="text-[8px] font-black uppercase tracking-widest text-brand-dark/40">Update Status</p></div>
                                    <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                                       {ORDER_STATUSES.map(s => (
                                          <button
                                            key={s}
                                            disabled={updating === order.id}
                                            onClick={() => handleUpdateStatus(order.id, s)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${order.status === s ? 'bg-brand-red text-white' : 'text-brand-dark hover:bg-brand-red/5'}`}
                                          >
                                             {s}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                           <div className="space-y-8">
                              <div>
                                 <div className="flex items-center gap-3 mb-5">
                                    <div className="bg-brand-red/5 p-2 rounded-lg"><Mail className="w-3.5 h-3.5 text-brand-red" /></div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">CUSTOMER INSIGHT</h4>
                                 </div>
                                 <div className="flex items-center gap-4 bg-[#FAF6F6] border border-brand-red/5 p-5 rounded-3xl">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-xl text-brand-red shadow-sm">{order.user?.name?.[0] || 'U'}</div>
                                    <div>
                                       <p className="text-sm font-black uppercase tracking-tight text-brand-dark">{order.user?.name || 'Guest'}</p>
                                       <p className="text-[10px] text-brand-dark/50 mt-1">{order.user?.email}</p>
                                    </div>
                                 </div>
                              </div>

                              <div>
                                 <div className="flex items-center gap-3 mb-5">
                                    <div className="bg-brand-red/5 p-2 rounded-lg"><MapPin className="w-3.5 h-3.5 text-brand-red" /></div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">DELIVERY</h4>
                                 </div>
                                 <div className="bg-[#FAF6F6] border border-brand-red/5 p-6 rounded-3xl md:rounded-full md:px-10">
                                    <p className="text-xs font-bold text-brand-dark/70 leading-relaxed font-sans">
                                       {order.address ? (
                                          <>{order.address.line1}, {order.address.line2 && order.address.line2 + ', '}{order.address.city}, {order.address.state} {order.address.zip}</>
                                       ) : (
                                          <span className="italic opacity-50 uppercase tracking-widest text-[9px]">NO ADDRESS DATA</span>
                                       )}
                                    </p>
                                 </div>
                              </div>
                           </div>

                           <div>
                              <div className="flex items-center gap-3 mb-5">
                                 <div className="bg-brand-red/5 p-2 rounded-lg"><Package className="w-3.5 h-3.5 text-brand-red" /></div>
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">MANIFEST ({order.items?.length || 0} ITEMS)</h4>
                              </div>
                              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                 {order.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between gap-6 bg-[#FAF6F6] px-6 py-4 rounded-full border border-brand-red/5 hover:border-brand-red/20 transition-all group/item">
                                       <div className="flex items-center gap-4 truncate">
                                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-brand-red shadow-sm">{item.quantity}</div>
                                          <p className="text-[11px] font-bold uppercase tracking-tight text-brand-dark truncate font-sans">{item.name}</p>
                                       </div>
                                       <p className="text-[11px] font-black text-brand-red shrink-0">₹{item.price * item.quantity}</p>
                                    </div>
                                 ))}
                              </div>
                              <div className="mt-6 flex justify-between items-center px-6">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">MANIFEST TOTAL</p>
                                 <p className="text-lg font-black text-brand-dark font-sans">₹{order.subtotal}</p>
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
