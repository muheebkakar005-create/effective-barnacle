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
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200/90 hover:border-[#F2B705] hover:shadow-xl transition-all duration-300 font-body"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container with hover transition */}
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 block"
      >
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* SALE Badge (#C1272D Brick Red) & Stock Badges */}
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
            <span className="bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 text-[#C1272D]'
              : 'bg-white/90 text-[#14213D] hover:bg-white hover:text-[#C1272D]'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C1272D]' : ''}`} />
        </button>

        {/* Quick View Button on Image */}
        {onQuickView && (
          <button
            onClick={handleQuickViewClick}
            className="absolute top-13 right-3 p-2 rounded-full bg-white/90 text-[#14213D] hover:bg-white hover:text-[#F2B705] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-sm hidden sm:block"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* Quick Add Button Overlay on Hover */}
        {product.stock > 0 && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200 hidden sm:block">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 bg-[#F2B705] hover:bg-[#D9A404] text-[#14213D] font-extrabold text-xs tracking-wider uppercase rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all font-heading"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add / Choose
            </button>
          </div>
        )}
      </Link>

      {/* Details Container (ukfashions.pk style) */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Fabric & SKU line */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 uppercase tracking-wider font-semibold mb-1">
            <span className="text-[#14213D] font-bold">{product.fabric}</span>
            <span className="text-stone-400 text-[10px]">{product.category.replace('-', ' ')}</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-bold text-[#14213D] hover:text-[#F2B705] transition-colors line-clamp-2 leading-snug font-heading"
          >
            {product.name}
          </Link>

          {/* Variant Chip (e.g. "Navy / M" or color / size dot) */}
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold bg-[#FAF6EE] text-[#14213D] px-2 py-0.5 rounded border border-stone-200">
              {defaultColor} / {defaultSize}
            </span>
            {product.sizes && product.sizes.length > 1 && (
              <span className="text-[10px] text-stone-400">
                +{product.sizes.length - 1} sizes
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Order Actions */}
        <div className="pt-3 mt-2.5 border-t border-stone-100">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-black text-[#14213D] font-heading">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* WhatsApp Quick Order button */}
            <a
              href={generateProductWhatsAppUrl(product, defaultSize, defaultColor)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#25D366] hover:text-[#1EBE5D] transition-colors"
              title="Order on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>

          {/* Mobile Direct Add Button */}
          {product.stock > 0 && (
            <button
              onClick={handleQuickAdd}
              className="mt-2.5 sm:hidden w-full py-2 bg-[#F2B705] hover:bg-[#D9A404] text-[#14213D] font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm font-heading uppercase"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add / Choose
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
