
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Image, X } from 'lucide-react';

interface ProductImageUploadProps {
  imagePreview: string | null;
  setImageFile: (file: File | null) => void;
  setImagePreview: (preview: string | null) => void;
}

const ProductImageUpload = ({ 
  imagePreview, 
  setImageFile,
  setImagePreview 
}: ProductImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
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
  );
};

export default ProductImageUpload;
