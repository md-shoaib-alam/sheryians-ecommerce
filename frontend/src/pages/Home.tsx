import HeroBanner from '../components/HeroBanner'
import ProductSection from '../components/ProductSection'
import { allProducts } from '../data/products'

const Home = () => {
  const newArrivals = allProducts.slice(0, 4)
  const bestSellers = allProducts.slice(4, 10)

  return (
    <div className="pb-20">
      <HeroBanner />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* New Arrivals with Scrolling mobile row */}
        <ProductSection 
          title="NEW ARRIVALS" 
          products={newArrivals} 
          isScrollable={true}
        />

        {/* Best Sellers with Grid mobile layout */}
        <div className="mt-6 md:mt-32">
          <ProductSection 
            title="BEST SELLERS" 
            products={bestSellers} 
          />
        </div>
      </div>
    </div>
  )
}

export default Home
