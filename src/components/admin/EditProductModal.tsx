
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import ProductForm from './ProductForm';
import { Product } from '@/types/Product';
import { ProductFormValues } from '@/schemas/productFormSchema';

interface EditProductModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product: Product | null;
  onSubmit: (values: ProductFormValues) => void;
  isPending: boolean;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  setIsOpen,
  product,
  onSubmit,
  isPending
}) => {
  if (!product) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        <ProductForm 
          defaultValues={product}
          onSubmit={onSubmit}
          isSubmitting={isPending}
          submitButtonText="Atualizar Produto"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
