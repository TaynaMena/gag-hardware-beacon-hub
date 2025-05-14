import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Loader2, ArrowLeft, Save, Upload, Image, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ProductCategory } from '@/types/Product';
import { useProductsUpload } from '@/hooks/useProductsUpload';

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  category: z.enum(['Monitores', 'Periféricos', 'Componentes'] as const, {
    required_error: "Categoria é obrigatória",
  }),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "Preço deve ser maior que zero"),
  stock: z.coerce.number().int().min(0, "Estoque não pode ser negativo"),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { uploadProductImage, isUploading } = useProductsUpload();
  
  const isEditing = !!id;

  // Form setup with validation
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: undefined,
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
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw new Error(error.message);
      
      // Pre-fill form with existing data
      form.reset({
        name: data.name,
        category: data.category as ProductCategory,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImageSelection = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      
      // Ensure we have all required fields for the product
      const productData = {
        name: values.name,            // Required field
        category: values.category,    // Required field
        description: values.description || '',
        price: values.price,
        stock: values.stock,
        image_url: imageUrl || null,  // Optional field
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
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Produto*</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do produto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Monitores">Monitores</SelectItem>
                              <SelectItem value="Periféricos">Periféricos</SelectItem>
                              <SelectItem value="Componentes">Componentes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço (R$)*</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estoque*</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o produto"
                              className="resize-none min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label>Imagem do Produto</Label>
                      
                      <div className="border-2 border-dashed rounded-md border-gray-300 p-4 transition-all hover:border-blue-400">
                        {imagePreview ? (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="max-h-[200px] mx-auto rounded-md"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2"
                              onClick={clearImageSelection}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div 
                            className="flex flex-col items-center justify-center py-8 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Image className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                              Clique para fazer upload de uma imagem
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PNG, JPG ou WEBP até 5MB
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>
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
