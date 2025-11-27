import { supabase } from '@/integrations/supabase/client';
import { consultarBaseEstadualSP, consultarCadastroBIN } from './infoSimplesService';

export interface VeiculoConsulta {
  id: string;
  tipo_consulta: 'chassi' | 'placa' | 'renavam';
  valor_consultado: string;
  dados_completos: any;
  modelo: string | null;
  marca: string | null;
  ano_modelo: string | null;
  renavam: string | null;
  chassi: string | null;
  placa: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface LogConsulta {
  id: string;
  tipo_consulta: string;
  tempo_resposta: number | null;
  sucesso: boolean;
  criado_em: string;
  parametros: any;
  resposta: any;
  erro?: string | null;
  modelo?: string | null;
  marca?: string | null;
  placa?: string | null;
  chassi?: string | null;
  renavam?: string | null;
  cor?: string | null;
  ano_modelo?: string | null;
  ano_fabricacao?: string | null;
  combustivel?: string | null;
  categoria?: string | null;
}

export interface ResultadoConsulta {
  fromCache: boolean;
  data: any;
  ultimaAtualizacao?: string;
  consultaId: string;
  logConsulta?: LogConsulta;
}

/**
 * Busca configuração do sistema (dias de cache)
 */
export const buscarDiasCacheConfiguracao = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('configuracoes_sistema')
      .select('valor')
      .eq('chave', 'dias_cache_veiculo')
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar configuração de dias de cache:', error);
      return 30; // Default
    }

    return data ? parseInt(data.valor) : 30;
  } catch (error) {
    console.error('Erro ao buscar dias de cache:', error);
    return 30;
  }
};

/**
 * Busca token opcional do InfoSimples
 */
export const buscarTokenInfoSimples = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('configuracoes_sistema')
      .select('valor')
      .eq('chave', 'infosimples_token')
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar token InfoSimples:', error);
      return null;
    }

    return data?.valor || null;
  } catch (error) {
    console.error('Erro ao buscar token:', error);
    return null;
  }
};

/**
 * Busca veículo no cache de logs (principal fonte de dados)
 */
async function buscarVeiculoNoLog(
  tipo: 'chassi' | 'placa' | 'renavam',
  valor: string
): Promise<LogConsulta | null> {
  console.log('[Cache] Buscando no cache de logs:', { tipo, valor });
  
  try {
    const valorNormalizado = valor.trim().toUpperCase();
    
    // Determinar qual campo usar na busca baseado no tipo
    let query = supabase
      .from('logs_consultas_infosimples')
      .select('*')
      .eq('sucesso', true)
      .order('criado_em', { ascending: false });

    // Adicionar filtro baseado no tipo de consulta
    if (tipo === 'chassi' && valorNormalizado) {
      query = query.eq('chassi', valorNormalizado);
    } else if (tipo === 'placa' && valorNormalizado) {
      query = query.eq('placa', valorNormalizado);
    } else if (tipo === 'renavam' && valorNormalizado) {
      query = query.eq('renavam', valorNormalizado);
    }

    const { data, error } = await query.limit(1).maybeSingle();

    if (error) {
      console.error('[Cache] Erro ao buscar no cache:', error);
      return null;
    }

    if (data) {
      console.log('[Cache] Dados encontrados no cache de logs:', data.id);
      return data as LogConsulta;
    }

    console.log('[Cache] Nenhum dado encontrado no cache');
    return null;
  } catch (error) {
    console.error('[Cache] Erro ao buscar veículo no cache:', error);
    return null;
  }
}

/**
 * Busca o log mais recente da consulta por chassi, placa ou renavam (mantido para compatibilidade)
 */
export const buscarLogConsulta = buscarVeiculoNoLog;

/**
 * Busca veículo no cache por renavam, chassi ou placa
 */
export const buscarVeiculoCache = async (
  tipo: 'chassi' | 'placa' | 'renavam',
  valor: string
): Promise<VeiculoConsulta | null> => {
  try {
    // Normalizar valor
    const valorNormalizado = valor.trim().toUpperCase();

    // Primeiro tenta buscar pelo tipo e valor exato
    const { data: consultaDireta, error: erroDireto } = await supabase
      .from('consultas_veiculos')
      .select('*')
      .eq('tipo_consulta', tipo)
      .eq('valor_consultado', valorNormalizado)
      .maybeSingle();

    if (consultaDireta && !erroDireto) {
      return consultaDireta as VeiculoConsulta;
    }

    // Se não encontrou, tenta buscar por qualquer campo (chassi, placa, renavam)
    // porque o mesmo veículo pode ter sido consultado de forma diferente
    let query = supabase.from('consultas_veiculos').select('*');

    if (tipo === 'renavam' && valorNormalizado) {
      query = query.eq('renavam', valorNormalizado);
    } else if (tipo === 'chassi' && valorNormalizado) {
      query = query.eq('chassi', valorNormalizado);
    } else if (tipo === 'placa' && valorNormalizado) {
      query = query.eq('placa', valorNormalizado);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Erro ao buscar veículo no cache:', error);
      return null;
    }

    return data as VeiculoConsulta | null;
  } catch (error) {
    console.error('Erro ao buscar cache:', error);
    return null;
  }
};

/**
 * Valida se o cache ainda é válido baseado nos dias configurados
 */
function validarCacheLog(
  log: LogConsulta,
  diasConfig: number
): boolean {
  const dataConsulta = new Date(log.criado_em);
  const hoje = new Date();
  const diferencaDias = Math.floor(
    (hoje.getTime() - dataConsulta.getTime()) / (1000 * 60 * 60 * 24)
  );

  const valido = diferencaDias <= diasConfig;
  console.log('[Cache] Validação:', { 
    dataConsulta: dataConsulta.toISOString(),
    diasPassados: diferencaDias,
    diasPermitidos: diasConfig,
    valido 
  });
  
  return valido;
}

// Manter função antiga para compatibilidade
export const validarCacheVeiculo = (
  consulta: VeiculoConsulta,
  diasConfig: number
): boolean => {
  const dataConsulta = new Date(consulta.atualizado_em);
  const hoje = new Date();
  const diferencaDias = Math.floor(
    (hoje.getTime() - dataConsulta.getTime()) / (1000 * 60 * 60 * 24)
  );

  return diferencaDias <= diasConfig;
};

/**
 * Extrai dados relevantes da resposta da API
 */
export const extrairDadosRelevantes = (dadosApi: any) => {
  // A API base-sp retorna estrutura: { code: 200, data: [{ crv: {...}, debitos: {...}, veiculo: {...} }] }
  let data = dadosApi?.data || dadosApi;
  
  // Se data é um array, pegar o primeiro item
  if (Array.isArray(data) && data.length > 0) {
    data = data[0];
  }
  
  // Extrair subseções da resposta base-sp
  const veiculo = data?.veiculo || {};
  const crv = data?.crv || {};
  
  // Para compatibilidade, mesclar tudo em um único objeto
  const merged = { ...data, ...veiculo, ...crv };

  return {
    modelo: merged?.modelo || merged?.Modelo || null,
    marca: merged?.marca || merged?.Marca || null,
    ano_modelo: merged?.ano_modelo || merged?.AnoModelo || merged?.ano || null,
    renavam: merged?.renavam || merged?.Renavam || null,
    chassi: merged?.chassi || merged?.Chassi || null,
    placa: merged?.placa || merged?.Placa || null,
  };
};

/**
 * Salva consulta no banco de dados
 */
export const salvarConsultaVeiculo = async (
  tipo: 'chassi' | 'placa' | 'renavam',
  valor: string,
  dadosCompletos: any
): Promise<string | null> => {
  try {
    const valorNormalizado = valor.trim().toUpperCase();
    const dadosExtraidos = extrairDadosRelevantes(dadosCompletos);

    const { data, error } = await supabase
      .from('consultas_veiculos')
      .insert({
        tipo_consulta: tipo,
        valor_consultado: valorNormalizado,
        dados_completos: dadosCompletos,
        ...dadosExtraidos,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar consulta:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Erro ao salvar consulta:', error);
    return null;
  }
};

/**
 * Atualiza consulta existente com novos dados
 */
export const atualizarConsultaVeiculo = async (
  id: string,
  dadosCompletos: any
): Promise<boolean> => {
  try {
    const dadosExtraidos = extrairDadosRelevantes(dadosCompletos);

    const { error } = await supabase
      .from('consultas_veiculos')
      .update({
        dados_completos: dadosCompletos,
        ...dadosExtraidos,
        atualizado_em: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar consulta:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error);
    return false;
  }
};

/**
 * Busca ou consulta veículo (lógica principal de cache usando logs)
 */
export const buscarOuConsultarVeiculo = async (
  tipo: 'chassi' | 'placa' | 'renavam',
  valor: string,
  endpoint: 'base-sp' | 'bin' = 'base-sp',
  uf?: string
): Promise<ResultadoConsulta> => {
  console.log('[buscarOuConsultarVeiculo] Iniciando:', { tipo, valor, endpoint });
  
  try {
    const diasConfig = await buscarDiasCacheConfiguracao();
    
    // 1. Buscar no cache de logs
    console.log('[buscarOuConsultarVeiculo] Passo 1: Buscar no cache de logs');
    const logCache = await buscarVeiculoNoLog(tipo, valor);
    
    if (logCache) {
      console.log('[buscarOuConsultarVeiculo] Dados encontrados no cache de logs');
      
      // 2. Validar se o cache ainda é válido
      const cacheValido = validarCacheLog(logCache, diasConfig);
      
      if (cacheValido) {
        console.log('[buscarOuConsultarVeiculo] Cache válido, retornando dados dos logs');
        return {
          fromCache: true,
          data: logCache.resposta,
          ultimaAtualizacao: logCache.criado_em,
          consultaId: logCache.id,
          logConsulta: logCache,
        };
      }
      
      // 3. Cache expirado, fazer nova consulta (que criará um novo log)
      console.log('[buscarOuConsultarVeiculo] Cache expirado, fazendo nova consulta...');
    }
    
    // 4. Não existe no cache ou cache expirado, fazer nova consulta
    console.log('[buscarOuConsultarVeiculo] Fazendo nova consulta na API');
    const token = await buscarTokenInfoSimples();
    
    const params: any = { token: token || undefined };
    params[tipo] = valor;
    // Para base-sp, sempre usar UF=SP se não especificado
    if (endpoint === 'base-sp') {
      params.uf = uf || 'SP';
    } else if (uf) {
      params.uf = uf;
    }

    const resultado = endpoint === 'base-sp'
      ? await consultarBaseEstadualSP(params)
      : await consultarCadastroBIN(params);
    
    if (resultado.success && resultado.data) {
      // Aguardar um pouco para o log ser salvo pelo edge function
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Buscar o log recém criado
      const novoLog = await buscarVeiculoNoLog(tipo, valor);
      
      return {
        fromCache: false,
        data: resultado.data,
        ultimaAtualizacao: new Date().toISOString(),
        consultaId: novoLog?.id || '',
        logConsulta: novoLog || undefined,
      };
    }
    
    throw new Error(resultado.error || 'Erro ao consultar veículo');
  } catch (error) {
    console.error('[buscarOuConsultarVeiculo] Erro:', error);
    throw error;
  }
};
