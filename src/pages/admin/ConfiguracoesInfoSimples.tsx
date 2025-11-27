import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Database, Clock, TrendingUp, Eye, EyeOff, AlertTriangle, Key } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function ConfiguracoesInfoSimples() {
  const [token, setToken] = useState('');
  const [diasCache, setDiasCache] = useState('30');
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);
  
  // Credenciais
  const [a3, setA3] = useState('');
  const [a3Pin, setA3Pin] = useState('');
  const [loginCpf, setLoginCpf] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  
  const [stats, setStats] = useState({
    totalConsultas: 0,
    consultasUnicas: 0,
    cacheHits: 0,
    apiCalls: 0,
  });

  useEffect(() => {
    carregarConfiguracoes();
    carregarEstatisticas();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .select('chave, valor')
        .in('chave', ['infosimples_token', 'dias_cache_veiculo', 'infosimples_a3', 'infosimples_a3_pin', 'infosimples_login_cpf', 'infosimples_login_senha']);

      if (error) throw error;

      data?.forEach((config) => {
        if (config.chave === 'infosimples_token') {
          setToken(config.valor || '');
        } else if (config.chave === 'dias_cache_veiculo') {
          setDiasCache(config.valor || '30');
        } else if (config.chave === 'infosimples_a3') {
          setA3(config.valor || '');
        } else if (config.chave === 'infosimples_a3_pin') {
          setA3Pin(config.valor || '');
        } else if (config.chave === 'infosimples_login_cpf') {
          setLoginCpf(config.valor || '');
        } else if (config.chave === 'infosimples_login_senha') {
          setLoginSenha(config.valor || '');
        }
      });
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const carregarEstatisticas = async () => {
    setLoadingStats(true);
    try {
      // Total de consultas
      const { count: totalConsultas } = await supabase
        .from('consultas_veiculos')
        .select('*', { count: 'exact', head: true });

      // Consultas únicas (veículos distintos)
      const { data: consultasUnicas } = await supabase
        .from('consultas_veiculos')
        .select('renavam, chassi, placa');

      // Calcular consultas únicas
      const veiculosUnicos = new Set();
      consultasUnicas?.forEach((consulta) => {
        if (consulta.renavam) veiculosUnicos.add(consulta.renavam);
        else if (consulta.chassi) veiculosUnicos.add(consulta.chassi);
        else if (consulta.placa) veiculosUnicos.add(consulta.placa);
      });

      // Cache hits vs API calls (estimativa baseada em atualizações)
      const apiCalls = totalConsultas || 0;
      const cacheHits = Math.max(0, (consultasUnicas?.length || 0) - apiCalls);

      setStats({
        totalConsultas: totalConsultas || 0,
        consultasUnicas: veiculosUnicos.size,
        cacheHits,
        apiCalls,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const salvarConfiguracoes = async () => {
    // Validar credenciais
    if (!a3 || !a3Pin || !loginCpf || !loginSenha) {
      toast({
        title: 'Erro',
        description: 'Todos os campos de credenciais são obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const updates = [
        { chave: 'infosimples_token', valor: token },
        { chave: 'dias_cache_veiculo', valor: diasCache },
        { chave: 'infosimples_a3', valor: a3 },
        { chave: 'infosimples_a3_pin', valor: a3Pin },
        { chave: 'infosimples_login_cpf', valor: loginCpf },
        { chave: 'infosimples_login_senha', valor: loginSenha },
      ];

      for (const update of updates) {
        // Tentar atualizar
        const { error: updateError } = await supabase
          .from('configuracoes_sistema')
          .update({ valor: update.valor })
          .eq('chave', update.chave);

        // Se não existe, inserir
        if (updateError) {
          const { error: insertError } = await supabase
            .from('configuracoes_sistema')
            .insert({ chave: update.chave, valor: update.valor });
          
          if (insertError) throw insertError;
        }
      }

      toast({
        title: 'Sucesso',
        description: 'Configurações salvas com sucesso',
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar configurações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações InfoSimples</h1>
        <p className="text-muted-foreground">
          Configure o token da API e o cache de consultas
        </p>
      </div>

      {/* Credenciais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configuração de Credenciais
          </CardTitle>
          <CardDescription>
            Configure as credenciais da API Info Simples
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="space-y-3">
              <div>
                <strong>📝 Como obter as credenciais:</strong>
                <p className="mt-1"><strong>1. Token (a3) e Secret (a3_pin):</strong></p>
                <p className="ml-4 text-sm">→ Acesse <a href="https://api.infosimples.com/tokens" target="_blank" rel="noopener noreferrer" className="text-primary underline">api.infosimples.com/tokens</a> e copie suas credenciais</p>
                
                <p className="mt-2"><strong>2. CPF e Senha de Login:</strong></p>
                <p className="ml-4 text-sm">→ São as credenciais para acessar o portal do ECRVSP/Detran (NÃO são da Info Simples)</p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="a3">Token (a3) *</Label>
              <Input
                id="a3"
                type={showPasswords ? 'text' : 'password'}
                value={a3}
                onChange={(e) => setA3(e.target.value)}
                placeholder="296984008687583540"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="a3_pin">Token Secret (a3_pin) *</Label>
              <Input
                id="a3_pin"
                type={showPasswords ? 'text' : 'password'}
                value={a3Pin}
                onChange={(e) => setA3Pin(e.target.value)}
                placeholder="1234"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login_cpf">CPF de Login *</Label>
              <Input
                id="login_cpf"
                value={loginCpf}
                onChange={(e) => setLoginCpf(e.target.value)}
                placeholder="17528605867"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login_senha">Senha de Login *</Label>
              <Input
                id="login_senha"
                type={showPasswords ? 'text' : 'password'}
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
                placeholder="Ed100@son"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Ocultar Senhas
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Mostrar Senhas
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Token API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Token API InfoSimples
          </CardTitle>
          <CardDescription>
            Token opcional para substituir as credenciais salvas como secrets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Token (Opcional)</Label>
            <Input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Digite o token da API"
            />
            <p className="text-sm text-muted-foreground">
              Deixe em branco para usar as credenciais configuradas acima
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Configuração de Cache */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configuração de Cache
          </CardTitle>
          <CardDescription>
            Defina por quantos dias os dados de veículos devem ser mantidos em cache
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diasCache">Dias para atualizar consulta</Label>
            <Input
              id="diasCache"
              type="number"
              min="0"
              max="365"
              value={diasCache}
              onChange={(e) => setDiasCache(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {diasCache === '0' 
                ? 'Com 0 dias, sempre será feita uma nova consulta na API (cache desabilitado)'
                : `Veículos já consultados serão buscados do cache até ${diasCache} dias após a última consulta`
              }
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Como funciona o cache?</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Quando um veículo é consultado, os dados são salvos no banco</li>
              <li>• Consultas futuras do mesmo veículo usam o cache até expirar</li>
              <li>• Após o prazo configurado, uma nova consulta na API é realizada</li>
              <li>• Configure 0 dias para sempre buscar dados atualizados da API</li>
              <li>• Isso economiza consultas e melhora a velocidade do sistema</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button onClick={salvarConfiguracoes} disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>

      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Estatísticas de Uso
          </CardTitle>
          <CardDescription>
            Acompanhe o uso da API e eficiência do cache
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingStats ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total de Consultas</p>
                <p className="text-3xl font-bold">{stats.totalConsultas}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Veículos Únicos</p>
                <p className="text-3xl font-bold">{stats.consultasUnicas}</p>
              </div>

              <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                <p className="text-sm text-muted-foreground mb-1">Cache Hits</p>
                <p className="text-3xl font-bold text-green-600">{stats.cacheHits}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Consultas economizadas
                </p>
              </div>

              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                <p className="text-sm text-muted-foreground mb-1">Chamadas API</p>
                <p className="text-3xl font-bold text-blue-600">{stats.apiCalls}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Consultas realizadas na API
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
}
