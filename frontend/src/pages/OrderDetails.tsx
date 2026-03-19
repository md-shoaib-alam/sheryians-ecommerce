import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@clerk/react'
import { 
  Package, MapPin, CreditCard, Clock, ChevronLeft, 
  CheckCircle2, AlertCircle, Truck, Receipt, 
  Hash, Info, Loader2
} from 'lucide-react'

import { api } from '../lib/api'
import Invoice from '../components/Invoice'


interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  productId: string
  product: {
    name: string
    imageUrl: string
  }
}

interface Address {
  label: string
  line1: string
  line2: string | null
  city: string
  state: string
  zip: string
}

interface Order {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  paymentMethod: string
  total: number
  subtotal: number
  discount: number
  shippingCost: number
  notes: string | null
  createdAt: string
  updatedAt: string
  address: Address | null
  items: OrderItem[]
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return
      try {
        const token = await getToken()
        const data = await api(`/api/orders/${id}`, { token })
        setOrder(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [id, getToken])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'CANCELLED': return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'SHIPPED': return <Truck className="w-5 h-5 text-blue-400" />
      case 'PROCESSING': return <Clock className="w-5 h-5 text-amber-400" />
      default: return <Info className="w-5 h-5 text-white/50" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'CANCELLED': return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'SHIPPED': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'PROCESSING': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      default: return 'text-white/60 bg-white/10 border-white/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[40px] max-w-md w-full backdrop-blur-3xl">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase font-syne mb-2">Order Not Found</h2>
          <p className="text-white/50 font-poppins text-sm mb-8">{error || "We couldn't find the order you're looking for."}</p>
          <button 
            onClick={() => navigate('/profile')} 
            className="w-full bg-white hover:bg-amber-400 text-black py-4 rounded-full font-black uppercase text-[10px] tracking-[0.3em] font-syne transition-all"
          >
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-transparent relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 blur-[200px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 blur-[150px] -z-10 rounded-full" />

      <div className="w-full max-w-5xl mx-auto">
        {/* Header Navigation */}
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group mb-8"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-syne font-black uppercase text-[10px] tracking-widest">Back to Profile</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Info Columns */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Status Card */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase font-syne">
                      Order #{order.id.slice(0, 8)}
                    </h1>
                    <p className="text-white/30 font-poppins text-[10px] tracking-widest uppercase mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 self-start md:self-center px-5 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="font-syne font-black uppercase text-[10px] tracking-widest">{order.status}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4">
                <h3 className="text-white font-black font-syne uppercase tracking-widest text-[10px] opacity-40 mb-2">Order Items</h3>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-[24px] bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/20 shrink-0">
                      <img 
                        src={item.product?.imageUrl || '/placeholder.png'} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.productId}`} className="text-white font-syne font-black uppercase text-sm tracking-tight hover:text-amber-400 transition-colors block truncate">
                        {item.name}
                      </Link>
                      <p className="text-white/30 font-poppins text-[10px] tracking-widest uppercase mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-black font-syne text-sm">₹{item.price * item.quantity}</p>
                      <p className="text-white/30 font-poppins text-[10px] tracking-widest uppercase">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/10 p-2.5 rounded-xl"><MapPin className="w-4 h-4 text-white" /></div>
                  <h3 className="text-white font-black font-syne uppercase tracking-tighter text-lg">Shipping</h3>
                </div>
                {order.address ? (
                  <div className="space-y-2">
                    <p className="text-white font-syne font-black uppercase text-xs tracking-widest">{order.address.label}</p>
                    <p className="text-white/50 font-poppins text-xs leading-relaxed">
                      {order.address.line1}<br />
                      {order.address.line2 && <>{order.address.line2}<br /></>}
                      {order.address.city}, {order.address.state}<br />
                      {order.address.zip}
                    </p>
                  </div>
                ) : (
                  <p className="text-white/30 font-poppins text-xs italic">Shipping details not available</p>
                )}
              </div>

              {/* Payment Info */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/10 p-2.5 rounded-xl"><CreditCard className="w-4 h-4 text-white" /></div>
                  <h3 className="text-white font-black font-syne uppercase tracking-tighter text-lg">Payment</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-white font-syne font-black uppercase text-[8px] tracking-[0.2em] mb-1 opacity-40">Method</p>
                    <p className="text-white font-syne font-bold text-sm">{order.paymentMethod === 'ONLINE' ? 'Razorpay (Online)' : order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-white font-syne font-black uppercase text-[8px] tracking-[0.2em] mb-1 opacity-40">Status</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-green-400' : 'bg-amber-400'}`} />
                      <p className="text-white font-syne font-bold text-sm tracking-tight uppercase">{order.paymentStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info - Computation */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Price Summary */}
            <div className="bg-white font-syne rounded-[40px] p-8 text-black shadow-2xl shadow-white/5">
              <div className="flex items-center gap-3 mb-8">
                <Receipt className="w-5 h-5" />
                <h3 className="font-black uppercase tracking-tighter text-xl italic">Summary</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase text-[10px] tracking-widest opacity-60">Subtotal</span>
                  <span className="font-black">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span className="font-bold uppercase text-[10px] tracking-widest">Discount</span>
                  <span className="font-black">- ₹{order.discount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase text-[10px] tracking-widest opacity-60">Shipping</span>
                  <span className="font-black">{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
                </div>
                <div className="pt-4 border-t border-black/10 flex justify-between items-center">
                  <span className="font-black uppercase text-xs tracking-tighter italic">Total Amount</span>
                  <span className="text-2xl font-black italic tracking-tighter">₹{order.total}</span>
                </div>
              </div>

              {order.status === 'PENDING' && (
                <div className="bg-black/5 p-4 rounded-3xl mb-4 border border-black/5">
                  <p className="text-[9px] font-bold opacity-70 leading-relaxed uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3 h-3 text-amber-500" />
                    Payment is pending
                  </p>
                </div>
              )}

              <button 
                onClick={() => window.print()}
                className="w-full bg-black text-white hover:bg-black/80 py-4 px-6 rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-3"
              >
                <Hash className="w-3 h-3" />
                Generate Invoice PDF
              </button>
            </div>

            {/* Support Box */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-8">
              <h4 className="text-white font-black font-syne uppercase tracking-tighter text-sm mb-4">Need help?</h4>
              <p className="text-white/40 font-poppins text-[10px] leading-relaxed mb-6">If you have any issues with your order, please contact our support team with your order ID.</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:support@makhana.com" className="bg-white/5 border border-white/5 hover:border-white/20 text-white/70 hover:text-white p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center">
                  Email Support
                </a>
                <a href="/contact" className="bg-white/5 border border-white/5 hover:border-white/20 text-white/70 hover:text-white p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center">
                  Contact Form
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Printable Invoice Section */}
      <div className="hidden print-section bg-white text-black p-0">
        <Invoice order={order} />
      </div>

    </div>
  )
}


export default OrderDetails
