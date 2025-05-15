
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProductsUpload } from '@/hooks/useProductsUpload';
import { productSchema, ProductFormData } from '@/schemas/productFormSchema';
import ProductFormFields from '@/components/admin/ProductFormFields';
import ProductImageUpload from '@/components/admin/ProductImageUpload';
import { getAllCategories } from '@/services/categoryService';

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { uploadProductImage, isUploading } = useProductsUpload();
  
  const isEditing = !!id;

  // Form setup with validation
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category_id: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  // Query to fetch product if editing
  const { isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!isEditing) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*, categories:category_id(name, slug)')
        .eq('id', id)
        .single();
      
      if (error) throw new Error(error.message);
      
      // Pre-fill form with existing data
      form.reset({
        name: data.name,
        category_id: data.category_id,
        description: data.description || '',
        price: data.price,
        stock: data.stock,
      });
      
      // Set image preview if available
      if (data.image_url) {
        setImagePreview(data.image_url);
      }
      
      return data;
    },
    enabled: isEditing,
  });

  // Mutation to create or update product
  const mutation = useMutation({
    mutationFn: async (values: ProductFormData) => {
      // First, upload image if there's a new one
      let imageUrl = imagePreview;
      
      if (imageFile) {
        try {
          imageUrl = await uploadProductImage(imageFile);
          if (!imageUrl) {
            throw new Error('Failed to upload image');
          }
        } catch (error) {
          throw error;
        }
      }
      
      // Get the category name for backward compatibility
      const categories = await getAllCategories();
      const selectedCategory = categories.find(cat => cat.id === values.category_id);
      
      // Ensure we have all required fields for the product
      const productData = {
        name: values.name,
        category_id: values.category_id,
        category: selectedCategory?.name || "Sem categoria", // Add category for backward compatibility
        description: values.description || '',
        price: values.price,
        stock: values.stock,
        image_url: imageUrl || null,
      };
      
      if (isEditing) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
        
        if (error) throw new Error(error.message);
        return 'updated';
      } else {
        // Create new product with all required fields
        const { error } = await supabase
          .from('products')
          .insert(productData);
        
        if (error) throw new Error(error.message);
        return 'created';
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ['product', id] });
      }
      
      toast.success(
        result === 'created'
          ? 'Produto cadastrado com sucesso!'
          : 'Produto atualizado com sucesso!'
      );
      
      navigate('/admin-produtos');
    },
    onError: (error: Error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const onSubmit = (values: ProductFormData) => {
    mutation.mutate(values);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin-produtos')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Editar Produto' : 'Cadastrar Produto'}
          </h1>
        </div>

        {isEditing && isLoadingProduct ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-md shadow-sm border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <ProductFormFields />
                  </div>

                  <div className="space-y-6">
                    <ProductImageUpload
                      imagePreview={imagePreview}
                      setImageFile={setImageFile}
                      setImagePreview={setImagePreview}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting || mutation.isPending || isUploading}
                  >
                    {(form.formState.isSubmitting || mutation.isPending || isUploading) ? (
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

export default ProductForm;
