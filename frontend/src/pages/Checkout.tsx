import { useState, useEffect, useCallback } from 'react'
import { useAuth, useUser } from "@clerk/react"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { api } from '../lib/api'
import {
  MapPin, Plus, CreditCard, Banknote, ShieldCheck, ArrowLeft,
  Loader2, CheckCircle2, AlertCircle, Truck, Package, Lock
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────
interface Address {
  id: string
  label: string
  line1: string
  line2: string | null
  city: string
  state: string
  zip: string
  isDefault: boolean
}

// ─── Load Razorpay Script ──────────────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// ─── Banner Component ──────────────────────────────────────────────────────
const Banner = ({ type, msg }: { type: 'success' | 'error'; msg: string }) => (
  <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest font-syne border
    ${type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
    {msg}
  </div>
)

// ─── Checkout Page ─────────────────────────────────────────────────────────
const Checkout = () => {
  const { isSignedIn } = useUser()
  const { getToken } = useAuth()
  const { cart, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // Determine what we're checking out: the full cart or a direct buy single item
  const directBuyItem = location.state?.directBuyItem
  const isDirectBuy = !!directBuyItem
  const checkoutItems = isDirectBuy ? [directBuyItem] : cart

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [successOrderId, setSuccessOrderId] = useState('')
  const [orderCancelled, setOrderCancelled] = useState(false)
  const [cancelledOrderId, setCancelledOrderId] = useState('')
  const [cancelledOrder, setCancelledOrder] = useState<any>(null)

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({ label: '', line1: '', line2: '', city: '', state: '', zip: '' })
  const [savingAddress, setSavingAddress] = useState(false)

  const showBanner = (type: 'success' | 'error', msg: string) => {
    setBanner({ type, msg })
    setTimeout(() => setBanner(null), 5000)
  }

  // Redirect if cart empty or not signed in
  useEffect(() => {
    if (checkoutItems.length === 0 && !orderSuccess && !orderCancelled) navigate('/cart')
  }, [checkoutItems, navigate, orderSuccess, orderCancelled])

  useEffect(() => {
    if (!isSignedIn) navigate('/sign-in')
  }, [isSignedIn, navigate])

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    try {
      const token = await getToken()
      const data = await api('/api/users/addresses', { token })
      setAddresses(data || [])
      // Auto-select default or first
      const defaultAddr = data?.find((a: Address) => a.isDefault)
      if (defaultAddr) setSelectedAddress(defaultAddr.id)
      else if (data?.length > 0) setSelectedAddress(data[0].id)
    } catch {
      // user may not exist in DB yet
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchAddresses() }, [fetchAddresses])

  // Save new address
  const handleSaveAddress = async () => {
    if (!addressForm.label || !addressForm.line1 || !addressForm.city || !addressForm.state || !addressForm.zip) {
      showBanner('error', 'Please fill all required address fields.')
      return
    }
    setSavingAddress(true)
    try {
      const token = await getToken()
      const newAddr = await api('/api/users/addresses', { method: 'POST', token, body: addressForm })
      setAddressForm({ label: '', line1: '', line2: '', city: '', state: '', zip: '' })
      setShowAddressForm(false)
      await fetchAddresses()
      if (newAddr?.id) setSelectedAddress(newAddr.id)
    } catch (err: any) {
      showBanner('error', err.message || 'Failed to save address.')
    } finally {
      setSavingAddress(false)
    }
  }

  // Calculate totals
  const subtotal = isDirectBuy 
    ? parseFloat(directBuyItem.currentPrice) * (directBuyItem.quantity || 1)
    : getCartTotal()
  const shipping = subtotal >= 499 ? 0 : 49
  const total = subtotal + shipping

  // Build order items from either the direct buy item or the cart
  const buildItems = () => checkoutItems.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
  }))

  // ─── Razorpay Payment ───────────────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    setProcessing(true)
    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        showBanner('error', 'Failed to load Razorpay. Please check your connection.')
        setProcessing(false)
        return
      }

      const token = await getToken()

      // 1. Create Razorpay order on backend
      const data = await api('/api/payment/create-order', {
        method: 'POST',
        token,
        body: {
          items: buildItems(),
          addressId: selectedAddress,
        },
      })

      // 2. Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Shriyans Makhana',
        description: 'Premium Makhana Order',
        order_id: data.razorpayOrderId,
        handler: async (response: any) => {
          // RAZORPAY HANDLER ONLY CALLED ON SUCCESS!
          if (!response.razorpay_payment_id || !response.razorpay_order_id) {
            console.error('❌ Razorpay success called without payment/order id:', response)
            showBanner('error', 'Payment data missing from Razorpay.')
            setProcessing(false)
            return
          }

          console.log('✅ Razorpay local success, verifying with backend...')

          // 3. Verify payment on backend
          try {
            const verifyData = await api('/api/payment/verify', {
              method: 'POST',
              token,
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              },
            })

            if (verifyData.success) {
              console.log('✅ Payment verified! Confirming order.')
              setSuccessOrderId(verifyData.order.id)
              setOrderSuccess(true)
              if (!isDirectBuy) clearCart()
            } else {
              console.error('❌ Backend verification returned success:false')
              showBanner('error', 'Critical: Payment could not be verified by our servers.')
            }
          } catch (err: any) {
            console.error('❌ Payment verification error:', err)
            showBanner('error', err.message || 'Payment verification failed. Please contact support.')
          }
          setProcessing(false)
        },
        prefill: {},
        theme: { color: '#dc2626' },
        modal: {
          ondismiss: async () => {
            setProcessing(false)
            setOrderCancelled(true)
            setCancelledOrderId(data.orderId)
            
            // Background call: mark order as CANCELLED in DB
            try {
              const token = await getToken()
              // 1. Cancel the order
              await api('/api/payment/cancel', {
                method: 'POST',
                token,
                body: { orderId: data.orderId },
              })
              
              // 2. Fetch it to show items (optional but nice)
              const orderData = await api(`/api/orders/${data.orderId}`, { token })
              setCancelledOrder(orderData)
              
              // 3. Clear cart ONLY after we've marked order as cancelled (if it was a cart checkout)
              if (!isDirectBuy) clearCart()
            } catch (err) {
              console.error('Error during cancellation cleanup:', err)
              if (!isDirectBuy) clearCart() // still clear it as a safety measure for cart-based sessions
            }
          },
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err: any) {
      showBanner('error', err.message || 'Failed to initiate payment.')
      setProcessing(false)
    }
  }

  // ─── COD Payment ────────────────────────────────────────────────────────
  const handleCODPayment = async () => {
    console.log('📦 Starting COD payment flow...')
    setProcessing(true)
    try {
      const token = await getToken()
      const data = await api('/api/payment/cod', {
        method: 'POST',
        token,
        body: {
          items: buildItems(),
          addressId: selectedAddress,
        },
      })

      if (data.success) {
        console.log('✅ COD Order successful')
        setSuccessOrderId(data.order.id)
        setOrderSuccess(true)
        if (!isDirectBuy) clearCart()
      }
    } catch (err: any) {
      console.error('❌ COD payment error:', err)
      showBanner('error', err.message || 'Failed to place order.')
    } finally {
      setProcessing(false)
    }
  }

  // ─── Place Order Handler ────────────────────────────────────────────────
  const handlePlaceOrder = () => {
    console.log('🚀 User clicked Place Order. Method:', paymentMethod)
    if (!selectedAddress) {
      showBanner('error', 'Please select a delivery address.')
      return
    }
    if (paymentMethod === 'RAZORPAY') handleRazorpayPayment()
    else handleCODPayment()
  }

  // ─── Order Success View ─────────────────────────────────────────────────
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          {/* Animated checkmark */}
          <div className="relative mx-auto w-28 h-28 mb-8">
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
            <div className="relative w-28 h-28 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-14 h-14 text-green-400" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold uppercase italic font-syne mb-4 tracking-tighter text-white">
            Order Placed!
          </h1>
          <p className="text-white/50 font-poppins text-sm mb-2">
            {paymentMethod === 'RAZORPAY' ? 'Payment Successful' : 'Cash on Delivery'}
          </p>
          <p className="text-white/30 font-poppins text-xs tracking-widest uppercase mb-10">
            Order #{successOrderId.slice(0, 8)}
          </p>

          <div className="flex flex-col gap-3">
            <Link
              to="/profile"
              className="w-full bg-white text-red-950 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-amber-400 transition-all shadow-2xl font-syne hover:scale-[1.02] active:scale-95 duration-300 block"
            >
              View Orders
            </Link>
            <Link
              to="/products"
              className="w-full py-4 rounded-full border border-white/20 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all font-syne text-white/40 hover:text-white block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }  // ─── Order Cancelled View ───────────────────────────────────────────────
  if (orderCancelled) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center">
          <div className="relative mx-auto w-28 h-28 mb-8">
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
            <div className="relative w-28 h-28 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
              <AlertCircle className="w-14 h-14 text-red-400" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold uppercase italic font-syne mb-2 tracking-tighter text-white">
            Order Cancelled
          </h1>
          <p className="text-white/50 font-poppins text-sm mb-6 uppercase tracking-widest font-bold">
            Payment Interrupted
          </p>

          {/* List items if we fetched them */}
          {cancelledOrder && (
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 mb-10 text-left">
              <p className="text-[9px] font-black uppercase text-white/30 tracking-[0.2em] mb-4">Items Not Processed</p>
              <div className="space-y-3">
                {cancelledOrder.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="text-white/60 font-syne font-bold uppercase truncate pr-4">{item.name} × {item.quantity}</span>
                    <span className="text-white font-poppins font-bold shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-white tracking-widest font-syne">Total Value</span>
                <span className="text-lg font-black text-amber-400 font-poppins">₹{cancelledOrder.total}</span>
              </div>
            </div>
          )}

          {cancelledOrderId && (
            <p className="text-white/20 font-poppins text-[9px] tracking-[0.3em] uppercase mb-10">
              Ref: {cancelledOrderId.slice(0, 10).toUpperCase()}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <Link
              to="/products"
              className="w-full bg-white text-red-950 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-amber-400 transition-all shadow-2xl font-syne hover:scale-[1.02] active:scale-95 duration-300 block"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ─── Loading State ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
      </div>
    )
  }

  // ─── Main Checkout ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 blur-[200px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 blur-[150px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 md:mb-16">
          <Link
            to="/cart"
            className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-3xl md:text-6xl font-extrabold uppercase italic font-syne tracking-tighter">
            Checkout
          </h1>
        </div>

        {banner && <div className="mb-6"><Banner type={banner.type} msg={banner.msg} /></div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-start">
          {/* ─── Left Column ─────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {/* ── Delivery Address Section ──────────────────────────── */}
            <section className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-6 md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-amber-500/10 p-3 rounded-2xl">
                  <Truck className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black font-syne uppercase tracking-tighter text-white">Delivery Address</h2>
                  <p className="text-white/30 font-poppins text-[10px] tracking-widest uppercase">Where should we deliver your order?</p>
                </div>
              </div>

              {addresses.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {addresses.map(addr => (
                    <button
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`w-full text-left flex items-start gap-4 p-5 rounded-[24px] border transition-all duration-300 group
                        ${selectedAddress === addr.id
                          ? 'bg-white/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                          : 'bg-white/[0.02] border-white/10 hover:bg-white/5 hover:border-white/20'}`}
                    >
                      {/* Radio dot */}
                      <div className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all
                        ${selectedAddress === addr.id ? 'border-amber-400 bg-amber-400' : 'border-white/20'}`}>
                        {selectedAddress === addr.id && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-syne font-black uppercase text-xs tracking-tight">{addr.label}</span>
                          {addr.isDefault && <span className="bg-amber-500/10 text-amber-400 text-[7px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/20">Default</span>}
                        </div>
                        <p className="text-white/50 font-poppins text-xs">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                        <p className="text-white/50 font-poppins text-xs">{addr.city}, {addr.state} {addr.zip}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : !showAddressForm ? (
                <div className="text-center py-10 mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <MapPin className="w-7 h-7 text-white/20" />
                  </div>
                  <p className="text-white/30 font-syne font-bold text-xs uppercase tracking-widest">No saved addresses</p>
                </div>
              ) : null}

              {showAddressForm ? (
                <div className="border border-white/10 bg-white/[0.02] rounded-[28px] p-6 mt-4">
                  <h3 className="text-white font-black font-syne uppercase tracking-tighter text-sm mb-5">New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                    {[
                      { key: 'label', placeholder: 'Label (Home, Work..)', span: true },
                      { key: 'line1', placeholder: 'Address Line 1', span: true },
                      { key: 'line2', placeholder: 'Address Line 2 (optional)', span: true },
                      { key: 'city', placeholder: 'City' },
                      { key: 'state', placeholder: 'State' },
                      { key: 'zip', placeholder: 'Zip / Postal Code', span: false },
                    ].map(({ key, placeholder, span }) => (
                      <input
                        key={key}
                        placeholder={placeholder}
                        value={(addressForm as any)[key]}
                        onChange={e => setAddressForm(f => ({ ...f, [key]: e.target.value }))}
                        className={`bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/20 px-5 py-3 rounded-full outline-none font-syne font-bold text-sm transition-all ${span ? 'md:col-span-2' : ''}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveAddress}
                      disabled={savingAddress}
                      className="bg-white hover:bg-amber-400 text-black py-3 px-8 rounded-full font-black uppercase text-[10px] tracking-widest font-syne transition-all disabled:opacity-50"
                    >
                      {savingAddress ? 'Saving...' : 'Save Address'}
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white py-3 px-8 rounded-full font-black uppercase text-[10px] tracking-widest font-syne border border-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-3 justify-center bg-white/5 border border-dashed border-white/20 hover:border-white/40 hover:bg-white/10 text-white/50 hover:text-white py-3.5 px-6 rounded-full font-black uppercase text-[10px] tracking-widest font-syne transition-all w-full"
                >
                  <Plus className="w-4 h-4" />
                  Add New Address
                </button>
              )}
            </section>

            {/* ── Payment Method Section ────────────────────────────── */}
            <section className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-6 md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-green-500/10 p-3 rounded-2xl">
                  <Lock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black font-syne uppercase tracking-tighter text-white">Payment Method</h2>
                  <p className="text-white/30 font-poppins text-[10px] tracking-widest uppercase">Choose how you'd like to pay</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Razorpay */}
                <button
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`w-full text-left flex items-center gap-4 p-5 rounded-[24px] border transition-all duration-300
                    ${paymentMethod === 'RAZORPAY'
                      ? 'bg-white/10 border-green-500/40 shadow-lg shadow-green-500/5'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/5 hover:border-white/20'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                    ${paymentMethod === 'RAZORPAY' ? 'border-green-400 bg-green-400' : 'border-white/20'}`}>
                    {paymentMethod === 'RAZORPAY' && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-syne font-black uppercase text-xs tracking-tight">Pay Online</p>
                    <p className="text-white/30 font-poppins text-[10px] tracking-widest">UPI, Cards, Net Banking, Wallets</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400 text-[8px] font-black uppercase tracking-widest font-syne">Secure</span>
                  </div>
                </button>

                {/* COD */}
                <button
                  onClick={() => setPaymentMethod('COD')}
                  className={`w-full text-left flex items-center gap-4 p-5 rounded-[24px] border transition-all duration-300
                    ${paymentMethod === 'COD'
                      ? 'bg-white/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/5 hover:border-white/20'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                    ${paymentMethod === 'COD' ? 'border-amber-400 bg-amber-400' : 'border-white/20'}`}>
                    {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <Banknote className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-syne font-black uppercase text-xs tracking-tight">Cash on Delivery</p>
                    <p className="text-white/30 font-poppins text-[10px] tracking-widest">Pay when your order arrives</p>
                  </div>
                </button>
              </div>
            </section>
          </div>

          {/* ─── Right Column: Order Summary ─────────────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] md:rounded-[50px] p-8 md:p-10 shadow-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-black font-syne uppercase italic tracking-tighter text-white/40">Order Summary</h2>
              </div>

              {/* Cart items */}
              <div className="space-y-3 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {checkoutItems.map(item => (
                  <div key={item.id || item.productId} className="flex items-center gap-4 py-2">
                    <div className="w-12 h-14 bg-white/10 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover scale-150" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-syne font-bold text-xs uppercase tracking-tight truncate">{item.name}</p>
                      <p className="text-white/30 font-poppins text-[10px]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white font-poppins font-bold text-sm shrink-0">₹{parseInt(item.currentPrice) * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 border-t border-white/10 pt-6">
                <div className="flex justify-between text-white/50 font-bold uppercase text-[10px] tracking-[0.2em]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-white/50 font-bold uppercase text-[10px] tracking-[0.2em]">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-amber-400' : ''}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-amber-400/60 font-poppins text-[9px] tracking-wider">
                    Add ₹{499 - subtotal} more for free shipping
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mb-8 border-t border-white/10 pt-6">
                <span className="text-sm font-bold uppercase font-syne tracking-[0.3em] text-white">Total</span>
                <span className="text-3xl md:text-4xl font-black font-poppins text-white">₹{total}</span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={processing || !selectedAddress}
                className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-lg font-syne transition-all shadow-2xl
                  hover:scale-[1.02] active:scale-95 duration-300 flex items-center justify-center gap-3
                  ${processing || !selectedAddress
                    ? 'bg-white/20 text-white/40 cursor-not-allowed'
                    : paymentMethod === 'RAZORPAY'
                      ? 'bg-green-500 hover:bg-green-400 text-black'
                      : 'bg-white hover:bg-amber-400 text-red-950'}`}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : paymentMethod === 'RAZORPAY' ? (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay ₹{total}
                  </>
                ) : (
                  <>
                    <Banknote className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-green-400/60" />
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest font-syne">SSL Secure</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-green-400/60" />
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest font-syne">Encrypted</span>
                </div>
              </div>

              <p className="mt-4 text-[8px] uppercase tracking-[0.15em] font-bold text-white/15 font-poppins leading-loose text-center">
                Secure checkout powered by Razorpay. Your payment information is encrypted and never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
