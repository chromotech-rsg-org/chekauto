import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Footer } from '@/components/Footer';
import logoYellow from '@/assets/logo-chekauto-yellow-black.png';
import truckBlue from '@/assets/truck-blue-sunset.png';
import { useVehicleConsultation } from '@/hooks/useVehicleConsultation';
import { VehicleDataDisplay } from '@/components/VehicleDataDisplay';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCheckout } from '@/contexts/CheckoutContext';

export default function ProductDetail() {
  const [chassiInput, setChassiInput] = useState('');
  const [vehicleType, setVehicleType] = useState<'novo' | 'usado'>('usado');
  const [originState, setOriginState] = useState<'SP' | 'outros'>('SP');
  const [showResults, setShowResults] = useState(false);
  const [produto, setProduto] = useState<any>(null);
  const [galeria, setGaleria] = useState<any[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<any[]>([]);
  const [aplicacoes, setAplicacoes] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { consultar, loading: consultaLoading, resultado } = useVehicleConsultation();
  const { setVehicleData, setProductData } = useCheckout();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      loadProduto();
    }
  }, [id]);

  const loadProduto = async () => {
    try {
      setLoading(true);

      // Carregar produto
      const { data: produtoData, error: produtoError } = await supabase
        .from('produtos')
        .select(`
          *,
          produto_tipos (
            categorias:tipo_id (
              id,
              codigo,
              nome
            )
          )
        `)
        .eq('id', id)
        .single();

      if (produtoError) throw produtoError;
      setProduto(produtoData);

      // Carregar galeria
      const { data: galeriaData } = await supabase
        .from('produto_galeria')
        .select('*')
        .eq('produto_id', id)
        .order('ordem');
      setGaleria(galeriaData || []);

      // Carregar características
      const { data: caracData } = await supabase
        .from('produto_caracteristicas')
        .select('*')
        .eq('produto_id', id)
        .order('ordem');
      setCaracteristicas(caracData || []);

      // Carregar aplicações
      const { data: aplicData } = await supabase
        .from('produto_aplicacoes')
        .select('*')
        .eq('produto_id', id)
        .order('ordem');
      setAplicacoes(aplicData || []);

      // Carregar FAQ
      const { data: faqData } = await supabase
        .from('produto_faq')
        .select('*')
        .eq('produto_id', id)
        .order('ordem');
      setFaqs(faqData || []);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      toast.error('Erro ao carregar produto');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleConsultaRapida = async () => {
    if (!chassiInput || chassiInput.trim().length < 3) {
      return;
    }

    const valorLimpo = chassiInput.trim().toUpperCase();
    let tipo: 'chassi' | 'placa' | 'renavam' = 'chassi';
    
    if (valorLimpo.length === 17) {
      tipo = 'chassi';
    } else if (valorLimpo.length >= 9 && valorLimpo.length <= 11 && /^\d+$/.test(valorLimpo)) {
      tipo = 'renavam';
    } else if (valorLimpo.length === 7) {
      tipo = 'placa';
    }

    let endpoint: 'base-sp' | 'bin' = 'bin';
    let uf = originState === 'SP' ? 'SP' : '';
    
    if (vehicleType === 'usado' && originState === 'SP') {
      endpoint = 'base-sp';
    } else {
      endpoint = 'bin';
    }

    const result = await consultar(tipo, valorLimpo, endpoint, uf);
    if (result) {
      setShowResults(true);
    }
  };

  const handleContratarComVeiculo = () => {
    if (resultado && produto) {
      // Salvar dados do veículo no CheckoutContext
      setVehicleData({
        chassi: resultado.data.chassi || '',
        renavam: resultado.data.renavam || '',
        placa: resultado.data.placa || '',
        ano: resultado.data.anoModelo || resultado.data.ano || '',
        marca: resultado.data.marca || '',
        modelo: resultado.data.modelo || '',
        cor: resultado.data.cor || '',
      });

      // Salvar dados do produto
      setProductData({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        foto_url: produto.foto_url,
      });

      navigate('/solicitacao/veiculo');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-brand-yellow" />
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Produto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 px-6">
        <img src={truckBlue} alt="Hero background" className="absolute h-full w-full object-cover inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
        <div className="relative max-w-7xl mx-auto">
          <nav className="flex items-center gap-8 mb-12">
            <img src={logoYellow} alt="CHEKAUTO" className="h-8 cursor-pointer" onClick={() => navigate('/')} />
            <div className="flex gap-8 text-sm font-semibold">
              <a href="/#about" className="hover:text-chekauto-yellow transition-colors">A CHEKAUTO</a>
              <a href="/#consultation" className="hover:text-chekauto-yellow transition-colors">CONSULTA</a>
              <a href="/#produtos" className="hover:text-chekauto-yellow transition-colors">IMPLEMENTOS</a>
              <a href="/#benefits" className="hover:text-chekauto-yellow transition-colors">DIFERENCIAIS</a>
            </div>
          </nav>
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-chekauto-yellow text-amber-400">Resolva seu RENAVE/BIN com tranquilidade.</span>
            <br />
            Consultoria especializada em implementos.
          </h1>
        </div>
      </section>

      {/* Divider */}
      <div className="h-3 bg-chekauto-yellow w-full" />

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div>
            {produto.foto_url && (
              <div className="bg-gray-100 rounded-lg mb-4 aspect-[4/3] overflow-hidden">
                <img 
                  src={produto.foto_url} 
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {galeria.length > 0 && (
              <Carousel className="w-full">
                <CarouselContent>
                  {galeria.slice(0, 3).map((foto, idx) => (
                    <CarouselItem key={idx} className="basis-1/3">
                      <div className="bg-gray-100 rounded-lg aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-chekauto-yellow transition-all">
                        <img 
                          src={foto.foto_url} 
                          alt={`Galeria ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {galeria.length > 3 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            )}
          </div>

          {/* Informações do Produto */}
          <div>
            <img src={logoYellow} alt="CHEKAUTO" className="h-6 mb-4" />
            <h2 className="text-3xl font-bold text-black mb-2">
              {produto.nome}
              {produto.apelido && (
                <span className="text-xl text-gray-500 ml-2 font-normal">({produto.apelido})</span>
              )}
            </h2>
            
            {produto.produto_tipos?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {produto.produto_tipos.map((pt: any) => {
                  const tipo = pt.categorias;
                  if (!tipo) return null;
                  return (
                    <span key={tipo.id} className="text-sm bg-gray-100 px-3 py-1 rounded">
                      {tipo.codigo} - {tipo.nome}
                    </span>
                  );
                })}
              </div>
            )}
            
            <p className="text-gray-700 mb-6">{produto.descricao}</p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-2xl font-bold text-black mb-1">
                R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-500">Valor do serviço</p>
            </div>

            <Button 
              onClick={() => {
                if (produto) {
                  setProductData({
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    foto_url: produto.foto_url,
                  });
                }
                navigate('/solicitacao/veiculo');
              }} 
              className="w-full bg-chekauto-yellow text-black hover:bg-chekauto-yellow/90 h-14 text-lg font-bold rounded-full mb-6 bg-amber-500 hover:bg-amber-400"
            >
              CONTRATAR SOLUÇÃO
            </Button>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-semibold text-black mb-3">Consulta rápida de veículo:</p>
              
              {/* Tipo de veículo e Estado */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="productVehicleType"
                    checked={vehicleType === 'novo'} 
                    onChange={() => setVehicleType('novo')} 
                    className="w-4 h-4 accent-chekauto-yellow" 
                  />
                  <span className="text-sm font-medium">Novo (0KM)</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="productVehicleType"
                    checked={vehicleType === 'usado'} 
                    onChange={() => setVehicleType('usado')} 
                    className="w-4 h-4 accent-chekauto-yellow" 
                  />
                  <span className="text-sm font-medium">Usado</span>
                </label>
                
                <select 
                  value={originState} 
                  onChange={(e) => setOriginState(e.target.value as 'SP' | 'outros')} 
                  className="bg-white border border-gray-300 text-black px-3 py-1.5 rounded text-sm"
                >
                  <option value="SP">SP</option>
                  <option value="outros">Outros Estados</option>
                </select>
              </div>
              
              {/* Input e botão de consulta */}
              <div className="flex gap-3">
                <Input 
                  placeholder="Digite chassi, placa ou renavam" 
                  className="flex-1"
                  value={chassiInput}
                  onChange={(e) => setChassiInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleConsultaRapida()}
                />
                <Button 
                  onClick={handleConsultaRapida}
                  disabled={consultaLoading}
                  className="bg-chekauto-yellow text-black hover:bg-chekauto-yellow/90 font-semibold px-8"
                >
                  {consultaLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Consultando
                    </>
                  ) : (
                    'Consultar'
                  )}
                </Button>
              </div>

              {/* Resultados da consulta */}
              {showResults && resultado && (
                <div className="mt-6 space-y-4">
                  <VehicleDataDisplay 
                    dados={resultado.data}
                    fromCache={resultado.fromCache}
                    ultimaAtualizacao={resultado.ultimaAtualizacao}
                    showFullDetails={true}
                  />
                  
                  <Button 
                    onClick={handleContratarComVeiculo}
                    className="w-full bg-chekauto-yellow text-black hover:bg-chekauto-yellow/90 h-12 text-lg font-bold"
                  >
                    CONTRATAR COM ESTE VEÍCULO
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs de Informações */}
        <div className="mt-16">
          <Tabs defaultValue="caracteristicas" className="w-full">
            <TabsList className="w-full justify-start border-b bg-transparent h-auto p-0 space-x-8">
              <TabsTrigger value="caracteristicas" className="data-[state=active]:border-b-2 data-[state=active]:border-chekauto-yellow rounded-none pb-3 px-0 bg-transparent">
                CARACTERÍSTICAS
              </TabsTrigger>
              <TabsTrigger value="aplicacoes" className="data-[state=active]:border-b-2 data-[state=active]:border-chekauto-yellow rounded-none pb-3 px-0 bg-transparent">
                APLICAÇÕES
              </TabsTrigger>
              <TabsTrigger value="duvidas" className="data-[state=active]:border-b-2 data-[state=active]:border-chekauto-yellow rounded-none pb-3 px-0 bg-transparent">
                PERGUNTAS FREQUENTES
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="caracteristicas" className="mt-8">
              {caracteristicas.length > 0 ? (
                <div className="bg-[#2c2c2c] rounded-lg p-12">
                  <h3 className="text-brand-yellow text-xl font-bold mb-8 text-amber-400">CARACTERÍSTICAS PRINCIPAIS</h3>
                  <div className="grid md:grid-cols-3 gap-x-12 gap-y-8">
                    {caracteristicas.map((item, index) => (
                      <div key={index}>
                        <p className="text-white font-semibold text-sm mb-2">{item.titulo}:</p>
                        <p className="text-white/80 text-base">{item.descricao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  Nenhuma característica cadastrada para este produto
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="aplicacoes" className="mt-8">
              {aplicacoes.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 space-y-6">
                  {aplicacoes.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-lg mb-2">{item.titulo}</h4>
                      <p className="text-gray-700">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  Nenhuma aplicação cadastrada para este produto
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="duvidas" className="mt-8">
              {faqs.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 space-y-6">
                  {faqs.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-lg mb-2">{item.pergunta}</h4>
                      <p className="text-gray-700">{item.resposta}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  Nenhuma pergunta frequente cadastrada para este produto
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}