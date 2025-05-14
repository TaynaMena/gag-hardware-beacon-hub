
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useProductsUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadProductImage = async (file: File): Promise<string | null> => {
    if (!file) return null;
    
    setIsUploading(true);
    try {
      // Check if file size is too large (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Imagem muito grande. O tamanho máximo é 5MB.');
        return null;
      }
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error(`Erro ao fazer upload: ${uploadError.message}`);
        return null;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao fazer upload da imagem.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadProductImage,
    isUploading
  };
};
