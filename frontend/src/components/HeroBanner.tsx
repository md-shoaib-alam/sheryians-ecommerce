import { Link } from 'react-router-dom'
import herobanner from '../assets/herobanner.png'

const HeroBanner = () => {
  return (
    <div className="relative w-full overflow-hidden pt-12 md:pt-20 mb-4 md:mb-12">
      <Link to="/products" className="w-full relative py-2 bg-gradient-to-b from-black to-transparent block cursor-pointer transition-transform hover:scale-[1.01] duration-700">
        <img 
          src={herobanner} 
          alt="Makhana Banner" 
          className="w-full h-auto object-cover"
          loading="eager"
        />
        <div className="absolute bottom-2 md:bottom-6 right-4 md:right-10 text-white text-[8px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold opacity-70 font-poppins">
          EXPLODE WITH FLAVOR #FLAVINGHOT
        </div>
      </Link>
    </div>
  )
}

export default HeroBanner
