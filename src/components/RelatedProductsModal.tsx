import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ArrowRight } from 'lucide-react';
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
}

interface RelatedProductsModalProps {
  open: boolean;
  onClose: () => void;
  vehicleType: string;
  vehicleData: any;
}

export const RelatedProductsModal = ({ 
  open, 
  onClose, 
  vehicleType,
  vehicleData 
}: RelatedProductsModalProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setVehicleData, setProductData } = useCheckout();

  useEffect(() => {
    if (open && vehicleType) {
      loadRelatedProducts();
    }
  }, [open, vehicleType]);

  const loadRelatedProducts = async () => {
    setLoading(true);
    try {
      // Extrair apenas o código do tipo (ex: "11 - SEMIRREBOQUE" -> "11")
      const tipoCode = vehicleType.split(' ')[0]?.trim();
      
      console.log('Buscando produtos para tipo:', tipoCode, 'vehicleType:', vehicleType);

      if (!tipoCode) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Buscar categorias que correspondem ao tipo do veículo
      const { data: categorias, error: catError } = await supabase
        .from('categorias')
        .select('id, codigo, nome')
        .eq('codigo', tipoCode);

      console.log('Categorias encontradas:', categorias);

      if (catError) throw catError;

      if (!categorias || categorias.length === 0) {
        console.log('Nenhuma categoria encontrada para tipo:', tipoCode);
        setProducts([]);
        setLoading(false);
        return;
      }

      const categoriaIds = categorias.map(c => c.id);

      // Buscar produtos através da tabela de junção produto_tipos
      const { data: produtoTipos, error: ptError } = await supabase
        .from('produto_tipos')
        .select('produto_id')
        .in('tipo_id', categoriaIds);

      if (ptError) throw ptError;

      if (!produtoTipos || produtoTipos.length === 0) {
        // Fallback: buscar por categoria_id direta
        const { data: produtosDiretos, error: prodError } = await supabase
          .from('produtos')
          .select('id, nome, apelido, preco, foto_url, descricao')
          .eq('ativo', true)
          .in('categoria_id', categoriaIds);

        if (prodError) throw prodError;
        setProducts(produtosDiretos || []);
        setLoading(false);
        return;
      }

      const produtoIds = [...new Set(produtoTipos.map(pt => pt.produto_id))];

      // Buscar produtos
      const { data: produtosData, error: prodError } = await supabase
        .from('produtos')
        .select('id, nome, apelido, preco, foto_url, descricao')
        .eq('ativo', true)
        .in('id', produtoIds);

      if (prodError) throw prodError;

      console.log('Produtos encontrados:', produtosData?.length);
      setProducts(produtosData || []);
    } catch (error) {
      console.error('Erro ao buscar produtos relacionados:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (productId: string) => {
    // Salvar dados do veículo no localStorage para uso posterior na página do produto
    if (vehicleData) {
      localStorage.setItem('consultedVehicleData', JSON.stringify(vehicleData));
    }
    navigate(`/produto/${productId}`);
    onClose();
  };

  const handleBuyProduct = async (product: Product) => {
    // Extrair dados do veículo usando o mapper para consistência
    const extractValue = (value: any) => {
      if (value && value !== 'N/A') return value;
      return '';
    };

    // Tentar extrair de múltiplas fontes
    const chassi = extractValue(vehicleData?.chassi) || extractValue(vehicleData?.Chassi);
    const renavam = extractValue(vehicleData?.renavam) || extractValue(vehicleData?.Renavam);
    const placa = extractValue(vehicleData?.placa) || extractValue(vehicleData?.Placa);
    const marca = extractValue(vehicleData?.marca) || extractValue(vehicleData?.Marca);
    const modelo = extractValue(vehicleData?.modelo) || extractValue(vehicleData?.Modelo);
    const ano = extractValue(vehicleData?.ano_modelo) || extractValue(vehicleData?.AnoModelo) || extractValue(vehicleData?.ano);
    const cor = extractValue(vehicleData?.cor) || extractValue(vehicleData?.Cor);
    const uf = extractValue(vehicleData?.uf) || extractValue(vehicleData?.UF);
    const municipio = extractValue(vehicleData?.municipio) || extractValue(vehicleData?.Municipio);

    // Salvar dados do veículo e produto no contexto
    setVehicleData({
      chassi,
      renavam,
      placa,
      marca,
      modelo,
      ano,
      cor,
      estado: uf,
      cidade: municipio,
      informacaoAdicional: '',
      notaFiscal: null
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-brand-yellow" />
            Produtos Compatíveis
          </DialogTitle>
          <p className="text-muted-foreground">
            Encontramos {products.length} produto(s) compatível(is) com seu veículo tipo: <strong>{vehicleType}</strong>
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-muted-foreground">
              Nenhum produto compatível encontrado para este tipo de veículo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-card"
              >
                {product.foto_url && (
                  <img
                    src={product.foto_url}
                    alt={product.nome}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="font-bold text-lg mb-1">{product.apelido || product.nome}</h3>
                <p className="text-2xl font-bold text-brand-yellow mb-2">
                  R$ {product.preco.toFixed(2)}
                </p>
                {product.descricao && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.descricao}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(product.id)}
                    className="flex-1"
                  >
                    Ver Detalhes
                  </Button>
                  <Button
                    onClick={() => handleBuyProduct(product)}
                    className="flex-1 bg-brand-yellow hover:bg-brand-yellow-dark text-black"
                  >
                    Comprar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};