import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api.ts';
import { generateGeneralWhatsAppUrl } from '../utils/formatters.ts';
import { SEO } from '../components/common/SEO.tsx';
import { SKBrandLogo } from '../components/common/SKBrandLogo.tsx';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await api.sendMessage(formData);
      if (res.success) {
        setSuccessMessage(res.message);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setErrorMessage(res.message || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] py-12 sm:py-20">
      <SEO
        title="Contact Concierge | SK Brand Sami Khan - Quetta"
        description="Connect with SK Brand Sami Khan (Liaqat Bazaar Quetta) concierge for bespoke Balochi dress sizing, bridal inquiries, and worldwide order assistance."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="flex justify-center mb-2">
            <SKBrandLogo size="lg" stacked={true} />
          </div>
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#F5B016] block">
            Client Concierge & Atelier Showroom
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-stone-950">
            Get in Touch With SK Brand Sami Khan
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Have inquiries regarding authentic hand-embroidered Balochi Doch dresses, custom sizing, wholesale orders, or international express dispatch? We are here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info & WhatsApp (Col 5) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
              <h3 className="font-display text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
                Concierge Information
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#F5B016] shrink-0 mt-1" />
                  <div>
                    <strong className="block text-stone-900 mb-0.5">Showroom & Atelier:</strong>
                    <span className="text-stone-600 leading-relaxed">
                      Bazaar, Liaqat Bazaar Naseem Fashion Mall Sk Brand, Shara Liaqat, Quetta, 87300, Pakistan
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#F5B016] shrink-0" />
                  <div>
                    <strong className="block text-stone-900 mb-0.5">Helpline Phone:</strong>
                    <span className="text-stone-600 font-mono">0314 0003801</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-[#F5B016] shrink-0" />
                  <div>
                    <strong className="block text-stone-900 mb-0.5">Official WhatsApp:</strong>
                    <span className="text-stone-600 font-mono">0316 0367456 (+92 316 0367456)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#F5B016] shrink-0" />
                  <div>
                    <strong className="block text-stone-900 mb-0.5">Email Support:</strong>
                    <span className="text-stone-600">samikhan@skbrand.pk</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Box */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">
                  Instant Stylist Consultation
                </span>
                <p className="text-xs text-stone-500">
                  Chat directly with Sami Khanâ€™s styling team in Quetta for size advice or bespoke Balochi embroidery orders.
                </p>
                <a
                  href={generateGeneralWhatsAppUrl('+923160367456')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  Chat on WhatsApp: 0316 0367456
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form (Col 7) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs">
              <h3 className="font-display text-xl font-bold text-stone-900 mb-4">
                Send Us a Message
              </h3>

              {successMessage && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Mariam Siddiqui"
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 0000000"
                      className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Message / Inquiry Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How may our concierge assist your styling needs?"
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-stone-900 hover:bg-black text-white font-semibold text-xs tracking-[0.2em] uppercase rounded transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F5B016]" />
                      Transmitting Inquiry...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Inquiry
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

