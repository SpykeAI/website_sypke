import { Mail, Phone, MapPin, MessageSquare, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import CalEmbed from "@/components/CalEmbed";

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
            <ContactForm />
          </div>
        </div>

        {/* Schedule a Meeting Section */}
        <div className="mt-24 pt-16 border-t border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Schedule a Meeting</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pick a time that works for you. Availability is automatically adjusted to your time zone to prevent any double-bookings.
            </p>
          </div>
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <CalEmbed link="spykeai-technologies/30min" />
          </div>
        </div>

      </div>
    </div>
  );
}
