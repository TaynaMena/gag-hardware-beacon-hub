
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
      <section className="bg-gag-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Componentes de Hardware Premium
              </h1>
              <p className="text-lg mb-6 text-gray-100">
                Encontre as peças perfeitas para o seu próximo computador com nossa ampla seleção de componentes de hardware de alta qualidade.
              </p>
              <Button className="bg-gag-blue hover:bg-gag-blue-dark text-white">
                Comprar Agora <ChevronRight className="ml-2 h-5 w-5" />
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
          <h2 className="text-3xl font-bold mb-8 text-center text-gag-blue">Categorias em Destaque</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['CPU', 'GPU', 'RAM', 'Armazenamento', 'Placa-mãe', 'Fonte'].map((category) => (
              <div 
                key={category} 
                className="bg-gray-50 p-4 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gag-blue/20 hover:border-gag-blue"
              >
                <div className="w-16 h-16 mx-auto mb-3 bg-gag-blue/10 rounded-full flex items-center justify-center">
                  <img src="/placeholder.svg" alt={category} className="w-10 h-10" />
                </div>
                <h3 className="font-semibold text-gag-blue-dark">{category}</h3>
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
      <footer className="bg-gag-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">
                <img src="/lovable-uploads/21f3ed71-8d86-46b6-a366-7dd0be624a6c.png" alt="GAG Hardware" className="h-8" />
              </h3>
              <p className="text-gray-300">
                Sua fonte confiável de componentes de hardware de computador de alta qualidade.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Comprar</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-gag-cyan">Todos os Produtos</a></li>
                <li><a href="#" className="hover:text-gag-cyan">Itens em Destaque</a></li>
                <li><a href="#" className="hover:text-gag-cyan">Promoções</a></li>
                <li><a href="#" className="hover:text-gag-cyan">Novidades</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Suporte</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-gag-cyan">Contato</a></li>
                <li><a href="#" className="hover:text-gag-cyan">FAQ</a></li>
                <li><a href="#" className="hover:text-gag-cyan">Informações de Envio</a></li>
                <li><a href="#" className="hover:text-gag-cyan">Devoluções</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Conectar</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-gag-cyan">Twitter</a></li>
                <li><a href="#" className="hover:text-gag-cyan">Facebook</a></li>
                <li><a href="#" className="hover:text-gag-cyan">Instagram</a></li>
                <li><a href="#" className="hover:text-gag-cyan">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gag-blue/30 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 GAG Hardware Hub. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
