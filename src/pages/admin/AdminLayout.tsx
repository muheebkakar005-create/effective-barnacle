import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Layers,
  Tag,
  Warehouse,
  Settings,
  Mail,
  LogOut,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { SKBrandLogo } from '../../components/common/SKBrandLogo.tsx';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 text-white text-center space-y-4 font-sans">
        <ShieldAlert className="w-16 h-16 text-rose-400" />
        <h1 className="font-display text-2xl font-bold">Admin Privileges Required</h1>
        <p className="text-stone-400 text-xs max-w-sm">
          You must be logged in as an administrator to access the SK Brands Store Management portal.
        </p>
        <Link
          to="/admin/login"
          className="px-6 py-2.5 bg-[#F5B016] text-black text-xs font-bold rounded uppercase tracking-wider hover:bg-[#E5A00D] transition-colors"
        >
          Go to Admin Login
        </Link>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', to: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Products', to: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { label: 'Orders', to: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Customers', to: '/admin/customers', icon: <Users className="w-4 h-4" /> },
    { label: 'Categories', to: '/admin/categories', icon: <Layers className="w-4 h-4" /> },
    { label: 'Coupons', to: '/admin/coupons', icon: <Tag className="w-4 h-4" /> },
    { label: 'Inventory', to: '/admin/inventory', icon: <Warehouse className="w-4 h-4" /> },
    { label: 'Inquiries', to: '/admin/inquiries', icon: <Mail className="w-4 h-4" /> },
    { label: 'Store Settings', to: '/admin/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans text-stone-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#18181A] text-white flex flex-col shrink-0 shadow-xl">
        {/* Brand Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <Link to="/admin" className="block group">
            <SKBrandLogo size="md" light={true} showTagline={true} />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto text-xs">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/admin' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${
                  isActive
                    ? 'bg-[#F5B016] text-white font-semibold shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-stone-800 space-y-2 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-stone-400 hover:text-white rounded hover:bg-stone-800 transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-stone-200 px-6 sm:px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div className="text-xs text-stone-500">
            Store Management â€¢ {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-stone-700">
              Logged in as <strong className="text-black">{user?.name}</strong>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F5B016]/30 text-[#F5B016] uppercase tracking-wider">
              Administrator
            </span>
          </div>
        </header>

        {/* Body Outlet */}
        <main className="p-6 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

