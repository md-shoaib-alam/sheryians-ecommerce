import herobanner from '../assets/herobanner.png'

const HeroBanner = () => {
  return (
    <div className="relative w-full overflow-hidden pt-16">
      <div className="w-full relative py-2 bg-gradient-to-b from-black to-transparent">
        <img 
          src={herobanner} 
          alt="Makhana Banner" 
          className="w-full h-auto object-cover"
        />
        <div className="absolute bottom-6 right-10 text-white text-xs uppercase tracking-[0.3em] font-bold opacity-70">
          EXPLODE WITH FLAVOR #FLAVINGHOT
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
