import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cpf } = await req.json();

    if (!cpf) {
      return new Response(
        JSON.stringify({ error: 'CPF é obrigatório' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Limpar CPF (remover caracteres não numéricos)
    const cpfLimpo = cpf.replace(/\D/g, '');

    console.log('Buscando cliente com CPF:', cpfLimpo);

    // Buscar cliente na tabela pagamentos (últimos dados)
    const { data: pagamentos, error: pagamentosError } = await supabase
      .from('pagamentos')
      .select('dados_cliente')
      .eq('dados_cliente->>cpfCnpj', cpfLimpo)
      .order('criado_em', { ascending: false })
      .limit(1);

    if (pagamentosError) {
      console.error('Erro ao buscar pagamentos:', pagamentosError);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar cliente' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (pagamentos && pagamentos.length > 0) {
      const clienteData = pagamentos[0].dados_cliente;
      console.log('Cliente encontrado:', clienteData);
      
      return new Response(
        JSON.stringify({ 
          found: true, 
          cliente: clienteData 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Cliente não encontrado');
    
    return new Response(
      JSON.stringify({ found: false }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro na função buscar-cliente:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
