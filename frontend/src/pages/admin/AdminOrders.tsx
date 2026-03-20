import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@clerk/react"
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import { motion } from 'framer-motion'
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
      case 'DELIVERED': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'SHIPPED':   return <Truck className="w-4 h-4 text-blue-500" />
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-accent" />
      case 'PENDING':   return <Clock className="w-4 h-4 text-amber-500" />
      default:          return <Package className="w-4 h-4 text-primary/20" />
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
      <div className="flex flex-col gap-16 md:gap-24">
         <header className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
               <h1 className="text-5xl md:text-7xl font-serif font-black italic text-primary tracking-tighter mb-2">Registry.</h1>
               <div className="flex items-center gap-4 pl-1">
                  <span className="text-secondary bg-primary px-4 py-1.5 rounded-full font-black uppercase text-[9px] tracking-[0.4em]">{orders.length} ACTIVE</span>
                  <p className="text-primary/20 font-black uppercase text-[10px] tracking-[0.5em]">Transaction Ledger</p>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
               <div className="relative flex-1 md:w-80">
                  <input
                    placeholder="SEARCH TRANSACTIONS..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-secondary/10 border-none text-primary placeholder:text-primary/20 px-10 py-5 rounded-full outline-none font-black text-[10px] tracking-[0.4em] uppercase transition-all shadow-soft focus:ring-4 ring-primary/5"
                  />
                  <Filter className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
               </div>
               
               <div className="relative group">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="appearance-none bg-primary text-secondary pl-10 pr-12 py-5 rounded-full outline-none font-black text-[10px] tracking-[0.4em] uppercase transition-all cursor-pointer shadow-2xl shadow-primary/20"
                  >
                     <option value="">ALL STATES</option>
                     {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 pointer-events-none transition-transform group-hover:rotate-180" />
               </div>
            </div>
         </header>

         {loading ? (
            <div className="py-60 flex items-center justify-center">
               <Loader2 className="w-16 h-16 text-primary/10 animate-spin" />
            </div>
         ) : filtered.length === 0 ? (
            <div className="py-40 border-2 border-dashed border-primary/5 rounded-[64px] flex flex-col items-center gap-10 justify-center text-center px-10 bg-secondary/5">
               <div className="w-32 h-32 rounded-[40px] bg-primary/5 flex items-center justify-center text-primary/10 border border-primary/5"><ShoppingBag className="w-12 h-12" /></div>
               <div>
                  <h3 className="text-primary/20 font-serif font-black italic text-4xl mb-4">No Records</h3>
                  <p className="text-primary/20 font-black uppercase text-[11px] tracking-[0.5em] max-w-sm mx-auto">The ledger is currently empty for these parameters.</p>
               </div>
            </div>
         ) : (
            <div className="space-y-12">
               {filtered.map(order => (
                  <motion.div 
                    layout
                    key={order.id} 
                    className="bg-white border border-primary/5 rounded-[48px] overflow-hidden shadow-soft transition-all group"
                  >
                     <div className="p-10 md:p-16">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-16 pb-16 border-b border-primary/5">
                           <div className="flex items-center gap-8">
                              <div className="w-20 h-20 bg-secondary/10 rounded-[28px] flex items-center justify-center shadow-soft border border-primary/5">
                                 <p className="text-primary font-serif font-black italic text-3xl leading-none">#{order.id.slice(0, 2).toUpperCase()}</p>
                              </div>
                              <div>
                                 <h3 className="text-3xl font-serif font-black italic text-primary tracking-tighter">Identity {order.id.split('-')[0].toUpperCase()}</h3>
                                 <div className="flex items-center gap-3 mt-2 pl-1">
                                    <Clock className="w-4 h-4 text-primary/20" />
                                    <p className="text-primary/30 font-black uppercase text-[10px] tracking-[0.3em]">{new Date(order.createdAt).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-6 w-full md:w-auto">
                              <div className="flex flex-col items-end mr-6">
                                 <p className="text-4xl font-serif font-black italic text-primary tracking-tighter">₹{order.total}</p>
                                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/20 mt-1">{order.paymentMethod} • {order.paymentStatus}</p>
                              </div>
                              
                              <div className="hidden md:block w-px h-16 bg-primary/5" />

                              <div className="flex items-center gap-4 px-10 py-5 rounded-full border bg-secondary/10 text-primary border-primary/5 shadow-soft">
                                 {updating === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : getStatusIcon(order.status)}
                                 <span className="text-[11px] font-black uppercase tracking-[0.3em]">{order.status}</span>
                              </div>
                              
                              <div className="relative group/menu">
                                 <button className="p-5 bg-white border border-primary/5 hover:bg-primary hover:text-white rounded-full transition-all text-primary shadow-soft"><MoreVertical className="w-5 h-5" /></button>
                                 <div className="absolute top-full right-0 mt-4 w-64 bg-white border border-primary/5 rounded-[32px] shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-500 z-50 overflow-hidden transform group-hover/menu:translate-y-0 translate-y-4">
                                    <div className="px-8 py-5 border-b border-primary/5 bg-secondary/20"><p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30">Mutate State</p></div>
                                    <div className="p-4 max-h-80 overflow-y-auto no-scrollbar">
                                       {ORDER_STATUSES.map(s => (
                                          <button
                                            key={s}
                                            disabled={updating === order.id}
                                            onClick={() => handleUpdateStatus(order.id, s)}
                                            className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${order.status === s ? 'bg-primary text-secondary' : 'text-primary/60 hover:bg-secondary/20 hover:text-primary'}`}
                                          >
                                             {s}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
                           <div className="space-y-12">
                              <div>
                                 <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-secondary/20 rounded-2xl flex items-center justify-center border border-primary/5"><Mail className="w-5 h-5 text-primary/40" /></div>
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/20">Client Insight</h4>
                                 </div>
                                 <div className="flex items-center gap-6 bg-secondary/10 p-8 rounded-[40px] border border-primary/5">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-serif font-black italic text-3xl text-primary shadow-soft border border-primary/5">{order.user?.name?.[0] || 'U'}</div>
                                    <div>
                                       <p className="text-xl font-serif font-black italic text-primary leading-none mb-1 capitalize">{order.user?.name || 'Anonymous'}</p>
                                       <p className="text-[11px] font-black text-primary/20 uppercase tracking-[0.3em]">{order.user?.email}</p>
                                    </div>
                                 </div>
                              </div>

                              <div>
                                 <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-secondary/20 rounded-2xl flex items-center justify-center border border-primary/5"><MapPin className="w-5 h-5 text-primary/40" /></div>
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/20">Nexus / Destination</h4>
                                 </div>
                                 <div className="bg-secondary/10 p-10 rounded-[40px] border border-primary/5 relative overflow-hidden group/loc">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/loc:opacity-10 transition-opacity">
                                       <MapPin className="w-24 h-24 text-primary" />
                                    </div>
                                    <p className="text-sm font-bold text-primary/60 leading-relaxed font-sans relative z-10 max-w-sm">
                                       {order.address ? (
                                          <>{order.address.line1}, {order.address.line2 && order.address.line2 + ', '}{order.address.city}, {order.address.state} {order.address.zip}</>
                                       ) : (
                                          <span className="italic opacity-50 uppercase tracking-widest text-[10px]">Registry lacks spatial data</span>
                                       )}
                                    </p>
                                 </div>
                              </div>
                           </div>

                           <div>
                              <div className="flex items-center gap-4 mb-8">
                                 <div className="w-10 h-10 bg-secondary/20 rounded-2xl flex items-center justify-center border border-primary/5"><Package className="w-5 h-5 text-primary/40" /></div>
                                 <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/20">Manifest ({order.items?.length || 0} ITEMS)</h4>
                              </div>
                              <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                                 {order.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between gap-8 bg-white px-8 py-6 rounded-full border border-primary/5 hover:border-accent/20 transition-all group/item shadow-soft">
                                       <div className="flex items-center gap-6 truncate">
                                          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-[11px] font-black text-primary shadow-inner">{item.quantity}</div>
                                          <p className="text-sm font-serif font-black italic text-primary truncate group-hover/item:text-accent transition-colors">{item.name}</p>
                                       </div>
                                       <p className="text-lg font-black italic text-primary tracking-tighter shrink-0">₹{item.price * item.quantity}</p>
                                    </div>
                                 ))}
                              </div>
                              <div className="mt-12 flex justify-between items-center px-10">
                                 <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/10">EXCHANGE VALUE</p>
                                 <p className="text-4xl font-serif font-black italic text-primary tracking-tighter">₹{order.subtotal}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         )}
      </div>
    </AdminLayout>
  )
}

export default AdminOrders
