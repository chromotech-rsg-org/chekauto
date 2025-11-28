import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, Loader2, X, Image as ImageIcon, Copy } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ExportButton } from "@/components/admin/ExportButton";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUpload } from "@/components/admin/FileUpload";

interface Caracteristica {
  titulo: string;
  descricao: string;
}

interface Aplicacao {
  titulo: string;
  descricao: string;
}

interface FAQ {
  pergunta: string;
  resposta: string;
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [formData, setFormData] = useState({
    nome: "",
    apelido: "",
    descricao: "",
    tiposSelecionados: [] as string[],
    preco: "",
    foto_url: "",
    galeria: [] as string[],
    ativo: true,
  });

  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
  const [aplicacoes, setAplicacoes] = useState<Aplicacao[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [capaFile, setCapaFile] = useState<File | null>(null);
  const [galeriaFiles, setGaleriaFiles] = useState<(File | null)[]>([]);

  useEffect(() => {
    loadProdutos();
    loadTipos();
  }, []);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          *,
          produto_tipos (
            tipo_id,
            categorias:tipo_id (
              id,
              codigo,
              nome
            )
          )
        `)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const loadTipos = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('codigo');

      if (error) throw error;
      setTipos(data || []);
    } catch (error) {
      console.error('Erro ao carregar tipos:', error);
    }
  };

  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const dataCriacao = produto.criado_em ? new Date(produto.criado_em).toISOString().split('T')[0] : '';
    const matchesDate = (!startDate || dataCriacao >= startDate) && 
      (!endDate || dataCriacao <= endDate);
    return matchesSearch && matchesDate;
  });

  const uploadImageToStorage = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('produtos')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('produtos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleDuplicate = async (produto: any) => {
    if (!confirm("Deseja duplicar este produto?")) return;

    try {
      // Carregar dados completos do produto
      const { data: tiposData } = await supabase
        .from('produto_tipos')
        .select('tipo_id')
        .eq('produto_id', produto.id);
      
      const { data: caracData } = await supabase
        .from('produto_caracteristicas')
        .select('*')
        .eq('produto_id', produto.id)
        .order('ordem');
      
      const { data: aplicData } = await supabase
        .from('produto_aplicacoes')
        .select('*')
        .eq('produto_id', produto.id)
        .order('ordem');
      
      const { data: faqData } = await supabase
        .from('produto_faq')
        .select('*')
        .eq('produto_id', produto.id)
        .order('ordem');

      const { data: galeriaData } = await supabase
        .from('produto_galeria')
        .select('*')
        .eq('produto_id', produto.id)
        .order('ordem');

      // Criar novo produto com nome duplicado
      const novoProduto = {
        nome: `${produto.nome} (Cópia)`,
        apelido: produto.apelido ? `${produto.apelido} (Cópia)` : null,
        descricao: produto.descricao,
        preco: produto.preco,
        foto_url: produto.foto_url,
        ativo: false, // Inicia desativado
      };

      const { data: novoProdutoData, error: produtoError } = await supabase
        .from('produtos')
        .insert(novoProduto)
        .select()
        .single();

      if (produtoError) throw produtoError;

      const novoProdutoId = novoProdutoData.id;

      // Duplicar tipos
      if (tiposData && tiposData.length > 0) {
        const tiposInsert = tiposData.map(t => ({
          produto_id: novoProdutoId,
          tipo_id: t.tipo_id,
        }));
        await supabase.from('produto_tipos').insert(tiposInsert);
      }

      // Duplicar características
      if (caracData && caracData.length > 0) {
        const caracInsert = caracData.map(c => ({
          produto_id: novoProdutoId,
          titulo: c.titulo,
          descricao: c.descricao,
          ordem: c.ordem,
        }));
        await supabase.from('produto_caracteristicas').insert(caracInsert);
      }

      // Duplicar aplicações
      if (aplicData && aplicData.length > 0) {
        const aplicInsert = aplicData.map(a => ({
          produto_id: novoProdutoId,
          titulo: a.titulo,
          descricao: a.descricao,
          ordem: a.ordem,
        }));
        await supabase.from('produto_aplicacoes').insert(aplicInsert);
      }

      // Duplicar FAQs
      if (faqData && faqData.length > 0) {
        const faqInsert = faqData.map(f => ({
          produto_id: novoProdutoId,
          pergunta: f.pergunta,
          resposta: f.resposta,
          ordem: f.ordem,
        }));
        await supabase.from('produto_faq').insert(faqInsert);
      }

      // Duplicar galeria
      if (galeriaData && galeriaData.length > 0) {
        const galeriaInsert = galeriaData.map(g => ({
          produto_id: novoProdutoId,
          foto_url: g.foto_url,
          ordem: g.ordem,
        }));
        await supabase.from('produto_galeria').insert(galeriaInsert);
      }

      toast.success("Produto duplicado com sucesso!");
      loadProdutos();
    } catch (error) {
      console.error('Erro ao duplicar produto:', error);
      toast.error('Erro ao duplicar produto');
    }
  };

  const handleOpenModal = async (produto?: any) => {
    if (produto) {
      setEditingProduto(produto);
      
      // Carregar tipos selecionados
      const { data: tiposData } = await supabase
        .from('produto_tipos')
        .select('tipo_id')
        .eq('produto_id', produto.id);
      
      // Carregar características
      const { data: caracData } = await supabase
        .from('produto_caracteristicas')
        .select('*')
        .eq('produto_id', produto.id)
        .order('ordem');
      
      // Carregar aplicações
      const { data: aplicData } = await supabase
        .from('produto_aplicacoes')
        .select('*')
        .eq('produto_id', produto.id)
        .order('ordem');
      
      // Carregar FAQ
      const { data: faqData } = await supabase
        .from('produto_faq')
        .select('*')
        .eq('produto_id', produto.id)
        .order('ordem');

      // Carregar galeria
      const { data: galeriaData } = await supabase
        .from('produto_galeria')
        .select('*')
        .eq('produto_id', produto.id)
        .order('ordem');
      
      setFormData({
        nome: produto.nome,
        apelido: produto.apelido || "",
        descricao: produto.descricao || "",
        tiposSelecionados: tiposData?.map(t => t.tipo_id) || [],
        preco: produto.preco?.toString() || "",
        foto_url: produto.foto_url || "",
        galeria: galeriaData?.map(g => g.foto_url) || [],
        ativo: produto.ativo ?? true,
      });
      
      setCaracteristicas(caracData?.map(c => ({ titulo: c.titulo, descricao: c.descricao })) || []);
      setAplicacoes(aplicData?.map(a => ({ titulo: a.titulo, descricao: a.descricao })) || []);
      setFaqs(faqData?.map(f => ({ pergunta: f.pergunta, resposta: f.resposta })) || []);
    } else {
      setEditingProduto(null);
      setFormData({
        nome: "",
        apelido: "",
        descricao: "",
        tiposSelecionados: [],
        preco: "",
        foto_url: "",
        galeria: [],
        ativo: true,
      });
      setCaracteristicas([]);
      setAplicacoes([]);
      setFaqs([]);
    }
    setCapaFile(null);
    setGaleriaFiles([]);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      toast.error("Nome do produto é obrigatório");
      return;
    }
    if (!formData.preco || Number(formData.preco) <= 0) {
      toast.error("Preço deve ser maior que zero");
      return;
    }

    try {
      setUploadingImage(true);

      // Upload da foto de capa
      let fotoCapaUrl = formData.foto_url;
      if (capaFile) {
        fotoCapaUrl = await uploadImageToStorage(capaFile, 'capas');
      }

      // Upload das fotos da galeria
      const galeriaUrls = [...formData.galeria];
      for (let i = 0; i < galeriaFiles.length; i++) {
        if (galeriaFiles[i]) {
          const url = await uploadImageToStorage(galeriaFiles[i]!, 'galeria');
          if (i < galeriaUrls.length) {
            galeriaUrls[i] = url;
          } else {
            galeriaUrls.push(url);
          }
        }
      }

      const produtoData = {
        nome: formData.nome,
        apelido: formData.apelido || null,
        foto_url: fotoCapaUrl || null,
        descricao: formData.descricao,
        preco: Number(formData.preco),
        ativo: formData.ativo,
      };

      let produtoId: string;

      if (editingProduto) {
        const { error } = await supabase
          .from('produtos')
          .update(produtoData)
          .eq('id', editingProduto.id);

        if (error) throw error;
        produtoId = editingProduto.id;
        
        // Deletar tipos antigos
        await supabase.from('produto_tipos').delete().eq('produto_id', produtoId);
        
        // Deletar características antigas
        await supabase.from('produto_caracteristicas').delete().eq('produto_id', produtoId);
        
        // Deletar aplicações antigas
        await supabase.from('produto_aplicacoes').delete().eq('produto_id', produtoId);
        
        // Deletar FAQs antigos
        await supabase.from('produto_faq').delete().eq('produto_id', produtoId);
        
        // Deletar galeria antiga
        await supabase.from('produto_galeria').delete().eq('produto_id', produtoId);
      } else {
        const { data, error } = await supabase
          .from('produtos')
          .insert(produtoData)
          .select()
          .single();

        if (error) throw error;
        produtoId = data.id;
      }

      // Inserir tipos selecionados
      if (formData.tiposSelecionados.length > 0) {
        const tiposInsert = formData.tiposSelecionados.map(tipoId => ({
          produto_id: produtoId,
          tipo_id: tipoId,
        }));
        await supabase.from('produto_tipos').insert(tiposInsert);
      }

      // Inserir características
      if (caracteristicas.length > 0) {
        const caracInsert = caracteristicas.map((c, idx) => ({
          produto_id: produtoId,
          titulo: c.titulo,
          descricao: c.descricao,
          ordem: idx,
        }));
        await supabase.from('produto_caracteristicas').insert(caracInsert);
      }

      // Inserir aplicações
      if (aplicacoes.length > 0) {
        const aplicInsert = aplicacoes.map((a, idx) => ({
          produto_id: produtoId,
          titulo: a.titulo,
          descricao: a.descricao,
          ordem: idx,
        }));
        await supabase.from('produto_aplicacoes').insert(aplicInsert);
      }

      // Inserir FAQs
      if (faqs.length > 0) {
        const faqInsert = faqs.map((f, idx) => ({
          produto_id: produtoId,
          pergunta: f.pergunta,
          resposta: f.resposta,
          ordem: idx,
        }));
        await supabase.from('produto_faq').insert(faqInsert);
      }

      // Inserir galeria
      if (galeriaUrls.length > 0) {
        const galeriaInsert = galeriaUrls.filter(url => url).map((url, idx) => ({
          produto_id: produtoId,
          foto_url: url,
          ordem: idx,
        }));
        await supabase.from('produto_galeria').insert(galeriaInsert);
      }

      toast.success(editingProduto ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
      setIsModalOpen(false);
      setCapaFile(null);
      setGaleriaFiles([]);
      loadProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Erro ao salvar produto');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto? Isso também excluirá características, aplicações, FAQs e galeria.")) {
      try {
        const { error } = await supabase
          .from('produtos')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success("Produto excluído com sucesso!");
        loadProdutos();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        toast.error('Erro ao excluir produto');
      }
    }
  };

  const exportFields = [
    { key: "nome", label: "Nome" },
    { key: "apelido", label: "Apelido" },
    { key: "preco", label: "Preço" },
    { key: "ativo", label: "Status" },
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>{editingProduto ? 'Editar Produto' : 'Criar Novo Produto'}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[calc(90vh-120px)] pr-4">
                <div className="space-y-6 py-4">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Informações Básicas</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome do Produto *</Label>
                        <Input 
                          id="nome" 
                          placeholder="Ex: Carroceria Tanque" 
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="apelido">Apelido</Label>
                        <Input 
                          id="apelido" 
                          placeholder="Ex: Tanque Premium" 
                          value={formData.apelido}
                          onChange={(e) => setFormData({ ...formData, apelido: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="preco">Preço (R$) *</Label>
                        <Input 
                          id="preco" 
                          type="number" 
                          step="0.01"
                          placeholder="Ex: 1950.00"
                          value={formData.preco}
                          onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-8">
                        <Switch
                          id="ativo"
                          checked={formData.ativo}
                          onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                        />
                        <Label htmlFor="ativo">Produto ativo</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea 
                        id="descricao" 
                        placeholder="Descrição detalhada do produto"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Tipos de Carroceria */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Tipos de Carroceria</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {tipos.map((tipo) => (
                        <div key={tipo.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tipo-${tipo.id}`}
                            checked={formData.tiposSelecionados.includes(tipo.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({
                                  ...formData,
                                  tiposSelecionados: [...formData.tiposSelecionados, tipo.id]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  tiposSelecionados: formData.tiposSelecionados.filter(id => id !== tipo.id)
                                });
                              }
                            }}
                          />
                          <label htmlFor={`tipo-${tipo.id}`} className="text-sm cursor-pointer">
                            {tipo.codigo && tipo.nome ? `${tipo.codigo} - ${tipo.nome}` : tipo.nome}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fotos */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Fotos</h3>
                    <FileUpload
                      label="Foto de Capa"
                      accept="image/*"
                      value={formData.foto_url}
                      onChange={(file) => setCapaFile(file)}
                      preview={true}
                    />
                    
                    <div className="space-y-2">
                      <Label>Galeria de Fotos</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {formData.galeria.map((url, idx) => (
                          <div key={idx} className="relative">
                            {url && !galeriaFiles[idx] ? (
                              <div className="relative">
                                <img src={url} alt={`Galeria ${idx + 1}`} className="w-full h-32 object-cover rounded border" />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6"
                                  onClick={() => {
                                    const newGaleria = formData.galeria.filter((_, i) => i !== idx);
                                    const newFiles = galeriaFiles.filter((_, i) => i !== idx);
                                    setFormData({ ...formData, galeria: newGaleria });
                                    setGaleriaFiles(newFiles);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <FileUpload
                                label={`Foto ${idx + 1}`}
                                accept="image/*"
                                value={null}
                                onChange={(file) => {
                                  const newFiles = [...galeriaFiles];
                                  newFiles[idx] = file;
                                  setGaleriaFiles(newFiles);
                                }}
                                preview={true}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData({ ...formData, galeria: [...formData.galeria, ""] });
                          setGaleriaFiles([...galeriaFiles, null]);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Foto
                      </Button>
                    </div>
                  </div>

                  {/* Características */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Características</h3>
                    {caracteristicas.map((c, idx) => (
                      <div key={idx} className="grid grid-cols-2 gap-4 p-4 border rounded">
                        <Input
                          placeholder="Título"
                          value={c.titulo}
                          onChange={(e) => {
                            const newCarac = [...caracteristicas];
                            newCarac[idx].titulo = e.target.value;
                            setCaracteristicas(newCarac);
                          }}
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="Descrição"
                            value={c.descricao}
                            onChange={(e) => {
                              const newCarac = [...caracteristicas];
                              newCarac[idx].descricao = e.target.value;
                              setCaracteristicas(newCarac);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setCaracteristicas(caracteristicas.filter((_, i) => i !== idx))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCaracteristicas([...caracteristicas, { titulo: "", descricao: "" }])}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Característica
                    </Button>
                  </div>

                  {/* Aplicações */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Aplicações</h3>
                    {aplicacoes.map((a, idx) => (
                      <div key={idx} className="grid grid-cols-2 gap-4 p-4 border rounded">
                        <Input
                          placeholder="Título"
                          value={a.titulo}
                          onChange={(e) => {
                            const newAplic = [...aplicacoes];
                            newAplic[idx].titulo = e.target.value;
                            setAplicacoes(newAplic);
                          }}
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="Descrição"
                            value={a.descricao}
                            onChange={(e) => {
                              const newAplic = [...aplicacoes];
                              newAplic[idx].descricao = e.target.value;
                              setAplicacoes(newAplic);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setAplicacoes(aplicacoes.filter((_, i) => i !== idx))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAplicacoes([...aplicacoes, { titulo: "", descricao: "" }])}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Aplicação
                    </Button>
                  </div>

                  {/* Perguntas Frequentes */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Perguntas Frequentes</h3>
                    {faqs.map((f, idx) => (
                      <div key={idx} className="space-y-2 p-4 border rounded">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Pergunta"
                            value={f.pergunta}
                            onChange={(e) => {
                              const newFaqs = [...faqs];
                              newFaqs[idx].pergunta = e.target.value;
                              setFaqs(newFaqs);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Resposta"
                          value={f.resposta}
                          onChange={(e) => {
                            const newFaqs = [...faqs];
                            newFaqs[idx].resposta = e.target.value;
                            setFaqs(newFaqs);
                          }}
                          rows={2}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFaqs([...faqs, { pergunta: "", resposta: "" }])}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Pergunta
                    </Button>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="border-t pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={uploadingImage}>
                  {uploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>{editingProduto ? 'Atualizar' : 'Criar'}</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <DateRangeFilter 
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClear={() => { setStartDate(""); setEndDate(""); }}
          />

          <ExportButton 
            data={filteredProdutos.map(p => ({
              nome: p.nome,
              apelido: p.apelido || '-',
              preco: p.preco,
              ativo: p.ativo ? 'Ativo' : 'Inativo'
            }))} 
            fields={exportFields} 
            filename="produtos"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProdutos.length === 0 ? (
              <div className="col-span-full text-center p-8 text-muted-foreground">
                Nenhum produto cadastrado
              </div>
            ) : (
              filteredProdutos.map((produto) => (
                <Card key={produto.id} className="flex flex-col h-full">
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="space-y-3 flex-1 flex flex-col">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base line-clamp-1">{produto.nome}</h3>
                          {produto.apelido && (
                            <p className="text-xs text-muted-foreground italic line-clamp-1">{produto.apelido}</p>
                          )}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs whitespace-nowrap ml-2 ${produto.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {produto.ativo ? 'Ativo' : 'Inativo'}
                        </div>
                      </div>
                      
                      {produto.produto_tipos?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {produto.produto_tipos.slice(0, 2).map((pt: any) => {
                            const tipo = pt.categorias;
                            if (!tipo) return null;
                            return (
                              <span key={pt.tipo_id} className="text-xs bg-gray-100 px-2 py-1 rounded line-clamp-1">
                                {tipo.codigo}
                              </span>
                            );
                          })}
                          {produto.produto_tipos.length > 2 && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              +{produto.produto_tipos.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {produto.foto_url ? (
                        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded overflow-hidden min-h-[180px] max-h-[180px]">
                          <img 
                            src={produto.foto_url} 
                            alt={produto.nome}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded min-h-[180px] max-h-[180px]">
                          <ImageIcon className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                      
                      <div className="pt-2 border-t mt-auto">
                        <p className="text-xl font-bold text-brand-yellow">
                          R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenModal(produto)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDuplicate(produto)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(produto.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}