import { 
  InfoSimplesCredentials, 
  ConsultaBaseSpParams, 
  ConsultaBinParams, 
  ApiResponse, 
  VeiculoData 
} from '@/types/infoSimples';
import { supabase } from '@/integrations/supabase/client';

const CREDENTIALS_KEY = 'infosimples_credentials';

export const saveCredentials = (credentials: InfoSimplesCredentials): void => {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
};

export const getCredentials = (): InfoSimplesCredentials | null => {
  const stored = localStorage.getItem(CREDENTIALS_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const clearCredentials = (): void => {
  localStorage.removeItem(CREDENTIALS_KEY);
};

// Buscar token do banco de dados
export const buscarTokenInfoSimples = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('configuracoes_sistema')
      .select('valor')
      .eq('chave', 'infosimples_api_token')
      .single();

    if (error) {
      console.error('Erro ao buscar token do banco:', error);
      return null;
    }

    return data?.valor || null;
  } catch (error) {
    console.error('Erro ao buscar token:', error);
    return null;
  }
};


export const consultarBaseEstadualSP = async (
  params: ConsultaBaseSpParams
): Promise<ApiResponse<VeiculoData>> => {
  const startTime = performance.now();

  try {
    console.log('Iniciando consulta Base SP via Edge Function:', params);

    // Buscar token do banco se não foi fornecido
    let token = params.token;
    if (!token) {
      token = await buscarTokenInfoSimples() || undefined;
    }

    const { data, error } = await supabase.functions.invoke('consulta-base-sp', {
      body: { ...params, token }
    });

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    if (error) {
      console.error('Erro na edge function:', error);
      return {
        success: false,
        error: error.message || 'Erro ao chamar edge function',
        responseTime
      };
    }

    console.log('Resposta da edge function:', data);

    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Erro desconhecido',
        status: data.status,
        responseTime: data.responseTime || responseTime,
        data: data.data
      };
    }

    return {
      success: true,
      data: data.data,
      responseTime: data.responseTime || responseTime,
      status: data.status
    };
  } catch (error) {
    console.error('Erro ao chamar edge function:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao conectar com o servidor'
    };
  }
};

export const consultarCadastroBIN = async (
  params: ConsultaBinParams
): Promise<ApiResponse<VeiculoData>> => {
  const startTime = performance.now();

  try {
    console.log('Iniciando consulta BIN via Edge Function:', params);

    // Buscar token do banco se não foi fornecido
    let token = params.token;
    if (!token) {
      token = await buscarTokenInfoSimples() || undefined;
    }

    const { data, error } = await supabase.functions.invoke('consulta-bin', {
      body: { ...params, token }
    });

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    if (error) {
      console.error('Erro na edge function:', error);
      return {
        success: false,
        error: error.message || 'Erro ao chamar edge function',
        responseTime
      };
    }

    console.log('Resposta da edge function:', data);

    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Erro desconhecido',
        status: data.status,
        responseTime: data.responseTime || responseTime,
        data: data.data
      };
    }

    return {
      success: true,
      data: data.data,
      responseTime: data.responseTime || responseTime,
      status: data.status
    };
  } catch (error) {
    console.error('Erro ao chamar edge function:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao conectar com o servidor'
    };
  }
};
