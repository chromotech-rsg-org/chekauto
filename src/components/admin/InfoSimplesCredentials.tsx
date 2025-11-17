import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Save, Trash2, AlertTriangle, AlertCircle } from 'lucide-react';
import { saveCredentials, getCredentials, clearCredentials } from '@/services/infoSimplesService';
import { InfoSimplesCredentials } from '@/types/infoSimples';
import { useToast } from '@/hooks/use-toast';

export const InfoSimplesCredentialsComponent = () => {
  const { toast } = useToast();
  const [showPasswords, setShowPasswords] = useState(false);
  const [credentials, setCredentials] = useState<InfoSimplesCredentials>({
    token: '',
    a3: '',
    a3_pin: '',
    login_cpf: '',
    login_senha: ''
  });

  useEffect(() => {
    const stored = getCredentials();
    if (stored) {
      setCredentials(stored);
    }
  }, []);

  const handleSave = () => {
    if (!credentials.a3 || !credentials.a3_pin || !credentials.login_cpf || !credentials.login_senha) {
      toast({
        title: 'Erro',
        description: 'Todos os campos são obrigatórios',
        variant: 'destructive'
      });
      return;
    }

    saveCredentials(credentials);
    toast({
      title: 'Sucesso',
      description: 'Credenciais salvas com sucesso'
    });
  };

  const handleClear = () => {
    clearCredentials();
    setCredentials({
      a3: '',
      a3_pin: '',
      login_cpf: '',
      login_senha: ''
    });
    toast({
      title: 'Credenciais removidas',
      description: 'As credenciais foram removidas do armazenamento local'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Credenciais</CardTitle>
        <CardDescription>
          Configure as credenciais da API Info Simples
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="space-y-3">
            <div>
              <strong>⚙️ Configuração no Supabase (Recomendado)</strong>
              <p className="mt-1">As credenciais devem ser configuradas como secrets no Supabase:</p>
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">INFOSIMPLES_A3</code> - Token da API</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">INFOSIMPLES_A3_PIN</code> - Token Secret</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">INFOSIMPLES_LOGIN_CPF</code> - CPF para acessar o portal ECRVSP</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">INFOSIMPLES_LOGIN_SENHA</code> - Senha para acessar o portal ECRVSP</li>
              </ul>
            </div>
            <div className="border-t pt-2">
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
            <Label htmlFor="a3">Token (a3)</Label>
            <Input
              id="a3"
              type={showPasswords ? 'text' : 'password'}
              value={credentials.a3}
              onChange={(e) => setCredentials({ ...credentials, a3: e.target.value })}
              placeholder="296984008687583540"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="a3_pin">Token Secret (a3_pin)</Label>
            <Input
              id="a3_pin"
              type={showPasswords ? 'text' : 'password'}
              value={credentials.a3_pin}
              onChange={(e) => setCredentials({ ...credentials, a3_pin: e.target.value })}
              placeholder="1234"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login_cpf">CPF de Login</Label>
            <Input
              id="login_cpf"
              value={credentials.login_cpf}
              onChange={(e) => setCredentials({ ...credentials, login_cpf: e.target.value })}
              placeholder="17528605867"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login_senha">Senha de Login</Label>
            <Input
              id="login_senha"
              type={showPasswords ? 'text' : 'password'}
              value={credentials.login_senha}
              onChange={(e) => setCredentials({ ...credentials, login_senha: e.target.value })}
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

        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Credenciais
          </Button>
          <Button variant="destructive" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar Credenciais
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
