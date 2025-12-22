import { ApiIntegrationLayout } from "@/components/admin/ApiIntegrationLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink, Shield } from "lucide-react";

export default function AsaasIntegracao() {
  return (
    <ApiIntegrationLayout
      title="Gateway Asaas"
      description="Configurações de integração com o gateway de pagamentos Asaas"
      basePath="/admin/api/asaas"
      activeTab="integracao"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Credenciais da API</CardTitle>
            <CardDescription>
              As credenciais do Asaas são gerenciadas de forma segura via Supabase Secrets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Configuração via Supabase</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>Para configurar as credenciais do Asaas, você precisa definir os seguintes secrets no Supabase:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><code className="bg-muted px-1 rounded">ASAAS_API_KEY</code> - Sua chave de API do Asaas</li>
                  <li><code className="bg-muted px-1 rounded">ASAAS_ENVIRONMENT</code> - Ambiente (sandbox ou production)</li>
                  <li><code className="bg-muted px-1 rounded">ASAAS_WEBHOOK_SECRET</code> - Secret para validar webhooks</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Alert variant="default" className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Segurança</AlertTitle>
              <AlertDescription>
                As credenciais são armazenadas de forma segura e criptografada no Supabase. 
                Nunca exponha suas chaves de API no código fonte.
              </AlertDescription>
            </Alert>

            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <a
                  href="https://supabase.com/dashboard/project/ybimcjurdmjmdjzfbfup/settings/functions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Configurar Secrets no Supabase
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://www.asaas.com/api/v3/doc" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Documentação Asaas
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ambiente Atual</CardTitle>
            <CardDescription>Informações sobre o ambiente configurado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-1">Sandbox (Testes)</h4>
                <p className="text-sm text-muted-foreground">https://sandbox.asaas.com</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-1">Production (Produção)</h4>
                <p className="text-sm text-muted-foreground">https://www.asaas.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Webhook URL</CardTitle>
            <CardDescription>Configure este URL no painel do Asaas para receber notificações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg font-mono text-sm break-all">
              https://ybimcjurdmjmdjzfbfup.supabase.co/functions/v1/asaas-webhook
            </div>
          </CardContent>
        </Card>
      </div>
    </ApiIntegrationLayout>
  );
}
