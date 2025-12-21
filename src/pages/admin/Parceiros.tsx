import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import InputMask from "react-input-mask";
import { toast } from "sonner";

const exportFields = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "cpf_cnpj", label: "CPF/CNPJ" },
  { key: "email", label: "Email" },
  { key: "telefone", label: "Telefone" },
  { key: "wallet_id", label: "Wallet ID Asaas" },
  { key: "percentual_split", label: "Percentual Split" },
  { key: "ativo", label: "Status" },
  { key: "criado_em", label: "Data Cadastro" }
];

export default function Parceiros() {
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParceiro, setEditingParceiro] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    cpf_cnpj: "",
    email: "",
    telefone: "",
    wallet_id: "",
    percentual_split: 0,
    ativo: true
  });

  useEffect(() => {
    loadParceiros();
  }, []);

  const loadParceiros = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('parceiros')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setParceiros(data || []);
    } catch (error) {
      console.error('Erro ao carregar parceiros:', error);
      toast.error('Erro ao carregar parceiros');
    } finally {
      setLoading(false);
    }
  };

  const filteredParceiros = parceiros.filter(
    (p) => {
      const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.cpf_cnpj || '').includes(searchTerm);
      
      const dataCriacao = p.criado_em ? new Date(p.criado_em).toISOString().split('T')[0] : '';
      const matchesDate = (!startDate || dataCriacao >= startDate) && 
        (!endDate || dataCriacao <= endDate);
      
      return matchesSearch && matchesDate;
    }
  );

  const handleOpenModal = (parceiro?: any) => {
    if (parceiro) {
      setEditingParceiro(parceiro);
      setFormData({
        nome: parceiro.nome,
        cpf_cnpj: parceiro.cpf_cnpj,
        email: parceiro.email || "",
        telefone: parceiro.telefone || "",
        wallet_id: parceiro.wallet_id || "",
        percentual_split: parceiro.percentual_split || 0,
        ativo: parceiro.ativo ?? true
      });
    } else {
      setEditingParceiro(null);
      setFormData({
        nome: "",
        cpf_cnpj: "",
        email: "",
        telefone: "",
        wallet_id: "",
        percentual_split: 0,
        ativo: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.cpf_cnpj) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      if (editingParceiro) {
        const { error } = await supabase
          .from('parceiros')
          .update(formData)
          .eq('id', editingParceiro.id);

        if (error) throw error;
        toast.success("Parceiro atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from('parceiros')
          .insert(formData);

        if (error) throw error;
        toast.success("Parceiro cadastrado com sucesso!");
      }

      setIsModalOpen(false);
      loadParceiros();
    } catch (error) {
      console.error('Erro ao salvar parceiro:', error);
      toast.error('Erro ao salvar parceiro');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este parceiro?")) return;

    try {
      const { error } = await supabase
        .from('parceiros')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Parceiro excluído com sucesso!");
      loadParceiros();
    } catch (error) {
      console.error('Erro ao excluir parceiro:', error);
      toast.error('Erro ao excluir parceiro');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Parceiros</h1>
            <p className="text-muted-foreground">Gerencie os parceiros do sistema</p>
          </div>
          
          <Button onClick={() => handleOpenModal()} className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
            <Plus className="mr-2 h-4 w-4" />
            Novo Parceiro
          </Button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou CPF/CNPJ..."
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
            data={filteredParceiros}
            fields={exportFields}
            filename="parceiros"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Wallet ID</TableHead>
                  <TableHead>Percentual Split</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParceiros.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhum parceiro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParceiros.map((parceiro) => (
                    <TableRow key={parceiro.id}>
                      <TableCell className="font-medium">{parceiro.nome}</TableCell>
                      <TableCell className="font-mono text-sm">{parceiro.cpf_cnpj}</TableCell>
                      <TableCell>{parceiro.email || '-'}</TableCell>
                      <TableCell className="font-mono text-xs">{parceiro.wallet_id || '-'}</TableCell>
                      <TableCell className="font-semibold">{parceiro.percentual_split}%</TableCell>
                      <TableCell>
                        <Badge variant={parceiro.ativo ? "default" : "secondary"}>
                          {parceiro.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(parceiro)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(parceiro.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingParceiro ? "Editar Parceiro" : "Novo Parceiro"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="nome">Nome / Razão Social *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome completo ou razão social"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf_cnpj">CPF/CNPJ *</Label>
                  <InputMask
                    mask={formData.cpf_cnpj.replace(/\D/g, '').length <= 11 ? "999.999.999-99" : "99.999.999/9999-99"}
                    value={formData.cpf_cnpj}
                    onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                  >
                    {(inputProps: any) => <Input {...inputProps} placeholder="000.000.000-00" />}
                  </InputMask>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  >
                    {(inputProps: any) => <Input {...inputProps} placeholder="(00) 00000-0000" />}
                  </InputMask>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet_id">Wallet ID Asaas (Split Fácil)</Label>
                  <Input
                    id="wallet_id"
                    value={formData.wallet_id}
                    onChange={(e) => setFormData({ ...formData, wallet_id: e.target.value })}
                    placeholder="Ex: abc123def456..."
                  />
                  <p className="text-xs text-muted-foreground">
                    ID da carteira do parceiro no Asaas para receber splits
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="percentual_split">Percentual Split (%)</Label>
                  <Input
                    id="percentual_split"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.percentual_split}
                    onChange={(e) => setFormData({ ...formData, percentual_split: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                  <Label htmlFor="ativo">Parceiro Ativo</Label>
                </div>
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
    </AdminLayout>
  );
}
