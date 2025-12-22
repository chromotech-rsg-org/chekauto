import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Save } from "lucide-react";

interface ConfiguracaoEmail {
  id: string;
  tipo_email: string;
  nome_exibicao: string;
  descricao: string | null;
  ativo_cliente: boolean;
  ativo_parceiro: boolean;
  ativo_admin: boolean;
  minutos_abandono: number | null;
}

export default function ConfiguracoesEmail() {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfiguracoes();
  }, []);

  const loadConfiguracoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("configuracoes_email")
        .select("*")
        .order("tipo_email");

      if (error) throw error;
      setConfiguracoes(data || []);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast.error("Erro ao carregar configurações de email");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id: string, field: "ativo_cliente" | "ativo_parceiro" | "ativo_admin", value: boolean) => {
    setConfiguracoes((prev) =>
      prev.map((config) => (config.id === id ? { ...config, [field]: value } : config))
    );
  };

  const handleMinutosChange = (id: string, value: string) => {
    const minutos = parseInt(value) || null;
    setConfiguracoes((prev) =>
      prev.map((config) => (config.id === id ? { ...config, minutos_abandono: minutos } : config))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const config of configuracoes) {
        const { error } = await supabase
          .from("configuracoes_email")
          .update({
            ativo_cliente: config.ativo_cliente,
            ativo_parceiro: config.ativo_parceiro,
            ativo_admin: config.ativo_admin,
            minutos_abandono: config.minutos_abandono,
          })
          .eq("id", config.id);

        if (error) throw error;
      }
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Mail className="h-8 w-8" />
              Configurações de Email
            </h1>
            <p className="text-muted-foreground">
              Configure quais emails são enviados para clientes, parceiros e administradores
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Salvar Alterações
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Email</CardTitle>
            <CardDescription>
              Ative ou desative o envio de cada tipo de email para os diferentes destinatários
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Email</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-center">Cliente</TableHead>
                    <TableHead className="text-center">Parceiro</TableHead>
                    <TableHead className="text-center">Admin</TableHead>
                    <TableHead className="text-center">Minutos Abandono</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configuracoes.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell className="font-medium">{config.nome_exibicao}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[300px]">
                        {config.descricao}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={config.ativo_cliente}
                          onCheckedChange={(checked) => handleToggle(config.id, "ativo_cliente", checked)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={config.ativo_parceiro}
                          onCheckedChange={(checked) => handleToggle(config.id, "ativo_parceiro", checked)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={config.ativo_admin}
                          onCheckedChange={(checked) => handleToggle(config.id, "ativo_admin", checked)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        {config.tipo_email === "abandono_carrinho" ? (
                          <Input
                            type="number"
                            min="1"
                            max="1440"
                            value={config.minutos_abandono || ""}
                            onChange={(e) => handleMinutosChange(config.id, e.target.value)}
                            className="w-20 text-center mx-auto"
                            placeholder="30"
                          />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Consulta Iniciada</h4>
                <p>Enviado quando o cliente inicia uma consulta de veículo no sistema</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Abandono de Carrinho</h4>
                <p>Enviado após X minutos se o cliente não finalizar a compra</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Pedido Criado</h4>
                <p>Enviado quando o pedido é criado e está aguardando pagamento (PIX/Boleto)</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Pagamento Confirmado</h4>
                <p>Enviado quando o pagamento é confirmado pelo gateway</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Comissão do Parceiro</h4>
                <p>Notificação para o parceiro com detalhes da comissão recebida</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
