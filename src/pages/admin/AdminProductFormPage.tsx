import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Sparkles, Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [presets, setPresets] = useState<Array<{ title: string; url: string }>>([]);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    category: 'formal-wear',
    fabric: 'Chiffon',
    sku: '',
    price: 4500,
    salePrice: undefined,
    costPrice: 2500,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop'],
    colors: ['Deep Crimson'],
    sizes: ['S', 'M', 'L'],
    stock: 25,
    lowStockThreshold: 5,
    status: 'active',
    featured: false,
    seo: {
      metaTitle: '',
      metaDescription: ''
    }
  });

  const [newColor, setNewColor] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    // Load presets
    api.getImagePresets().then(res => {
      if (res.success) setPresets(res.presets);
    }).catch(console.error);

    if (isEditMode && id) {
      api.getProduct(id).then(res => {
        if (res.success && res.product) {
          setFormData(res.product);
        }
      }).catch(err => {
        showToast('Error loading product details', 'error');
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddImage = (url: string) => {
    if (!url.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), url.trim()]
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddColor = () => {
    if (!newColor.trim()) return;
    setFormData(prev => ({
      ...prev,
      colors: [...(prev.colors || []), newColor.trim()]
    }));
    setNewColor('');
  };

  const handleToggleSize = (size: string) => {
    setFormData(prev => {
      const current = prev.sizes || [];
      if (current.includes(size)) {
        return { ...prev, sizes: current.filter(s => s !== size) };
      } else {
        return { ...prev, sizes: [...current, size] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.price) {
      showToast('Name, SKU, and Price are mandatory', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditMode && id) {
        const res = await api.updateProduct(id, formData);
        if (res.success) {
          showToast('Product updated successfully!', 'success');
          navigate('/admin/products');
        }
      } else {
        const res = await api.createProduct(formData);
        if (res.success) {
          showToast('Product created successfully!', 'success');
          navigate('/admin/products');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center text-stone-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#F5B016]" />
      </div>
    );
  }

  const allAvailableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Unstitched'];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-stone-900">
              {isEditMode ? `Edit: ${formData.name}` : 'Create New Luxury Article'}
            </h1>
            <p className="text-xs text-stone-500">
              Configure product imagery, attributes, stock allocations, and pricing.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors shadow disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Article
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* General Information Card */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              General Information
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Article Title *
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="e.g. 3Pc Embroidered Chiffon Suit - Royal Crimson"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  SKU (Stock Keeping Unit) *
                </label>
                <input
                  type="text"
                  required
                  name="sku"
                  value={formData.sku || ''}
                  onChange={handleChange}
                  placeholder="e.g. SK-CHF-001"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleChange}
                  placeholder="auto-generated-if-empty"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Short Teaser Description
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription || ''}
                onChange={handleChange}
                placeholder="Brief one-line summary for cards and search"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Description & Craftsmanship Details
              </label>
              <textarea
                rows={5}
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Describe needlework, organza borders, dupattas, embellishments, and washing instructions..."
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black leading-relaxed"
              />
            </div>
          </div>

          {/* Imagery Gallery Card */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center justify-between">
              <span>Product Photography</span>
              <span className="text-xs text-stone-400 font-normal">{(formData.images || []).length} images</span>
            </h3>

            {/* Current Images Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(formData.images || []).map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-stone-200 bg-stone-50 group">
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[9px] font-bold uppercase tracking-wider">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Image URL */}
            <div className="flex gap-2 pt-2">
              <input
                type="url"
                placeholder="Paste high-res image URL (e.g. https://...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => handleAddImage(imageUrlInput)}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-black transition-colors shrink-0"
              >
                Add Image
              </button>
            </div>

            {/* Quick Presets Gallery Selector */}
            {presets.length > 0 && (
              <div className="pt-3 border-t border-stone-100">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  One-Click Curated Luxury Presets:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddImage(preset.url)}
                      className="shrink-0 p-1 bg-stone-50 hover:bg-stone-100 rounded border border-stone-200 flex items-center gap-2 text-[11px] text-stone-700"
                    >
                      <img src={preset.url} alt="" className="w-6 h-8 object-cover rounded" />
                      <span>{preset.title}</span>
                      <Plus className="w-3 h-3 text-[#F5B016]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Cost Structure */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Pricing Structure (PKR)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Regular Retail Price *
                </label>
                <input
                  type="number"
                  required
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sale / Promotional Price
                </label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice || ''}
                  onChange={handleChange}
                  placeholder="Optional discount price"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Internal Cost Price
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice || ''}
                  onChange={handleChange}
                  placeholder="Atelier stitching cost"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black text-stone-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Classification & Fabrics */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Attributes
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black cursor-pointer font-medium"
              >
                <option value="formal-wear">Formal Wear</option>
                <option value="casual-wear">Casual Wear</option>
                <option value="party-wear">Party Wear</option>
                <option value="luxury-pret">Luxury Pret</option>
                <option value="bridal-couture">Bridal Couture</option>
                <option value="new-arrivals">New Arrivals</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Textile / Fabric *
              </label>
              <select
                name="fabric"
                value={formData.fabric}
                onChange={handleChange}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black cursor-pointer font-medium"
              >
                <option value="Chiffon">Pure Chiffon</option>
                <option value="Lawn">Festive Lawn</option>
                <option value="Organza">Embroidered Organza</option>
                <option value="Silk">Raw Silk</option>
                <option value="Velvet">Micro Velvet</option>
                <option value="Cotton">Cotton Silk</option>
                <option value="Net">Embroidered Net</option>
              </select>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allAvailableSizes.map((s) => {
                  const isSelected = (formData.sizes || []).includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleToggleSize(s)}
                      className={`px-3 py-1 rounded text-xs border font-semibold transition-colors ${
                        isSelected
                          ? 'bg-black text-white border-black'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-black'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Colors
              </label>
              <div className="flex gap-1.5 flex-wrap mb-2">
                {(formData.colors || []).map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-stone-100 border border-stone-200 text-xs text-stone-800">
                    {c}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, colors: (prev.colors || []).filter((_, idx) => idx !== i) }))}
                      className="text-stone-400 hover:text-rose-600"
                    >
                      Ã—
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add color..."
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-300 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-3 py-1 bg-stone-900 text-white text-xs font-semibold rounded hover:bg-black"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Inventory & Status */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Inventory & Visibility
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Current Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock || 0}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Low Stock Alert
                </label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold || 5}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Publishing Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black font-semibold"
              >
                <option value="active">Active (Visible on Store)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <label className="flex items-center gap-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={Boolean(formData.featured)}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 accent-black rounded"
              />
              <span className="text-xs font-bold text-stone-900">
                Feature on Homepage Showcase
              </span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

