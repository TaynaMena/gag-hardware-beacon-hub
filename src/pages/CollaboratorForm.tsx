
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const collaboratorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  sector: z.string().optional(),
  phone: z.string().optional(),
});

type CollaboratorFormData = z.infer<typeof collaboratorSchema>;

const CollaboratorForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  // Form setup with validation
  const form = useForm<CollaboratorFormData>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: {
      name: '',
      matricula: '',
      email: '',
      sector: '',
      phone: '',
    },
  });

  // Query to fetch collaborator if editing
  const { isLoading: isLoadingCollaborator } = useQuery({
    queryKey: ['collaborator', id],
    queryFn: async () => {
      if (!isEditing) return null;
      
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw new Error(error.message);
      
      // Pre-fill form with existing data
      form.reset({
        name: data.name,
        matricula: data.matricula,
        email: data.email,
        sector: data.sector || '',
        phone: data.phone || '',
      });
      
      return data;
    },
    enabled: isEditing,
  });

  // Mutation to create or update collaborator
  const mutation = useMutation({
    mutationFn: async (values: CollaboratorFormData) => {
      if (isEditing) {
        // Update existing collaborator
        const { error } = await supabase
          .from('collaborators')
          .update(values)
          .eq('id', id);
        
        if (error) throw new Error(error.message);
        return 'updated';
      } else {
        // Check if matricula is unique
        const { data: existingCollaborator } = await supabase
          .from('collaborators')
          .select('id')
          .eq('matricula', values.matricula)
          .single();
        
        if (existingCollaborator) {
          throw new Error('Já existe um colaborador com esta matrícula.');
        }
        
        // Create new collaborator
        const { error } = await supabase
          .from('collaborators')
          .insert({
            name: values.name,
            matricula: values.matricula,
            email: values.email,
            sector: values.sector,
            phone: values.phone
          });
        
        if (error) throw new Error(error.message);
        return 'created';
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ['collaborator', id] });
      }
      
      toast({
        title: result === 'created' ? 'Colaborador cadastrado' : 'Colaborador atualizado',
        description: result === 'created' 
          ? 'Colaborador cadastrado com sucesso!' 
          : 'Colaborador atualizado com sucesso!',
      });
      
      navigate('/admin/colaboradores');
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: CollaboratorFormData) => {
    mutation.mutate(values);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/colaboradores')}
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isEditing ? 'Editar Colaborador' : 'Cadastrar Colaborador'}
          </h1>
        </div>

        {isEditing && isLoadingCollaborator ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-md shadow-sm border border-gray-700">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Nome completo*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nome do colaborador" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="matricula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Matrícula*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Matrícula do colaborador" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Email*</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="email@exemplo.com" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Setor</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Setor do colaborador" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Telefone</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(00) 00000-0000" 
                            {...field} 
                            className="bg-gray-900 border-gray-700 text-white" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting || mutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {(form.formState.isSubmitting || mutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CollaboratorForm;
