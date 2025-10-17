import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { mockSolicitacoes } from "@/lib/mockData";
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

const statusOptions = ["Pendente", "Em Análise", "Aprovado", "Concluído", "Cancelado"];

export default function Solicitacoes() {
  const [solicitacoes] = useState(mockSolicitacoes);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSolicitacoes = solicitacoes.filter(
    (sol) =>
      sol.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sol.id.toString().includes(searchTerm) ||
      sol.chassis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (solicitacao: any) => {
    setSelectedSolicitacao(solicitacao);
    setIsDetailsOpen(true);
  };

  const handleSendEmail = () => {
    setIsDetailsOpen(false);
    setIsEmailOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Solicitações</h1>
          <p className="text-muted-foreground">Gerencie as solicitações de produtos</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, cliente ou chassis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSolicitacoes.map((solicitacao) => (
                <TableRow key={solicitacao.id}>
                  <TableCell className="font-medium">#{solicitacao.id}</TableCell>
                  <TableCell>{new Date(solicitacao.data).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{solicitacao.cliente}</TableCell>
                  <TableCell>{solicitacao.produto}</TableCell>
                  <TableCell className="font-mono text-sm">{solicitacao.chassis}</TableCell>
                  <TableCell>
                    <StatusBadge status={solicitacao.status} />
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
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modal de Detalhes */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Solicitação #{selectedSolicitacao?.id}</DialogTitle>
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
                      <div>
                        <Label className="text-muted-foreground">Placa</Label>
                        <p className="font-medium">{selectedSolicitacao?.placa}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">RENAVAM</Label>
                        <p className="font-medium">{selectedSolicitacao?.renavam}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Chassis</Label>
                        <p className="font-medium font-mono">{selectedSolicitacao?.chassis}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Categoria</Label>
                        <p className="font-medium">{selectedSolicitacao?.categoria}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Tipo de Carroceria</Label>
                        <p className="font-medium">{selectedSolicitacao?.tipoCarroceria}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cliente" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-muted-foreground">Nome</Label>
                        <p className="font-medium">{selectedSolicitacao?.cliente}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Informações detalhadas do cliente podem ser visualizadas na seção de Clientes.
                      </p>
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
                        <p className="font-medium">{selectedSolicitacao?.metodoPagamento}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Valor</Label>
                        <p className="font-medium text-lg">
                          R$ {selectedSolicitacao?.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
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
                      <Select defaultValue={selectedSolicitacao?.status}>
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
                        defaultValue={selectedSolicitacao?.observacoes}
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
              <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
                Atualizar Status
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
                <Input id="destinatario" value="cliente@exemplo.com" disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto</Label>
                <Input id="assunto" placeholder="Assunto do email..." />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="corpo">Mensagem</Label>
                <Textarea
                  id="corpo"
                  placeholder="Digite sua mensagem..."
                  rows={8}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmailOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-brand-yellow hover:bg-brand-yellow/90 text-black"
                onClick={() => setIsEmailOpen(false)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Enviar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
