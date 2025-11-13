import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockSplits, mockParceiros } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SplitPagamento() {
  const [splits] = useState(mockSplits);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parceiroId, setParceiroId] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const parceirosAtivos = mockParceiros.filter(p => p.status === "Ativo");

  const parceiroSelecionado = parceirosAtivos.find(p => p.id.toString() === parceiroId);
  const percentualParceiro = parceiroSelecionado?.percentual || 0;
  const percentualChekAuto = 100 - percentualParceiro;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Split de Pagamento</h1>
            <p className="text-muted-foreground">Configure a divisão de pagamentos</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Criar Nova Configuração
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Configuração de Split</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h4 className="font-semibold">Configuração de Percentuais</h4>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="parceiro">Parceiro</Label>
                        <Select value={parceiroId} onValueChange={setParceiroId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um parceiro" />
                          </SelectTrigger>
                          <SelectContent>
                            {parceirosAtivos.map((p) => (
                              <SelectItem key={p.id} value={p.id.toString()}>
                                {p.nome} - {p.percentual}%
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {parceiroSelecionado && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                          <div>
                            <p className="text-sm text-muted-foreground">Percentual Parceiro</p>
                            <p className="text-2xl font-bold">{percentualParceiro}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Percentual ChekAuto</p>
                            <p className="text-2xl font-bold">{percentualChekAuto}%</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label htmlFor="detalhes">Detalhes do Split</Label>
                  <Textarea
                    id="detalhes"
                    placeholder="Descreva quando e como este split será aplicado..."
                    rows={3}
                    value={detalhes}
                    onChange={(e) => setDetalhes(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
                  Salvar Configuração
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Percentual Parceiro</TableHead>
                  <TableHead>Percentual ChekAuto</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {splits.map((split) => {
                  const parceiroInfo = mockParceiros.find(mp => mp.id.toString() === split.parceiroId);
                  return (
                    <TableRow key={split.id}>
                      <TableCell className="font-medium">
                        {parceiroInfo?.nome || "N/A"}
                      </TableCell>
                      <TableCell>{split.percentualParceiro}%</TableCell>
                      <TableCell>{split.percentualChekauto}%</TableCell>
                      <TableCell>{split.dataCriacao}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
