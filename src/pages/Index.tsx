
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import HardwareList from '@/components/HardwareList';
import { Button } from '@/components/ui/button';
import { ChevronRight, Cpu, Monitor, Headphones, Keyboard, Mouse, HardDrive } from 'lucide-react';

const Index = () => {
  // Scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gag-dark">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gag-blue-dark/20 to-black/80"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(0,0,108,0.4),transparent_70%)]"></div>
          <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_bottom_right,rgba(21,241,255,0.15),transparent_70%)]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0 reveal">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gag-white leading-tight">
                Componentes de <span className="text-gag-cyan">Hardware</span> de Alta Performance
              </h1>
              <p className="text-xl mb-8 text-gray-300 max-w-lg">
                Descubra a linha completa de componentes e periféricos para montar seu setup perfeito. 
                Qualidade premium e preços competitivos.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="gag-button-primary text-lg py-6 px-8">
                  Ver Produtos <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="gag-button-outline text-lg py-6 px-8">
                  Montagem Personalizada
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center reveal">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gag-cyan/20 rounded-lg blur-lg"></div>
                <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-gag-cyan/30 shadow-2xl relative">
                  <img 
                    src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7" 
                    alt="Hardware de alta performance" 
                    className="w-full max-w-lg h-auto rounded-lg" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 reveal bg-gradient-to-b from-black/40 to-transparent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gag-cyan">
            Categorias em <span className="text-gag-white">Destaque</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'CPUs', icon: <Cpu /> },
              { name: 'Monitores', icon: <Monitor /> },
              { name: 'Headsets', icon: <Headphones /> },
              { name: 'Teclados', icon: <Keyboard /> },
              { name: 'Mouses', icon: <Mouse /> },
              { name: 'Armazenamento', icon: <HardDrive /> }
            ].map((category) => (
              <div 
                key={category.name} 
                className="bg-black/40 backdrop-blur-sm p-6 rounded-lg text-center transition-all hover:transform hover:-translate-y-1 cursor-pointer border border-gag-cyan/20 hover:border-gag-cyan/60 group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gag-blue/20 rounded-full flex items-center justify-center group-hover:bg-gag-blue/40 transition-colors">
                  <div className="text-gag-cyan group-hover:text-gag-lime transition-colors">
                    {category.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gag-white group-hover:text-gag-cyan transition-colors">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 reveal">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gag-cyan">
              Produtos <span className="text-gag-white">Populares</span>
            </h2>
            <Button variant="outline" className="gag-button-outline">
              Ver Todos <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <HardwareList />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 reveal bg-gradient-to-r from-gag-blue-dark/40 to-black/60">
        <div className="container mx-auto px-4">
          <div className="bg-black/60 backdrop-blur-md p-8 md:p-12 rounded-lg border border-gag-cyan/30">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:max-w-lg">
                <h2 className="text-3xl font-bold mb-4 text-gag-white">
                  Monte seu <span className="text-gag-lime">Setup Gamer</span> com os melhores componentes
                </h2>
                <p className="text-gray-300 mb-6">
                  Temos tudo o que você precisa para montar um computador de alta performance. 
                  Consulte nossos especialistas para uma configuração personalizada.
                </p>
                <Button className="gag-button-secondary">
                  Falar com Especialista
                </Button>
              </div>
              <div className="max-w-xs">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gag-lime/20 rounded-full blur-xl"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5" 
                    alt="Setup Gamer" 
                    className="relative rounded-lg border-2 border-gag-lime/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black mt-auto border-t border-gag-cyan/20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img 
                src="/lovable-uploads/eb34af22-c138-4004-a47b-ecfe0724a94c.png" 
                alt="GAG Hardware" 
                className="h-10 mb-4"
              />
              <p className="text-gray-400 mb-4">
                Sua fonte confiável de componentes de hardware de alta qualidade para computadores e periféricos.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gag-cyan">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gag-cyan">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gag-cyan">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-gag-white">Produtos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-gag-cyan transition-colors">Processadores</a></li>
                <li><a href="#" className="hover:text-gag-cyan transition-colors">Placas de Vídeo</a></li>
                <li><a href="#" className="hover:text-gag-cyan transition-colors">Placas-mãe</a></li>
                <li><a href="#" className="hover:text-gag-cyan transition-colors">Memória RAM</a></li>
                <li><a href="#" className="hover:text-gag-cyan transition-colors">Periféricos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-gag-white">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-gag-cyan transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-gag-cyan transition-colors">Política de Garantia</a></li>
                <li><a href="#" className="hover:text-gag-cyan transition-colors">Envio e Entrega</a></li>
                <li><a href="#" className="hover:text-gag-cyan transition-colors">Devolução e Reembolso</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-gag-white">Contato</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <span className="mr-3">📍</span> 
                  <span>Av. Tecnologia, 1000<br />São Paulo, SP</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-3">📱</span> 
                  <span>(11) 9999-8888</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-3">✉️</span> 
                  <span>contato@gaghardware.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gag-cyan/20 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} GAG Hardware Hub. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
