import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Collaborator } from '@/types/Collaborator';

interface CollaboratorAuthContextType {
  collaborator: Collaborator | null;
  isLoading: boolean;
  login: (matricula: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  firstTimeLogin: (collaborator: Collaborator, password: string) => Promise<boolean>;
  monthlyOrderCount: number;
  updateMonthlyOrderCount: () => Promise<void>;
  monthlyCap: number;
}

const CollaboratorAuthContext = createContext<CollaboratorAuthContextType | undefined>(undefined);

export const useCollaboratorAuth = () => {
  const context = useContext(CollaboratorAuthContext);
  if (!context) {
    throw new Error('useCollaboratorAuth must be used within a CollaboratorAuthProvider');
  }
  return context;
};

interface CollaboratorAuthProviderProps {
  children: ReactNode;
}

export const CollaboratorAuthProvider: React.FC<CollaboratorAuthProviderProps> = ({ children }) => {
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyOrderCount, setMonthlyOrderCount] = useState(0);
  const monthlyCap = 4; // Maximum orders per month

  // Load stored collaborator on initial load
  useEffect(() => {
    const storedCollaborator = localStorage.getItem('collaborator');
    if (storedCollaborator) {
      try {
        const parsed = JSON.parse(storedCollaborator);
        setCollaborator(parsed);
        // Load monthly order count when collaborator is loaded
        if (parsed && parsed.id) {
          fetchMonthlyOrderCount(parsed.id);
        }
      } catch (error) {
        console.error('Error parsing stored collaborator:', error);
        localStorage.removeItem('collaborator');
      }
    }
    setIsLoading(false);
  }, []);

  // Fetch the number of orders placed by the collaborator in the current month
  const fetchMonthlyOrderCount = async (collaboratorId: string) => {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', collaboratorId)
        .gte('created_at', firstDayOfMonth)
        .lte('created_at', lastDayOfMonth);

      if (error) {
        console.error('Error fetching monthly order count:', error);
        return;
      }

      setMonthlyOrderCount(count || 0);
    } catch (error) {
      console.error('Error in fetchMonthlyOrderCount:', error);
    }
  };

  const updateMonthlyOrderCount = async () => {
    if (collaborator?.id) {
      await fetchMonthlyOrderCount(collaborator.id);
    }
  };

  const login = async (matricula: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // First check if collaborator exists
      const { data: collaboratorData, error: collaboratorError } = await supabase
        .from('collaborators')
        .select('*')
        .eq('matricula', matricula)
        .single();

      if (collaboratorError || !collaboratorData) {
        toast({
          description: "Matrícula não encontrada",
          variant: "destructive",
        });
        return false;
      }

      // Now check if the collaborator has a passwordHash field
      if (!collaboratorData.password_hash) {
        // First time login
        setCollaborator(collaboratorData);
        localStorage.setItem('temp_collaborator', JSON.stringify(collaboratorData));
        return true;
      }

      // Regular login with password
      if (collaboratorData.password_hash !== password) {
        toast({
          description: "Senha incorreta",
          variant: "destructive",
        });
        return false;
      }

      // Successful login
      setCollaborator(collaboratorData);
      localStorage.setItem('collaborator', JSON.stringify(collaboratorData));
      
      // Fetch monthly order count
      await fetchMonthlyOrderCount(collaboratorData.id);
      
      toast({
        description: `Bem-vindo, ${collaboratorData.name}!`,
      });
      return true;
      
    } catch (error) {
      console.error('Login error:', error);
      toast({
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const firstTimeLogin = async (collaborator: Collaborator, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Update collaborator with password
      const { error } = await supabase
        .from('collaborators')
        .update({ password_hash: password })
        .eq('id', collaborator.id);

      if (error) {
        toast({
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // Login the collaborator
      setCollaborator(collaborator);
      localStorage.setItem('collaborator', JSON.stringify(collaborator));
      localStorage.removeItem('temp_collaborator');
      
      // Fetch monthly order count
      await fetchMonthlyOrderCount(collaborator.id as string);
      
      toast({
        description: `Senha criada com sucesso! Bem-vindo, ${collaborator.name}!`,
      });
      return true;

    } catch (error) {
      console.error('First time login error:', error);
      toast({
        description: "Ocorreu um erro ao criar senha. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setCollaborator(null);
    localStorage.removeItem('collaborator');
    setMonthlyOrderCount(0);
    toast({
      description: "Você saiu da sua conta com sucesso."
    });
  };

  const value = {
    collaborator,
    isLoading,
    login,
    logout,
    isAuthenticated: !!collaborator,
    firstTimeLogin,
    monthlyOrderCount,
    updateMonthlyOrderCount,
    monthlyCap
  };

  return (
    <CollaboratorAuthContext.Provider value={value}>
      {children}
    </CollaboratorAuthContext.Provider>
  );
};
