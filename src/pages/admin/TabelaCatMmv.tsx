import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockCatMmv } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Search, Upload, Pencil, Trash2, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExcelUpload } from "@/components/admin/ExcelUpload";
import { toast } from "sonner";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";

const categorias = [
  "Caminhão trator para caminhão",
  "Troca de tração para elétrico",
  "Cabine estendida",
  "Comércio"
];

export default function TabelaCatMmv() {
  const [catMmvData, setCatMmvData] = useState(mockCatMmv);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("todas");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [formData, setFormData] = useState({
    mmvOriginal: "",
    codigoMmvOriginal: "",
    mmvTransformada: "",
    codigoMmvTransformada: "",
    wmi: "",
    categoria: ""
  });

  const filteredData = catMmvData.filter((item) => {
    const matchesSearch = 
      item.mmvOriginal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mmvTransformada.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigoMmvOriginal.includes(searchTerm) ||
      item.codigoMmvTransformada.includes(searchTerm) ||
      item.wmi.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = filterCategoria === "todas" || item.categoria === filterCategoria;
    
    const itemDate = new Date(item.dataCriacao || new Date());
    const matchesDateRange = 
      (!startDate || itemDate >= new Date(startDate)) &&
      (!endDate || itemDate <= new Date(endDate));
    
    return matchesSearch && matchesCategoria && matchesDateRange;
  });

  const exportFields = [
    { key: "mmvOriginal", label: "MMV Original" },
    { key: "codigoMmvOriginal", label: "Código MMV Original" },
    { key: "mmvTransformada", label: "MMV Transformada" },
    { key: "codigoMmvTransformada", label: "Código MMV Transformada" },
    { key: "wmi", label: "WMI" },
    { key: "categoria", label: "Categoria" },
    { key: "dataCriacao", label: "Data Criação" }
  ];

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        mmvOriginal: "",
        codigoMmvOriginal: "",
        mmvTransformada: "",
        codigoMmvTransformada: "",
        wmi: "",
        categoria: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.mmvOriginal || !formData.codigoMmvOriginal || !formData.categoria) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (editingItem) {
      setCatMmvData(catMmvData.map(item => item.id === editingItem.id ? { ...formData, id: editingItem.id, dataCriacao: item.dataCriacao } : item));
      toast.success("Registro atualizado com sucesso!");
    } else {
      const newItem = { ...formData, id: catMmvData.length + 1, dataCriacao: new Date().toISOString().split('T')[0] };
      setCatMmvData([...catMmvData, newItem]);
      toast.success("Registro cadastrado com sucesso!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Deseja realmente excluir este registro?")) {
      setCatMmvData(catMmvData.filter(item => item.id !== id));
      toast.success("Registro excluído com sucesso!");
    }
  };

  const handleExcelUpload = (data: any[]) => {
    // Processar dados do Excel
    const newData = data.map((row, index) => ({
      id: catMmvData.length + index + 1,
      mmvOriginal: row["MMV Original"] || "",
      codigoMmvOriginal: row["Código MMV Original"] || "",
      mmvTransformada: row["MMV Transformada"] || "",
      codigoMmvTransformada: row["Código MMV Transformada"] || "",
      wmi: row["WMI"] || "",
      categoria: row["Categoria"] || "",
      dataCriacao: new Date().toISOString().split('T')[0]
    }));

    setCatMmvData([...catMmvData, ...newData]);
    toast.success(`${newData.length} registros importados com sucesso!`);
    setIsUploadOpen(false);
  };

  const handleExport = () => {
    toast.info("Funcionalidade de exportação em desenvolvimento");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tabela CAT MMV</h1>
            <p className="text-muted-foreground">Gerencie as transformações de veículos</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
            <Button variant="outline" onClick={() => setIsUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Importar Excel
            </Button>
            <Button onClick={() => handleOpenModal()} className="bg-brand-yellow hover:bg-brand-yellow/90 text-black">
              <Plus className="mr-2 h-4 w-4" />
              Cadastro Manual
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por MMV, código ou WMI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategoria} onValueChange={setFilterCategoria}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
            data={filteredData}
            fields={exportFields}
            filename="tabela-cat-mmv"
          />
        </div>

        <div className="bg-white rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MMV Original</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>MMV Transformada</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>WMI</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.mmvOriginal}</TableCell>
                  <TableCell className="font-mono text-sm">{item.codigoMmvOriginal}</TableCell>
                  <TableCell className="font-medium">{item.mmvTransformada}</TableCell>
                  <TableCell className="font-mono text-sm">{item.codigoMmvTransformada}</TableCell>
                  <TableCell className="font-mono text-sm">{item.wmi}</TableCell>
                  <TableCell className="text-sm">{item.categoria}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modal de Cadastro */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Editar Registro" : "Novo Registro"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mmvOriginal">MMV Original *</Label>
                  <Input
                    id="mmvOriginal"
                    value={formData.mmvOriginal}
                    onChange={(e) => setFormData({ ...formData, mmvOriginal: e.target.value })}
                    placeholder="Ex: CAMINHÃO TRATOR"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigoMmvOriginal">Código MMV Original *</Label>
                  <Input
                    id="codigoMmvOriginal"
                    value={formData.codigoMmvOriginal}
                    onChange={(e) => setFormData({ ...formData, codigoMmvOriginal: e.target.value })}
                    placeholder="Ex: 042008"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mmvTransformada">MMV Transformada</Label>
                  <Input
                    id="mmvTransformada"
                    value={formData.mmvTransformada}
                    onChange={(e) => setFormData({ ...formData, mmvTransformada: e.target.value })}
                    placeholder="Ex: CAMINHÃO SEMI-LEVE"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigoMmvTransformada">Código MMV Transformada</Label>
                  <Input
                    id="codigoMmvTransformada"
                    value={formData.codigoMmvTransformada}
                    onChange={(e) => setFormData({ ...formData, codigoMmvTransformada: e.target.value })}
                    placeholder="Ex: 042003"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wmi">WMI</Label>
                  <Input
                    id="wmi"
                    value={formData.wmi}
                    onChange={(e) => setFormData({ ...formData, wmi: e.target.value })}
                    placeholder="Ex: 9BM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-brand-yellow hover:bg-brand-yellow/90 text-black" onClick={handleSave}>
                {editingItem ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Upload */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Importar Excel - Tabela CAT MMV</DialogTitle>
            </DialogHeader>
            <ExcelUpload onUpload={handleExcelUpload} />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
