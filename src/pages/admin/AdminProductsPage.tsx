import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, AlertCircle, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { formatPrice } from '../../utils/formatters.ts';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminProductsPage: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProducts({ limit: 100 });
      if (res.success) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await api.deleteProduct(productToDelete.id);
      if (res.success) {
        showToast(res.message, 'success');
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
        setProductToDelete(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.fabric.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            Product Catalog Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your unstitched suits, luxury pret, sizes, and pricing.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors shadow"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by suit name, fabric, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-700 focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="formal-wear">Formal Wear</option>
            <option value="casual-wear">Casual Wear</option>
            <option value="party-wear">Party Wear</option>
            <option value="luxury-pret">Luxury Pret</option>
            <option value="bridal-couture">Bridal Couture</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#F5B016]" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-4">Article</th>
                  <th className="p-4">Fabric</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (PKR)</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-16 object-cover rounded bg-stone-100 shrink-0 border border-stone-200"
                        />
                        <div className="min-w-0 max-w-xs">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="font-bold text-stone-900 hover:text-[#F5B016] block truncate"
                          >
                            {product.name}
                          </Link>
                          <span className="font-mono text-[11px] text-stone-400">
                            {product.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-stone-800">{product.fabric}</td>
                    <td className="p-4 capitalize">{product.category.replace('-', ' ')}</td>
                    <td className="p-4">
                      <div className="font-bold text-stone-900">
                        {formatPrice(product.salePrice || product.price)}
                      </div>
                      {product.salePrice && (
                        <div className="text-[10px] text-stone-400 line-through">
                          {formatPrice(product.price)}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        product.stock <= 0
                          ? 'bg-rose-100 text-rose-800'
                          : product.stock <= product.lowStockThreshold
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-800">
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/product/${product.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
                          title="View on store"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-stone-600 hover:text-black transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setProductToDelete(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-display text-lg font-bold text-stone-900">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>"{productToDelete.name}"</strong>? This action cannot be reversed.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

