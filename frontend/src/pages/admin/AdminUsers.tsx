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
            <h1 className="text-3xl md:text-5xl font-black font-syne italic uppercase tracking-tighter text-white">Customer Directory</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-amber-400 font-bold uppercase text-[10px] tracking-widest font-syne">{users.length} REGISTERED CUSTOMERS</span>
              <div className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="text-white/30 font-bold uppercase text-[10px] tracking-widest font-syne">Community Insight</span>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
            <input
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/20 pl-12 pr-6 py-4 rounded-full outline-none font-syne font-bold text-[10px] tracking-widest uppercase transition-all"
            />
          </div>
        </header>

        {loading ? (
          <div className="py-40 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-white/10 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 border-2 border-dashed border-white/5 rounded-[50px] flex flex-col items-center gap-6 justify-center text-center px-10">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 animate-pulse"><Users className="w-8 h-8" /></div>
            <div>
              <h3 className="text-white/80 font-black font-syne uppercase text-xl mb-2">No Customers Identified</h3>
              <p className="text-white/30 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">Try a different trajectory for your search discovery.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(user => (
              <div key={user.id} className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-3xl hover:bg-white/10 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -z-10 group-hover:bg-amber-400/5 transition-all duration-700" />
                
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center font-black italic text-2xl text-black shadow-xl transform -rotate-3 group-hover:rotate-0 transition-transform">
                      {user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <h3 className="text-xl font-black font-syne italic uppercase tracking-tight text-white/90 truncate max-w-[150px]">{user.name || 'Anonymous'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {user.isAdmin && (
                          <span className="bg-amber-400/20 text-amber-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-400/20 flex items-center gap-1">
                            <Shield className="w-2 h-2" /> Admin
                          </span>
                        )}
                        <span className="text-white/20 font-bold uppercase text-[8px] tracking-widest font-syne">Customer</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-3 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all"><MoreVertical className="w-4 h-4" /></button>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-white/50">
                    <Mail className="w-3.5 h-3.5" />
                    <p className="text-[10px] font-bold font-poppins truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3 text-white/50">
                    <Calendar className="w-3.5 h-3.5" />
                    <p className="text-[10px] font-bold font-poppins uppercase tracking-widest">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
                  <div className="bg-white/5 p-4 rounded-3xl text-center">
                    <p className="text-xl font-black font-poppins text-white">{user._count?.orders || 0}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20 font-syne">Orders</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-3xl text-center">
                    <p className="text-xl font-black font-poppins text-white">{user._count?.reviews || 0}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20 font-syne">Reviews</p>
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
