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
    const response = await fetch(`${BASE_URL}/base-sp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': buildAuthHeader(credentials)
      },
      body: JSON.stringify(buildRequestBody(credentials, params))
    });

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `Erro na API: ${response.status}`,
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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao conectar com a API'
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
    const response = await fetch(`${BASE_URL}/bin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': buildAuthHeader(credentials)
      },
      body: JSON.stringify(buildRequestBody(credentials, params))
    });

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `Erro na API: ${response.status}`,
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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao conectar com a API'
    };
  }
};
