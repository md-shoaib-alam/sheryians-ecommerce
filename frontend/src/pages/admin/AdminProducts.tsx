import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@clerk/react"
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import {
  Plus,
  PlusCircle,
  Archive,
  Loader2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
} from 'lucide-react'

// ─── Modal Components ──────────────────────────────────────────────────────
const ProductModal = ({ product, onClose, onSave }: { product?: any; onClose: () => void; onSave: (data: any) => Promise<void> }) => {
  const [form, setForm] = useState<any>(product || {
    name: '', description: '', price: '', mrp: '', category: 'Makhana',
    stock: 100, imageUrl: '', images: [], tags: '', weight: '', flavour: ''
  })
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Sync images if they come as a string (legacy/edge case)
  useEffect(() => {
    if (product && typeof product.images === 'string') {
        setForm((f: any) => ({ ...f, images: product.images.split(',').filter(Boolean) }))
    }
  }, [product])

  const handleSave = async () => {
    if (!form.name || !form.price || !form.imageUrl || !form.category) {
      setError('Please fill Name, Price, Category and Main Image URL.')
      return
    }
    setSaving(true)
    try {
      const data = { ...form }
      if (typeof data.tags === 'string') {
        data.tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      }
      // Ensure prices are numbers
      data.price = Number(data.price)
      data.mrp = Number(data.mrp || data.price)
      data.stock = Number(data.stock)
      
      await onSave(data)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save product.')
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
       <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto" />
       
       <div className="relative w-full max-w-2xl bg-[#FCF8F8] border border-brand-red/10 rounded-[40px] shadow-sm overflow-hidden pointer-events-auto flex flex-col max-h-full">
          <header className="px-8 py-6 border-b border-brand-red/5 flex items-center justify-between shrink-0">
             <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-brand-red">{product ? 'Edit Product' : 'Add New Product'}</h3>
                <p className="text-[9px] font-bold text-brand-dark/40 uppercase tracking-widest">Inventory Management</p>
             </div>
             <button onClick={onClose} className="p-3 bg-brand-red/5 rounded-2xl hover:bg-brand-red/10 transition-all text-brand-dark/40 hover:text-brand-red">
                <X className="w-5 h-5" />
             </button>
          </header>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
             {error && (
                <div className="bg-red-50 border border-red-200 px-5 py-3 rounded-2xl text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 mb-6">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div className="md:col-span-2">
                    <label className="text-brand-dark/40 font-bold uppercase text-[9px] tracking-[0.2em] mb-1.5 block ml-4">Product Name</label>
                    <input
                        placeholder="Product Name"
                        value={form.name}
                        onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))}
                        className="w-full bg-white border border-brand-red/10 focus:border-brand-red/30 text-brand-dark placeholder:text-brand-dark/20 px-6 py-4 rounded-full outline-none font-medium text-xs transition-all shadow-sm"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="text-brand-dark/40 font-bold uppercase text-[9px] tracking-[0.2em] mb-1.5 block ml-4">Description</label>
                    <textarea
                        placeholder="Description"
                        value={form.description}
                        rows={4}
                        onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                        className="w-full bg-white border border-brand-red/10 focus:border-brand-red/30 text-brand-dark placeholder:text-brand-dark/20 px-6 py-4 rounded-[28px] outline-none font-medium text-xs transition-all resize-none shadow-sm"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="text-brand-red font-black uppercase text-[8px] tracking-[0.3em] font-syne mb-1.5 block ml-4 italic">Main Product Image (Shows on Cards)</label>
                    <input
                        placeholder="Main Hero Image URL"
                        value={form.imageUrl}
                        onChange={e => setForm((f: any) => ({ ...f, imageUrl: e.target.value }))}
                        className="w-full bg-brand-pink/50 border border-brand-red/10 focus:border-brand-red/30 text-brand-dark placeholder:text-brand-dark/20 px-6 py-4 rounded-full outline-none font-medium text-xs transition-all shadow-sm"
                    />
                </div>
             </div>

             {/* Dynamic Gallery Section */}
             <div className="mb-10 px-4">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-brand-dark/40 font-black uppercase text-[10px] tracking-[0.3em] font-syne">Additional Gallery</label>
                    <button 
                        onClick={addImageField}
                        className="flex items-center gap-2 text-brand-red hover:text-brand-dark transition-colors text-[9px] font-black uppercase tracking-widest font-syne"
                    >
                        <Plus className="w-3 h-3" />
                        <span>Add Gallery Image</span>
                    </button>
                </div>
                
                <div className="flex flex-col gap-3">
                    {form.images?.map((url: string, index: number) => (
                        <div key={index} className="flex gap-2">
                            <input
                              placeholder={`Gallery Image #${index + 1} URL`}
                              value={url}
                              onChange={e => updateImageField(index, e.target.value)}
                              className="flex-1 bg-white border border-brand-red/10 focus:border-brand-red/30 text-brand-dark placeholder:text-brand-dark/20 px-6 py-3 rounded-full outline-none font-medium text-[10px] shadow-sm"
                            />
                            <button 
                                onClick={() => removeImageField(index)}
                                className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all shrink-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {(!form.images || form.images.length === 0) && (
                        <p className="text-brand-dark/10 text-[9px] font-bold uppercase tracking-widest text-center py-4 border border-dashed border-brand-red/10 rounded-3xl">No additional images added</p>
                    )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { key: 'price', placeholder: 'Sale Price (₹)', type: 'number' },
                  { key: 'mrp', placeholder: 'MRP (₹)', type: 'number' },
                  { key: 'category', placeholder: 'Category' },
                  { key: 'flavour', placeholder: 'Flavour' },
                  { key: 'weight', placeholder: 'Weight' },
                  { key: 'stock', placeholder: 'Inventory', type: 'number' },
                  { key: 'tags', placeholder: 'Tags (comma separated)', span: true },
                ].map(({ key, placeholder, span, type = 'text' }: any) => (
                  <div key={key} className={span ? 'md:col-span-2' : ''}>
                     <label className="text-brand-dark/40 font-bold uppercase text-[9px] tracking-[0.2em] mb-1.5 block ml-4">{placeholder}</label>
                     <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                        className="w-full bg-white border border-brand-red/10 focus:border-brand-red/30 text-brand-dark placeholder:text-brand-dark/20 px-6 py-4 rounded-full outline-none font-medium text-xs transition-all shadow-sm"
                     />
                  </div>
                ))}
             </div>
          </div>

          <footer className="px-8 py-6 border-t border-brand-red/5 bg-white/50 backdrop-blur-md flex gap-3 shrink-0">
             <button
               onClick={handleSave}
               disabled={saving}
               className="flex-1 bg-brand-red text-white hover:opacity-90 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
             >
                {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <PlusCircle className="w-4 h-4 text-white" />}
                {product ? 'Save Changes' : 'Create Product'}
             </button>
             <button onClick={onClose} className="px-8 py-4 bg-transparent border border-brand-dark/10 hover:border-brand-dark/30 hover:bg-black/5 text-brand-dark/60 hover:text-brand-dark rounded-full font-bold uppercase text-[10px] tracking-widest transition-all">Cancel</button>
          </footer>
       </div>
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
         <header className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
               <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-brand-red">PRODUCT INVENTORY</h1>
               <div className="flex items-center gap-3 mt-2">
                  <span className="text-brand-red font-bold uppercase text-[10px] tracking-widest">{products.length} ITEMS TOTAL</span>
               </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <input
                    placeholder="SEARCH COLLECTION..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-[#FAF6F6] border border-brand-red/5 focus:border-brand-red/20 text-brand-dark placeholder:text-brand-dark/20 px-4 py-2.5 rounded-lg outline-none font-bold text-[10px] tracking-widest uppercase transition-all shadow-sm"
                  />
               </div>
               <button onClick={() => setModal({ open: true })} className="bg-brand-red text-white hover:opacity-90 shadow-sm rounded-lg px-4 py-2.5 transition-all text-xs font-bold font-sans flex items-center gap-1.5 leading-none">
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>New Product</span>
               </button>
            </div>
         </header>

         {loading ? (
            <div className="py-40 flex items-center justify-center">
               <Loader2 className="w-10 h-10 text-brand-red/20 animate-spin" />
            </div>
         ) : filtered.length === 0 ? (
            <div className="py-32 border-2 border-dashed border-brand-red/10 rounded-2xl flex flex-col items-center gap-6 justify-center text-center px-10">
               <div className="w-20 h-20 rounded-2xl bg-brand-pink/50 flex items-center justify-center text-brand-red animate-pulse"><Archive className="w-8 h-8" /></div>
               <div>
                  <h3 className="text-brand-dark/80 font-black uppercase text-xl mb-2">No Products Discovered</h3>
                  <p className="text-brand-dark/30 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">Try refining your search or add a new variety to your store.</p>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
               {filtered.map(p => (
                  <div key={p.id} className={`group bg-white border border-brand-red/10 rounded-2xl overflow-hidden transition-all shadow-sm ${!p.isActive ? 'opacity-50 grayscale' : ''}`}>
                     <div className="relative h-56 overflow-hidden bg-[#FAF6F6]">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                        
                        <div className="absolute top-5 left-5 flex gap-2">
                           <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white/90">{p.category}</span>
                           {!p.isActive && <span className="bg-red-500/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white">Archived</span>}
                        </div>
                        
                        <div className="absolute top-4 right-4 flex gap-2">
                           <button onClick={() => setModal({ open: true, product: p })} className="w-9 h-9 bg-[#5D1A1E] hover:opacity-90 text-white rounded-lg flex items-center justify-center shadow-md transition-all"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => handleDelete(p.id)} className="w-9 h-9 bg-red-600 hover:opacity-90 text-white rounded-lg flex items-center justify-center shadow-md transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                     </div>

                     <div className="p-6">
                        <h3 className="text-xl font-black italic uppercase tracking-tight text-[#5D1A1E] mb-1 truncate">{p.name}</h3>
                        <p className="text-gray-400 font-medium text-[13px] mb-6">
                           {p.flavour || 'Organic'} {p.weight || '100g'}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                           <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${p.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`} />
                              <span className="text-[10px] font-black text-brand-dark/60 uppercase tracking-widest">{p.stock} In Stock</span>
                           </div>
                           <span className="text-brand-red font-black text-sm italic">₹{p.price}</span>
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
