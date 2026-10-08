import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, MessageCircle, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { formatPrice, generateWhatsAppOrderUrl } from '../../utils/formatters.ts';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedColor(product.colors[0] || '');
      setSelectedSize(product.sizes[0] || '');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const price = product.salePrice || product.price;

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    showToast(`Added ${quantity}x "${product.name}" to your bag!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl bg-[#FCFAF7] rounded-xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 text-stone-500 hover:text-black hover:bg-white shadow transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Gallery */}
            <div className="p-6 bg-stone-100 flex flex-col justify-between">
              <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-white shadow-xs">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-20 rounded overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-[#F5B016] uppercase mb-1">
                  <span>{product.fabric} â€¢ {product.category.replace('-', ' ')}</span>
                  <span className="text-stone-400">SKU: {product.sku}</span>
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-3 my-3">
                  <span className="text-2xl font-bold text-stone-900">
                    {formatPrice(price)}
                  </span>
                  {product.salePrice && (
                    <span className="text-base text-stone-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-6">
                  {product.shortDescription || product.description.slice(0, 160) + '...'}
                </p>

                {/* Color Selector */}
                {product.colors.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                      Color: <span className="font-normal text-stone-600">{selectedColor}</span>
                    </label>
                    <div className="flex gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1.5 text-xs rounded border transition-all ${
                            selectedColor === c
                              ? 'border-black bg-stone-900 text-white font-semibold'
                              : 'border-stone-300 bg-white text-stone-700 hover:border-stone-500'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                      Size: <span className="font-normal text-stone-600">{selectedSize}</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-10 h-10 text-xs rounded border flex items-center justify-center font-semibold transition-all ${
                            selectedSize === s
                              ? 'border-black bg-black text-white'
                              : 'border-stone-300 bg-white text-stone-800 hover:border-stone-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <div className="flex gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-stone-300 rounded bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-stone-600 hover:text-black font-semibold"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-stone-600 hover:text-black font-semibold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 py-3 bg-[#18181A] hover:bg-stone-800 text-white font-semibold text-xs tracking-widest uppercase rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {product.stock > 0 ? 'Add to Bag' : 'Sold Out'}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => {
                      toggleWishlist(product);
                      showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                    }}
                    className={`p-3 rounded border border-stone-300 transition-colors ${
                      isWishlisted ? 'bg-rose-50 text-rose-600 border-rose-300' : 'bg-white text-stone-600 hover:text-black'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>

                {/* WhatsApp Order */}
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
                  className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  Order via WhatsApp Concierge
                </a>

                {/* View Full Product Link */}
                <div className="text-center pt-2">
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-black font-medium transition-colors"
                  >
                    View Full Product Details & Sizing Guide
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

