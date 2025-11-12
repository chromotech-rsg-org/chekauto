import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProdutos, mockCategorias } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  renave?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  open,
  onOpenChange,
  renave = "18283215412"
}) => {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("todas");
  const [searchProduto, setSearchProduto] = useState("");
  const navigate = useNavigate();

  const filteredProdutos = mockProdutos.filter((produto) => {
    const matchesCategoria = filterCategoria === "todas" || produto.categoria === filterCategoria;
    const matchesSearch = produto.nomeFantasia.toLowerCase().includes(searchProduto.toLowerCase());
    return matchesCategoria && matchesSearch;
  });

  const handleConsultar = () => {
    if (!nome || !whatsapp) {
      alert("Por favor, preencha seu nome e WhatsApp");
      return;
    }
    setStep(2);
  };

  const handleSelectProduto = (produtoId: number) => {
    // Salvar dados da consulta (localStorage ou context)
    localStorage.setItem('consultaData', JSON.stringify({ nome, whatsapp, renave }));
    
    // Ir para checkout com produto selecionado
    navigate(`/solicitacao/veiculo?produto=${produtoId}`);
    onOpenChange(false);
    
    // Reset
    setStep(1);
    setNome("");
    setWhatsapp("");
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        setStep(1);
        setNome("");
        setWhatsapp("");
      }
    }}>
      <DialogContent className={`${step === 1 ? 'max-w-sm' : 'max-w-4xl'} bg-brand-yellow p-8 border-none rounded-2xl max-h-[90vh] overflow-y-auto`}>
        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-black text-lg font-bold text-center">
              RENAVE: {renave}
            </h2>
            
            <Input
              placeholder="Seu Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-white border-none h-12 text-black placeholder:text-gray-400 rounded-lg"
            />
            
            <Input
              placeholder="WhatsApp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="bg-white border-none h-12 text-black placeholder:text-gray-400 rounded-lg"
            />
            
            <button 
              onClick={handleConsultar}
              className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Consultar Agora
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-black text-2xl font-bold">
                Escolha seu Produto
              </h2>
              <button 
                onClick={handleBack}
                className="text-black hover:underline font-medium"
              >
                ← Voltar
              </button>
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar produto..."
                  value={searchProduto}
                  onChange={(e) => setSearchProduto(e.target.value)}
                  className="pl-9 bg-white border-none h-12 text-black"
                />
              </div>
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger className="w-[200px] bg-white border-none h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {mockCategorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.nome}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProdutos.map((produto) => (
                <Card key={produto.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectProduto(produto.id)}>
                  <CardContent className="p-4 space-y-3">
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={produto.foto} 
                        alt={produto.nomeFantasia}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">{produto.categoria}</Badge>
                      <h3 className="font-bold text-lg">{produto.nomeFantasia}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{produto.descricao}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-2xl font-bold text-brand-yellow">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                      <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm font-semibold">
                        Selecionar
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProdutos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-black text-lg">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
