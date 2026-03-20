import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Play, Youtube, Loader2 } from 'lucide-react'

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading] = useState(false)
  
  // Mock data for Makhana recipes
  const mockRecipes = [
    {
      id: "1",
      title: "Roasted Peri Peri Makhana - 2 Ways",
      thumbnail: "https://img.youtube.com/vi/qQGIn_Fm0X0/maxresdefault.jpg",
      channel: "Cooking With Shriyans",
      type: "Snack",
      link: "https://youtube.com/watch?v=qQGIn_Fm0X0"
    },
    {
      id: "2",
      title: "Makhana Kheer - Royal Indian Dessert",
      thumbnail: "https://img.youtube.com/vi/C9hV0fLRE5U/maxresdefault.jpg",
      channel: "Sweet Treats",
      type: "Dessert",
      link: "https://youtube.com/watch?v=C9hV0fLRE5U"
    },
    {
      id: "3",
      title: "Healthy Makhana Chaat for Weight Loss",
      thumbnail: "https://img.youtube.com/vi/4aWvX9n4P_Y/maxresdefault.jpg",
      channel: "Health First",
      type: "Healthy",
      link: "https://youtube.com/watch?v=4aWvX9n4P_Y"
    },
    {
      id: "4",
      title: "Matar Makhana Sabzi - Restaurant Style",
      thumbnail: "https://img.youtube.com/vi/B775Z6S6oE8/maxresdefault.jpg",
      channel: "Chef's Table",
      type: "Main Course",
      link: "https://youtube.com/watch?v=B775Z6S6oE8"
    },
    {
        id: "5",
        title: "Caramelized Jaggery Makhana",
        thumbnail: "https://img.youtube.com/vi/YisXp2D_Psw/maxresdefault.jpg",
        channel: "Traditional Flavors",
        type: "Snack",
        link: "https://youtube.com/watch?v=YisXp2D_Psw"
      },
      {
        id: "6",
        title: "Garlic Herb Makhana Butter Roast",
        thumbnail: "https://img.youtube.com/vi/u98UskX1p3U/maxresdefault.jpg",
        channel: "Modern Kitchen",
        type: "Snack",
        link: "https://youtube.com/watch?v=u98UskX1p3U"
      }
  ]

  const [recipes, setRecipes] = useState(mockRecipes)

  useEffect(() => {
    const filtered = mockRecipes.filter(r => 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setRecipes(filtered)
  }, [searchTerm])

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-7xl font-serif font-black text-primary italic mb-6"
            >
                Culinary Inspiration
            </motion.h1>
            <p className="text-primary/40 font-black uppercase tracking-[0.3em] text-[10px] md:text-sm">Explore Delicious Ways to Enjoy Shriyans Lotus Seeds</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-16">
            <div className="relative flex-1 group">
                <input 
                    type="text" 
                    placeholder="Search makhana recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-secondary/10 border border-primary/5 rounded-2xl px-12 py-5 font-bold text-primary placeholder:text-primary/20 outline-none focus:bg-white focus:border-accent/40 shadow-soft transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30 group-focus-within:text-accent" />
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {['All', 'Snack', 'Dessert', 'Healthy', 'Main Course'].map(tag => (
                    <button 
                        key={tag}
                        onClick={() => setSearchTerm(tag === 'All' ? '' : tag)}
                        className={`px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all whitespace-nowrap
                            ${(searchTerm === tag || (tag === 'All' && searchTerm === '')) ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white text-primary border border-primary/5 hover:bg-secondary/20'}
                        `}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>

        {loading ? (
             <div className="py-20 flex justify-center"><Loader2 className="w-12 h-12 text-accent animate-spin" /></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {recipes.map((recipe, index) => (
                    <motion.a
                        key={recipe.id}
                        href={recipe.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex flex-col gap-6"
                    >
                        <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-2xl">
                             <img src={recipe.thumbnail} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                             <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-125 group-hover:bg-accent transition-all duration-500">
                                    <Play className="w-6 h-6 text-white fill-white" />
                                </div>
                             </div>
                             <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                                {recipe.type}
                             </div>
                        </div>
                        
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-serif font-black text-primary leading-tight mb-2 group-hover:text-accent transition-colors">{recipe.title}</h3>
                                <div className="flex items-center gap-2 text-primary/40 text-[10px] font-black uppercase tracking-widest">
                                    <Youtube className="w-3.5 h-3.5" />
                                    <span>{recipe.channel}</span>
                                </div>
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        )}
        
        {recipes.length === 0 && (
            <div className="py-20 text-center">
                <p className="text-primary/40 font-serif italic text-2xl">No recipes found. Try searching for something else!</p>
            </div>
        )}
      </div>
    </div>
  )
}

export default Recipes
