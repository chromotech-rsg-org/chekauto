import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE_URL = 'https://api.infosimples.com/api/v2/consultas/ecrvsp/veiculos';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chassi, placa, renavam, token } = await req.json();
    
    console.log('Consulta Base SP - Params:', { chassi, placa, renavam, hasToken: !!token });

    // Get credentials - use token if provided, otherwise use environment variables
    const a3 = token || Deno.env.get('INFOSIMPLES_A3');
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

    // Build request body with ALL required credentials
    const requestBody = {
      token: a3,
      a3: a3,
      a3_pin: a3_pin,
      login_cpf: login_cpf,
      login_senha: login_senha,
      ...(chassi && { chassi }),
      ...(placa && { placa }),
      ...(renavam && { renavam })
    };

    console.log('Request body keys:', Object.keys(requestBody));

    const startTime = performance.now();

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

    console.log('Response data:', JSON.stringify(data).substring(0, 200));

    if (!response.ok) {
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
