import { Mail, Phone, Clock, MapPin } from 'lucide-react'

const Contact = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-8xl font-serif font-black text-primary mb-6 italic tracking-tight uppercase">Get in Touch</h1>
          <p className="text-primary/40 font-black tracking-[0.4em] uppercase text-xs">Elevate Your Queries to Our Concierge</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-stretch">
          {/* Contact Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-primary p-12 rounded-[48px] text-white flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <h2 className="text-3xl font-serif font-bold mb-10 italic text-accent">Contact Information</h2>
                
                <div className="space-y-10">
                    <div className="flex items-start gap-6 group">
                        <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-accent transition-colors">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Email Concierge</p>
                            <p className="text-xl font-serif">shriyanskris12@gmail.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                        <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-accent transition-colors">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Customer Care</p>
                            <p className="text-xl font-serif">+91 80946 56597</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                        <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-accent transition-colors">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Business Hours</p>
                            <p className="text-xl font-serif">Mon - Sat: 10AM - 7PM</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-secondary/20 p-8 rounded-[40px] flex-1">
                 <h3 className="text-xl font-serif font-bold mb-4 text-primary italic">Our Address</h3>
                 <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-accent shrink-0" />
                    <p className="text-primary/70 font-medium leading-relaxed">
                        Kila no. 37/3/1, Vill-Khijuri, Dharuhera, Rewari, Haryana, India-123106<br/>
                        India
                    </p>
                 </div>
                 
                 {/* Map Placeholder */}
                 <div className="mt-8 relative aspect-video rounded-3xl overflow-hidden shadow-soft border border-primary/5">
                    <iframe 
                      title="location-map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112123.63371900138!2d77.3001!3d28.6272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c3f1c74a!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1710921234567!5m2!1sen!2sin" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                    />
                 </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-16 rounded-[60px] border border-primary/5 shadow-soft h-full">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-12 italic">Send a Message</h2>
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-2">Full Name</label>
                    <input type="text" placeholder="Your Name" className="w-full bg-secondary/10 border-none rounded-3xl px-8 py-5 outline-none focus:bg-white focus:ring-4 ring-accent/5 transition-all font-medium text-primary text-sm shadow-soft" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-2">Email Address</label>
                    <input type="email" placeholder="Your Email" className="w-full bg-secondary/10 border-none rounded-3xl px-8 py-5 outline-none focus:bg-white focus:ring-4 ring-accent/5 transition-all font-medium text-primary text-sm shadow-soft" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-2">Your Message</label>
                  <textarea rows={6} placeholder="How can we help your snack cravings?" className="w-full bg-secondary/10 border-none rounded-[40px] px-8 py-6 outline-none focus:bg-white focus:ring-4 ring-accent/5 transition-all font-medium text-primary text-sm resize-none shadow-soft"></textarea>
                </div>
                <button className="w-full bg-accent text-white py-6 rounded-full font-black uppercase tracking-[0.4em] text-sm hover:scale-[1.02] transition-all shadow-2xl shadow-accent/20 active:scale-95 duration-300 cursor-pointer">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
