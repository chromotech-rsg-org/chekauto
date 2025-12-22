import { useState, useEffect } from "react";
import { ApiIntegrationLayout } from "@/components/admin/ApiIntegrationLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AsaasErros() {
  const [erros, setErros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadErros();
  }, []);

  const loadErros = async () => {
    try {
      setLoading(true);
      // Buscar pagamentos com status de erro ou falha
      const { data, error } = await supabase
        .from("pagamentos")
        .select("*")
        .in("status", ["OVERDUE", "REFUNDED", "RECEIVED_IN_CASH", "REFUND_REQUESTED", "REFUND_IN_PROGRESS", "CHARGEBACK_REQUESTED", "CHARGEBACK_DISPUTE", "AWAITING_CHARGEBACK_REVERSAL", "DUNNING_REQUESTED", "DUNNING_RECEIVED", "AWAITING_RISK_ANALYSIS"])
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
      title="Gateway Asaas"
      description="Pagamentos com problemas ou erros"
      basePath="/admin/api/asaas"
      activeTab="erros"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Pagamentos com Problemas
            </CardTitle>
            <CardDescription>
              Lista de pagamentos que requerem atenção (vencidos, estornados, chargebacks, etc.)
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
                <p>Nenhum pagamento com problema encontrado</p>
                <p className="text-sm">Isso é bom! Todos os pagamentos estão em ordem.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Asaas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {erros.map((erro) => (
                    <TableRow key={erro.id}>
                      <TableCell className="font-mono text-sm">{erro.asaas_payment_id}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{erro.status}</Badge>
                      </TableCell>
                      <TableCell>
                        R$ {Number(erro.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        {erro.criado_em
                          ? format(new Date(erro.criado_em), "dd/MM/yyyy HH:mm", { locale: ptBR })
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Códigos de Status</CardTitle>
            <CardDescription>Referência de status de pagamento do Asaas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">OVERDUE</Badge>
                  <span>Pagamento vencido</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">REFUNDED</Badge>
                  <span>Pagamento estornado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">REFUND_REQUESTED</Badge>
                  <span>Estorno solicitado</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">CHARGEBACK_REQUESTED</Badge>
                  <span>Chargeback solicitado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">CHARGEBACK_DISPUTE</Badge>
                  <span>Chargeback em disputa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">DUNNING_REQUESTED</Badge>
                  <span>Negativação solicitada</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ApiIntegrationLayout>
  );
}
