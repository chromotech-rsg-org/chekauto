import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PaymentStatusBadge } from "@/components/admin/PaymentStatusBadge";
import { SplitStatusBadge } from "@/components/admin/SplitStatusBadge";
import { Button } from "@/components/ui/button";
import { Search, Eye, Mail } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const statusOptions = ["Pendente", "Em Análise", "Aprovado", "Concluído", "Cancelado"];
const paymentStatusOptions = ["PENDING", "RECEIVED", "CONFIRMED", "OVERDUE", "REFUNDED", "RECEIVED_IN_CASH", "REFUND_REQUESTED"];

interface Solicitacao {
  id: string;
  status: string;
  criado_em: string;
  dados_veiculo: any;
  split_status: string | null;
  split_erro: string | null;
  clientes: any;
  produtos: any;
  pagamentos: any;
}

export default function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  const fetchSolicitacoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('solicitacoes')
        .select(`
          *,
          clientes (*),
          produtos (*),
          pagamentos (*)
        `)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setSolicitacoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as solicitações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSolicitacoes = solicitacoes.filter((sol) => {
    const chassi = sol.dados_veiculo?.chassi || sol.dados_veiculo?.chassis || '';
    const matchesSearch = 
      sol.clientes?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sol.id.includes(searchTerm) ||
      chassi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sol.dados_veiculo?.placa?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentStatus = 
      filterPaymentStatus === "todos" || sol.pagamentos?.status === filterPaymentStatus;
    
    const matchesStatus = 
      filterStatus === "todos" || sol.status === filterStatus;
    
    const solDate = new Date(sol.criado_em);
    const matchesDateRange = 
      (!startDate || solDate >= new Date(startDate)) &&
      (!endDate || solDate <= new Date(endDate));
    
    return matchesSearch && matchesPaymentStatus && matchesStatus && matchesDateRange;
  });

  const exportFields = [
    { key: "id", label: "ID" },
    { key: "criado_em", label: "Data" },
    { key: "clientes.nome", label: "Cliente" },
    { key: "produtos.nome", label: "Produto" },
    { key: "dados_veiculo.chassis", label: "Chassis" },
    { key: "dados_veiculo.placa", label: "Placa" },
    { key: "dados_veiculo.renavam", label: "RENAVAM" },
    { key: "status", label: "Status" },
    { key: "pagamentos.status", label: "Status Pagamento" },
    { key: "pagamentos.metodo_pagamento", label: "Método Pagamento" },
    { key: "pagamentos.valor", label: "Valor" }
  ];

  const handleViewDetails = (solicitacao: Solicitacao) => {
    setSelectedSolicitacao(solicitacao);
    setNewStatus(solicitacao.status);
    setObservacoes("");
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedSolicitacao) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('solicitacoes')
        .update({ status: newStatus })
        .eq('id', selectedSolicitacao.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso",
      });

      fetchSolicitacoes();
      setIsDetailsOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendEmail = () => {
    setEmailSubject(`Atualização do Pedido #${selectedSolicitacao?.id.substring(0, 8)}`);
    setEmailBody("");
    setIsDetailsOpen(false);
    setIsEmailOpen(true);
  };

  const handleSendEmailSubmit = async () => {
    if (!selectedSolicitacao) return;

    try {
      setIsSaving(true);
      const { error } = await supabase.functions.invoke('enviar-email-pedido', {
        body: {
          to: selectedSolicitacao.clientes.email,
          subject: emailSubject,
          html: emailBody.replace(/\n/g, '<br>'),
        },
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Email enviado com sucesso",
      });

      setIsEmailOpen(false);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Pendente",
      RECEIVED: "Recebido",
      CONFIRMED: "Confirmado",
      OVERDUE: "Vencido",
      REFUNDED: "Reembolsado",
      RECEIVED_IN_CASH: "Recebido em Dinheiro",
      REFUND_REQUESTED: "Reembolso Solicitado",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1 max-w-md" />
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[200px]" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Solicitações</h1>
          <p className="text-muted-foreground">Gerencie as solicitações de produtos</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, cliente, chassis ou placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status Pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Pagamentos</SelectItem>
              {paymentStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {getPaymentStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClear={() => {
              setStartDate("");
              setEndDate("");
            }}
          />
          <ExportButton
            data={filteredSolicitacoes}
            fields={exportFields}
            filename="solicitacoes"
          />
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Chassis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Status Pagamento</TableHead>
                <TableHead>Split</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSolicitacoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    Nenhuma solicitação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredSolicitacoes.map((solicitacao) => (
                  <TableRow key={solicitacao.id}>
                    <TableCell className="font-medium">#{solicitacao.id.substring(0, 8)}</TableCell>
                    <TableCell>{new Date(solicitacao.criado_em).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{solicitacao.clientes?.nome || "N/A"}</TableCell>
                    <TableCell>{solicitacao.produtos?.nome || "N/A"}</TableCell>
                    <TableCell className="font-mono text-sm">{solicitacao.dados_veiculo?.chassi || solicitacao.dados_veiculo?.chassis || "N/A"}</TableCell>
                    <TableCell>
                      <StatusBadge status={solicitacao.status} />
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={solicitacao.pagamentos?.status || "PENDING"} />
                    </TableCell>
                    <TableCell>
                      <SplitStatusBadge 
                        status={solicitacao.split_status} 
                        erro={solicitacao.split_erro} 
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(solicitacao)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modal de Detalhes */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Solicitação #{selectedSolicitacao?.id.substring(0, 8)}</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="veiculo" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="veiculo">Veículo</TabsTrigger>
                <TabsTrigger value="cliente">Cliente</TabsTrigger>
                <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
                <TabsTrigger value="gestao">Gestão</TabsTrigger>
              </TabsList>
              
              <TabsContent value="veiculo" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Chassis</Label>
                        <p className="font-medium font-mono">{selectedSolicitacao?.dados_veiculo?.chassi || selectedSolicitacao?.dados_veiculo?.chassis || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Placa</Label>
                        <p className="font-medium">{selectedSolicitacao?.dados_veiculo?.placa || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">RENAVAM</Label>
                        <p className="font-medium">{selectedSolicitacao?.dados_veiculo?.renavam || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Marca</Label>
                        <p className="font-medium">{selectedSolicitacao?.dados_veiculo?.marca || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Modelo</Label>
                        <p className="font-medium">{selectedSolicitacao?.dados_veiculo?.modelo || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Ano</Label>
                        <p className="font-medium">{selectedSolicitacao?.dados_veiculo?.ano || selectedSolicitacao?.dados_veiculo?.anoModelo || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Cor</Label>
                        <p className="font-medium">{selectedSolicitacao?.dados_veiculo?.cor || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Tipo de Carroceria</Label>
                        <p className="font-medium">{selectedSolicitacao?.dados_veiculo?.tipoCarroceria || selectedSolicitacao?.dados_veiculo?.tipo || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Categoria</Label>
                        <p className="font-medium">{selectedSolicitacao?.dados_veiculo?.categoria || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Estado</Label>
                        <p className="font-medium">{selectedSolicitacao?.dados_veiculo?.estado || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Cidade</Label>
                        <p className="font-medium">{selectedSolicitacao?.dados_veiculo?.cidade || "N/A"}</p>
                      </div>
                      {selectedSolicitacao?.dados_veiculo?.informacaoAdicional && (
                        <div className="col-span-2">
                          <Label className="text-muted-foreground">Informação Adicional</Label>
                          <p className="font-medium">{selectedSolicitacao?.dados_veiculo?.informacaoAdicional}</p>
                        </div>
                      )}
                      {selectedSolicitacao?.dados_veiculo?.notaFiscalNome && (
                        <div className="col-span-2">
                          <Label className="text-muted-foreground">Nota Fiscal Anexada</Label>
                          <p className="font-medium text-green-600">✓ {selectedSolicitacao?.dados_veiculo?.notaFiscalNome}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cliente" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Nome</Label>
                        <p className="font-medium">{selectedSolicitacao?.clientes?.nome || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">CPF/CNPJ</Label>
                        <p className="font-medium">{selectedSolicitacao?.clientes?.cpf_cnpj || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium">{selectedSolicitacao?.clientes?.email || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Telefone</Label>
                        <p className="font-medium">{selectedSolicitacao?.clientes?.telefone || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <div className="mt-1">
                          <StatusBadge status={selectedSolicitacao?.clientes?.status || "lead"} />
                        </div>
                      </div>
                      {selectedSolicitacao?.clientes?.endereco && (
                        <div className="col-span-2">
                          <Label className="text-muted-foreground">Endereço</Label>
                          <p className="font-medium">
                            {selectedSolicitacao?.clientes?.endereco?.logradouro && `${selectedSolicitacao?.clientes?.endereco?.logradouro}, `}
                            {selectedSolicitacao?.clientes?.endereco?.numero && `${selectedSolicitacao?.clientes?.endereco?.numero} - `}
                            {selectedSolicitacao?.clientes?.endereco?.bairro && `${selectedSolicitacao?.clientes?.endereco?.bairro}, `}
                            {selectedSolicitacao?.clientes?.endereco?.cep && `CEP: ${selectedSolicitacao?.clientes?.endereco?.cep}`}
                            {selectedSolicitacao?.clientes?.endereco?.complemento && ` (${selectedSolicitacao?.clientes?.endereco?.complemento})`}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="pagamento" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Método de Pagamento</Label>
                        <p className="font-medium">{selectedSolicitacao?.pagamentos?.metodo_pagamento === 'PIX' ? 'PIX' : selectedSolicitacao?.pagamentos?.metodo_pagamento === 'CREDIT_CARD' ? 'Cartão de Crédito' : selectedSolicitacao?.pagamentos?.metodo_pagamento || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Valor Total</Label>
                        <p className="font-medium text-lg">
                          R$ {(selectedSolicitacao?.pagamentos?.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Status do Pagamento</Label>
                        <div className="mt-2">
                          <PaymentStatusBadge status={selectedSolicitacao?.pagamentos?.status || "PENDING"} />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Produto</Label>
                        <p className="font-medium">{selectedSolicitacao?.produtos?.nome || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="gestao" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status da Solicitação</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="observacoes">Observações Internas</Label>
                      <Textarea
                        id="observacoes"
                        placeholder="Adicione observações sobre esta solicitação..."
                        rows={4}
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                      />
                    </div>
                    
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={handleSendEmail}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar Email ao Cliente
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Fechar
              </Button>
              <Button 
                className="bg-brand-yellow hover:bg-brand-yellow/90 text-black"
                onClick={handleUpdateStatus}
                disabled={isSaving}
              >
                {isSaving ? "Atualizando..." : "Atualizar Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Email */}
        <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enviar Email ao Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="destinatario">Destinatário</Label>
                <Input 
                  id="destinatario" 
                  value={selectedSolicitacao?.clientes?.email || ""} 
                  disabled 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto</Label>
                <Input 
                  id="assunto" 
                  placeholder="Assunto do email..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="corpo">Mensagem</Label>
                <Textarea
                  id="corpo"
                  placeholder="Digite sua mensagem..."
                  rows={8}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmailOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-brand-yellow hover:bg-brand-yellow/90 text-black"
                onClick={handleSendEmailSubmit}
                disabled={isSaving || !emailSubject || !emailBody}
              >
                {isSaving ? "Enviando..." : "Enviar Email"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
