import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@clerk/react"
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import {
  Users,
  Search,
  Mail,
  Calendar,
  Shield,
  Loader2,
  MoreVertical,
} from 'lucide-react'

const AdminUsers = () => {
  const { getToken } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = useCallback(async () => {
    try {
      const token = await getToken()
      const data = await api('/api/admin/users', { token })
      setUsers(data)
    } catch {
      // API not available
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const filtered = users.filter(u => 
    !search || 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="flex flex-col gap-10">
        <header className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-brand-red">CUSTOMER DIRECTORY</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-brand-red font-bold uppercase text-[10px] tracking-widest">{users.length} REGISTERED CUSTOMERS</span>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/20" />
            <input
              placeholder="SEARCH CUSTOMERS..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#FAF6F6] border border-brand-red/10 focus:border-brand-red/30 text-brand-dark placeholder:text-brand-dark/20 pl-12 pr-6 py-2.5 rounded-lg outline-none font-bold text-[10px] tracking-widest uppercase transition-all shadow-sm"
            />
          </div>
        </header>

        {loading ? (
          <div className="py-40 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-dark/10 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 border-2 border-dashed border-brand-red/10 rounded-3xl flex flex-col items-center gap-6 justify-center text-center px-10">
            <div className="w-20 h-20 rounded-full bg-brand-red/5 flex items-center justify-center text-brand-red/40"><Users className="w-8 h-8" /></div>
            <div>
              <h3 className="text-brand-dark font-black uppercase text-xl mb-2">NO CUSTOMERS IDENTIFIED</h3>
              <p className="text-brand-dark/40 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">Try a different trajectory for your search discovery.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(user => (
              <div key={user.id} className="bg-white border border-brand-red/10 rounded-2xl p-6 transition-all group relative overflow-hidden shadow-sm hover:border-brand-red/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF6F6] rounded-full blur-3xl -z-10 transition-all duration-700" />
                
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-red/5 rounded-xl flex items-center justify-center font-black text-xl text-brand-red shadow-sm transition-transform">
                      {user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-brand-dark truncate max-w-[150px]">{user.name || 'Anonymous'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {user.isAdmin && (
                          <span className="bg-amber-100 text-amber-700 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                            <Shield className="w-2 h-2" /> ADMIN
                          </span>
                        )}
                        <span className="text-brand-dark/40 font-bold uppercase text-[8px] tracking-widest">CUSTOMER</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-3 bg-[#FAF6F6] rounded-2xl text-brand-dark/30 hover:text-brand-red transition-all"><MoreVertical className="w-4 h-4" /></button>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-brand-dark/60">
                    <Mail className="w-3.5 h-3.5 text-brand-red/50" />
                    <p className="text-[10px] font-bold font-sans truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3 text-brand-dark/60">
                    <Calendar className="w-3.5 h-3.5 text-brand-red/50" />
                    <p className="text-[10px] font-bold font-sans uppercase tracking-widest">JOINED {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-brand-red/5">
                  <div className="bg-[#FAF6F6] p-3 rounded-xl text-center border border-brand-red/5">
                    <p className="text-xl font-black font-sans text-brand-dark">{user._count?.orders || 0}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/40 mt-1">ORDERS</p>
                  </div>
                  <div className="bg-[#FAF6F6] p-3 rounded-xl text-center border border-brand-red/5">
                    <p className="text-xl font-black font-sans text-brand-dark">{user._count?.reviews || 0}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/40 mt-1">REVIEWS</p>
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

export default AdminUsers
