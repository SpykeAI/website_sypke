import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to automate your calls and scale your business? Get in touch with our team today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-heading">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#00DF81]/10 rounded-full flex items-center justify-center shrink-0 mr-6">
                  <Mail className="w-6 h-6 text-[#00DF81]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Email Us</h3>
                  <p className="text-gray-600">contact@spykeai.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#00DF81]/10 rounded-full flex items-center justify-center shrink-0 mr-6">
                  <MessageSquare className="w-6 h-6 text-[#00DF81]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">WhatsApp</h3>
                  <a href="http://wa.link/18sxk1" target="_blank" className="text-[#00DF81] font-bold hover:underline">
                    Click to Chat with Us
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#00DF81]/10 rounded-full flex items-center justify-center shrink-0 mr-6">
                  <MapPin className="w-6 h-6 text-[#00DF81]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">Hyderabad, Telangana, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-10 rounded-3xl border border-gray-200 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Send us a message</h2>
            <form action="https://formsubmit.co/Contact@spykeai.com" method="POST" className="space-y-6">
              {/* FormSubmit Configuration */}
              <input type="hidden" name="_subject" value="New message from SpykeAI Contact Page!" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input type="text" name="First Name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input type="text" name="Last Name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" name="Email" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea name="Message" required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00DF81] focus:border-transparent outline-none bg-white text-gray-900 resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full bg-[#00DF81] text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-[#00c271] transition shadow-lg">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
