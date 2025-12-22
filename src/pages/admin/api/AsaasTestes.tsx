import { useState } from "react";
import { ApiIntegrationLayout } from "@/components/admin/ApiIntegrationLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle, XCircle } from "lucide-react";

export default function AsaasTestes() {
  const [paymentId, setPaymentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheckPayment = async () => {
    if (!paymentId.trim()) {
      toast.error("Informe o ID do pagamento");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("asaas-check-payment", {
        body: { paymentId },
      });

      if (error) throw error;
      setResult(data);
      toast.success("Consulta realizada com sucesso!");
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error("Erro ao consultar pagamento");
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApiIntegrationLayout
      title="Gateway Asaas"
      description="Teste as funcionalidades do gateway de pagamentos"
      basePath="/admin/api/asaas"
      activeTab="testes"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Verificar Status de Pagamento</CardTitle>
            <CardDescription>Consulte o status de um pagamento pelo ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="paymentId">ID do Pagamento Asaas</Label>
                <Input
                  id="paymentId"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  placeholder="Ex: pay_abc123..."
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleCheckPayment} disabled={loading}>
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
                      <span className="text-green-600">Status: {result.status}</span>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Criar Pagamento de Teste</CardTitle>
            <CardDescription>Crie um pagamento de teste no ambiente sandbox</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Para criar pagamentos de teste, utilize o fluxo normal de compra na aplicação com o ambiente configurado como sandbox.
            </p>
          </CardContent>
        </Card>
      </div>
    </ApiIntegrationLayout>
  );
}
