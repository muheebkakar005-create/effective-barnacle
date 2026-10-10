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
    <header className="w-full z-50 sticky top-0 bg-[#FFFFFF] transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#14213D] text-[#FFFFFF] py-2 px-4 text-center overflow-hidden whitespace-nowrap md:whitespace-normal">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[10px] md:text-xs font-heading font-semibold tracking-widest uppercase animate-marquee md:animate-none">
          <span className="text-[#F2B705] font-bold">SK BRAND SAMI KHAN</span>
          <span className="hidden md:inline-block">•</span>
          <span className="px-2 md:px-0">HAND-MADE BALOCHI DRESSES</span>
          <span className="hidden md:inline-block">•</span>
          <span className="px-2 md:px-0">LIAQAT BAZAAR QUETTA</span>
          <span className="hidden md:inline-block">•</span>
          <span className="px-2 md:px-0">WHATSAPP: <span className="font-mono">0316 0367456</span></span>
          <span className="hidden md:inline-block">•</span>
          <span className="px-2 md:px-0 font-bold">WORLDWIDE DELIVERY</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`w-full border-b border-gray-100 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-4">
            {/* Mobile Menu Toggle */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-[#14213D] hover:text-[#F2B705] transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="shrink-0 flex items-center pr-2 sm:pr-6">
              <Link to="/" className="hover:opacity-90 transition-opacity flex items-center">
                <SKBrandLogo size="sm" light={false} />
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 font-heading flex-1">
              {mainNav.map((item) =>
                item.isDropdown ? (
                  <div
                    key={item.label}
                    className="relative group h-20 flex items-center"
                    onMouseEnter={() => setIsCollectionsHovered(true)}
                    onMouseLeave={() => setIsCollectionsHovered(false)}
                  >
                    <Link
                      to={item.to}
                      className="flex items-center gap-1 text-[13px] tracking-widest font-bold text-[#14213D] hover:text-[#F2B705] transition-colors"
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4 text-[#14213D] group-hover:text-[#F2B705] transition-colors" />
                    </Link>
                    
                    {/* Dropdown */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 w-56 bg-[#FFFFFF] shadow-xl border border-gray-100 py-4 rounded-b-md transition-all duration-200 z-50 ${
                        isCollectionsHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                      }`}
                    >
                      {item.children?.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.to}
                          className="block px-6 py-2.5 text-[12px] font-semibold text-[#14213D] tracking-wider hover:bg-[#F2B705]/10 hover:text-[#F2B705] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`text-[13px] tracking-widest font-bold transition-colors hover:text-[#F2B705] flex items-center h-full border-b-2 ${
                      location.pathname === item.to || (item.to !== '/' && location.search.includes(item.to.split('?')[1] || ''))
                        ? 'text-[#F2B705] border-[#F2B705]'
                        : 'text-[#14213D] border-transparent hover:border-[#F2B705]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4 lg:space-x-5 flex-shrink-0">
              <button
                onClick={onOpenSearch}
                className="text-[#14213D] hover:text-[#F2B705] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/wishlist"
                className="relative text-[#14213D] hover:text-[#F2B705] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F2B705] text-[#14213D] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="text-[#14213D] hover:text-[#F2B705] transition-colors hidden sm:block"
                aria-label="Account"
              >
                <UserIcon className="w-5 h-5" />
              </Link>

              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative text-[#14213D] hover:text-[#F2B705] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F2B705] text-[#14213D] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden xl:flex items-center px-4 py-1.5 bg-[#14213D] text-[#FFFFFF] text-xs font-heading font-bold tracking-widest rounded hover:bg-[#F2B705] hover:text-[#14213D] transition-colors"
                >
                  ADMIN
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div
          className={`absolute inset-0 bg-[#14213D]/40 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-[#FAF6EE] shadow-2xl flex flex-col overflow-y-auto">
          <div className="p-6 flex items-center justify-between border-b border-gray-200">
            <SKBrandLogo size="sm" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[#14213D] hover:text-[#F2B705] transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col py-4 px-6 space-y-1 font-heading">
            {mainNav.map((item) => (
              <React.Fragment key={item.label}>
                <Link
                  to={item.to}
                  className="py-4 text-[13px] font-bold tracking-widest text-[#14213D] hover:text-[#F2B705] border-b border-gray-200 uppercase"
                >
                  {item.label}
                </Link>
                {item.isDropdown && item.children && (
                  <div className="pl-4 border-b border-gray-200 pb-2">
                    {item.children.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        className="block py-3 text-[12px] font-semibold tracking-wider text-[#3D3D3D] hover:text-[#F2B705]"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
            
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="py-4 text-[13px] font-bold tracking-widest text-[#14213D] hover:text-[#F2B705] border-b border-gray-200 uppercase"
            >
              {isAuthenticated ? 'MY ACCOUNT' : 'LOGIN / REGISTER'}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="mt-6 py-3 px-4 bg-[#14213D] text-[#FFFFFF] text-center text-[12px] font-bold tracking-widest hover:bg-[#F2B705] hover:text-[#14213D] transition-colors rounded uppercase"
              >
                ADMIN DASHBOARD
              </Link>
            )}
          </nav>

          <div className="mt-auto p-6 bg-[#14213D] text-[#FFFFFF] font-body text-sm space-y-2">
            <p className="font-heading font-bold text-[#F2B705]">SK Brand Quetta</p>
            <p className="text-gray-300">Liaqat Bazaar, Quetta</p>
            <p className="text-gray-300 flex items-center gap-2">WhatsApp: <span className="font-mono text-[#F2B705]">0316 0367456</span></p>
          </div>
        </div>
      </div>
    </header>
  );
};
