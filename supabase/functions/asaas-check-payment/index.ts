import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('ASAAS_API_KEY');
    const environment = Deno.env.get('ASAAS_ENVIRONMENT') || 'sandbox';
    
    if (!apiKey) {
      throw new Error('ASAAS_API_KEY não configurada');
    }

    const baseUrl = environment === 'production' 
      ? 'https://www.asaas.com/api/v3'
      : 'https://sandbox.asaas.com/api/v3';

    const { paymentId } = await req.json();

    if (!paymentId) {
      throw new Error('paymentId é obrigatório');
    }

    console.log('Consultando status do pagamento:', paymentId);

    // Buscar status no Asaas
    const paymentResponse = await fetch(`${baseUrl}/payments/${paymentId}`, {
      headers: {
        'access_token': apiKey,
      },
    });

    if (!paymentResponse.ok) {
      const error = await paymentResponse.text();
      console.error('Erro ao consultar pagamento:', error);
      throw new Error(`Erro ao consultar pagamento: ${error}`);
    }

    const payment = await paymentResponse.json();
    console.log('Status do pagamento:', payment.status);

    // Atualizar status no banco de dados
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from('pagamentos')
      .update({
        status: payment.status,
        atualizado_em: new Date().toISOString(),
      })
      .eq('asaas_payment_id', paymentId);

    if (dbError) {
      console.error('Erro ao atualizar banco:', dbError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment: {
          id: payment.id,
          status: payment.status,
          value: payment.value,
          netValue: payment.netValue,
          billingType: payment.billingType,
          dueDate: payment.dueDate,
          invoiceUrl: payment.invoiceUrl,
          invoiceNumber: payment.invoiceNumber,
        },
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erro na função:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
