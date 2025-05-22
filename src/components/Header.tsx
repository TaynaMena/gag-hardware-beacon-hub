
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useCollaboratorAuth } from '@/contexts/CollaboratorAuthContext';
import { 
  Home, 
  ShoppingBag, 
  ShoppingCart, 
  User, 
  LogIn, 
  Menu, 
  X, 
  Package,
  Tag
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';

const Header = () => {
  const location = useLocation();
  const { cartItems, getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useUserAuth();
  const { collaborator, isAuthenticated: isCollaboratorAuthenticated } = useCollaboratorAuth();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Início', icon: <Home size={18} /> },
    { path: '/vitrine', label: 'Produtos', icon: <Package size={18} /> },
    { path: '/ofertas', label: 'Ofertas', icon: <Tag size={18} /> },
    { path: '/produtos', label: 'Catálogo', icon: <ShoppingBag size={18} /> },
  ];

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const accountMenuItems = isAuthenticated || isCollaboratorAuthenticated
    ? [
        { label: isAuthenticated ? user?.name : collaborator?.name, icon: <User size={18} /> },
        { label: 'Sair', onClick: logout, icon: <LogIn size={18} className="transform rotate-180" /> }
      ]
    : [
        { path: '/auth', label: 'Entrar', icon: <LogIn size={18} /> }
      ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-black/50 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/eb34af22-c138-4004-a47b-ecfe0724a94c.png" 
            alt="GAG Hardware" 
            className="h-8" 
          />
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-gag-cyan bg-gag-dark/50' 
                      : 'text-gray-300 hover:text-gag-white hover:bg-gag-dark/30'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        )}

        {/* User Section */}
        <div className="flex items-center space-x-2">
          {!isMobile && (
            <>
              {/* Account */}
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-gag-white"
                >
                  <User size={18} className="mr-1" />
                  <span className="max-w-[100px] truncate">
                    {isAuthenticated 
                      ? (user?.name || 'Usuário') 
                      : isCollaboratorAuthenticated 
                        ? (collaborator?.name || 'Colaborador')
                        : 'Minha Conta'}
                  </span>
                </Button>
                <div className="absolute right-0 mt-1 w-48 origin-top-right bg-black/90 backdrop-blur-md border border-gag-cyan/30 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    {accountMenuItems.map((item, index) => (
                      item.path ? (
                        <Link 
                          key={index} 
                          to={item.path}
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gag-blue/20 hover:text-gag-white"
                        >
                          <span className="mr-2">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <button 
                          key={index}
                          onClick={item.onClick}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gag-blue/20 hover:text-gag-white"
                        >
                          <span className="mr-2">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Cart */}
          <Link to="/carrinho">
            <Button variant="ghost" className="relative px-3 text-gray-300 hover:text-gag-white">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gag-cyan text-gag-dark text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button variant="ghost" onClick={handleMenuToggle} className="text-gray-300">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobile && (
        <div 
          className={`fixed inset-0 bg-black/90 z-40 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ top: '64px' }}
        >
          <nav className="flex flex-col p-4 h-full">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-4 py-3 text-base font-medium rounded-md mb-2 ${
                  isActive(item.path)
                    ? 'bg-gag-blue/20 text-gag-cyan' 
                    : 'text-gray-300 hover:bg-gag-dark/30 hover:text-gag-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-gag-cyan/20 my-4 pt-4">
              {accountMenuItems.map((item, index) => (
                item.path ? (
                  <Link 
                    key={index} 
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-300 hover:bg-gag-dark/30 hover:text-gag-white rounded-md mb-2"
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button 
                    key={index}
                    onClick={() => {
                      item.onClick?.();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-300 hover:bg-gag-dark/30 hover:text-gag-white rounded-md mb-2"
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                )
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
