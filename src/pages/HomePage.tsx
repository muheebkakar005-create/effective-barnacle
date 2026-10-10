import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Globe, Award, ChevronRight, MessageCircle, Ruler, Scissors, Truck } from 'lucide-react';
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

  const categoryCards = [
    {
      title: 'New Arrivals',
      sub: 'Latest 2026 Drops',
      link: '/shop?category=new-arrivals',
      img: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Balochi Dresses',
      sub: 'Hand-Made Doch Pieces',
      link: '/shop?category=balochi-dress',
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Bridal Balochi',
      sub: 'Regal Trousseau Ensembles',
      link: '/shop?category=bridal-couture',
      img: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Party Wear',
      sub: 'Embroidered Velvet & Silk',
      link: '/shop?category=party-wear',
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Casual Balochi',
      sub: 'Pure Lawn & Cotton Pret',
      link: '/shop?category=casual-wear',
      img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Sale / Last Chance',
      sub: 'Up to 30% Off Clearance',
      link: '/shop?category=sale',
      img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EE] font-body text-[#3D3D3D]">
      <SEO
        title="SK Brand Sami Khan | Hand-Made Balochi Dresses & Luxury Pakistani Couture"
        description="Shop authentic hand-made Balochi Doch dresses, embroidered suits, and fine pret by Sami Khan, Liaqat Bazaar, Quetta. Shipping worldwide."
      />

      {/* 1. Hero Section */}
      <section className="relative h-[85vh] min-h-[580px] max-h-[820px] w-full flex items-center justify-center overflow-hidden bg-[#14213D]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2000&auto=format&fit=crop"
            alt="SK Brand Balochi Couture"
            className="w-full h-full object-cover object-center opacity-45 filter brightness-95 transform scale-105"
            style={{ transform: 'translateZ(0) scale(1.05)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/95 via-[#14213D]/65 to-[#14213D]/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-6 flex flex-col items-center">
          {/* Navy Pill Badge with Gold Text */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#14213D]/90 border border-[#F2B705]/50 text-[#F2B705] text-xs font-bold tracking-[0.25em] uppercase font-heading shadow-md backdrop-blur-md">
            <span>✦</span>
            AUTUMN / FESTIVE BALOCHI COUTURE 2026
          </div>

          {/* Huge Heading */}
          <h1 className="font-heading text-[32px] sm:text-[44px] md:text-[54px] lg:text-[58px] font-black tracking-tight leading-[1.12] uppercase text-white">
            HAND-MADE BALOCHI DOCH. <br />
            <span className="text-[#F2B705]">TIMELESS ELEGANCE.</span>
          </h1>

          {/* Body Description */}
          <p className="max-w-xl mx-auto text-sm sm:text-base text-stone-200 font-normal leading-[1.55]">
            Handcrafted with heirloom Balochi needlecraft by Sami Khan atelier in Liaqat Bazaar, Quetta. Delivered with express courier tracking worldwide.
          </p>

          {/* Two Buttons: Gold + White-Outlined */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-heading w-full">
            <Link
              to="/shop?category=balochi-dress"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#F2B705] hover:bg-[#D9A404] text-[#14213D] text-sm sm:text-base font-extrabold tracking-wider uppercase transition-all shadow-xl rounded-xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              SHOP BALOCHI DRESSES
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop?category=new-arrivals"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white hover:bg-white/15 border-2 border-white text-sm sm:text-base font-extrabold tracking-wider uppercase transition-all rounded-xl backdrop-blur-xs flex items-center justify-center"
            >
              NEW ARRIVALS
            </Link>
          </div>
        </div>
      </section>

      {/* 2. USP Strip */}
      <section className="bg-white border-y border-stone-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-2">
              <Scissors className="w-6 h-6 text-[#F2B705] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#14213D] font-heading">Hand-Made Embroidery</h4>
              <p className="text-[12px] text-stone-500 mt-0.5">Authentic Balochi Doch, mirror work & needlecraft</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <Truck className="w-6 h-6 text-[#14213D] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#14213D] font-heading">Worldwide DHL Delivery</h4>
              <p className="text-[12px] text-stone-500 mt-0.5">Express tracked delivery to UK, USA, UAE & Canada</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <MessageCircle className="w-6 h-6 text-[#25D366] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#14213D] font-heading">WhatsApp Ordering</h4>
              <p className="text-[12px] text-stone-500 mt-0.5">Direct chat with concierge on 0316 0367456</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <Ruler className="w-6 h-6 text-[#F2B705] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#14213D] font-heading">Custom Sizing</h4>
              <p className="text-[12px] text-stone-500 mt-0.5">Made-to-measure tailored to your exact fit</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold tracking-[0.25em] text-[#F2B705] uppercase block mb-1 font-heading">
            Heirloom & Festive Wear
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#14213D] tracking-tight">
            Explore Collections
          </h2>
          <div className="w-16 h-1 bg-[#F2B705] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categoryCards.map((col) => (
            <Link
              key={col.title}
              to={col.link}
              className="group relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-md block bg-stone-950 border border-stone-200"
            >
              <img
                src={col.img}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[11px] tracking-[0.2em] text-[#F2B705] uppercase font-bold block font-heading">
                  {col.sub}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight">
                  {col.title}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase font-bold text-[#F2B705] group-hover:text-white transition-colors pt-2">
                  Shop Now
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white/50 rounded-3xl mb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold tracking-[0.25em] text-[#F2B705] uppercase block mb-1 font-heading">
              Signature Creations
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#14213D] tracking-tight">
              Featured Balochi Dresses
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold tracking-wider text-[#14213D] hover:text-[#F2B705] uppercase flex items-center gap-1 transition-colors font-heading"
          >
            View All ({featuredProducts.length})
            <ChevronRight className="w-4 h-4 text-[#F2B705]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 5. Two-Tile Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Tile — Heritage */}
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-[#1D3557] flex items-end p-8 text-white shadow-lg border border-stone-200 group">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop"
              alt="Balochi Heritage"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14213D] via-[#1D3557]/60 to-transparent" />
            <div className="relative z-10 space-y-3">
              <span className="text-xs font-bold tracking-[0.25em] text-[#F2B705] uppercase font-heading">
                Centuries of Tradition
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold leading-tight">
                Hand-Crafted in Quetta by Master Artisans
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 font-normal max-w-sm pb-2">
                Every doch stitch represents the soul of Balochistan cultural craftsmanship.
              </p>
              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#F2B705] hover:text-white border-b-2 border-[#F2B705] pb-1 transition-colors font-heading"
                >
                  READ OUR HERITAGE STORY
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Tile — Collection */}
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-[#14213D] flex items-end p-8 text-white shadow-lg border border-stone-200 group">
            <img
              src="https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?q=80&w=900&auto=format&fit=crop"
              alt="Festive Balochi Couture"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14213D] via-[#14213D]/60 to-transparent" />
            <div className="relative z-10 space-y-3">
              <span className="text-xs font-bold tracking-[0.25em] text-[#F2B705] uppercase font-heading">
                Liaqat Bazaar Quetta
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold leading-tight">
                Festive & Bridal Balochi Collection 2026
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 font-normal max-w-sm pb-2">
                Tailored with fine shamoz silk, pure chiffon, and micro velvet.
              </p>
              <div>
                <Link
                  to="/shop?category=balochi-dress"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#F2B705] hover:bg-[#D9A404] text-[#14213D] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all font-heading"
                >
                  VIEW BALOCHI DRESSES
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Brand Story Section */}
      <section className="bg-white py-16 sm:py-24 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <SKBrandLogo size="lg" />
              </div>
              <span className="text-xs font-extrabold tracking-[0.25em] text-[#F2B705] uppercase block font-heading">
                Artisan Heritage • Liaqat Bazaar Quetta
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#14213D] font-extrabold leading-tight">
                Authentic Balochi Doch Needlecraft Curated by Sami Khan
              </h2>
              <div className="w-16 h-1 bg-[#F2B705] rounded-full" />
              <p className="text-[#3D3D3D] text-sm sm:text-base leading-relaxed">
                Founded in Quetta by <strong className="text-[#14213D]">Sami Khan</strong>, SK Brand preserves centuries of heirloom needlecraft. Located at Naseem Fashion Mall, Liaqat Bazaar, our atelier specializes in hand-embroidered <strong className="text-[#14213D]">Balochi Doch (Doz)</strong> dresses, mirror embellishments, and luxury machine embroidery suits.
              </p>
              <p className="text-[#3D3D3D] text-sm sm:text-base leading-relaxed">
                Whether shopping for a traditional Balochi ensemble or contemporary seasonal pret, every garment is crafted with timeless devotion and delivered with express DHL courier tracking to London, Manchester, New York, Toronto, and worldwide.
              </p>
              <div className="pt-4 flex items-center gap-4 flex-wrap font-heading">
                <Link
                  to="/shop?category=balochi-dress"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wider uppercase bg-[#F2B705] text-[#14213D] px-6 py-3 rounded-xl hover:bg-[#D9A404] transition-colors shadow-md"
                >
                  View Balochi Dresses
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wider uppercase text-[#14213D] hover:text-[#F2B705] transition-colors px-6 py-3 border-2 border-[#14213D] rounded-xl hover:border-[#F2B705]"
                >
                  Read Our Heritage Story
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop"
                alt="Pakistani Craftsmanship"
                className="w-full h-72 sm:h-96 object-cover rounded-2xl shadow-lg border border-stone-200"
              />
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
                alt="Embroidery Needlework"
                className="w-full h-72 sm:h-96 object-cover rounded-2xl shadow-lg mt-12 border border-stone-200"
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
