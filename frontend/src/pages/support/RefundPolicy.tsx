import LegalLayout from './LegalLayout'

const RefundPolicy = () => (
  <LegalLayout title="Refunds and Cancellations">
    <div className="space-y-12">
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-primary/40">Last Updated: 22 March 2026</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">Return Overview</h2>
        <p>Due to the nature of food products, our return policy is strict to ensure customer safety and hygiene. We maintain high standards of quality control to ensure every packet of makhana reaches you in perfect condition.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">Eligibility for Returns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-3">
             <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-bold">✓</div>
             <h3 className="font-bold text-primary">Unopened Products</h3>
             <p className="text-sm">You may return unopened packages within 10 days of delivery for a full refund or exchange, provided the seal is intact and the product is within its shelf life.</p>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-3 opacity-60">
             <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold">✕</div>
             <h3 className="font-bold text-primary">Opened Products</h3>
             <p className="text-sm">For hygiene and safety reasons, we cannot accept returns on opened or partially consumed food products.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">Damaged/Wrong Items</h2>
        <div className="bg-primary/5 border-l-4 border-accent p-6 rounded-r-3xl space-y-4">
          <p>If you receive a damaged product or the wrong flavor, please follow these steps:</p>
          <ul className="list-decimal ml-6 space-y-2 font-medium">
            <li>Contact us at <strong>shriyanskris12@gmail.com</strong> within 48 hours of delivery.</li>
            <li>Attach clear photos of the damage or the incorrect label.</li>
            <li>Keep the original packaging for verification.</li>
          </ul>
          <p className="text-sm italic">We will arrange a replacement or refund upon validation. This policy does not limit your rights under applicable Indian consumer laws.</p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">Cancellation Policy</h2>
        <ul className="list-disc ml-6 space-y-4">
          <li><strong>Before Dispatch:</strong> Orders may be cancelled by the customer only before they are dispatched for a full refund.</li>
          <li><strong>How to Cancel:</strong> To request a cancellation, customers must contact us at our support email or phone number (+91 80946 56597).</li>
          <li><strong>After Dispatch:</strong> Once an order has been processed and dispatched, it cannot be cancelled.</li>
          <li><strong>Company Right:</strong> We reserve the right to cancel any order due to product unavailability, pricing errors, or suspicion of fraudulent activity.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">Refund Process</h2>
        <div className="bg-gray-50 p-8 rounded-3xl space-y-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Refund Timeline</p>
              <p className="text-2xl font-bold text-primary tabular-nums">5–7 Business Days</p>
            </div>
            <div className="h-px w-full md:w-px md:h-12 bg-gray-200"></div>
            <div className="space-y-2 text-center md:text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Approval Period</p>
              <p className="text-2xl font-bold text-primary">24–48 Hours</p>
            </div>
          </div>
          <p className="text-sm text-center md:text-left border-t border-gray-200 pt-6">Approved refunds will be processed back to the original payment method. Please note that banks may take additional time to reflect the credit.</p>
        </div>
      </section>
    </div>
  </LegalLayout>
)

export default RefundPolicy

