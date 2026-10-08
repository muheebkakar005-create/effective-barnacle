import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Star,
  Check,
  Share2,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Product } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { ProductCard } from '../components/product/ProductCard.tsx';
import { SEO } from '../components/common/SEO.tsx';
import {
  formatPrice,
  calculateDiscountPercent,
  generateWhatsAppOrderUrl
} from '../utils/formatters.ts';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'size' | 'shipping' | 'returns'>('desc');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const res = await api.getProduct(slug);
        if (res.success && res.product) {
          setProduct(res.product);
          setRelatedProducts(res.related || []);
          setSelectedImageIndex(0);
          setSelectedColor(res.product.colors[0] || '');
          setSelectedSize(res.product.sizes[0] || '');
          setQuantity(1);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#F5B016]" />
        <p className="text-xs tracking-widest uppercase font-semibold text-stone-500">
          Loading Couture Article...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h2 className="font-display text-2xl font-bold text-stone-900">Product Not Found</h2>
        <p className="text-xs text-stone-500 max-w-sm">
          The requested suit article may have been archived or is no longer available.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const discountPercent = calculateDiscountPercent(product.price, product.salePrice);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    showToast(`Added ${quantity}x "${product.name}" to your bag!`);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  // Structured Data Schema for Product
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: window.location.href
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] py-6 sm:py-10">
      <SEO
        title={`${product.name} | SK Brands`}
        description={product.shortDescription || product.description.slice(0, 160)}
        image={product.images[0]}
        type="product"
        schema={productSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-stone-500 mb-6 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link to="/shop" className="hover:text-black">Shop</Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link to={`/shop?category=${product.category}`} className="hover:text-black capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Main Section: Left Gallery, Right Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-stone-200">
          {/* Left: Image Gallery (Col 7) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnail Column */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[620px] shrink-0 pb-2 md:pb-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-18 h-24 sm:w-20 sm:h-28 rounded-md overflow-hidden border-2 transition-all shrink-0 bg-stone-100 ${
                      selectedImageIndex === idx
                        ? 'border-black shadow-xs scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Primary Image */}
            <div className="relative flex-1 aspect-[3/4] max-h-[620px] rounded-lg overflow-hidden bg-white border border-stone-200 shadow-xs group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-108"
              />

              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-[#F5B016] text-white text-[11px] font-bold px-2.5 py-1 rounded tracking-wider uppercase shadow">
                  SAVE {discountPercent}%
                </div>
              )}

              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-black shadow backdrop-blur-xs transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Product Details (Col 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category, Fabric, SKU */}
              <div className="flex items-center justify-between text-xs font-semibold tracking-widest text-[#F5B016] uppercase mb-1">
                <span>{product.fabric} â€¢ {product.category.replace('-', ' ')}</span>
                <span className="text-stone-400 font-mono">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-950 leading-tight">
                {product.name}
              </h1>

              {/* Rating stars & Reviews */}
              <div className="flex items-center gap-2 mt-2 text-xs text-stone-600">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <span className="font-bold text-stone-900">4.9</span>
                <span className="text-stone-400">â€¢</span>
                <span className="text-stone-500">32 Verified Reviews</span>
              </div>

              {/* Price Banner */}
              <div className="mt-4 p-3 bg-stone-100/70 rounded-lg flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-stone-950 font-sans">
                  {formatPrice(price)}
                </span>
                {product.salePrice && (
                  <span className="text-base text-stone-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="ml-auto text-xs font-bold text-[#F5B016] uppercase tracking-wider">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Stock Status Indicator */}
              <div className="mt-3 flex items-center gap-2 text-xs">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock ({product.stock} units available)
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Currently Out of Stock
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.shortDescription || product.description.slice(0, 180) + '...'}
              </p>

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
                    <span>Color: <strong className="font-normal text-stone-600">{selectedColor}</strong></span>
                  </div>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 text-xs rounded border transition-all ${
                          selectedColor === c
                            ? 'border-black bg-stone-900 text-white font-semibold shadow-xs'
                            : 'border-stone-300 bg-white text-stone-700 hover:border-black'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector + Size Guide Modal Trigger */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
                    <span>Size: <strong className="font-normal text-stone-600">{selectedSize}</strong></span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-[#F5B016] hover:text-black font-semibold flex items-center gap-1 normal-case tracking-normal underline"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-10 h-10 px-3 text-xs rounded border flex items-center justify-center font-semibold transition-all ${
                          selectedSize === s
                            ? 'border-black bg-black text-white shadow-xs'
                            : 'border-stone-300 bg-white text-stone-800 hover:border-stone-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
                  Quantity
                </label>
                <div className="flex items-center border border-stone-300 rounded bg-white w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-stone-600 hover:text-black font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3.5 py-2 text-stone-600 hover:text-black font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-stone-200">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3.5 bg-stone-900 hover:bg-black text-white font-semibold text-xs tracking-widest uppercase rounded flex items-center justify-center gap-2 transition-all shadow disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
                </button>

                <button
                  onClick={() => {
                    toggleWishlist(product);
                    showToast(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
                  }}
                  className={`p-3.5 rounded border transition-colors ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-white border-stone-300 text-stone-700 hover:border-black'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {product.stock > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-[#F5B016] hover:bg-[#E5A00D] text-black font-semibold text-xs tracking-widest uppercase rounded transition-colors shadow"
                >
                  Buy Now
                </button>
              )}

              {/* WhatsApp Order Button */}
              <a
                href={generateWhatsAppOrderUrl({
                  productName: product.name,
                  sku: product.sku,
                  price,
                  color: selectedColor,
                  size: selectedSize,
                  quantity
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs rounded flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                Order via WhatsApp Concierge
              </a>

              {/* Guarantees */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#F5B016]" />
                  <span>Express Courier Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F5B016]" />
                  <span>100% Genuine Pakistani Fabric</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Tabs */}
        <div className="py-12 border-b border-stone-200">
          <div className="flex border-b border-stone-300 overflow-x-auto gap-8 text-xs font-bold uppercase tracking-widest">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'desc'
                  ? 'border-black text-black'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Description & Craftsmanship
            </button>
            <button
              onClick={() => setActiveTab('size')}
              className={`pb-3 transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'size'
                  ? 'border-black text-black'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Size Guide & Measurements
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'shipping'
                  ? 'border-black text-black'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Worldwide Shipping & Delivery
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`pb-3 transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'returns'
                  ? 'border-black text-black'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Returns & Exchanges
            </button>
          </div>

          <div className="py-6 text-xs sm:text-sm text-stone-700 leading-relaxed max-w-4xl">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-200">
                  <div className="p-3 bg-white rounded border border-stone-200">
                    <span className="text-[10px] uppercase text-stone-400 block font-semibold">Fabric</span>
                    <span className="font-bold text-stone-900">{product.fabric}</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-stone-200">
                    <span className="text-[10px] uppercase text-stone-400 block font-semibold">Suit Style</span>
                    <span className="font-bold text-stone-900">3-Piece Ensemble</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-stone-200">
                    <span className="text-[10px] uppercase text-stone-400 block font-semibold">Care</span>
                    <span className="font-bold text-stone-900">Dry Clean Only</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-stone-200">
                    <span className="text-[10px] uppercase text-stone-400 block font-semibold">Origin</span>
                    <span className="font-bold text-stone-900">Lahore, Pakistan</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'size' && (
              <div className="space-y-4">
                <p>Standard Pakistani ready-to-wear stitched measurements (all values in inches):</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border border-stone-300 text-xs bg-white">
                    <thead className="bg-stone-100 uppercase tracking-wider text-stone-800">
                      <tr>
                        <th className="p-2.5 border">Size</th>
                        <th className="p-2.5 border">Chest / Bust</th>
                        <th className="p-2.5 border">Waist</th>
                        <th className="p-2.5 border">Hips</th>
                        <th className="p-2.5 border">Shirt Length</th>
                        <th className="p-2.5 border">Trouser Length</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      <tr>
                        <td className="p-2.5 font-bold border">XS</td>
                        <td className="p-2.5 border">34"</td>
                        <td className="p-2.5 border">30"</td>
                        <td className="p-2.5 border">36"</td>
                        <td className="p-2.5 border">38"</td>
                        <td className="p-2.5 border">37"</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold border">S</td>
                        <td className="p-2.5 border">36"</td>
                        <td className="p-2.5 border">32"</td>
                        <td className="p-2.5 border">38"</td>
                        <td className="p-2.5 border">39"</td>
                        <td className="p-2.5 border">38"</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold border">M</td>
                        <td className="p-2.5 border">39"</td>
                        <td className="p-2.5 border">35"</td>
                        <td className="p-2.5 border">42"</td>
                        <td className="p-2.5 border">40"</td>
                        <td className="p-2.5 border">39"</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold border">L</td>
                        <td className="p-2.5 border">42"</td>
                        <td className="p-2.5 border">38"</td>
                        <td className="p-2.5 border">45"</td>
                        <td className="p-2.5 border">41"</td>
                        <td className="p-2.5 border">39"</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold border">XL</td>
                        <td className="p-2.5 border">45"</td>
                        <td className="p-2.5 border">41"</td>
                        <td className="p-2.5 border">48"</td>
                        <td className="p-2.5 border">42"</td>
                        <td className="p-2.5 border">40"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-stone-500 text-xs">
                  *Need custom sizing or unstitched alterations? Click "Order via WhatsApp" to communicate custom body measurements with our master tailors.
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3">
                <p>
                  <strong>Pakistan Domestic Deliveries:</strong> Dispatched within 24-48 hours via TCS or Leopard Courier. Estimated delivery in 2-4 business days. Free shipping on orders over Rs. 10,000.
                </p>
                <p>
                  <strong>Worldwide International Shipping:</strong> Express deliveries to United Kingdom, United States, Canada, UAE, Saudi Arabia, Australia and Europe via DHL Express Worldwide. Transit time is 4-7 business days. Tracking number is emailed immediately upon dispatch.
                </p>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="space-y-3">
                <p>
                  At SK Brands, customer satisfaction is our prime commitment. We offer a 7-day exchange window for unused, unwashed articles with original brand tags attached.
                </p>
                <p>
                  In the rare event of a transit defect or incorrect sizing, contact our concierge on WhatsApp or email concierge@skbrands.pk with your Order Number for an expedited resolution.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products ("YOU MAY ALSO LIKE") */}
        {relatedProducts.length > 0 && (
          <div className="pt-16">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold tracking-[0.25em] text-[#F5B016] uppercase block mb-1">
                Curated Suggestions
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-normal text-stone-900">
                You May Also Like
              </h2>
              <div className="w-10 h-0.5 bg-[#F5B016] mx-auto mt-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Standalone Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsSizeGuideOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-display text-lg font-bold text-stone-900">
                SK BRANDS SIZING GUIDE
              </h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-stone-400 hover:text-black p-1"
              >
                âœ•
              </button>
            </div>
            <p className="text-xs text-stone-500 my-3">
              Measurements reflect garment dimensions laid flat in inches:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-stone-200">
                <thead className="bg-stone-100 text-stone-700">
                  <tr>
                    <th className="p-2 border">Size</th>
                    <th className="p-2 border">Bust</th>
                    <th className="p-2 border">Waist</th>
                    <th className="p-2 border">Hips</th>
                    <th className="p-2 border">Length</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 font-bold border">XS</td><td className="p-2 border">34"</td><td className="p-2 border">30"</td><td className="p-2 border">36"</td><td className="p-2 border">38"</td></tr>
                  <tr><td className="p-2 font-bold border">S</td><td className="p-2 border">36"</td><td className="p-2 border">32"</td><td className="p-2 border">38"</td><td className="p-2 border">39"</td></tr>
                  <tr><td className="p-2 font-bold border">M</td><td className="p-2 border">39"</td><td className="p-2 border">35"</td><td className="p-2 border">42"</td><td className="p-2 border">40"</td></tr>
                  <tr><td className="p-2 font-bold border">L</td><td className="p-2 border">42"</td><td className="p-2 border">38"</td><td className="p-2 border">45"</td><td className="p-2 border">41"</td></tr>
                  <tr><td className="p-2 font-bold border">XL</td><td className="p-2 border">45"</td><td className="p-2 border">41"</td><td className="p-2 border">48"</td><td className="p-2 border">42"</td></tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="mt-5 w-full py-2.5 bg-black text-white text-xs font-semibold rounded uppercase tracking-wider"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

