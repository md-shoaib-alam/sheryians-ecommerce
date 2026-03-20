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
        <div className="flex flex-wrap items-center justify-around gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
           {certifications.map(cert => (
               <div key={cert.id} className="text-xl md:text-3xl font-serif font-black text-primary hover:text-accent transition-colors cursor-default">
                   {cert.name}
               </div>
           ))}
        </div>
      </div>
    </section>
  )
}

export default Certifications
