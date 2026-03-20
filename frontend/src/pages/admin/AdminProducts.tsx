import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@clerk/react"
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  PlusCircle,
  Archive,
  Loader2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  Search,
} from 'lucide-react'

// ─── Modal Components ──────────────────────────────────────────────────────
// ─── Modal Components ──────────────────────────────────────────────────────
const ProductModal = ({ product, onClose, onSave }: { product?: any; onClose: () => void; onSave: (data: any) => Promise<void> }) => {
  const [form, setForm] = useState<any>(product || {
    name: '', description: '', price: '', mrp: '', category: 'Makhana',
    stock: 100, imageUrl: '', images: [], tags: '', weight: '', flavour: ''
  })
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product && typeof product.images === 'string') {
        setForm((f: any) => ({ ...f, images: product.images.split(',').filter(Boolean) }))
    }
  }, [product])

  const handleSave = async () => {
    if (!form.name || !form.price || !form.imageUrl || !form.category) {
      setError('Essential fields (Name, Price, Category, Hero Image) are required.')
      return
    }
    setSaving(true)
    try {
      const data = { ...form }
      if (typeof data.tags === 'string') {
        data.tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      }
      data.price = Number(data.price)
      data.mrp = Number(data.mrp || data.price)
      data.stock = Number(data.stock)
      
      await onSave(data)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to curate product.')
    } finally {
      setSaving(false)
    }
  }

  const addImageField = () => {
    setForm((f: any) => ({ ...f, images: [...(f.images || []), ''] }))
  }

  const removeImageField = (index: number) => {
    setForm((f: any) => ({ 
        ...f, 
        images: f.images.filter((_: any, i: number) => i !== index) 
    }))
  }

  const updateImageField = (index: number, value: string) => {
    const newImages = [...form.images]
    newImages[index] = value
    setForm((f: any) => ({ ...f, images: newImages }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 pointer-events-none">
       <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
         onClick={onClose} className="absolute inset-0 bg-primary/20 backdrop-blur-md pointer-events-auto" 
       />
       
       <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white border border-primary/5 rounded-[48px] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-full"
       >
          <header className="px-10 py-10 border-b border-primary/5 flex items-center justify-between shrink-0">
             <div>
                <h3 className="text-3xl font-serif font-black italic text-primary tracking-tighter">{product ? 'Refine Product' : 'Curate New Item'}</h3>
                <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.4em]">Inventory Sanctuary</p>
             </div>
             <button onClick={onClose} className="p-4 bg-secondary/20 rounded-full hover:bg-secondary/30 transition-all text-primary/40">
                <X className="w-5 h-5" />
             </button>
          </header>

          <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
             {error && (
                <div className="bg-primary/5 border border-primary/10 px-8 py-4 rounded-3xl text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 mb-10">
                    <AlertCircle className="w-5 h-5 shrink-0 opacity-40" />
                    {error}
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/20 mb-3 block ml-6">Nomenclature</label>
                    <input
                        placeholder="ITEM NAME"
                        value={form.name}
                        onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))}
                        className="w-full bg-secondary/10 border-none text-primary placeholder:text-primary/20 px-8 py-5 rounded-full outline-none font-bold text-sm focus:ring-4 ring-primary/5 transition-all shadow-soft"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/20 mb-3 block ml-6">Manifesto</label>
                    <textarea
                        placeholder="DETAILED DESCRIPTION"
                        value={form.description}
                        rows={5}
                        onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                        className="w-full bg-secondary/10 border-none text-primary placeholder:text-primary/20 px-8 py-6 rounded-[32px] outline-none font-bold text-sm focus:ring-4 ring-primary/5 transition-all resize-none shadow-soft"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-accent mb-3 block ml-6 italic">Hero Image Identity</label>
                    <input
                        placeholder="PRIMARY SOURCE URL"
                        value={form.imageUrl}
                        onChange={e => setForm((f: any) => ({ ...f, imageUrl: e.target.value }))}
                        className="w-full bg-accent/5 border border-accent/20 text-primary placeholder:text-primary/20 px-8 py-5 rounded-full outline-none font-bold text-sm focus:ring-4 ring-accent/5 transition-all shadow-soft"
                    />
                </div>
             </div>

             {/* Dynamic Gallery Section */}
             <div className="mb-12">
                <div className="flex items-center justify-between mb-6 px-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30">Visual Gallery</label>
                    <button 
                        onClick={addImageField}
                        className="flex items-center gap-2 text-accent hover:underline transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Perspective</span>
                    </button>
                </div>
                
                <div className="flex flex-col gap-4">
                    {form.images?.map((url: string, index: number) => (
                        <div key={index} className="flex gap-4 group">
                            <input
                              placeholder={`GALLERY SOURCE #${index + 1}`}
                              value={url}
                              onChange={e => updateImageField(index, e.target.value)}
                              className="flex-1 bg-secondary/10 border-none text-primary placeholder:text-primary/20 px-8 py-4 rounded-full outline-none font-bold text-[11px] shadow-soft focus:ring-4 ring-primary/5 transition-all"
                            />
                            <button 
                                onClick={() => removeImageField(index)}
                                className="p-4 bg-primary/5 hover:bg-primary hover:text-white text-primary/40 rounded-full transition-all shrink-0 shadow-soft"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {(!form.images || form.images.length === 0) && (
                        <div className="text-primary/10 text-[10px] font-black uppercase tracking-[0.4em] text-center py-8 border-2 border-dashed border-primary/5 rounded-[32px]">No secondary visuals added</div>
                    )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {[
                  { key: 'price', placeholder: 'Sale Value (₹)', type: 'number' },
                  { key: 'mrp', placeholder: 'Retail MRP (₹)', type: 'number' },
                  { key: 'category', placeholder: 'Collection' },
                  { key: 'flavour', placeholder: 'Notes / Flavour' },
                  { key: 'weight', placeholder: 'Dimensions / Weight' },
                  { key: 'stock', placeholder: 'Vault Inventory', type: 'number' },
                  { key: 'tags', placeholder: 'Discovery Tags (comma separated)', span: true },
                ].map(({ key, placeholder, span, type = 'text' }: any) => (
                  <div key={key} className={span ? 'md:col-span-2' : ''}>
                     <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/20 mb-3 block ml-6">{placeholder}</label>
                     <input
                        type={type}
                        placeholder={placeholder.toUpperCase()}
                        value={form[key]}
                        onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                        className="w-full bg-secondary/10 border-none text-primary placeholder:text-primary/20 px-8 py-5 rounded-full outline-none font-bold text-sm focus:ring-4 ring-primary/5 transition-all shadow-soft"
                     />
                  </div>
                ))}
             </div>
          </div>

          <footer className="px-10 py-10 border-t border-primary/5 bg-white flex gap-6 shrink-0">
             <button
               onClick={handleSave}
               disabled={saving}
               className="flex-1 bg-primary text-secondary py-6 rounded-full font-black uppercase text-[11px] tracking-[0.4em] transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 hover:scale-[1.02]"
             >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                {product ? 'Commit Changes' : 'Initialize Item'}
             </button>
             <button onClick={onClose} className="px-12 py-6 bg-transparent border border-primary/10 hover:bg-secondary/20 text-primary/40 hover:text-primary rounded-full font-black uppercase text-[11px] tracking-[0.4em] transition-all">Discard</button>
          </footer>
       </motion.div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────
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
    if (!confirm('Relinquish this product from the inventory?')) return
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
      <AnimatePresence>
        {modal.open && <ProductModal product={modal.product} onClose={() => setModal({ open: false })} onSave={handleSave} />}
      </AnimatePresence>

      <div className="flex flex-col gap-16">
         <header className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
               <h1 className="text-5xl md:text-7xl font-serif font-black italic text-primary tracking-tighter mb-2">Vault.</h1>
               <div className="flex items-center gap-4 pl-1">
                  <span className="text-secondary bg-primary px-4 py-1.5 rounded-full font-black uppercase text-[9px] tracking-[0.4em]">{products.length} Items</span>
                  <p className="text-primary/20 font-black uppercase text-[10px] tracking-[0.5em]">Inventory Sanctuary</p>
               </div>
            </div>
            
            <div className="flex items-center gap-6 w-full md:w-auto">
               <div className="relative flex-1 md:w-80">
                  <input
                    placeholder="SEARCH VAULT..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-secondary/10 border-none text-primary placeholder:text-primary/20 px-10 py-5 rounded-full outline-none font-black text-[10px] tracking-[0.4em] uppercase transition-all shadow-soft focus:ring-4 ring-primary/5"
                  />
                  <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
               </div>
               <button onClick={() => setModal({ open: true })} className="bg-primary text-secondary px-10 py-5 rounded-full font-black uppercase text-[11px] tracking-[0.4em] hover:scale-105 transition-all shadow-2xl shadow-primary/20 shrink-0 flex items-center gap-4">
                  <Plus className="w-5 h-5 shrink-0" />
                  <span>Addition</span>
               </button>
            </div>
         </header>

         {loading ? (
            <div className="py-60 flex items-center justify-center">
               <Loader2 className="w-16 h-16 text-primary/10 animate-spin" />
            </div>
         ) : filtered.length === 0 ? (
            <div className="py-40 border-2 border-dashed border-primary/5 rounded-[64px] flex flex-col items-center gap-10 justify-center text-center px-10 bg-secondary/5">
               <div className="w-32 h-32 rounded-[40px] bg-primary/5 flex items-center justify-center text-primary/10 animate-pulse border border-primary/5"><Archive className="w-12 h-12" /></div>
               <div>
                  <h3 className="text-primary/20 font-serif font-black italic text-4xl mb-4">Vast Emptiness</h3>
                  <p className="text-primary/20 font-black uppercase text-[11px] tracking-[0.5em] max-w-sm mx-auto">No items found matching your filter parameters.</p>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12">
               {filtered.map(p => (
                  <motion.div 
                    layout
                    key={p.id} 
                    className={`group bg-white border border-primary/5 rounded-[48px] overflow-hidden transition-all shadow-soft relative ${!p.isActive ? 'opacity-40 grayscale' : ''}`}
                  >
                     <div className="relative aspect-[4/3] overflow-hidden bg-secondary/5 p-2">
                        <div className="w-full h-full relative overflow-hidden rounded-[40px] bg-white">
                           <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
                        </div>
                        
                        <div className="absolute top-8 left-8 flex gap-3">
                           <span className="bg-primary/90 backdrop-blur-md px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-white">{p.category}</span>
                           {!p.isActive && <span className="bg-accent text-primary px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em]">Archived</span>}
                        </div>
                        
                        <div className="absolute bottom-8 right-8 flex gap-3 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                           <button onClick={() => setModal({ open: true, product: p })} className="w-12 h-12 bg-white hover:bg-primary hover:text-white text-primary rounded-2xl flex items-center justify-center shadow-2xl transition-all border border-primary/5"><Edit2 className="w-5 h-5" /></button>
                           <button onClick={() => handleDelete(p.id)} className="w-12 h-12 bg-white hover:bg-accent text-primary rounded-2xl flex items-center justify-center shadow-2xl transition-all border border-primary/5"><Trash2 className="w-5 h-5" /></button>
                        </div>
                     </div>

                     <div className="p-10">
                        <div className="flex items-start justify-between gap-4 mb-4">
                           <h3 className="text-2xl font-serif font-black italic text-primary tracking-tighter truncate capitalize">{p.name}</h3>
                           <span className="text-accent font-black text-xl italic tracking-tighter shrink-0">₹{p.price}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-8">
                           <p className="text-primary/30 font-black uppercase text-[10px] tracking-widest bg-secondary/20 px-4 py-1.5 rounded-full">
                              {p.flavour || 'Natural'}
                           </p>
                           <p className="text-primary/30 font-black uppercase text-[10px] tracking-widest bg-secondary/20 px-4 py-1.5 rounded-full">
                              {p.weight || '100g'}
                           </p>
                        </div>

                        <div className="flex items-center justify-between pt-8 border-t border-primary/5">
                           <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${p.stock < 20 ? 'bg-accent shadow-lg shadow-accent/50' : 'bg-green-500 shadow-lg shadow-green-500/50'}`} />
                              <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">{p.stock} Units Vaulted</span>
                           </div>
                           <p className="text-[10px] font-black italic text-primary/20 tracking-widest">#{p.id.slice(0, 6).toUpperCase()}</p>
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

export default AdminProducts
