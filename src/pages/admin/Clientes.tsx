import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { ClienteDetailModal } from "@/components/admin/ClienteDetailModal";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Search, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buscarCep } from "@/lib/cep";
import { criarOuAtualizarCliente } from "@/services/clienteService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import InputMask from "react-input-mask";

const statusOptions = [
  { value: 'lead', label: 'Lead' },
  { value: 'cliente_ativo', label: 'Cliente Ativo' }
];

const exportFields = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "cpf_cnpj", label: "CPF/CNPJ" },
  { key: "email", label: "Email" },
  { key: "telefone", label: "Telefone" },
  { key: "status", label: "Status" }
];

export default function Clientes() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingCliente, setEditingCliente] = useState<any>(null);
  const [viewingCliente, setViewingCliente] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cpf_cnpj: "",
    email: "",
    telefone: "",
    status: "lead" as 'lead' | 'cliente_ativo',
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    complemento: ""
  });

  // Buscar clientes do Supabase
  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Mutation para criar/atualizar cliente
  const createClienteMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const endereco = {
        cep: data.cep,
        rua: data.rua,
        numero: data.numero,
        bairro: data.bairro,
        complemento: data.complemento
      };

      const resultado = await criarOuAtualizarCliente({
        id: editingCliente?.id,
        nome: data.nome,
        cpf_cnpj: data.cpf_cnpj.replace(/\D/g, ''),
        email: data.email,
        telefone: data.telefone,
        status: data.status,
        endereco: endereco
      });

      if (!resultado) {
        throw new Error('Erro ao criar cliente');
      }

      return resultado;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: 'Sucesso',
        description: editingCliente ? 'Cliente atualizado com sucesso' : 'Cliente criado com sucesso',
      });
      setIsModalOpen(false);
      setEditingCliente(null);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: 'Erro',
        description: error?.message || 'Erro ao salvar cliente. Tente novamente.',
        variant: 'destructive',
      });
    }
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      cpf_cnpj: "",
      email: "",
      telefone: "",
      status: "lead",
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      complemento: ""
    });
  };

  const handleSaveCliente = () => {
    // Validações
    if (!formData.nome || !formData.cpf_cnpj) {
      toast({
        title: 'Erro',
        description: 'Nome e CPF/CNPJ são obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const cpfCnpjNumeros = formData.cpf_cnpj.replace(/\D/g, '');
    if (cpfCnpjNumeros.length !== 11 && cpfCnpjNumeros.length !== 14) {
      toast({
        title: 'Erro',
        description: 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos',
        variant: 'destructive',
      });
      return;
    }

    createClienteMutation.mutate(formData);
  };

  const filteredClientes = clientes.filter(
    (cliente: any) => {
      const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cliente.cpf_cnpj && cliente.cpf_cnpj.includes(searchTerm.replace(/\D/g, '')));
      
      const clienteDate = cliente.criado_em ? new Date(cliente.criado_em).toISOString().split('T')[0] : '';
      const matchesDate = (!startDate || clienteDate >= startDate) && 
        (!endDate || clienteDate <= endDate);
      
      const matchesStatus = statusFilter === "all" || cliente.status === statusFilter;
      
      return matchesSearch && matchesDate && matchesStatus;
    }
  );

  const handleCepBlur = async () => {
    if (!formData.cep) return;
    
    const data = await buscarCep(formData.cep);
    if (data) {
      setFormData({
        ...formData,
        rua: data.logradouro,
        bairro: data.bairro
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">Gerencie os clientes cadastrados</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) {
              resetForm();
              setEditingCliente(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCliente ? 'Editar Cliente' : 'Criar Novo Cliente'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="nome">Nome Completo / Razão Social *</Label>
                    <Input 
                      id="nome" 
                      placeholder="Nome ou razão social"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                    <InputMask
                      mask={formData.cpf_cnpj.replace(/\D/g, '').length <= 11 ? "999.999.999-99" : "99.999.999/9999-99"}
                      value={formData.cpf_cnpj}
                      onChange={(e) => setFormData({...formData, cpf_cnpj: e.target.value})}
                    >
                      {(inputProps: any) => (
                        <Input {...inputProps} id="cpfCnpj" placeholder="000.000.000-00" />
                      )}
                    </InputMask>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <InputMask
                      mask="(99) 99999-9999"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    >
                      {(inputProps: any) => (
                        <Input {...inputProps} id="telefone" placeholder="(11) 99999-9999" />
                      )}
                    </InputMask>
                  </div>
                  
                  <div className="col-span-2">
                    <h4 className="font-semibold mb-3">Endereço</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <InputMask
                          mask="99999-999"
                          value={formData.cep}
                          onChange={(e) => setFormData({...formData, cep: e.target.value})}
                          onBlur={handleCepBlur}
                        >
                          {(inputProps: any) => (
                            <Input {...inputProps} id="cep" placeholder="00000-000" />
                          )}
                        </InputMask>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rua">Rua</Label>
                        <Input 
                          id="rua" 
                          value={formData.rua}
                          onChange={(e) => setFormData({...formData, rua: e.target.value})}
                          placeholder="Nome da rua" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="numero">Número</Label>
                        <Input 
                          id="numero" 
                          value={formData.numero}
                          onChange={(e) => setFormData({...formData, numero: e.target.value})}
                          placeholder="123" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input 
                          id="bairro" 
                          value={formData.bairro}
                          onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                          placeholder="Nome do bairro" 
                        />
                      </div>
                      
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input 
                          id="complemento" 
                          value={formData.complemento}
                          onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                          placeholder="Apto, sala, galpão..." 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: 'lead' | 'cliente_ativo') => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-brand-yellow hover:bg-brand-yellow/90 text-black" 
                  onClick={handleSaveCliente}
                  disabled={createClienteMutation.isPending}
                >
                  {createClienteMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou CPF/CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="cliente_ativo">Cliente Ativo</SelectItem>
            </SelectContent>
          </Select>
          
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClear={() => { setStartDate(""); setEndDate(""); }}
          />
          <ExportButton 
            data={filteredClientes}
            fields={exportFields}
            filename="clientes"
          />
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Carregando clientes...
                  </TableCell>
                </TableRow>
              ) : filteredClientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredClientes.map((cliente: any) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.cpf_cnpj}</TableCell>
                    <TableCell>{cliente.email || '-'}</TableCell>
                    <TableCell>{cliente.telefone || '-'}</TableCell>
                    <TableCell>
                      <StatusBadge status={cliente.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Ver detalhes"
                          onClick={() => setViewingCliente(cliente)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Editar"
                          onClick={() => {
                            setEditingCliente(cliente);
                            setFormData({
                              nome: cliente.nome,
                              cpf_cnpj: cliente.cpf_cnpj,
                              email: cliente.email || "",
                              telefone: cliente.telefone || "",
                              status: cliente.status,
                              cep: cliente.endereco?.cep || "",
                              rua: cliente.endereco?.rua || "",
                              numero: cliente.endereco?.numero || "",
                              bairro: cliente.endereco?.bairro || "",
                              complemento: cliente.endereco?.complemento || ""
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modal de detalhes do cliente */}
        <ClienteDetailModal
          open={!!viewingCliente}
          onClose={() => setViewingCliente(null)}
          cliente={viewingCliente}
        />
      </div>
    </AdminLayout>
  );
}
