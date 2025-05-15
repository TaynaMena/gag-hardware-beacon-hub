
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Layout from '@/components/Layout';
import { useCollaboratorAuth } from '@/contexts/CollaboratorAuthContext';
import { Loader2 } from 'lucide-react';

// Schema for login
const loginSchema = z.object({
  matricula: z.string().min(1, 'A matrícula é obrigatória'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

// Schema for first time login
const firstLoginSchema = z.object({
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type FirstLoginFormValues = z.infer<typeof firstLoginSchema>;

const CollaboratorLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, firstTimeLogin } = useCollaboratorAuth();
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  
  // Get temp collaborator from localStorage
  const tempCollaborator = localStorage.getItem('temp_collaborator') 
    ? JSON.parse(localStorage.getItem('temp_collaborator') || '{}')
    : null;

  useEffect(() => {
    // If there's a temp collaborator, it means first time login
    if (tempCollaborator) {
      setIsFirstTimeLogin(true);
    }
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/colaborador');
    }
  }, [isAuthenticated, navigate, tempCollaborator]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      matricula: '',
      password: '',
    }
  });

  const firstLoginForm = useForm<FirstLoginFormValues>({
    resolver: zodResolver(firstLoginSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    const success = await login(values.matricula, values.password);
    if (success) {
      // If the returned collaborator doesn't have a password_hash, it means first time login
      if (!localStorage.getItem('collaborator')) {
        setIsFirstTimeLogin(true);
      } else {
        navigate('/colaborador');
      }
    }
  };

  const onFirstLoginSubmit = async (values: FirstLoginFormValues) => {
    if (tempCollaborator) {
      const success = await firstTimeLogin(tempCollaborator, values.password);
      if (success) {
        navigate('/colaborador');
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        {isFirstTimeLogin ? (
          <Card className="border border-gag-cyan/30 bg-black/40 backdrop-blur-md text-gag-white">
            <CardHeader className="border-b border-gag-cyan/20">
              <CardTitle className="text-gag-cyan">Primeiro acesso</CardTitle>
              <CardDescription className="text-gray-300">
                Olá {tempCollaborator?.name}, bem-vindo(a) à GAG Hardware! Por favor, crie uma senha para continuar.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...firstLoginForm}>
                <form onSubmit={firstLoginForm.handleSubmit(onFirstLoginSubmit)} className="space-y-4">
                  <FormField
                    control={firstLoginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gag-white">Nova senha</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Mínimo 6 caracteres" 
                            className="bg-black/40 border-gag-cyan/30 text-gag-white placeholder:text-gray-500" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={firstLoginForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gag-white">Confirme a senha</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirme sua senha" 
                            className="bg-black/40 border-gag-cyan/30 text-gag-white placeholder:text-gray-500" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-gag-blue hover:bg-gag-blue-dark" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Criando senha...</span>
                      </>
                    ) : (
                      "Criar senha e entrar"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-gag-cyan/30 bg-black/40 backdrop-blur-md text-gag-white">
            <CardHeader className="border-b border-gag-cyan/20">
              <CardTitle className="text-gag-cyan">Login do Colaborador</CardTitle>
              <CardDescription className="text-gray-300">
                Entre com sua matrícula e senha para acessar
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="matricula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gag-white">Matrícula</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite sua matrícula" 
                            className="bg-black/40 border-gag-cyan/30 text-gag-white placeholder:text-gray-500" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gag-white">Senha</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Digite sua senha" 
                            className="bg-black/40 border-gag-cyan/30 text-gag-white placeholder:text-gray-500" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-gag-blue hover:bg-gag-blue-dark" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Entrando...</span>
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gag-cyan/20">
              <p className="text-sm text-gray-400">
                Acesse com a matrícula fornecida pelo seu administrador
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default CollaboratorLogin;
