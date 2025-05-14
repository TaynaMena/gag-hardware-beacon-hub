
import React from 'react';
import Header from '@/components/Header';
import HardwareList from '@/components/HardwareList';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-hub-blue to-hub-blue-light text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Premium Hardware Components
              </h1>
              <p className="text-lg mb-6 text-gray-100">
                Find the perfect parts for your next PC build with our extensive selection of high-quality hardware components.
              </p>
              <Button className="bg-hub-accent hover:bg-blue-600 text-white">
                Shop Now <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <img 
                  src="/placeholder.svg" 
                  alt="PC Components" 
                  className="w-full max-w-md h-auto rounded" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['CPU', 'GPU', 'RAM', 'Storage', 'Motherboard', 'PSU'].map((category) => (
              <div 
                key={category} 
                className="bg-gray-50 p-4 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                  <img src="/placeholder.svg" alt={category} className="w-10 h-10" />
                </div>
                <h3 className="font-semibold">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        <HardwareList />
      </main>
      
      {/* Footer */}
      <footer className="bg-hub-blue text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">GAG Hardware Hub</h3>
              <p className="text-gray-300">
                Your trusted source for high-quality computer hardware components.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Shop</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-hub-accent">All Products</a></li>
                <li><a href="#" className="hover:text-hub-accent">Featured Items</a></li>
                <li><a href="#" className="hover:text-hub-accent">Deals</a></li>
                <li><a href="#" className="hover:text-hub-accent">New Arrivals</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-hub-accent">Contact Us</a></li>
                <li><a href="#" className="hover:text-hub-accent">FAQs</a></li>
                <li><a href="#" className="hover:text-hub-accent">Shipping Info</a></li>
                <li><a href="#" className="hover:text-hub-accent">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Connect</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-hub-accent">Twitter</a></li>
                <li><a href="#" className="hover:text-hub-accent">Facebook</a></li>
                <li><a href="#" className="hover:text-hub-accent">Instagram</a></li>
                <li><a href="#" className="hover:text-hub-accent">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 GAG Hardware Hub. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
