import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { VehicleDataDisplay } from './VehicleDataDisplay';
import { criarOuAtualizarCliente, associarClienteConsulta } from '@/services/clienteService';
import { toast } from '@/hooks/use-toast';
import { ResultadoConsulta } from '@/services/veiculoCacheService';
import { useCheckout } from '@/contexts/CheckoutContext';

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
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setVehicleData, setCustomerData } = useCheckout();

  useEffect(() => {
    if (!open) {
      setNome("");
      setCpf("");
      setWhatsapp("");
    }
  }, [open]);

  const handleConsultar = async () => {
    if (!nome || !cpf || !whatsapp) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }

    // Validar CPF (apenas números e tamanho)
    const cpfNumeros = cpf.replace(/\D/g, '');
    if (cpfNumeros.length !== 11) {
      toast({
        title: 'Erro',
        description: 'CPF deve ter 11 dígitos',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Criar ou atualizar cliente
      const resultado = await criarOuAtualizarCliente({
        nome,
        cpf_cnpj: cpfNumeros,
        telefone: whatsapp,
        status: 'lead',
        primeira_consulta_id: vehicleData?.consultaId,
      });

      if (resultado) {
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

        // Salvar dados do veículo no CheckoutContext
        if (vehicleData?.data) {
          const data = vehicleData.data;
          setVehicleData({
            chassi: data.identificacao?.chassi || '',
            renavam: data.identificacao?.renavam || '',
            ano: data.especificacoes?.anoModelo || '',
            placa: data.identificacao?.placa || '',
            estado: '',
            cidade: '',
            informacaoAdicional: `${data.especificacoes?.marca || ''} ${data.especificacoes?.modelo || ''}`.trim(),
            notaFiscal: null,
          });
        }

        // Salvar dados básicos do cliente no CheckoutContext
        setCustomerData({
          nomeCompleto: nome,
          cpfCnpj: cpf,
          cep: '',
          rua: '',
          numero: '',
          bairro: '',
          complemento: '',
          email: '',
          telefone: whatsapp,
        });

        toast({
          title: 'Sucesso!',
          description: 'Dados salvos. Escolha um produto para continuar.',
        });

        // Fechar modal e navegar para catálogo de produtos
        onOpenChange(false);
        navigate('/#produtos');
        
        // Scroll suave para a seção de produtos após um pequeno delay
        setTimeout(() => {
          const produtosSection = document.getElementById('produtos');
          if (produtosSection) {
            produtosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-brand-yellow p-8 border-none rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-black text-xl font-bold text-center">
            Dados do Veículo Encontrados
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">

            {/* Exibir dados do veículo */}
            {vehicleData && (
              <VehicleDataDisplay 
                dados={vehicleData.data}
                fromCache={vehicleData.fromCache}
                ultimaAtualizacao={vehicleData.ultimaAtualizacao}
                showFullDetails={false}
                logConsulta={vehicleData.logConsulta}
              />
            )}

            <div className="border-t border-black/20 pt-4 mt-4">
              <h3 className="text-black text-lg font-semibold mb-3 text-center">
                Complete seus dados para continuar
              </h3>
              
              <div className="space-y-3">
                <Input
                  placeholder="Seu Nome Completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="bg-white border-none h-12 text-black placeholder:text-gray-400 rounded-lg"
                />
                
                <Input
                  placeholder="CPF (000.000.000-00)"
                  value={cpf}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    let formatted = value;
                    if (value.length <= 11) {
                      if (value.length <= 3) {
                        formatted = value;
                      } else if (value.length <= 6) {
                        formatted = value.replace(/^(\d{3})(\d+)/, '$1.$2');
                      } else if (value.length <= 9) {
                        formatted = value.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
                      } else {
                        formatted = value.replace(/^(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
                      }
                    }
                    setCpf(formatted);
                  }}
                  maxLength={14}
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
      </DialogContent>
    </Dialog>
  );
};
