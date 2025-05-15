
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { generateSlug } from '@/services/categoryService';

const categorySchema = z.object({
  name: z.string().min(1, "Nome da categoria é obrigatório"),
  slug: z.string().min(1, "Slug da categoria é obrigatório"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  defaultValues?: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => void;
  isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ defaultValues, onSubmit, isSubmitting }) => {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues || {
      name: '',
      slug: '',
    },
  });
  
  const watchName = form.watch('name');
  
  // Auto-generate slug from name
  React.useEffect(() => {
    if (watchName && !defaultValues) {
      const slug = generateSlug(watchName);
      form.setValue('slug', slug);
    }
  }, [watchName, form, defaultValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Categoria</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Monitores" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (URL amigável)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ex: monitores" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : defaultValues ? 'Atualizar Categoria' : 'Criar Categoria'}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
