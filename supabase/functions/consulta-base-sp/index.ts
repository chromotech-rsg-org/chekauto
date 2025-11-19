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
    tipo_consulta: 'base-sp',
    parametros: {},
    resposta: {},
    sucesso: false,
    tempo_resposta: 0,
    erro: null
  };

  try {
    const { chassi, placa, renavam, uf, token } = await req.json();
    
    logData.parametros = { chassi, placa, renavam, uf };
    
    console.log('Consulta Base SP - Params:', { chassi, placa, renavam, uf, hasToken: !!token });

    // Get credentials from environment (a3 does NOT get overridden by token)
    const a3 = Deno.env.get('INFOSIMPLES_A3');
    const a3_pin = Deno.env.get('INFOSIMPLES_A3_PIN');
    const login_cpf = Deno.env.get('INFOSIMPLES_LOGIN_CPF');
    const login_senha = Deno.env.get('INFOSIMPLES_LOGIN_SENHA');

    if (!a3 || !a3_pin || !login_cpf || !login_senha) {
      console.error('Credenciais não configuradas');
      logData.erro = 'Credenciais não configuradas no servidor';
      await saveLog(logData);
      
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

    console.log('Chamando API Info Simples - Base SP');

    const response = await fetch(`${BASE_URL}/base-sp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    logData.tempo_resposta = responseTime;

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

    logData.resposta = data;

    if (!response.ok) {
      logData.sucesso = false;
      logData.erro = data.message || data.error || `Erro HTTP ${response.status}`;
      await saveLog(logData);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: data.message || data.error || `Erro HTTP ${response.status}`,
          status: response.status,
          responseTime,
          data
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    logData.sucesso = true;
    await saveLog(logData);

    return new Response(
      JSON.stringify({
        success: true,
        data,
        responseTime,
        status: response.status
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
