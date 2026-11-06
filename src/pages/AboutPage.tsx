import React from 'react';
import { ArrowRight, ShieldCheck, Heart, Award, Sparkles, Compass } from 'lucide-react';
import { PageRoute } from '../types/ecommerce';
import { HERO_IMAGE } from '../data/products';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      
      {/* Hero Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
            The Atelier Monograph
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-display leading-tight">
            Patience Over Novelty. Pure Fibers Over Plastics.
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Atelier was established with a singular conviction: the modern consumer deserves garments and objects that outlive fleeting marketing cycles. We design with architectural restraint, partnering directly with generational master artisans in Italy, Scotland, and Japan.
          </p>
        </div>
      </section>

      {/* Hero Visual */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-xl">
          <img
            src={HERO_IMAGE}
            alt="Atelier Studio Craftsmen"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white text-xs font-mono">
            Atelier Studio 04 · Generational Weaving Mill, Biella, Italy
          </div>
        </div>
      </section>

      {/* 3 Pillars of Craftsmanship */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-stone-200 space-y-4 shadow-xs">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 font-bold">PILLAR 01</span>
            <h3 className="text-xl font-bold text-stone-900 font-display">Traceable Origin</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every yard of Mongolian cashmere and Australian merino wool is batch-inspected for fiber diameter (&lt;15.5 microns). We publish the exact source mill on each product tag.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-stone-200 space-y-4 shadow-xs">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 font-bold">PILLAR 02</span>
            <h3 className="text-xl font-bold text-stone-900 font-display">Slow Botanical Tanning</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our leather workshop outside Florence utilizes crushed chestnut wood and mimosa bark. We produce zero chromium runoff, creating hides that patina with warmth.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-stone-200 space-y-4 shadow-xs">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 font-bold">PILLAR 03</span>
            <h3 className="text-xl font-bold text-stone-900 font-display">Zero Distributor Markups</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Traditional luxury brands mark up goods by 8x to pay for lavish department store concessions. By operating directly online, we offer Grade-A materials at honest pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Master Workshop Locations */}
      <section className="bg-stone-100 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Global Artisans</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
              Where Our Objects Are Born
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-stone-600">
            <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-900 text-sm">Biella, Piedmont, Italy</h4>
              <p className="text-stone-500">Fine Worsted Wool & Cashmere Spinning</p>
              <p className="text-[11px] leading-relaxed pt-2 border-t border-stone-100">
                Pure alpine snowmelt water is utilized to wash raw fleeces, preserving natural lanolin softness without harsh detergents.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-900 text-sm">Santa Croce sull'Arno, Tuscany</h4>
              <p className="text-stone-500">Vegetable-Tanned French Calfskin</p>
              <p className="text-[11px] leading-relaxed pt-2 border-t border-stone-100">
                Master tanners employ wooden drumming vats operating continuously since 1952. Hand-edged with beeswax.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-900 text-sm">Kyoto, Kansai, Japan</h4>
              <p className="text-stone-500">Wheel-Thrown Terracotta & Bronze</p>
              <p className="text-[11px] leading-relaxed pt-2 border-t border-stone-100">
                Hand-formed red clay fired in small wood kilns. Natural porous mineral finishes that elevate morning coffee rituals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
          Experience the Collection Firsthand
        </h3>
        <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto">
          Every order arrives in archival unbleached cotton dust bags with traceable artisan batch cards and complimentary express delivery.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 bg-stone-900 text-white rounded-full text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer shadow-md"
        >
          Explore All Products
        </button>
      </section>

    </div>
  );
};
