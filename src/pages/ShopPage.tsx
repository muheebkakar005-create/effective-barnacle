import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, X, ChevronDown, Check, SlidersHorizontal, RotateCcw, Loader2 } from 'lucide-react';
import { Product, Facets, Pagination } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ProductCard } from '../components/product/ProductCard.tsx';
import { QuickViewModal } from '../components/product/QuickViewModal.tsx';
import { SEO } from '../components/common/SEO.tsx';
import { formatPrice } from '../utils/formatters.ts';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
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
    maxPrice: 20000
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
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchShopProducts = async () => {
      setIsLoading(true);
      try {
        const query: Record<string, any> = {
          page: currentPage,
          limit: 12,
          sort: currentSort
        };

        if (currentCategory !== 'all') query.category = currentCategory;
        if (currentFabric !== 'all') query.fabric = currentFabric;
        if (currentColor !== 'all') query.color = currentColor;
        if (currentSize !== 'all') query.size = currentSize;
        if (currentInStock !== 'all') query.inStock = currentInStock;
        if (currentSearch) query.search = currentSearch;
        if (currentMinPrice) query.minPrice = currentMinPrice;
        if (currentMaxPrice) query.maxPrice = currentMaxPrice;

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
    next.set('page', '1'); // Reset to page 1 on filter change
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
    currentMinPrice !== '' ||
    currentMaxPrice !== '';

  const categoriesList = [
    { label: 'All Collections', value: 'all' },
    { label: 'New Arrivals', value: 'new-arrivals' },
    { label: 'Formal Wear', value: 'formal-wear' },
    { label: 'Casual Wear', value: 'casual-wear' },
    { label: 'Party Wear', value: 'party-wear' },
    { label: 'Luxury Pret', value: 'luxury-pret' },
    { label: 'Bridal Couture', value: 'bridal-couture' }
  ];

  const fabricsList = [
    'Cotton',
    'Lawn',
    'Chiffon',
    'Organza',
    'Silk',
    'Velvet'
  ];

  const sizesList = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Unstitched'];

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Most Relevant', value: 'featured' },
    { label: 'Best Selling', value: 'best-selling' },
    { label: 'Alphabetically: A-Z', value: 'a-z' },
    { label: 'Alphabetically: Z-A', value: 'z-a' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Date: New to Old', value: 'newest' },
    { label: 'Date: Old to New', value: 'oldest' }
  ];

  const getPageTitle = () => {
    if (currentSearch) return `Search Results for "${currentSearch}"`;
    if (currentCategory !== 'all') {
      const match = categoriesList.find(c => c.value === currentCategory);
      return match ? match.label : 'Collection';
    }
    if (currentFabric !== 'all') return `${currentFabric} Collection`;
    return 'All Products';
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] py-8 sm:py-12">
      <SEO
        title={`${getPageTitle()} | SK Brands Luxury Pret`}
        description="Browse SK Brands collection of premium Pakistani unstitched and stitched suits. Embroidered chiffon, lawn, organza, silk, and bridal couture."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <nav className="text-xs text-stone-500 mb-2">
            <span>Home</span> / <span className="text-stone-900 font-semibold">{getPageTitle()}</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-normal text-stone-950">
                {getPageTitle()}
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Showing {products.length} of {pagination.total} luxury articles
              </p>
            </div>

            {/* Sort & Mobile Filter Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded text-xs font-semibold text-stone-800 shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#F5B016]" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
                <select
                  value={currentSort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="bg-white border border-stone-300 rounded px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-500 cursor-pointer shadow-xs"
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

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap pt-4">
              <span className="text-xs font-semibold text-stone-600">Active Filters:</span>

              {currentCategory !== 'all' && (
                <button
                  onClick={() => updateParam('category', 'all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200 text-stone-800 rounded-full text-xs hover:bg-stone-300 transition-colors"
                >
                  Category: {currentCategory}
                  <X className="w-3 h-3" />
                </button>
              )}

              {currentFabric !== 'all' && (
                <button
                  onClick={() => updateParam('fabric', 'all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200 text-stone-800 rounded-full text-xs hover:bg-stone-300 transition-colors"
                >
                  Fabric: {currentFabric}
                  <X className="w-3 h-3" />
                </button>
              )}

              {currentColor !== 'all' && (
                <button
                  onClick={() => updateParam('color', 'all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200 text-stone-800 rounded-full text-xs hover:bg-stone-300 transition-colors"
                >
                  Color: {currentColor}
                  <X className="w-3 h-3" />
                </button>
              )}

              {currentSize !== 'all' && (
                <button
                  onClick={() => updateParam('size', 'all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200 text-stone-800 rounded-full text-xs hover:bg-stone-300 transition-colors"
                >
                  Size: {currentSize}
                  <X className="w-3 h-3" />
                </button>
              )}

              {currentInStock !== 'all' && (
                <button
                  onClick={() => updateParam('inStock', 'all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200 text-stone-800 rounded-full text-xs hover:bg-stone-300 transition-colors"
                >
                  Stock: {currentInStock === 'true' ? 'In Stock' : 'Out of Stock'}
                  <X className="w-3 h-3" />
                </button>
              )}

              {currentSearch && (
                <button
                  onClick={() => updateParam('search', '')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200 text-stone-800 rounded-full text-xs hover:bg-stone-300 transition-colors"
                >
                  Search: "{currentSearch}"
                  <X className="w-3 h-3" />
                </button>
              )}

              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#F5B016] hover:underline ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Layout: Sidebar Filter (Desktop) + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-8 bg-white p-6 rounded-lg border border-stone-200 shadow-xs h-fit sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-display text-lg font-bold text-stone-900 tracking-wide">
                FILTERS
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#F5B016] hover:text-black font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                Category
              </h4>
              <ul className="space-y-2 text-xs">
                {categoriesList.map((cat) => (
                  <li key={cat.value}>
                    <button
                      onClick={() => updateParam('category', cat.value)}
                      className={`flex items-center justify-between w-full text-left transition-colors ${
                        currentCategory === cat.value
                          ? 'font-bold text-black'
                          : 'text-stone-600 hover:text-black'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {currentCategory === cat.value && <Check className="w-3.5 h-3.5 text-[#F5B016]" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fabric Filter */}
            <div className="pt-6 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                Fabric
              </h4>
              <ul className="space-y-2 text-xs">
                <li key="all-fabrics">
                  <button
                    onClick={() => updateParam('fabric', 'all')}
                    className={`flex items-center justify-between w-full text-left transition-colors ${
                      currentFabric === 'all' ? 'font-bold text-black' : 'text-stone-600 hover:text-black'
                    }`}
                  >
                    <span>All Fabrics</span>
                    {currentFabric === 'all' && <Check className="w-3.5 h-3.5 text-[#F5B016]" />}
                  </button>
                </li>
                {fabricsList.map((fab) => (
                  <li key={fab}>
                    <button
                      onClick={() => updateParam('fabric', fab)}
                      className={`flex items-center justify-between w-full text-left transition-colors ${
                        currentFabric.toLowerCase() === fab.toLowerCase()
                          ? 'font-bold text-black'
                          : 'text-stone-600 hover:text-black'
                      }`}
                    >
                      <span>{fab}</span>
                      {currentFabric.toLowerCase() === fab.toLowerCase() && (
                        <Check className="w-3.5 h-3.5 text-[#F5B016]" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Filter */}
            <div className="pt-6 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                Size
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateParam('size', 'all')}
                  className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                    currentSize === 'all'
                      ? 'bg-black text-white border-black font-semibold'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-black'
                  }`}
                >
                  All
                </button>
                {sizesList.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateParam('size', sz)}
                    className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                      currentSize.toUpperCase() === sz.toUpperCase()
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability / Stock */}
            <div className="pt-6 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                Availability
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => updateParam('inStock', 'all')}
                    className={`flex items-center justify-between w-full text-left ${
                      currentInStock === 'all' ? 'font-bold text-black' : 'text-stone-600'
                    }`}
                  >
                    <span>All Products</span>
                    {currentInStock === 'all' && <Check className="w-3.5 h-3.5 text-[#F5B016]" />}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => updateParam('inStock', 'true')}
                    className={`flex items-center justify-between w-full text-left ${
                      currentInStock === 'true' ? 'font-bold text-black' : 'text-stone-600'
                    }`}
                  >
                    <span>In Stock</span>
                    {currentInStock === 'true' && <Check className="w-3.5 h-3.5 text-[#F5B016]" />}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => updateParam('inStock', 'false')}
                    className={`flex items-center justify-between w-full text-left ${
                      currentInStock === 'false' ? 'font-bold text-black' : 'text-stone-600'
                    }`}
                  >
                    <span>Out of Stock</span>
                    {currentInStock === 'false' && <Check className="w-3.5 h-3.5 text-[#F5B016]" />}
                  </button>
                </li>
              </ul>
            </div>

            {/* Price Filter */}
            <div className="pt-6 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                Price (PKR)
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={currentMinPrice}
                    onChange={(e) => updateParam('minPrice', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-stone-500"
                  />
                  <span className="text-stone-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={currentMaxPrice}
                    onChange={(e) => updateParam('maxPrice', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-stone-500"
                  />
                </div>
                {(currentMinPrice || currentMaxPrice) && (
                  <button
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.delete('minPrice');
                      next.delete('maxPrice');
                      setSearchParams(next);
                    }}
                    className="text-[11px] text-[#F5B016] hover:underline"
                  >
                    Reset Price
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Product Grid Area (3 or 4 per row depending on viewport) */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="h-96 flex flex-col items-center justify-center text-stone-400 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#F5B016]" />
                <span className="text-xs tracking-wider uppercase font-semibold">Loading Collection...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg border border-stone-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-bold text-stone-900">
                  No products found
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  We could not find any products matching your selected filter criteria. Try clearing some filters or searching for other fabrics.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-stone-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div>
                {/* 4 products per row large desktop, 3 tablet, 2 mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
                  <div className="mt-12 flex items-center justify-center gap-2 pt-6 border-t border-stone-200">
                    <button
                      onClick={() => updateParam('page', String(currentPage - 1))}
                      disabled={!pagination.hasPrevPage}
                      className="px-4 py-2 rounded border border-stone-300 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-40 transition-colors"
                    >
                      Previous
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pNum) => (
                      <button
                        key={pNum}
                        onClick={() => updateParam('page', String(pNum))}
                        className={`w-9 h-9 rounded text-xs font-bold transition-colors ${
                          pNum === currentPage
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {pNum}
                      </button>
                    ))}

                    <button
                      onClick={() => updateParam('page', String(currentPage + 1))}
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 rounded border border-stone-300 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-40 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-display text-lg font-bold text-stone-900">
                FILTERS
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-stone-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-6 flex-1">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
                  Category
                </h4>
                <div className="flex flex-col space-y-2 text-xs">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        updateParam('category', cat.value);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`text-left py-1 ${
                        currentCategory === cat.value ? 'font-bold text-black' : 'text-stone-600'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
                  Fabric
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {fabricsList.map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        updateParam('fabric', f);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`px-3 py-1 rounded border ${
                        currentFabric.toLowerCase() === f.toLowerCase()
                          ? 'bg-black text-white font-bold'
                          : 'bg-white text-stone-700 border-stone-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
                  Size
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {sizesList.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        updateParam('size', s);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`px-3 py-1 rounded border ${
                        currentSize.toUpperCase() === s.toUpperCase()
                          ? 'bg-black text-white font-bold'
                          : 'bg-white text-stone-700 border-stone-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-2">
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-1/2 py-2.5 border border-stone-300 text-xs font-semibold rounded text-stone-800"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-2.5 bg-black text-white text-xs font-semibold rounded"
              >
                Apply Filters
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

