import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';
import { PageRoute } from '../types/ecommerce';

interface FAQPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Shipping & Delivery',
      q: 'How does carbon-neutral express delivery work?',
      a: 'All orders over $150 receive complimentary carbon-neutral courier delivery via DHL EcoFreight or FedEx Express. We offset 100% of transport emissions via certified reforestation programs. Orders dispatched before 2:00 PM PST ship the same business day.'
    },
    {
      category: 'Shipping & Delivery',
      q: 'Can I track my courier driver in real time?',
      a: 'Yes. Every Atelier order generates a live tracking telemetry dashboard with an interactive route map, courier name, plate number, and ETA countdown. You can access live tracking from your Order History or the top navigation bar at any time.'
    },
    {
      category: 'Returns & 30-Day Guarantee',
      q: 'What is your return and exchange policy?',
      a: 'We offer an unconditional 30-day trial window. If a garment or object does not meet your expectations, use the prepaid return label included inside your parcel box. Returns are inspected and refunded to your original payment method within 48 hours.'
    },
    {
      category: 'Returns & 30-Day Guarantee',
      q: 'Does Atelier offer repairs and warranty service?',
      a: 'All leather goods and cashmere knitwear include a 2-year craftsmanship warranty. Should stitching or hardware ever require attention, our San Francisco and Milan ateliers provide complimentary restoration.'
    },
    {
      category: 'Garment Care & Sizing',
      q: 'How should I wash and care for the Merino Cashmere knitwear?',
      a: 'We recommend gentle hand-washing in cool water using mild wool detergent or professional green dry cleaning. Reshape while damp and dry flat on a clean towel. Never tumble dry or hang on wire hangers.'
    },
    {
      category: 'Garment Care & Sizing',
      q: 'How does the vegetable-tanned French calfskin leather age?',
      a: 'Our leather is treated with natural organic tree barks and beeswax without plastic sealants. With regular use and natural hand oils, it will develop a deep amber honey patina unique to your journey.'
    },
    {
      category: 'Payments & Security',
      q: 'What payment options and security measures are supported?',
      a: 'We accept all major credit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and verified Cash on Delivery (COD). All credit transactions are secured with 256-bit TLS encryption, Level 1 PCI-DSS tokenization, and 3D Secure bank authorization.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 text-center space-y-2">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
          Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-display">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
          Everything you need to know regarding small-batch releases, courier telemetry, and garment preservation.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 transition-colors"
                aria-expanded={isOpen}
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-semibold block mb-1">
                    {faq.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900">
                    {faq.q}
                  </h3>
                </div>

                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 animate-in fade-in duration-200">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help callout */}
      <div className="p-8 rounded-3xl bg-stone-100 border border-stone-200 text-center space-y-4">
        <h3 className="text-base font-bold text-stone-900 font-display">Have a question not addressed here?</h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Our client concierge team is on standby to assist with bespoke inquiries, alterations, and corporate gifts.
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>Speak With Concierge</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
