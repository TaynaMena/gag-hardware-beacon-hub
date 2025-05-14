
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSellerAuth } from '@/contexts/SellerAuthContext';
import { 
  Users, Package, UserPlus, PackagePlus, LogOut, 
  Menu, X, ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/toaster";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { seller, logout } = useSellerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin-produtos', icon: <Package size={18} />, label: 'Produtos' },
    { path: '/admin/cadastrar-colaborador', icon: <UserPlus size={18} />, label: 'Cadastrar Colaborador' },
    { path: '/admin/cadastrar-produto', icon: <PackagePlus size={18} />, label: 'Cadastrar Produto' },
    { path: '/admin/colaboradores', icon: <Users size={18} />, label: 'Colaboradores' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/admin-produtos" className="flex items-center">
              <img 
                src="/lovable-uploads/3c9dcd17-393d-4323-834c-ed34a5d7eb30.png" 
                alt="GAG Hardware" 
                className="h-12 w-auto"
              />
              <span className="ml-2 font-bold text-lg hidden md:block">Painel Admin</span>
            </Link>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-600'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User menu */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center text-sm px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <span className="mr-1">{seller?.name}</span>
                <ChevronDown size={16} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-blue-800 px-4 pb-3 pt-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md my-1 ${
                  isActive(item.path)
                    ? 'bg-blue-900 text-white'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700 rounded-md my-1"
            >
              <LogOut size={18} className="mr-2" />
              Sair
            </button>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} GAG Hardware - Painel Administrativo</p>
        </div>
      </footer>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default AdminLayout;
