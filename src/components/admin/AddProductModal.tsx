
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProductForm from './ProductForm';
import { ProductFormValues } from '@/schemas/productFormSchema';

interface AddProductModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (values: ProductFormValues) => void;
  isPending: boolean;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ 
  isOpen, 
  setIsOpen, 
  onSubmit, 
  isPending 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Adicionar Produto</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
        </DialogHeader>
        <ProductForm 
          onSubmit={onSubmit}
          isSubmitting={isPending}
          submitButtonText="Salvar Produto"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
