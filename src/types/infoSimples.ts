export interface InfoSimplesCredentials {
  a3: string;
  a3_pin: string;
  login_cpf: string;
  login_senha: string;
}

export interface ConsultaBaseSpParams {
  chassi?: string;
  placa?: string;
  renavam?: string;
  token?: string;
}

export interface ConsultaBinParams {
  chassi?: string;
  placa?: string;
  renavam?: string;
  uf?: string;
  token?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  responseTime?: number;
  status?: number;
}

export interface VeiculoData {
  [key: string]: any;
}

export type ConsultaTipo = 'chassi' | 'placa-renavam';
export type EndpointType = 'base-sp' | 'bin';
