
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from '@/components/ui/sonner'

// Adiciona a classe dark ao HTML para aplicar o tema escuro
document.documentElement.classList.add('dark');

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>
);
