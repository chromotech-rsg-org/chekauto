import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categorias = [
  "Caminhão trator para caminhão",
  "Troca de Tração para Elétrico",
  "Cabine Estendida",
  "Comércio"
];

interface CatMmvItem {
  id: string;
  mmv_original: string | null;
  codigo_mmv_original: string | null;
  mmv_transformada: string | null;
  codigo_mmv_transformada: string | null;
  wmi: string | null;
  categoria: string | null;
  marca: string | null;
  modelo_original: string | null;
  modelo_transformado: string | null;
  tipo_transformacao: string | null;
  carroceria: string | null;
  eixos: string | null;
  numero_cat: string | null;
  numero_cct: string | null;
  vencimento: string | null;
  origem: string | null;
  criado_em: string | null;
}

const PAGE_SIZE_OPTIONS = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
  { value: "all", label: "Todas" }
];

export default function TabelaCatMmv() {
  const [catMmvData, setCatMmvData] = useState<CatMmvItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatMmvItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("todas");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState("20");

  const [formData, setFormData] = useState({
    mmv_original: "",
    codigo_mmv_original: "",
    mmv_transformada: "",
    codigo_mmv_transformada: "",
    wmi: "",
    categoria: "",
    marca: "",
    modelo_original: "",
    modelo_transformado: "",
    tipo_transformacao: "",
    carroceria: "",
    eixos: "",
    numero_cat: "",
    numero_cct: "",
    vencimento: "",
    origem: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cat_mmv")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar dados");
      console.error(error);
    } else {
      setCatMmvData(data || []);
    }
    setLoading(false);
  };

  const filteredData = catMmvData.filter((item) => {
    const matchesSearch = 
      (item.mmv_original || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.mmv_transformada || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.codigo_mmv_original || "").includes(searchTerm) ||
      (item.codigo_mmv_transformada || "").includes(searchTerm) ||
      (item.wmi || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.marca || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = filterCategoria === "todas" || item.categoria === filterCategoria;
    
    const itemDate = new Date(item.criado_em || new Date());
    const matchesDateRange = 
      (!startDate || itemDate >= new Date(startDate)) &&
      (!endDate || itemDate <= new Date(endDate));
    
    return matchesSearch && matchesCategoria && matchesDateRange;
  });

  // Paginação
  const itemsPerPage = pageSize === "all" ? filteredData.length : parseInt(pageSize);
  const totalPages = pageSize === "all" ? 1 : Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = pageSize === "all" 
    ? filteredData 
    : filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  // Reset page when filters or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategoria, startDate, endDate, pageSize]);

  const exportFields = [
    { key: "mmv_original", label: "MMV Original" },
    { key: "codigo_mmv_original", label: "Código MMV Original" },
    { key: "mmv_transformada", label: "MMV Transformada" },
    { key: "codigo_mmv_transformada", label: "Código MMV Transformada" },
    { key: "wmi", label: "WMI" },
    { key: "categoria", label: "Categoria" },
    { key: "marca", label: "Marca" },
    { key: "modelo_original", label: "Modelo Original" },
    { key: "modelo_transformado", label: "Modelo Transformado" },
    { key: "tipo_transformacao", label: "Tipo de Transformação" },
    { key: "carroceria", label: "Carroceria" },
    { key: "eixos", label: "Eixos" },
    { key: "numero_cat", label: "Nº CAT" },
    { key: "numero_cct", label: "Nº CCT" },
    { key: "vencimento", label: "Vencimento" },
    { key: "origem", label: "Origem" }
  ];

  const handleOpenModal = (item?: CatMmvItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        mmv_original: item.mmv_original || "",
        codigo_mmv_original: item.codigo_mmv_original || "",
        mmv_transformada: item.mmv_transformada || "",
        codigo_mmv_transformada: item.codigo_mmv_transformada || "",
        wmi: item.wmi || "",
        categoria: item.categoria || "",
        marca: item.marca || "",
        modelo_original: item.modelo_original || "",
        modelo_transformado: item.modelo_transformado || "",
        tipo_transformacao: item.tipo_transformacao || "",
        carroceria: item.carroceria || "",
        eixos: item.eixos || "",
        numero_cat: item.numero_cat || "",
        numero_cct: item.numero_cct || "",
        vencimento: item.vencimento || "",
        origem: item.origem || ""
      });
    } else {
      setEditingItem(null);
      setFormData({
        mmv_original: "",
        codigo_mmv_original: "",
        mmv_transformada: "",
        codigo_mmv_transformada: "",
        wmi: "",
        categoria: "",
        marca: "",
        modelo_original: "",
        modelo_transformado: "",
        tipo_transformacao: "",
        carroceria: "",
        eixos: "",
        numero_cat: "",
        numero_cct: "",
        vencimento: "",
        origem: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.mmv_original) {
      toast.error("Preencha o campo MMV Original");
      return;
    }

    if (editingItem) {
      const { error } = await supabase
        .from("cat_mmv")
        .update(formData)
        .eq("id", editingItem.id);

      if (error) {
        toast.error("Erro ao atualizar registro");
        console.error(error);
      } else {
        toast.success("Registro atualizado com sucesso!");
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from("cat_mmv")
        .insert(formData);

      if (error) {
        toast.error("Erro ao cadastrar registro");
        console.error(error);
      } else {
        toast.success("Registro cadastrado com sucesso!");
        fetchData();
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir este registro?")) {
      const { error } = await supabase
        .from("cat_mmv")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Erro ao excluir registro");
        console.error(error);
      } else {
        toast.success("Registro excluído com sucesso!");
        fetchData();
      }
    }
  };

  const handleExcelUpload = async (data: any[]) => {
    const mappedData = data.map((row) => ({
      mmv_original: row["MMV Original"] || null,
      codigo_mmv_original: String(row["Código MMV Original"] || ""),
      mmv_transformada: row["MMV Transformada"] || null,
      codigo_mmv_transformada: String(row["Código MMV Transformada"] || ""),
      wmi: row["WMI"] || null,
      categoria: row["Categoria"] || null,
      marca: row["Marca"] || null,
      modelo_original: row["Modelo Original"] || null,
      modelo_transformado: row["Modelo Transformado"] || null,
      tipo_transformacao: row["Tipo de Transformação"] || null,
      carroceria: row["Carroceria"] || null,
      eixos: row["Eixos"] || null,
      numero_cat: row["Nº CAT"] || null,
      numero_cct: row["Nº CCT"] || null,
      vencimento: row["Vencimento"] || null,
      origem: row["ORGEM"] || row["Origem"] || null
    }));

    const { error } = await supabase
      .from("cat_mmv")
      .insert(mappedData);

    if (error) {
      toast.error("Erro ao importar dados");
      console.error(error);
    } else {
      toast.success(`${mappedData.length} registros importados com sucesso!`);
      fetchData();
    }
    setIsUploadOpen(false);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "MMV Original": "VW/19.320 CLC TT",
        "Código MMV Original": "339047",
        "MMV Transformada": "VW/19.320 VIABRZ CLC",
        "Código MMV Transformada": "301622",
        "WMI": "953",
        "Categoria": "Caminhão trator para caminhão",
        "Marca": "Volkswagen",
        "Modelo Original": "19.320 CLC TT",
        "Modelo Transformado": "19.320 VIABRZ CLC",
        "Tipo de Transformação": "",
        "Carroceria": "",
        "Eixos": "",
        "Nº CAT": "",
        "Nº CCT": "",
        "Vencimento": "",
        "ORGEM": "CHEKAUTO"
      }
    ];

    import("xlsx").then((XLSX) => {
      const ws = XLSX.utils.json_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template CAT MMV");
      XLSX.writeFile(wb, "template-cat-mmv.xlsx");
      toast.success("Template baixado com sucesso!");
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tabela CAT MMV</h1>
            <p className="text-muted-foreground">Gerencie as transformações de veículos</p>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Baixar Template
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
              placeholder="Buscar por MMV, código, WMI ou marca..."
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

        <div className="bg-card rounded-lg border">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">MMV Original</TableHead>
                  <TableHead className="min-w-[100px]">Código</TableHead>
                  <TableHead className="min-w-[200px]">MMV Transformada</TableHead>
                  <TableHead className="min-w-[100px]">Código</TableHead>
                  <TableHead className="min-w-[80px]">WMI</TableHead>
                  <TableHead className="min-w-[180px]">Categoria</TableHead>
                  <TableHead className="min-w-[120px]">Marca</TableHead>
                  <TableHead className="min-w-[100px]">Nº CAT</TableHead>
                  <TableHead className="min-w-[100px]">Vencimento</TableHead>
                  <TableHead className="min-w-[100px]">Origem</TableHead>
                  <TableHead className="text-right min-w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.mmv_original}</TableCell>
                      <TableCell className="font-mono text-sm">{item.codigo_mmv_original}</TableCell>
                      <TableCell className="font-medium">{item.mmv_transformada}</TableCell>
                      <TableCell className="font-mono text-sm">{item.codigo_mmv_transformada}</TableCell>
                      <TableCell className="font-mono text-sm">{item.wmi}</TableCell>
                      <TableCell className="text-sm">{item.categoria}</TableCell>
                      <TableCell className="text-sm">{item.marca}</TableCell>
                      <TableCell className="text-sm">{item.numero_cat}</TableCell>
                      <TableCell className="text-sm">{item.vencimento}</TableCell>
                      <TableCell className="text-sm">{item.origem}</TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Paginação */}
          <div className="flex items-center justify-between px-4 py-3 border-t flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Linhas por página:</span>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="w-[100px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredData.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} registros
              </p>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm px-2">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Cadastro */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Editar Registro" : "Novo Registro"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mmv_original">MMV Original *</Label>
                  <Input
                    id="mmv_original"
                    value={formData.mmv_original}
                    onChange={(e) => setFormData({ ...formData, mmv_original: e.target.value })}
                    placeholder="Ex: VW/19.320 CLC TT"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo_mmv_original">Código MMV Original</Label>
                  <Input
                    id="codigo_mmv_original"
                    value={formData.codigo_mmv_original}
                    onChange={(e) => setFormData({ ...formData, codigo_mmv_original: e.target.value })}
                    placeholder="Ex: 339047"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mmv_transformada">MMV Transformada</Label>
                  <Input
                    id="mmv_transformada"
                    value={formData.mmv_transformada}
                    onChange={(e) => setFormData({ ...formData, mmv_transformada: e.target.value })}
                    placeholder="Ex: VW/19.320 VIABRZ CLC"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo_mmv_transformada">Código MMV Transformada</Label>
                  <Input
                    id="codigo_mmv_transformada"
                    value={formData.codigo_mmv_transformada}
                    onChange={(e) => setFormData({ ...formData, codigo_mmv_transformada: e.target.value })}
                    placeholder="Ex: 301622"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wmi">WMI</Label>
                  <Input
                    id="wmi"
                    value={formData.wmi}
                    onChange={(e) => setFormData({ ...formData, wmi: e.target.value })}
                    placeholder="Ex: 953"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Input
                    id="marca"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    placeholder="Ex: Volkswagen"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelo_original">Modelo Original</Label>
                  <Input
                    id="modelo_original"
                    value={formData.modelo_original}
                    onChange={(e) => setFormData({ ...formData, modelo_original: e.target.value })}
                    placeholder="Ex: 19.320 CLC TT"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelo_transformado">Modelo Transformado</Label>
                  <Input
                    id="modelo_transformado"
                    value={formData.modelo_transformado}
                    onChange={(e) => setFormData({ ...formData, modelo_transformado: e.target.value })}
                    placeholder="Ex: 19.320 VIABRZ CLC"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_transformacao">Tipo de Transformação</Label>
                  <Input
                    id="tipo_transformacao"
                    value={formData.tipo_transformacao}
                    onChange={(e) => setFormData({ ...formData, tipo_transformacao: e.target.value })}
                    placeholder="Ex: cavalo p caminhão"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carroceria">Carroceria</Label>
                  <Input
                    id="carroceria"
                    value={formData.carroceria}
                    onChange={(e) => setFormData({ ...formData, carroceria: e.target.value })}
                    placeholder="Ex: inacabada"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eixos">Eixos</Label>
                  <Input
                    id="eixos"
                    value={formData.eixos}
                    onChange={(e) => setFormData({ ...formData, eixos: e.target.value })}
                    placeholder="Ex: 02 / 4x2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero_cat">Nº CAT</Label>
                  <Input
                    id="numero_cat"
                    value={formData.numero_cat}
                    onChange={(e) => setFormData({ ...formData, numero_cat: e.target.value })}
                    placeholder="Ex: CAT nº 1205/2019"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero_cct">Nº CCT</Label>
                  <Input
                    id="numero_cct"
                    value={formData.numero_cct}
                    onChange={(e) => setFormData({ ...formData, numero_cct: e.target.value })}
                    placeholder="Ex: 24785"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vencimento">Vencimento</Label>
                  <Input
                    id="vencimento"
                    value={formData.vencimento}
                    onChange={(e) => setFormData({ ...formData, vencimento: e.target.value })}
                    placeholder="Ex: 17/07/2021"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origem">Origem</Label>
                  <Input
                    id="origem"
                    value={formData.origem}
                    onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                    placeholder="Ex: CHEKAUTO"
                  />
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
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Importar Excel - Tabela CAT MMV</DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto">
              <ExcelUpload onUpload={handleExcelUpload} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}