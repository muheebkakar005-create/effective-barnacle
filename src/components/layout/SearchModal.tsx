import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { formatPrice } from '../../utils/formatters.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.getProducts({ search: searchTerm.trim(), limit: 6 });
        if (res.success) {
          setResults(res.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleFullSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleQuickTag = (tag: string) => {
    setSearchTerm(tag);
  };

  if (!isOpen) return null;

  const popularTags = ['Chiffon', 'Lawn', 'Organza', 'Velvet', 'Silk', 'Formal', '3Pc'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 lg:p-12">
        <div className="relative w-full max-w-3xl bg-[#FCFAF7] rounded-xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200 mt-12">
          {/* Search Header */}
          <form onSubmit={handleFullSearch} className="p-4 sm:p-6 border-b border-stone-200 flex items-center gap-3">
            <Search className="w-5 h-5 text-stone-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by suit name, fabric (Chiffon, Lawn), SKU or style..."
              className="w-full bg-transparent text-base sm:text-lg text-black placeholder-stone-400 focus:outline-none font-medium"
            />
            {isLoading && <Loader2 className="w-5 h-5 text-[#F5B016] animate-spin shrink-0" />}
            {searchTerm && !isLoading && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="p-1 text-stone-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-black hover:bg-stone-100 rounded-full transition-colors ml-1"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Filters / Tags */}
          <div className="px-6 py-3 bg-stone-100/70 border-b border-stone-200 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-stone-500 font-medium shrink-0">Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTag(tag)}
                className="px-3 py-1 bg-white hover:bg-stone-200 text-stone-700 rounded-full border border-stone-300 transition-colors shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {searchTerm.trim() ? (
              results.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>Top matching products ({results.length})</span>
                    <button
                      onClick={() => handleFullSearch()}
                      className="text-[#F5B016] hover:text-black font-semibold flex items-center gap-1"
                    >
                      View all results
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="flex gap-3 p-2.5 rounded-lg border border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm cursor-pointer transition-all"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-20 object-cover rounded bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#F5B016]">
                              {product.fabric}
                            </span>
                            <h4 className="text-xs font-semibold text-stone-900 truncate">
                              {product.name}
                            </h4>
                            <p className="text-[10px] text-stone-400 truncate">
                              SKU: {product.sku}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-black">
                              {formatPrice(product.salePrice || product.price)}
                            </span>
                            {product.salePrice && (
                              <span className="text-[11px] text-stone-400 line-through">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : !isLoading ? (
                <div className="text-center py-12 text-stone-500">
                  <p className="text-sm font-medium">No suits found for "{searchTerm}"</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Try searching for "Chiffon", "Organza", or browse our all products collection.
                  </p>
                </div>
              ) : null
            ) : (
              <div className="text-center py-8 text-stone-500 text-xs">
                Type above to search our unstitched and pret luxury collections.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

