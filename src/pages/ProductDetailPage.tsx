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
      <div className="min-h-screen bg-[#FAF6EE] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#F2B705]" />
        <p className="text-xs tracking-widest uppercase font-semibold text-[#14213D]">
          Loading Collection...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h2 className="font-heading text-2xl font-bold text-[#14213D]">Product Not Found</h2>
        <p className="text-sm text-gray-500 max-w-sm font-body">
          The requested article may have been archived or is no longer available.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-[#14213D] text-white text-xs font-bold uppercase tracking-wider rounded-lg"
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
    <div className="min-h-screen bg-[#FAF6EE] py-6 sm:py-10 font-body">
      <SEO
        title={`${product.name} | SK Brands`}
        description={product.shortDescription || product.description.slice(0, 160)}
        image={product.images[0]}
        type="product"
        schema={productSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs font-medium text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-[#14213D] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/shop" className="hover:text-[#14213D] transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to={`/shop?category=${product.category}`} className="hover:text-[#14213D] transition-colors capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#14213D] font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-gray-200">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnail Column */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[700px] shrink-0 pb-2 md:pb-0 hide-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-24 sm:w-20 sm:h-28 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-white ${
                      selectedImageIndex === idx
                        ? 'border-[#14213D] shadow-sm'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Primary Image */}
            <div className="relative flex-1 aspect-[3/4] max-h-[700px] rounded-xl overflow-hidden bg-white shadow-sm group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110 cursor-zoom-in"
              />

              {discountPercent > 0 && (
                <div className="absolute top-5 left-5 bg-[#C1272D] text-white text-[11px] font-black px-3 py-1.5 rounded-md tracking-wider uppercase shadow-md">
                  SALE {discountPercent}% OFF
                </div>
              )}

              <button
                onClick={handleShare}
                className="absolute top-5 right-5 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#14213D] hover:text-[#F2B705] shadow-sm backdrop-blur-md transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
            <div>
              {/* Category, Fabric, SKU */}
              <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-[#F2B705] uppercase mb-2">
                <span>{product.fabric} • {product.category.replace('-', ' ')}</span>
                <span className="text-gray-400 font-mono">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#14213D] leading-tight">
                {product.name}
              </h1>

              {/* Rating stars & Reviews */}
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                <div className="flex items-center text-[#F2B705]">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="font-bold text-[#14213D]">4.9</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 font-medium border-b border-gray-300 border-dashed pb-0.5">32 Verified Reviews</span>
              </div>

              {/* Price Banner */}
              <div className="mt-5 p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#14213D] font-heading">
                    {formatPrice(price)}
                  </span>
                  {product.salePrice && (
                    <span className="text-lg text-gray-400 line-through font-medium">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <span className="px-3 py-1 bg-[#F2B705]/10 text-[#F2B705] text-xs font-bold uppercase tracking-wider rounded-md">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Stock Status Indicator */}
              <div className="mt-4 flex items-center gap-2 text-[13px]">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-2 text-[#25D366] font-bold">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
                    </span>
                    In Stock ({product.stock} items)
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-[#C1272D] font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C1272D]" />
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-5 text-[15px] text-[#3D3D3D] leading-relaxed">
                {product.shortDescription || product.description.slice(0, 180) + '...'}
              </p>

              <div className="h-px w-full bg-gray-200 my-6" />

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#14213D] mb-3">
                    <span>Color: <strong className="font-medium text-gray-500 capitalize ml-1">{selectedColor}</strong></span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-4 py-2 text-[13px] rounded-full transition-all border font-semibold ${
                          selectedColor === c
                            ? 'border-[#14213D] bg-[#14213D] text-white shadow-md'
                            : 'border-gray-300 bg-white text-[#3D3D3D] hover:border-[#14213D]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#14213D] mb-3">
                    <span>Size: <strong className="font-medium text-gray-500 capitalize ml-1">{selectedSize}</strong></span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-[11px] text-[#14213D] hover:text-[#F2B705] font-bold flex items-center gap-1.5 normal-case tracking-normal underline underline-offset-2 transition-colors"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2.5 flex-wrap">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[3rem] h-12 px-3 text-[13px] rounded-lg border flex items-center justify-center font-bold transition-all ${
                          selectedSize === s
                            ? 'border-[#14213D] bg-[#14213D] text-[#F2B705] shadow-md'
                            : 'border-gray-300 bg-white text-[#3D3D3D] hover:border-[#14213D]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#14213D] mb-3">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white w-fit shadow-sm overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 text-gray-500 hover:text-[#14213D] hover:bg-gray-50 font-black transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-[15px] font-bold text-[#14213D] min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2.5 text-gray-500 hover:text-[#14213D] hover:bg-gray-50 font-black transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3.5 font-heading">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-4 bg-[#F2B705] hover:bg-[#d4a004] text-[#14213D] font-black text-sm tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
                </button>

                <button
                  onClick={() => {
                    toggleWishlist(product);
                    showToast(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center ${
                    isWishlisted
                      ? 'bg-red-50 border-[#C1272D] text-[#C1272D]'
                      : 'bg-white border-gray-300 text-[#14213D] hover:border-[#14213D] shadow-sm'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#C1272D]' : ''}`} />
                </button>
              </div>

              {product.stock > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-[#14213D] hover:bg-[#1D3557] text-white font-black text-sm tracking-widest uppercase rounded-xl transition-all shadow-md"
                >
                  Buy It Now
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
                className="w-full py-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md uppercase tracking-widest"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                Order on WhatsApp
              </a>

              {/* Guarantees */}
              <div className="pt-4 mt-4 grid grid-cols-2 gap-3 text-[11px] text-[#3D3D3D] font-body">
                <div className="flex items-center gap-2 font-bold p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <Truck className="w-5 h-5 text-[#14213D]" />
                  <span>Worldwide Fast Shipping</span>
                </div>
                <div className="flex items-center gap-2 font-bold p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-[#14213D]" />
                  <span>100% Genuine Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Tabs */}
        <div className="py-12 border-b border-gray-200">
          <div className="flex border-b border-gray-300 overflow-x-auto gap-8 text-[13px] font-bold uppercase tracking-widest hide-scrollbar">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-4 transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'desc'
                  ? 'border-[#14213D] text-[#14213D]'
                  : 'border-transparent text-gray-400 hover:text-[#14213D]'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('size')}
              className={`pb-4 transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'size'
                  ? 'border-[#14213D] text-[#14213D]'
                  : 'border-transparent text-gray-400 hover:text-[#14213D]'
              }`}
            >
              Size Guide
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'shipping'
                  ? 'border-[#14213D] text-[#14213D]'
                  : 'border-transparent text-gray-400 hover:text-[#14213D]'
              }`}
            >
              Shipping & Delivery
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`pb-4 transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'returns'
                  ? 'border-[#14213D] text-[#14213D]'
                  : 'border-transparent text-gray-400 hover:text-[#14213D]'
              }`}
            >
              Returns
            </button>
          </div>

          <div className="py-8 text-[15px] text-[#3D3D3D] leading-relaxed max-w-4xl">
            {activeTab === 'desc' && (
              <div className="space-y-6">
                <p className="whitespace-pre-line">{product.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
                    <span className="text-[11px] uppercase text-gray-500 block font-bold mb-1">Fabric</span>
                    <span className="font-black text-[#14213D]">{product.fabric}</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
                    <span className="text-[11px] uppercase text-gray-500 block font-bold mb-1">Category</span>
                    <span className="font-black text-[#14213D] capitalize">{product.category.replace('-', ' ')}</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
                    <span className="text-[11px] uppercase text-gray-500 block font-bold mb-1">Care</span>
                    <span className="font-black text-[#14213D]">Dry Clean Only</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
                    <span className="text-[11px] uppercase text-gray-500 block font-bold mb-1">Authenticity</span>
                    <span className="font-black text-[#14213D]">100% Original</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'size' && (
              <div className="space-y-4">
                <p className="font-medium">Standard Pakistani ready-to-wear stitched measurements (all values in inches):</p>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-left bg-white">
                    <thead className="bg-gray-50 uppercase tracking-wider text-[#14213D] text-[11px] font-bold">
                      <tr>
                        <th className="p-4 border-b border-gray-200">Size</th>
                        <th className="p-4 border-b border-gray-200">Chest</th>
                        <th className="p-4 border-b border-gray-200">Waist</th>
                        <th className="p-4 border-b border-gray-200">Hips</th>
                        <th className="p-4 border-b border-gray-200">Length</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[13px]">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-black text-[#14213D]">XS</td>
                        <td className="p-4">34"</td>
                        <td className="p-4">30"</td>
                        <td className="p-4">36"</td>
                        <td className="p-4">38"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-black text-[#14213D]">S</td>
                        <td className="p-4">36"</td>
                        <td className="p-4">32"</td>
                        <td className="p-4">38"</td>
                        <td className="p-4">39"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-black text-[#14213D]">M</td>
                        <td className="p-4">39"</td>
                        <td className="p-4">35"</td>
                        <td className="p-4">42"</td>
                        <td className="p-4">40"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-black text-[#14213D]">L</td>
                        <td className="p-4">42"</td>
                        <td className="p-4">38"</td>
                        <td className="p-4">45"</td>
                        <td className="p-4">41"</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-black text-[#14213D]">XL</td>
                        <td className="p-4">45"</td>
                        <td className="p-4">41"</td>
                        <td className="p-4">48"</td>
                        <td className="p-4">42"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-500 text-[13px] italic mt-4">
                  *Need custom sizing or unstitched alterations? Click "Order via WhatsApp" to communicate custom body measurements.
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex gap-4">
                  <Truck className="w-6 h-6 text-[#14213D] shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#14213D] text-[15px] mb-1">Domestic Delivery (Pakistan)</h4>
                    <p className="text-[14px]">Dispatched within 24-48 hours via TCS or Leopard Courier. Estimated delivery in 2-4 business days. Free shipping on orders over Rs. 10,000.</p>
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex gap-4">
                  <Truck className="w-6 h-6 text-[#14213D] shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#14213D] text-[15px] mb-1">Worldwide International Shipping</h4>
                    <p className="text-[14px]">Express deliveries to UK, USA, Canada, UAE, Saudi Arabia, Australia and Europe via DHL Express Worldwide. Transit time is 4-7 business days.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="space-y-4 bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex gap-4">
                  <RotateCcw className="w-6 h-6 text-[#14213D] shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#14213D] text-[15px] mb-1">7-Day Exchange Policy</h4>
                    <p className="text-[14px]">At SK Brands, customer satisfaction is our prime commitment. We offer a 7-day exchange window for unused, unwashed articles with original brand tags attached.</p>
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-[#14213D] shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#14213D] text-[15px] mb-1">Quality Guarantee</h4>
                    <p className="text-[14px]">In the rare event of a transit defect or incorrect sizing, contact our concierge on WhatsApp for an expedited resolution.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 pb-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-black tracking-[0.2em] text-[#F2B705] uppercase block mb-2">
                Curated Suggestions
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#14213D]">
                You May Also Like
              </h2>
              <div className="w-16 h-1 bg-[#14213D] mx-auto mt-4 rounded-full" />
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
            className="fixed inset-0 bg-[#14213D]/40 backdrop-blur-sm"
            onClick={() => setIsSizeGuideOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-heading text-xl font-bold text-[#14213D]">
                SK BRANDS SIZING GUIDE
              </h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-gray-400 hover:text-[#14213D] p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <p className="text-[13px] text-[#3D3D3D] mb-4 font-medium">
              Measurements reflect garment dimensions laid flat in inches:
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-[13px] text-left">
                <thead className="bg-[#FAF6EE] text-[#14213D] font-bold">
                  <tr>
                    <th className="p-3 border-b border-gray-200">Size</th>
                    <th className="p-3 border-b border-gray-200">Bust</th>
                    <th className="p-3 border-b border-gray-200">Waist</th>
                    <th className="p-3 border-b border-gray-200">Hips</th>
                    <th className="p-3 border-b border-gray-200">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50"><td className="p-3 font-black text-[#14213D]">XS</td><td className="p-3">34"</td><td className="p-3">30"</td><td className="p-3">36"</td><td className="p-3">38"</td></tr>
                  <tr className="hover:bg-gray-50"><td className="p-3 font-black text-[#14213D]">S</td><td className="p-3">36"</td><td className="p-3">32"</td><td className="p-3">38"</td><td className="p-3">39"</td></tr>
                  <tr className="hover:bg-gray-50"><td className="p-3 font-black text-[#14213D]">M</td><td className="p-3">39"</td><td className="p-3">35"</td><td className="p-3">42"</td><td className="p-3">40"</td></tr>
                  <tr className="hover:bg-gray-50"><td className="p-3 font-black text-[#14213D]">L</td><td className="p-3">42"</td><td className="p-3">38"</td><td className="p-3">45"</td><td className="p-3">41"</td></tr>
                  <tr className="hover:bg-gray-50"><td className="p-3 font-black text-[#14213D]">XL</td><td className="p-3">45"</td><td className="p-3">41"</td><td className="p-3">48"</td><td className="p-3">42"</td></tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="mt-6 w-full py-3.5 bg-[#14213D] text-white text-xs font-black rounded-xl uppercase tracking-widest shadow-md hover:bg-[#1D3557] transition-colors"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
