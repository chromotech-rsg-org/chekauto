import { useState, useEffect } from "react";
import { ApiIntegrationLayout } from "@/components/admin/ApiIntegrationLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export default function InfoSimplesErros() {
  const [codigos, setCodigos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCodigo, setEditingCodigo] = useState<any>(null);
  const [formData, setFormData] = useState({ codigo: "", descricao: "", cobranca: false });

  useEffect(() => {
    loadCodigos();
  }, []);

  const loadCodigos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("codigos_erro_api")
        .select("*")
        .order("codigo", { ascending: true });

      if (error) throw error;
      setCodigos(data || []);
    } catch (error) {
      console.error("Erro ao carregar códigos:", error);
      toast.error("Erro ao carregar códigos de erro");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (codigo?: any) => {
    if (codigo) {
      setEditingCodigo(codigo);
      setFormData({
        codigo: codigo.codigo.toString(),
        descricao: codigo.descricao,
        cobranca: codigo.cobranca,
      });
    } else {
      setEditingCodigo(null);
      setFormData({ codigo: "", descricao: "", cobranca: false });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.codigo || !formData.descricao) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const dataToSave = {
        codigo: parseInt(formData.codigo),
        descricao: formData.descricao,
        cobranca: formData.cobranca,
      };

      if (editingCodigo) {
        const { error } = await supabase
          .from("codigos_erro_api")
          .update(dataToSave)
          .eq("id", editingCodigo.id);

        if (error) throw error;
        toast.success("Código atualizado com sucesso!");
      } else {
        const { error } = await supabase.from("codigos_erro_api").insert(dataToSave);

        if (error) throw error;
        toast.success("Código cadastrado com sucesso!");
      }

      setIsModalOpen(false);
      loadCodigos();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar código de erro");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este código?")) return;

    try {
      const { error } = await supabase.from("codigos_erro_api").delete().eq("id", id);

      if (error) throw error;
      toast.success("Código excluído com sucesso!");
      loadCodigos();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir código de erro");
    }
  };

  return (
    <ApiIntegrationLayout
      title="API InfoSimples"
      description="Gerencie os códigos de erro da API"
      basePath="/admin/api/infosimples"
      activeTab="erros"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => handleOpenModal()} className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
            <Plus className="h-4 w-4 mr-2" />
            Novo Código
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Cobrança</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codigos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Nenhum código de erro cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    codigos.map((codigo) => (
                      <TableRow key={codigo.id}>
                        <TableCell className="font-mono font-bold">{codigo.codigo}</TableCell>
                        <TableCell>{codigo.descricao}</TableCell>
                        <TableCell>
                          <Badge variant={codigo.cobranca ? "default" : "secondary"}>
                            {codigo.cobranca ? "Sim" : "Não"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal(codigo)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(codigo.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCodigo ? "Editar Código" : "Novo Código"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  type="number"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Ex: 400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição do código de erro"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="cobranca"
                  checked={formData.cobranca}
                  onCheckedChange={(checked) => setFormData({ ...formData, cobranca: checked })}
                />
                <Label htmlFor="cobranca">Gera cobrança</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ApiIntegrationLayout>
  );
}
