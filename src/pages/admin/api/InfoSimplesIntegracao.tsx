import { useState, useEffect } from "react";
import { ApiIntegrationLayout } from "@/components/admin/ApiIntegrationLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, Save, RefreshCw, Info } from "lucide-react";

export default function InfoSimplesIntegracao() {
  const [token, setToken] = useState("");
  const [tokenSecret, setTokenSecret] = useState("");
  const [loginCpf, setLoginCpf] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from("configuracoes_sistema")
        .select("chave, valor")
        .in("chave", ["infosimples_token", "infosimples_token_secret", "infosimples_login_cpf", "infosimples_login_senha"]);

      if (error) throw error;

      data?.forEach((config) => {
        switch (config.chave) {
          case "infosimples_token":
            setToken(config.valor);
            break;
          case "infosimples_token_secret":
            setTokenSecret(config.valor);
            break;
          case "infosimples_login_cpf":
            setLoginCpf(config.valor);
            break;
          case "infosimples_login_senha":
            setLoginSenha(config.valor);
            break;
        }
      });
    } catch (error) {
      console.error("Erro ao carregar credenciais:", error);
    }
  };

  const saveCredential = async (chave: string, valor: string, descricao: string) => {
    const { data: existing } = await supabase
      .from("configuracoes_sistema")
      .select("id")
      .eq("chave", chave)
      .single();

    if (existing) {
      return supabase.from("configuracoes_sistema").update({ valor }).eq("chave", chave);
    } else {
      return supabase.from("configuracoes_sistema").insert({ chave, valor, descricao });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await Promise.all([
        saveCredential("infosimples_token", token, "Token da API InfoSimples"),
        saveCredential("infosimples_token_secret", tokenSecret, "Token Secret da API InfoSimples"),
        saveCredential("infosimples_login_cpf", loginCpf, "CPF para login InfoSimples"),
        saveCredential("infosimples_login_senha", loginSenha, "Senha para login InfoSimples"),
      ]);
      toast.success("Credenciais salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar credenciais");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApiIntegrationLayout
      title="API InfoSimples"
      description="Configurações de integração com a API InfoSimples"
      basePath="/admin/api/infosimples"
      activeTab="integracao"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Credenciais da API</CardTitle>
            <CardDescription>Configure as credenciais para acessar a API InfoSimples</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Input
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Seu token da API"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tokenSecret">Token Secret</Label>
                <div className="relative">
                  <Input
                    id="tokenSecret"
                    type={showPasswords ? "text" : "password"}
                    value={tokenSecret}
                    onChange={(e) => setTokenSecret(e.target.value)}
                    placeholder="Seu token secret"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginCpf">CPF de Login</Label>
                <Input
                  id="loginCpf"
                  value={loginCpf}
                  onChange={(e) => setLoginCpf(e.target.value)}
                  placeholder="CPF para autenticação"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginSenha">Senha de Login</Label>
                <div className="relative">
                  <Input
                    id="loginSenha"
                    type={showPasswords ? "text" : "password"}
                    value={loginSenha}
                    onChange={(e) => setLoginSenha(e.target.value)}
                    placeholder="Senha para autenticação"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPasswords ? "Ocultar" : "Mostrar"} senhas
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Credenciais
              </Button>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Como obter as credenciais</AlertTitle>
          <AlertDescription>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Acesse o painel da InfoSimples em <a href="https://infosimples.com" target="_blank" className="text-primary underline">infosimples.com</a></li>
              <li>Vá em Configurações → API</li>
              <li>Copie o Token e Token Secret</li>
              <li>Para consultas que requerem autenticação, informe CPF e senha</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    </ApiIntegrationLayout>
  );
}
