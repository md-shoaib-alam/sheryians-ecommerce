import { useUser, useClerk, useAuth } from "@clerk/react"
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import {
  User, LogOut, Package, MapPin, Plus, Trash2, CheckCircle2, AlertCircle, ChevronRight, Loader2, Settings, Calendar
} from 'lucide-react'
import { api } from '../lib/api'

// Types
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

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  product: { name: string; imageUrl: string }
}

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  items: OrderItem[]
}

// Feedback Banner
const Banner = ({ type, msg }: { type: 'success' | 'error'; msg: string }) => (
  <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border mb-6
    ${type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
    {msg}
  </div>
)

// Personal Info Tab — updates Clerk + syncs to backend
const PersonalInfoTab = () => {
  const { user } = useUser()
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName]   = useState(user?.lastName  || '')
  const [email]                   = useState(user?.primaryEmailAddress?.emailAddress || '')
  const [phone, setPhone]         = useState('')
  const [gender, setGender]       = useState('Male')
  const [address, setAddress]     = useState('')
  const [city, setCity]           = useState('')
  const [pincode, setPincode]     = useState('')
  const [state, setState]         = useState('')
  
  const [saving, setSaving]       = useState(false)
  const [banner, setBanner]       = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const showBanner = (type: 'success' | 'error', msg: string) => {
    setBanner({ type, msg })
    setTimeout(() => setBanner(null), 4000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await user?.update({ firstName, lastName })
      showBanner('success', 'Profile updated successfully!')
    } catch (err: any) {
      showBanner('error', err.errors?.[0]?.message || err.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-[#FAF6F6] rounded-[40px] p-8 md:p-12 shadow-sm font-sans h-full">
      {banner && <Banner type={banner.type} msg={banner.msg} />}

      <h2 className="text-xl font-black text-brand-dark mb-8 uppercase tracking-tight">PERSONAL INFORMATION</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex flex-col gap-2">
          <label className="text-brand-dark/60 font-black uppercase text-xs tracking-widest">YOUR NAME</label>
          <input
            value={`${firstName} ${lastName}`}
            onChange={e => {
              const parts = e.target.value.split(' ')
              setFirstName(parts[0] || '')
              setLastName(parts.slice(1).join(' ') || '')
            }}
            className="bg-white border border-brand-dark/10 focus:border-brand-dark/30 text-brand-dark px-5 py-4 rounded-2xl outline-none font-medium text-sm transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-brand-dark/60 font-black uppercase text-xs tracking-widest">EMAIL</label>
          <input
            readOnly
            value={email}
            className="bg-brand-dark/5 border border-brand-dark/10 text-brand-dark/50 px-5 py-4 rounded-2xl outline-none font-medium text-sm cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-brand-dark/60 font-black uppercase text-xs tracking-widest">MOBILE NUMBER</label>
          <input
            type="tel"
            placeholder="e.g. 8080621478"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="bg-white border border-brand-dark/10 focus:border-brand-dark/30 text-brand-dark px-5 py-4 rounded-2xl outline-none font-medium text-sm transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-brand-dark/60 font-black uppercase text-xs tracking-widest">GENDER</label>
          <div className="flex items-center gap-6 px-2 py-4">
             <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={() => setGender('Male')} className="accent-brand-dark" />
                <span className="text-sm font-medium text-brand-dark">Male</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={() => setGender('Female')} className="accent-brand-dark" />
                <span className="text-sm font-medium text-brand-dark">Female</span>
             </label>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-brand-dark/60 font-black uppercase text-xs tracking-widest">ADDRESS</label>
          <input
            placeholder="Room No, Street, Locality"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="bg-white border border-brand-dark/10 focus:border-brand-dark/30 text-brand-dark px-5 py-4 rounded-2xl outline-none font-medium text-sm transition-all w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-brand-dark/60 font-black uppercase text-xs tracking-widest">CITY</label>
          <input
            placeholder="e.g. Boisar"
            value={city}
            onChange={e => setCity(e.target.value)}
            className="bg-white border border-brand-dark/10 focus:border-brand-dark/30 text-brand-dark px-5 py-4 rounded-2xl outline-none font-medium text-sm transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-brand-dark/60 font-black uppercase text-xs tracking-widest">PINCODE</label>
          <input
            placeholder="e.g. 401501"
            value={pincode}
            onChange={e => setPincode(e.target.value)}
            className="bg-white border border-brand-dark/10 focus:border-brand-dark/30 text-brand-dark px-5 py-4 rounded-2xl outline-none font-medium text-sm transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-brand-dark/60 font-black uppercase text-xs tracking-widest">STATE</label>
          <input
            placeholder="e.g. Maharashtra"
            value={state}
            onChange={e => setState(e.target.value)}
            className="bg-white border border-brand-dark/10 focus:border-brand-dark/30 text-brand-dark px-5 py-4 rounded-2xl outline-none font-medium text-sm transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-8 border-t border-brand-dark/10">
        <button
          onClick={() => {
             showBanner('success', 'Profile reset to original values.')
          }}
          className="bg-transparent hover:bg-black/5 text-brand-dark/60 hover:text-brand-dark border border-brand-dark/10 py-3.5 px-8 rounded-full font-bold uppercase text-xs tracking-widest transition-all"
        >
          RESET
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#4A1D20] hover:opacity-90 text-white py-3.5 px-10 rounded-full font-bold uppercase text-xs tracking-widest transition-all disabled:opacity-50"
        >
          {saving ? 'UPDATING...' : 'UPDATE'}
        </button>
      </div>
    </div>
  )
}

// Order History Tab — fetches from backend
const OrderHistoryTab = () => {
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken()
        const data = await api('/api/orders', { token })
        // Only show confirmed or completed orders, hide pending ones
        setOrders((data.orders || []).filter((o: Order) => o.status !== 'PENDING'))
      } catch {
        // user may not exist in DB yet
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [getToken])

  if (loading) {
    return (
      <div className="bg-brand-pink border border-brand-red/10 rounded-[40px] p-12 flex items-center justify-center shadow-sm">
        <Loader2 className="w-6 h-6 text-brand-red/30 animate-spin" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-[#FAF6F6] rounded-[40px] py-20 px-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-brand-red/5 flex items-center justify-center mb-6">
            <Package className="w-8 h-8 text-brand-dark/20" strokeWidth={1.5} />
          </div>
          <h3 className="text-brand-dark font-black text-2xl uppercase mb-4 tracking-tight pb-1">NO ORDERS YET</h3>
          <p className="text-brand-dark/40 font-medium text-[10px] tracking-[0.2em] uppercase mb-10">
            Your order history will appear here once you make a purchase.
          </p>
          <a href="/products" className="bg-[#4A1D20] text-white hover:opacity-90 py-3.5 px-10 rounded-full font-bold uppercase text-xs tracking-widest transition-all">
            START SHOPPING
          </a>
        </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-50 text-green-600 border-green-100'
      case 'SHIPPED': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100'
      case 'PROCESSING': return 'bg-amber-50 text-amber-600 border-amber-100'
      default: return 'bg-gray-50 text-gray-500 border-gray-100'
    }
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order.id} 
          onClick={() => navigate(`/profile/order/${order.id}`)}
          className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FAF6F6] rounded-xl flex items-center justify-center shrink-0 border border-gray-50 group-hover:border-brand-red/20 transition-colors">
                <Package className="w-5 h-5 text-brand-dark/30 group-hover:text-brand-red transition-colors" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-brand-dark font-black uppercase tracking-tight text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</h4>
                  <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${getStatusColor(order.status)} tracking-widest`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-400 font-medium text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-2.5 h-2.5" />
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-gray-50">
              <div className="text-right">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0">Total Amount</p>
                <p className="text-brand-red font-black text-lg italic tracking-tighter">₹{order.total}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all">
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-2 bg-[#FAF6F6] text-brand-dark/70 text-[9px] font-bold px-4 py-2 rounded-xl border border-gray-50/50">
                <div className="w-4 h-4 rounded-md bg-white border border-gray-100 overflow-hidden">
                   <img src={item.product?.imageUrl} className="w-full h-full object-cover" />
                </div>
                {item.product?.name || item.name}
                <span className="opacity-40 ml-1">× {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Saved Addresses Tab — fetches from backend API
const SavedAddressesTab = () => {
  const { getToken } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ 
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
  const [saving, setSaving] = useState(false)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const showBannerMsg = (type: 'success' | 'error', msg: string) => {
    setBanner({ type, msg })
    setTimeout(() => setBanner(null), 4000)
  }

  const fetchAddresses = useCallback(async () => {
    try {
      const token = await getToken()
      const data = await api('/api/users/addresses', { token })
      setAddresses(data)
    } catch {
      // user may not exist in DB yet
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchAddresses() }, [fetchAddresses])

  const handleAdd = async () => {
    if (!form.label || !form.firstName || !form.lastName || !form.line1 || !form.city || !form.state || !form.zip || !form.phone) {
      showBannerMsg('error', 'Please fill all required fields.')
      return
    }
    setSaving(true)
    try {
      const token = await getToken()
      await api('/api/users/addresses', { method: 'POST', token, body: form })
      setForm({ label: '', firstName: '', lastName: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'India', phone: '' })
      setShowForm(false)
      showBannerMsg('success', 'Address saved!')
      fetchAddresses()
    } catch (err: any) {
      showBannerMsg('error', err.message || 'Failed to save address.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken()
      await api(`/api/users/addresses/${id}`, { method: 'DELETE', token })
      setAddresses(prev => prev.filter(a => a.id !== id))
    } catch {
      showBannerMsg('error', 'Failed to delete address.')
    }
  }

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {banner && <Banner type={banner.type} msg={banner.msg} />}

      {addresses.length === 0 && !showForm && (
        <div className="bg-[#FAF6F6] rounded-[40px] py-20 px-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-brand-red/5 flex items-center justify-center mb-6">
            <MapPin className="w-8 h-8 text-brand-dark/20" strokeWidth={1.5} />
          </div>
          <h3 className="text-brand-dark font-black text-2xl uppercase mb-4 tracking-tight pb-1">NO SAVED ADDRESSES</h3>
          <p className="text-brand-dark/40 font-medium text-[10px] tracking-[0.2em] uppercase">
            Add a delivery address for faster checkout.
          </p>
        </div>
      )}

      {addresses.map(addr => (
        <div key={addr.id} className="bg-brand-pink/50 border border-brand-red/10 rounded-[32px] p-6 flex items-start justify-between group hover:bg-brand-pink transition-all shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-brand-red/5 rounded-2xl flex items-center justify-center shrink-0 mt-1">
              <MapPin className="w-4 h-4 text-brand-red" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-brand-dark font-black uppercase text-sm tracking-tight">{addr.label}</p>
                {addr.isDefault && <span className="bg-brand-red/10 text-brand-red text-[7px] font-black uppercase px-2 py-0.5 rounded-full border border-brand-red/20">Default</span>}
              </div>
              <p className="text-brand-dark font-bold text-xs uppercase mb-1">{addr.firstName} {addr.lastName}</p>
              <p className="text-brand-dark/50 text-xs">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
              <p className="text-brand-dark/50 text-xs">{addr.city}, {addr.state} {addr.zip}</p>
              <p className="text-brand-dark/50 text-[10px] mt-1 font-bold">Phone: {addr.phone}</p>
            </div>
          </div>
          <button onClick={() => handleDelete(addr.id)} className="text-brand-red/30 hover:text-brand-red transition-colors p-2">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {showForm ? (
        <div className="bg-brand-pink border border-brand-red/10 rounded-[40px] p-8 shadow-sm">
          <h3 className="text-brand-dark font-black uppercase tracking-tighter text-lg mb-6">New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { key: 'label', placeholder: 'Label (Home, Work..)', span: true },
              { key: 'firstName', placeholder: 'First Name *' },
              { key: 'lastName', placeholder: 'Last Name *' },
              { key: 'line1', placeholder: 'Address Line 1 *', span: true },
              { key: 'line2', placeholder: 'Address Line 2 (Optional)', span: true },
              { key: 'city',  placeholder: 'City *' },
              { key: 'state', placeholder: 'State *' },
              { key: 'zip',   placeholder: 'Zip / Postal Code *' },
              { key: 'phone', placeholder: 'Phone Number *' },
            ].map(({ key, placeholder, span }) => (
              <input
                key={key}
                placeholder={placeholder}
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className={`bg-white border border-brand-red/10 focus:border-brand-red/40 text-brand-dark placeholder:text-brand-dark/20 px-5 py-3 rounded-full outline-none font-bold text-sm transition-all ${span ? 'md:col-span-2' : ''}`}
              />
            ))}
            <select 
              value={form.country} 
              onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
              className="md:col-span-2 bg-white border border-brand-red/10 focus:border-brand-red/40 text-brand-dark px-5 py-3 rounded-full outline-none font-bold text-sm"
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={saving} className="bg-brand-red hover:bg-brand-dark text-white py-3 px-8 rounded-full font-black uppercase text-[10px] tracking-widest font-syne transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Address'}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-white border border-brand-red/10 text-brand-dark/60 hover:text-brand-dark py-3 px-8 rounded-full font-black uppercase text-[10px] tracking-widest font-syne transition-all">Cancel</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mt-2 bg-transparent border border-dashed border-brand-dark/20 text-brand-dark/60 hover:text-brand-dark hover:border-brand-dark/40 hover:bg-brand-dark/5 py-4 rounded-full font-bold uppercase text-[11px] tracking-widest transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          ADD NEW ADDRESS
        </button>
      )}
    </div>
  )
}

// Account Settings Tab
const AccountSettingsTab = ({ onSignOut }: { onSignOut: () => void }) => {
  const { user } = useUser()
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const handleDeletePhoto = async () => {
    try {
      await user?.setProfileImage({ file: null })
      setBanner({ type: 'success', msg: 'Profile photo removed.' })
      setTimeout(() => setBanner(null), 3000)
    } catch (err: any) {
      setBanner({ type: 'error', msg: err.errors?.[0]?.message || 'Failed to remove photo.' })
      setTimeout(() => setBanner(null), 4000)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {banner && <Banner type={banner.type} msg={banner.msg} />}

      <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm font-sans">
        <h3 className="text-brand-dark font-bold uppercase tracking-tight text-xl mb-10">ACCOUNT SETTINGS</h3>

        <div className="space-y-8">
          <div className="flex items-center justify-between pb-6 border-b border-gray-50">
            <div>
              <p className="text-brand-dark font-bold uppercase text-xs tracking-widest mb-1">PROFILE PHOTO</p>
              <p className="text-gray-400 text-sm">Update or remove your profile image</p>
            </div>
            <button onClick={handleDeletePhoto} className="text-brand-red font-bold uppercase text-[10px] tracking-widest border border-brand-red/10 px-6 py-2.5 rounded-full hover:bg-brand-red/5 transition-all">
              REMOVE PHOTO
            </button>
          </div>

          <div className="flex items-center justify-between pb-6 border-b border-gray-50">
            <div>
              <p className="text-brand-dark font-bold uppercase text-xs tracking-widest mb-1">ACCOUNT ID</p>
              <p className="text-gray-400 text-sm font-mono">{user?.id}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-dark font-bold uppercase text-xs tracking-widest mb-1">MEMBER SINCE</p>
              <p className="text-gray-400 text-sm">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onSignOut}
        className="mt-6 flex items-center justify-center gap-3 bg-[#FAF6F6] hover:bg-red-50 text-brand-red border border-brand-red/10 py-4 px-10 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all w-full shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        SIGN OUT
      </button>
    </div>
  )
}

// Main Profile Page
type Tab = 'personal' | 'orders' | 'addresses' | 'settings'

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'personal',   label: 'My Profile',   icon: User    },
  { id: 'orders',     label: 'My Orders',    icon: Package },
  { id: 'addresses',  label: 'Addresses',    icon: MapPin  },
  { id: 'settings',   label: 'Settings',     icon: Settings},
]

const UserProfilePage = () => {
  const { isLoaded, user: clerkUser } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('personal')

  if (!isLoaded || !clerkUser) return null

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-[#f8f9fa] font-sans">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          {/* User Header */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm text-center">
             <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                <img src={clerkUser.imageUrl} alt="User" className="w-full h-full object-cover" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gray-900 truncate px-2">{clerkUser.fullName || 'User'}</h2>
                <p className="text-sm text-gray-500 mt-1">{clerkUser.primaryEmailAddress?.emailAddress}</p>
             </div>
          </div>

          {/* Menu */}
          <nav className="bg-white border border-gray-100 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
             <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible scrollbar-hide">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 transition-all text-[11px] md:text-sm border-r lg:border-r-0 lg:border-b border-gray-50 last:border-0 whitespace-nowrap
                      ${activeTab === id ? 'text-brand-red font-bold bg-[#FAF6F6]' : 'text-gray-500 hover:bg-gray-50 hover:text-brand-dark'}`}
                  >
                    <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 ${activeTab === id ? 'text-brand-red' : 'text-gray-300'}`} />
                    <span className="flex-1 text-left">{label}</span>
                    {activeTab === id && <div className="hidden lg:block w-1.5 h-1.5 rounded-full bg-brand-red" />}
                  </button>
                ))}
             </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          {activeTab === 'personal'  && <PersonalInfoTab />}
          {activeTab === 'orders'    && <OrderHistoryTab />}
          {activeTab === 'addresses' && <SavedAddressesTab />}
          {activeTab === 'settings'  && <AccountSettingsTab onSignOut={handleSignOut} />}
        </main>
      </div>
    </div>
  )
}

export default UserProfilePage
