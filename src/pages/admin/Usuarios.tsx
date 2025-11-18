import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const exportFields = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "email", label: "Email" },
  { key: "perfil", label: "Perfil" },
  { key: "criado_em", label: "Data Cadastro" }
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [perfis, setPerfis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    perfil_id: "",
    senha: ""
  });

  useEffect(() => {
    loadUsuarios();
    loadPerfis();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          perfil:perfis_permissoes(nome)
        `)
        .order('criado_em', { ascending: false});

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const loadPerfis = async () => {
    try {
      const { data, error } = await supabase
        .from('perfis_permissoes')
        .select('*')
        .order('nome');

      if (error) throw error;
      setPerfis(data || []);
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
    }
  };

  const filteredUsuarios = usuarios.filter(
    (usuario) => {
      const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const dataCriacao = usuario.criado_em ? new Date(usuario.criado_em).toISOString().split('T')[0] : '';
      const matchesDate = (!startDate || dataCriacao >= startDate) && 
        (!endDate || dataCriacao <= endDate);
      
      return matchesSearch && matchesDate;
    }
  );

  const handleOpenModal = (usuario?: any) => {
    if (usuario) {
      setEditingUsuario(usuario);
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        perfil_id: usuario.perfil_id || "",
        senha: ""
      });
    } else {
      setEditingUsuario(null);
      setFormData({
        nome: "",
        email: "",
        perfil_id: "",
        senha: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.email) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (!editingUsuario && !formData.senha) {
      toast.error("Senha é obrigatória para criar um novo usuário");
      return;
    }

    try {
      if (editingUsuario) {
        // Se está editando, só atualiza dados básicos
        const dataToUpdate: any = {
          nome: formData.nome,
          email: formData.email,
          perfil_id: formData.perfil_id || null
        };

        const { error } = await supabase
          .from('usuarios')
          .update(dataToUpdate)
          .eq('id', editingUsuario.id);

        if (error) throw error;
        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.senha,
        });

        if (authError) throw authError;

        // Criar registro na tabela usuarios
        const { error } = await supabase
          .from('usuarios')
          .insert([{
            nome: formData.nome,
            email: formData.email,
            perfil_id: formData.perfil_id || null,
            auth_user_id: authData.user?.id
          }]);

        if (error) throw error;
        toast.success("Usuário criado com sucesso!");
      }

      setIsModalOpen(false);
      loadUsuarios();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast.error('Erro ao salvar usuário');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este usuário?")) return;

    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Usuário excluído com sucesso!");
      loadUsuarios();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
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
          
          <Button onClick={() => handleOpenModal()} className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
            <Plus className="mr-2 h-4 w-4" />
            Criar Novo Usuário
          </Button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
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
            data={filteredUsuarios}
            fields={exportFields}
            filename="usuarios"
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
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.perfil?.nome || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(usuario)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(usuario.id)}>
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingUsuario ? "Editar Usuário" : "Criar Novo Usuário"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input 
                  id="nome" 
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="perfil">Perfil de Usuário</Label>
                <Select value={formData.perfil_id} onValueChange={(value) => setFormData({ ...formData, perfil_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {perfis.map((perfil) => (
                      <SelectItem key={perfil.id} value={perfil.id}>
                        {perfil.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">
                  Senha {!editingUsuario && "*"}
                </Label>
                <Input 
                  id="senha" 
                  type="password" 
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  placeholder={editingUsuario ? "Deixe em branco para manter a mesma" : "Mínimo 6 caracteres"}
                />
                {editingUsuario && (
                  <p className="text-xs text-muted-foreground">
                    Deixe em branco se não quiser alterar a senha
                  </p>
                )}
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
