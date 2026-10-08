import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { SKBrandLogo } from '../common/SKBrandLogo.tsx';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const location = useLocation();
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCollectionsHovered(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'HOME', to: '/' },
    { label: 'BALOCHI DRESSES', to: '/shop?category=balochi-dress' },
    { label: 'SHOP ALL', to: '/shop' },
    { label: 'NEW ARRIVALS', to: '/shop?category=new-arrivals' },
    {
      label: 'COLLECTIONS',
      to: '/shop',
      isDropdown: true,
      children: [
        { label: 'All Collections', to: '/shop' },
        { label: 'Hand-Made Balochi Dresses', to: '/shop?category=balochi-dress' },
        { label: 'Balochi Machine Embroidery', to: '/shop?category=balochi-machine' },
        { label: 'Formal Wear', to: '/shop?category=formal-wear' },
        { label: 'Casual Wear', to: '/shop?category=casual-wear' },
        { label: 'Party Wear', to: '/shop?category=party-wear' },
        { label: 'Bridal Couture', to: '/shop?category=bridal-couture' }
      ]
    },
    { label: 'ABOUT', to: '/about' },
    { label: 'CONTACT', to: '/contact' }
  ];

  return (
    <header className="w-full z-40 bg-[#FCFAF7]">
      {/* Top Announcement Bar */}
      <div className="bg-[#18181A] text-[#F3EFEA] text-[11px] md:text-xs tracking-[0.16em] uppercase py-2.5 px-4 text-center font-medium transition-all border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          <span className="font-bold text-[#F5B016]">SK Brand Sami Khan</span>
          <span className="text-[#F5B016]">â€¢</span>
          <span>Hand-Made Balochi Dresses â€¢ Liaqat Bazaar Quetta</span>
          <span className="hidden md:inline-block text-[#F5B016]">â€¢</span>
          <span className="hidden md:inline-block text-stone-300">
            WhatsApp: <strong className="text-[#F5B016] font-mono tracking-wider">0316 0367456</strong>
          </span>
          <span className="hidden lg:inline-block text-[#F5B016]">â€¢</span>
          <span className="hidden lg:inline-block text-[#F5B016] font-bold">Worldwide Delivery</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 border-b border-[#EAE3D9] bg-[#FCFAF7]/95 backdrop-blur-md ${
          isScrolled ? 'sticky top-0 shadow-sm' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-22">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-stone-800 hover:text-black focus:outline-none"
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo with exact Shield/Crown Crest */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link to="/" className="inline-block group text-left">
                <SKBrandLogo size="md" showText={true} />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((item) =>
                item.isDropdown ? (
                  <div
                    key={item.label}
                    className="relative group py-6"
                    onMouseEnter={() => setIsCollectionsHovered(true)}
                    onMouseLeave={() => setIsCollectionsHovered(false)}
                  >
                    <Link
                      to={item.to}
                      className="flex items-center gap-1 text-[12px] tracking-[0.16em] font-bold text-stone-700 hover:text-[#1E2B8F] transition-colors"
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-transform group-hover:rotate-180 text-[#F5B016]" />
                    </Link>
                    {/* Dropdown Menu */}
                    {isCollectionsHovered && (
                      <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-stone-100 py-3 rounded-b-md animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                        {item.children?.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.to}
                            className="block px-5 py-2.5 text-xs tracking-wider text-stone-600 hover:text-[#1E2B8F] hover:bg-[#F5B016]/10 transition-colors font-medium"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`text-[12px] tracking-[0.16em] font-bold transition-colors hover:text-[#1E2B8F] ${
                      location.pathname === item.to || (item.to !== '/' && location.search.includes(item.to.split('?')[1] || ''))
                        ? 'text-[#F5B016] font-black underline underline-offset-8 decoration-2'
                        : 'text-stone-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Search Trigger */}
              <button
                onClick={onOpenSearch}
                className="text-stone-700 hover:text-[#1E2B8F] p-1 transition-colors"
                aria-label="Search collection"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="relative text-stone-700 hover:text-[#1E2B8F] p-1 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F5B016] text-[#18181A] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account / Login */}
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="text-stone-700 hover:text-[#1E2B8F] p-1 transition-colors flex items-center gap-1.5"
                aria-label="Account"
              >
                <UserIcon className="w-5 h-5 stroke-[1.75]" />
                {isAuthenticated && (
                  <span className="hidden xl:inline text-xs font-medium text-stone-600 max-w-[80px] truncate">
                    {user?.name.split(' ')[0]}
                  </span>
                )}
              </Link>

              {/* Admin shortcut if logged in as admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#18181A] text-[#F5B016] tracking-widest uppercase hover:bg-stone-800 transition-colors"
                >
                  Admin
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative text-stone-700 hover:text-black p-1 transition-colors flex items-center"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#18181A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FCFAF7] h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-stone-200">
              <SKBrandLogo size="sm" showText={true} />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-stone-500 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col py-6 space-y-3">
              <Link
                to="/"
                className="text-xs font-bold tracking-widest text-stone-800 hover:text-black py-2 border-b border-stone-100 uppercase"
              >
                HOME
              </Link>
              <Link
                to="/shop?category=balochi-dress"
                className="text-xs font-bold tracking-widest text-[#F5B016] hover:text-black py-2 border-b border-stone-100 uppercase flex items-center justify-between"
              >
                <span>BALOCHI DRESSES</span>
                <span className="text-[10px] bg-[#F5B016]/30 px-2 py-0.5 rounded font-bold">HAND-MADE</span>
              </Link>
              <Link
                to="/shop"
                className="text-xs font-bold tracking-widest text-stone-800 hover:text-black py-2 border-b border-stone-100 uppercase"
              >
                SHOP ALL
              </Link>
              <Link
                to="/shop?category=new-arrivals"
                className="text-xs font-bold tracking-widest text-stone-800 hover:text-black py-2 border-b border-stone-100 uppercase"
              >
                NEW ARRIVALS
              </Link>
              <div className="py-2">
                <span className="text-[11px] uppercase tracking-widest text-[#F5B016] font-bold block mb-2">
                  Featured Collections
                </span>
                <div className="pl-3 flex flex-col space-y-2 text-xs text-stone-600">
                  <Link to="/shop?category=balochi-dress" className="font-semibold text-stone-900">Hand-Made Balochi Doch</Link>
                  <Link to="/shop?category=balochi-machine">Balochi Machine Embroidery</Link>
                  <Link to="/shop?category=formal-wear">Formal Wear</Link>
                  <Link to="/shop?category=casual-wear">Casual Wear</Link>
                  <Link to="/shop?category=party-wear">Party Wear</Link>
                  <Link to="/shop?category=bridal-couture">Bridal Couture</Link>
                </div>
              </div>
              <Link
                to="/about"
                className="text-xs font-bold tracking-widest text-stone-800 hover:text-black py-2 border-b border-stone-100 uppercase"
              >
                ABOUT SAMI KHAN
              </Link>
              <Link
                to="/contact"
                className="text-xs font-bold tracking-widest text-stone-800 hover:text-black py-2 border-b border-stone-100 uppercase"
              >
                CONTACT & QUETTA OUTLET
              </Link>
              <Link
                to="/track-order"
                className="text-xs font-bold tracking-widest text-stone-800 hover:text-black py-2 border-b border-stone-100 uppercase"
              >
                TRACK ORDER
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-xs font-bold tracking-widest text-[#F5B016] py-2 border-b border-stone-100 uppercase"
                >
                  ADMIN DASHBOARD
                </Link>
              )}
            </nav>

            <div className="mt-auto pt-6 border-t border-stone-200 text-xs text-stone-600 space-y-2">
              <p className="font-semibold text-stone-900">Naseem Fashion Mall, Liaqat Bazaar, Quetta</p>
              <p>Phone: 0314 0003801</p>
              <p>WhatsApp: 0316 0367456</p>
              <p className="text-[11px] text-stone-400">All Pakistan & Worldwide Delivery</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


