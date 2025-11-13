import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { mockUsuarios, mockPerfis } from "@/lib/mockData";
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

const exportFields = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "email", label: "Email" },
  { key: "celular", label: "Celular" },
  { key: "perfil", label: "Perfil" },
  { key: "dataCadastro", label: "Data Cadastro" }
];

export default function Usuarios() {
  const [usuarios] = useState(mockUsuarios);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formData, setFormData] = useState({
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    complemento: "",
    cidade: "",
    estado: ""
  });

  const filteredUsuarios = usuarios.filter(
    (usuario) => {
      const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = (!startDate || usuario.dataCadastro >= startDate) && 
        (!endDate || usuario.dataCadastro <= endDate);
      
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
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <FileUpload label="Foto de Perfil" accept="image/*" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input id="nome" placeholder="Nome completo" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="email@exemplo.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="celular">Celular</Label>
                    <Input id="celular" placeholder="(11) 98765-4321" />
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input 
                          id="complemento" 
                          value={formData.complemento}
                          onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                          placeholder="Apto, sala..." 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input 
                          id="cidade" 
                          value={formData.cidade}
                          onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                          placeholder="Nome da cidade" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Input
                          id="estado"
                          value={formData.estado}
                          onChange={(e) => setFormData({...formData, estado: e.target.value.toUpperCase()})}
                          placeholder="SP"
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="perfil">Perfil *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPerfis.map((perfil) => (
                          <SelectItem key={perfil.id} value={perfil.nome}>
                            {perfil.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha *</Label>
                    <Input id="senha" type="password" placeholder="••••••••" />
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

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {mockPerfis.map((perfil) => (
                <SelectItem key={perfil.id} value={perfil.nome}>
                  {perfil.nome}
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
                <TableHead>Email</TableHead>
                <TableHead>Celular</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.celular}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {usuario.perfil}
                    </span>
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
