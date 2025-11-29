import { useState } from 'react';
import { buscarOuConsultarVeiculo, ResultadoConsulta } from '@/services/veiculoCacheService';

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
  showErrorDialog: boolean;
  closeErrorDialog: () => void;
  limpar: () => void;
}

export const useVehicleConsultation = (): UseVehicleConsultationResult => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ResultadoConsulta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const consultar = async (
    tipo: TipoConsulta,
    valor: string,
    endpoint: EndpointType = 'base-sp',
    uf?: string
  ): Promise<ResultadoConsulta | null> => {
    if (!valor || valor.trim() === '') {
      const mensagem = 'Por favor, informe um valor para consulta';
      setError(mensagem);
      setShowErrorDialog(true);
      return null;
    }

    const valorLimpo = valor.trim();
    
    if (tipo === 'chassi' && valorLimpo.length < 17) {
      const mensagem = 'Chassi deve ter 17 caracteres';
      setError(mensagem);
      setShowErrorDialog(true);
      return null;
    }

    if (tipo === 'placa' && valorLimpo.length < 7) {
      const mensagem = 'Placa inválida';
      setError(mensagem);
      setShowErrorDialog(true);
      return null;
    }

    if (tipo === 'renavam' && valorLimpo.length < 9) {
      const mensagem = 'Renavam deve ter no mínimo 9 dígitos';
      setError(mensagem);
      setShowErrorDialog(true);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await buscarOuConsultarVeiculo(tipo, valorLimpo, endpoint, uf);
      setResultado(result);
      return result;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao consultar veículo';
      setError(mensagem);
      setShowErrorDialog(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const closeErrorDialog = () => {
    setShowErrorDialog(false);
    setError(null);
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
    showErrorDialog,
    closeErrorDialog,
    limpar,
  };
};