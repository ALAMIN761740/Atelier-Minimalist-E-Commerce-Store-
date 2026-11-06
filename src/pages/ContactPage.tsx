import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageRoute } from '../types/ecommerce';

interface ContactPageProps {
  onNavigate: (page: PageRoute) => void;
  onSubmitMessage: (msg: { name: string; email: string; subject: string; message: string }) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onSubmitMessage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill out all required fields.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    onSubmitMessage({
      name: name.trim(),
      email: email.trim(),
      subject,
      message: message.trim()
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 max-w-2xl">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
          Concierge & Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-display mt-1">
          Contact the Atelier
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
          Whether you need bespoke sizing guidance, leather restoration advice, or private showroom appointments, our client team responds within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-stone-900 font-display">
            Send an Inquiry
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Message Received by Client Concierge</span>
              </div>
              <p className="leading-relaxed">
                Thank you for contacting Atelier. One of our master stylists will review your inquiry and reply via email within one business day.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs text-emerald-900 font-semibold underline cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Rostova"
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena@example.com"
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-stone-900 cursor-pointer"
                >
                  <option value="Product Inquiry">Product Inquiry & Sizing</option>
                  <option value="Order Tracking">Order Tracking & Shipping Status</option>
                  <option value="Returns & Exchanges">Returns & Warranty Exchanges</option>
                  <option value="Press & Showrooms">Press & Private Showroom Appointment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How may our concierge team assist you today?"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-stone-900 leading-relaxed"
                />
              </div>

              {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-all cursor-pointer shadow-sm"
              >
                Dispatch Message to Atelier
              </button>
            </form>
          )}
        </div>

        {/* Right Info: Showrooms & Hotlines */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-stone-200 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 font-display">
              San Francisco Flagship Studio
            </h3>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <span>450 Townsend St, Suite 3B, San Francisco, CA 94107</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-stone-900 shrink-0" />
                <span>+1 (415) 890-4211</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-stone-900 shrink-0" />
                <span>concierge@atelier-store.com</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <p>Monday – Friday: 9:00 AM – 6:00 PM PST</p>
                  <p className="text-stone-400">Saturday: By private appointment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 font-display">
              Milan Showroom & Atelier Archive
            </h3>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <span>Via Monte Napoleone 18, 20121 Milano MI, Italy</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-stone-900 shrink-0" />
                <span>+39 02 8901 4429</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <p>Tuesday – Saturday: 10:00 AM – 7:00 PM CET</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <span>Looking for answers to common questions?</span>
            <button
              onClick={() => onNavigate('faq')}
              className="text-stone-900 font-bold underline cursor-pointer"
            >
              Read FAQ →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
