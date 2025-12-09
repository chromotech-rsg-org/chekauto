import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, FileSearch, ShoppingCart, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClienteDetailModalProps {
  open: boolean;
  onClose: () => void;
  cliente: any;
}

export function ClienteDetailModal({ open, onClose, cliente }: ClienteDetailModalProps) {
  const [activeTab, setActiveTab] = useState("info");

  // Buscar consultas do cliente (através da tabela de junção cliente_consultas)
  const { data: consultas = [], isLoading: loadingConsultas } = useQuery({
    queryKey: ['cliente-consultas', cliente?.id],
    queryFn: async () => {
      if (!cliente?.id) return [];
      
      // Buscar consultas através da tabela de junção cliente_consultas
      const { data: clienteConsultas, error: ccError } = await supabase
        .from('cliente_consultas')
        .select('consulta_id, tipo_referencia')
        .eq('cliente_id', cliente.id);
      
      if (ccError) {
        console.error('Erro ao buscar cliente_consultas:', ccError);
      }
      
      const consultasMapeadas: any[] = [];
      
      // Processar cada associação
      for (const cc of clienteConsultas || []) {
        // Buscar no log de consultas InfoSimples (fonte principal)
        const { data: logConsulta } = await supabase
          .from('logs_consultas_infosimples')
          .select('*')
          .eq('id', cc.consulta_id)
          .maybeSingle();
        
        if (logConsulta) {
          const params = logConsulta.parametros as Record<string, any> || {};
          consultasMapeadas.push({
            id: logConsulta.id,
            tipo_consulta: logConsulta.tipo_consulta,
            valor_consultado: params.chassi || params.placa || params.renavam || '-',
            marca: logConsulta.marca,
            modelo: logConsulta.modelo,
            placa: logConsulta.placa,
            criado_em: logConsulta.criado_em,
            chassi: logConsulta.chassi,
            fromLog: true,
          });
          continue;
        }
        
        // Fallback: buscar em consultas_veiculos
        const { data: consultaVeiculo } = await supabase
          .from('consultas_veiculos')
          .select('*')
          .eq('id', cc.consulta_id)
          .maybeSingle();
        
        if (consultaVeiculo) {
          consultasMapeadas.push({
            ...consultaVeiculo,
            fromLog: false,
          });
        }
      }
      
      // Incluir primeira_consulta_id se existir
      if (cliente.primeira_consulta_id) {
        const jaExiste = consultasMapeadas.some(c => c.id === cliente.primeira_consulta_id);
        if (!jaExiste) {
          const { data: primeiraConsulta } = await supabase
            .from('consultas_veiculos')
            .select('*')
            .eq('id', cliente.primeira_consulta_id)
            .maybeSingle();
          
          if (primeiraConsulta) {
            consultasMapeadas.push({ ...primeiraConsulta, fromLog: false });
          }
        }
      }
      
      // Ordenar por data
      consultasMapeadas.sort((a, b) => 
        new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
      );
      
      return consultasMapeadas;
    },
    enabled: open && !!cliente?.id
  });

  // Buscar solicitações do cliente
  const { data: solicitacoes = [], isLoading: loadingSolicitacoes } = useQuery({
    queryKey: ['cliente-solicitacoes', cliente?.id],
    queryFn: async () => {
      if (!cliente?.id) return [];
      
      const { data, error } = await supabase
        .from('solicitacoes')
        .select(`
          *,
          produtos:produto_id (nome, apelido),
          pagamentos:pagamento_id (status, valor, metodo_pagamento)
        `)
        .eq('cliente_id', cliente.id)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: open && !!cliente?.id
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {cliente.nome}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Informações
            </TabsTrigger>
            <TabsTrigger value="consultas" className="flex items-center gap-2">
              <FileSearch className="h-4 w-4" />
              Consultas ({consultas.length})
            </TabsTrigger>
            <TabsTrigger value="solicitacoes" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Solicitações ({solicitacoes.length})
            </TabsTrigger>
          </TabsList>

          {/* Aba de Informações */}
          <TabsContent value="info" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{cliente.nome}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
                <p className="font-medium">{cliente.cpf_cnpj}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{cliente.email || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{cliente.telefone || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusBadge status={cliente.status} />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Última Interação</p>
                <p className="font-medium">{formatDate(cliente.ultima_interacao)}</p>
              </div>
              {cliente.endereco && (
                <div className="col-span-2 space-y-1">
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">
                    {cliente.endereco.rua && `${cliente.endereco.rua}, `}
                    {cliente.endereco.numero && `${cliente.endereco.numero} - `}
                    {cliente.endereco.bairro && `${cliente.endereco.bairro}, `}
                    {cliente.endereco.cep && `CEP: ${cliente.endereco.cep}`}
                    {cliente.endereco.complemento && ` (${cliente.endereco.complemento})`}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Aba de Consultas */}
          <TabsContent value="consultas" className="mt-4">
            {loadingConsultas ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : consultas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileSearch className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma consulta encontrada</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor Consultado</TableHead>
                      <TableHead>Marca/Modelo</TableHead>
                      <TableHead>Placa</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consultas.map((consulta: any) => {
                      // Verificar se esta consulta evoluiu para uma solicitação
                      const temSolicitacao = solicitacoes.some(
                        (s: any) => s.consulta_veiculo_id === consulta.id
                      );
                      
                      return (
                        <TableRow key={consulta.id}>
                          <TableCell>{formatDate(consulta.criado_em)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {consulta.tipo_consulta}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {consulta.valor_consultado}
                          </TableCell>
                          <TableCell>
                            {consulta.marca && consulta.modelo 
                              ? `${consulta.marca} ${consulta.modelo}` 
                              : '-'}
                          </TableCell>
                          <TableCell>{consulta.placa || '-'}</TableCell>
                          <TableCell>
                            {temSolicitacao ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                Virou Solicitação
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                Apenas Consulta
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Aba de Solicitações */}
          <TabsContent value="solicitacoes" className="mt-4">
            {loadingSolicitacoes ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : solicitacoes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma solicitação encontrada</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitacoes.map((solicitacao: any) => (
                      <TableRow key={solicitacao.id}>
                        <TableCell>{formatDate(solicitacao.criado_em)}</TableCell>
                        <TableCell>
                          {solicitacao.produtos?.apelido || solicitacao.produtos?.nome || '-'}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={solicitacao.status} />
                        </TableCell>
                        <TableCell>
                          {solicitacao.pagamentos ? (
                            <PaymentStatusBadge status={solicitacao.pagamentos.status} />
                          ) : (
                            <Badge variant="outline">Sem pagamento</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {solicitacao.pagamentos?.valor 
                            ? `R$ ${Number(solicitacao.pagamentos.valor).toFixed(2)}`
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}