import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE_URL = 'https://api.infosimples.com/api/v2/consultas/ecrvsp/veiculos';

serve(async (req) => {
  const startTime = performance.now();
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let logData: any = {
    tipo_consulta: 'bin',
    parametros: {},
    resposta: {},
    sucesso: false,
    tempo_resposta: 0,
    erro: null
  };

  try {
    const { chassi, placa, renavam, uf, token } = await req.json();
    
    logData.parametros = { chassi, placa, renavam, uf };
    
    console.log('Consulta BIN - Params:', { chassi, placa, renavam, uf, hasToken: !!token });

    // Get credentials from environment (a3 does NOT get overridden by token)
    const a3 = Deno.env.get('INFOSIMPLES_A3');
    const a3_pin = Deno.env.get('INFOSIMPLES_A3_PIN');
    const login_cpf = Deno.env.get('INFOSIMPLES_LOGIN_CPF');
    const login_senha = Deno.env.get('INFOSIMPLES_LOGIN_SENHA');

    if (!a3 || !a3_pin || !login_cpf || !login_senha) {
      console.error('Credenciais não configuradas');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Credenciais não configuradas no servidor' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Build request body with ALL fields in exact order
    const requestBody = {
      token: token || "",
      a3: a3 || "",
      a3_pin: a3_pin || "",
      login_cpf: login_cpf || "",
      login_senha: login_senha || "",
      chassi: chassi || "",
      placa: placa || "",
      renavam: renavam || "",
      uf: uf || ""
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const startTime = performance.now();

    console.log('Chamando API Info Simples - BIN');

    const response = await fetch(`${BASE_URL}/bin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    logData.tempo_resposta = responseTime;
    logData.api_conectou = response.ok;
    logData.endpoint = 'bin';

    console.log('Response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Resposta não é JSON:', text);
      data = { error: 'Resposta inválida da API', details: text };
      logData.erro_tipo = 'ERRO_PARSE_JSON';
    }

    logData.resposta = data;
    logData.codigo_resposta = data?.code || response.status;

    // Detectar tipo de erro
    if (!response.ok || data?.code !== 200) {
      logData.sucesso = false;
      const erros = data?.errors || [];
      logData.erro = Array.isArray(erros) ? erros.join(', ') : (data.message || data.error || `Erro HTTP ${response.status}`);
      
      // Detectar erros específicos
      const codigoResposta = data?.code || response.status;
      if (codigoResposta === 612) {
        const chassiNaoCadastrado = erros.some((err: string) => 
          err && err.includes('CHASSI') && err.includes('NÃO CADASTRADO')
        );
        logData.erro_tipo = chassiNaoCadastrado ? 'CHASSI_NAO_ENCONTRADO' : 'VEICULO_NAO_ENCONTRADO';
      } else if (codigoResposta === 601) {
        logData.erro_tipo = 'ERRO_AUTENTICACAO';
      } else if (codigoResposta === 606 || codigoResposta === 607) {
        logData.erro_tipo = 'ERRO_PARAMETROS';
      } else if (codigoResposta === 615 || codigoResposta === 618) {
        logData.erro_tipo = 'API_INDISPONIVEL';
      } else {
        logData.erro_tipo = `ERRO_${codigoResposta}`;
      }
      
      // Extrair dados mesmo em erro
      const dadosExtraidos = extrairDadosVeiculo(data);
      Object.assign(logData, dadosExtraidos);
      
      await saveLog(logData);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: logData.erro,
          status: codigoResposta,
          responseTime,
          data,
          endpoint: 'bin'
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    logData.sucesso = true;
    
    // Extrair dados relevantes para o log
    const dadosExtraidos = extrairDadosVeiculo(data);
    Object.assign(logData, dadosExtraidos);
    
    await saveLog(logData);

    return new Response(
      JSON.stringify({
        success: true,
        data,
        responseTime,
        status: 200,
        endpoint: 'bin'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na edge function:', error);
    
    logData.sucesso = false;
    logData.erro = error instanceof Error ? error.message : 'Erro ao processar requisição';
    logData.tempo_resposta = Math.round(performance.now() - startTime);
    await saveLog(logData);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao processar requisição' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Função para extrair dados do veículo da resposta BIN
function extrairDadosVeiculo(dados: any): any {
  const resultado: any = {};
  
  try {
    // Para BIN, a estrutura é: { code: 200, data: [...array de objetos...] }
    if (dados?.code === 200 && Array.isArray(dados?.data) && dados.data.length > 0) {
      const veiculo = dados.data[0];
      resultado.placa = veiculo.placa || null;
      resultado.chassi = veiculo.chassi || null;
      resultado.renavam = veiculo.renavam || null;
      resultado.marca = veiculo.marca || null;
      resultado.modelo = veiculo.modelo || null;
      resultado.ano_modelo = veiculo.ano_modelo || null;
      resultado.ano_fabricacao = veiculo.ano_fabricacao || null;
      resultado.cor = veiculo.cor || null;
      resultado.combustivel = veiculo.combustivel || null;
      resultado.categoria = veiculo.categoria || veiculo.tipo || null;
      // Percorrer os dados e extrair informações relevantes
      dados.data.forEach((item: any) => {
        if (item.Placa) resultado.placa = item.Placa;
        if (item.Chassi) resultado.chassi = item.Chassi;
        if (item.Renavam) resultado.renavam = item.Renavam;
        if (item.Marca) resultado.marca = item.Marca;
        if (item.Modelo) resultado.modelo = item.Modelo;
        if (item.AnoFabricacao || item['Ano Fabricação']) {
          resultado.ano_fabricacao = item.AnoFabricacao || item['Ano Fabricação'];
        }
        if (item.AnoModelo || item['Ano Modelo']) {
          resultado.ano_modelo = item.AnoModelo || item['Ano Modelo'];
        }
        if (item.Cor) resultado.cor = item.Cor;
        if (item.Combustivel) resultado.combustivel = item.Combustivel;
        if (item.Categoria || item.TipoVeiculo) {
          resultado.categoria = item.Categoria || item.TipoVeiculo;
        }
      });
    }
  } catch (error) {
    console.error('Erro ao extrair dados do veículo:', error);
  }
  
  return resultado;
}

async function saveLog(logData: any) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { error } = await supabase
      .from('logs_consultas_infosimples')
      .insert(logData);
    
    if (error) {
      console.error('Erro ao salvar log:', error);
    }
  } catch (err) {
    console.error('Erro ao conectar ao Supabase para salvar log:', err);
  }
}
