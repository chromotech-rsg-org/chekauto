import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { useNavigate } from 'react-router-dom';
import logoBlack from '@/assets/logo-chekauto-black.png';
import { Input } from './ui/input';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const ProductCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [produtos, setProdutos] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriasFiltro, setCategoriasFiltro] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar tipos
      const { data: tiposData, error: tiposError } = await supabase
        .from('categorias')
        .select('*')
        .order('codigo');

      if (tiposError) throw tiposError;
      setTipos(tiposData || []);

      // Carregar produtos ativos com seus tipos
      const { data: produtosData, error: produtosError } = await supabase
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
        .eq('ativo', true)
        .order('criado_em', { ascending: false });

      if (produtosError) throw produtosError;
      setProdutos(produtosData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar produtos únicos por ID e aplicar filtros
  const produtosUnicos = produtos.reduce((acc, produto) => {
    if (!acc.find((p: any) => p.id === produto.id)) {
      acc.push(produto);
    }
    return acc;
  }, [] as any[]);

  const produtosFiltrados = produtosUnicos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.apelido?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Se houver filtro de categorias
    if (categoriasFiltro.length > 0) {
      const produtoCategorias = produto.produto_tipos?.map((pt: any) => 
        pt.categorias?.nome
      ).filter(Boolean);

      return produtoCategorias?.some((cat: string) => categoriasFiltro.includes(cat));
    }

    return true;
  });

  const toggleCategoriaFiltro = (nomeCategoria: string) => {
    setCategoriasFiltro(prev => 
      prev.includes(nomeCategoria) 
        ? prev.filter(c => c !== nomeCategoria)
        : [...prev, nomeCategoria]
    );
  };

  const limparFiltros = () => {
    setCategoriasFiltro([]);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <section id="produtos" className="bg-[rgba(233,233,233,1)] flex w-full flex-col items-center pb-[95px] px-20 max-md:max-w-full max-md:px-5">
        <div className="bg-white z-10 flex mt-[-200px] w-full max-w-[1274px] flex-col items-center justify-center pt-[94px] pb-[166px] px-[71px] rounded-[20px_20px_0px_0px] max-md:max-w-full max-md:pb-[100px] max-md:px-5">
          <Loader2 className="w-12 h-12 animate-spin text-brand-yellow" />
          <p className="mt-4 text-gray-500">Carregando produtos...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="bg-[rgba(233,233,233,1)] flex w-full flex-col items-center pb-[95px] px-20 max-md:max-w-full max-md:px-5">
      <div className="bg-white z-10 flex mt-[-200px] w-full max-w-[1274px] flex-col items-stretch pt-[94px] pb-[166px] px-[71px] rounded-[20px_20px_0px_0px] max-md:max-w-full max-md:pb-[100px] max-md:px-5">
        <div className="flex flex-col mb-8">
          <img src={logoBlack} alt="CHEKAUTO Logo" className="h-[40px] object-contain mb-6" />
          
          {/* Filtros por categoria */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tipos.map(tipo => (
              <button
                key={tipo.id}
                onClick={() => toggleCategoriaFiltro(tipo.nome)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoriasFiltro.includes(tipo.nome)
                    ? 'bg-brand-yellow text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tipo.nome}
              </button>
            ))}
            {categoriasFiltro.length > 0 && (
              <button
                onClick={limparFiltros}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 relative max-w-md mx-auto w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white border-gray-300"
          />
        </div>

        {produtosFiltrados.length === 0 && (
          <div className="text-center py-12 mt-8">
            <p className="text-gray-500 text-lg">
              Nenhum produto encontrado
            </p>
            {(categoriasFiltro.length > 0 || searchTerm) && (
              <button 
                onClick={limparFiltros}
                className="mt-4 text-brand-yellow hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}

        {/* Grid de produtos únicos */}
        {produtosFiltrados.length > 0 && (
          <div className="mt-[73px] max-md:mt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {produtosFiltrados.map((produto) => {
                const categorias = produto.produto_tipos?.map((pt: any) => pt.categorias?.nome).filter(Boolean) || [];
                const categoriasTexto = categorias.length > 0 ? categorias.join(', ') : 'Produto';
                
                return (
                  <div key={produto.id} className="flex flex-col">
                    <div className="border flex flex-row items-center justify-between px-5 py-4 rounded-[8px_8px_0px_0px] border-[rgba(204,204,204,1)] border-solid text-sm text-black font-medium">
                      <span className="truncate">{categoriasTexto}</span>
                      <button 
                        onClick={() => navigate(`/produto/${produto.id}`)} 
                        className="text-brand-yellow hover:text-brand-yellow-dark transition-colors whitespace-nowrap ml-2"
                      >
                        Saiba mais
                      </button>
                    </div>
                    <ProductCard 
                      id={produto.id} 
                      title={produto.apelido || produto.nome} 
                      image={produto.foto_url || "https://via.placeholder.com/400x300?text=Sem+Imagem"} 
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};