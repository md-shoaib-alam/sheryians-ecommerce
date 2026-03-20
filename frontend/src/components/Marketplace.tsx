import { ShoppingBag } from 'lucide-react'

const Marketplace = () => {
  const marketplaces = [
    { name: "Amazon", id: "amazon", link: "https://amazon.in" },
    { name: "Meesho", id: "meesho", link: "https://meesho.com" }
  ]

  return (
    <section className="py-24 bg-secondary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-12">Also Available On</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
          {marketplaces.map(mkt => (
            <a key={mkt.id} href={mkt.link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
              <div className="mb-6 p-8 bg-white border border-primary/5 rounded-3xl shadow-soft group-hover:scale-110 transition-transform duration-500 overflow-hidden relative">
                 <div className="absolute inset-0 bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-500 origin-bottom-right"></div>
                 <ShoppingBag className="w-16 h-16 text-primary group-hover:text-accent relative z-10 transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary group-hover:text-accent transition-colors">{mkt.name}</h3>
              <p className="text-primary/40 text-xs font-black uppercase tracking-widest mt-2">{mkt.name} Marketplace India</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Marketplace
