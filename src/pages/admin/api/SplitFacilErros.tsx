import { useState, useEffect } from "react";
import { ApiIntegrationLayout } from "@/components/admin/ApiIntegrationLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function SplitFacilErros() {
  const [erros, setErros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedErro, setSelectedErro] = useState<any>(null);

  useEffect(() => {
    loadErros();
  }, []);

  const loadErros = async () => {
    try {
      setLoading(true);
      // Buscar logs com erro ou status de falha
      const { data, error } = await supabase
        .from("logs_split_facil")
        .select("*")
        .or("erro.neq.null,status_code.gte.400")
        .order("criado_em", { ascending: false })
        .limit(100);

      if (error) throw error;
      setErros(data || []);
    } catch (error) {
      console.error("Erro ao carregar erros:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApiIntegrationLayout
      title="Split Fácil"
      description="Erros e falhas nas chamadas à API"
      basePath="/admin/api/split-facil"
      activeTab="erros"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Logs com Erros
            </CardTitle>
            <CardDescription>
              Chamadas à API que retornaram erro ou falharam
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : erros.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum erro encontrado</p>
                <p className="text-sm">Todas as chamadas estão funcionando corretamente.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Erro</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {erros.map((erro) => (
                    <TableRow key={erro.id}>
                      <TableCell>
                        <Badge variant="outline">{erro.tipo}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-[150px] truncate">
                        {erro.endpoint}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{erro.status_code || "N/A"}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-destructive">
                        {erro.erro || "-"}
                      </TableCell>
                      <TableCell>
                        {erro.criado_em
                          ? format(new Date(erro.criado_em), "dd/MM/yyyy HH:mm", { locale: ptBR })
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedErro(erro)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedErro} onOpenChange={() => setSelectedErro(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Erro</DialogTitle>
            </DialogHeader>
            {selectedErro && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Tipo:</strong> {selectedErro.tipo}
                  </div>
                  <div>
                    <strong>Status:</strong> {selectedErro.status_code}
                  </div>
                  <div className="col-span-2">
                    <strong>Endpoint:</strong> {selectedErro.endpoint}
                  </div>
                  {selectedErro.erro && (
                    <div className="col-span-2 p-3 bg-destructive/10 rounded-lg">
                      <strong>Mensagem de Erro:</strong>
                      <p className="text-destructive mt-1">{selectedErro.erro}</p>
                    </div>
                  )}
                </div>
                {selectedErro.payload && (
                  <div>
                    <strong>Payload Enviado:</strong>
                    <pre className="bg-muted p-4 rounded-lg mt-2 overflow-x-auto text-xs">
                      {JSON.stringify(selectedErro.payload, null, 2)}
                    </pre>
                  </div>
                )}
                {selectedErro.resposta && (
                  <div>
                    <strong>Resposta:</strong>
                    <pre className="bg-muted p-4 rounded-lg mt-2 overflow-x-auto text-xs max-h-96">
                      {JSON.stringify(selectedErro.resposta, null, 2)}
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
