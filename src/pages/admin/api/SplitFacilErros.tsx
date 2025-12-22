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
      basePath="/admin/api/splitfacil"
      activeTab="erros"
    >
      <div className="space-y-6">
        {/* Tabela de Códigos de Erro */}
        <Card>
          <CardHeader>
            <CardTitle>Códigos de Erro HTTP</CardTitle>
            <CardDescription>Referência dos códigos de status HTTP e seus significados</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Código</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Significado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><Badge className="bg-green-600">200</Badge></TableCell>
                  <TableCell>Sucesso</TableCell>
                  <TableCell>Requisição processada com sucesso</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Badge className="bg-green-600">201</Badge></TableCell>
                  <TableCell>Sucesso</TableCell>
                  <TableCell>Recurso criado com sucesso</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Badge variant="destructive">400</Badge></TableCell>
                  <TableCell>Erro Cliente</TableCell>
                  <TableCell>Parâmetros inválidos ou requisição mal formada</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Badge variant="destructive">401</Badge></TableCell>
                  <TableCell>Erro Cliente</TableCell>
                  <TableCell>Não autenticado - API Key inválida ou ausente</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Badge variant="destructive">403</Badge></TableCell>
                  <TableCell>Erro Cliente</TableCell>
                  <TableCell>Sem permissão para acessar este recurso</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Badge variant="destructive">404</Badge></TableCell>
                  <TableCell>Erro Cliente</TableCell>
                  <TableCell>Recurso não encontrado (pagamento, wallet, etc)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Badge variant="destructive">409</Badge></TableCell>
                  <TableCell>Erro Cliente</TableCell>
                  <TableCell>Conflito - Split já existe ou pagamento já processado</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Badge variant="destructive">422</Badge></TableCell>
                  <TableCell>Erro Cliente</TableCell>
                  <TableCell>Entidade não processável - dados válidos mas não aceitos</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Badge variant="destructive">500</Badge></TableCell>
                  <TableCell>Erro Servidor</TableCell>
                  <TableCell>Erro interno do servidor - contate o suporte</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Badge variant="destructive">502</Badge></TableCell>
                  <TableCell>Erro Servidor</TableCell>
                  <TableCell>Bad Gateway - Erro de comunicação entre servidores</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Badge variant="destructive">503</Badge></TableCell>
                  <TableCell>Erro Servidor</TableCell>
                  <TableCell>Serviço temporariamente indisponível</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

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
