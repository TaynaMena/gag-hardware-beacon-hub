
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { SellerAuthProvider } from "./contexts/SellerAuthContext";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AdminProducts from "./pages/AdminProducts";
import AdminLogin from "./pages/AdminLogin";
import AdminCollaborators from "./pages/AdminCollaborators";
import CollaboratorForm from "./pages/CollaboratorForm";
import ProductForm from "./pages/ProductForm";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <SellerAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin-produtos" element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              } />
              <Route path="/admin/colaboradores" element={
                <ProtectedRoute>
                  <AdminCollaborators />
                </ProtectedRoute>
              } />
              <Route path="/admin/cadastrar-colaborador" element={
                <ProtectedRoute>
                  <CollaboratorForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/editar-colaborador/:id" element={
                <ProtectedRoute>
                  <CollaboratorForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/cadastrar-produto" element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/editar-produto/:id" element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SellerAuthProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
