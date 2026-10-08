import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Globe, Award, ChevronRight } from 'lucide-react';
import { Product, Category } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ProductCard } from '../components/product/ProductCard.tsx';
import { QuickViewModal } from '../components/product/QuickViewModal.tsx';
import { SEO } from '../components/common/SEO.tsx';
import { SKBrandLogo } from '../components/common/SKBrandLogo.tsx';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'formal' | 'casual' | 'party'>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({ limit: 12 }),
          api.getCategories()
        ]);

        if (prodRes.success) {
          setFeaturedProducts(prodRes.products.slice(0, 8));
          setBestSellers(prodRes.products.slice(4, 12));
        }

        if (catRes.success) {
          setCategories(catRes.categories);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const filterTabProducts = () => {
    if (activeTab === 'all') return featuredProducts;
    if (activeTab === 'formal') return featuredProducts.filter(p => p.category === 'formal-wear');
    if (activeTab === 'casual') return featuredProducts.filter(p => p.category === 'casual-wear');
    if (activeTab === 'party') return featuredProducts.filter(p => p.category === 'party-wear');
    return featuredProducts;
  };

  const fabrics = [
    { name: 'Chiffon', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop', desc: 'Diaphanous & Graceful' },
    { name: 'Lawn', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop', desc: 'Breathable 80/80 Cotton' },
    { name: 'Organza', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=600&auto=format&fit=crop', desc: 'Structured Radiance' },
    { name: 'Silk', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop', desc: 'Pure Korean Raw Silk' },
    { name: 'Velvet', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop', desc: '9000 Micro Velvet' },
    { name: 'Cotton', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop', desc: 'Everyday Luxury' }
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      <SEO
        title="SK Brands | Luxury Pakistani Fashion, Pret & Embroidered Suits"
        description="Shop signature 3-piece embroidered chiffon, festive lawn, organza, silk, and bridal couture from SK Brands. Worldwide shipping available."
      />

      {/* 1. Hero Section */}
      <section className="relative h-[82vh] min-h-[580px] max-h-[820px] w-full flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2000&auto=format&fit=crop"
            alt="SK Brands Luxury Pakistani Fashion"
            className="w-full h-full object-cover object-center opacity-70 filter brightness-90 transform scale-102 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] tracking-[0.3em] uppercase text-[#F5B016] border border-white/20 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Autumn / Festive Couture 2026
          </span>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-tight uppercase">
            TIMELESS STYLE. <br />
            <span className="italic font-normal text-[#F4ECE1]">MODERN ELEGANCE.</span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-stone-200 font-light tracking-wide leading-relaxed">
            Discover carefully selected fashion designed for every occasion. Masterfully embroidered silhouettes woven for discerning women worldwide.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-stone-900 hover:bg-[#F3EFEA] text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-lg rounded"
            >
              SHOP COLLECTION
            </Link>
            <Link
              to="/shop?category=new-arrivals"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white hover:bg-white/10 border border-white/80 text-xs tracking-[0.2em] uppercase font-bold transition-all rounded backdrop-blur-xs"
            >
              NEW ARRIVALS
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-y border-stone-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-2">
              <Globe className="w-5 h-5 text-[#F5B016] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Worldwide Shipping</h4>
              <p className="text-[11px] text-stone-500">Express courier delivery to UK, USA, UAE & beyond</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <Award className="w-5 h-5 text-[#F5B016] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Artisan Craftsmanship</h4>
              <p className="text-[11px] text-stone-500">Authentic hand embroidery, zardozi & fine fabrics</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <Shield className="w-5 h-5 text-[#F5B016] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Secure Order Process</h4>
              <p className="text-[11px] text-stone-500">Bank transfer verification & WhatsApp concierge</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <Sparkles className="w-5 h-5 text-[#F5B016] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Styling Consultation</h4>
              <p className="text-[11px] text-stone-500">Custom size advice via 1-on-1 stylist chat</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Collections Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#F5B016] uppercase block mb-1">
            Curated Categories
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
            Featured Collections
          </h2>
          <div className="w-12 h-0.5 bg-[#F5B016] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'NEW ARRIVALS',
              sub: 'Seasonal Highlights',
              link: '/shop?category=new-arrivals',
              img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop'
            },
            {
              title: 'FORMAL WEAR',
              sub: 'Wedding & Evening Couture',
              link: '/shop?category=formal-wear',
              img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop'
            },
            {
              title: 'CASUAL WEAR',
              sub: 'Festive Everyday Lawn',
              link: '/shop?category=casual-wear',
              img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'
            },
            {
              title: 'PARTY WEAR',
              sub: 'Embroidered Ensembles',
              link: '/shop?category=party-wear',
              img: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop'
            }
          ].map((col) => (
            <Link
              key={col.title}
              to={col.link}
              className="group relative h-96 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={col.img}
                alt={col.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 inset-x-6 text-white text-center">
                <span className="text-[10px] tracking-[0.2em] text-[#F5B016] uppercase font-semibold block mb-1">
                  {col.sub}
                </span>
                <h3 className="font-display text-xl font-bold tracking-wider mb-3">
                  {col.title}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase font-semibold text-white/90 group-hover:text-[#F5B016] transition-colors border-b border-white/40 pb-0.5">
                  Explore Collection
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Grid (8 products with tabs) */}
      <section className="bg-stone-50 py-16 sm:py-24 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] text-[#F5B016] uppercase block mb-1">
                Handcrafted Pret
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
                Featured Products
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-medium">
              {[
                { id: 'all', label: 'All Picks' },
                { id: 'formal', label: 'Formal Wear' },
                { id: 'casual', label: 'Casual Lawn' },
                { id: 'party', label: 'Party Ensembles' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-stone-900 text-white font-semibold shadow-xs'
                      : 'bg-white text-stone-600 hover:text-black hover:bg-stone-200/60 border border-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid: 4 per row desktop, 3 tablet, 2 mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filterTabProducts().map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 hover:bg-black text-white text-xs tracking-[0.2em] uppercase font-bold rounded shadow transition-all hover:scale-102"
            >
              View Full Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Shop by Fabric Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#F5B016] uppercase block mb-1">
            Artisanal Weaves
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
            Shop By Fabric
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            Each textile selected for superior drape, breathability, and rich embroidery retention.
          </p>
          <div className="w-12 h-0.5 bg-[#F5B016] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {fabrics.map((fabric) => (
            <Link
              key={fabric.name}
              to={`/shop?fabric=${fabric.name}`}
              className="group flex flex-col items-center bg-white p-3 rounded-lg border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all text-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-stone-100 group-hover:border-[#F5B016] transition-colors">
                <img
                  src={fabric.image}
                  alt={fabric.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="font-display text-base font-bold text-stone-900 group-hover:text-[#F5B016] transition-colors">
                {fabric.name}
              </h4>
              <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                {fabric.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Promotional Banner */}
      <section className="relative py-24 bg-stone-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1800&auto=format&fit=crop"
            alt="Editorial Pret Banner"
            className="w-full h-full object-cover object-center opacity-40 filter brightness-90"
          />
          <div className="absolute inset-0 bg-stone-950/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#F5B016] block">
            Signature Pret & Bridal Line
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-light tracking-wide uppercase leading-tight">
            "YOUR STYLE. YOUR STATEMENT."
          </h2>
          <p className="max-w-lg mx-auto text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
            Crafted with passion in Lahore, Pakistan. Tailored with meticulous needlework, delicate scallop lace trims, and regal organza dupattas.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F5B016] hover:bg-[#E5A00D] text-black text-xs tracking-[0.2em] uppercase font-bold rounded shadow transition-all hover:scale-102"
            >
              SHOP NOW
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Best Sellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] text-[#F5B016] uppercase block mb-1">
              Customer Favorites
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/shop?sort=best-selling"
            className="text-xs font-semibold tracking-wider text-[#F5B016] hover:text-black uppercase flex items-center gap-1 transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 7. Brand Story Section */}
      <section className="bg-white py-16 sm:py-24 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <SKBrandLogo size="md" showText={true} />
              </div>
              <span className="text-xs font-semibold tracking-[0.25em] text-[#F5B016] uppercase block">
                Artisan Heritage â€¢ Liaqat Bazaar Quetta
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-stone-950 font-normal leading-tight">
                Authentic Balochi Doch Needlecraft Curated by Sami Khan
              </h2>
              <div className="w-12 h-0.5 bg-[#F5B016]" />
              <p className="text-stone-600 text-sm leading-relaxed">
                Founded in Quetta by <strong>Sami Khan</strong>, SK Brand preserves centuries of heirloom needlecraft. Located at Naseem Fashion Mall, Liaqat Bazaar, our atelier specializes in hand-embroidered <strong>Balochi Doch (Doz)</strong> dresses, mirror embellishments, and luxury machine embroidery suits tailored on fine grip silk, festive lawn, and micro velvet.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                Whether shopping for a signature traditional Balochi ensemble or contemporary seasonal pret, every garment is crafted with timeless devotion and delivered with express DHL courier tracking to London, Manchester, New York, Toronto, and worldwide.
              </p>
              <div className="pt-2 flex items-center gap-4 flex-wrap">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-stone-900 hover:text-[#F5B016] transition-colors border-b-2 border-stone-900 pb-1"
                >
                  Read Our Heritage Story
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/shop?category=balochi-dress"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-[#F5B016] hover:text-black transition-colors border-b-2 border-[#F5B016] pb-1"
                >
                  View Balochi Dresses
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
                alt="Pakistani Craftsmanship"
                className="w-full h-72 sm:h-80 object-cover rounded-lg shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop"
                alt="Embroidery Needlework"
                className="w-full h-72 sm:h-80 object-cover rounded-lg shadow-md mt-6"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

