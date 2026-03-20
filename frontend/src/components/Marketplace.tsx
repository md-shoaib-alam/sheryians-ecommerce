

const Marketplace = () => {
  const marketplaces = [
    { 
      name: "Amazon", 
      id: "amazon", 
      link: "https://amazon.in",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
    },
    { 
      name: "Meesho", 
      id: "meesho", 
      link: "https://meesho.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Meesho_Logo_Full.png/1200px-Meesho_Logo_Full.png"
    }
  ]

  return (
    <section className="py-24 bg-secondary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-12">Also Available On</h2>
        
        <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-6 md:gap-20 max-w-2xl mx-auto">
          {marketplaces.map(mkt => (
            <a key={mkt.id} href={mkt.link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
              <div className="mb-4 md:mb-6 w-full aspect-video md:w-64 md:h-32 flex items-center justify-center bg-white border border-primary/5 rounded-2xl md:rounded-3xl shadow-soft group-hover:scale-105 transition-transform duration-500 overflow-hidden relative p-4 md:p-8">
                 <div className="absolute inset-0 bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-500 origin-bottom-right"></div>
                 <img src={mkt.logo} alt={mkt.name} className="w-full h-full object-contain relative z-10" />
              </div>
              <h3 className="text-lg md:text-2xl font-serif font-bold text-primary group-hover:text-accent transition-colors">{mkt.name}</h3>
              <p className="text-primary/40 text-[8px] md:text-xs font-black uppercase tracking-widest mt-1 md:mt-2">{mkt.name} Marketplace India</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Marketplace
