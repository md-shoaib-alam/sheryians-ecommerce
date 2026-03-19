import ProductSection from '../components/ProductSection'
import { allProducts } from '../data/products'

const Products = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      <ProductSection 
        title="Our Full Collection"
        products={allProducts} 
        showSort={true} 
        showNoMore={true} 
      />
    </div>
  )
}

export default Products
