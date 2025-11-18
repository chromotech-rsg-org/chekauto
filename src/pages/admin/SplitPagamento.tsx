import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SplitPagamento() {
  const [splits, setSplits] = useState<any[]>([]);
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSplit, setEditingSplit] = useState<any>(null);
  const [parceiroId, setParceiroId] = useState("");
  const [produtosSelecionados, setProdutosSelecionados] = useState<string[]>([]);
  const [percentual, setPercentual] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  // Quando selecionar parceiro, preencher percentual automaticamente
  useEffect(() => {
    if (parceiroId && !editingSplit) {
      const parceiro = parceiros.find(p => p.id === parceiroId);
      if (parceiro?.percentual_split) {
        setPercentual(parceiro.percentual_split.toString());
      }
    }
  }, [parceiroId, parceiros, editingSplit]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [splitsRes, parceirosRes, produtosRes] = await Promise.all([
        supabase.from('splits').select('*, parceiros(*), produtos(*)').order('criado_em', { ascending: false }),
        supabase.from('parceiros').select('*').eq('ativo', true),
        supabase.from('produtos').select('*').eq('ativo', true)
      ]);

      if (splitsRes.error) throw splitsRes.error;
      if (parceirosRes.error) throw parceirosRes.error;
      if (produtosRes.error) throw produtosRes.error;

      setSplits(splitsRes.data || []);
      setParceiros(parceirosRes.data || []);
      setProdutos(produtosRes.data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const parceiroSelecionado = parceiros.find(p => p.id === parceiroId);
  const percentualChekAuto = percentual ? 100 - Number(percentual) : 0;

  const toggleProduto = (produtoId: string) => {
    setProdutosSelecionados(prev => 
      prev.includes(produtoId) 
        ? prev.filter(id => id !== produtoId)
        : [...prev, produtoId]
    );
  };

  const openModal = (split?: any) => {
    if (split) {
      setEditingSplit(split);
      setParceiroId(split.parceiro_id);
      setProdutosSelecionados([split.produto_id]);
      setPercentual(split.percentual?.toString() || "");
    } else {
      setEditingSplit(null);
      setParceiroId("");
      setProdutosSelecionados([]);
      setPercentual("");
    }
    setIsModalOpen(true);
  };

  const checkDuplicates = async (parceiroId: string, produtoIds: string[]) => {
    // Busca splits existentes para este parceiro
    const { data: existingSplits } = await supabase
      .from('splits')
      .select('produto_id')
      .eq('parceiro_id', parceiroId);

    if (!existingSplits) return [];

    const existingProductIds = existingSplits.map(s => s.produto_id);
    const duplicates = produtoIds.filter(id => existingProductIds.includes(id));
    
    return duplicates;
  };

  const handleSave = async () => {
    if (!parceiroId || produtosSelecionados.length === 0 || !percentual) {
      toast.error('Preencha todos os campos obrigatórios e selecione pelo menos um produto');
      return;
    }

    const percentualNum = Number(percentual);
    if (percentualNum < 0 || percentualNum > 100) {
      toast.error('Percentual deve estar entre 0 e 100');
      return;
    }

    try {
      if (editingSplit) {
        // Modo edição: apenas atualiza o split existente
        const { error } = await supabase
          .from('splits')
          .update({ 
            parceiro_id: parceiroId,
            produto_id: produtosSelecionados[0],
            percentual: percentualNum 
          })
          .eq('id', editingSplit.id);

        if (error) throw error;
        toast.success('Split atualizado com sucesso!');
      } else {
        // Modo criação: verifica duplicatas antes de inserir
        const duplicates = await checkDuplicates(parceiroId, produtosSelecionados);
        
        if (duplicates.length > 0) {
          const produtosNomes = duplicates
            .map(id => produtos.find(p => p.id === id)?.nome)
            .join(', ');
          toast.error(`Split já existe para: ${produtosNomes}`);
          return;
        }

        // Cria um split para cada produto selecionado
        const splitsToInsert = produtosSelecionados.map(produtoId => ({
          parceiro_id: parceiroId,
          produto_id: produtoId,
          percentual: percentualNum
        }));

        const { error } = await supabase
          .from('splits')
          .insert(splitsToInsert);

        if (error) throw error;
        toast.success(`${produtosSelecionados.length} split(s) criado(s) com sucesso!`);
      }

      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este split?')) return;

    try {
      const { error } = await supabase
        .from('splits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Split excluído com sucesso!');
      loadData();
    } catch (error: any) {
      toast.error('Erro ao excluir: ' + error.message);
    }
  };

  const filteredSplits = splits.filter((split) => {
    const splitDate = new Date(split.criado_em || new Date());
    const matchesDateRange = 
      (!startDate || splitDate >= new Date(startDate)) &&
      (!endDate || splitDate <= new Date(endDate));
    
    return matchesDateRange;
  });

  const exportFields = [
    { key: "parceiros.nome", label: "Parceiro" },
    { key: "produtos.nome", label: "Produto" },
    { key: "percentual", label: "Percentual Parceiro" },
    { key: "criado_em", label: "Data Criação" }
  ];

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
              <Button 
                className="bg-brand-yellow hover:bg-brand-yellow/90 text-black"
                onClick={() => openModal()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Nova Configuração
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSplit ? 'Editar' : 'Criar'} Configuração de Split</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {!editingSplit && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Selecione um ou mais produtos para criar splits. O sistema verifica automaticamente duplicatas de parceiro/produto.
                    </AlertDescription>
                  </Alert>
                )}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h4 className="font-semibold">Configuração de Split</h4>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="parceiro">Parceiro *</Label>
                        <Select 
                          value={parceiroId} 
                          onValueChange={setParceiroId}
                          disabled={!!editingSplit}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um parceiro" />
                          </SelectTrigger>
                          <SelectContent>
                            {parceiros.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.nome} {p.percentual_split ? `(${p.percentual_split}% padrão)` : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {editingSplit && (
                          <p className="text-xs text-muted-foreground">
                            Não é possível alterar o parceiro ao editar
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Produtos * {!editingSplit && `(${produtosSelecionados.length} selecionado${produtosSelecionados.length !== 1 ? 's' : ''})`}</Label>
                        {editingSplit ? (
                          <Select 
                            value={produtosSelecionados[0]} 
                            onValueChange={(val) => setProdutosSelecionados([val])}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                            <SelectContent>
                              {produtos.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="border rounded-lg p-3 max-h-60 overflow-y-auto space-y-2">
                            {produtos.length === 0 ? (
                              <p className="text-sm text-muted-foreground">Nenhum produto ativo disponível</p>
                            ) : (
                              produtos.map((produto) => (
                                <div 
                                  key={produto.id} 
                                  className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                                  onClick={() => toggleProduto(produto.id)}
                                >
                                  <input
                                    type="checkbox"
                                    checked={produtosSelecionados.includes(produto.id)}
                                    onChange={() => toggleProduto(produto.id)}
                                    className="h-4 w-4"
                                  />
                                  <Label className="cursor-pointer flex-1">{produto.nome}</Label>
                                  <span className="text-xs text-muted-foreground">
                                    R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="percentual">Percentual do Parceiro (%) *</Label>
                          {parceiroSelecionado?.percentual_split && (
                            <span className="text-xs text-muted-foreground">
                              Padrão: {parceiroSelecionado.percentual_split}%
                            </span>
                          )}
                        </div>
                        <Input
                          id="percentual"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="Ex: 15"
                          value={percentual}
                          onChange={(e) => setPercentual(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Você pode ajustar o percentual padrão do parceiro
                        </p>
                      </div>

                      {percentual && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                          <div>
                            <p className="text-sm text-muted-foreground">Percentual Parceiro</p>
                            <p className="text-2xl font-bold text-primary">{percentual}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Percentual ChekAuto</p>
                            <p className="text-2xl font-bold text-primary">{percentualChekAuto}%</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-brand-yellow hover:bg-brand-yellow/90 text-black"
                  onClick={handleSave}
                >
                  {editingSplit ? 'Atualizar' : `Criar ${produtosSelecionados.length} Split${produtosSelecionados.length !== 1 ? 's' : ''}`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
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
            data={filteredSplits}
            fields={exportFields}
            filename="split-pagamento"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Percentual Parceiro</TableHead>
                  <TableHead>Percentual ChekAuto</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredSplits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhum split cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSplits.map((split) => (
                    <TableRow key={split.id}>
                      <TableCell className="font-medium">
                        {split.parceiros?.nome || "N/A"}
                      </TableCell>
                      <TableCell>{split.produtos?.nome || "N/A"}</TableCell>
                      <TableCell>{split.percentual}%</TableCell>
                      <TableCell>{100 - split.percentual}%</TableCell>
                      <TableCell>{new Date(split.criado_em).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openModal(split)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(split.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
