import React, { useState, useEffect } from 'react';
import { Save, Settings, Building2, Truck, MessageCircle, Mail, Phone, Loader2 } from 'lucide-react';
import { StoreSettings } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.getAdminSettings().then(res => {
      if (res.success) {
        setSettings(res.settings);
      }
    }).catch(console.error).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleBankChange = (field: string, value: string) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value
        }
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const res = await api.updateAdminSettings(settings);
      if (res.success) {
        showToast('Store settings updated successfully', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="py-20 flex justify-center text-stone-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#F5B016]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            Store & Business Configuration
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure contact coordinates, WhatsApp numbers, shipping thresholds, and bank accounts.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors shadow disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Configuration
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Contact Coordinates */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-display text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
            Brand Profile & Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => handleChange('brandName', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Official WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="+923001234567"
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Customer Support Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Support Phone Helpline</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Physical Showroom / Atelier Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => handleChange('announcementText', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Shipping Rates & Thresholds */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-display text-base font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#F5B016]" />
            Shipping Rates & Free Delivery Threshold
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Free Worldwide Shipping Threshold (PKR)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 font-bold"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Default: Rs. 10,000</span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Domestic Shipping Fee (Pakistan)
              </label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => handleChange('standardShippingFee', Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 font-bold"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Default: Rs. 350</span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                International Express Courier Fee
              </label>
              <input
                type="number"
                value={settings.internationalShippingFee}
                onChange={(e) => handleChange('internationalShippingFee', Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 font-bold"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Default: Rs. 3,500</span>
            </div>
          </div>
        </div>

        {/* Verified Business Bank Account Details */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-display text-base font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#F5B016]" />
            Bank Transfer Details (Displayed on Invoice)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={settings.bankDetails.bankName}
                onChange={(e) => handleBankChange('bankName', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Account Title</label>
              <input
                type="text"
                value={settings.bankDetails.accountTitle}
                onChange={(e) => handleBankChange('accountTitle', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Account Number</label>
              <input
                type="text"
                value={settings.bankDetails.accountNumber}
                onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">International IBAN</label>
              <input
                type="text"
                value={settings.bankDetails.iban}
                onChange={(e) => handleBankChange('iban', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 font-mono"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

