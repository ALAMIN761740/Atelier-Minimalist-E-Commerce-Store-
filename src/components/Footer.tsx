import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, RefreshCw, Truck, Heart, Lock } from 'lucide-react';
import { PageRoute } from '../types/ecommerce';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  onSelectCategory: (cat: string) => void;
  onSubscribeNewsletter: (email: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectCategory,
  onSubscribeNewsletter
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    onSubscribeNewsletter(email.trim());
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-24 md:pb-16 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          <div className="lg:col-span-5 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold text-white uppercase font-display tracking-tight text-left cursor-pointer"
            >
              ATELIER
            </button>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Architectural restraint, pure fibers, and full-grain leathers crafted across generational workshops in Tuscany, Biella, and Kyoto.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-stone-500 font-mono">
              <span>EST. 2024</span>
              <span>·</span>
              <span>SAN FRANCISCO & MILAN</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-sm font-semibold text-white font-display">
              The Atelier Journal & Private Previews
            </h4>
            <p className="text-xs text-stone-400">
              Receive seasonal lookbooks, garment care monographs, and invitations to small-batch workshop releases.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-2.5 bg-stone-800/80 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-white text-stone-900 font-semibold rounded-xl text-xs hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>{subscribed ? 'Subscribed ✓' : 'Subscribe'}</span>
                {!subscribed && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>
        </div>

        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-stone-800">
          {/* Column 1: Storefront */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider mb-3 text-[11px]">
              Storefront
            </h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Featured Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Apparel');
                    onNavigate('shop');
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Knitwear & Trousers
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Accessories');
                    onNavigate('shop');
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Tuscan Leather Bags
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Footwear');
                    onNavigate('shop');
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Strobel Sneakers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Account */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider mb-3 text-[11px]">
              Client Concierge
            </h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  My Atelier Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('orders')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Order History & Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wishlist')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cart')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Shopping Bag
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sign In / Register
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: The Atelier Heritage */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider mb-3 text-[11px]">
              Heritage & Ethos
            </h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About the Atelier
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Studio Showrooms
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  FAQ & Care Guides
                </button>
              </li>
              <li>
                <span className="text-stone-500">Traceable Materials</span>
              </li>
              <li>
                <span className="text-stone-500">Carbon-Neutral Delivery</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Security & Assurance */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider mb-3 text-[11px]">
              Commercial Assurance
            </h5>
            <p className="text-stone-400 leading-relaxed text-[11px] mb-3">
              Protected by 256-bit TLS encryption. Level 1 PCI-DSS compliant checkout with 3D Secure bank authorization.
            </p>
            <div className="space-y-2 text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-400" />
                <span>Complimentary Delivery &gt; $150</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                <span>30-Day Prepaid Returns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                <span>2-Year Craftsmanship Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Atelier Minimalist Storefront. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('faq')} className="hover:text-stone-300 cursor-pointer">
              Shipping Policy
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('faq')} className="hover:text-stone-300 cursor-pointer">
              Privacy Notice
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('faq')} className="hover:text-stone-300 cursor-pointer">
              Terms of Purchase
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
