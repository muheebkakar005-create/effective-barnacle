import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, User, MapPin, LogOut, Clock, ExternalLink, Shield, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Order } from '../types/index.ts';
import { formatPrice, formatDate } from '../utils/formatters.ts';
import { SEO } from '../components/common/SEO.tsx';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        if (res.success) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FCFAF7] py-8 sm:py-16">
      <SEO title="My Account | SK Brands" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#F5B016] uppercase">
              Client Profile
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {user.email} â€¢ {user.phone || 'No phone registered'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-stone-900 text-[#F5B016] text-xs font-semibold rounded hover:bg-black transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:text-rose-600 hover:border-rose-300 text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-300 gap-8 text-xs font-bold uppercase tracking-wider mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-black text-black'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Package className="w-4 h-4" />
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-black text-black'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <User className="w-4 h-4" />
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'addresses'
                ? 'border-black text-black'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Saved Addresses
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {isLoadingOrders ? (
              <div className="py-12 flex justify-center text-stone-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#F5B016]" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg border border-stone-200 p-12 text-center space-y-4">
                <Package className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-display text-lg font-bold text-stone-900">
                  No orders placed yet
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  When you purchase luxury garments from SK Brands, your tracking details and receipts will appear here.
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-6 py-2.5 bg-black text-white text-xs font-semibold rounded uppercase tracking-wider"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                    <div>
                      <span className="font-mono text-sm font-bold text-black">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-stone-400 ml-3">
                        Placed on {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-200">
                        {order.orderStatus}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        Payment: <strong className="text-stone-800">{order.paymentStatus}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Items row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 p-2 bg-stone-50 rounded border border-stone-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-16 object-cover rounded bg-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <h4 className="text-xs font-semibold text-stone-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-stone-500">
                              {item.color} â€¢ Size {item.size} â€¢ Qty {item.quantity}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-stone-900 font-sans">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-stone-600">
                      Total: <strong className="text-base text-black font-display font-bold">{formatPrice(order.total)}</strong>
                      {order.shippingCarrier && (
                        <span className="ml-3 text-stone-500 font-mono">
                          Carrier: {order.shippingCarrier}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/order-confirmation/${order.orderNumber}`}
                      className="inline-flex items-center gap-1.5 font-bold text-[#F5B016] hover:text-black uppercase tracking-wider"
                    >
                      View Invoice & Payment Details
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs max-w-xl space-y-4">
            <h3 className="font-display text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Personal Information
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-400 block font-semibold uppercase text-[10px]">Name</span>
                <span className="font-medium text-stone-900 text-sm">{user.name}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase text-[10px]">Email</span>
                <span className="font-medium text-stone-900 text-sm">{user.email}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase text-[10px]">Phone</span>
                <span className="font-medium text-stone-900 text-sm">{user.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase text-[10px]">Account Role</span>
                <span className="font-medium text-stone-900 text-sm capitalize">{user.role}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase text-[10px]">Member Since</span>
                <span className="font-medium text-stone-900 text-sm">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display text-lg font-bold text-stone-900">
                Delivery Addresses
              </h3>
            </div>

            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-stone-200 bg-stone-50/60 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                      <span>{addr.firstName} {addr.lastName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600">{addr.address}</p>
                    <p className="text-stone-600">{addr.city}, {addr.postalCode}</p>
                    <p className="text-stone-600 font-semibold">{addr.country}</p>
                    <p className="text-stone-500 pt-1">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500">
                No saved addresses yet. Addresses used during checkout are saved automatically.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

