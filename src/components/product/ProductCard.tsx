import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { formatPrice, calculateDiscountPercent } from '../../utils/formatters.ts';

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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Default to first size and color
    const defaultColor = product.colors[0];
    const defaultSize = product.sizes[0];
    addToCart(product, defaultColor, defaultSize, 1);
    showToast(`Added "${product.name}" to bag!`);
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
      className="group relative flex flex-col bg-white rounded-lg overflow-hidden border border-stone-200/80 hover:border-stone-400 hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
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

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-[#F5B016] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow-xs">
              SAVE {discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="bg-[#18181A] text-white text-[10px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase shadow-xs">
              Featured
            </span>
          )}
          {product.stock <= 0 && (
            <span className="bg-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-rose-600'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Button on Image */}
        {onQuickView && (
          <button
            onClick={handleQuickViewClick}
            className="absolute top-12 right-2.5 p-2 rounded-full bg-white/80 text-stone-700 hover:bg-white hover:text-black backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-xs hidden sm:block"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* Quick Add Button Overlay (Appears on Hover) */}
        {product.stock > 0 && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200 hidden sm:block">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 bg-white hover:bg-[#F3EFEA] text-black font-semibold text-xs tracking-widest uppercase rounded shadow flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Quick Add
            </button>
          </div>
        )}
      </Link>

      {/* Details Container */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Fabric & Category */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 uppercase tracking-widest font-medium mb-1">
            <span className="text-[#F5B016] font-semibold">{product.fabric}</span>
            <span className="text-stone-400 text-[10px]">{product.sku}</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-[#F5B016] transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Available Sizes preview */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {product.sizes.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 text-stone-600 bg-stone-50 font-medium"
                >
                  {s}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[9px] text-stone-400">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Mobile Quick Add */}
        <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-stone-950 font-sans">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          {product.stock > 0 && (
            <button
              onClick={handleQuickAdd}
              className="sm:hidden p-2 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

