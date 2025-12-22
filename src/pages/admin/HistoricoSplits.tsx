import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Search, RefreshCw, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoricoSplit {
  id: string;
  pagamento_id: string | null;
  parceiro_id: string | null;
  produto_id: string | null;
  cliente_id: string | null;
  valor: number | null;
  valor_compra: number | null;
  percentual: number | null;
  status: string | null;
  status_pagamento: string | null;
  asaas_payment_id: string | null;
  resposta_api: any;
  erro_mensagem: string | null;
  origem: string | null;
  criado_em: string;
  acionado_em: string | null;
  parceiros: { nome: string } | null;
  produtos: { nome: string; preco: number } | null;
  clientes: { nome: string; email: string; cpf_cnpj: string } | null;
  pagamentos: { asaas_payment_id: string; status: string; valor: number; metodo_pagamento: string } | null;
}

// Tradução de status
const traduzirStatusSplit = (status: string | null): string => {
  const traducoes: Record<string, string> = {
    'configurado': 'Configurado',
    'pendente': 'Pendente',
    'erro': 'Erro',
    'sucesso': 'Sucesso',
    'processando': 'Processando',
  };
  return traducoes[status || ''] || status || '-';
};

const traduzirStatusPagamento = (status: string | null): string => {
  const traducoes: Record<string, string> = {
    'PENDING': 'Pendente',
    'RECEIVED': 'Recebido',
    'CONFIRMED': 'Confirmado',
    'OVERDUE': 'Vencido',
    'REFUNDED': 'Reembolsado',
    'RECEIVED_IN_CASH': 'Recebido em Dinheiro',
    'REFUND_REQUESTED': 'Reembolso Solicitado',
    'CHARGEBACK_REQUESTED': 'Chargeback Solicitado',
    'CHARGEBACK_DISPUTE': 'Disputa de Chargeback',
    'AWAITING_CHARGEBACK_REVERSAL': 'Aguardando Reversão',
    'DUNNING_REQUESTED': 'Cobrança Solicitada',
    'DUNNING_RECEIVED': 'Cobrança Recebida',
    'AWAITING_RISK_ANALYSIS': 'Aguardando Análise',
  };
  return traducoes[status || ''] || status || '-';
};

export default function HistoricoSplits() {
  const [historico, setHistorico] = useState<HistoricoSplit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterStatusPagamento, setFilterStatusPagamento] = useState("todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedItem, setSelectedItem] = useState<HistoricoSplit | null>(null);

  const fetchHistorico = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('historico_splits')
        .select(`
          *,
          parceiros (nome),
          produtos (nome, preco),
          clientes (nome, email, cpf_cnpj),
          pagamentos (asaas_payment_id, status, valor, metodo_pagamento)
        `)
        .order('criado_em', { ascending: false });

      if (startDate) {
        query = query.gte('criado_em', startDate);
      }
      if (endDate) {
        query = query.lte('criado_em', endDate + 'T23:59:59');
      }

      const { data, error } = await query;

      if (error) throw error;
      setHistorico(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar histórico',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorico();
  }, [startDate, endDate]);

  const getStatusSplitBadge = (status: string | null) => {
    switch (status) {
      case 'configurado':
      case 'sucesso':
        return <Badge className="bg-green-600">{traduzirStatusSplit(status)}</Badge>;
      case 'pendente':
      case 'processando':
        return <Badge variant="secondary">{traduzirStatusSplit(status)}</Badge>;
      case 'erro':
        return <Badge variant="destructive">{traduzirStatusSplit(status)}</Badge>;
      default:
        return <Badge variant="outline">{traduzirStatusSplit(status)}</Badge>;
    }
  };

  const getStatusPagamentoBadge = (status: string | null) => {
    switch (status) {
      case 'RECEIVED':
      case 'CONFIRMED':
        return <Badge className="bg-green-600">{traduzirStatusPagamento(status)}</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">{traduzirStatusPagamento(status)}</Badge>;
      case 'OVERDUE':
      case 'REFUNDED':
        return <Badge variant="destructive">{traduzirStatusPagamento(status)}</Badge>;
      default:
        return <Badge variant="outline">{traduzirStatusPagamento(status)}</Badge>;
    }
  };

  const filteredHistorico = historico.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.parceiros?.nome?.toLowerCase().includes(searchLower) ||
      item.produtos?.nome?.toLowerCase().includes(searchLower) ||
      item.clientes?.nome?.toLowerCase().includes(searchLower) ||
      item.asaas_payment_id?.toLowerCase().includes(searchLower);
    
    const matchesStatus = filterStatus === "todos" || item.status === filterStatus;
    const matchesStatusPagamento = filterStatusPagamento === "todos" || 
      item.status_pagamento === filterStatusPagamento ||
      item.pagamentos?.status === filterStatusPagamento;
    
    return matchesSearch && matchesStatus && matchesStatusPagamento;
  });

  const exportFields = [
    { key: "id", label: "ID" },
    { key: "criado_em", label: "Data" },
    { key: "clientes.nome", label: "Cliente" },
    { key: "produtos.nome", label: "Produto" },
    { key: "parceiros.nome", label: "Parceiro" },
    { key: "valor_compra", label: "Valor Compra" },
    { key: "valor", label: "Valor Split" },
    { key: "percentual", label: "Percentual" },
    { key: "status", label: "Status Split" },
    { key: "status_pagamento", label: "Status Pagamento" },
    { key: "asaas_payment_id", label: "Payment ID" }
  ];

  const exportData = filteredHistorico.map(item => ({
    id: item.id,
    criado_em: item.criado_em,
    "clientes.nome": item.clientes?.nome || '-',
    "produtos.nome": item.produtos?.nome || '-',
    "parceiros.nome": item.parceiros?.nome || '-',
    valor_compra: item.valor_compra || item.pagamentos?.valor || 0,
    valor: item.valor || 0,
    percentual: item.percentual || 0,
    status: item.status || '-',
    status_pagamento: item.status_pagamento || item.pagamentos?.status || '-',
    asaas_payment_id: item.asaas_payment_id || item.pagamentos?.asaas_payment_id || '-'
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Histórico de Splits</h1>
          <p className="text-muted-foreground">Visualize o histórico de divisões de pagamento executadas</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, parceiro, produto ou payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status Split" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Status Split</SelectItem>
              <SelectItem value="configurado">Configurado</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="erro">Erro</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatusPagamento} onValueChange={setFilterStatusPagamento}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status Pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Pagamentos</SelectItem>
              <SelectItem value="PENDING">Pendente</SelectItem>
              <SelectItem value="RECEIVED">Recebido</SelectItem>
              <SelectItem value="CONFIRMED">Confirmado</SelectItem>
              <SelectItem value="OVERDUE">Vencido</SelectItem>
            </SelectContent>
          </Select>

          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClear={() => {
              setStartDate("");
              setEndDate("");
            }}
          />

          <Button variant="outline" onClick={fetchHistorico} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <ExportButton
            data={exportData}
            fields={exportFields}
            filename="historico-splits"
          />
        </div>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Parceiro</TableHead>
                <TableHead className="text-right">Valor Compra</TableHead>
                <TableHead className="text-right">Valor Split</TableHead>
                <TableHead className="text-center">%</TableHead>
                <TableHead className="text-center">Status Split</TableHead>
                <TableHead className="text-center">Status Pgto</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistorico.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(item.criado_em), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{item.clientes?.nome || '-'}</TableCell>
                  <TableCell>{item.produtos?.nome || '-'}</TableCell>
                  <TableCell className="font-medium">{item.parceiros?.nome || '-'}</TableCell>
                  <TableCell className="text-right font-semibold">
                    R$ {(item.valor_compra || item.pagamentos?.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right text-blue-600 font-semibold">
                    R$ {(item.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.percentual ? `${item.percentual}%` : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusSplitBadge(item.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusPagamentoBadge(item.status_pagamento || item.pagamentos?.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedItem(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredHistorico.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modal de Detalhes */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Split</DialogTitle>
            </DialogHeader>
            
            {selectedItem && (
              <div className="space-y-4">
                {/* Informações do Pagamento */}
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pagamento</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">ID Asaas</Label>
                        <p className="font-mono text-sm bg-muted p-2 rounded break-all">
                          {selectedItem.asaas_payment_id || selectedItem.pagamentos?.asaas_payment_id || '-'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Método</Label>
                        <p className="font-medium">{selectedItem.pagamentos?.metodo_pagamento || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Valor da Compra</Label>
                        <p className="text-xl font-bold">
                          R$ {(selectedItem.valor_compra || selectedItem.pagamentos?.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Status do Pagamento</Label>
                        <div className="mt-1">
                          {getStatusPagamentoBadge(selectedItem.status_pagamento || selectedItem.pagamentos?.status)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Informações do Split */}
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Split</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Valor do Split</Label>
                        <p className="text-xl font-bold text-blue-600">
                          R$ {(selectedItem.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Percentual</Label>
                        <p className="text-xl font-bold">{selectedItem.percentual ? `${selectedItem.percentual}%` : '-'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Status do Split</Label>
                        <div className="mt-1">
                          {getStatusSplitBadge(selectedItem.status)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Origem</Label>
                        <p className="font-medium">{selectedItem.origem || 'API'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Envolvidos */}
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Envolvidos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Cliente</Label>
                        <p className="font-medium">{selectedItem.clientes?.nome || '-'}</p>
                        <p className="text-xs text-muted-foreground">{selectedItem.clientes?.email}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Produto</Label>
                        <p className="font-medium">{selectedItem.produtos?.nome || '-'}</p>
                        {selectedItem.produtos?.preco && (
                          <p className="text-xs text-muted-foreground">
                            R$ {Number(selectedItem.produtos.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Parceiro</Label>
                        <p className="font-medium">{selectedItem.parceiros?.nome || '-'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Datas */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Criado em</Label>
                        <p className="font-medium">
                          {format(new Date(selectedItem.criado_em), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Acionado em</Label>
                        <p className="font-medium">
                          {selectedItem.acionado_em 
                            ? format(new Date(selectedItem.acionado_em), "dd/MM/yyyy HH:mm:ss", { locale: ptBR }) 
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Erro */}
                {selectedItem.erro_mensagem && (
                  <Card className="border-destructive">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold text-sm text-destructive uppercase tracking-wide mb-2">Erro</h4>
                      <p className="text-destructive">{selectedItem.erro_mensagem}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Resposta API */}
                {selectedItem.resposta_api && (
                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Resposta da API</h4>
                      <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-48">
                        {JSON.stringify(selectedItem.resposta_api, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
