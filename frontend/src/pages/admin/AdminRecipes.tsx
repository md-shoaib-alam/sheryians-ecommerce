import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@clerk/react"
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  PlusCircle,
  Loader2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  Search,
  Youtube,
  Play
} from 'lucide-react'

// --- Modal Component ---
const RecipeModal = ({ recipe, onClose, onSave }: { recipe?: any; onClose: () => void; onSave: (data: any) => Promise<void> }) => {
  const [form, setForm] = useState<any>(recipe || {
    title: '',
    thumbnail: '',
    channel: 'Cooking With Shriyans',
    type: 'Snack',
    link: '',
    isActive: true
  })
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!form.title || !form.link || !form.type) {
      setError('Essential fields (Title, Video Link, Type) are required.')
      return
    }

    // Basic auto-thumbnail generation for YouTube
    let finalThumbnail = form.thumbnail
    if (!finalThumbnail && form.link.includes('youtube.com/watch?v=')) {
      const videoId = form.link.split('v=')[1]?.split('&')[0]
      if (videoId) {
        finalThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }
    } else if (!finalThumbnail && form.link.includes('youtu.be/')) {
        const videoId = form.link.split('youtu.be/')[1]?.split('?')[0]
        if (videoId) {
          finalThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }
    }

    setSaving(true)
    try {
      await onSave({ ...form, thumbnail: finalThumbnail })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to curate recipe.')
    } finally {
      setSaving(false)
    }
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
                <h3 className="text-3xl font-serif font-black italic text-primary tracking-tighter">{recipe ? 'Refine Recipe' : 'Curate New Recipe'}</h3>
                <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.4em]">Culinary Sanctuary</p>
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
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/20 mb-3 block ml-6">Recipe Title</label>
                    <input
                        placeholder="RECIPE NAME"
                        value={form.title}
                        onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))}
                        className="w-full bg-secondary/10 border-none text-primary placeholder:text-primary/20 px-8 py-5 rounded-full outline-none font-bold text-sm focus:ring-4 ring-primary/5 transition-all shadow-soft"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-accent mb-3 block ml-6 italic">Video Source (YouTube Link)</label>
                    <input
                        placeholder="YOUTUBE VIDEO URL"
                        value={form.link}
                        onChange={e => setForm((f: any) => ({ ...f, link: e.target.value }))}
                        className="w-full bg-accent/5 border border-accent/20 text-primary placeholder:text-primary/20 px-8 py-5 rounded-full outline-none font-bold text-sm focus:ring-4 ring-accent/5 transition-all shadow-soft"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/20 mb-3 block ml-6 italic">Custom Thumbnail URL (Optional - will auto-generate from YT link if empty)</label>
                    <input
                        placeholder="THUMBNAIL IMAGE URL"
                        value={form.thumbnail}
                        onChange={e => setForm((f: any) => ({ ...f, thumbnail: e.target.value }))}
                        className="w-full bg-secondary/10 border-none text-primary placeholder:text-primary/20 px-8 py-5 rounded-full outline-none font-bold text-sm focus:ring-4 ring-primary/5 transition-all shadow-soft"
                    />
                </div>
                <div>
                   <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/20 mb-3 block ml-6">Collection / Category</label>
                   <select
                      value={form.type}
                      onChange={e => setForm((f: any) => ({ ...f, type: e.target.value }))}
                      className="w-full bg-secondary/10 border-none text-primary px-8 py-5 rounded-full outline-none font-bold text-sm focus:ring-4 ring-primary/5 transition-all shadow-soft appearance-none cursor-pointer"
                   >
                      {['Snack', 'Dessert', 'Healthy', 'Main Course', 'Appetizer'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                   </select>
                </div>
                <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/20 mb-3 block ml-6">Channel Name</label>
                    <input
                        placeholder="CHANNEL NAME"
                        value={form.channel}
                        onChange={e => setForm((f: any) => ({ ...f, channel: e.target.value }))}
                        className="w-full bg-secondary/10 border-none text-primary placeholder:text-primary/20 px-8 py-5 rounded-full outline-none font-bold text-sm focus:ring-4 ring-primary/5 transition-all shadow-soft"
                    />
                </div>
             </div>
          </div>

          <footer className="px-10 py-10 border-t border-primary/5 bg-white flex gap-6 shrink-0">
             <button
               onClick={handleSave}
               disabled={saving}
               className="flex-1 bg-primary text-secondary py-6 rounded-full font-black uppercase text-[11px] tracking-[0.4em] transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 hover:scale-[1.02]"
             >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                {recipe ? 'Commit Changes' : 'Initialize Recipe'}
             </button>
             <button onClick={onClose} className="px-12 py-6 bg-transparent border border-primary/10 hover:bg-secondary/20 text-primary/40 hover:text-primary rounded-full font-black uppercase text-[11px] tracking-[0.4em] transition-all">Discard</button>
          </footer>
       </motion.div>
    </div>
  )
}

// --- Main Component ---
const AdminRecipes = () => {
  const { getToken } = useAuth()
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; recipe?: any }>({ open: false })
  const [search, setSearch] = useState('')

  const fetchRecipes = useCallback(async () => {
    try {
      const token = await getToken()
      const data = await api('/api/admin/recipes', { token })
      setRecipes(data)
    } catch {
      // not available yet
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchRecipes() }, [fetchRecipes])

  const handleSave = async (data: any) => {
    const token = await getToken()
    if (modal.recipe) {
       await api(`/api/admin/recipes/${modal.recipe.id}`, { method: 'PATCH', token, body: data })
    } else {
       await api('/api/admin/recipes', { method: 'POST', token, body: data })
    }
    fetchRecipes()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Relinquish this recipe from the collection?')) return
    try {
       const token = await getToken()
       await api(`/api/admin/recipes/${id}`, { method: 'DELETE', token })
       fetchRecipes()
    } catch {
       alert('Operation failed.')
    }
  }

  const filtered = recipes.filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()))

  return (
    <AdminLayout>
      <AnimatePresence>
        {modal.open && <RecipeModal recipe={modal.recipe} onClose={() => setModal({ open: false })} onSave={handleSave} />}
      </AnimatePresence>

      <div className="flex flex-col gap-16">
         <header className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
               <h1 className="text-5xl md:text-7xl font-serif font-black italic text-primary tracking-tighter mb-2">Theater.</h1>
               <div className="flex items-center gap-4 pl-1">
                  <span className="text-secondary bg-primary px-4 py-1.5 rounded-full font-black uppercase text-[9px] tracking-[0.4em]">{recipes.length} Masterpieces</span>
                  <p className="text-primary/20 font-black uppercase text-[10px] tracking-[0.5em]">Culinary Sanctuary</p>
               </div>
            </div>
            
            <div className="flex items-center gap-6 w-full md:w-auto">
               <div className="relative flex-1 md:w-80">
                  <input
                    placeholder="SEARCH THEATER..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-secondary/10 border-none text-primary placeholder:text-primary/20 px-10 py-5 rounded-full outline-none font-black text-[10px] tracking-[0.4em] uppercase transition-all shadow-soft focus:ring-4 ring-primary/5"
                  />
                  <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
               </div>
               <button onClick={() => setModal({ open: true })} className="bg-primary text-secondary px-10 py-5 rounded-full font-black uppercase text-[11px] tracking-[0.4em] hover:scale-105 transition-all shadow-2xl shadow-primary/20 shrink-0 flex items-center gap-4">
                  <Plus className="w-5 h-5 shrink-0" />
                  <span>Curation</span>
               </button>
            </div>
         </header>

         {loading ? (
            <div className="py-60 flex items-center justify-center">
               <Loader2 className="w-16 h-16 text-primary/10 animate-spin" />
            </div>
         ) : filtered.length === 0 ? (
            <div className="py-40 border-2 border-dashed border-primary/5 rounded-[64px] flex flex-col items-center gap-10 justify-center text-center px-10 bg-secondary/5">
               <div className="w-32 h-32 rounded-[40px] bg-primary/5 flex items-center justify-center text-primary/10 animate-pulse border border-primary/5"><Youtube className="w-12 h-12" /></div>
               <div>
                  <h3 className="text-primary/20 font-serif font-black italic text-4xl mb-4">Silent Cinema</h3>
                  <p className="text-primary/20 font-black uppercase text-[11px] tracking-[0.5em] max-w-sm mx-auto">No recipes found matching your filter parameters.</p>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               {filtered.map(r => (
                  <motion.div 
                    layout
                    key={r.id} 
                    className={`group bg-white border border-primary/5 rounded-[48px] overflow-hidden transition-all shadow-soft relative ${!r.isActive ? 'opacity-40 grayscale' : ''}`}
                  >
                     <div className="relative aspect-video overflow-hidden bg-secondary/5 p-2">
                        <div className="w-full h-full relative overflow-hidden rounded-[40px] bg-white">
                           <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
                           <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <Play className="w-12 h-12 text-white fill-white opacity-40" />
                           </div>
                        </div>
                        
                        <div className="absolute top-8 left-8 flex gap-3">
                           <span className="bg-primary/90 backdrop-blur-md px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-white">{r.type}</span>
                        </div>
                        
                        <div className="absolute bottom-8 right-8 flex gap-3 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                           <button onClick={() => setModal({ open: true, recipe: r })} className="w-12 h-12 bg-white hover:bg-primary hover:text-white text-primary rounded-2xl flex items-center justify-center shadow-2xl transition-all border border-primary/5"><Edit2 className="w-5 h-5" /></button>
                           <button onClick={() => handleDelete(r.id)} className="w-12 h-12 bg-white hover:bg-accent text-primary rounded-2xl flex items-center justify-center shadow-2xl transition-all border border-primary/5"><Trash2 className="w-5 h-5" /></button>
                        </div>
                     </div>

                     <div className="p-10">
                        <h3 className="text-2xl font-serif font-black italic text-primary tracking-tighter mb-4 truncate">{r.title}</h3>
                        <div className="flex items-center gap-4 mb-4">
                           <p className="text-primary/30 font-black uppercase text-[10px] tracking-widest bg-secondary/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                             <Youtube className="w-3.5 h-3.5" />
                              {r.channel}
                           </p>
                        </div>
                        <a href={r.link} target="_blank" rel="noreferrer" className="text-accent hover:underline text-[10px] font-black uppercase tracking-widest truncate block mb-8">{r.link}</a>

                        <div className="flex items-center justify-between pt-8 border-t border-primary/5">
                           <p className="text-[10px] font-black italic text-primary/20 tracking-widest">#{r.id.slice(0, 6).toUpperCase()}</p>
                           <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">{new Date(r.createdAt).toLocaleDateString()}</span>
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

export default AdminRecipes
