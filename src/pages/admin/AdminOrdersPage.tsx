import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle2, Clock, Truck, ShieldCheck, X, Plus, Loader2 } from 'lucide-react';
import { Order } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { formatPrice, formatDate } from '../../utils/formatters.ts';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminOrdersPage: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status update inputs
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminOrders();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus);
    setTrackingNumberInput(order.trackingNumber || '');
    setCarrierInput(order.shippingCarrier || 'DHL Express Worldwide');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const res = await api.updateOrderStatus(selectedOrder.id, {
        orderStatus: newOrderStatus,
        paymentStatus: newPaymentStatus,
        trackingNumber: trackingNumberInput,
        shippingCarrier: carrierInput,
        note: newNoteText.trim() ? newNoteText.trim() : undefined
      });

      if (res.success && res.order) {
        showToast('Order updated successfully', 'success');
        setSelectedOrder(res.order);
        setOrders(prev => prev.map(o => o.id === res.order.id ? res.order : o));
        setNewNoteText('');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNoteOnly = async () => {
    if (!selectedOrder || !newNoteText.trim()) return;
    try {
      const res = await api.addOrderNote(selectedOrder.id, newNoteText.trim());
      if (res.success) {
        showToast('Note added', 'success');
        setSelectedOrder(prev => prev ? {
          ...prev,
          notes: [...prev.notes, res.note]
        } : null);
        setNewNoteText('');
        fetchOrders();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add note', 'error');
    }
  };

  const filteredOrders = orders.filter(o => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerInfo.firstName.toLowerCase().includes(q) ||
      o.customerInfo.lastName.toLowerCase().includes(q) ||
      o.customerInfo.email.toLowerCase().includes(q) ||
      o.customerInfo.phone.includes(q);

    const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-stone-900">
          Order Management & Verification
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Verify manual bank transfers, update fulfillment stages, and issue tracking IDs.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Order #, customer name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-700 focus:outline-none focus:border-black cursor-pointer font-medium"
          >
            <option value="all">All Order Statuses</option>
            <option value="Pending Payment">Pending Payment</option>
            <option value="Processing">Processing (Payment Verified)</option>
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#F5B016]" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Articles</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-black">{order.orderNumber}</td>
                    <td className="p-4">
                      <span className="font-semibold text-stone-900 block">
                        {order.customerInfo.firstName} {order.customerInfo.lastName}
                      </span>
                      <span className="text-[11px] text-stone-400 block">{order.customerInfo.email}</span>
                      <span className="text-[10px] text-stone-500 font-mono">{order.customerInfo.phone}</span>
                    </td>
                    <td className="p-4 text-stone-500">{formatDate(order.createdAt)}</td>
                    <td className="p-4">{order.items?.length || 0} items</td>
                    <td className="p-4 font-bold text-stone-900 font-sans">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.paymentStatus === 'Failed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openOrderModal(order)}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded transition-colors"
                      >
                        Manage Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details & Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#F5B016] uppercase">
                  Order Inspector
                </span>
                <h3 className="font-display text-2xl font-bold text-stone-900">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-stone-400 hover:text-black rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control Panel */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase text-[10px] mb-1">
                  Update Order Status
                </label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded p-2 text-xs font-semibold"
                >
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Processing">Processing (Payment Verified)</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase text-[10px] mb-1">
                  Update Payment Status
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded p-2 text-xs font-semibold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid (Verified)</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase text-[10px] mb-1">
                  Courier Tracking #
                </label>
                <input
                  type="text"
                  placeholder="e.g. DHL-9842109"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase text-[10px] mb-1">
                  Shipping Carrier
                </label>
                <input
                  type="text"
                  placeholder="e.g. DHL Express Worldwide / TCS"
                  value={carrierInput}
                  onChange={(e) => setCarrierInput(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded p-2 text-xs"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="px-5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Saving Changes...' : 'Save Order & Payment Status'}
                </button>
              </div>
            </div>

            {/* Customer & Delivery Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 uppercase text-[10px] block mb-2">
                  Customer Profile
                </span>
                <p className="font-semibold text-stone-900">
                  {selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}
                </p>
                <p className="text-stone-600">Email: {selectedOrder.customerInfo.email}</p>
                <p className="text-stone-600">Phone: {selectedOrder.customerInfo.phone}</p>
                <p className="text-stone-500 pt-1">Method: {selectedOrder.paymentMethod}</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 uppercase text-[10px] block mb-2">
                  Destination Address
                </span>
                <p className="text-stone-700 leading-relaxed">
                  {selectedOrder.shippingAddress.address}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}<br />
                  <strong className="text-stone-900">{selectedOrder.shippingAddress.country}</strong>
                </p>
              </div>
            </div>

            {/* Articles Breakdown */}
            <div>
              <span className="font-bold text-stone-900 uppercase text-[10px] block mb-2">
                Order Articles ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-14 object-cover rounded bg-stone-100" />
                      <div>
                        <span className="font-semibold text-stone-900 block">{item.name}</span>
                        <span className="text-[11px] text-stone-500">
                          Color: {item.color} â€¢ Size: {item.size} â€¢ Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-stone-50 rounded-b-lg border-x border-b border-stone-200 text-xs space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{selectedOrder.shipping === 0 ? 'Free' : formatPrice(selectedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-950 pt-1 border-t border-stone-200">
                  <span>Total Due</span>
                  <span className="text-sm">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Order Notes Timeline */}
            <div className="space-y-3 pt-2">
              <span className="font-bold text-stone-900 uppercase text-[10px] block">
                Internal Order Timeline & Notes
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedOrder.notes?.map((n) => (
                  <div key={n.id} className="p-2.5 bg-stone-50 rounded border border-stone-200 text-xs">
                    <div className="flex justify-between text-[10px] text-stone-400 mb-0.5">
                      <span className="font-bold text-[#F5B016]">{n.author}</span>
                      <span>{formatDate(n.date)}</span>
                    </div>
                    <p className="text-stone-700">{n.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add note (e.g. Payment receipt verified via bank statement)..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleAddNoteOnly}
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded hover:bg-black shrink-0"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

