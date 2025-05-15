
import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertCircle, FileUp, Check, X } from 'lucide-react';
import { getAllCategories } from '@/services/categoryService';
import { importProductsFromJSON } from '@/services/productService';
import { NewProduct } from '@/types/Product';
import { toast } from '@/components/ui/sonner';

interface ImportData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
}

interface ValidationResult {
  isValid: boolean;
  data: Array<{
    rowData: ImportData;
    category_id?: string;
    errors: string[];
    rowIndex: number;
  }>;
}

const ImportProducts: React.FC = () => {
  const [importData, setImportData] = useState<ImportData[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: number;
    errors: { index: number; error: string }[];
  } | null>(null);
  
  // Fetch categories for validation
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ImportData[];
        
        setImportData(jsonData);
        validateImportData(jsonData);
        
        toast.success(`Arquivo ${file.name} carregado com sucesso`);
      } catch (error) {
        toast.error('Erro ao processar arquivo: formato inválido ou corrompido');
        console.error('Error processing file:', error);
      }
    };
    
    reader.readAsArrayBuffer(file);
  }, [categories]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });
  
  const validateImportData = (data: ImportData[]) => {
    if (!categories) {
      toast.error('Erro: Categorias não carregadas');
      return;
    }
    
    const validationResults: ValidationResult = {
      isValid: true,
      data: [],
    };
    
    data.forEach((row, index) => {
      const errors: string[] = [];
      let categoryId: string | undefined;
      
      // Validate required fields
      if (!row.name) errors.push('Nome é obrigatório');
      if (!row.price || row.price <= 0) errors.push('Preço deve ser maior que zero');
      if (row.stock === undefined || row.stock < 0) errors.push('Estoque não pode ser negativo');
      
      // Validate and find category
      if (!row.category) {
        errors.push('Categoria é obrigatória');
      } else {
        const category = categories.find(c => 
          c.name.toLowerCase() === row.category.toLowerCase() || 
          c.slug.toLowerCase() === row.category.toLowerCase()
        );
        
        if (!category) {
          errors.push(`Categoria '${row.category}' não encontrada`);
        } else {
          categoryId = category.id;
        }
      }
      
      validationResults.data.push({
        rowData: row,
        category_id: categoryId,
        errors,
        rowIndex: index + 2, // +2 because Excel starts at 1 and we have headers
      });
      
      if (errors.length > 0) {
        validationResults.isValid = false;
      }
    });
    
    setValidationResult(validationResults);
  };
  
  const handleImport = async () => {
    if (!validationResult || !validationResult.isValid) {
      toast.error('Não é possível importar devido a erros de validação');
      return;
    }
    
    try {
      setIsImporting(true);
      
      const productsToImport: Omit<NewProduct, 'image_url'>[] = validationResult.data.map(item => ({
        name: item.rowData.name,
        description: item.rowData.description || '',
        price: item.rowData.price,
        stock: item.rowData.stock,
        category_id: item.category_id!,
        category: item.rowData.category as any, // Para compatibilidade
      }));
      
      const result = await importProductsFromJSON(productsToImport);
      setImportResult(result);
      
      if (result.success > 0) {
        toast.success(`${result.success} produtos importados com sucesso`);
      }
      
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} produtos não puderam ser importados`);
      }
    } catch (error) {
      toast.error(`Erro na importação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };
  
  const resetImport = () => {
    setImportData([]);
    setValidationResult(null);
    setImportResult(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-md shadow border">
        <h2 className="text-xl font-semibold mb-4">Importar Produtos</h2>
        
        {!importData.length && (
          <div {...getRootProps()} className="border-2 border-dashed rounded-md p-10 text-center cursor-pointer hover:bg-gray-50">
            <input {...getInputProps()} />
            <FileUp className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">
              {isDragActive
                ? 'Solte o arquivo aqui...'
                : 'Arraste e solte um arquivo Excel aqui, ou clique para selecionar'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Formatos suportados: .xlsx, .xls
            </p>
          </div>
        )}
        
        {importData.length > 0 && !importResult && (
          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Visualização ({importData.length} linhas)</TabsTrigger>
              <TabsTrigger value="validation" disabled={!validationResult}>
                Validação {validationResult?.isValid 
                  ? <Check className="ml-1 h-4 w-4 text-green-500" /> 
                  : <AlertCircle className="ml-1 h-4 w-4 text-red-500" />}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="space-y-4">
              <div className="border rounded-md overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importData.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{row.name || ''}</TableCell>
                        <TableCell>{row.category || ''}</TableCell>
                        <TableCell>{row.price?.toFixed(2) || ''}</TableCell>
                        <TableCell>{row.stock}</TableCell>
                        <TableCell className="max-w-xs truncate">{row.description || ''}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={resetImport}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleImport}
                  disabled={isImporting || !validationResult?.isValid || categoriesLoading}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      Importar {importData.length} Produtos
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="validation">
              {validationResult && (
                <div className="space-y-4">
                  {!validationResult.isValid && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erros de Validação</AlertTitle>
                      <AlertDescription>
                        Corrija os erros antes de importar os produtos.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="border rounded-md overflow-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Linha</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Erros</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResult.data.map((row, i) => (
                          <TableRow key={i} className={row.errors.length > 0 ? "bg-red-50" : ""}>
                            <TableCell>{row.rowIndex}</TableCell>
                            <TableCell>{row.rowData.name || ''}</TableCell>
                            <TableCell>{row.rowData.category || ''}</TableCell>
                            <TableCell>
                              {row.errors.length > 0 ? (
                                <div className="flex items-center text-red-500">
                                  <X className="h-4 w-4 mr-1" /> Erro
                                </div>
                              ) : (
                                <div className="flex items-center text-green-500">
                                  <Check className="h-4 w-4 mr-1" /> Ok
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {row.errors.length > 0 ? (
                                <ul className="text-xs text-red-500">
                                  {row.errors.map((error, j) => (
                                    <li key={j}>{error}</li>
                                  ))}
                                </ul>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
        
        {importResult && (
          <div className="space-y-4">
            <Card className="p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center rounded-full p-2 bg-green-100 text-green-600 mb-3">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Importação Concluída</h3>
                <p className="text-gray-500">
                  {importResult.success} produtos importados com sucesso.
                </p>
                {importResult.errors.length > 0 && (
                  <p className="text-red-500">
                    {importResult.errors.length} produtos não puderam ser importados.
                  </p>
                )}
              </div>
            </Card>
            
            {importResult.errors.length > 0 && (
              <div className="border rounded-md overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Linha</TableHead>
                      <TableHead>Erro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importResult.errors.map((error, i) => (
                      <TableRow key={i}>
                        <TableCell>{error.index + 1}</TableCell>
                        <TableCell className="text-red-500">{error.error}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button onClick={resetImport}>
                Nova Importação
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportProducts;
