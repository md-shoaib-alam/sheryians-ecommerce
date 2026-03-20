import LegalLayout from './LegalLayout'

const ShippingPolicy = () => (
  <LegalLayout title="Shipping Policy">
    <section className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-primary italic">Delivery Timelines</h2>
      <p>Orders are typically processed within 1-2 business days. Shipping usually takes 3-7 business days depending on your location within India.</p>
    </section>
    <section className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-primary italic">Shipping Charges</h2>
      <p>Standard shipping is free for orders above ₹499. For orders below this amount, a flat shipping fee of ₹49 applies.</p>
    </section>
    <section className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-primary italic">Tracking</h2>
      <p>Once your order is shipped, you will receive a tracking number via email to monitor your package's progress.</p>
    </section>
  </LegalLayout>
)

export default ShippingPolicy
