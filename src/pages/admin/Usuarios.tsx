import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { usePermissions } from "@/contexts/PermissionsContext";

const exportFields = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "email", label: "Email" },
  { key: "perfil", label: "Perfil" },
  { key: "criado_em", label: "Data Cadastro" }
];

export default function Usuarios() {
  const { isDesenvolvedor } = usePermissions();
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
    senha: "",
    confirmarSenha: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          perfil:perfis_permissoes(nome, is_desenvolvedor)
        `)
        .order('criado_em', { ascending: false});

      if (error) throw error;
      
      // Filtrar usuários desenvolvedores se o usuário atual não for desenvolvedor
      const filteredData = isDesenvolvedor 
        ? data 
        : data?.filter(usuario => !usuario.perfil?.is_desenvolvedor);
      
      setUsuarios(filteredData || []);
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
      
      // Filtrar perfis desenvolvedores se o usuário atual não for desenvolvedor
      const filteredData = isDesenvolvedor 
        ? data 
        : data?.filter(perfil => !perfil.is_desenvolvedor);
      
      setPerfis(filteredData || []);
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
        senha: "",
        confirmarSenha: ""
      });
    } else {
      setEditingUsuario(null);
      setFormData({
        nome: "",
        email: "",
        perfil_id: "",
        senha: "",
        confirmarSenha: ""
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

    if (!editingUsuario && formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não conferem");
      return;
    }

    if (editingUsuario && formData.senha && formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não conferem");
      return;
    }

    if (formData.senha && formData.senha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      if (editingUsuario) {
        // Atualiza dados básicos
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

        // Se forneceu nova senha, atualiza no Supabase Auth
        if (formData.senha && editingUsuario.auth_user_id) {
          const { error: authError } = await supabase.auth.admin.updateUserById(
            editingUsuario.auth_user_id,
            { password: formData.senha }
          );
          if (authError) {
            console.error("Erro ao atualizar senha:", authError);
            toast.error("Usuário atualizado, mas erro ao atualizar senha");
            loadUsuarios();
            return;
          }
        }

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

  const handleFixAuthUser = async (usuario: any) => {
    const senha = prompt(
      `Digite uma senha temporária para o usuário ${usuario.email}:\n\n(Mínimo 6 caracteres)`
    );
    
    if (!senha) return;
    
    if (senha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('fix-user-auth', {
        body: {
          userId: usuario.id,
          email: usuario.email,
          password: senha,
        },
      });

      if (error) throw error;

      toast.success("Usuário corrigido! Agora ele pode fazer login.");
      loadUsuarios();
    } catch (error: any) {
      console.error('Erro ao corrigir usuário:', error);
      toast.error(error.message || 'Erro ao corrigir usuário');
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
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {usuario.nome}
                          {!usuario.auth_user_id && (
                            <span title="Sem acesso ao sistema">
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.perfil?.nome || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!usuario.auth_user_id && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleFixAuthUser(usuario)}
                              className="text-xs"
                            >
                              Corrigir Acesso
                            </Button>
                          )}
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
                <div className="relative">
                  <Input 
                    id="senha" 
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    placeholder={editingUsuario ? "Deixe em branco para manter a mesma" : "Mínimo 6 caracteres"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {editingUsuario && (
                  <p className="text-xs text-muted-foreground">
                    Deixe em branco se não quiser alterar a senha
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">
                  Confirmar Senha {!editingUsuario && "*"}
                </Label>
                <div className="relative">
                  <Input 
                    id="confirmarSenha" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmarSenha}
                    onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                    placeholder={editingUsuario ? "Confirme a nova senha" : "Confirme a senha"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
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
