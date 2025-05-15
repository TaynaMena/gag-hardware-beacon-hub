
import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSellerAuth } from '@/contexts/SellerAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useSellerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page the user was trying to visit
  const from = location.state?.from?.pathname || '/admin-produtos';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // Validate fields
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setIsSubmitting(false);
      return;
    }

    // Attempt login
    const success = await login(email, password);
    
    if (success) {
      // Redirect to the page they were trying to access, or default
      navigate(from, { replace: true });
    } else {
      setError('Email ou senha incorretos.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gag-dark">
      <Card className="w-full max-w-md shadow-lg border border-gag-cyan/30 bg-black/40 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/3c9dcd17-393d-4323-834c-ed34a5d7eb30.png"
              alt="GAG Hardware" 
              className="h-16" 
            />
          </div>
          <CardTitle className="text-2xl text-center font-bold text-gag-cyan">Acesso de Vendedor</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Faça login para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/30 p-3 rounded-md flex items-start gap-2 text-red-300 text-sm border border-red-800/50">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gag-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@gaghardware.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="gag-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gag-white">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="gag-input"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gag-blue hover:bg-gag-blue-dark" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-400">
          Acesso restrito a vendedores autorizados
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
