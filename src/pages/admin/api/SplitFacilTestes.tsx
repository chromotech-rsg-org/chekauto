import { useState } from "react";
import { ApiIntegrationLayout } from "@/components/admin/ApiIntegrationLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle, XCircle } from "lucide-react";

export default function SplitFacilTestes() {
  const [asaasPaymentId, setAsaasPaymentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestSplit = async () => {
    if (!asaasPaymentId.trim()) {
      toast.error("Informe o ID do pagamento Asaas");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Buscar pagamento pelo ID Asaas
      const { data: pagamento, error: pagamentoError } = await supabase
        .from("pagamentos")
        .select("*")
        .eq("asaas_payment_id", asaasPaymentId)
        .single();

      if (pagamentoError || !pagamento) {
        setResult({ error: "Pagamento não encontrado" });
        return;
      }

      // Buscar splits configurados para o produto (se houver)
      const { data: solicitacao } = await supabase
        .from("solicitacoes")
        .select("*, produtos(*)")
        .eq("pagamento_id", pagamento.id)
        .single();

      if (solicitacao?.produto_id) {
        const { data: splits } = await supabase
          .from("splits")
          .select("*, parceiros(*)")
          .eq("produto_id", solicitacao.produto_id);

        setResult({
          success: true,
          pagamento,
          solicitacao,
          splits: splits || [],
          message: `Encontrados ${splits?.length || 0} splits configurados para este produto`,
        });
      } else {
        setResult({
          success: true,
          pagamento,
          solicitacao: null,
          splits: [],
          message: "Nenhuma solicitação encontrada para este pagamento",
        });
      }

      toast.success("Consulta realizada!");
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error("Erro ao consultar");
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApiIntegrationLayout
      title="Split Fácil"
      description="Teste as funcionalidades de split de pagamento"
      basePath="/admin/api/splitfacil"
      activeTab="testes"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Verificar Splits de um Pagamento</CardTitle>
            <CardDescription>Consulte os splits configurados para um pagamento específico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="asaasPaymentId">ID do Pagamento Asaas</Label>
                <Input
                  id="asaasPaymentId"
                  value={asaasPaymentId}
                  onChange={(e) => setAsaasPaymentId(e.target.value)}
                  placeholder="Ex: pay_abc123..."
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleTestSplit} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Consultar
                    </>
                  )}
                </Button>
              </div>
            </div>

            {result && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Resultado:</h4>
                {result.error ? (
                  <div className="p-4 bg-destructive/10 rounded-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <span className="text-destructive">{result.error}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600">{result.message}</span>
                    </div>
                    {result.splits?.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium">Splits Configurados:</h5>
                        {result.splits.map((split: any) => (
                          <div key={split.id} className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between">
                              <span>{split.parceiros?.nome}</span>
                              <span className="font-bold">
                                {split.tipo_comissao === "valor_fixo"
                                  ? `R$ ${Number(split.valor_fixo).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                                  : `${split.percentual}%`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ApiIntegrationLayout>
  );
}
