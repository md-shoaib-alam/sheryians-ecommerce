import LegalLayout from './LegalLayout'

const ShippingPolicy = () => (
  <LegalLayout title="Shipping Policy">
    <div className="space-y-12">
       <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-primary/40">Last Updated: 22 March 2026</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">Processing & Timelines</h2>
        <div className="space-y-4">
          <p><strong>Processing Time:</strong> Orders are typically processed within 2-3 business days. We strive to dispatch every order as quickly as possible, ensuring you receive the freshest batch of our flavoured makhana.</p>
          <p><strong>Delivery Estimates:</strong> Shipping times are estimates provided by our logistics partners and are not guaranteed. Typically, deliveries take 3-7 business days depending on your location within India.</p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">Shipping Charges</h2>
        <div className="p-6 bg-primary text-white rounded-3xl space-y-4 shadow-xl shadow-primary/20">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Orders above ₹499</span>
            <span className="font-bold text-lg">FREE SHIPPING</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Orders below ₹499</span>
            <span className="font-bold text-lg">₹49 Standard Fee</span>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">Shipping Terms</h2>
        <ul className="list-disc ml-6 space-y-4">
          <li><strong>Risk of Loss:</strong> All items purchased from shriyanslotusseeds.com are made pursuant to a shipment contract. Risk of loss and title pass to the customer upon successful delivery at the provided shipping address.</li>
          <li><strong>Fragility:</strong> Makhana is a delicate snack. We package it carefully using protective boxes and seals, but if the package arrives damaged, please follow our returns policy.</li>
          <li><strong>Address Accuracy:</strong> Please ensure all shipping information is correct. Any delays or loss caused by incorrect address information will be the responsibility of the customer.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">International Shipping</h2>
        <p>Currently, we exclusively ship within India. We do not provide international shipping services at this time, but we are working on expanding our reach.</p>
      </section>
    </div>
  </LegalLayout>
)

export default ShippingPolicy

