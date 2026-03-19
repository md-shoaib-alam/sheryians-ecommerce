import { Leaf, Heart, Award } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-brand-red" />,
      title: "Ethically Sourced",
      description: "We partner directly with farmers who share our commitment to sustainable, organic practices."
    },
    {
      icon: <Heart className="w-8 h-8 text-brand-red" />,
      title: "Artisan Crafted",
      description: "Each batch is carefully roasted and seasoned by hand to preserve authentic flavors."
    },
    {
      icon: <Award className="w-8 h-8 text-brand-red" />,
      title: "Premium Quality",
      description: "Only the finest lotus seeds make it into our products. No compromise, ever."
    }
  ]

  return (
    <section className="py-20 bg-brand-pink/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-xl md:text-3xl font-black tracking-tight text-brand-red mb-12 font-syne uppercase">
          The Shriyans Difference
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 md:p-12 rounded-sm shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 font-syne uppercase tracking-wider">
                {feature.title}
              </h3>
              <p className="text-brand-dark/60 leading-relaxed font-poppins">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
