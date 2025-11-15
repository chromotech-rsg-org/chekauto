import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, asaas-access-token',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get('ASAAS_WEBHOOK_SECRET');
    
    // Verificar token do webhook se configurado
    if (webhookSecret) {
      const asaasToken = req.headers.get('asaas-access-token');
      if (asaasToken !== webhookSecret) {
        console.error('Token de webhook inválido');
        throw new Error('Token de webhook inválido');
      }
    }

    const event = await req.json();
    console.log('Webhook recebido:', event);

    if (!event.event || !event.payment) {
      throw new Error('Webhook inválido');
    }

    const { payment } = event;

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
      .eq('asaas_payment_id', payment.id);

    if (dbError) {
      console.error('Erro ao atualizar banco:', dbError);
      throw dbError;
    }

    console.log(`Pagamento ${payment.id} atualizado para status: ${payment.status}`);

    // Se pagamento foi confirmado, enviar email de confirmação e atualizar solicitação
    if (payment.status === 'RECEIVED' || payment.status === 'CONFIRMED') {
      // Buscar dados completos do pagamento
      const { data: pagamentoCompleto } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('asaas_payment_id', payment.id)
        .single();

      if (pagamentoCompleto) {
        // Atualizar status da solicitação
        const { error: solicitacaoError } = await supabase
          .from('solicitacoes')
          .update({ status: 'em_andamento' })
          .eq('pagamento_id', pagamentoCompleto.id);

        if (solicitacaoError) {
          console.error('Erro ao atualizar solicitação:', solicitacaoError);
        }

        // Enviar email de confirmação
        try {
          const response = await fetch(`${supabaseUrl}/functions/v1/enviar-email-pedido`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              tipo: 'confirmacao',
              pagamento: pagamentoCompleto
            })
          });

          if (response.ok) {
            console.log('Email de confirmação enviado');
          } else {
            console.error('Erro ao enviar email de confirmação');
          }
        } catch (emailError) {
          console.error('Erro ao enviar email de confirmação:', emailError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processado com sucesso',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erro no webhook:', error);
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
