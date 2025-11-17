import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, CheckSquare, Square } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const permissoesDisponiveis = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    acoes: [
      { id: "view", label: "Visualizar" },
      { id: "viewStatsCard_solicitacoes", label: "Ver Card: Solicitações" },
      { id: "viewStatsCard_clientes", label: "Ver Card: Clientes" },
      { id: "viewStatsCard_produtos", label: "Ver Card: Produtos" },
      { id: "viewStatsCard_receita", label: "Ver Card: Receita" },
      { id: "viewChart_solicitacoesMes", label: "Ver Gráfico: Solicitações/Mês" },
      { id: "viewChart_solicitacoesStatus", label: "Ver Gráfico: Status" },
      { id: "viewChart_pagamentoStatus", label: "Ver Gráfico: Pagamentos" },
      { id: "viewTable_ultimasSolicitacoes", label: "Ver Tabela: Últ. Solicitações" },
      { id: "viewTable_clientesRecentes", label: "Ver Tabela: Clientes Recentes" }
    ] 
  },
  { id: "usuarios", label: "Usuários", acoes: [
    { id: "view", label: "Visualizar" },
    { id: "create", label: "Criar" },
    { id: "edit", label: "Editar" },
    { id: "delete", label: "Excluir" }
  ]},
  { id: "perfis", label: "Perfis", acoes: [
    { id: "view", label: "Visualizar" },
    { id: "create", label: "Criar" },
    { id: "edit", label: "Editar" },
    { id: "delete", label: "Excluir" }
  ]},
  { id: "produtos", label: "Produtos", acoes: [
    { id: "view", label: "Visualizar" },
    { id: "create", label: "Criar" },
    { id: "edit", label: "Editar" },
    { id: "delete", label: "Excluir" }
  ]},
  { id: "categorias", label: "Categorias", acoes: [
    { id: "view", label: "Visualizar" },
    { id: "create", label: "Criar" },
    { id: "edit", label: "Editar" },
    { id: "delete", label: "Excluir" }
  ]},
  { id: "clientes", label: "Clientes", acoes: [
    { id: "view", label: "Visualizar" },
    { id: "create", label: "Criar" },
    { id: "edit", label: "Editar" },
    { id: "delete", label: "Excluir" }
  ]},
  { id: "solicitacoes", label: "Solicitações", acoes: [
    { id: "view", label: "Visualizar" },
    { id: "edit", label: "Editar Status" }
  ]},
  { id: "split", label: "Split de Pagamento", acoes: [
    { id: "view", label: "Visualizar" },
    { id: "configure", label: "Configurar" }
  ]},
  { id: "parceiros", label: "Parceiros", acoes: [
    { id: "view", label: "Visualizar" },
    { id: "create", label: "Criar" },
    { id: "edit", label: "Editar" },
    { id: "delete", label: "Excluir" }
  ]},
  { id: "tabelaCatMmv", label: "Tabela CAT MMV", acoes: [
    { id: "view", label: "Visualizar" },
    { id: "create", label: "Criar" },
    { id: "edit", label: "Editar" },
    { id: "delete", label: "Excluir" },
    { id: "import", label: "Importar Excel" }
  ]}
];

export default function Perfis() {
  const [perfis, setPerfis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState<any>(null);
  const [nomePerfil, setNomePerfil] = useState("");
  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadPerfis();
  }, []);

  const loadPerfis = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('perfis_permissoes')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setPerfis(data || []);
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
      toast.error('Erro ao carregar perfis');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (perfil?: any) => {
    if (perfil) {
      setEditingPerfil(perfil);
      setNomePerfil(perfil.nome);
      // Converter permissões do banco para formato de checkboxes
      const perms: Record<string, boolean> = {};
      Object.entries(perfil.permissoes).forEach(([modulo, acoes]: [string, any]) => {
        Object.entries(acoes).forEach(([acao, valor]) => {
          perms[`${modulo}-${acao}`] = valor === true;
        });
      });
      setPermissoesSelecionadas(perms);
    } else {
      setEditingPerfil(null);
      setNomePerfil("");
      setPermissoesSelecionadas({});
    }
    setIsModalOpen(true);
  };

  const handleSelecionarTodos = () => {
    const todasPermissoes: Record<string, boolean> = {};
    permissoesDisponiveis.forEach((modulo) => {
      modulo.acoes.forEach((acao) => {
        todasPermissoes[`${modulo.id}-${acao.id}`] = true;
      });
    });
    setPermissoesSelecionadas(todasPermissoes);
    toast.success("Todas as permissões selecionadas");
  };

  const handleDesselecionarTodos = () => {
    setPermissoesSelecionadas({});
    toast.success("Todas as permissões desmarcadas");
  };

  const handleTogglePermissao = (key: string) => {
    setPermissoesSelecionadas((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSalvar = async () => {
    if (!nomePerfil.trim()) {
      toast.error("Digite o nome do perfil");
      return;
    }

    // Converter checkboxes para estrutura de permissões
    const permissoesObj: any = {};
    permissoesDisponiveis.forEach((modulo) => {
      permissoesObj[modulo.id] = {};
      modulo.acoes.forEach((acao) => {
        const key = `${modulo.id}-${acao.id}`;
        permissoesObj[modulo.id][acao.id] = permissoesSelecionadas[key] || false;
      });
    });

    try {
      if (editingPerfil) {
        const { error } = await supabase
          .from('perfis_permissoes')
          .update({ nome: nomePerfil, permissoes: permissoesObj })
          .eq('id', editingPerfil.id);

        if (error) throw error;
        toast.success("Perfil atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from('perfis_permissoes')
          .insert({ nome: nomePerfil, permissoes: permissoesObj });

        if (error) throw error;
        toast.success("Perfil criado com sucesso!");
      }

      setIsModalOpen(false);
      loadPerfis();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este perfil?")) return;

    try {
      const { error } = await supabase
        .from('perfis_permissoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Perfil excluído com sucesso!");
      loadPerfis();
    } catch (error) {
      console.error('Erro ao excluir perfil:', error);
      toast.error('Erro ao excluir perfil');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Perfis de Usuário</h1>
            <p className="text-muted-foreground">Gerencie os perfis e permissões do sistema</p>
          </div>
          
          <Button onClick={() => handleOpenModal()} className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
            <Plus className="mr-2 h-4 w-4" />
            Criar Novo Perfil
          </Button>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingPerfil ? "Editar Perfil" : "Criar Novo Perfil"}</DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Perfil *</Label>
                <Input 
                  id="nome" 
                  placeholder="Ex: Operador, Gerente..." 
                  value={nomePerfil}
                  onChange={(e) => setNomePerfil(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Permissões</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleSelecionarTodos}
                      className="text-xs"
                    >
                      <CheckSquare className="mr-1 h-3 w-3" />
                      Selecionar Todos
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleDesselecionarTodos}
                      className="text-xs"
                    >
                      <Square className="mr-1 h-3 w-3" />
                      Desselecionar Todos
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3 pr-2">
                  {permissoesDisponiveis.map((modulo) => (
                    <div key={modulo.id} className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold text-sm">{modulo.label}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {modulo.acoes.map((acao) => {
                          const key = `${modulo.id}-${acao.id}`;
                          return (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox 
                                id={key} 
                                checked={permissoesSelecionadas[key] || false}
                                onCheckedChange={() => handleTogglePermissao(key)}
                              />
                              <label
                                htmlFor={key}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {acao.label}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-brand-yellow hover:bg-brand-yellow/90 text-black" 
                onClick={handleSalvar}
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="bg-white rounded-lg border">
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Perfil</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perfis.map((perfil) => {
                const totalPermissoes = (Object.values(perfil.permissoes || {}) as any[]).reduce((acc: number, modulo: any) => {
                  if (typeof modulo === 'object' && modulo !== null) {
                    return acc + (Object.values(modulo).filter((v) => v === true).length as number);
                  }
                  return acc;
                }, 0) as number;

                return (
                  <TableRow key={perfil.id}>
                    <TableCell className="font-medium">{perfil.nome}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {String(totalPermissoes)} permissão{totalPermissoes !== 1 ? 'ões' : ''} ativa{totalPermissoes !== 1 ? 's' : ''}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(perfil)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(perfil.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
