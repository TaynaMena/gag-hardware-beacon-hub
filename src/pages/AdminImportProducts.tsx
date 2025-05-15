
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSpreadsheet, HelpCircle } from 'lucide-react';
import ImportProducts from '@/components/admin/ImportProducts';

const AdminImportProducts = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Importar Produtos</h1>
          <p className="text-gray-500 mt-2">
            Importe produtos em massa a partir de arquivos Excel.
          </p>
        </div>

        <Tabs defaultValue="import">
          <TabsList>
            <TabsTrigger value="import">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Importar Produtos
            </TabsTrigger>
            <TabsTrigger value="help">
              <HelpCircle className="h-4 w-4 mr-2" />
              Ajuda
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="import">
            <ImportProducts />
          </TabsContent>
          
          <TabsContent value="help">
            <div className="bg-white p-6 rounded-md shadow border">
              <h2 className="text-xl font-semibold mb-4">Como Importar Produtos</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Formato do Arquivo</h3>
                  <p className="text-gray-600">
                    O arquivo Excel deve conter as seguintes colunas:
                  </p>
                  <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
                    <li><strong>name</strong> (obrigatório): Nome do produto</li>
                    <li><strong>category</strong> (obrigatório): Nome ou slug da categoria existente</li>
                    <li><strong>price</strong> (obrigatório): Preço do produto (deve ser maior que zero)</li>
                    <li><strong>stock</strong> (obrigatório): Quantidade em estoque (deve ser maior ou igual a zero)</li>
                    <li><strong>description</strong> (opcional): Descrição do produto</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Processo de Importação</h3>
                  <ol className="list-decimal list-inside mt-2 ml-4 space-y-2">
                    <li>Arraste e solte seu arquivo Excel na área designada ou clique para selecionar um arquivo.</li>
                    <li>Revise os dados detectados na aba de visualização.</li>
                    <li>Verifique a aba de validação para identificar possíveis erros.</li>
                    <li>Clique no botão "Importar" para iniciar o processo.</li>
                    <li>Aguarde a conclusão da importação e verifique os resultados.</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Importante</h3>
                  <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
                    <li>As categorias devem existir previamente no sistema.</li>
                    <li>Certifique-se de que os dados estejam formatados corretamente.</li>
                    <li>Produtos com erros não serão importados.</li>
                    <li>O processo é transacional - produtos válidos serão importados mesmo que alguns falhem.</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminImportProducts;
