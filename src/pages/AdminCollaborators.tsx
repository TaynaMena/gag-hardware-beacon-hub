
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, Loader2, UserPlus } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';

interface Collaborator {
  id: string;
  name: string;
  matricula: string;
  sector: string | null;
  email: string;
}

const AdminCollaborators = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Query to fetch collaborators
  const { data: collaborators, isLoading } = useQuery({
    queryKey: ['collaborators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .order('name');
      
      if (error) throw new Error(error.message);
      return data as Collaborator[];
    },
  });

  // Mutation to delete a collaborator
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
      toast.success('Colaborador excluído com sucesso!');
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(`Erro ao excluir colaborador: ${error.message}`);
      setDeleteId(null);
    },
  });

  const handleEdit = (id: string) => {
    navigate(`/admin/editar-colaborador/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Colaboradores</h1>
          <Button
            onClick={() => navigate('/admin/cadastrar-colaborador')}
            className="mt-4 md:mt-0"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Cadastrar Novo
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : collaborators?.length ? (
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Nome</TableHead>
                  <TableHead className="w-[20%]">Matrícula</TableHead>
                  <TableHead className="w-[20%]">Setor</TableHead>
                  <TableHead className="w-[20%] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collaborators.map((collaborator) => (
                  <TableRow key={collaborator.id}>
                    <TableCell className="font-medium">{collaborator.name}</TableCell>
                    <TableCell>{collaborator.matricula}</TableCell>
                    <TableCell>{collaborator.sector || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(collaborator.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(collaborator.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-12 border rounded-md bg-white">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhum colaborador cadastrado</h3>
            <p className="text-gray-500 mb-6">
              Cadastre colaboradores para que eles possam usar a plataforma.
            </p>
            <Button onClick={() => navigate('/admin/cadastrar-colaborador')}>
              <UserPlus className="mr-2 h-4 w-4" /> Cadastrar Colaborador
            </Button>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este colaborador? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminCollaborators;
