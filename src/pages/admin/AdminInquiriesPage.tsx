import React, { useState, useEffect } from 'react';
import { Mail, Check, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { ContactMessage } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { formatDate } from '../../utils/formatters.ts';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminInquiriesPage: React.FC = () => {
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminInquiries();
      if (res.success) {
        setInquiries(res.inquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'unread' | 'read' | 'replied') => {
    try {
      const res = await api.updateInquiryStatus(id, status);
      if (res.success) {
        showToast(`Inquiry marked as ${status}`);
        setInquiries(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-stone-900">
          Client Inquiries & Custom Styling Requests
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Messages submitted through the public Contact Concierge form.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#F5B016]" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No inquiries received yet.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 text-xs">
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-6 space-y-3 hover:bg-stone-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">
                      {inq.name}
                    </h3>
                    <span className="text-stone-500">
                      Email: <strong className="text-stone-800">{inq.email}</strong> â€¢ Phone: {inq.phone || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-stone-400 text-[11px]">
                      {formatDate(inq.createdAt)}
                    </span>
                    <select
                      value={inq.status}
                      onChange={(e) => handleUpdateStatus(inq.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded text-xs font-bold border ${
                        inq.status === 'replied'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : inq.status === 'read'
                          ? 'bg-stone-100 text-stone-800 border-stone-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 leading-relaxed font-sans">
                  "{inq.message}"
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

