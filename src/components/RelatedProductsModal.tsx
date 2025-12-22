import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Package, ArrowRight, Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '@/contexts/CheckoutContext';

interface Product {
  id: string;
  nome: string;
  apelido: string | null;
  preco: number;
  foto_url: string | null;
  descricao: string | null;
  categorias?: string[];
}

interface Categoria {
  id: string;
  codigo: string;
  nome: string;
}

interface RelatedProductsModalProps {
  open: boolean;
  onClose: () => void;
  vehicleType: string;
  vehicleData: any;
}

type ProductSource = 'related' | 'all';

// Função para extrair todos os códigos numéricos do tipo do veículo
const extractTypeCodes = (vehicleType: string): string[] => {
  if (!vehicleType) return [];
  
  // Regex para encontrar números no início de palavras ou após " - "
  // Ex: "14 - CAMINHÃO - 2 - ALUGUEL" -> ["14", "2"]
  const codes: string[] = [];
  const parts = vehicleType.split(' - ');
  
  for (const part of parts) {
    const trimmed = part.trim();
    // Verificar se começa com número
    const match = trimmed.match(/^(\d+)/);
    if (match) {
      codes.push(match[1]);
    }
  }
  
  return [...new Set(codes)]; // Remover duplicatas
};

export const RelatedProductsModal = ({ 
  open, 
  onClose, 
  vehicleType,
  vehicleData 
}: RelatedProductsModalProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategorias, setAllCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [productSource, setProductSource] = useState<ProductSource>('related');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  const navigate = useNavigate();
  const { setVehicleData, setProductData } = useCheckout();

  useEffect(() => {
    if (open) {
      loadRelatedProducts();
      loadCategorias();
      setSearchTerm('');
      setSelectedCategorias([]);
    }
  }, [open, vehicleType]);

  const loadCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('id, codigo, nome')
        .order('codigo');

      if (error) throw error;
      setAllCategorias(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadRelatedProducts = async () => {
    setLoading(true);
    setProductSource('related');
    
    try {
      // Se não temos tipo de veículo, buscar todos os produtos
      if (!vehicleType) {
        await loadAllProducts();
        return;
      }

      // Extrair todos os códigos do tipo (ex: "14 - CAMINHÃO - 2 - ALUGUEL" -> ["14", "2"])
      const tipoCodes = extractTypeCodes(vehicleType);
      
      // Também extrair nomes para busca alternativa (ex: "SEMIRREBOQUE")
      const tipoNomes = vehicleType.split(' - ').map(p => p.trim().toUpperCase()).filter(p => !/^\d+$/.test(p));
      
      console.log('Buscando produtos para tipos:', tipoCodes, 'nomes:', tipoNomes, 'vehicleType:', vehicleType);

      if (tipoCodes.length === 0 && tipoNomes.length === 0) {
        await loadAllProducts();
        return;
      }

      // Buscar categorias por código OU por nome (case insensitive)
      let categorias: Categoria[] = [];
      
      // Primeiro buscar por código
      if (tipoCodes.length > 0) {
        const { data: catPorCodigo, error: catError } = await supabase
          .from('categorias')
          .select('id, codigo, nome')
          .in('codigo', tipoCodes);
        
        if (!catError && catPorCodigo) {
          categorias = [...catPorCodigo];
        }
      }
      
      // Se não encontrou por código, buscar por nome
      if (categorias.length === 0 && tipoNomes.length > 0) {
        for (const nome of tipoNomes) {
          const { data: catPorNome, error } = await supabase
            .from('categorias')
            .select('id, codigo, nome')
            .ilike('nome', `%${nome}%`);
          
          if (!error && catPorNome) {
            categorias = [...categorias, ...catPorNome];
          }
        }
        // Remover duplicatas
        categorias = categorias.filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);
      }

      console.log('Categorias encontradas:', categorias);

      if (!categorias || categorias.length === 0) {
        console.log('Nenhuma categoria encontrada para tipos:', tipoCodes, 'ou nomes:', tipoNomes);
        await loadAllProducts();
        return;
      }

      const categoriaIds = categorias.map(c => c.id);

      // Buscar produtos através da tabela de junção produto_tipos
      const { data: produtoTipos, error: ptError } = await supabase
        .from('produto_tipos')
        .select('produto_id, tipo_id')
        .in('tipo_id', categoriaIds);

      if (ptError) throw ptError;

      let foundProducts: Product[] = [];

      if (!produtoTipos || produtoTipos.length === 0) {
        // Fallback: buscar por categoria_id direta
        const { data: produtosDiretos, error: prodError } = await supabase
          .from('produtos')
          .select('id, nome, apelido, preco, foto_url, descricao')
          .eq('ativo', true)
          .in('categoria_id', categoriaIds);

        if (prodError) throw prodError;
        foundProducts = (produtosDiretos || []).map(p => ({ ...p, categorias: [] }));
      } else {
        const produtoIds = [...new Set(produtoTipos.map(pt => pt.produto_id))];

        // Buscar produtos com suas categorias
        const { data: produtosData, error: prodError } = await supabase
          .from('produtos')
          .select(`
            id, nome, apelido, preco, foto_url, descricao,
            produto_tipos (
              categorias:tipo_id (
                id, codigo, nome
              )
            )
          `)
          .eq('ativo', true)
          .in('id', produtoIds);

        if (prodError) throw prodError;
        
        foundProducts = (produtosData || []).map(p => ({
          ...p,
          categorias: p.produto_tipos?.map((pt: any) => pt.categorias?.nome).filter(Boolean) || []
        }));
      }

      console.log('Produtos encontrados:', foundProducts?.length);
      
      // Se não encontrou produtos relacionados, buscar todos
      if (foundProducts.length === 0) {
        await loadAllProducts();
      } else {
        setProducts(foundProducts);
        setProductSource('related');
      }
    } catch (error) {
      console.error('Erro ao buscar produtos relacionados:', error);
      await loadAllProducts();
    } finally {
      setLoading(false);
    }
  };

  const loadAllProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          id, nome, apelido, preco, foto_url, descricao,
          produto_tipos (
            categorias:tipo_id (
              id, codigo, nome
            )
          )
        `)
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      
      const productsWithCategories = (data || []).map(p => ({
        ...p,
        categorias: p.produto_tipos?.map((pt: any) => pt.categorias?.nome).filter(Boolean) || []
      }));
      
      setProducts(productsWithCategories);
      setProductSource('all');
    } catch (error) {
      console.error('Erro ao buscar todos os produtos:', error);
      setProducts([]);
    }
  };

  // Filtrar produtos por busca e categorias selecionadas
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filtro por busca
      const matchesSearch = searchTerm === '' || 
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.apelido?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filtro por categorias
      if (selectedCategorias.length > 0) {
        const produtoCategorias = product.categorias || [];
        return produtoCategorias.some(cat => selectedCategorias.includes(cat));
      }

      return true;
    });
  }, [products, searchTerm, selectedCategorias]);

  const toggleCategoria = (categoriaNome: string) => {
    setSelectedCategorias(prev => 
      prev.includes(categoriaNome)
        ? prev.filter(c => c !== categoriaNome)
        : [...prev, categoriaNome]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategorias([]);
  };

  const handleViewDetails = (productId: string) => {
    // Salvar dados do veículo no localStorage para uso posterior na página do produto
    if (vehicleData) {
      localStorage.setItem('consultedVehicleData', JSON.stringify(vehicleData));
    }
    navigate(`/produto/${productId}`);
    onClose();
  };

  const handleContratarSolucao = async (product: Product) => {
    // Extrair dados do veículo usando o mapper para consistência
    const extractValue = (value: any) => {
      if (value && value !== 'N/A') return value;
      return '';
    };
    
    // Limpar RENAVAM - remover caracteres não numéricos
    const cleanRenavam = (value: string) => {
      if (!value) return '';
      return value.replace(/\D/g, '').slice(0, 11);
    };

    // Tentar extrair de múltiplas fontes - vehicleData vem do ConsultationModal
    const chassi = extractValue(vehicleData?.chassi) || extractValue(vehicleData?.Chassi);
    const renavam = cleanRenavam(extractValue(vehicleData?.renavam) || extractValue(vehicleData?.Renavam));
    const placa = extractValue(vehicleData?.placa) || extractValue(vehicleData?.Placa);
    const marca = extractValue(vehicleData?.marca) || extractValue(vehicleData?.Marca);
    const modelo = extractValue(vehicleData?.modelo) || extractValue(vehicleData?.Modelo);
    const ano = extractValue(vehicleData?.ano_modelo) || extractValue(vehicleData?.AnoModelo) || extractValue(vehicleData?.ano);
    const cor = extractValue(vehicleData?.cor) || extractValue(vehicleData?.Cor);
    const municipio = extractValue(vehicleData?.municipio) || extractValue(vehicleData?.Municipio);
    const tipo = extractValue(vehicleData?.tipo) || extractValue(vehicleData?.Tipo);
    const endpoint = extractValue(vehicleData?.endpoint);
    
    // Determinar estado: se endpoint base-sp, usar SP; senão, usar o uf do retorno
    let uf = extractValue(vehicleData?.uf) || extractValue(vehicleData?.UF);
    if (endpoint === 'base-sp') {
      uf = 'SP';
    }

    console.log('handleContratarSolucao - vehicleData:', vehicleData);
    console.log('Dados extraídos:', { chassi, renavam, placa, marca, modelo, ano, cor, uf, municipio, endpoint });

    // Salvar dados do veículo e produto no contexto
    setVehicleData({
      chassi,
      renavam,
      ano,
      placa,
      estado: uf,
      cidade: municipio,
      informacaoAdicional: `${marca} ${modelo}`.trim(),
      notaFiscal: null,
      marca,
      modelo,
      cor,
    });

    setProductData({
      id: product.id,
      name: product.nome,
      price: product.preco,
      description: product.descricao || '',
      image: product.foto_url || ''
    });

    // Navegar para a página de checkout
    navigate('/solicitacao/veiculo');
    onClose();
  };

  // Obter categorias únicas dos produtos carregados para mostrar nos filtros
  const availableCategories = useMemo(() => {
    const catSet = new Set<string>();
    products.forEach(p => {
      p.categorias?.forEach(cat => catSet.add(cat));
    });
    return Array.from(catSet).sort();
  }, [products]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-brand-yellow" />
            {productSource === 'related' ? 'Produtos Compatíveis' : 'Todos os Produtos'}
          </DialogTitle>
          {productSource === 'all' ? (
            <div className="space-y-2">
              <p className="text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 p-3 rounded-md">
                <strong>Atenção:</strong> Nenhum produto relacionado ao tipo <strong>{vehicleType || 'não identificado'}</strong> foi encontrado. 
                Exibindo todos os produtos disponíveis.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Encontramos {products.length} produto(s) compatível(is) com seu veículo tipo: <strong>{vehicleType}</strong>
            </p>
          )}
        </DialogHeader>

        {/* Filtros e Busca */}
        <div className="space-y-4 mt-4">
          {/* Campo de Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros por Categoria */}
          {availableCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(categoria => (
                <button
                  key={categoria}
                  onClick={() => toggleCategoria(categoria)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategorias.includes(categoria)
                      ? 'bg-brand-yellow text-black'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {categoria}
                </button>
              ))}
              {(selectedCategorias.length > 0 || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg text-muted-foreground">
              {searchTerm || selectedCategorias.length > 0 
                ? 'Nenhum produto encontrado com os filtros aplicados.'
                : 'Nenhum produto disponível no momento.'}
            </p>
            {(searchTerm || selectedCategorias.length > 0) && (
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card flex flex-col"
              >
                {product.foto_url && (
                  <img
                    src={product.foto_url}
                    alt={product.nome}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">{product.apelido || product.nome}</h3>
                  <p className="text-2xl font-bold text-brand-yellow mb-2">
                    R$ {product.preco.toFixed(2)}
                  </p>
                  {product.descricao && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {product.descricao}
                    </p>
                  )}
                  <div className="flex flex-col gap-2 mt-auto">
                    <Button
                      onClick={() => handleContratarSolucao(product)}
                      className="w-full bg-brand-yellow hover:bg-brand-yellow-dark text-black"
                    >
                      Contratar Solução
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(product.id)}
                      className="w-full"
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
