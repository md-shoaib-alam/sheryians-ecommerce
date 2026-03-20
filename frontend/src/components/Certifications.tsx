const Certifications = () => {
  const certifications = [
    { name: "Startup India", id: "startup-india" },
    { name: "FSSAI", id: "fssai" },
    { name: "MSME", id: "msme" },
    { name: "MCA", id: "mca" }
  ]

  return (
    <section className="py-12 bg-white border-y border-primary/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h3 className="text-center text-primary/40 uppercase tracking-[0.5em] text-xs font-black mb-10">Our Trusted Affiliations</h3>
        <div className="flex items-center justify-start md:justify-around gap-12 md:gap-20 overflow-x-auto scrollbar-hide snap-x snap-mandatory pt-4 pb-2 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          {certifications.map(cert => (
            <div key={cert.id} className="text-xl sm:text-2xl md:text-4xl font-serif font-black text-primary hover:text-accent transition-colors cursor-default whitespace-nowrap snap-center flex-shrink-0">
              {cert.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Certifications
