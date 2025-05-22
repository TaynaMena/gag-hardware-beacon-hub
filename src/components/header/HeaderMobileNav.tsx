
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from '@/services/categoryService';
import { Home, Package, Tag, User, LogIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccountMenuItem } from '@/components/header/HeaderUserMenu';

interface HeaderMobileNavProps {
  isMenuOpen: boolean;
  isActive: (path: string) => boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  accountMenuItems: AccountMenuItem[];
}

const HeaderMobileNav: React.FC<HeaderMobileNavProps> = ({ 
  isMenuOpen, 
  isActive, 
  setIsMenuOpen,
  accountMenuItems
}) => {
  // Fetch all categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories
  });

  const navItems = [
    { path: '/', label: 'Início', icon: <Home size={18} /> },
    { path: '/vitrine', label: 'Vitrine', icon: <Package size={18} /> },
    { path: '/ofertas', label: 'Ofertas', icon: <Tag size={18} /> },
  ];

  if (!isMenuOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-40 transform transition-transform duration-300 ease-in-out translate-x-0"
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
        
        {/* Categories section in mobile */}
        <div className="mb-2 mt-2">
          <h3 className="text-gag-cyan px-4 py-2">Categorias</h3>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/vitrine?category=${category.id}`}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-4 py-2 text-base font-medium text-gray-300 hover:bg-gag-dark/30 hover:text-gag-white rounded-md ml-3"
            >
              <Package className="w-4 h-4 mr-2" />
              {category.name}
            </Link>
          ))}
        </div>
        
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
  );
};

export default HeaderMobileNav;
