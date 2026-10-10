import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, Check, SlidersHorizontal, RotateCcw, Loader2 } from 'lucide-react';
import { Product, Facets, Pagination } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ProductCard } from '../components/product/ProductCard.tsx';
import { QuickViewModal } from '../components/product/QuickViewModal.tsx';
import { SEO } from '../components/common/SEO.tsx';
import { formatPrice } from '../utils/formatters.ts';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 16,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [facets, setFacets] = useState<Facets>({
    fabrics: [],
    colors: [],
    sizes: [],
    minPrice: 0,
    maxPrice: 17000
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filters from URL query params
  const currentCategory = searchParams.get('category') || 'all';
  const currentFabric = searchParams.get('fabric') || 'all';
  const currentColor = searchParams.get('color') || 'all';
  const currentSize = searchParams.get('size') || 'all';
  const currentInStock = searchParams.get('inStock') || 'all';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrice = searchParams.get('minPrice') || '0';
  const currentMaxPrice = searchParams.get('maxPrice') || '17000';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchShopProducts = async () => {
      setIsLoading(true);
      try {
        const query: Record<string, any> = {
          page: currentPage,
          limit: 16,
          sort: currentSort
        };

        if (currentCategory !== 'all') query.category = currentCategory;
        if (currentFabric !== 'all') query.fabric = currentFabric;
        if (currentColor !== 'all') query.color = currentColor;
        if (currentSize !== 'all') query.size = currentSize;
        if (currentInStock !== 'all') query.inStock = currentInStock;
        if (currentSearch) query.search = currentSearch;
        if (currentMinPrice && currentMinPrice !== '0') query.minPrice = currentMinPrice;
        if (currentMaxPrice && currentMaxPrice !== '17000') query.maxPrice = currentMaxPrice;

        const res = await api.getProducts(query);
        if (res.success) {
          setProducts(res.products);
          setPagination(res.pagination);
          setFacets(res.facets);
        }
      } catch (err) {
        console.error('Error fetching shop products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    currentCategory,
    currentFabric,
    currentColor,
    currentSize,
    currentInStock,
    currentSort,
    currentSearch,
    currentMinPrice,
    currentMaxPrice,
    currentPage
  ]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'all' || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    currentCategory !== 'all' ||
    currentFabric !== 'all' ||
    currentColor !== 'all' ||
    currentSize !== 'all' ||
    currentInStock !== 'all' ||
    currentSearch !== '' ||
    (currentMinPrice !== '0' && currentMinPrice !== '') ||
    (currentMaxPrice !== '17000' && currentMaxPrice !== '');

  // UKFashions.pk style category taxonomy
  const categoriesList = [
    { label: 'All Balochi Dresses', value: 'all' },
    { label: 'Balochi Doch Hand-Made', value: 'balochi-dress' },
    { label: 'New Arrivals', value: 'new-arrivals' },
    { label: 'Bridal Balochi', value: 'bridal-couture' },
    { label: 'Party Wear', value: 'party-wear' },
    { label: 'Casual Balochi', value: 'casual-wear' },
    { label: 'Winter Collection', value: 'winter-collection' },
    { label: 'Sale / Last Chance', value: 'sale' }
  ];

  // UKFashions.pk style fabric list
  const fabricsList = [
    'Balochi Hand Embroidery',
    'Silk',
    'Shamoz Silk',
    'Velvet',
    'Chiffon',
    'Organza',
    'Pure Lawn',
    'Cotton',
    'Net',
    'Bona Dora'
  ];

  // UKFashions.pk style color swatches
  const colorSwatches = [
    { name: 'Beige', hex: '#D9C5B2' },
    { name: 'Black', hex: '#000000' },
    { name: 'Blue', hex: '#2563EB' },
    { name: 'Gold', hex: '#F2B705' },
    { name: 'Green', hex: '#16A34A' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Navy', hex: '#14213D' },
    { name: 'Orange', hex: '#EA580C' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Purple', hex: '#9333EA' },
    { name: 'Red', hex: '#C1272D' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Yellow', hex: '#FACC15' }
  ];

  const sizesList = [
    'Free Size',
    'S',
    'M',
    'L',
    'XL',
    'Custom'
  ];

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Best selling', value: 'best-selling' },
    { label: 'Alphabetically A–Z', value: 'a-z' },
    { label: 'Alphabetically Z–A', value: 'z-a' },
    { label: 'Price low→high', value: 'price-low' },
    { label: 'Price high→low', value: 'price-high' },
    { label: 'Date old→new', value: 'oldest' },
    { label: 'Date new→old', value: 'newest' }
  ];

  const getPageTitle = () => {
    if (currentSearch) return `Search Results for "${currentSearch}"`;
    if (currentCategory !== 'all') {
      const match = categoriesList.find(c => c.value === currentCategory);
      return match ? match.label : 'Balochi Collection';
    }
    if (currentFabric !== 'all') return `${currentFabric} Dresses`;
    return 'All Balochi Dresses';
  };

  const renderFiltersSidebar = () => (
    <div className="space-y-6 font-body text-sm">
      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="p-4 bg-[#FAF6EE] rounded-xl border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#14213D] font-heading">
              Active Filters
            </span>
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-[#C1272D] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-white px-2.5 py-1 rounded-full border border-stone-300 font-bold text-[#14213D]">
                {currentCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('category', 'all')} />
              </span>
            )}
            {currentFabric !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-white px-2.5 py-1 rounded-full border border-stone-300 font-bold text-[#14213D]">
                {currentFabric}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('fabric', 'all')} />
              </span>
            )}
            {currentColor !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-white px-2.5 py-1 rounded-full border border-stone-300 font-bold text-[#14213D]">
                {currentColor}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('color', 'all')} />
              </span>
            )}
            {currentSize !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-white px-2.5 py-1 rounded-full border border-stone-300 font-bold text-[#14213D]">
                Size: {currentSize}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('size', 'all')} />
              </span>
            )}
            {currentInStock !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-white px-2.5 py-1 rounded-full border border-stone-300 font-bold text-[#14213D]">
                {currentInStock === 'true' ? 'In stock' : 'Out of stock'}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('inStock', 'all')} />
              </span>
            )}
          </div>
        </div>
      )}

      {/* 1. Price Filter (Min-Max Slider & "The highest price is Rs. 17,000") */}
      <div className="pb-5 border-b border-stone-200">
        <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#14213D] mb-2">
          Price
        </h3>
        <p className="text-xs text-stone-500 mb-3">
          The highest price is <strong className="text-[#14213D]">Rs. 17,000</strong>
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-stone-500 uppercase font-bold block mb-1">From</label>
            <div className="flex items-center bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 focus-within:border-[#F2B705]">
              <span className="text-xs text-stone-400 mr-1">Rs.</span>
              <input
                type="number"
                min="0"
                max="17000"
                value={currentMinPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                placeholder="0"
                className="w-full text-xs text-[#14213D] font-bold focus:outline-none"
              />
            </div>
          </div>
          <span className="text-stone-400 mt-4">-</span>
          <div className="flex-1">
            <label className="text-[10px] text-stone-500 uppercase font-bold block mb-1">To</label>
            <div className="flex items-center bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 focus-within:border-[#F2B705]">
              <span className="text-xs text-stone-400 mr-1">Rs.</span>
              <input
                type="number"
                min="0"
                max="17000"
                value={currentMaxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                placeholder="17000"
                className="w-full text-xs text-[#14213D] font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Availability (In stock / Out of stock) */}
      <div className="pb-5 border-b border-stone-200">
        <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#14213D] mb-3">
          Availability
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-700 hover:text-black">
            <input
              type="radio"
              name="inStockFilter"
              checked={currentInStock === 'all'}
              onChange={() => updateParam('inStock', 'all')}
              className="w-4 h-4 accent-[#14213D]"
            />
            <span>All Items</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-700 hover:text-black">
            <input
              type="radio"
              name="inStockFilter"
              checked={currentInStock === 'true'}
              onChange={() => updateParam('inStock', 'true')}
              className="w-4 h-4 accent-[#14213D]"
            />
            <span>In stock</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-700 hover:text-black">
            <input
              type="radio"
              name="inStockFilter"
              checked={currentInStock === 'false'}
              onChange={() => updateParam('inStock', 'false')}
              className="w-4 h-4 accent-[#14213D]"
            />
            <span>Out of stock</span>
          </label>
        </div>
      </div>

      {/* 3. Fabric Filter */}
      <div className="pb-5 border-b border-stone-200">
        <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#14213D] mb-3">
          Fabric
        </h3>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
          <button
            onClick={() => updateParam('fabric', 'all')}
            className={`flex items-center justify-between w-full text-left text-xs font-semibold py-1 px-2 rounded-md ${
              currentFabric === 'all' ? 'bg-[#F2B705] text-[#14213D] font-extrabold' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>All Fabrics</span>
            {currentFabric === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>
          {fabricsList.map((fab) => {
            const isSelected = currentFabric.toLowerCase() === fab.toLowerCase();
            return (
              <button
                key={fab}
                onClick={() => updateParam('fabric', isSelected ? 'all' : fab)}
                className={`flex items-center justify-between w-full text-left text-xs font-semibold py-1.5 px-2 rounded-md transition-colors ${
                  isSelected ? 'bg-[#F2B705] text-[#14213D] font-extrabold shadow-xs' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{fab}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Color Swatches */}
      <div className="pb-5 border-b border-stone-200">
        <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#14213D] mb-3">
          Color
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {colorSwatches.map((color) => {
            const isSelected = currentColor.toLowerCase() === color.name.toLowerCase();
            return (
              <button
                key={color.name}
                onClick={() => updateParam('color', isSelected ? 'all' : color.name)}
                className={`flex flex-col items-center p-1.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-[#14213D] bg-[#F2B705]/20 shadow-xs'
                    : 'border-transparent hover:border-stone-300'
                }`}
                title={color.name}
              >
                <span
                  className="w-5 h-5 rounded-full border border-stone-300 shadow-xs block relative"
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <Check className={`w-3 h-3 absolute inset-0 m-auto ${['White', 'Yellow', 'Beige'].includes(color.name) ? 'text-black' : 'text-white'}`} />
                  )}
                </span>
                <span className="text-[10px] text-stone-700 mt-1 font-semibold truncate w-full text-center">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Size Chips */}
      <div>
        <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#14213D] mb-3">
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParam('size', 'all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              currentSize === 'all'
                ? 'bg-[#14213D] text-[#F2B705] border-[#14213D]'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
            }`}
          >
            All
          </button>
          {sizesList.map((sz) => {
            const isSelected = currentSize.toLowerCase() === sz.toLowerCase();
            return (
              <button
                key={sz}
                onClick={() => updateParam('size', isSelected ? 'all' : sz)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-[#F2B705] text-[#14213D] border-[#F2B705] shadow-xs'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF6EE] py-8 sm:py-12 font-body">
      <SEO
        title={`${getPageTitle()} | SK Brand Sami Khan Quetta`}
        description="Shop hand-made Balochi Doch dresses, embroidered suits, and fine couture from SK Brand by Sami Khan."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Top Bar */}
        <div className="mb-6">
          <nav className="text-xs text-stone-500 mb-2 font-medium">
            <span>Home</span> / <span className="text-[#14213D] font-bold">{getPageTitle()}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#14213D]">
                {getPageTitle()}
              </h1>
              {/* Product item count (e.g. "81 items") */}
              <p className="text-xs text-stone-600 mt-1 font-semibold">
                Showing <strong className="text-[#14213D]">{pagination.total} items</strong>
              </p>
            </div>

            {/* Sort Dropdown & Mobile Filter Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold text-[#14213D] shadow-sm font-heading"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#F2B705]" />
                Filters {hasActiveFilters && '(Active)'}
              </button>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-stone-600 uppercase font-heading hidden sm:inline">
                  Sort:
                </label>
                <select
                  value={currentSort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-bold text-[#14213D] focus:outline-none focus:border-[#F2B705] shadow-sm font-heading"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout: Left Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Sidebar Filters (ukfashions.pk style) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
                <span className="font-heading font-extrabold text-base text-[#14213D] uppercase tracking-wider flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#F2B705]" />
                  Filter By
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#C1272D] font-bold hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {renderFiltersSidebar()}
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            {isLoading ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center py-24">
                <Loader2 className="w-10 h-10 animate-spin text-[#F2B705] mb-3" />
                <span className="text-sm font-bold text-[#14213D] font-heading">
                  Loading Hand-Made Balochi Catalog...
                </span>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm">
                <SlidersHorizontal className="w-12 h-12 text-[#F2B705] mx-auto mb-3" />
                <h3 className="font-heading text-lg font-bold text-[#14213D] mb-1">
                  No matching garments found
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
                  We could not find any items matching your selected filter criteria. Try clearing some filters or searching for another fabric.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#F2B705] hover:bg-[#D9A404] text-[#14213D] font-extrabold text-xs tracking-wider uppercase rounded-lg shadow-md transition-all font-heading"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2 font-heading">
                    <button
                      disabled={!pagination.hasPrevPage}
                      onClick={() => updateParam('page', String(currentPage - 1))}
                      className="px-4 py-2 rounded-lg bg-white border border-stone-300 text-xs font-bold text-[#14213D] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 shadow-sm"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pNum) => (
                      <button
                        key={pNum}
                        onClick={() => updateParam('page', String(pNum))}
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition-all shadow-sm ${
                          currentPage === pNum
                            ? 'bg-[#14213D] text-[#F2B705]'
                            : 'bg-white text-[#14213D] border border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {pNum}
                      </button>
                    ))}
                    <button
                      disabled={!pagination.hasNextPage}
                      onClick={() => updateParam('page', String(currentPage + 1))}
                      className="px-4 py-2 rounded-lg bg-white border border-stone-300 text-xs font-bold text-[#14213D] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 shadow-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm ml-auto bg-white h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <span className="font-heading font-extrabold text-base text-[#14213D]">
                Filters
              </span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-stone-600 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="py-4">
              {renderFiltersSidebar()}
            </div>
            <div className="mt-auto pt-4 border-t border-stone-200 flex gap-2">
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-1/2 py-2.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-lg uppercase font-heading"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-2.5 bg-[#F2B705] text-[#14213D] font-black text-xs rounded-lg uppercase font-heading shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
