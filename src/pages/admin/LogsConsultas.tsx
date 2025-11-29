import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { Search, Loader2, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JsonResultDisplay } from "@/components/admin/JsonResultDisplay";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const exportFields = [
  { key: "tipo_consulta", label: "Tipo" },
  { key: "endpoint", label: "Endpoint" },
  { key: "placa", label: "Placa" },
  { key: "chassi", label: "Chassi" },
  { key: "renavam", label: "Renavam" },
  { key: "modelo", label: "Modelo" },
  { key: "marca", label: "Marca" },
  { key: "cor", label: "Cor" },
  { key: "categoria", label: "Categoria" },
  { key: "ano_modelo", label: "Ano Modelo" },
  { key: "combustivel", label: "Combustível" },
  { key: "sucesso", label: "Sucesso" },
  { key: "codigo_resposta", label: "Código" },
  { key: "api_conectou", label: "API Conectou" },
  { key: "erro_tipo", label: "Tipo Erro" },
  { key: "tempo_resposta", label: "Tempo (ms)" },
  { key: "criado_em", label: "Data/Hora" },
];

export default function LogsConsultas() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('logs_consultas_infosimples')
        .select('*')
        .order('criado_em', { ascending: false })
        .limit(1000);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      toast.error('Erro ao carregar logs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!logToDelete) return;

    try {
      const { error } = await supabase
        .from('logs_consultas_infosimples')
        .delete()
        .eq('id', logToDelete);

      if (error) throw error;

      toast.success('Log deletado com sucesso');
      setLogs(logs.filter(log => log.id !== logToDelete));
      setLogToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar log:', error);
      toast.error('Erro ao deletar log');
    }
  };

  const filteredLogs = logs.filter((log) => {
    const placa = log.placa || log.parametros?.placa || "";
    const chassi = log.chassi || log.parametros?.chassi || "";
    const renavam = log.renavam || log.parametros?.renavam || "";
    const modelo = log.modelo || "";
    const marca = log.marca || "";
    const endpoint = log.endpoint || "";
    const categoria = log.categoria || "";
    
    const matchesSearch = 
      placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chassi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renavam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tipo_consulta.toLowerCase().includes(searchTerm.toLowerCase());
    
    const dataCriacao = log.criado_em ? new Date(log.criado_em).toISOString().split('T')[0] : '';
    const matchesDate = (!startDate || dataCriacao >= startDate) && 
      (!endDate || dataCriacao <= endDate);
    
    return matchesSearch && matchesDate;
  });

  const exportData = filteredLogs.map(log => ({
    tipo_consulta: log.tipo_consulta,
    endpoint: log.endpoint || "-",
    placa: log.placa || log.parametros?.placa || "-",
    chassi: log.chassi || log.parametros?.chassi || "-",
    renavam: log.renavam || log.parametros?.renavam || "-",
    modelo: log.modelo || "-",
    marca: log.marca || "-",
    cor: log.cor || "-",
    categoria: log.categoria || "-",
    ano_modelo: log.ano_modelo || "-",
    combustivel: log.combustivel || "-",
    sucesso: log.sucesso ? "Sim" : "Não",
    codigo_resposta: log.codigo_resposta || "-",
    api_conectou: log.api_conectou ? "Sim" : "Não",
    erro_tipo: log.erro_tipo || "-",
    tempo_resposta: log.tempo_resposta || "-",
    criado_em: new Date(log.criado_em).toLocaleString('pt-BR'),
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Logs de Consultas InfoSimples</h1>
          <p className="text-muted-foreground mt-2">
            Histórico completo de consultas realizadas na API InfoSimples
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Buscar por placa, chassi, renavam ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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

          <ExportButton
            data={exportData}
            fields={exportFields}
            filename="logs-consultas-infosimples"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">Nenhum log encontrado</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Chassi</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Erro Tipo</TableHead>
                  <TableHead>Tempo</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant="outline">{log.tipo_consulta}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {log.endpoint || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.placa || log.parametros?.placa || "-"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.chassi ? log.chassi.substring(0, 10) + "..." : log.parametros?.chassi ? log.parametros.chassi.substring(0, 10) + "..." : "-"}
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {log.modelo || "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.marca || "-"}
                    </TableCell>
                    <TableCell>
                      {log.sucesso ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Sucesso</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm">Erro</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.codigo_resposta ? (
                        <Badge variant={log.codigo_resposta === 200 ? "default" : "destructive"}>
                          {log.codigo_resposta}
                        </Badge>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {log.erro_tipo ? (
                        <Badge variant="outline" className="bg-red-50">
                          {log.erro_tipo}
                        </Badge>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-sm">{log.tempo_resposta}ms</TableCell>
                    <TableCell className="text-sm">
                      {new Date(log.criado_em).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-sm text-primary hover:underline"
                        >
                          Ver detalhes
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setLogToDelete(log.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Consulta</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Tipo:</strong> {selectedLog.tipo_consulta}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  {selectedLog.sucesso ? (
                    <span className="text-green-600">Sucesso</span>
                  ) : (
                    <span className="text-red-600">Erro</span>
                  )}
                </div>
                <div>
                  <strong>Tempo:</strong> {selectedLog.tempo_resposta}ms
                </div>
                <div>
                  <strong>Data:</strong>{" "}
                  {new Date(selectedLog.criado_em).toLocaleString('pt-BR')}
                </div>
              </div>

              <div className="border-t pt-4">
                <strong className="block mb-3 text-lg">Dados Extraídos:</strong>
                <div className="grid grid-cols-2 gap-3 bg-muted/30 p-4 rounded-lg">
                  <div>
                    <span className="text-xs text-muted-foreground">Endpoint:</span>
                    <p className="font-mono font-semibold">{selectedLog.endpoint || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Código Resposta:</span>
                    <p className="font-semibold">{selectedLog.codigo_resposta || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">API Conectou:</span>
                    <p className="font-semibold">{selectedLog.api_conectou ? "Sim" : "Não"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Tipo Erro:</span>
                    <p className="font-semibold text-destructive">{selectedLog.erro_tipo || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Placa:</span>
                    <p className="font-mono font-semibold">{selectedLog.placa || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Chassi:</span>
                    <p className="font-mono text-sm">{selectedLog.chassi || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Renavam:</span>
                    <p className="font-mono font-semibold">{selectedLog.renavam || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Modelo:</span>
                    <p className="font-semibold">{selectedLog.modelo || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Marca:</span>
                    <p className="font-semibold">{selectedLog.marca || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Cor:</span>
                    <p className="font-semibold">{selectedLog.cor || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Categoria:</span>
                    <p className="font-semibold">{selectedLog.categoria || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Ano Modelo:</span>
                    <p className="font-semibold">{selectedLog.ano_modelo || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Ano Fabricação:</span>
                    <p className="font-semibold">{selectedLog.ano_fabricacao || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Combustível:</span>
                    <p className="font-semibold">{selectedLog.combustivel || "-"}</p>
                  </div>
                </div>
              </div>

              <div>
                <strong className="block mb-2">Parâmetros:</strong>
                <JsonResultDisplay result={selectedLog.parametros} onClear={() => {}} />
              </div>

              <div>
                <strong className="block mb-2">Resposta Completa:</strong>
                <JsonResultDisplay result={selectedLog.resposta} onClear={() => {}} />
              </div>

              {selectedLog.erro && (
                <div>
                  <strong className="block mb-2 text-red-600">Erro:</strong>
                  <div className="bg-red-50 p-3 rounded text-sm text-red-900">
                    {selectedLog.erro}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!logToDelete} onOpenChange={() => setLogToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este log? Esta ação não pode ser desfeita e na próxima busca pelo mesmo veículo, os dados serão consultados novamente na API.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
