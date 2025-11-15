import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, Package, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const exportFields = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "descricao", label: "Descrição" },
  { key: "produtosCount", label: "Quantidade Produtos" },
  { key: "dataCriacao", label: "Data Criação" }
];

export default function Categorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
  });

  // Carregar categorias do banco
  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategorias = categorias.filter((cat) => {
    const matchesSearch = cat.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const dataCriacao = cat.criado_em ? new Date(cat.criado_em).toISOString().split('T')[0] : '';
    const matchesDate = (!startDate || dataCriacao >= startDate) && 
      (!endDate || dataCriacao <= endDate);
    return matchesSearch && matchesDate;
  });

  const handleOpenModal = (categoria?: any) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nome: categoria.nome,
        descricao: categoria.descricao,
      });
    } else {
      setEditingCategoria(null);
      setFormData({ nome: "", descricao: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    try {
      if (editingCategoria) {
        // Editar
        const { error } = await supabase
          .from('categorias')
          .update({
            nome: formData.nome,
            descricao: formData.descricao,
          })
          .eq('id', editingCategoria.id);

        if (error) throw error;
        toast.success("Categoria atualizada com sucesso!");
      } else {
        // Criar
        const { error } = await supabase
          .from('categorias')
          .insert({
            nome: formData.nome,
            descricao: formData.descricao,
          });

        if (error) throw error;
        toast.success("Categoria criada com sucesso!");
      }

      setIsModalOpen(false);
      setFormData({ nome: "", descricao: "" });
      loadCategorias();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast.error('Erro ao salvar categoria');
    }
  };

  const handleDelete = async (id: string) => {
    const categoria = categorias.find((cat) => cat.id === id);
    
    // Verificar se tem produtos associados
    const { count } = await supabase
      .from('produtos')
      .select('*', { count: 'exact', head: true })
      .eq('categoria_id', id);

    if (count && count > 0) {
      toast.error(`Não é possível excluir. Esta categoria tem ${count} produto(s) associado(s).`);
      return;
    }

    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        const { error } = await supabase
          .from('categorias')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success("Categoria excluída com sucesso!");
        loadCategorias();
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        toast.error('Erro ao excluir categoria');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categorias de Produtos</h1>
            <p className="text-muted-foreground">Gerencie as categorias do catálogo</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-brand-yellow hover:bg-brand-yellow/90 text-black"
                onClick={() => handleOpenModal()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategoria ? "Editar Categoria" : "Nova Categoria"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Categoria *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Tanques, Baús, Reboques..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva a categoria..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-brand-yellow hover:bg-brand-yellow/90 text-black"
                  onClick={handleSave}
                >
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClear={() => { setStartDate(""); setEndDate(""); }}
          />
          <ExportButton 
            data={filteredCategorias}
            fields={exportFields}
            filename="categorias"
          />
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Produtos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">{categoria.nome}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {categoria.descricao}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Package className="h-4 w-4" />
                      {categoria.produtos_count || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenModal(categoria)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(categoria.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCategorias.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    {loading ? 'Carregando...' : 'Nenhuma categoria encontrada'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
