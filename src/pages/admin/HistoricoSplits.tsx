import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Search, RefreshCw, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  produtos: { nome: string } | null;
  clientes: { nome: string } | null;
  pagamentos: { asaas_payment_id: string; status: string; valor: number } | null;
}

export default function HistoricoSplits() {
  const [historico, setHistorico] = useState<HistoricoSplit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterStatusPagamento, setFilterStatusPagamento] = useState("todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const fetchHistorico = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('historico_splits')
        .select(`
          *,
          parceiros (nome),
          produtos (nome),
          clientes (nome),
          pagamentos (asaas_payment_id, status, valor)
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

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusSplitBadge = (status: string | null) => {
    switch (status) {
      case 'configurado':
        return <Badge className="bg-green-600">Configurado</Badge>;
      case 'pendente':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'erro':
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="outline">{status || '-'}</Badge>;
    }
  };

  const getStatusPagamentoBadge = (status: string | null) => {
    switch (status) {
      case 'RECEIVED':
      case 'CONFIRMED':
        return <Badge className="bg-green-600">{status}</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">PENDING</Badge>;
      case 'OVERDUE':
        return <Badge variant="destructive">OVERDUE</Badge>;
      default:
        return <Badge variant="outline">{status || '-'}</Badge>;
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
                <TableHead className="w-10"></TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Parceiro</TableHead>
                <TableHead className="text-right">Valor Compra</TableHead>
                <TableHead className="text-right">Valor Split</TableHead>
                <TableHead className="text-center">%</TableHead>
                <TableHead className="text-center">Status Split</TableHead>
                <TableHead className="text-center">Status Pgto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistorico.map((item) => (
                <>
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleExpand(item.id)}>
                    <TableCell>
                      {expandedRows.has(item.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </TableCell>
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
                  </TableRow>
                  {expandedRows.has(item.id) && (
                    <TableRow key={`${item.id}-expanded`}>
                      <TableCell colSpan={10} className="bg-muted/30 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Payment ID Asaas:</span>
                            <p className="font-mono">{item.asaas_payment_id || item.pagamentos?.asaas_payment_id || '-'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Origem:</span>
                            <p>{item.origem || 'api'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Acionado em:</span>
                            <p>{item.acionado_em ? format(new Date(item.acionado_em), "dd/MM/yyyy HH:mm:ss", { locale: ptBR }) : '-'}</p>
                          </div>
                          {item.erro_mensagem && (
                            <div className="md:col-span-3">
                              <span className="text-muted-foreground">Erro:</span>
                              <p className="text-destructive">{item.erro_mensagem}</p>
                            </div>
                          )}
                          {item.resposta_api && (
                            <div className="md:col-span-3">
                              <span className="text-muted-foreground">Resposta API:</span>
                              <pre className="bg-background p-2 rounded text-xs overflow-auto max-h-32 mt-1">
                                {JSON.stringify(item.resposta_api, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
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
      </div>
    </AdminLayout>
  );
}
