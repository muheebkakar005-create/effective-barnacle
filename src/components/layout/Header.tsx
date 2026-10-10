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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCollectionsHovered(false);
  }, [location.pathname]);

  const collectionsLinks = [
    { label: 'All Balochi Dresses', to: '/shop?category=balochi-dress' },
    { label: 'New Arrivals', to: '/shop?category=new-arrivals' },
    { label: 'Bridal Balochi', to: '/shop?category=bridal-couture' },
    { label: 'Party Wear', to: '/shop?category=party-wear' },
    { label: 'Casual Balochi', to: '/shop?category=casual-wear' },
    { label: 'Winter Collection', to: '/shop?category=winter-collection' },
    { label: 'Sale / Last Chance', to: '/shop?category=sale' }
  ];

  const mainNav = [
    { label: 'HOME', to: '/' },
    { label: 'BALOCHI DRESSES', to: '/shop?category=balochi-dress' },
    { label: 'SHOP ALL', to: '/shop' },
    { label: 'NEW ARRIVALS', to: '/shop?category=new-arrivals' },
    {
      label: 'COLLECTIONS',
      to: '/shop',
      isDropdown: true,
      children: collectionsLinks
    },
    { label: 'ABOUT', to: '/about' },
    { label: 'CONTACT', to: '/contact' }
  ];

  return (
    <header className="w-full z-40 bg-white sticky top-0 transition-all duration-200">
      {/* 1. Top Announcement Bar (Deep Navy #14213D) */}
      <div className="bg-[#14213D] text-[#FFFFFF] text-[11px] sm:text-xs tracking-[0.14em] uppercase py-2 px-4 text-center font-bold border-b border-[#1D3557]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-[#F2B705]">SK BRAND SAMI KHAN</span>
          <span className="text-[#F2B705]">•</span>
          <span>HAND-MADE BALOCHI DRESSES</span>
          <span className="hidden sm:inline-block text-[#F2B705]">•</span>
          <span className="hidden sm:inline-block">LIAQAT BAZAAR QUETTA</span>
          <span className="hidden md:inline-block text-[#F2B705]">•</span>
          <span className="hidden md:inline-block text-white/90">
            WHATSAPP: <strong className="text-[#F2B705] font-mono tracking-wider">0316 0367456</strong>
          </span>
          <span className="hidden lg:inline-block text-[#F2B705]">•</span>
          <span className="hidden lg:inline-block text-[#F2B705] font-extrabold">WORLDWIDE DELIVERY</span>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Pure White #FFFFFF with subtle shadow on scroll) */}
      <div
        className={`w-full bg-white border-b border-stone-200 transition-shadow duration-300 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-22">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#14213D] hover:text-[#F2B705] focus:outline-none transition-colors"
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo Left: Pill with "SK Brand" and "SAMI KHAN • BALOCHI COUTURE" */}
            <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
              <Link to="/" className="inline-block group transform hover:scale-[1.02] transition-transform">
                <SKBrandLogo size="md" light={false} />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-7 font-heading">
              {mainNav.map((item) =>
                item.isDropdown ? (
                  <div
                    key={item.label}
                    className="relative group py-6"
                    onMouseEnter={() => setIsCollectionsHovered(true)}
                    onMouseLeave={() => setIsCollectionsHovered(false)}
                  >
                    <Link
                      to={item.to}
                      className="flex items-center gap-1 text-[13px] tracking-[0.14em] font-bold text-[#14213D] hover:text-[#F2B705] transition-colors"
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 text-[#F2B705] group-hover:rotate-180 transition-transform" />
                    </Link>
                    {/* Collections Dropdown Menu */}
                    {isCollectionsHovered && (
                      <div className="absolute top-full left-0 w-64 bg-white shadow-2xl border border-stone-100 py-3 rounded-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                        {item.children?.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.to}
                            className="block px-5 py-2.5 text-xs tracking-wider text-[#3D3D3D] hover:text-[#14213D] hover:bg-[#F2B705]/15 transition-colors font-bold"
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
                    className={`text-[13px] tracking-[0.14em] font-bold transition-colors hover:text-[#F2B705] ${
                      location.pathname === item.to || (item.to !== '/' && location.search.includes(item.to.split('?')[1] || ''))
                        ? 'text-[#14213D] font-extrabold border-b-2 border-[#F2B705] pb-0.5'
                        : 'text-[#14213D]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right Icons: Search, Wishlist, Account, Cart, Admin button */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search */}
              <button
                onClick={onOpenSearch}
                className="text-[#14213D] hover:text-[#F2B705] p-1.5 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Wishlist Heart */}
              <Link
                to="/wishlist"
                className="relative text-[#14213D] hover:text-[#F2B705] p-1.5 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[2.2]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F2B705] text-[#14213D] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="text-[#14213D] hover:text-[#F2B705] p-1.5 transition-colors flex items-center gap-1.5"
                aria-label="Account"
              >
                <UserIcon className="w-5 h-5 stroke-[2.2]" />
                {isAuthenticated && (
                  <span className="hidden xl:inline text-xs font-bold text-[#14213D] max-w-[80px] truncate">
                    {user?.name.split(' ')[0]}
                  </span>
                )}
              </Link>

              {/* Admin Button (Navy pill with gold text) */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-black bg-[#14213D] text-[#F2B705] tracking-widest uppercase hover:bg-[#1D3557] transition-colors border border-[#F2B705]/40 shadow-sm"
                >
                  ADMIN
                </Link>
              )}

              {/* Cart Drawer Button */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative text-[#14213D] hover:text-[#F2B705] p-1.5 transition-colors flex items-center"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F2B705] text-[#14213D] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-sm">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile Slide-out Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAF6EE] h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto font-body">
            <div className="flex items-center justify-between pb-5 border-b border-stone-200">
              <SKBrandLogo size="sm" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-stone-600 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col py-6 space-y-3 font-heading">
              <Link
                to="/"
                className="text-xs font-bold tracking-widest text-[#14213D] hover:text-[#F2B705] py-2 border-b border-stone-200 uppercase"
              >
                HOME
              </Link>
              <Link
                to="/shop?category=balochi-dress"
                className="text-xs font-bold tracking-widest text-[#14213D] py-2 border-b border-stone-200 uppercase flex items-center justify-between"
              >
                <span>BALOCHI DRESSES</span>
                <span className="text-[10px] bg-[#F2B705] text-[#14213D] px-2 py-0.5 rounded font-black">HAND-MADE</span>
              </Link>
              <Link
                to="/shop"
                className="text-xs font-bold tracking-widest text-[#14213D] hover:text-[#F2B705] py-2 border-b border-stone-200 uppercase"
              >
                SHOP ALL
              </Link>
              <Link
                to="/shop?category=new-arrivals"
                className="text-xs font-bold tracking-widest text-[#14213D] hover:text-[#F2B705] py-2 border-b border-stone-200 uppercase"
              >
                NEW ARRIVALS
              </Link>

              {/* Collections Sublinks */}
              <div className="py-2">
                <span className="text-[11px] uppercase tracking-widest text-[#14213D] font-black block mb-2">
                  Collections
                </span>
                <div className="pl-3 flex flex-col space-y-2 text-xs text-stone-700 font-semibold">
                  {collectionsLinks.map(c => (
                    <Link key={c.label} to={c.to} className="hover:text-[#14213D]">
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/about"
                className="text-xs font-bold tracking-widest text-[#14213D] hover:text-[#F2B705] py-2 border-b border-stone-200 uppercase"
              >
                ABOUT SAMI KHAN
              </Link>
              <Link
                to="/contact"
                className="text-xs font-bold tracking-widest text-[#14213D] hover:text-[#F2B705] py-2 border-b border-stone-200 uppercase"
              >
                CONTACT & QUETTA OUTLET
              </Link>
              <Link
                to="/track-order"
                className="text-xs font-bold tracking-widest text-[#14213D] hover:text-[#F2B705] py-2 border-b border-stone-200 uppercase"
              >
                TRACK ORDER
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-xs font-bold tracking-widest bg-[#14213D] text-[#F2B705] p-2.5 rounded-lg uppercase text-center"
                >
                  ADMIN DASHBOARD
                </Link>
              )}
            </nav>

            <div className="mt-auto pt-6 border-t border-stone-200 text-xs text-stone-600 space-y-1.5">
              <p className="font-bold text-[#14213D]">Naseem Fashion Mall, Liaqat Bazaar, Quetta</p>
              <p>Phone: 0314 0003801</p>
              <p>WhatsApp: 0316 0367456</p>
              <p className="text-[11px] text-[#F2B705] font-black">All Pakistan & Worldwide Express Delivery</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
