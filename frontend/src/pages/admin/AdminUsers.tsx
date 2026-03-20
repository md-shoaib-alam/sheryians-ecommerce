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

import { motion } from 'framer-motion'

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
      <div className="flex flex-col gap-16 md:gap-24">
        <header className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-black italic text-primary tracking-tighter mb-2">Directory.</h1>
            <div className="flex items-center gap-4 pl-1">
               <span className="text-secondary bg-primary px-4 py-1.5 rounded-full font-black uppercase text-[9px] tracking-[0.4em]">{users.length} REGISTERED</span>
               <p className="text-primary/20 font-black uppercase text-[10px] tracking-[0.5em]">Global Customer Base</p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <input
              placeholder="SEARCH DIRECTORY..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-secondary/10 border-none text-primary placeholder:text-primary/20 px-10 py-5 rounded-full outline-none font-black text-[10px] tracking-[0.4em] uppercase transition-all shadow-soft focus:ring-4 ring-primary/5"
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
          </div>
        </header>

        {loading ? (
          <div className="py-60 flex items-center justify-center">
            <Loader2 className="w-16 h-16 text-primary/10 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-40 border-2 border-dashed border-primary/5 rounded-[64px] flex flex-col items-center gap-10 justify-center text-center px-10 bg-secondary/5">
            <div className="w-32 h-32 rounded-[40px] bg-primary/5 flex items-center justify-center text-primary/10 border border-primary/5"><Users className="w-12 h-12" /></div>
            <div>
              <h3 className="text-primary/20 font-serif font-black italic text-4xl mb-4">No Contacts</h3>
              <p className="text-primary/20 font-black uppercase text-[11px] tracking-[0.5em] max-w-sm mx-auto">Zero records discovered on this specific trajectory.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
            {filtered.map(user => (
              <motion.div 
                layout
                key={user.id} 
                className="bg-white border border-primary/5 rounded-[48px] p-10 transition-all group relative overflow-hidden shadow-soft hover:shadow-2xl hover:shadow-primary/5 hover:scale-[1.02]"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10 transition-all duration-700 group-hover:bg-accent/5" />
                
                <div className="flex items-start justify-between mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center font-serif font-black italic text-2xl text-primary shadow-soft border border-primary/5 group-hover:bg-primary group-hover:text-secondary transition-all">
                      {user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-black italic text-primary tracking-tighter capitalize truncate max-w-[150px]">{user.name || 'Anonymous'}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        {user.isAdmin && (
                          <span className="bg-accent/10 text-accent text-[8px] font-black uppercase px-3 py-1 rounded-full border border-accent/20 flex items-center gap-1 leading-none">
                            <Shield className="w-2.5 h-2.5" /> ADMIN
                          </span>
                        )}
                        <span className="text-primary/20 font-black uppercase text-[8px] tracking-widest leading-none">MEMBER</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-4 bg-secondary/10 hover:bg-primary hover:text-white rounded-2xl text-primary/20 transition-all shadow-soft"><MoreVertical className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4 mb-12">
                  <div className="flex items-center gap-4 text-primary/40 group/mail">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover/mail:bg-primary group-hover/mail:text-white transition-all"><Mail className="w-3.5 h-3.5" /></div>
                    <p className="text-[11px] font-bold font-sans truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-4 text-primary/40 group/cal">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover/cal:bg-primary group-hover/cal:text-white transition-all"><Calendar className="w-3.5 h-3.5" /></div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em]">SINCE {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-10 border-t border-primary/5">
                  <div className="bg-secondary/10 p-6 rounded-[32px] text-center border border-primary/5 group-hover:bg-white transition-all shadow-inner">
                    <p className="text-2xl font-serif font-black italic text-primary leading-none mb-1">{user._count?.orders || 0}</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/20">ORDERS</p>
                  </div>
                  <div className="bg-secondary/10 p-6 rounded-[32px] text-center border border-primary/5 group-hover:bg-white transition-all shadow-inner">
                    <p className="text-2xl font-serif font-black italic text-primary leading-none mb-1">{user._count?.reviews || 0}</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/20">REVIEWS</p>
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

export default AdminUsers
