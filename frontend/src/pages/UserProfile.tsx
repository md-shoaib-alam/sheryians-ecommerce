import { useUser, useClerk, useAuth } from "@clerk/react"
import { useNavigate, Link } from 'react-router-dom'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  User, Mail, ShieldCheck, LogOut, Package, Settings,
  Camera, MapPin, Plus, Trash2, CheckCircle2, AlertCircle, ChevronRight, Loader2
} from 'lucide-react'
import { api } from '../lib/api'

// Types
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
  <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest font-syne border mb-6
    ${type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
    {msg}
  </div>
)

// Personal Info Tab — updates Clerk + syncs to backend
const PersonalInfoTab = () => {
  const { user } = useUser()
  const { getToken } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName]   = useState(user?.lastName  || '')
  const [username, setUsername]   = useState(user?.username  || '')
  const [saving, setSaving]       = useState(false)
  const [banner, setBanner]       = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const showBanner = (type: 'success' | 'error', msg: string) => {
    setBanner({ type, msg })
    setTimeout(() => setBanner(null), 4000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Update Clerk
      await user?.update({ firstName, lastName, username: username || undefined })
      // Sync to our DB
      const token = await getToken()
      await api('/api/users/sync', {
        method: 'POST',
        token,
        body: {
          clerkUserId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          firstName,
          lastName,
          image: user?.imageUrl,
        },
      })
      showBanner('success', 'Profile updated successfully!')
    } catch (err: any) {
      showBanner('error', err.errors?.[0]?.message || err.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await user?.setProfileImage({ file })
      // Sync updated image to DB
      const token = await getToken()
      await api('/api/users/sync', {
        method: 'POST',
        token,
        body: {
          clerkUserId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          firstName: user?.firstName,
          lastName: user?.lastName,
          image: user?.imageUrl,
        },
      })
      showBanner('success', 'Profile photo updated!')
    } catch (err: any) {
      showBanner('error', err.errors?.[0]?.message || 'Photo update failed.')
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-8 md:p-12">
      {banner && <Banner type={banner.type} msg={banner.msg} />}

      {/* Avatar */}
      <div className="flex items-center gap-6 mb-10">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-amber-500 flex items-center justify-center text-black font-black text-2xl font-syne">
                  {(user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || 'U').toUpperCase()}
                </div>
            }
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 bg-white hover:bg-amber-400 text-black p-2 rounded-full shadow-xl transition-all"
          >
            <Camera className="w-3 h-3" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>
        <div>
          <h3 className="text-white font-black font-syne uppercase tracking-tighter text-xl">{user?.fullName || 'Your Name'}</h3>
          <p className="text-white/30 font-poppins text-[10px] tracking-widest uppercase">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { label: 'First Name', value: firstName, setter: setFirstName },
          { label: 'Last Name',  value: lastName,  setter: setLastName  },
        ].map(({ label, value, setter }) => (
          <div key={label} className="flex flex-col gap-2">
            <label className="text-white/30 font-black uppercase text-[10px] tracking-widest font-syne">{label}</label>
            <input
              value={value}
              onChange={e => setter(e.target.value)}
              className="bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/20 px-5 py-3 rounded-full outline-none font-syne font-bold text-sm transition-all"
            />
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <label className="text-white/30 font-black uppercase text-[10px] tracking-widest font-syne">Username</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/20 px-5 py-3 rounded-full outline-none font-syne font-bold text-sm transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white/30 font-black uppercase text-[10px] tracking-widest font-syne">Email</label>
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-3 rounded-full">
            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-white/50 font-syne font-bold text-sm truncate">{user?.primaryEmailAddress?.emailAddress}</p>
            <span className="ml-auto bg-green-500/10 text-green-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-green-500/20 shrink-0">Verified</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-white hover:bg-amber-400 text-black py-4 px-10 rounded-full font-black uppercase text-[10px] tracking-[0.3em] font-syne transition-all disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
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
      <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-12 flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
          <Package className="w-8 h-8 text-white/20" />
        </div>
        <div>
          <h3 className="text-white font-black font-syne uppercase tracking-tighter text-xl mb-2">No Orders Yet</h3>
          <p className="text-white/30 font-poppins text-xs tracking-widest uppercase">Your order history will appear here once you make a purchase.</p>
        </div>
        <a href="/products" className="bg-white text-black hover:bg-amber-400 py-3 px-8 rounded-full font-black uppercase text-[10px] tracking-widest font-syne transition-all">
          Start Shopping
        </a>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'SHIPPED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'CANCELLED': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'PROCESSING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      default: return 'bg-white/10 text-white/60 border-white/20'
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div 
          key={order.id} 
          onClick={() => navigate(`/profile/order/${order.id}`)}
          className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[32px] p-6 hover:bg-white/10 transition-all cursor-pointer group"
        >

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-syne font-black uppercase text-sm tracking-tight">Order #{order.id.slice(0, 8)}</p>
                <p className="text-white/30 font-poppins text-[10px] tracking-widest uppercase">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>{order.status}</span>
              <span className="text-white font-black font-syne text-sm">₹{order.total}</span>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {order.items.map(item => (
              <span key={item.id} className="bg-white/5 text-white/50 text-[9px] font-syne font-bold px-3 py-1 rounded-full">
                {item.product?.name || item.name} × {item.quantity}
              </span>
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
  const [form, setForm] = useState({ label: '', line1: '', line2: '', city: '', state: '', zip: '' })
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
    if (!form.label || !form.line1 || !form.city || !form.state || !form.zip) {
      showBannerMsg('error', 'Please fill Label, Address, City, State, and Zip.')
      return
    }
    setSaving(true)
    try {
      const token = await getToken()
      await api('/api/users/addresses', { method: 'POST', token, body: form })
      setForm({ label: '', line1: '', line2: '', city: '', state: '', zip: '' })
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
        <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-12 flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white/20" />
          </div>
          <div>
            <h3 className="text-white font-black font-syne uppercase tracking-tighter text-xl mb-2">No Saved Addresses</h3>
            <p className="text-white/30 font-poppins text-xs tracking-widest uppercase">Add a delivery address for faster checkout.</p>
          </div>
        </div>
      )}

      {addresses.map(addr => (
        <div key={addr.id} className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[32px] p-6 flex items-start justify-between group hover:bg-white/10 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 mt-1">
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-syne font-black uppercase text-sm tracking-tight">{addr.label}</p>
                {addr.isDefault && <span className="bg-amber-500/10 text-amber-400 text-[7px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/20">Default</span>}
              </div>
              <p className="text-white/50 font-poppins text-xs">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
              <p className="text-white/50 font-poppins text-xs">{addr.city}, {addr.state} {addr.zip}</p>
            </div>
          </div>
          <button onClick={() => handleDelete(addr.id)} className="text-red-400/30 hover:text-red-400 transition-colors p-2">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {showForm ? (
        <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-8">
          <h3 className="text-white font-black font-syne uppercase tracking-tighter text-lg mb-6">New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { key: 'label', placeholder: 'Label (Home, Work..)', span: true },
              { key: 'line1', placeholder: 'Address Line 1', span: true },
              { key: 'line2', placeholder: 'Address Line 2 (optional)', span: true },
              { key: 'city',  placeholder: 'City' },
              { key: 'state', placeholder: 'State' },
              { key: 'zip',   placeholder: 'Zip / Postal Code' },
            ].map(({ key, placeholder, span }) => (
              <input
                key={key}
                placeholder={placeholder}
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className={`bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/20 px-5 py-3 rounded-full outline-none font-syne font-bold text-sm transition-all ${span ? 'md:col-span-2' : ''}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={saving} className="bg-white hover:bg-amber-400 text-black py-3 px-8 rounded-full font-black uppercase text-[10px] tracking-widest font-syne transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Address'}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white py-3 px-8 rounded-full font-black uppercase text-[10px] tracking-widest font-syne border border-white/10 transition-all">Cancel</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-3 justify-center bg-white/5 border border-dashed border-white/20 hover:border-white/40 hover:bg-white/10 text-white/50 hover:text-white py-4 px-8 rounded-[32px] font-black uppercase text-[10px] tracking-widest font-syne transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Address
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
    <div className="flex flex-col gap-6">
      {banner && <Banner type={banner.type} msg={banner.msg} />}

      <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-8 md:p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-white/10 p-3 rounded-2xl"><Settings className="w-5 h-5 text-white" /></div>
          <h3 className="text-white font-black font-syne uppercase tracking-tighter text-xl">Account Settings</h3>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div>
              <p className="text-white font-syne font-black uppercase text-xs tracking-widest mb-1">Profile Photo</p>
              <p className="text-white/30 font-poppins text-[10px] tracking-widest">Remove your current profile image</p>
            </div>
            <button onClick={handleDeletePhoto} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 px-5 rounded-full font-black uppercase text-[10px] tracking-widest font-syne transition-all">
              Remove Photo
            </button>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div>
              <p className="text-white font-syne font-black uppercase text-xs tracking-widest mb-1">Account ID</p>
              <p className="text-white/30 font-poppins text-[10px]">{user?.id}</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div>
              <p className="text-white font-syne font-black uppercase text-xs tracking-widest mb-1">Member Since</p>
              <p className="text-white/30 font-poppins text-[10px] tracking-widest">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onSignOut}
        className="flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-4 px-10 rounded-full font-black uppercase text-[10px] tracking-[0.3em] font-syne transition-all w-full"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  )
}

// Main Profile Page
type Tab = 'personal' | 'orders' | 'addresses' | 'settings'

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'personal',   label: 'Personal Info',   icon: User    },
  { id: 'orders',     label: 'Order History',   icon: Package },
  { id: 'addresses',  label: 'Saved Addresses', icon: MapPin  },
  { id: 'settings',   label: 'Settings',        icon: Settings},
]

const UserProfilePage = () => {
  const { isLoaded, user: clerkUser } = useUser()
  const { getToken } = useAuth()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('personal')
  const [dbUser, setDbUser] = useState<any>(null)

  useEffect(() => {
    const fetchDbUser = async () => {
      if (clerkUser) {
        try {
          const token = await getToken()
          const data = await api('/api/users/me', { token })
          setDbUser(data)
        } catch {}
      }
    }
    fetchDbUser()
  }, [clerkUser, getToken])

  if (!isLoaded || !clerkUser) return null

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-transparent relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 blur-[200px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 blur-[150px] -z-10 rounded-full" />

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-8 flex flex-col items-center text-center sticky top-28">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl mb-4">
              {clerkUser.imageUrl
                ? <img src={clerkUser.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-amber-500 flex items-center justify-center text-black font-black text-3xl font-syne">
                    {(clerkUser.firstName?.[0] || clerkUser.emailAddresses?.[0]?.emailAddress?.[0] || 'U').toUpperCase()}
                  </div>
              }
            </div>
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase font-syne mb-0.5">
              {clerkUser.fullName || clerkUser.username || 'Explorer'}
            </h2>
            <div className="flex items-center gap-2 mb-8">
              <p className="text-white/30 font-poppins text-[10px] tracking-widest uppercase">
                {clerkUser.primaryEmailAddress?.emailAddress}
              </p>
              {dbUser?.role === 'admin' && (
                <span className="bg-amber-400/20 text-amber-400 text-[7px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-400/20">Admin</span>
              )}
            </div>

            <nav className="w-full flex flex-col gap-1.5">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-syne font-black uppercase text-[10px] tracking-widest transition-all
                    ${activeTab === id ? 'bg-white text-black' : 'hover:bg-white/5 text-white/50 hover:text-white'}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}

              {dbUser?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-amber-400/10 text-amber-400 rounded-2xl font-syne font-black uppercase text-[10px] tracking-widest transition-all mt-2 border border-amber-400/20 group"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={handleSignOut}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-red-500/10 text-red-400/60 hover:text-red-400 rounded-2xl font-syne font-black uppercase text-[10px] tracking-widest transition-all mt-4 border-t border-white/5 pt-6"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/10 p-2.5 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase font-syne">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>

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
