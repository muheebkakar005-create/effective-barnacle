import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, Globe, Heart, ArrowRight, MapPin, Phone, MessageCircle } from 'lucide-react';
import { SEO } from '../components/common/SEO.tsx';
import { SKBrandLogo } from '../components/common/SKBrandLogo.tsx';
import { generateGeneralWhatsAppUrl } from '../utils/formatters.ts';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFAF7] py-12 sm:py-20">
      <SEO
        title="About SK Brand Sami Khan | Handmade Balochi Dresses & Luxury Pret Atelier"
        description="Learn about Sami Khan, Liaqat Bazaar Quetta atelier, and the centuries of Balochi Doch hand-embroidery heritage behind SK Brands."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header with Official Brand Crest */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center mb-2">
            <SKBrandLogo size="2xl" stacked={true} />
          </div>
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#F5B016] block">
            The House of Sami Khan â€¢ Quetta Atelier
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-stone-950 leading-tight">
            Preserving Heirloom Balochi Needlecraft for the Modern World
          </h1>
          <div className="w-16 h-0.5 bg-[#F5B016] mx-auto mt-4" />
        </div>

        {/* Hero Imagery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 shadow-md relative group">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop"
              alt="SK Brand Sami Khan Quetta Atelier"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs">
              <span className="font-bold text-[#F5B016] block">Liaqat Bazaar Atelier, Quetta</span>
              <span className="text-stone-300 text-[11px]">Hand-selected pure fabrics & artisanal threadwork</span>
            </div>
          </div>
          <div className="aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 shadow-md relative group">
            <img
              src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=900&auto=format&fit=crop"
              alt="Artisanal Balochi Doch & Doz Embroidery"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs">
              <span className="font-bold text-[#F5B016] block">Heirloom Doch & Mirror-Work</span>
              <span className="text-stone-300 text-[11px]">Meticulous needlecraft passed across generations</span>
            </div>
          </div>
        </div>

        {/* Narrative */}
        <div className="prose prose-stone max-w-3xl mx-auto text-stone-700 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>SK Brand</strong> was founded by <strong>Sami Khan</strong> in the vibrant heart of Quetta, Balochistan, with an unwavering commitment to authentic craftsmanship. Located at <em>Naseem Fashion Mall, Liaqat Bazaar, Shara Liaqat</em>, our atelier is celebrated as a sanctuary of classical Pakistani needlecraftâ€”specializing in traditional hand-embroidered <strong>Balochi Doch (Doz)</strong>, exquisite mirror-work, and sophisticated machine embroidery suits.
          </p>

          <p>
            Each authentic Balochi dress requires up to weeks of meticulous labor by master women artisans. Geometric patterns, silk resham threading, pocket embroidery (pandol), and collar embellishments are stitched completely by hand onto premium grip silks, fine lawn, organza, and micro velvet.
          </p>

          <h3 className="font-display text-2xl text-stone-950 pt-4">
            From Quetta to London, New York & Dubai
          </h3>

          <p>
            Under Sami Khanâ€™s leadership, SK Brand has expanded from a beloved local fashion destination into an international brand. Today, our creations are proudly worn across the United Kingdom, United States, Canada, Europe, Australia, and the Gulf States. Every piece ordered through our digital store is rigorously checked for textile authenticity, pressed, and dispatched with express DHL courier tracking.
          </p>
        </div>

        {/* Atelier Info Box */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-[#F5B016]" />
            <h3 className="font-display text-lg font-bold text-stone-900">
              Official Showroom & Workshop
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
            <div>
              <strong className="block text-stone-900 mb-1">Address:</strong>
              <span>Bazaar, Liaqat Bazaar Naseem Fashion Mall Sk Brand, Shara Liaqat, Quetta, 87300, Pakistan</span>
            </div>
            <div>
              <strong className="block text-stone-900 mb-1">Direct Contacts:</strong>
              <span>Phone: 0314 0003801</span><br />
              <span>WhatsApp: 0316 0367456</span><br />
              <span>Email: samikhan@skbrand.pk</span>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-stone-200">
          <div className="bg-white p-6 rounded-lg border border-stone-200 text-center space-y-2">
            <Award className="w-6 h-6 text-[#F5B016] mx-auto" />
            <h4 className="font-display text-base font-bold text-stone-900">Authentic Balochi Doch</h4>
            <p className="text-xs text-stone-500">True heirloom hand-needlecraft preserved with heritage pride.</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-stone-200 text-center space-y-2">
            <Globe className="w-6 h-6 text-[#F5B016] mx-auto" />
            <h4 className="font-display text-base font-bold text-stone-900">Worldwide Shipping</h4>
            <p className="text-xs text-stone-500">Fast DHL & express courier deliveries to UK, USA, Gulf & beyond.</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-stone-200 text-center space-y-2">
            <Heart className="w-6 h-6 text-[#F5B016] mx-auto" />
            <h4 className="font-display text-base font-bold text-stone-900">Sami Khan Concierge</h4>
            <p className="text-xs text-stone-500">Direct WhatsApp assistance for custom sizing and bridal orders.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-[0.2em] rounded shadow"
          >
            Explore Balochi & Pret Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={generateGeneralWhatsAppUrl('+923160367456')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-semibold uppercase tracking-[0.2em] rounded shadow"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            WhatsApp Sami Khan
          </a>
        </div>
      </div>
    </div>
  );
};

