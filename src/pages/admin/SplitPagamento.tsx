import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, AlertCircle, CheckSquare, Square } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function SplitPagamento() {
  const [splits, setSplits] = useState<any[]>([]);
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSplit, setEditingSplit] = useState<any>(null);
  const [parceiroId, setParceiroId] = useState("");
  const [produtosSelecionados, setProdutosSelecionados] = useState<string[]>([]);
  const [tipoComissao, setTipoComissao] = useState<"percentual" | "valor_fixo">("percentual");
  const [percentual, setPercentual] = useState("");
  const [valorFixo, setValorFixo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  // Quando selecionar parceiro, preencher valores automaticamente
  useEffect(() => {
    if (parceiroId && !editingSplit) {
      const parceiro = parceiros.find(p => p.id === parceiroId);
      if (parceiro) {
        setTipoComissao(parceiro.tipo_comissao || "percentual");
        if (parceiro.tipo_comissao === "valor_fixo" && parceiro.valor_comissao) {
          setValorFixo(parceiro.valor_comissao.toString());
          setPercentual("");
        } else if (parceiro.percentual_split) {
          setPercentual(parceiro.percentual_split.toString());
          setValorFixo("");
        }
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

  const selecionarTodosProdutos = () => {
    setProdutosSelecionados(produtos.map(p => p.id));
  };

  const desmarcarTodosProdutos = () => {
    setProdutosSelecionados([]);
  };

  const openModal = (split?: any) => {
    if (split) {
      setEditingSplit(split);
      setParceiroId(split.parceiro_id);
      setProdutosSelecionados([split.produto_id]);
      setTipoComissao(split.tipo_comissao || "percentual");
      setPercentual(split.percentual?.toString() || "");
      setValorFixo(split.valor_fixo?.toString() || "");
    } else {
      setEditingSplit(null);
      setParceiroId("");
      setProdutosSelecionados([]);
      setTipoComissao("percentual");
      setPercentual("");
      setValorFixo("");
    }
    setIsModalOpen(true);
  };

  const checkDuplicates = async (parceiroId: string, produtoIds: string[]) => {
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
    if (!parceiroId || produtosSelecionados.length === 0) {
      toast.error('Preencha todos os campos obrigatórios e selecione pelo menos um produto');
      return;
    }

    if (tipoComissao === "percentual" && !percentual) {
      toast.error('Informe o percentual da comissão');
      return;
    }

    if (tipoComissao === "valor_fixo" && !valorFixo) {
      toast.error('Informe o valor fixo da comissão');
      return;
    }

    const percentualNum = tipoComissao === "percentual" ? Number(percentual) : 0;
    const valorFixoNum = tipoComissao === "valor_fixo" ? Number(valorFixo) : null;

    if (tipoComissao === "percentual" && (percentualNum < 0 || percentualNum > 100)) {
      toast.error('Percentual deve estar entre 0 e 100');
      return;
    }

    if (tipoComissao === "valor_fixo" && valorFixoNum !== null && valorFixoNum < 0) {
      toast.error('Valor fixo não pode ser negativo');
      return;
    }

    try {
      if (editingSplit) {
        const { error } = await supabase
          .from('splits')
          .update({ 
            parceiro_id: parceiroId,
            produto_id: produtosSelecionados[0],
            tipo_comissao: tipoComissao,
            percentual: tipoComissao === "percentual" ? percentualNum : 0,
            valor_fixo: valorFixoNum
          })
          .eq('id', editingSplit.id);

        if (error) throw error;
        toast.success('Split atualizado com sucesso!');
      } else {
        const duplicates = await checkDuplicates(parceiroId, produtosSelecionados);
        
        if (duplicates.length > 0) {
          const produtosNomes = duplicates
            .map(id => produtos.find(p => p.id === id)?.nome)
            .join(', ');
          toast.error(`Split já existe para: ${produtosNomes}`);
          return;
        }

        const splitsToInsert = produtosSelecionados.map(produtoId => ({
          parceiro_id: parceiroId,
          produto_id: produtoId,
          tipo_comissao: tipoComissao,
          percentual: tipoComissao === "percentual" ? percentualNum : 0,
          valor_fixo: valorFixoNum
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

  const formatComissao = (split: any) => {
    if (split.tipo_comissao === "valor_fixo" && split.valor_fixo) {
      return `R$ ${Number(split.valor_fixo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    return `${split.percentual || 0}%`;
  };

  const exportFields = [
    { key: "parceiros.nome", label: "Parceiro" },
    { key: "produtos.nome", label: "Produto" },
    { key: "tipo_comissao", label: "Tipo Comissão" },
    { key: "percentual", label: "Percentual Parceiro" },
    { key: "valor_fixo", label: "Valor Fixo" },
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
                                {p.nome} {p.tipo_comissao === "valor_fixo" 
                                  ? `(R$ ${p.valor_comissao} fixo)` 
                                  : p.percentual_split ? `(${p.percentual_split}% padrão)` : ''}
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
                        <div className="flex items-center justify-between">
                          <Label>Produtos * {!editingSplit && `(${produtosSelecionados.length} selecionado${produtosSelecionados.length !== 1 ? 's' : ''})`}</Label>
                          {!editingSplit && produtos.length > 0 && (
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={selecionarTodosProdutos}
                              >
                                <CheckSquare className="h-3 w-3 mr-1" />
                                Selecionar todos
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={desmarcarTodosProdutos}
                              >
                                <Square className="h-3 w-3 mr-1" />
                                Desmarcar todos
                              </Button>
                            </div>
                          )}
                        </div>
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
                                  className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded"
                                >
                                  <Checkbox
                                    id={`produto-${produto.id}`}
                                    checked={produtosSelecionados.includes(produto.id)}
                                    onCheckedChange={() => toggleProduto(produto.id)}
                                  />
                                  <Label 
                                    htmlFor={`produto-${produto.id}`}
                                    className="cursor-pointer flex-1 flex items-center justify-between"
                                  >
                                    <span>{produto.nome}</span>
                                    <span className="text-xs text-muted-foreground">
                                      R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                  </Label>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>

                      {/* Tipo de Comissão */}
                      <div className="space-y-3">
                        <Label>Tipo de Comissão *</Label>
                        <RadioGroup
                          value={tipoComissao}
                          onValueChange={(value: "percentual" | "valor_fixo") => setTipoComissao(value)}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="percentual" id="split_percentual" />
                            <Label htmlFor="split_percentual" className="cursor-pointer">Percentual (%)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="valor_fixo" id="split_valor" />
                            <Label htmlFor="split_valor" className="cursor-pointer">Valor Fixo (R$)</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {tipoComissao === "percentual" ? (
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
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="valorFixo">Valor Fixo (R$) *</Label>
                            {parceiroSelecionado?.valor_comissao && (
                              <span className="text-xs text-muted-foreground">
                                Padrão: R$ {parceiroSelecionado.valor_comissao}
                              </span>
                            )}
                          </div>
                          <Input
                            id="valorFixo"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Ex: 50.00"
                            value={valorFixo}
                            onChange={(e) => setValorFixo(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Valor fixo em reais por venda
                          </p>
                        </div>
                      )}

                      {tipoComissao === "percentual" && percentual && (
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

                      {tipoComissao === "valor_fixo" && valorFixo && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Valor por venda para o Parceiro</p>
                          <p className="text-2xl font-bold text-primary">
                            R$ {Number(valorFixo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>ChekAuto</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredSplits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum split configurado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSplits.map((split) => (
                    <TableRow key={split.id}>
                      <TableCell className="font-medium">{split.parceiros?.nome || '-'}</TableCell>
                      <TableCell>{split.produtos?.nome || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {split.tipo_comissao === "valor_fixo" ? "Valor Fixo" : "Percentual"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{formatComissao(split)}</TableCell>
                      <TableCell>
                        {split.tipo_comissao === "percentual" ? `${100 - (split.percentual || 0)}%` : '-'}
                      </TableCell>
                      <TableCell>
                        {split.criado_em ? new Date(split.criado_em).toLocaleDateString('pt-BR') : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openModal(split)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(split.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
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
