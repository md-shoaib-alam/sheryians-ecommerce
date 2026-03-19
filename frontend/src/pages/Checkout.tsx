import { useState, useEffect, useCallback } from 'react'
import { useAuth, useUser } from "@clerk/react"
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { api } from '../lib/api'
import {
  MapPin, Plus, CreditCard, ShieldCheck, ArrowLeft,
  Loader2, CheckCircle2, AlertCircle
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────
interface Address {
  id: string
  label: string
  firstName: string
  lastName: string
  line1: string
  line2: string | null
  city: string
  state: string
  zip: string
  country: string
  phone: string
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
  <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border
    ${type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
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

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [successOrderId, setSuccessOrderId] = useState('')

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({ 
    label: '', 
    firstName: '', 
    lastName: '', 
    line1: '', 
    line2: '', 
    city: '', 
    state: '', 
    zip: '', 
    country: 'India', 
    phone: '' 
  })
  const [savingAddress, setSavingAddress] = useState(false)

  const showBanner = (type: 'success' | 'error', msg: string) => {
    setBanner({ type, msg })
    setTimeout(() => setBanner(null), 5000)
  }

  // Redirect if cart empty or not signed in
  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) navigate('/cart')
  }, [cart, navigate, orderSuccess])

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
    if (!addressForm.label || !addressForm.firstName || !addressForm.lastName || !addressForm.line1 || !addressForm.city || !addressForm.state || !addressForm.zip || !addressForm.phone || !addressForm.country) {
      showBanner('error', 'Please fill all required address fields.')
      return
    }
    setSavingAddress(true)
    try {
      const token = await getToken()
      const newAddr = await api('/api/users/addresses', { method: 'POST', token, body: addressForm })
      setAddressForm({ label: '', firstName: '', lastName: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'India', phone: '' })
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
  const subtotal = getCartTotal()
  const shipping = subtotal >= 499 ? 0 : 49
  const total = subtotal + shipping

  // Build order items from cart
  const buildItems = () => cart.map(item => ({
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
              clearCart()
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
        theme: { color: '#5D1A1E' },
        modal: {
          ondismiss: async () => {
            setProcessing(false)
            showBanner('error', 'Payment cancelled. Your order has been cancelled.')
            // Background call: mark order as CANCELLED in DB
            try {
              const token = await getToken()
              await api('/api/payment/cancel', {
                method: 'POST',
                token,
                body: { orderId: data.orderId },
              })
            } catch {}
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
        clearCart()
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
      <div className="min-h-screen flex text-center flex-col items-center justify-center px-4 md:px-6 bg-[#fdfaf9]">
        <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-[40px] md:rounded-[50px] shadow-xl shadow-brand-red/[0.05] border border-gray-50 flex flex-col items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 md:mb-8">
                <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-green-500" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-brand-dark mb-3 md:mb-4">You're All Set!</h1>
            <p className="text-gray-500 font-medium text-xs md:text-sm mb-8 md:mb-10 leading-relaxed px-2">
                Your order <span className="text-brand-red font-black">#{successOrderId.slice(0, 8).toUpperCase()}</span> has been placed. 
                We're already getting things ready for you, buddy!
            </p>
            <div className="flex flex-col w-full gap-3 md:gap-4">
              <Link 
                to="/profile" 
                className="w-full bg-brand-dark text-white py-4 md:py-5 rounded-2xl md:rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-red transition-all shadow-lg shadow-brand-dark/10"
              >
                Track Your Box
              </Link>
              <Link 
                to="/products" 
                className="w-full bg-[#FAF6F6] text-brand-dark border border-gray-100 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all"
              >
                Continue Shopping
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
        <Loader2 className="w-8 h-8 text-brand-red/30 animate-spin" />
      </div>
    )
  }

  // ─── Main Checkout ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20 px-4 md:px-8 bg-[#FAF6F6]/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Link to="/cart" className="p-2 border border-brand-red/10 rounded-md hover:bg-white bg-[#FAF6F6] transition-all">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-brand-dark" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">Checkout</h1>
        </div>

        {banner && <div className="mb-6"><Banner type={banner.type} msg={banner.msg} /></div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* ─── Left Column ─────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">
            {/* ── Delivery Address Section ──────────────────────────── */}
            <section className="bg-white border border-brand-red/10 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-red" />
                Delivery Address
              </h2>

              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {addresses.map(addr => (
                    <button
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`text-left p-4 rounded-lg border transition-all ${selectedAddress === addr.id ? 'border-brand-red bg-brand-red/5 shadow-sm' : 'border-gray-200 hover:border-brand-red/30'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-brand-dark">{addr.label}</span>
                        {addr.isDefault && <span className="bg-brand-red text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Default</span>}
                      </div>
                      <p className="text-brand-dark font-bold text-xs uppercase mb-1">{addr.firstName} {addr.lastName}</p>
                      <p className="text-brand-dark/70 text-sm mb-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                      <p className="text-brand-dark/70 text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                      <p className="text-brand-dark/70 text-[10px] mt-1 font-bold">Phone: {addr.phone}</p>
                    </button>
                  ))}
                </div>
              ) : null}

              {showAddressForm ? (
                <div className="border border-brand-red/10 bg-[#FAF6F6] rounded-lg p-5 mt-4">
                  <h3 className="font-semibold text-brand-dark mb-4">Add New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input placeholder="Label (Home, Work..)" value={addressForm.label} onChange={e => setAddressForm(f => ({ ...f, label: e.target.value }))} className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-md outline-none focus:border-brand-red md:col-span-2" />
                    <input placeholder="First Name *" value={addressForm.firstName} onChange={e => setAddressForm(f => ({ ...f, firstName: e.target.value }))} className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-md outline-none focus:border-brand-red" />
                    <input placeholder="Last Name *" value={addressForm.lastName} onChange={e => setAddressForm(f => ({ ...f, lastName: e.target.value }))} className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-md outline-none focus:border-brand-red" />
                    <input placeholder="Address Line 1 *" value={addressForm.line1} onChange={e => setAddressForm(f => ({ ...f, line1: e.target.value }))} className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-md outline-none focus:border-brand-red md:col-span-2" />
                    <input placeholder="Address Line 2 (Optional)" value={addressForm.line2} onChange={e => setAddressForm(f => ({ ...f, line2: e.target.value }))} className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-md outline-none focus:border-brand-red md:col-span-2" />
                    <input placeholder="City *" value={addressForm.city} onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))} className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-md outline-none focus:border-brand-red" />
                    <input placeholder="State *" value={addressForm.state} onChange={e => setAddressForm(f => ({ ...f, state: e.target.value }))} className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-md outline-none focus:border-brand-red" />
                    <input placeholder="Postal Code *" value={addressForm.zip} onChange={e => setAddressForm(f => ({ ...f, zip: e.target.value }))} className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-md outline-none focus:border-brand-red" />
                    <div className="space-y-1">
                      <select value={addressForm.country} onChange={e => setAddressForm(f => ({ ...f, country: e.target.value }))} className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-md outline-none focus:border-brand-red text-sm">
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>
                    <input placeholder="Phone *" value={addressForm.phone} onChange={e => setAddressForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-md outline-none focus:border-brand-red" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleSaveAddress} disabled={savingAddress} className="bg-brand-red text-white py-2 px-6 rounded-md font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50">{savingAddress ? 'Saving...' : 'Save Address'}</button>
                    <button onClick={() => setShowAddressForm(false)} className="border border-gray-200 text-brand-dark bg-white py-2 px-6 rounded-md text-sm hover:bg-gray-50 transition-all">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-2 text-brand-red font-semibold py-2">
                  <Plus className="w-4 h-4" /> Add New Address
                </button>
              )}
            </section>

            {/* ── Payment Method Section ────────────────────────────── */}
            <section className="bg-white border border-brand-red/10 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-red" />
                Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setPaymentMethod('RAZORPAY')} className={`flex flex-col gap-2 p-5 rounded-lg border transition-all ${paymentMethod === 'RAZORPAY' ? 'border-brand-red bg-brand-red/5' : 'border-gray-200 hover:border-brand-red/30'}`}>
                  <div className="flex items-center gap-3 font-semibold text-brand-dark">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'RAZORPAY' ? 'border-brand-red' : 'border-gray-300'}`}>
                      {paymentMethod === 'RAZORPAY' && <div className="w-2 h-2 rounded-full bg-brand-red" />}
                    </div>
                    Pay Online
                  </div>
                  <p className="text-brand-dark/60 text-sm ml-7 text-left">UPI, Cards, Net Banking, Wallets</p>
                </button>

                <button onClick={() => setPaymentMethod('COD')} className={`flex flex-col gap-2 p-5 rounded-lg border transition-all ${paymentMethod === 'COD' ? 'border-brand-red bg-brand-red/5' : 'border-gray-200 hover:border-brand-red/30'}`}>
                  <div className="flex items-center gap-3 font-semibold text-brand-dark">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'COD' ? 'border-brand-red' : 'border-gray-300'}`}>
                      {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-brand-red" />}
                    </div>
                    Cash on Delivery
                  </div>
                  <p className="text-brand-dark/60 text-sm ml-7 text-left">Pay when your order arrives</p>
                </button>
              </div>
            </section>
          </div>

          {/* ─── Right Column: Order Summary ─────────────────────── */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-white border border-brand-red/10 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-brand-dark mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-[#FAF6F6] rounded-md overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-dark text-sm truncate">{item.name}</p>
                      <p className="text-brand-dark/60 text-sm">Qty: {item.quantity}</p>
                      <p className="font-bold text-brand-dark text-sm mt-1">₹{Number(item.currentPrice) * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100 mb-6 text-sm">
                <div className="flex justify-between text-brand-dark/80">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-brand-dark/80">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-medium'}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && <p className="text-brand-dark/50 text-xs">Add ₹{499 - subtotal} more for free shipping</p>}
              </div>

              <div className="flex items-center justify-between mb-8 border-t border-gray-100 pt-6">
                <span className="font-bold text-brand-dark text-lg">Total</span>
                <span className="text-2xl font-bold text-brand-red">₹{total}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing || !selectedAddress}
                className={`w-full py-3.5 rounded-md font-bold text-[15px] transition-all flex items-center justify-center gap-2 shadow-sm
                  ${processing || !selectedAddress ? 'bg-brand-red/50 text-white cursor-not-allowed' : 'bg-brand-red text-white hover:bg-[#4a1518]'}`}
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {processing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
