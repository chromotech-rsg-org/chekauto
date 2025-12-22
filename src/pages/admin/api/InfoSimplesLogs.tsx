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
import { Search, Eye, Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function InfoSimplesLogs() {
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
        .from("logs_consultas_infosimples")
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

  const handleDeleteLog = async (id: string) => {
    if (!confirm("Deseja excluir este log?")) return;
    try {
      const { error } = await supabase.from("logs_consultas_infosimples").delete().eq("id", id);
      if (error) throw error;
      toast.success("Log excluído");
      loadLogs();
    } catch (error) {
      toast.error("Erro ao excluir log");
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.placa || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.chassi || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.marca || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.modelo || "").toLowerCase().includes(searchTerm.toLowerCase());

    const logDate = log.criado_em ? new Date(log.criado_em).toISOString().split("T")[0] : "";
    const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);

    return matchesSearch && matchesDate;
  });

  const exportFields = [
    { key: "tipo_consulta", label: "Tipo" },
    { key: "placa", label: "Placa" },
    { key: "chassi", label: "Chassi" },
    { key: "marca", label: "Marca" },
    { key: "modelo", label: "Modelo" },
    { key: "sucesso", label: "Sucesso" },
    { key: "codigo_resposta", label: "Código" },
    { key: "tempo_resposta", label: "Tempo (ms)" },
    { key: "criado_em", label: "Data" },
  ];

  return (
    <ApiIntegrationLayout
      title="API InfoSimples"
      description="Histórico de consultas realizadas na API"
      basePath="/admin/api/infosimples"
      activeTab="logs"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por placa, chassi, marca ou modelo..."
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
          <ExportButton data={filteredLogs} fields={exportFields} filename="logs-infosimples" />
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
                    <TableHead>Placa/Chassi</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nenhum log encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge variant="outline">{log.tipo_consulta}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.placa || log.chassi || "-"}
                        </TableCell>
                        <TableCell>
                          {log.marca && log.modelo ? `${log.marca} ${log.modelo}` : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.sucesso ? "default" : "destructive"}>
                            {log.sucesso ? "Sucesso" : "Erro"}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.codigo_resposta || "-"}</TableCell>
                        <TableCell>{log.tempo_resposta ? `${log.tempo_resposta}ms` : "-"}</TableCell>
                        <TableCell>
                          {log.criado_em
                            ? format(new Date(log.criado_em), "dd/MM/yyyy HH:mm", { locale: ptBR })
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteLog(log.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
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
                    <strong>Tipo:</strong> {selectedLog.tipo_consulta}
                  </div>
                  <div>
                    <strong>Sucesso:</strong> {selectedLog.sucesso ? "Sim" : "Não"}
                  </div>
                  <div>
                    <strong>Código:</strong> {selectedLog.codigo_resposta}
                  </div>
                  <div>
                    <strong>Tempo:</strong> {selectedLog.tempo_resposta}ms
                  </div>
                </div>
                <div>
                  <strong>Parâmetros:</strong>
                  <pre className="bg-muted p-4 rounded-lg mt-2 overflow-x-auto text-xs">
                    {JSON.stringify(selectedLog.parametros, null, 2)}
                  </pre>
                </div>
                <div>
                  <strong>Resposta:</strong>
                  <pre className="bg-muted p-4 rounded-lg mt-2 overflow-x-auto text-xs max-h-96">
                    {JSON.stringify(selectedLog.resposta, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ApiIntegrationLayout>
  );
}
