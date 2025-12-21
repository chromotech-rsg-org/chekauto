import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Search, RefreshCw, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LogSplitFacil {
  id: string;
  solicitacao_id: string | null;
  pagamento_id: string | null;
  asaas_payment_id: string | null;
  tipo: string;
  endpoint: string;
  metodo: string;
  payload: any;
  resposta: any;
  status_code: number | null;
  erro: string | null;
  tempo_resposta_ms: number | null;
  criado_em: string;
}

export default function LogsSplitFacil() {
  const [logs, setLogs] = useState<LogSplitFacil[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('logs_split_facil')
        .select('*')
        .order('criado_em', { ascending: false })
        .limit(200);

      if (startDate) {
        query = query.gte('criado_em', startDate);
      }
      if (endDate) {
        query = query.lte('criado_em', endDate + 'T23:59:59');
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar logs',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
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

  const getStatusBadge = (statusCode: number | null, erro: string | null) => {
    if (erro) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Erro
      </Badge>;
    }
    if (statusCode && statusCode >= 200 && statusCode < 300) {
      return <Badge variant="default" className="flex items-center gap-1 bg-green-600">
        <CheckCircle className="h-3 w-3" />
        {statusCode}
      </Badge>;
    }
    if (statusCode) {
      return <Badge variant="destructive">{statusCode}</Badge>;
    }
    return <Badge variant="secondary">-</Badge>;
  };

  const filteredLogs = logs.filter((log) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      log.asaas_payment_id?.toLowerCase().includes(searchLower) ||
      log.endpoint.toLowerCase().includes(searchLower) ||
      log.tipo.toLowerCase().includes(searchLower) ||
      log.erro?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Logs Split Fácil</h1>
          <p className="text-muted-foreground">Histórico de chamadas à API do Split Fácil</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por payment ID, endpoint..."
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
            onClear={() => {
              setStartDate("");
              setEndDate("");
            }}
          />

          <Button variant="outline" onClick={fetchLogs} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Tempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <>
                  <TableRow key={log.id} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleExpand(log.id)}>
                    <TableCell>
                      {expandedRows.has(log.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(log.criado_em), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.tipo === 'webhook' ? 'secondary' : 'outline'}>
                        {log.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-[200px] truncate">
                      {log.endpoint}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.asaas_payment_id || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(log.status_code, log.erro)}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.tempo_resposta_ms ? (
                        <span className="flex items-center justify-end gap-1 text-muted-foreground text-sm">
                          <Clock className="h-3 w-3" />
                          {log.tempo_resposta_ms}ms
                        </span>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(log.id) && (
                    <TableRow key={`${log.id}-expanded`}>
                      <TableCell colSpan={7} className="bg-muted/30 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Payload Enviado</h4>
                            <pre className="bg-background p-3 rounded text-xs overflow-auto max-h-48">
                              {JSON.stringify(log.payload, null, 2) || 'N/A'}
                            </pre>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Resposta Recebida</h4>
                            <pre className="bg-background p-3 rounded text-xs overflow-auto max-h-48">
                              {JSON.stringify(log.resposta, null, 2) || 'N/A'}
                            </pre>
                          </div>
                          {log.erro && (
                            <div className="md:col-span-2">
                              <h4 className="font-semibold mb-2 text-destructive">Erro</h4>
                              <pre className="bg-destructive/10 text-destructive p-3 rounded text-xs">
                                {log.erro}
                              </pre>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
              {filteredLogs.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum log encontrado
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
