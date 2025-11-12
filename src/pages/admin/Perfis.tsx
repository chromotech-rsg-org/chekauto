import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockPerfis } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [perfis] = useState(mockPerfis);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Perfis de Usuário</h1>
            <p className="text-muted-foreground">Gerencie os perfis e permissões do sistema</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Perfil
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Perfil</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Perfil</Label>
                  <Input id="nome" placeholder="Ex: Operador, Gerente..." />
                </div>

                <div className="space-y-4">
                  <Label>Permissões</Label>
                  <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
                    {permissoesDisponiveis.map((modulo) => (
                      <div key={modulo.id} className="border rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold">{modulo.label}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {modulo.acoes.map((acao) => (
                            <div key={`${modulo.id}-${acao.id}`} className="flex items-center space-x-2">
                              <Checkbox id={`${modulo.id}-${acao.id}`} />
                              <label
                                htmlFor={`${modulo.id}-${acao.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {acao.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
              {perfis.map((perfil) => (
                <TableRow key={perfil.id}>
                  <TableCell className="font-medium">{perfil.nome}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {perfil.permissoes.slice(0, 3).map((perm, idx) => (
                        <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                          {perm}
                        </span>
                      ))}
                      {perfil.permissoes.length > 3 && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          +{perfil.permissoes.length - 3}
                        </span>
                      )}
                    </div>
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
