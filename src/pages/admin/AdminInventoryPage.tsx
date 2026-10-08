import React, { useState, useEffect } from 'react';
import { Warehouse, AlertTriangle, CheckCircle2, Save, Loader2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminInventoryPage: React.FC = () => {
  const { showToast } = useToast();
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stockEdits, setStockEdits] = useState<{ [id: string]: number }>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminInventory();
      if (res.success) {
        setInventory(res.inventory);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (id: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setStockEdits(prev => ({ ...prev, [id]: num }));
    }
  };

  const handleSaveStock = async (id: string) => {
    const newStock = stockEdits[id];
    if (newStock === undefined) return;

    setSavingId(id);
    try {
      const res = await api.updateInventoryStock(id, { stock: newStock });
      if (res.success) {
        showToast('Inventory stock updated', 'success');
        setInventory(prev => prev.map(item => item.id === id ? { ...item, stock: newStock } : item));
        setStockEdits(prev => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const lowStockCount = inventory.filter(i => i.stock <= i.lowStockThreshold).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            Real-Time Inventory & Stock Depletion
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor real-time warehouse allocations, restock thresholds, and prevent stockouts.
          </p>
        </div>

        {lowStockCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{lowStockCount} articles requiring restock</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#F5B016]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-4">Suit Article</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4">Current Units</th>
                  <th className="p-4">Adjust Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {inventory.map((item) => {
                  const isLow = item.stock <= item.lowStockThreshold;
                  const isOut = item.stock <= 0;
                  const editValue = stockEdits[item.id] !== undefined ? stockEdits[item.id] : item.stock;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isOut
                          ? 'bg-rose-50/50 hover:bg-rose-50'
                          : isLow
                          ? 'bg-amber-50/40 hover:bg-amber-50'
                          : 'hover:bg-stone-50/80'
                      }`}
                    >
                      <td className="p-4">
                        <strong className="text-stone-900 block font-semibold">{item.name}</strong>
                        <span className="text-[11px] text-stone-400">{item.fabric}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-stone-800">{item.sku}</td>
                      <td className="p-4 capitalize">{item.category.replace('-', ' ')}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          isOut
                            ? 'bg-rose-100 text-rose-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.stockStatus}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-stone-900 text-sm">
                        {item.stock} pcs
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          min="0"
                          value={editValue}
                          onChange={(e) => handleStockChange(item.id, e.target.value)}
                          className="w-24 bg-white border border-stone-300 rounded px-2.5 py-1 text-xs font-bold text-stone-900 focus:outline-none focus:border-black"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleSaveStock(item.id)}
                          disabled={stockEdits[item.id] === undefined || savingId === item.id}
                          className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded transition-colors disabled:opacity-30 inline-flex items-center gap-1.5"
                        >
                          {savingId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

