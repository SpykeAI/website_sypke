export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 py-20 border-b border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">Refund Policy</h1>
          <p className="text-gray-500 font-medium">Last updated: August 2026</p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto prose prose-lg prose-green py-20 px-4 sm:px-6 lg:px-8">
        
        <div className="space-y-6 text-gray-600">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Subscription Refunds</h2>
          <p>At Spyke AI Technologies, we strive to ensure our AI Voice Agents deliver exceptional value to your business. If you are not satisfied with your subscription, you may request a cancellation at any time.</p>
          <p>Because our services involve immediate infrastructure allocation and telecom costs, we do not offer prorated refunds for mid-billing cycle cancellations. Your service will remain active until the end of your current billing period.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Setup Fees</h2>
          <p>Any custom development, CRM integration, or one-time setup fees are non-refundable once the onboarding process has begun, as these cover the manual labor and engineering resources provided by our team.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Exceptions</h2>
          <p>In the rare event of prolonged service outages or failure to deliver agreed-upon core functionality within the first 14 days, we will review refund requests on a case-by-case basis. Please contact our support team to initiate a review.</p>
        </div>
      </div>
    </div>
  );
}
