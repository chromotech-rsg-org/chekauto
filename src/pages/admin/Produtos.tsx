import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockProdutos, mockCategorias } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/admin/FileUpload";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";

export default function Produtos() {
  const [produtos] = useState(mockProdutos);
  const [categorias, setCategorias] = useState(mockCategorias);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Carrega categorias dinamicamente
    setCategorias(mockCategorias);
  }, []);

  const filteredProdutos = produtos.filter(
    (produto) => {
      const matchesSearch = 
        produto.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const produtoDate = new Date(produto.dataCadastro || new Date());
      const matchesDateRange = 
        (!startDate || produtoDate >= new Date(startDate)) &&
        (!endDate || produtoDate <= new Date(endDate));
      
      return matchesSearch && matchesDateRange;
    }
  );

  const exportFields = [
    { key: "codigo", label: "Código" },
    { key: "nomeTecnico", label: "Nome Técnico" },
    { key: "nomeFantasia", label: "Nome Fantasia" },
    { key: "preco", label: "Preço" },
    { key: "categoria", label: "Categoria" },
    { key: "dataCadastro", label: "Data Cadastro" }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Produtos</h1>
            <p className="text-muted-foreground">Gerencie o catálogo de produtos</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Produto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <FileUpload label="Foto do Produto" accept="image/*" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeTecnico">Nome Técnico *</Label>
                    <Input id="nomeTecnico" placeholder="Ex: Tanque Combustível 15000L" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
                    <Input id="nomeFantasia" placeholder="Ex: Tanque 15K Premium" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código do Produto *</Label>
                    <Input id="codigo" placeholder="Ex: TCO-15000" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço (R$) *</Label>
                    <Input id="preco" type="number" placeholder="45000.00" />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat.id.toString()} value={cat.nome}>
                            {cat.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      placeholder="Descreva o produto..."
                      rows={4}
                      maxLength={500}
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label>Características</Label>
                    <div className="space-y-2">
                      <Input placeholder="Ex: Aço inoxidável AISI 304" />
                      <Button type="button" variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Característica
                      </Button>
                    </div>
                  </div>
                </div>
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

        <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
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
            data={filteredProdutos}
            fields={exportFields}
            filename="produtos"
          />
        </div>
          <Select>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat.id.toString()} value={cat.nome}>
                  {cat.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProdutos.map((produto) => (
            <Card key={produto.id} className="overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <img
                  src={produto.foto}
                  alt={produto.nomeFantasia}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{produto.nomeFantasia}</h3>
                    <p className="text-sm text-muted-foreground">{produto.codigo}</p>
                  </div>
                  <span className="text-lg font-bold text-brand-yellow">
                    R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {produto.descricao}
                </p>
                <div className="pt-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {produto.categoria}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
