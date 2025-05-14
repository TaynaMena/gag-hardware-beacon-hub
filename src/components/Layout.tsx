
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/3c9dcd17-393d-4323-834c-ed34a5d7eb30.png" 
              alt="GAG Hardware" 
              className="h-12"
            />
          </div>
          <p>&copy; {new Date().getFullYear()} GAG Hardware - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
