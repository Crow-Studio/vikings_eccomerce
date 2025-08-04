
import Head from 'next/head';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms and Conditions - Vikings Kenya Power Traders</title>
        <meta name="description" content="Terms and conditions for Vikings Kenya Power Traders - Kenya's trusted source for professional tools and equipment." />
      </Head>
      
      <div className="min-h-screen bg-white text-black">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-black">Terms and Conditions</h1>
            <p className="text-gray-600">Vikings Kenya Power Traders</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black border-b-2 border-gray-200 pb-2">1. Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the services of Vikings Kenya Power Traders, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black border-b-2 border-gray-200 pb-2">2. Products and Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vikings Kenya Power Traders specializes in providing:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Quality domestic tools and equipment</li>
                <li>Professional equipment for various industries</li>
                <li>Agricultural implements and machinery</li>
                <li>Repair and maintenance services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black border-b-2 border-gray-200 pb-2">3. Quality Guarantee</h2>
              <p className="text-gray-700 leading-relaxed">
                We guarantee the quality of all our products. All items sold come with manufacturer warranties where applicable. 
                Defective products will be replaced or repaired at no additional cost within the warranty period, subject to terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black border-b-2 border-gray-200 pb-2">4. Delivery Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer fast delivery services across Nairobi and countrywide:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Nairobi deliveries: 1-2 business days</li>
                <li>Countrywide deliveries: 2-5 business days</li>
                <li>Delivery charges apply based on location and product weight</li>
                <li>Free delivery for orders above a specified minimum amount</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black border-b-2 border-gray-200 pb-2">5. Payment Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                Payment is required at the time of purchase unless credit terms have been specifically arranged. 
                We accept cash, mobile money (M-Pesa), bank transfers, and major credit cards. 
                All prices are quoted in Kenya Shillings and are subject to change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black border-b-2 border-gray-200 pb-2">6. Returns and Exchanges</h2>
              <p className="text-gray-700 leading-relaxed">
                Returns and exchanges are accepted within 14 days of purchase for unused items in original packaging. 
                Customer is responsible for return shipping costs unless the item is defective. 
                Custom or specially ordered items cannot be returned unless defective.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black border-b-2 border-gray-200 pb-2">7. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                Vikings Kenya Power Traders shall not be liable for any indirect, incidental, special, or consequential damages 
                resulting from the use or inability to use our products or services, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black border-b-2 border-gray-200 pb-2">8. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of Kenya. 
                Any disputes arising under these terms shall be subject to the jurisdiction of Kenyan courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black border-b-2 border-gray-200 pb-2">9. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms and Conditions, please contact Vikings Kenya Power Traders through our official channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}