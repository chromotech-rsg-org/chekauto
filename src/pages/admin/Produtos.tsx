import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export default function Produtos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria_id: "",
    preco: "",
    ativo: true,
  });

  useEffect(() => {
    loadProdutos();
    loadCategorias();
  }, []);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          *,
          categorias (
            id,
            nome
          )
        `)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome');

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const dataCriacao = produto.criado_em ? new Date(produto.criado_em).toISOString().split('T')[0] : '';
    const matchesDate = (!startDate || dataCriacao >= startDate) && 
      (!endDate || dataCriacao <= endDate);
    return matchesSearch && matchesDate;
  });

  const handleOpenModal = (produto?: any) => {
    if (produto) {
      setEditingProduto(produto);
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao || "",
        categoria_id: produto.categoria_id || "",
        preco: produto.preco?.toString() || "",
        ativo: produto.ativo ?? true,
      });
    } else {
      setEditingProduto(null);
      setFormData({
        nome: "",
        descricao: "",
        categoria_id: "",
        preco: "",
        ativo: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      toast.error("Nome do produto é obrigatório");
      return;
    }
    if (!formData.preco || Number(formData.preco) <= 0) {
      toast.error("Preço deve ser maior que zero");
      return;
    }

    try {
      const produtoData = {
        nome: formData.nome,
        descricao: formData.descricao,
        categoria_id: formData.categoria_id || null,
        preco: Number(formData.preco),
        ativo: formData.ativo,
      };

      if (editingProduto) {
        const { error } = await supabase
          .from('produtos')
          .update(produtoData)
          .eq('id', editingProduto.id);

        if (error) throw error;
        toast.success("Produto atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from('produtos')
          .insert(produtoData);

        if (error) throw error;
        toast.success("Produto criado com sucesso!");
      }

      setIsModalOpen(false);
      setFormData({
        nome: "",
        descricao: "",
        categoria_id: "",
        preco: "",
        ativo: true,
      });
      loadProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Erro ao salvar produto');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const { error } = await supabase
          .from('produtos')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success("Produto excluído com sucesso!");
        loadProdutos();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        toast.error('Erro ao excluir produto');
      }
    }
  };

  const exportFields = [
    { key: "nome", label: "Nome" },
    { key: "descricao", label: "Descrição" },
    { key: "preco", label: "Preço" },
    { key: "categoria", label: "Categoria" },
    { key: "ativo", label: "Status" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Produtos</h1>
            <p className="text-muted-foreground">Gerencie o catálogo de produtos</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduto ? 'Editar Produto' : 'Criar Novo Produto'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="nome">Nome do Produto *</Label>
                    <Input 
                      id="nome" 
                      placeholder="Ex: Consulta Veicular Completa" 
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço (R$) *</Label>
                    <Input 
                      id="preco" 
                      type="number" 
                      step="0.01"
                      placeholder="Ex: 49.90"
                      value={formData.preco}
                      onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select 
                      value={formData.categoria_id} 
                      onValueChange={(value) => setFormData({ ...formData, categoria_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea 
                      id="descricao" 
                      placeholder="Descrição detalhada do produto"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2 col-span-2">
                    <Switch
                      id="ativo"
                      checked={formData.ativo}
                      onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                    />
                    <Label htmlFor="ativo">Produto ativo</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingProduto ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <DateRangeFilter 
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClear={() => { setStartDate(""); setEndDate(""); }}
          />

          <ExportButton 
            data={filteredProdutos.map(p => ({
              ...p,
              categoria: p.categorias?.nome || 'Sem categoria',
              ativo: p.ativo ? 'Ativo' : 'Inativo'
            }))} 
            fields={exportFields} 
            filename="produtos"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProdutos.length === 0 ? (
              <div className="col-span-full text-center p-8 text-muted-foreground">
                Nenhum produto cadastrado
              </div>
            ) : (
              filteredProdutos.map((produto) => (
                <Card key={produto.id}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{produto.nome}</h3>
                          {produto.categorias && (
                            <p className="text-sm text-muted-foreground">{produto.categorias.nome}</p>
                          )}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${produto.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {produto.ativo ? 'Ativo' : 'Inativo'}
                        </div>
                      </div>
                      
                      {produto.descricao && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {produto.descricao}
                        </p>
                      )}
                      
                      <div className="pt-2 border-t">
                        <p className="text-2xl font-bold text-brand-yellow">
                          R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenModal(produto)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(produto.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}