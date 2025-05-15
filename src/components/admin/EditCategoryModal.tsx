
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CategoryForm from './CategoryForm';
import { Category, CategoryUpdate } from '@/types/Category';

interface EditCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSubmit: (id: string, values: CategoryUpdate) => void;
  isPending: boolean;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onOpenChange,
  category,
  onSubmit,
  isPending
}) => {
  if (!category) return null;
  
  const handleSubmit = (values: CategoryUpdate) => {
    onSubmit(category.id, values);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>
        <CategoryForm
          defaultValues={category}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
