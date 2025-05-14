
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Seller {
  id: string;
  name: string;
  email: string;
}

interface SellerAuthContextType {
  seller: Seller | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const SellerAuthContext = createContext<SellerAuthContextType | undefined>(undefined);

export const useSellerAuth = () => {
  const context = useContext(SellerAuthContext);
  if (!context) {
    throw new Error('useSellerAuth must be used within a SellerAuthProvider');
  }
  return context;
};

interface SellerAuthProviderProps {
  children: ReactNode;
}

export const SellerAuthProvider: React.FC<SellerAuthProviderProps> = ({ children }) => {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for stored seller on initial load
  useEffect(() => {
    const storedSeller = localStorage.getItem('seller');
    if (storedSeller) {
      try {
        setSeller(JSON.parse(storedSeller));
      } catch (error) {
        console.error('Error parsing stored seller:', error);
        localStorage.removeItem('seller');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Call the Supabase function to authenticate the seller
      const { data, error } = await supabase.rpc('authenticate_seller', {
        email_input: email,
        password_input: password,
      });

      if (error) {
        toast({
          title: "Erro de autenticação",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // Type assertion to safely handle the response
      const response = data as { success: boolean; seller?: Seller; message?: string };
      
      if (response && response.success) {
        setSeller(response.seller || null);
        localStorage.setItem('seller', JSON.stringify(response.seller));
        return true;
      } else {
        toast({
          title: "Falha no login",
          description: response?.message || "Credenciais inválidas",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setSeller(null);
    localStorage.removeItem('seller');
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso."
    });
  };

  const value = {
    seller,
    isLoading,
    login,
    logout,
    isAuthenticated: !!seller,
  };

  return (
    <SellerAuthContext.Provider value={value}>
      {children}
    </SellerAuthContext.Provider>
  );
};
