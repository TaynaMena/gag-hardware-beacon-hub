
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Offers from "./pages/Offers";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import CollaboratorLogin from "./pages/CollaboratorLogin";
import UserAuth from "./pages/UserAuth";
import { CartProvider } from "./contexts/CartContext";
import { SellerAuthProvider } from "./contexts/SellerAuthContext";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { CollaboratorAuthProvider } from "./contexts/CollaboratorAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";
import CollaboratorProtectedRoute from "./components/CollaboratorProtectedRoute";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminCollaborators from "./pages/AdminCollaborators";
import CollaboratorDashboard from "./pages/CollaboratorDashboard";
import Home from "./pages/Home";
import ProductShowcase from "./pages/ProductShowcase";
import { Toaster } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SellerAuthProvider>
          <UserAuthProvider>
            <CollaboratorAuthProvider>
              <CartProvider>
                <Routes>
                  {/* Páginas públicas */}
                  <Route path="/" element={<Index />} />
                  <Route path="/produtos" element={<Products />} />
                  <Route path="/vitrine" element={<ProductShowcase />} />
                  <Route path="/ofertas" element={<Offers />} />
                  <Route path="/carrinho" element={<Cart />} />
                  <Route path="/auth" element={<UserAuth />} />
                  
                  {/* Área administrativa */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin-produtos" element={
                    <ProtectedRoute>
                      <AdminProducts />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin-categorias" element={
                    <ProtectedRoute>
                      <AdminCategories />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin-colaboradores" element={
                    <ProtectedRoute>
                      <AdminCollaborators />
                    </ProtectedRoute>
                  } />
                  
                  {/* Área do colaborador */}
                  <Route path="/colaborador/login" element={<CollaboratorLogin />} />
                  <Route path="/colaborador" element={
                    <CollaboratorProtectedRoute>
                      <CollaboratorDashboard />
                    </CollaboratorProtectedRoute>
                  } />
                  
                  {/* Páginas de produtos */}
                  <Route path="/home" element={<Home />} />
                  
                  {/* Rota de fallback */}
                  <Route path="*" element={<Index />} />
                </Routes>
                <Toaster position="top-right" richColors />
              </CartProvider>
            </CollaboratorAuthProvider>
          </UserAuthProvider>
        </SellerAuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
