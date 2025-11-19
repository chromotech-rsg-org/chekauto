import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Database, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AsaasCredentials } from '@/components/admin/AsaasCredentials';
import { InfoSimplesEndpointTest } from '@/components/admin/InfoSimplesEndpointTest';

const Configuracoes = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGet, setLoadingGet] = useState(false);

  const handleSaveToken = async () => {
    if (!token.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira o token da API',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from('configuracoes_sistema')
        .select()
        .eq('chave', 'INFOSIMPLES_TOKEN')
        .single();

      if (existing) {
        const { error } = await supabase
          .from('configuracoes_sistema')
          .update({ valor: token, atualizado_em: new Date().toISOString() })
          .eq('chave', 'INFOSIMPLES_TOKEN');

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('configuracoes_sistema')
          .insert({
            chave: 'INFOSIMPLES_TOKEN',
            valor: token,
            descricao: 'Token da API InfoSimples',
          });

        if (error) throw error;
      }

      toast({
        title: 'Sucesso!',
        description: 'Token salvo com sucesso',
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

  const handleGetToken = async () => {
    setLoadingGet(true);
    try {
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .select('valor')
        .eq('chave', 'INFOSIMPLES_TOKEN')
        .single();

      if (error) throw error;

      if (data) {
        setToken(data.valor);
        toast({
          title: 'Token carregado',
          description: 'Token recuperado do banco com sucesso',
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as integrações e configurações técnicas do sistema
          </p>
        </div>

        <Accordion type="multiple" defaultValue={["infosimples"]} className="w-full">
          <AccordionItem value="infosimples">
            <AccordionTrigger className="text-lg font-semibold px-4">
              API InfoSimples
            </AccordionTrigger>
            <AccordionContent className="space-y-6 px-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Token da API InfoSimples</CardTitle>
                  <CardDescription>
                  Configure o token de acesso à API InfoSimples
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Token da API:</strong> Obtenha seu token em{' '}
                    <a
                      href="https://api.infosimples.com/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      api.infosimples.com/tokens
                    </a>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="token">Token da API</Label>
                  <Input
                    id="token"
                    type="password"
                    placeholder="Cole seu token aqui"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveToken} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Token
                  </Button>
                  <Button variant="outline" onClick={handleGetToken} disabled={loadingGet}>
                    {loadingGet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Database className="mr-2 h-4 w-4" />
                    Carregar do Banco
                  </Button>
                </div>
              </CardContent>
            </Card>

            <InfoSimplesEndpointTest
              endpointType="base-sp"
              title="Teste Base Estadual SP"
              description="Teste a consulta na base estadual de São Paulo"
            />
            
            <InfoSimplesEndpointTest
              endpointType="bin"
              title="Teste Cadastro BIN"
              description="Teste a consulta no cadastro BIN"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="asaas">
          <AccordionTrigger className="text-lg font-semibold px-4">
            Gateway Asaas
          </AccordionTrigger>
          <AccordionContent className="space-y-6 px-4 pt-4">
            <AsaasCredentials />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      </div>
    </AdminLayout>
  );
};

export default Configuracoes;
