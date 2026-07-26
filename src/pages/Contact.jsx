import React, { useState } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { businessConfig } from '../config/businessConfig';
import { buildWhatsAppInquiryUrl } from '../utils/whatsapp';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../components/common/SocialIcons';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Product Inquiry',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const waUrl = buildWhatsAppInquiryUrl(formData.subject, formData);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="bg-[#FFFBF5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Contact Us' }]} />

        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E3718]">
            We'd Love to Hear From You
          </h1>
          <p className="text-xs sm:text-sm text-[#777166] mt-2">
            Have a question about product spice levels, bulk ordering, or delivery? Message us directly on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Direct Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFBF5] rounded-2xl p-6 sm:p-8 border border-[#E8DDCF] shadow-xs space-y-6">
              <h3 className="font-serif font-bold text-xl text-[#5E3718]">
                Direct Business Contacts
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-[#777166]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#9A6428] text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#171717] text-sm">Store & Factory Address</h4>
                    <p className="mt-0.5 leading-relaxed">{businessConfig.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#9A6428] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#171717] text-sm">Phone / WhatsApp Support</h4>
                    <a
                      href={`tel:${businessConfig.phoneNumber}`}
                      className="mt-0.5 block hover:text-[#9A6428] font-semibold text-[#171717]"
                    >
                      {businessConfig.displayWhatsApp}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#9A6428] text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#171717] text-sm">Email Address</h4>
                    <a
                      href={`mailto:${businessConfig.email}`}
                      className="mt-0.5 block hover:text-[#9A6428] font-semibold text-[#171717]"
                    >
                      {businessConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#9A6428] text-white flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#171717] text-sm">Business Working Hours</h4>
                    <p className="mt-0.5">{businessConfig.businessHours}</p>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Chat Banner */}
              <div className="pt-4 border-t border-[#E8DDCF]">
                <a
                  href={businessConfig.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Start Instant WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[#5E3718] text-white rounded-2xl p-6 border border-[#E8DDCF] flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-base text-[#F9EFDD]">Follow Us Online</h4>
                <p className="text-xs text-[#F9EFDD]/80">Get recipe updates & festive offers</p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={businessConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#9A6428] transition-colors"
                >
                  <InstagramIcon className="w-4 h-4 text-white" />
                </a>
                <a
                  href={businessConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#9A6428] transition-colors"
                >
                  <FacebookIcon className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-[#FFFBF5] rounded-2xl p-6 sm:p-8 border border-[#E8DDCF] shadow-xs">
            <h3 className="font-serif font-bold text-xl text-[#5E3718] mb-1">
              Send Us a Message
            </h3>
            <p className="text-xs text-[#777166] mb-6">
              Submitting will open WhatsApp with your pre-filled inquiry details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E8DDCF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9A6428] text-[#171717]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E8DDCF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9A6428] text-[#171717]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E8DDCF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9A6428] text-[#171717]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Inquiry Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E8DDCF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9A6428] text-[#171717]"
                  >
                    <option value="General Product Inquiry">General Product Inquiry</option>
                    <option value="Bulk Order Request">Bulk Order & Festival Hamper Request</option>
                    <option value="Delivery & Order Tracking">Delivery & Order Tracking</option>
                    <option value="Distributorship Inquiry">Distributorship Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Your Message / Query *</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what products you are interested in..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8DDCF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9A6428] text-[#171717]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-lg bg-[#9A6428] hover:bg-[#80511D] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Send className="w-4 h-4 text-[#F9EFDD]" />
                <span>Submit Inquiry via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
