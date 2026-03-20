import LegalLayout from './LegalLayout'

const Privacy = () => (
  <LegalLayout title="Privacy Policy">
    <section className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-primary italic">Information Collection</h2>
      <p>We collect information from you when you register on our site, place an order, subscribe to our newsletter or fill out a form.</p>
    </section>
    <section className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-primary italic">Information Protection</h2>
      <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
    </section>
    <section className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-primary italic">Cookies</h2>
      <p>Yes, we use cookies to help us remember and process the items in your shopping cart and understand and save your preferences for future visits.</p>
    </section>
  </LegalLayout>
)

export default Privacy
