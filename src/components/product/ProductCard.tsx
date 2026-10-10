import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, MessageCircle } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { formatPrice, calculateDiscountPercent, generateProductWhatsAppUrl } from '../../utils/formatters.ts';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(product.price, product.salePrice);

  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop';
  const secondaryImage = product.images[1] || primaryImage;

  const defaultColor = (product.colors && product.colors[0]) || 'Classic';
  const defaultSize = (product.sizes && product.sizes[0]) || 'Free Size';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultColor, defaultSize, 1);
    showToast(`Added "${product.name}" to your bag!`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(isWishlisted ? `Removed from wishlist` : `Saved to wishlist!`);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-300 font-body"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 block"
      >
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}
        />
        <img
          src={secondaryImage}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-[#C1272D] text-white text-[10px] font-black px-2.5 py-0.5 rounded-md tracking-wider uppercase shadow-md">
              SALE {discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-[#14213D] text-[#F2B705] text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wider uppercase shadow-sm">
              Featured
            </span>
          )}
          {product.stock <= 0 && (
            <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-sm ${
            isWishlisted
              ? 'bg-red-50 text-[#C1272D]'
              : 'bg-white/80 text-[#14213D] hover:bg-white hover:text-[#C1272D]'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C1272D]' : ''}`} />
        </button>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={handleQuickViewClick}
            className="absolute top-12 right-3 p-2 rounded-full bg-white/80 text-[#14213D] hover:bg-white hover:text-[#14213D] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-sm hidden sm:block translate-y-1 group-hover:translate-y-0"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* Hover overlay add to bag */}
        {product.stock > 0 && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:block z-10">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 bg-[#F2B705] hover:bg-[#d4a004] text-[#14213D] font-bold text-xs tracking-wider uppercase rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors font-heading"
            >
              <ShoppingBag className="w-4 h-4" />
              ADD TO BAG
            </button>
          </div>
        )}
      </Link>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white z-20">
        <div>
          {/* Fabric & Category */}
          <div className="flex items-center justify-between text-[10px] tracking-wider font-semibold mb-1.5 uppercase">
            <span className="text-[#14213D]">{product.fabric}</span>
            <span className="text-gray-400">{product.category.replace('-', ' ')}</span>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="text-[13px] sm:text-sm font-bold text-[#14213D] hover:text-[#F2B705] transition-colors line-clamp-2 leading-tight font-heading"
          >
            {product.name}
          </Link>

          {/* Variant Chip */}
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[10px] font-bold bg-[#FAF6EE] text-[#14213D] px-2.5 py-1 rounded-full border border-gray-100">
              {defaultColor} / {defaultSize}
            </span>
            {product.sizes && product.sizes.length > 1 && (
              <span className="text-[10px] text-gray-400 font-medium">
                +{product.sizes.length - 1} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Order */}
        <div className="pt-3.5 mt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] sm:text-[17px] font-black text-[#14213D] font-heading">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <span className="text-[11px] text-gray-400 line-through font-semibold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <a
              href={generateProductWhatsAppUrl(product, defaultSize, defaultColor)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
              title="Order on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Direct Add Button */}
          {product.stock > 0 && (
            <button
              onClick={handleQuickAdd}
              className="mt-3 sm:hidden w-full py-2.5 bg-[#14213D] text-white font-bold text-[11px] rounded-lg flex items-center justify-center gap-1.5 shadow-md font-heading uppercase tracking-wide"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Bag
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
