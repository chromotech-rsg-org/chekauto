import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Database, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SplitFacilCredentials = () => {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [contaAsaasId, setContaAsaasId] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGet, setLoadingGet] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Salvar URL
      await saveConfig('SPLIT_FACIL_URL', url, 'URL base da API Split Fácil');
      // Salvar API Key
      await saveConfig('SPLIT_FACIL_API_KEY', apiKey, 'API Key (Anon Key) do Split Fácil');
      // Salvar Conta Asaas ID
      await saveConfig('SPLIT_FACIL_CONTA_ASAAS_ID', contaAsaasId, 'ID da conta Asaas no Split Fácil');
      // Salvar Webhook Secret
      await saveConfig('SPLIT_FACIL_WEBHOOK_SECRET', webhookSecret, 'Secret para validar webhooks do Split Fácil');

      toast({
        title: 'Sucesso!',
        description: 'Configurações do Split Fácil salvas com sucesso',
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (chave: string, valor: string, descricao: string) => {
    const { data: existing } = await supabase
      .from('configuracoes_sistema')
      .select()
      .eq('chave', chave)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('configuracoes_sistema')
        .update({ valor, atualizado_em: new Date().toISOString() })
        .eq('chave', chave);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('configuracoes_sistema')
        .insert({ chave, valor, descricao });
      if (error) throw error;
    }
  };

  const handleLoad = async () => {
    setLoadingGet(true);
    try {
      const { data } = await supabase
        .from('configuracoes_sistema')
        .select('chave, valor')
        .in('chave', ['SPLIT_FACIL_URL', 'SPLIT_FACIL_API_KEY', 'SPLIT_FACIL_CONTA_ASAAS_ID', 'SPLIT_FACIL_WEBHOOK_SECRET']);

      if (data) {
        data.forEach((config) => {
          switch (config.chave) {
            case 'SPLIT_FACIL_URL':
              setUrl(config.valor || '');
              break;
            case 'SPLIT_FACIL_API_KEY':
              setApiKey(config.valor || '');
              break;
            case 'SPLIT_FACIL_CONTA_ASAAS_ID':
              setContaAsaasId(config.valor || '');
              break;
            case 'SPLIT_FACIL_WEBHOOK_SECRET':
              setWebhookSecret(config.valor || '');
              break;
          }
        });
        toast({
          title: 'Configurações carregadas',
          description: 'Dados recuperados do banco com sucesso',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingGet(false);
    }
  };

  const handleTestConnection = async () => {
    if (!url || !apiKey) {
      toast({
        title: 'Erro',
        description: 'Preencha a URL e API Key antes de testar',
        variant: 'destructive',
      });
      return;
    }

    setTestLoading(true);
    setTestResult(null);
    
    try {
      // Testar conexão buscando empresas
      const response = await fetch(`${url}/rest/v1/empresas?select=id&limit=1`, {
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTestResult('success');
        toast({
          title: 'Conexão bem-sucedida!',
          description: 'A API Split Fácil está respondendo corretamente',
        });
      } else {
        throw new Error(`Status: ${response.status}`);
      }
    } catch (error: any) {
      setTestResult('error');
      toast({
        title: 'Erro na conexão',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setTestLoading(false);
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integração Split Fácil</CardTitle>
        <CardDescription>
          Configure a integração com a API Split Fácil para gerenciamento de splits de pagamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Split Fácil:</strong> Middleware para configurar splits de pagamentos no Asaas.
            Acesse{' '}
            <a
              href="https://xeacpwfvdnqytiscyinb.supabase.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Split Fácil
            </a>{' '}
            para gerenciar configurações.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="split-url">URL da API</Label>
            <Input
              id="split-url"
              placeholder="https://xeacpwfvdnqytiscyinb.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="split-api-key">API Key (Anon Key)</Label>
            <Input
              id="split-api-key"
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="split-conta-asaas">ID Conta Asaas</Label>
            <Input
              id="split-conta-asaas"
              placeholder="UUID da conta Asaas no Split Fácil"
              value={contaAsaasId}
              onChange={(e) => setContaAsaasId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="split-webhook-secret">Webhook Secret</Label>
            <Input
              id="split-webhook-secret"
              type="password"
              placeholder="Secret para validar webhooks"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
          
          <Button variant="outline" onClick={handleLoad} disabled={loadingGet}>
            {loadingGet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Database className="mr-2 h-4 w-4" />
            Carregar do Banco
          </Button>
          
          <Button variant="secondary" onClick={handleTestConnection} disabled={testLoading}>
            {testLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : testResult === 'success' ? (
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            ) : testResult === 'error' ? (
              <XCircle className="mr-2 h-4 w-4 text-red-600" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Testar Conexão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
