import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Footer } from '@/components/Footer';
import logoYellow from '@/assets/logo-chekauto-yellow-black.png';
import truckBlue from '@/assets/truck-blue-sunset.png';
export default function ProductDetail() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const produto = {
    nome: 'CARROCERIA SOBRE CHASSI TANQUE',
    categoria: 'Tanques',
    descricao: 'Implemento especializado para transporte seguro de líquidos, desenvolvido com materiais de alta resistência e seguindo rigorosas normas de segurança. Ideal para transporte de combustíveis, água, produtos químicos e outros líquidos.',
    preco: 'R$ 1.950,00',
    imagens: ['https://via.placeholder.com/600x400?text=Imagem+Principal', 'https://via.placeholder.com/200x150?text=Thumb+1', 'https://via.placeholder.com/200x150?text=Thumb+2', 'https://via.placeholder.com/200x150?text=Thumb+3']
  };
  const caracteristicas = [{
    titulo: 'Capacidade',
    valor: '15.000 litros'
  }, {
    titulo: 'Material',
    valor: 'Aço inoxidável AISI 304'
  }, {
    titulo: 'Espessura',
    valor: '4,76mm'
  }, {
    titulo: 'Compartimentos',
    valor: '4 compartimentos'
  }, {
    titulo: 'Sistema de Descarga',
    valor: 'Bomba centrífuga 3"'
  }, {
    titulo: 'Válvulas',
    valor: 'Válvulas de fundo API'
  }, {
    titulo: 'Certificação',
    valor: 'INMETRO e ANTT'
  }, {
    titulo: 'Garantia',
    valor: '12 meses'
  }, {
    titulo: 'Instalação',
    valor: 'Incluída'
  }];
  return <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 px-6">
        <img src={truckBlue} alt="Hero background" className="absolute h-full w-full object-cover inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
        <div className="relative max-w-7xl mx-auto">
          <nav className="flex items-center gap-8 mb-12">
            <img src={logoYellow} alt="CHEKAUTO" className="h-8" />
            <div className="flex gap-8 text-sm font-semibold">
              <a href="/#about" className="hover:text-chekauto-yellow transition-colors">A CHEKAUTO</a>
              <a href="/#consultation" className="hover:text-chekauto-yellow transition-colors">CONSULTA</a>
              <a href="/#implementations" className="hover:text-chekauto-yellow transition-colors">IMPLEMENTOS</a>
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
            <div className="bg-gray-100 rounded-lg mb-4 aspect-[4/3] flex items-center justify-center">
              <p className="text-gray-400">Imagem Principal do Produto</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-chekauto-yellow transition-all">
                  <p className="text-xs text-gray-400">Thumb {i}</p>
                </div>)}
            </div>
          </div>

          {/* Informações do Produto */}
          <div>
            <img src={logoYellow} alt="CHEKAUTO" className="h-6 mb-4" />
            <h2 className="text-3xl font-bold text-black mb-2">{produto.nome}</h2>
            <p className="text-sm text-gray-500 mb-4">{produto.categoria}</p>
            <p className="text-gray-700 mb-6">{produto.descricao}</p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-2xl font-bold text-black mb-1">{produto.preco}/mês</p>
              <p className="text-sm text-gray-500">ou consulte valor para compra</p>
            </div>

            <Button onClick={() => navigate('/solicitacao/veiculo')} className="w-full bg-chekauto-yellow text-black hover:bg-chekauto-yellow/90 h-14 text-lg font-bold rounded-full mb-6 bg-amber-500 hover:bg-amber-400">
              CONTRATAR SOLUÇÃO
            </Button>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-semibold text-black mb-3">Consulta rápida por chassi:</p>
              <div className="flex gap-3">
                <Input placeholder="Digite o número do chassi" className="flex-1" />
                <Button className="bg-chekauto-yellow text-black hover:bg-chekauto-yellow/90 font-semibold px-8">
                  Consultar
                </Button>
              </div>
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
                DÚVIDAS FREQUENTES
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="caracteristicas" className="mt-8">
              <div className="bg-[#2c2c2c] rounded-lg p-12">
                <h3 className="text-brand-yellow text-xl font-bold mb-8 text-amber-400">CARACTERÍSTICAS PRINCIPAIS</h3>
                <div className="grid md:grid-cols-3 gap-x-12 gap-y-8">
                  {caracteristicas.map((item, index) => <div key={index}>
                      <p className="text-white font-semibold text-sm mb-2">{item.titulo}:</p>
                      <p className="text-white/80 text-base">{item.valor}</p>
                    </div>)}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="aplicacoes" className="mt-8">
              <div className="bg-gray-50 rounded-lg p-8">
                <p className="text-gray-700">Informações sobre aplicações do produto...</p>
              </div>
            </TabsContent>
            
            <TabsContent value="duvidas" className="mt-8">
              <div className="bg-gray-50 rounded-lg p-8">
                <p className="text-gray-700">Dúvidas frequentes sobre o produto...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Parceiros Recomendados */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-black mb-8">Parceiros Recomendados para você</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                <p className="text-gray-400">Parceiro {i}</p>
              </div>)}
          </div>
        </div>
      </section>

      <Footer />
    </div>;
}