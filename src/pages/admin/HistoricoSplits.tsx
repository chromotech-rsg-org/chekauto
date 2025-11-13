import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockHistoricoSplits, mockParceiros, mockClientes, mockProdutos } from "@/lib/mockData";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";

export default function HistoricoSplits() {
  const [historico] = useState(mockHistoricoSplits);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterParceiro, setFilterParceiro] = useState("todos");
  const [filterCliente, setFilterCliente] = useState("todos");
  const [filterProduto, setFilterProduto] = useState("todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredHistorico = historico.filter((item) => {
    const matchesSearch = 
      item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.parceiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.produto.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesParceiro = filterParceiro === "todos" || item.parceiro === filterParceiro;
    const matchesCliente = filterCliente === "todos" || item.cliente === filterCliente;
    const matchesProduto = filterProduto === "todos" || item.produto === filterProduto;
    
    const itemDate = new Date(item.data);
    const matchesDateRange = 
      (!startDate || itemDate >= new Date(startDate)) &&
      (!endDate || itemDate <= new Date(endDate));
    
    return matchesSearch && matchesParceiro && matchesCliente && matchesProduto && matchesDateRange;
  });

  const exportFields = [
    { key: "id", label: "ID" },
    { key: "data", label: "Data" },
    { key: "cliente", label: "Cliente" },
    { key: "produto", label: "Produto" },
    { key: "parceiro", label: "Parceiro" },
    { key: "valorTotal", label: "Valor Total" },
    { key: "valorParceiro", label: "Valor Parceiro" },
    { key: "valorChekauto", label: "Valor ChekAuto" },
    { key: "percentualParceiro", label: "% Parceiro" }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Histórico de Splits</h1>
          <p className="text-muted-foreground">Visualize o histórico de divisões de pagamento executadas</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, parceiro ou produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={filterParceiro} onValueChange={setFilterParceiro}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por parceiro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Parceiros</SelectItem>
              {mockParceiros.map((parceiro) => (
                <SelectItem key={parceiro.id} value={parceiro.nome}>
                  {parceiro.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterCliente} onValueChange={setFilterCliente}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Clientes</SelectItem>
              {mockClientes.slice(0, 10).map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.nome}>
                  {cliente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterProduto} onValueChange={setFilterProduto}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por produto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Produtos</SelectItem>
              {mockProdutos.map((produto) => (
                <SelectItem key={produto.id} value={produto.nomeFantasia}>
                  {produto.nomeFantasia}
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
            data={filteredHistorico}
            fields={exportFields}
            filename="historico-splits"
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
                <TableHead>Parceiro</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">Valor Parceiro</TableHead>
                <TableHead className="text-right">Valor ChekAuto</TableHead>
                <TableHead className="text-center">% Split</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistorico.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">#{item.id}</TableCell>
                  <TableCell>{new Date(item.data).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{item.cliente}</TableCell>
                  <TableCell>{item.produto}</TableCell>
                  <TableCell className="font-medium">{item.parceiro}</TableCell>
                  <TableCell className="text-right font-semibold">
                    R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right text-blue-600">
                    R$ {item.valorParceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    R$ {item.valorChekauto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-medium">{item.percentualParceiro}%</span>
                      <span className="text-xs text-muted-foreground">/ {100 - item.percentualParceiro}%</span>
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
