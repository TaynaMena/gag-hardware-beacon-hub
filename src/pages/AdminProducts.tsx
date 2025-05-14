
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Pencil, Trash2, Plus, X, Save } from "lucide-react";
import { ProductCategory, NewProduct, Product } from "@/types/Product";

const AdminProducts = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewProduct>({
    name: "",
    category: "Monitores",
    description: "",
    stock: 0,
    image_url: ""
  });
  
  const queryClient = useQueryClient();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto criado com sucesso!");
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar produto: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<NewProduct> }) =>
      updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto atualizado com sucesso!");
      setEditingId(null);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar produto: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto excluído com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir produto: ${error.message}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "stock" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setForm((prev) => ({ ...prev, category: value as ProductCategory }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure required fields are filled
    if (!form.name || !form.category) {
      toast.error("Por favor preencha todos os campos obrigatórios.");
      return;
    }
    
    if (editingId) {
      updateMutation.mutate({ id: editingId, updates: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      stock: product.stock,
      image_url: product.image_url
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "Monitores",
      description: "",
      stock: 0,
      image_url: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (error) {
    return (
      <Layout>
        <div className="p-6 bg-red-50 text-red-700 rounded-lg">
          Erro ao carregar produtos: {(error as Error).message}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gerenciamento de Produtos</CardTitle>
            <Button
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? "outline" : "default"}
            >
              {showForm ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Produto
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Nome do Produto*</label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Nome do produto"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">Categoria*</label>
                    <Select
                      value={form.category}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monitores">Monitores</SelectItem>
                        <SelectItem value="Periféricos">Periféricos</SelectItem>
                        <SelectItem value="Componentes">Componentes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium mb-1">Quantidade em Estoque*</label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={handleInputChange}
                      placeholder="Quantidade em estoque"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="image_url" className="block text-sm font-medium mb-1">URL da Imagem</label>
                    <Input
                      id="image_url"
                      name="image_url"
                      value={form.image_url || ""}
                      onChange={handleInputChange}
                      placeholder="URL da imagem do produto"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Descrição do produto"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {editingId ? "Atualizar Produto" : "Salvar Produto"}
                  </Button>
                </div>
              </form>
            )}

            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gag-purple mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando produtos...</p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Nome</th>
                      <th className="text-left py-2 px-4">Categoria</th>
                      <th className="text-center py-2 px-4">Estoque</th>
                      <th className="text-right py-2 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            {product.image_url && (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-10 w-10 object-cover rounded"
                              />
                            )}
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4">{product.category}</td>
                        <td className="py-2 px-4 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              product.stock === 0
                                ? "bg-red-100 text-red-800"
                                : product.stock < 3
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(product)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(product.id)}
                            title="Excluir"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  Nenhum produto cadastrado. Clique em "Novo Produto" para adicionar.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminProducts;
