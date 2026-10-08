import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, ShoppingBag, Loader2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import { formatPrice, formatDate } from '../../utils/formatters.ts';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.getAdminCustomers();
        if (res.success) {
          setCustomers(res.customers);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-stone-900">
          Client Directory
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Registered customer accounts, lifetime order history, and cumulative spending.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#F5B016]" />
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No customer accounts registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4 text-right">Lifetime Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-800">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-stone-900 block">{cust.name}</strong>
                          <span className="text-[11px] text-stone-400">ID: {cust.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="flex items-center gap-1.5 text-stone-700">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          {cust.email}
                        </span>
                        {cust.phone && (
                          <span className="flex items-center gap-1.5 text-stone-500">
                            <Phone className="w-3.5 h-3.5 text-stone-400" />
                            {cust.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-stone-500">{formatDate(cust.createdAt)}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 font-semibold text-stone-800">
                        <ShoppingBag className="w-3 h-3 text-[#F5B016]" />
                        {cust.orderCount} orders
                      </span>
                    </td>
                    <td className="p-4 text-right font-display text-sm font-bold text-black font-sans">
                      {formatPrice(cust.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

