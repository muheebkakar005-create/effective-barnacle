import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { formatPrice, formatDate } from '../../utils/formatters.ts';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getAdminDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3 text-stone-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#F5B016]" />
        <span className="text-xs uppercase font-semibold">Loading Store Analytics...</span>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const topProducts = data?.topProducts || [];
  const salesTrend = data?.salesTrend || [];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
          Executive Dashboard
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Real-time metrics for orders, revenue, inventory, and customer activity.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-stone-950 truncate">
            {formatPrice(stats.totalSales || 0)}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Completed & Verified</span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-stone-700" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-stone-950">
            {stats.totalOrders || 0}
          </div>
          <span className="text-[10px] text-stone-500 font-medium">All historical orders</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-amber-700">
            {stats.pendingOrders || 0}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Requires verification</span>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-stone-950">
            {stats.totalCustomers || 0}
          </div>
          <span className="text-[10px] text-stone-500 font-medium">Registered clientele</span>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Catalog Suits</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-stone-950">
            {stats.totalProducts || 0}
          </div>
          <span className="text-[10px] text-stone-500 font-medium">Pret & unstitched</span>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-rose-600">
            {stats.lowStockCount || 0}
          </div>
          <span className="text-[10px] text-rose-600 font-medium">Near threshold</span>
        </div>
      </div>

      {/* Two Column Section: Sales Trend / Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Trend Chart (Col 7) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-display text-base font-bold text-stone-900">
                Revenue Trajectory
              </h3>
              <p className="text-[11px] text-stone-500">Order volumes across recent sales records</p>
            </div>
          </div>

          {salesTrend.length > 0 ? (
            <div className="pt-4 space-y-4">
              <div className="flex items-end gap-3 h-48 pt-6 pb-2 border-b border-stone-200">
                {salesTrend.map((t: any, i: number) => {
                  const maxAmt = Math.max(...salesTrend.map((x: any) => x.amount), 1);
                  const heightPercent = Math.max(10, Math.round((t.amount / maxAmt) * 100));

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-7 text-[10px] bg-stone-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {formatPrice(t.amount)}
                      </div>
                      <div
                        className="w-full bg-[#F5B016] rounded-t-sm group-hover:bg-stone-900 transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[9px] text-stone-400 truncate w-full text-center">
                        {t.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-400 py-12 text-center">No trend data recorded yet.</p>
          )}
        </div>

        {/* Top Selling Articles (Col 5) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-display text-base font-bold text-stone-900">
              Top Selling Articles
            </h3>
            <span className="text-[11px] text-stone-400">Ranked by volume</span>
          </div>

          <div className="divide-y divide-stone-100">
            {topProducts.length > 0 ? (
              topProducts.map((p: any, idx: number) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-bold text-stone-400 text-xs w-4">#{idx + 1}</span>
                    <img src={p.image} alt={p.name} className="w-10 h-14 object-cover rounded bg-stone-100 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-stone-900 truncate">{p.name}</h4>
                      <span className="text-[11px] text-stone-500">{p.quantity} units sold</span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 font-sans shrink-0">
                    {formatPrice(p.revenue)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-8 text-center">No articles sold yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-stone-900">
              Recent Store Orders
            </h3>
            <p className="text-xs text-stone-500">Incoming requests awaiting processing or dispatch</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-[#F5B016] hover:text-black flex items-center gap-1 uppercase tracking-wider"
          >
            Manage All Orders
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-black">{order.orderNumber}</td>
                  <td className="p-4">
                    <span className="font-semibold text-stone-900 block">{order.customerInfo.firstName} {order.customerInfo.lastName}</span>
                    <span className="text-[11px] text-stone-400">{order.customerInfo.email}</span>
                  </td>
                  <td className="p-4 text-stone-500">{formatDate(order.createdAt)}</td>
                  <td className="p-4">{order.items?.length || 0} pcs</td>
                  <td className="p-4 font-bold text-stone-900">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.paymentStatus === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to="/admin/orders"
                      className="text-[#F5B016] hover:text-black font-semibold text-xs"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

