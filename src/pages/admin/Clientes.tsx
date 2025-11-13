import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { mockClientes } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/admin/FileUpload";
import { buscarCep } from "@/lib/cep";
import InputMask from "react-input-mask";

const statusOptions = ["Pendente", "Processado", "Concluído"];

const exportFields = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "cpfCnpj", label: "CPF/CNPJ" },
  { key: "email", label: "Email" },
  { key: "telefone", label: "Telefone" },
  { key: "celular", label: "Celular" },
  { key: "endereco", label: "Endereço" },
  { key: "dataCadastro", label: "Data Cadastro" },
  { key: "status", label: "Status" }
];

export default function Clientes() {
  const [clientes] = useState(mockClientes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formData, setFormData] = useState({
    cpfCnpj: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    complemento: ""
  });

  const filteredClientes = clientes.filter(
    (cliente) => {
      const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cpfCnpj.includes(searchTerm);
      
      const matchesDate = (!startDate || cliente.dataCadastro >= startDate) && 
        (!endDate || cliente.dataCadastro <= endDate);
      
      return matchesSearch && matchesDate;
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
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="nome">Nome Completo / Razão Social *</Label>
                    <Input id="nome" placeholder="Nome ou razão social" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                    <InputMask
                      mask={formData.cpfCnpj.length <= 14 ? "999.999.999-99" : "99.999.999/9999-99"}
                      value={formData.cpfCnpj}
                      onChange={(e) => setFormData({...formData, cpfCnpj: e.target.value})}
                    >
                      {(inputProps: any) => (
                        <Input {...inputProps} id="cpfCnpj" placeholder="000.000.000-00" />
                      )}
                    </InputMask>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="email@exemplo.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input id="telefone" placeholder="(11) 3333-4444" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="associacao">Associação/Centravan</Label>
                    <Input id="associacao" placeholder="Ex: CENTRAL VAN SP" />
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
                    <Label htmlFor="status">Status Interno</Label>
                    <Select defaultValue="Pendente">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-2">
                    <FileUpload label="Nota Fiscal (Opcional)" accept=".pdf,image/*" preview={false} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black" onClick={() => setIsModalOpen(false)}>
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
              placeholder="Buscar por nome, email ou CPF/CNPJ..."
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
            data={filteredClientes}
            fields={exportFields}
            filename="clientes"
          />
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.cpfCnpj}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>
                    <StatusBadge status={cliente.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
