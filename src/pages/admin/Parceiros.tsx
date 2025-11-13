import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockParceiros } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import InputMask from "react-input-mask";
import { toast } from "sonner";
import { buscarCep } from "@/lib/cep";

export default function Parceiros() {
  const [parceiros, setParceiros] = useState(mockParceiros);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParceiro, setEditingParceiro] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    cpfCnpj: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    percentual: 0,
    walletId: "",
    status: "Ativo",
    observacoes: ""
  });

  const filteredParceiros = parceiros.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cpfCnpj.includes(searchTerm)
  );

  const handleOpenModal = (parceiro?: any) => {
    if (parceiro) {
      setEditingParceiro(parceiro);
      setFormData(parceiro);
    } else {
      setEditingParceiro(null);
      setFormData({
        nome: "",
        cpfCnpj: "",
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        percentual: 0,
        walletId: "",
        status: "Ativo",
        observacoes: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.cpfCnpj) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (editingParceiro) {
      setParceiros(parceiros.map(p => p.id === editingParceiro.id ? { ...formData, id: editingParceiro.id, dataCadastro: editingParceiro.dataCadastro } : p));
      toast.success("Parceiro atualizado com sucesso!");
    } else {
      const newParceiro = { ...formData, id: parceiros.length + 1, dataCadastro: new Date().toISOString().split('T')[0] };
      setParceiros([...parceiros, newParceiro]);
      toast.success("Parceiro cadastrado com sucesso!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Deseja realmente excluir este parceiro?")) {
      setParceiros(parceiros.filter(p => p.id !== id));
      toast.success("Parceiro excluído com sucesso!");
    }
  };

  const handleCepBlur = async () => {
    if (!formData.cep) return;
    
    const data = await buscarCep(formData.cep);
    if (data) {
      setFormData({
        ...formData,
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf
      });
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

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF/CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Cidade/UF</TableHead>
                <TableHead>Percentual</TableHead>
                <TableHead>Wallet ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParceiros.map((parceiro) => (
                <TableRow key={parceiro.id}>
                  <TableCell className="font-medium">{parceiro.nome}</TableCell>
                  <TableCell className="font-mono text-sm">{parceiro.cpfCnpj}</TableCell>
                  <TableCell>{parceiro.cidade}/{parceiro.uf}</TableCell>
                  <TableCell className="font-semibold">{parceiro.percentual}%</TableCell>
                  <TableCell className="font-mono text-xs">{parceiro.walletId}</TableCell>
                  <TableCell>
                    <Badge variant={parceiro.status === "Ativo" ? "default" : "secondary"}>
                      {parceiro.status}
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
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                  <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                  <InputMask
                    mask={formData.cpfCnpj.length <= 14 ? "999.999.999-99" : "99.999.999/9999-99"}
                    value={formData.cpfCnpj}
                    onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                  >
                    {(inputProps: any) => <Input {...inputProps} placeholder="000.000.000-00" />}
                  </InputMask>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <InputMask
                    mask="99999-999"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    onBlur={handleCepBlur}
                  >
                    {(inputProps: any) => <Input {...inputProps} placeholder="00000-000" />}
                  </InputMask>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rua">Rua</Label>
                  <Input
                    id="rua"
                    value={formData.rua}
                    onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
                    placeholder="Nome da rua"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    placeholder="123"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={formData.complemento}
                    onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                    placeholder="Apto, sala, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                    placeholder="Nome do bairro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    placeholder="Nome da cidade"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uf">UF</Label>
                  <Input
                    id="uf"
                    value={formData.uf}
                    onChange={(e) => setFormData({ ...formData, uf: e.target.value.toUpperCase() })}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="percentual">Percentual Split (%)</Label>
                  <Input
                    id="percentual"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.percentual}
                    onChange={(e) => setFormData({ ...formData, percentual: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="walletId">Wallet ID Asaas</Label>
                  <Input
                    id="walletId"
                    value={formData.walletId}
                    onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                    placeholder="wallet_abc123..."
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Informações adicionais..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black" onClick={handleSave}>
                {editingParceiro ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
