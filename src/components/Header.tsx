
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, ShoppingCart, User, Users, Search } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useSellerAuth } from '@/contexts/SellerAuthContext';
import { useCollaboratorAuth } from '@/contexts/CollaboratorAuthContext';

const Header: React.FC = () => {
  const { items } = useCart();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAuthenticated: isUserAuthenticated } = useUserAuth();
  const { seller, isAuthenticated: isSellerAuthenticated } = useSellerAuth();
  const { collaborator, isAuthenticated: isCollaboratorAuthenticated } = useCollaboratorAuth();
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-black/80 backdrop-blur-md border-b border-gag-cyan/20 shadow-md sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/eb34af22-c138-4004-a47b-ecfe0724a94c.png" 
                alt="GAG Hardware" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Search - Desktop */}
          {!isMobile && (
            <div className="relative mx-4 flex-grow max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar produtos..."
                  className="w-full bg-black/40 border border-gag-cyan/30 rounded-lg px-4 py-2 text-gag-white placeholder:text-gray-400 focus:outline-none focus:border-gag-cyan pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gag-cyan" />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              className="text-gag-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {/* Navigation - Desktop */}
          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${location.pathname === '/' ? 'bg-gag-blue text-gag-white' : 'bg-transparent text-gag-white hover:bg-gag-cyan/10'}`}>
                      Início
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/produtos">
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${location.pathname === '/produtos' ? 'bg-gag-blue text-gag-white' : 'bg-transparent text-gag-white hover:bg-gag-cyan/10'}`}>
                      Produtos
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/ofertas">
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${location.pathname === '/ofertas' ? 'bg-gag-blue text-gag-white' : 'bg-transparent text-gag-white hover:bg-gag-cyan/10'}`}>
                      Ofertas
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {isCollaboratorAuthenticated && (
                  <NavigationMenuItem>
                    <Link to="/colaborador">
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${location.pathname.includes('/colaborador') && !location.pathname.includes('/login') ? 'bg-gag-blue text-gag-white' : 'bg-transparent text-gag-white hover:bg-gag-cyan/10'}`}>
                        Painel do Colaborador
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
                {isSellerAuthenticated && (
                  <NavigationMenuItem>
                    <Link to="/admin-produtos">
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${location.pathname.includes('admin-') ? 'bg-gag-blue text-gag-white' : 'bg-transparent text-gag-white hover:bg-gag-cyan/10'}`}>
                        Painel Administrativo
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Cart and Account Buttons */}
          <div className="flex items-center space-x-3">
            {/* Login/User Button */}
            {isUserAuthenticated ? (
              <Link to="/perfil">
                <Button variant="outline" className="bg-transparent border-gag-cyan/40 text-gag-white hover:bg-gag-cyan/10 hover:border-gag-cyan">
                  <User className="h-5 w-5" />
                  {!isMobile && <span className="ml-2 truncate max-w-[100px]">{user?.name || user?.email?.split('@')[0]}</span>}
                </Button>
              </Link>
            ) : isCollaboratorAuthenticated ? (
              <Link to="/colaborador">
                <Button variant="outline" className="bg-transparent border-gag-lime/40 text-gag-lime hover:bg-gag-lime/10 hover:border-gag-lime">
                  <Users className="h-5 w-5" />
                  {!isMobile && <span className="ml-2 truncate max-w-[100px]">{collaborator?.name}</span>}
                </Button>
              </Link>
            ) : isSellerAuthenticated ? (
              <Link to="/admin-produtos">
                <Button variant="outline" className="bg-transparent border-gag-cyan/40 text-gag-cyan hover:bg-gag-cyan/10 hover:border-gag-cyan">
                  <Users className="h-5 w-5" />
                  {!isMobile && <span className="ml-2 truncate max-w-[100px]">{seller?.name}</span>}
                </Button>
              </Link>
            ) : (
              <div className="flex space-x-2">
                <Link to="/auth">
                  <Button variant="outline" className="bg-transparent border-gag-cyan/40 text-gag-white hover:bg-gag-cyan/10 hover:border-gag-cyan">
                    <User className="h-5 w-5" />
                    {!isMobile && <span className="ml-2">Entrar</span>}
                  </Button>
                </Link>
                
                <Link to="/colaborador/login">
                  <Button variant="outline" className="bg-transparent border-gag-lime/40 text-gag-lime hover:bg-gag-lime/10 hover:border-gag-lime">
                    <Users className="h-5 w-5" />
                    {!isMobile && <span className="ml-2">Colaborador</span>}
                  </Button>
                </Link>
                
                <Link to="/admin/login">
                  <Button variant="outline" className="bg-transparent border-gag-cyan/40 text-gag-cyan hover:bg-gag-cyan/10 hover:border-gag-cyan">
                    <Users className="h-5 w-5" />
                    {!isMobile && <span className="ml-2">Admin</span>}
                  </Button>
                </Link>
              </div>
            )}
            
            <Link to="/carrinho">
              <Button variant="default" className="bg-gag-blue hover:bg-gag-blue-dark relative">
                <ShoppingCart className="h-5 w-5" />
                {!isMobile && <span className="ml-2">Carrinho</span>}
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gag-lime text-gag-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="px-4 pb-4 bg-black/90 border-t border-gag-cyan/10 animate-fade-in">
          {/* Mobile Search */}
          <div className="py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                className="w-full bg-black/40 border border-gag-cyan/30 rounded-lg px-4 py-2 text-gag-white placeholder:text-gray-400 focus:outline-none focus:border-gag-cyan pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-5 w-5 text-gag-cyan" />
              </div>
            </div>
          </div>
          
          {/* Mobile Nav Links */}
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              className={`text-gag-white py-2 px-3 rounded ${location.pathname === '/' ? 'bg-gag-blue' : 'hover:bg-gag-cyan/10'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/produtos"
              className={`text-gag-white py-2 px-3 rounded ${location.pathname === '/produtos' ? 'bg-gag-blue' : 'hover:bg-gag-cyan/10'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Produtos
            </Link>
            <Link
              to="/ofertas"
              className={`text-gag-white py-2 px-3 rounded ${location.pathname === '/ofertas' ? 'bg-gag-blue' : 'hover:bg-gag-cyan/10'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Ofertas
            </Link>
            
            {/* User management links */}
            <div className="border-t border-gag-cyan/10 my-2 pt-2">
              {isUserAuthenticated ? (
                <Link
                  to="/perfil"
                  className="flex items-center text-gag-white py-2 px-3 rounded hover:bg-gag-cyan/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  {user?.name || user?.email?.split('@')[0]}
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="flex items-center text-gag-white py-2 px-3 rounded hover:bg-gag-cyan/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Entrar como Cliente
                  </Link>
                  <Link
                    to="/colaborador/login"
                    className="flex items-center text-gag-lime py-2 px-3 rounded hover:bg-gag-lime/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Área do Colaborador
                  </Link>
                  <Link
                    to="/admin/login"
                    className="flex items-center text-gag-cyan py-2 px-3 rounded hover:bg-gag-cyan/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Área do Admin
                  </Link>
                </>
              )}
              
              {/* Admin/Collaborator specific links */}
              {isCollaboratorAuthenticated && (
                <Link
                  to="/colaborador"
                  className="flex items-center text-gag-lime py-2 px-3 rounded hover:bg-gag-lime/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Painel do Colaborador
                </Link>
              )}
              
              {isSellerAuthenticated && (
                <Link
                  to="/admin-produtos"
                  className="flex items-center text-gag-cyan py-2 px-3 rounded hover:bg-gag-cyan/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Painel Administrativo
                </Link>
              )}
              
              <Link
                to="/carrinho"
                className="flex items-center text-gag-white py-2 px-3 rounded hover:bg-gag-blue/20 bg-gag-blue/10 mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrinho
                {totalItems > 0 && (
                  <span className="ml-2 bg-gag-lime text-gag-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
