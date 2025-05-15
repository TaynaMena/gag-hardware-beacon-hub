
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="*" element={<Index />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </CartProvider>
    </Router>
  );
}

export default App;
