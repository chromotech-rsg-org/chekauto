import { useState, useEffect } from "react";
import { ApiIntegrationLayout } from "@/components/admin/ApiIntegrationLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Eye, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function SplitFacilLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("logs_split_facil")
        .select("*")
        .order("criado_em", { ascending: false })
        .limit(500);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
      toast.error("Erro ao carregar logs");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.tipo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.endpoint || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.asaas_payment_id || "").toLowerCase().includes(searchTerm.toLowerCase());

    const logDate = log.criado_em ? new Date(log.criado_em).toISOString().split("T")[0] : "";
    const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);

    return matchesSearch && matchesDate;
  });

  const exportFields = [
    { key: "tipo", label: "Tipo" },
    { key: "endpoint", label: "Endpoint" },
    { key: "metodo", label: "Método" },
    { key: "status_code", label: "Status" },
    { key: "tempo_resposta_ms", label: "Tempo (ms)" },
    { key: "criado_em", label: "Data" },
  ];

  return (
    <ApiIntegrationLayout
      title="Split Fácil"
      description="Histórico de chamadas à API Split Fácil"
      basePath="/admin/api/split-facil"
      activeTab="logs"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por tipo, endpoint ou ID pagamento..."
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
          <ExportButton data={filteredLogs} fields={exportFields} filename="logs-split-facil" />
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum log encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge variant="outline">{log.tipo}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs max-w-[200px] truncate">
                          {log.endpoint}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{log.metodo}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {log.status_code && log.status_code >= 200 && log.status_code < 300 ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                            <span>{log.status_code || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell>{log.tempo_resposta_ms ? `${log.tempo_resposta_ms}ms` : "-"}</TableCell>
                        <TableCell>
                          {log.criado_em
                            ? format(new Date(log.criado_em), "dd/MM/yyyy HH:mm", { locale: ptBR })
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Log</DialogTitle>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Tipo:</strong> {selectedLog.tipo}
                  </div>
                  <div>
                    <strong>Método:</strong> {selectedLog.metodo}
                  </div>
                  <div>
                    <strong>Status:</strong> {selectedLog.status_code}
                  </div>
                  <div>
                    <strong>Tempo:</strong> {selectedLog.tempo_resposta_ms}ms
                  </div>
                  <div className="col-span-2">
                    <strong>Endpoint:</strong> {selectedLog.endpoint}
                  </div>
                  {selectedLog.erro && (
                    <div className="col-span-2">
                      <strong>Erro:</strong>{" "}
                      <span className="text-destructive">{selectedLog.erro}</span>
                    </div>
                  )}
                </div>
                {selectedLog.payload && (
                  <div>
                    <strong>Payload:</strong>
                    <pre className="bg-muted p-4 rounded-lg mt-2 overflow-x-auto text-xs">
                      {JSON.stringify(selectedLog.payload, null, 2)}
                    </pre>
                  </div>
                )}
                {selectedLog.resposta && (
                  <div>
                    <strong>Resposta:</strong>
                    <pre className="bg-muted p-4 rounded-lg mt-2 overflow-x-auto text-xs max-h-96">
                      {JSON.stringify(selectedLog.resposta, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ApiIntegrationLayout>
  );
}
