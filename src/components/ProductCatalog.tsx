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
  const [tipoFiltro, setTipoFiltro] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    checkVehicleConsultation();
  }, []);

  const checkVehicleConsultation = () => {
    // Verificar se há dados de consulta de veículo salvos
    const consultaData = localStorage.getItem('consultaData');
    if (consultaData) {
      try {
        const data = JSON.parse(consultaData);
        // Se veio de consulta, filtrar por tipo de veículo
        if (data.vehicleData?.tipo) {
          setTipoFiltro(data.vehicleData.tipo);
        }
      } catch (error) {
        console.error('Erro ao ler dados da consulta:', error);
      }
    }
  };

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

  // Filtrar produtos por busca e tipo de veículo (se houver)
  const produtosFiltrados = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.apelido?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Se houver filtro de tipo de veículo da consulta
    if (tipoFiltro) {
      const produtoTipos = produto.produto_tipos?.map((pt: any) => {
        const tipo = pt.categorias;
        return tipo ? `${tipo.codigo} - ${tipo.nome}` : null;
      }).filter(Boolean);

      return produtoTipos?.includes(tipoFiltro);
    }

    return true;
  });

  // Agrupar produtos por tipo
  const produtosAgrupados = tipos.map(tipo => {
    const tipoFormatado = tipo.codigo ? `${tipo.codigo} - ${tipo.nome}` : tipo.nome;
    const produtosDoTipo = produtosFiltrados.filter(produto => 
      produto.produto_tipos?.some((pt: any) => pt.tipo_id === tipo.id)
    );

    return {
      tipo,
      tipoFormatado,
      produtos: produtosDoTipo,
    };
  }).filter(grupo => grupo.produtos.length > 0);

  // Se não houver produtos agrupados mas houver produtos filtrados, mostrar todos
  const produtosSemTipo = produtosFiltrados.filter(produto => 
    !produto.produto_tipos || produto.produto_tipos.length === 0
  );

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
        <div className="flex items-center justify-between mb-8">
          <img src={logoBlack} alt="CHEKAUTO Logo" className="h-[40px] object-contain" />
          
          {tipoFiltro && (
            <div className="text-sm">
              <span className="text-gray-600">Filtrando por: </span>
              <span className="font-semibold text-brand-yellow">{tipoFiltro}</span>
              <button 
                onClick={() => {
                  setTipoFiltro(null);
                  localStorage.removeItem('consultaData');
                }}
                className="ml-2 text-gray-500 hover:text-brand-yellow underline"
              >
                Limpar filtro
              </button>
            </div>
          )}
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
              {tipoFiltro 
                ? 'Nenhum produto encontrado para este tipo de veículo' 
                : 'Nenhum produto encontrado'}
            </p>
            {tipoFiltro && (
              <button 
                onClick={() => {
                  setTipoFiltro(null);
                  localStorage.removeItem('consultaData');
                }}
                className="mt-4 text-brand-yellow hover:underline"
              >
                Ver todos os produtos
              </button>
            )}
          </div>
        )}

        {/* Produtos sem tipo definido */}
        {produtosSemTipo.length > 0 && (
          <div className="mt-[73px] max-md:mt-10">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Outros Produtos
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {produtosSemTipo.map((produto) => (
                <div key={produto.id} className="flex flex-col">
                  <div className="border flex flex-row items-center justify-between px-5 py-4 rounded-[8px_8px_0px_0px] border-[rgba(204,204,204,1)] border-solid text-sm text-black font-medium">
                    <span>Produto</span>
                    <button 
                      onClick={() => navigate(`/produto/${produto.id}`)} 
                      className="text-brand-yellow hover:text-brand-yellow-dark transition-colors"
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
              ))}
            </div>
          </div>
        )}

        {produtosAgrupados.map((grupo, sectionIndex) => (
          <div key={grupo.tipo.id} className="mt-[73px] max-md:mt-10">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {grupo.tipoFormatado}
              </h3>
              {grupo.tipo.descricao && (
                <p className="text-sm text-gray-500 mt-1">{grupo.tipo.descricao}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {grupo.produtos.map((produto) => (
                <div key={produto.id} className="flex flex-col">
                  <div className="border flex flex-row items-center justify-between px-5 py-4 rounded-[8px_8px_0px_0px] border-[rgba(204,204,204,1)] border-solid text-sm text-black font-medium">
                    <span>{grupo.tipoFormatado}</span>
                    <button 
                      onClick={() => navigate(`/produto/${produto.id}`)} 
                      className="text-brand-yellow hover:text-brand-yellow-dark transition-colors"
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};