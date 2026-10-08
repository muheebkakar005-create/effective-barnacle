import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Edit2, Loader2, X, CheckCircle2 } from 'lucide-react';
import { Coupon } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { formatPrice, formatDate } from '../../utils/formatters.ts';

export const AdminCouponsPage: React.FC = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    amount: 10,
    minOrder: 3000,
    maxDiscount: 1500,
    startDate: new Date().toISOString().slice(0, 10),
    expiryDate: '2026-12-31',
    usageLimit: 500,
    active: true
  });

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminCoupons();
      if (res.success) {
        setCoupons(res.coupons);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      amount: 10,
      minOrder: 3000,
      maxDiscount: 1500,
      startDate: new Date().toISOString().slice(0, 10),
      expiryDate: '2026-12-31',
      usageLimit: 500,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      amount: c.amount,
      minOrder: c.minOrder,
      maxDiscount: c.maxDiscount,
      startDate: c.startDate ? c.startDate.slice(0, 10) : '',
      expiryDate: c.expiryDate ? c.expiryDate.slice(0, 10) : '',
      usageLimit: c.usageLimit,
      active: c.active
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code?.trim()) return;

    try {
      if (editingCoupon) {
        const res = await api.updateCoupon(editingCoupon.id, formData);
        if (res.success) {
          showToast('Coupon updated', 'success');
          setIsModalOpen(false);
          fetchCoupons();
        }
      } else {
        const res = await api.createCoupon(formData);
        if (res.success) {
          showToast('Coupon created', 'success');
          setIsModalOpen(false);
          fetchCoupons();
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete coupon code?')) return;
    try {
      const res = await api.deleteCoupon(id);
      if (res.success) {
        showToast(res.message, 'success');
        fetchCoupons();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete coupon', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            Coupons & Promotional Discounts
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure discount vouchers, usage thresholds, and active promotional campaigns.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors shadow"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#F5B016]" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No coupon codes active.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-4">Coupon Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Min Order</th>
                  <th className="p-4">Usage</th>
                  <th className="p-4">Validity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-stone-900 text-sm">
                      {coupon.code}
                    </td>
                    <td className="p-4 font-semibold text-stone-900">
                      {coupon.discountType === 'percentage' ? `${coupon.amount}% OFF` : formatPrice(coupon.amount)}
                      {coupon.maxDiscount && (
                        <span className="text-[10px] text-stone-400 block font-normal">
                          Max Cap: {formatPrice(coupon.maxDiscount)}
                        </span>
                      )}
                    </td>
                    <td className="p-4">{formatPrice(coupon.minOrder)}</td>
                    <td className="p-4 font-mono">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </td>
                    <td className="p-4 text-stone-500">
                      Until {formatDate(coupon.expiryDate)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        coupon.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(coupon)}
                          className="p-1.5 text-stone-600 hover:text-black rounded"
                          title="Edit coupon"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                          title="Delete coupon"
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

      {/* Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-display text-lg font-bold text-stone-900">
                {editingCoupon ? 'Edit Coupon' : 'Create New Promo Code'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. EID20"
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 uppercase font-mono font-bold focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as any }))}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 font-medium"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.amount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Min Order (PKR)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrder || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrder: Number(e.target.value) }))}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Max Discount Cap
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: Number(e.target.value) }))}
                    placeholder="Optional cap"
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit || 1000}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.active)}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="w-4 h-4 accent-black rounded"
                />
                <span className="font-bold text-stone-900">Active and redeemable</span>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-black text-white rounded font-semibold uppercase tracking-wider"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

