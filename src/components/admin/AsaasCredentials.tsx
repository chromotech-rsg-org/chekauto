import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AsaasCredentials = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credenciais do Asaas</CardTitle>
        <CardDescription>
          Configure as credenciais da API do Asaas para processar pagamentos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="space-y-3">
            <div>
              <strong>⚙️ Configuração no Supabase</strong>
              <p className="mt-1">As credenciais devem ser configuradas como secrets no Supabase:</p>
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">ASAAS_API_KEY</code> - Chave da API do Asaas</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">ASAAS_ENVIRONMENT</code> - Ambiente (sandbox ou production)</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">ASAAS_WEBHOOK_SECRET</code> - Secret para validar webhooks (opcional)</li>
              </ul>
            </div>
            <div className="border-t pt-2">
              <strong>📝 Como obter as credenciais:</strong>
              
              <div className="mt-2">
                <strong>1. API Key:</strong>
                <p className="ml-4 text-sm">
                  → Acesse sua conta no Asaas → Integrações → API Key
                </p>
                <p className="ml-4 text-sm">
                  → Para <strong>Sandbox</strong>: Crie uma conta em{' '}
                  <a 
                    href="https://sandbox.asaas.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary underline inline-flex items-center gap-1"
                  >
                    sandbox.asaas.com <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
                <p className="ml-4 text-sm">
                  → Para <strong>Produção</strong>: Use sua conta real em{' '}
                  <a 
                    href="https://www.asaas.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary underline inline-flex items-center gap-1"
                  >
                    asaas.com <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>
              
              <div className="mt-2">
                <strong>2. Ambiente (ASAAS_ENVIRONMENT):</strong>
                <p className="ml-4 text-sm">→ Use <code className="text-xs bg-muted px-1 py-0.5 rounded">sandbox</code> para testes</p>
                <p className="ml-4 text-sm">→ Use <code className="text-xs bg-muted px-1 py-0.5 rounded">production</code> para produção</p>
              </div>

              <div className="mt-2">
                <strong>3. Webhook Secret (Opcional):</strong>
                <p className="ml-4 text-sm">→ Configure no painel do Asaas → Webhooks</p>
                <p className="ml-4 text-sm">→ URL do webhook: <code className="text-xs bg-muted px-1 py-0.5 rounded">https://ybimcjurdmjmdjzfbfup.supabase.co/functions/v1/asaas-webhook</code></p>
                <p className="ml-4 text-sm">→ Copie o token gerado e salve como secret</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <Alert variant="default" className="border-blue-500 bg-blue-50">
          <AlertDescription>
            <strong>🔐 Segurança:</strong> As credenciais são armazenadas de forma segura no Supabase e 
            nunca são expostas no frontend. Todas as transações são processadas através de edge functions seguras.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button asChild>
            <a 
              href="https://supabase.com/dashboard/project/ybimcjurdmjmdjzfbfup/settings/functions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              Configurar Secrets no Supabase <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a 
              href="https://docs.asaas.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              Documentação do Asaas <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
