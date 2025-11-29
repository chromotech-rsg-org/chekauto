import { supabase } from '@/integrations/supabase/client';
import { consultarBaseEstadualSP, consultarCadastroBIN } from './infoSimplesService';
import { validarChassi, limparChassi } from '@/lib/validacaoChassi';

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
  codigo_resposta?: number | null;
  endpoint?: string | null;
  api_conectou?: boolean | null;
  erro_tipo?: string | null;
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
 * Busca logs de consulta anteriores (incluindo com erro)
 */
async function buscarLogsAnteriores(
  tipo: 'chassi' | 'placa' | 'renavam',
  valor: string
): Promise<LogConsulta[]> {
  console.log('[Cache] Buscando logs anteriores:', { tipo, valor });
  
  try {
    const valorNormalizado = valor.trim().toUpperCase();
    
    // Buscar pelo valor nos parametros JSON, que é onde realmente está salvo
    const { data, error } = await supabase
      .from('logs_consultas_infosimples')
      .select('*')
      .contains('parametros', { [tipo]: valorNormalizado })
      .order('criado_em', { ascending: false })
      .limit(10);

    if (error) {
      console.error('[Cache] Erro ao buscar logs:', error);
      return [];
    }

    console.log('[Cache] Logs encontrados:', data?.length || 0);
    return (data || []) as LogConsulta[];
  } catch (error) {
    console.error('[Cache] Erro ao buscar logs anteriores:', error);
    return [];
  }
}

/**
 * Busca veículo no cache de logs (apenas sucessos)
 */
async function buscarVeiculoNoLog(
  tipo: 'chassi' | 'placa' | 'renavam',
  valor: string
): Promise<LogConsulta | null> {
  const logs = await buscarLogsAnteriores(tipo, valor);
  return logs.find(log => log.sucesso) || null;
}

/**
 * Valida se o cache ainda é válido baseado nos dias configurados
 */
function validarCacheLog(
  log: LogConsulta,
  diasConfig: number
): boolean {
  // Se diasConfig for 0, sempre invalida o cache (sempre busca novo)
  if (diasConfig === 0) {
    console.log('[Cache] Validação: Cache desabilitado (0 dias configurado)');
    return false;
  }

  const dataConsulta = new Date(log.criado_em);
  const hoje = new Date();
  const diferencaMs = hoje.getTime() - dataConsulta.getTime();
  const diferencaDias = diferencaMs / (1000 * 60 * 60 * 24);

  // Cache é válido se ainda não passou o número de dias configurado
  const valido = diferencaDias <= diasConfig;
  
  console.log('[Cache] Validação:', { 
    dataConsulta: dataConsulta.toISOString(),
    hoje: hoje.toISOString(),
    diferencaMs,
    diasPassados: diferencaDias.toFixed(2),
    diasPermitidos: diasConfig,
    valido 
  });
  
  return valido;
}

/**
 * Busca ou consulta veículo com lógica inteligente
 */
export const buscarOuConsultarVeiculo = async (
  tipo: 'chassi' | 'placa' | 'renavam',
  valor: string,
  endpoint: 'base-sp' | 'bin' = 'base-sp',
  uf?: string
): Promise<ResultadoConsulta> => {
  console.log('[buscarOuConsultarVeiculo] Iniciando:', { tipo, valor, endpoint, uf });
  
  try {
    // Validar chassi se for consulta por chassi
    if (tipo === 'chassi') {
      const chassiLimpo = limparChassi(valor);
      const validacao = validarChassi(chassiLimpo);
      
      if (!validacao.valido) {
        throw new Error(validacao.erro || 'Chassi inválido');
      }
      
      valor = chassiLimpo;
    }

    const diasConfig = await buscarDiasCacheConfiguracao();
    console.log('[buscarOuConsultarVeiculo] Configuração de cache:', { diasConfig });
    
    // 1. Buscar todos os logs anteriores (sucessos e erros)
    console.log('[buscarOuConsultarVeiculo] Passo 1: Buscar logs anteriores');
    const logsAnteriores = await buscarLogsAnteriores(tipo, valor);
    
    if (logsAnteriores.length > 0) {
      console.log(`[buscarOuConsultarVeiculo] Encontrados ${logsAnteriores.length} logs anteriores`);
      console.log('[buscarOuConsultarVeiculo] Log mais recente:', {
        id: logsAnteriores[0].id,
        sucesso: logsAnteriores[0].sucesso,
        criado_em: logsAnteriores[0].criado_em,
        endpoint: logsAnteriores[0].endpoint
      });
      
      // 2. Verificar se já existe QUALQUER erro no endpoint atual
      const logErroNoEndpoint = logsAnteriores.find(log => 
        !log.sucesso && log.endpoint === endpoint
      );
      
      if (logErroNoEndpoint) {
        console.log('[buscarOuConsultarVeiculo] Já existe erro anterior neste endpoint:', endpoint);
        
        // Não consultar novamente, retornar erro salvo
        let mensagemErro = logErroNoEndpoint.erro || 'Esta consulta já foi realizada anteriormente e retornou erro.';
        
        // Mensagem específica para "CHASSI NÃO CADASTRADO"
        if (logErroNoEndpoint.erro && logErroNoEndpoint.erro.includes('CHASSI NÃO CADASTRADO')) {
          mensagemErro = `Este chassi não foi encontrado na ${endpoint === 'base-sp' ? 'Base de São Paulo' : 'Base Nacional (BIN)'}. Por favor, verifique se o estado de origem (UF) está correto e tente novamente.`;
        }
        
        throw new Error(`${mensagemErro}\n\n(Consulta já realizada anteriormente em ${new Date(logErroNoEndpoint.criado_em).toLocaleString('pt-BR')})`);
      }
      
      // 3. Verificar se existe erro de API errada
      const logErroApiErrada = logsAnteriores.find(log => 
        log.erro_tipo === 'CHASSI_API_ERRADA' && log.endpoint
      );
      
      if (logErroApiErrada) {
        console.log('[buscarOuConsultarVeiculo] Encontrado erro de API errada:', logErroApiErrada.endpoint);
        
        // Se o usuário está tentando usar a mesma API errada, bloquear
        if (logErroApiErrada.endpoint === endpoint) {
          const mensagemErro = endpoint === 'base-sp'
            ? 'Este veículo não é de São Paulo. Por favor, selecione "Veículo de Outros Estados" e informe a UF correta.'
            : 'Este veículo é de São Paulo. Por favor, selecione "Veículo de São Paulo (Novo ou Usado)".';
          
          throw new Error(mensagemErro);
        }
        
        console.log('[buscarOuConsultarVeiculo] Usuário corrigiu a seleção, permitindo nova consulta');
      }
      
      // 3. Buscar log de sucesso mais recente
      const logSucesso = logsAnteriores.find(log => log.sucesso);
      
      if (logSucesso) {
        console.log('[buscarOuConsultarVeiculo] Log de sucesso encontrado:', {
          id: logSucesso.id,
          criado_em: logSucesso.criado_em,
          endpoint: logSucesso.endpoint
        });
        
        // Validar se o cache ainda é válido
        const cacheValido = validarCacheLog(logSucesso, diasConfig);
        
        if (cacheValido) {
          console.log('[buscarOuConsultarVeiculo] ✅ CACHE VÁLIDO - Retornando dados salvos sem consultar API');
          return {
            fromCache: true,
            data: logSucesso.resposta,
            ultimaAtualizacao: logSucesso.criado_em,
            consultaId: logSucesso.id,
            logConsulta: logSucesso,
          };
        }
        
        console.log('[buscarOuConsultarVeiculo] ❌ Cache expirado, fazendo nova consulta na API...');
      } else {
        console.log('[buscarOuConsultarVeiculo] Nenhum log de sucesso encontrado, fazendo nova consulta...');
      }
    } else {
      console.log('[buscarOuConsultarVeiculo] Nenhum log anterior encontrado, fazendo primeira consulta...');
    }
    
    // 4. Fazer nova consulta na API
    console.log('[buscarOuConsultarVeiculo] Fazendo nova consulta na API');
    const token = await buscarTokenInfoSimples();
    
    const params: any = { token: token || undefined };
    params[tipo] = valor;
    
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

// Funções mantidas para compatibilidade
export const buscarLogConsulta = buscarVeiculoNoLog;
export const buscarVeiculoCache = async (
  tipo: 'chassi' | 'placa' | 'renavam',
  valor: string
): Promise<VeiculoConsulta | null> => {
  try {
    const valorNormalizado = valor.trim().toUpperCase();

    const { data: consultaDireta, error: erroDireto } = await supabase
      .from('consultas_veiculos')
      .select('*')
      .eq('tipo_consulta', tipo)
      .eq('valor_consultado', valorNormalizado)
      .maybeSingle();

    if (consultaDireta && !erroDireto) {
      return consultaDireta as VeiculoConsulta;
    }

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

export const validarCacheVeiculo = (
  consulta: VeiculoConsulta,
  diasConfig: number
): boolean => {
  if (diasConfig === 0) {
    return false;
  }

  const dataConsulta = new Date(consulta.atualizado_em);
  const hoje = new Date();
  const diferencaDias = Math.floor(
    (hoje.getTime() - dataConsulta.getTime()) / (1000 * 60 * 60 * 24)
  );

  return diferencaDias <= diasConfig;
};

export const extrairDadosRelevantes = (dadosApi: any) => {
  let data = dadosApi?.data || dadosApi;
  
  if (Array.isArray(data) && data.length > 0) {
    data = data[0];
  }
  
  const veiculo = data?.veiculo || {};
  const crv = data?.crv || {};
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
