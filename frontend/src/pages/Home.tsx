import HeroBanner from '../components/HeroBanner'
import ProductSection from '../components/ProductSection'
import { allProducts } from '../data/products'

const Home = () => {
  return (
    <div className="pb-20">
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <ProductSection 
          title="New Arrivals" 
          products={allProducts.slice(0, 4)} 
          showSort={false} 
          showNoMore={false} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-32">
        <ProductSection 
          title="Best Sellers" 
          products={allProducts.slice(4, 8)} 
          showSort={false} 
          showNoMore={false} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-32">
        <div className="bg-red-800/20 rounded-3xl p-12 text-center border border-white/10 backdrop-blur-lg">
          <h3 className="text-4xl font-extrabold mb-4 uppercase italic font-syne">Experience the crunch</h3>
          <p className="text-white/70 max-w-xl mx-auto mb-8 font-medium">Shriyans Lotus Seeds brings you the finest quality Makhana with hand-crafted flavors to explode your tastebuds.</p>
          <button className="bg-white text-red-900 px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl font-syne">
            Discover all flavors
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
