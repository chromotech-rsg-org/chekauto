import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProdutos, mockCategorias } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VehicleDataDisplay } from './VehicleDataDisplay';
import { criarOuAtualizarCliente, associarClienteConsulta } from '@/services/clienteService';
import { toast } from '@/hooks/use-toast';
import { ResultadoConsulta } from '@/services/veiculoCacheService';

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleData?: ResultadoConsulta | null;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  open,
  onOpenChange,
  vehicleData
}) => {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("todas");
  const [searchProduto, setSearchProduto] = useState("");
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setStep(1);
      setNome("");
      setWhatsapp("");
      setClienteId(null);
    }
  }, [open]);

  const filteredProdutos = mockProdutos.filter((produto) => {
    const matchesCategoria = filterCategoria === "todas" || produto.categoria === filterCategoria;
    const matchesSearch = produto.nomeFantasia.toLowerCase().includes(searchProduto.toLowerCase());
    return matchesCategoria && matchesSearch;
  });

  const handleConsultar = async () => {
    if (!nome || !whatsapp) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha seu nome e WhatsApp',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Criar ou atualizar cliente
      const resultado = await criarOuAtualizarCliente({
        nome,
        telefone: whatsapp,
        status: 'lead',
        primeira_consulta_id: vehicleData?.consultaId,
      });

      if (resultado) {
        setClienteId(resultado.id);
        
        // Associar cliente à consulta
        if (vehicleData?.consultaId) {
          await associarClienteConsulta(resultado.id, vehicleData.consultaId);
        }

        // Salvar dados no localStorage para usar no checkout
        localStorage.setItem('consultaData', JSON.stringify({
          clienteId: resultado.id,
          nome,
          whatsapp,
          vehicleData: vehicleData?.data,
          consultaId: vehicleData?.consultaId,
        }));

        setStep(2);
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao salvar seus dados. Tente novamente.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao consultar:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao processar sua solicitação',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectProduto = (produtoId: number) => {
    // Ir para checkout com produto selecionado
    navigate(`/solicitacao/veiculo?produto=${produtoId}`);
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${step === 1 ? 'max-w-2xl' : 'max-w-4xl'} bg-brand-yellow p-8 border-none rounded-2xl max-h-[90vh] overflow-y-auto`}>
        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-black text-xl font-bold text-center mb-4">
              Dados do Veículo Encontrados
            </h2>

            {/* Exibir dados do veículo */}
            {vehicleData && (
              <VehicleDataDisplay 
                dados={vehicleData.data}
                fromCache={vehicleData.fromCache}
                ultimaAtualizacao={vehicleData.ultimaAtualizacao}
                showFullDetails={false}
              />
            )}

            <div className="border-t border-black/20 pt-4 mt-4">
              <h3 className="text-black text-lg font-semibold mb-3 text-center">
                Complete seus dados para continuar
              </h3>
              
              <div className="space-y-3">
                <Input
                  placeholder="Seu Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="bg-white border-none h-12 text-black placeholder:text-gray-400 rounded-lg"
                />
                
                <Input
                  placeholder="WhatsApp (00) 00000-0000"
                  value={whatsapp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    let formatted = value;
                    if (value.length <= 11) {
                      formatted = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                      if (value.length <= 6) {
                        formatted = value.replace(/^(\d{2})(\d+)/, '($1) $2');
                      } else if (value.length <= 10) {
                        formatted = value.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
                      }
                    }
                    setWhatsapp(formatted);
                  }}
                  maxLength={15}
                  className="bg-white border-none h-12 text-black placeholder:text-gray-400 rounded-lg"
                />
              </div>
            </div>
            
            <button 
              onClick={handleConsultar}
              disabled={isSubmitting}
              className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processando...' : 'Consultar Agora'}
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
