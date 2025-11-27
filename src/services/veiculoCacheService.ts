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
 * Busca o log mais recente da consulta por chassi, placa ou renavam
 */
export const buscarLogConsulta = async (
  tipo: 'chassi' | 'placa' | 'renavam',
  valor: string
): Promise<LogConsulta | null> => {
  try {
    const valorNormalizado = valor.trim().toUpperCase();
    
    const { data, error } = await supabase
      .from('logs_consultas_infosimples')
      .select('id, tipo_consulta, tempo_resposta, sucesso, criado_em, parametros')
      .eq('tipo_consulta', tipo === 'chassi' ? 'base-sp' : tipo === 'placa' ? 'base-sp' : 'base-sp')
      .order('criado_em', { ascending: false })
      .limit(10);

    if (error || !data || data.length === 0) {
      return null;
    }

    // Procurar o log que corresponde ao valor consultado
    const logEncontrado = data.find(log => {
      const params = log.parametros as Record<string, any> || {};
      const chassiParam = (params.chassi || params.Chassi || '') as string;
      const placaParam = (params.placa || params.Placa || '') as string;
      const renavamParam = (params.renavam || params.Renavam || '') as string;
      
      return chassiParam === valorNormalizado || 
             placaParam === valorNormalizado || 
             renavamParam === valorNormalizado;
    });

    return logEncontrado as LogConsulta | null;
  } catch (error) {
    console.error('Erro ao buscar log da consulta:', error);
    return null;
  }
};

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
 * Busca ou consulta veículo (lógica principal de cache)
 */
export const buscarOuConsultarVeiculo = async (
  tipo: 'chassi' | 'placa' | 'renavam',
  valor: string,
  endpoint: 'base-sp' | 'bin' = 'base-sp',
  uf?: string
): Promise<ResultadoConsulta> => {
  try {
    // 1. Buscar no cache
    const consultaCache = await buscarVeiculoCache(tipo, valor);

    if (consultaCache) {
      // 2. Verificar se cache é válido
      const diasConfig = await buscarDiasCacheConfiguracao();
      const cacheValido = validarCacheVeiculo(consultaCache, diasConfig);

      if (cacheValido) {
        console.log('Cache válido - retornando dados salvos');
        return {
          fromCache: true,
          data: consultaCache.dados_completos,
          ultimaAtualizacao: consultaCache.atualizado_em,
          consultaId: consultaCache.id,
        };
      } else {
        console.log('Cache expirado - atualizando consulta');
        // 3. Cache expirado - fazer nova consulta
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
          // Atualizar cache
          await atualizarConsultaVeiculo(consultaCache.id, resultado.data);
          const logConsulta = await buscarLogConsulta(tipo, valor);

          return {
            fromCache: false,
            data: resultado.data,
            consultaId: consultaCache.id,
            logConsulta: logConsulta || undefined,
          };
        } else {
          // Erro na API - retornar cache antigo mesmo expirado
          console.warn('Erro na API - usando cache expirado');
          const logConsulta = await buscarLogConsulta(tipo, valor);
          
          return {
            fromCache: true,
            data: consultaCache.dados_completos,
            ultimaAtualizacao: consultaCache.atualizado_em,
            consultaId: consultaCache.id,
            logConsulta: logConsulta || undefined,
          };
        }
      }
    } else {
      // 4. Não existe no cache - fazer primeira consulta
      console.log('Primeira consulta deste veículo');
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
        // Salvar no cache
        const consultaId = await salvarConsultaVeiculo(tipo, valor, resultado.data);
        const logConsulta = await buscarLogConsulta(tipo, valor);

        return {
          fromCache: false,
          data: resultado.data,
          consultaId: consultaId || '',
          logConsulta: logConsulta || undefined,
        };
      } else {
        throw new Error(resultado.error || 'Erro ao consultar API');
      }
    }
  } catch (error) {
    console.error('Erro ao buscar ou consultar veículo:', error);
    throw error;
  }
};
