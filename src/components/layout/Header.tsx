
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useCollaboratorAuth } from '@/contexts/CollaboratorAuthContext';
import { Menu, X, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import HeaderDesktopNav from './header/HeaderDesktopNav';
import HeaderMobileNav from './header/HeaderMobileNav';
import HeaderUserMenu from './header/HeaderUserMenu';
import CartButton from './header/CartButton';
import { AccountMenuItem } from '@/components/layout/header/HeaderUserMenu';

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useUserAuth();
  const { collaborator, isAuthenticated: isCollaboratorAuthenticated } = useCollaboratorAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const accountMenuItems: AccountMenuItem[] = isAuthenticated || isCollaboratorAuthenticated
    ? [
        { label: isAuthenticated ? user?.name : collaborator?.name, icon: <User size={18} /> },
        { label: 'Sair', onClick: logout, icon: <LogIn size={18} className="transform rotate-180" /> }
      ]
    : [
        { path: '/auth', label: 'Entrar', icon: <LogIn size={18} /> }
      ];

  const userName = isAuthenticated 
    ? (user?.name || 'Usuário') 
    : isCollaboratorAuthenticated 
      ? (collaborator?.name || 'Colaborador')
      : undefined;

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
        {!isMobile && <HeaderDesktopNav isActive={isActive} />}

        {/* User Section */}
        <div className="flex items-center space-x-2">
          {/* Desktop User Menu */}
          {!isMobile && <HeaderUserMenu userName={userName} accountMenuItems={accountMenuItems} />}
          
          {/* Cart */}
          <CartButton />
          
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
        <HeaderMobileNav 
          isMenuOpen={isMenuOpen} 
          isActive={isActive} 
          setIsMenuOpen={setIsMenuOpen}
          accountMenuItems={accountMenuItems}
        />
      )}
    </header>
  );
};

export default Header;
