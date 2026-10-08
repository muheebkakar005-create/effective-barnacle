import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { formatPrice } from '../utils/formatters.ts';
import { SEO } from '../components/common/SEO.tsx';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (product: any) => {
    addToCart(product, product.colors[0], product.sizes[0], 1);
    showToast(`Added "${product.name}" to your bag!`);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] py-8 sm:py-16">
      <SEO title="My Wishlist | SK Brands" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-normal text-stone-900">
              Saved Articles
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your personal curation
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-stone-600 hover:text-black flex items-center gap-1"
          >
            Explore Shop
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-display text-xl font-bold text-stone-900">
              Your wishlist is empty
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Explore our unstitched chiffon, organza pret, and lawn collections and tap the heart icon on any suit you love.
            </p>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded"
            >
              Discover Collections
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-stone-200 overflow-hidden flex flex-col justify-between group shadow-xs hover:shadow-md transition-all"
              >
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-rose-600 rounded-full shadow"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5B016] block mb-1">
                      {product.fabric}
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 hover:text-[#F5B016] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 text-sm font-bold text-black font-sans">
                      {formatPrice(product.salePrice || product.price)}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="w-full py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {product.stock > 0 ? 'Move to Bag' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

