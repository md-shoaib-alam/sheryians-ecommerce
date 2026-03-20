import LegalLayout from './LegalLayout'

const Terms = () => (
  <LegalLayout title="Terms and Conditions">
    <section className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-primary italic">1. Acceptance of Terms</h2>
      <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
    </section>
    <section className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-primary italic">2. Use License</h2>
      <p>Permission is granted to temporarily download one copy of the materials (information or software) on Shriyans's website for personal, non-commercial transitory viewing only.</p>
    </section>
    <section className="space-y-4">
      <h2 className="text-2xl font-serif font-bold text-primary italic">3. Disclaimer</h2>
      <p>The materials on Shriyans's website are provided on an 'as is' basis. Shriyans makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
    </section>
  </LegalLayout>
)

export default Terms
