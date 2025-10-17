import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockSplits } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function SplitPagamento() {
  const [splits] = useState(mockSplits);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parceiros, setParceiros] = useState([{ nome: "", valor: 0 }]);

  const addParceiro = () => {
    setParceiros([...parceiros, { nome: "", valor: 0 }]);
  };

  const removeParceiro = (index: number) => {
    setParceiros(parceiros.filter((_, i) => i !== index));
  };

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
                <div className="space-y-2">
                  <Label htmlFor="detalhes">Detalhes do Split</Label>
                  <Textarea
                    id="detalhes"
                    placeholder="Descreva quando e como este split será aplicado..."
                    rows={3}
                  />
                </div>

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h4 className="font-semibold">Configuração de Percentuais</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="chekauto">ChekAuto (%)</Label>
                        <Input id="chekauto" type="number" placeholder="70" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cliente">Cliente (%)</Label>
                        <Input id="cliente" type="number" placeholder="20" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Parceiros</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addParceiro}>
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar Parceiro
                        </Button>
                      </div>

                      {parceiros.map((parceiro, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Nome do parceiro"
                            value={parceiro.nome}
                            onChange={(e) => {
                              const newParceiros = [...parceiros];
                              newParceiros[index].nome = e.target.value;
                              setParceiros(newParceiros);
                            }}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            placeholder="%"
                            value={parceiro.valor}
                            onChange={(e) => {
                              const newParceiros = [...parceiros];
                              newParceiros[index].valor = Number(e.target.value);
                              setParceiros(newParceiros);
                            }}
                            className="w-24"
                          />
                          {parceiros.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeParceiro(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Total:</span>
                        <span className="text-lg font-bold">100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button variant="outline" className="w-full" disabled>
                  Integrar API (Em breve)
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black" onClick={() => setIsModalOpen(false)}>
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead>Percentuais</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {splits.map((split) => (
                <TableRow key={split.id}>
                  <TableCell className="font-medium">#{split.id}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm line-clamp-2">{split.detalhes}</p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div>ChekAuto: <span className="font-medium">{split.percentuais.chekauto}%</span></div>
                      <div>Cliente: <span className="font-medium">{split.percentuais.cliente}%</span></div>
                      {split.percentuais.parceiros.map((p, idx) => (
                        <div key={idx}>{p.nome}: <span className="font-medium">{p.valor}%</span></div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(split.dataCriacao).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
