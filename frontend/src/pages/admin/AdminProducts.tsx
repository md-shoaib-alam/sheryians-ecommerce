import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@clerk/react"
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import {
  Plus,
  Search,
  PlusCircle,
  TrendingUp,
  Archive,
  Loader2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
} from 'lucide-react'

// ─── Modal Components ──────────────────────────────────────────────────────
const ProductModal = ({ product, onClose, onSave }: { product?: any; onClose: () => void; onSave: (data: any) => Promise<void> }) => {
  const [form, setForm] = useState(product || {
    name: '', description: '', price: '', mrp: '', category: 'Makhana',
    stock: 100, imageUrl: '', tags: '', weight: '', flavour: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!form.name || !form.price || !form.imageUrl || !form.category) {
      setError('Please fill Name, Price, Category and Image URL.')
      return
    }
    setSaving(true)
    try {
      // Convert tags string to array if needed
      const data = { ...form }
      if (typeof data.tags === 'string') data.tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      await onSave(data)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 pointer-events-none">
       <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto" />
       
       <div className="relative w-full max-w-2xl bg-black border border-white/10 rounded-[40px] shadow-3xl overflow-hidden pointer-events-auto flex flex-col max-h-full">
          <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between shrink-0">
             <div>
                <h3 className="text-xl font-black font-syne italic uppercase tracking-tighter text-white">{product ? 'Edit Product' : 'Add New Product'}</h3>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-syne">Gourmet Inventory Management</p>
             </div>
             <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <X className="w-5 h-5 text-white" />
             </button>
          </header>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
             {error && (
                <div className="bg-red-500/10 border border-red-500/20 px-5 py-3 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest font-syne flex items-center gap-3 mb-6 animate-shake">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { key: 'name', placeholder: 'Product Name', span: true },
                  { key: 'description', placeholder: 'Description (markdown supported)', span: true, area: true },
                  { key: 'imageUrl', placeholder: 'Primary Image URL (Cloudfront/S3)', span: true },
                  { key: 'price', placeholder: 'Sale Price (₹)', type: 'number' },
                  { key: 'mrp', placeholder: 'MRP (₹)', type: 'number' },
                  { key: 'category', placeholder: 'Category (e.g. Classic, Flavoured)' },
                  { key: 'flavour', placeholder: 'Flavour (e.g. Peri Peri, Cheese)' },
                  { key: 'weight', placeholder: 'Weight (e.g. 100g, 250g)' },
                  { key: 'stock', placeholder: 'Starting Inventory', type: 'number' },
                  { key: 'tags', placeholder: 'Tags (comma separated)', span: true },
                ].map(({ key, placeholder, span, type = 'text', area }) => (
                  <div key={key} className={span ? 'md:col-span-2' : ''}>
                     <label className="text-white/20 font-black uppercase text-[8px] tracking-[0.3em] font-syne mb-1.5 block ml-4">{placeholder}</label>
                     {area ? (
                        <textarea
                          placeholder={placeholder}
                          value={form[key]}
                          rows={4}
                          onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/10 px-6 py-4 rounded-[28px] outline-none font-syne font-bold text-xs transition-all resize-none"
                        />
                     ) : (
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/10 px-6 py-4 rounded-full outline-none font-syne font-bold text-xs transition-all"
                        />
                     )}
                  </div>
                ))}
             </div>
          </div>

          <footer className="px-8 py-6 border-t border-white/5 bg-white/5 backdrop-blur-2xl flex gap-3 shrink-0">
             <button
               onClick={handleSave}
               disabled={saving}
               className="flex-1 bg-white text-black hover:bg-amber-400 py-4 rounded-full font-black font-syne uppercase text-[10px] tracking-[0.3em] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
             >
                {saving ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <PlusCircle className="w-4 h-4 text-black" />}
                {product ? 'Save Changes' : 'Create Product'}
             </button>
             <button onClick={onClose} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 rounded-full font-black font-syne uppercase text-[10px] tracking-widest transition-all">Cancel</button>
          </footer>
       </div>
    </div>
  )
}

// ─── Main Content Discovery ────────────────────────────────────────────────
const AdminProducts = () => {
  const { getToken } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; product?: any }>({ open: false })
  const [search, setSearch] = useState('')

  const fetchProducts = useCallback(async () => {
    try {
      const token = await getToken()
      const data = await api('/api/admin/products', { token })
      setProducts(data)
    } catch {
      // not available yet
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleSave = async (data: any) => {
    const token = await getToken()
    if (modal.product) {
       await api(`/api/admin/products/${modal.product.id}`, { method: 'PATCH', token, body: data })
    } else {
       await api('/api/admin/products', { method: 'POST', token, body: data })
    }
    fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this product? It will no longer appear on the store.')) return
    try {
       const token = await getToken()
       await api(`/api/admin/products/${id}`, { method: 'DELETE', token })
       fetchProducts()
    } catch {
       alert('Operation failed.')
    }
  }

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <AdminLayout>
      {modal.open && <ProductModal product={modal.product} onClose={() => setModal({ open: false })} onSave={handleSave} />}

      <div className="flex flex-col gap-10">
         {/* Page Header Visualization Area */}
         <header className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
               <h1 className="text-3xl md:text-5xl font-black font-syne italic uppercase tracking-tighter text-white">Product Inventory</h1>
               <div className="flex items-center gap-3 mt-2">
                  <span className="text-amber-400 font-bold uppercase text-[10px] tracking-widest font-syne">{products.length} Items Total</span>
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-white/30 font-bold uppercase text-[10px] tracking-widest font-syne">All systems synced</span>
               </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    placeholder="Search collection..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-white/40 text-white placeholder:text-white/20 pl-12 pr-6 py-4 rounded-full outline-none font-syne font-bold text-[10px] tracking-widest uppercase transition-all"
                  />
               </div>
               <button onClick={() => setModal({ open: true })} className="bg-white text-black hover:bg-amber-400 px-8 py-4 rounded-full font-black font-syne uppercase text-[10px] tracking-[0.2em] shadow-xl flex items-center gap-3 transition-all">
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>New Product</span>
               </button>
            </div>
         </header>

         {/* Grid Content Discovery Visualization */}
         {loading ? (
            <div className="py-40 flex items-center justify-center">
               <Loader2 className="w-10 h-10 text-white/10 animate-spin" />
            </div>
         ) : filtered.length === 0 ? (
            <div className="py-32 border-2 border-dashed border-white/5 rounded-[50px] flex flex-col items-center gap-6 justify-center text-center px-10">
               <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 animate-pulse"><Archive className="w-8 h-8" /></div>
               <div>
                  <h3 className="text-white/80 font-black font-syne uppercase text-xl mb-2">No Products Discovered</h3>
                  <p className="text-white/30 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">Try refining your search or add a new makhana variety to your store.</p>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
               {filtered.map(p => (
                  <div key={p.id} className={`group bg-white/5 border border-white/10 rounded-[44px] overflow-hidden transition-all backdrop-blur-3xl hover:bg-white/10 hover:border-white/20 shadow-xl ${!p.isActive ? 'opacity-50 grayscale' : ''}`}>
                     <div className="relative h-56 overflow-hidden bg-black/40">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover scale-150 transition-transform duration-700 group-hover:scale-[1.65]" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="absolute top-5 left-5 flex gap-2">
                           <span className="bg-black/60 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest font-syne">{p.category}</span>
                           {!p.isActive && <span className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest font-syne text-red-400">Archived</span>}
                        </div>
                        
                        <div className="absolute top-5 right-5 flex gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-500">
                           <button onClick={() => setModal({ open: true, product: p })} className="w-10 h-10 bg-white hover:bg-amber-400 text-black rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => handleDelete(p.id)} className="w-10 h-10 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90"><Trash2 className="w-4 h-4" /></button>
                        </div>

                        <div className="absolute bottom-5 left-8 flex items-end gap-3 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                             <p className="text-3xl font-black font-poppins text-white">₹{p.price}</p>
                             <p className="text-sm font-bold text-white/30 line-through pb-1">₹{p.mrp}</p>
                        </div>
                     </div>

                     <div className="p-8">
                        <h3 className="text-xl font-black font-syne italic uppercase tracking-tight text-white/90 mb-2 truncate">{p.name}</h3>
                        <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest font-syne mb-6 flex items-center gap-2">
                           {p.flavour || 'Organic'} 
                           <span className="w-1 h-1 bg-white/20 rounded-full" /> 
                           {p.weight || '100g'}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                           <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${p.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest font-syne">{p.stock} In Stock</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-white/20">
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-[9px] font-bold font-poppins">{p._count?.orderItems || 0}</span>
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

export default AdminProducts
