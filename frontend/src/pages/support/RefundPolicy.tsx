import LegalLayout from './LegalLayout'

const RefundPolicy = () => (
  <LegalLayout title="Refunds and Cancellations">
    <section className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-primary italic">Cancellation Policy</h2>
      <p>You can cancel your order within 2 hours of placement or until it has been processed, whichever is earlier. Once shipped, orders cannot be cancelled.</p>
    </section>
    <section className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-primary italic">Refund Policy</h2>
      <p>Due to the perishable nature of our products, we do not offer returns. However, if you receive a damaged or incorrect product, please contact us within 24 hours of delivery with photos for a replacement or refund.</p>
    </section>
    <section className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-primary italic">Refund Process</h2>
      <p>Approved refunds will be processed back to the original payment method within 5-7 business days.</p>
    </section>
  </LegalLayout>
)

export default RefundPolicy
