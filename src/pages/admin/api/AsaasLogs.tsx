import { useState, useEffect } from "react";
import { ApiIntegrationLayout } from "@/components/admin/ApiIntegrationLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { PaymentStatusBadge } from "@/components/admin/PaymentStatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Eye, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AsaasLogs() {
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPagamento, setSelectedPagamento] = useState<any>(null);

  useEffect(() => {
    loadPagamentos();
  }, []);

  const loadPagamentos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pagamentos")
        .select("*")
        .order("criado_em", { ascending: false })
        .limit(500);

      if (error) throw error;
      setPagamentos(data || []);
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
      toast.error("Erro ao carregar pagamentos");
    } finally {
      setLoading(false);
    }
  };

  const filteredPagamentos = pagamentos.filter((p) => {
    const matchesSearch =
      (p.asaas_payment_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.status || "").toLowerCase().includes(searchTerm.toLowerCase());

    const pDate = p.criado_em ? new Date(p.criado_em).toISOString().split("T")[0] : "";
    const matchesDate = (!startDate || pDate >= startDate) && (!endDate || pDate <= endDate);

    return matchesSearch && matchesDate;
  });

  const exportFields = [
    { key: "asaas_payment_id", label: "ID Asaas" },
    { key: "status", label: "Status" },
    { key: "valor", label: "Valor" },
    { key: "metodo_pagamento", label: "Método" },
    { key: "criado_em", label: "Data" },
  ];

  return (
    <ApiIntegrationLayout
      title="Gateway Asaas"
      description="Histórico de pagamentos processados"
      basePath="/admin/api/asaas"
      activeTab="logs"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID ou status..."
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
          <ExportButton data={filteredPagamentos} fields={exportFields} filename="pagamentos-asaas" />
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
                    <TableHead>ID Asaas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPagamentos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhum pagamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPagamentos.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-sm">{p.asaas_payment_id}</TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={p.status} />
                        </TableCell>
                        <TableCell>
                          R$ {Number(p.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{p.metodo_pagamento}</Badge>
                        </TableCell>
                        <TableCell>
                          {p.criado_em
                            ? format(new Date(p.criado_em), "dd/MM/yyyy HH:mm", { locale: ptBR })
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedPagamento(p)}>
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

        <Dialog open={!!selectedPagamento} onOpenChange={() => setSelectedPagamento(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Pagamento</DialogTitle>
            </DialogHeader>
            {selectedPagamento && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>ID Asaas:</strong> {selectedPagamento.asaas_payment_id}
                  </div>
                  <div>
                    <strong>Status:</strong> {selectedPagamento.status}
                  </div>
                  <div>
                    <strong>Valor:</strong> R$ {Number(selectedPagamento.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <div>
                    <strong>Método:</strong> {selectedPagamento.metodo_pagamento}
                  </div>
                </div>
                {selectedPagamento.dados_cliente && (
                  <div>
                    <strong>Dados do Cliente:</strong>
                    <pre className="bg-muted p-4 rounded-lg mt-2 overflow-x-auto text-xs">
                      {JSON.stringify(selectedPagamento.dados_cliente, null, 2)}
                    </pre>
                  </div>
                )}
                {selectedPagamento.dados_veiculo && (
                  <div>
                    <strong>Dados do Veículo:</strong>
                    <pre className="bg-muted p-4 rounded-lg mt-2 overflow-x-auto text-xs">
                      {JSON.stringify(selectedPagamento.dados_veiculo, null, 2)}
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
