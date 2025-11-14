import { 
  InfoSimplesCredentials, 
  ConsultaBaseSpParams, 
  ConsultaBinParams, 
  ApiResponse, 
  VeiculoData 
} from '@/types/infoSimples';

const CREDENTIALS_KEY = 'infosimples_credentials';
const BASE_URL = 'https://api.infosimples.com/api/v2/consultas/ecrvsp/veiculos';

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

const buildAuthHeader = (credentials: InfoSimplesCredentials): string => {
  const token = credentials.a3;
  const tokenSecret = credentials.a3_pin;
  return 'Basic ' + btoa(`${token}:${tokenSecret}`);
};

const buildRequestBody = (
  credentials: InfoSimplesCredentials,
  params: ConsultaBaseSpParams | ConsultaBinParams
) => {
  return {
    login_cpf: credentials.login_cpf,
    login_senha: credentials.login_senha,
    ...params
  };
};

export const consultarBaseEstadualSP = async (
  params: ConsultaBaseSpParams
): Promise<ApiResponse<VeiculoData>> => {
  const credentials = getCredentials();
  
  if (!credentials) {
    return {
      success: false,
      error: 'Credenciais não configuradas. Por favor, configure as credenciais primeiro.'
    };
  }

  const startTime = performance.now();

  try {
    console.log('Iniciando consulta Base SP com params:', params);
    console.log('URL:', `${BASE_URL}/base-sp`);
    
    const requestBody = buildRequestBody(credentials, params);
    console.log('Request body:', { ...requestBody, login_senha: '***' });

    const response = await fetch(`${BASE_URL}/base-sp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': buildAuthHeader(credentials)
      },
      body: JSON.stringify(requestBody)
    });

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    console.log('Response status:', response.status);
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Resposta não é JSON:', text);
      data = { error: 'Resposta inválida da API', details: text };
    }

    console.log('Response data:', data);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `Erro HTTP ${response.status}`,
        status: response.status,
        responseTime,
        data
      };
    }

    return {
      success: true,
      data,
      responseTime,
      status: response.status
    };
  } catch (error) {
    console.error('Erro ao chamar API:', error);
    
    let errorMessage = 'Erro ao conectar com a API';
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Erro de CORS ou rede. A API Info Simples não permite chamadas diretas do navegador. Recomendamos usar Lovable Cloud/Supabase para criar uma edge function que faça essas chamadas de forma segura.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const consultarCadastroBIN = async (
  params: ConsultaBinParams
): Promise<ApiResponse<VeiculoData>> => {
  const credentials = getCredentials();
  
  if (!credentials) {
    return {
      success: false,
      error: 'Credenciais não configuradas. Por favor, configure as credenciais primeiro.'
    };
  }

  const startTime = performance.now();

  try {
    console.log('Iniciando consulta BIN com params:', params);
    console.log('URL:', `${BASE_URL}/bin`);
    
    const requestBody = buildRequestBody(credentials, params);
    console.log('Request body:', { ...requestBody, login_senha: '***' });

    const response = await fetch(`${BASE_URL}/bin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': buildAuthHeader(credentials)
      },
      body: JSON.stringify(requestBody)
    });

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    console.log('Response status:', response.status);
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Resposta não é JSON:', text);
      data = { error: 'Resposta inválida da API', details: text };
    }

    console.log('Response data:', data);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `Erro HTTP ${response.status}`,
        status: response.status,
        responseTime,
        data
      };
    }

    return {
      success: true,
      data,
      responseTime,
      status: response.status
    };
  } catch (error) {
    console.error('Erro ao chamar API:', error);
    
    let errorMessage = 'Erro ao conectar com a API';
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Erro de CORS ou rede. A API Info Simples não permite chamadas diretas do navegador. Recomendamos usar Lovable Cloud/Supabase para criar uma edge function que faça essas chamadas de forma segura.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};
