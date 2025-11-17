import { useState } from 'react';
import { buscarOuConsultarVeiculo, ResultadoConsulta } from '@/services/veiculoCacheService';
import { toast } from '@/hooks/use-toast';

export type TipoConsulta = 'chassi' | 'placa' | 'renavam';
export type EndpointType = 'base-sp' | 'bin';

interface UseVehicleConsultationResult {
  consultar: (
    tipo: TipoConsulta,
    valor: string,
    endpoint?: EndpointType,
    uf?: string
  ) => Promise<ResultadoConsulta | null>;
  loading: boolean;
  resultado: ResultadoConsulta | null;
  error: string | null;
  limpar: () => void;
}

/**
 * Hook para gerenciar consultas de veículos com cache inteligente
 */
export const useVehicleConsultation = (): UseVehicleConsultationResult => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ResultadoConsulta | null>(null);
  const [error, setError] = useState<string | null>(null);

  const consultar = async (
    tipo: TipoConsulta,
    valor: string,
    endpoint: EndpointType = 'base-sp',
    uf?: string
  ): Promise<ResultadoConsulta | null> => {
    // Validação básica
    if (!valor || valor.trim() === '') {
      const mensagem = 'Por favor, informe um valor para consulta';
      setError(mensagem);
      toast({
        title: 'Erro',
        description: mensagem,
        variant: 'destructive',
      });
      return null;
    }

    // Validações específicas por tipo
    const valorLimpo = valor.trim();
    
    if (tipo === 'chassi' && valorLimpo.length < 17) {
      const mensagem = 'Chassi deve ter 17 caracteres';
      setError(mensagem);
      toast({
        title: 'Erro',
        description: mensagem,
        variant: 'destructive',
      });
      return null;
    }

    if (tipo === 'placa' && valorLimpo.length < 7) {
      const mensagem = 'Placa inválida';
      setError(mensagem);
      toast({
        title: 'Erro',
        description: mensagem,
        variant: 'destructive',
      });
      return null;
    }

    if (tipo === 'renavam' && valorLimpo.length < 9) {
      const mensagem = 'Renavam deve ter no mínimo 9 dígitos';
      setError(mensagem);
      toast({
        title: 'Erro',
        description: mensagem,
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await buscarOuConsultarVeiculo(tipo, valorLimpo, endpoint, uf);
      
      setResultado(result);
      
      // Toast de sucesso
      if (result.fromCache) {
        toast({
          title: 'Dados encontrados',
          description: `Última atualização: ${new Date(
            result.ultimaAtualizacao!
          ).toLocaleDateString('pt-BR')}`,
        });
      } else {
        toast({
          title: 'Consulta realizada',
          description: 'Dados atualizados com sucesso',
        });
      }

      return result;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao consultar veículo';
      setError(mensagem);
      
      toast({
        title: 'Erro na consulta',
        description: mensagem,
        variant: 'destructive',
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  const limpar = () => {
    setResultado(null);
    setError(null);
  };

  return {
    consultar,
    loading,
    resultado,
    error,
    limpar,
  };
};
