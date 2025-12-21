import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature, x-webhook-event, x-webhook-timestamp',
};

// Função para validar assinatura HMAC-SHA256
async function validateWebhookSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payload)
    );
    
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('Erro ao validar assinatura:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const webhookSecret = Deno.env.get('SPLIT_FACIL_WEBHOOK_SECRET');
    const signature = req.headers.get('x-webhook-signature');
    const event = req.headers.get('x-webhook-event');
    const timestamp = req.headers.get('x-webhook-timestamp');
    
    const bodyText = await req.text();
    const payload = JSON.parse(bodyText);
    
    console.log('Webhook Split Fácil recebido:', { event, timestamp });
    console.log('Payload:', JSON.stringify(payload));

    // Validar assinatura se secret estiver configurado
    if (webhookSecret && signature) {
      const isValid = await validateWebhookSignature(bodyText, signature, webhookSecret);
      if (!isValid) {
        console.error('Assinatura do webhook inválida');
        
        // Log do webhook inválido
        await supabase.from('logs_split_facil').insert({
          tipo: 'webhook',
          endpoint: '/split-facil-webhook',
          asaas_payment_id: payload?.dados?.payment_id,
          payload: payload,
          erro: 'Assinatura inválida',
          status_code: 401
        });
        
        return new Response(
          JSON.stringify({ error: 'Assinatura inválida' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const { evento, dados } = payload;
    
    // Registrar log do webhook
    await supabase.from('logs_split_facil').insert({
      tipo: 'webhook',
      endpoint: '/split-facil-webhook',
      asaas_payment_id: dados?.payment_id,
      payload: payload,
      resposta: { received: true, event: evento },
      status_code: 200
    });

    // Processar eventos
    switch (evento) {
      case 'split_created':
        console.log('Split criado:', dados);
        break;
        
      case 'split_success':
        console.log('Split configurado com sucesso:', dados);
        
        // Atualizar historico_splits
        if (dados?.payment_id) {
          await supabase
            .from('historico_splits')
            .update({ 
              status: 'configurado',
              status_pagamento: dados.status_pagamento,
              resposta_api: dados
            })
            .eq('asaas_payment_id', dados.payment_id);
          
          // Atualizar solicitação
          const { data: pagamento } = await supabase
            .from('pagamentos')
            .select('id')
            .eq('asaas_payment_id', dados.payment_id)
            .single();
            
          if (pagamento) {
            await supabase
              .from('solicitacoes')
              .update({ split_status: 'configurado', split_erro: null })
              .eq('pagamento_id', pagamento.id);
          }
        }
        break;
        
      case 'split_error':
        console.log('Erro no split:', dados);
        
        // Atualizar historico_splits com erro
        if (dados?.payment_id) {
          await supabase
            .from('historico_splits')
            .update({ 
              status: 'erro',
              erro_mensagem: dados?.erro || 'Erro ao configurar split',
              resposta_api: dados
            })
            .eq('asaas_payment_id', dados.payment_id);
          
          // Atualizar solicitação com erro
          const { data: pagamento } = await supabase
            .from('pagamentos')
            .select('id')
            .eq('asaas_payment_id', dados.payment_id)
            .single();
            
          if (pagamento) {
            await supabase
              .from('solicitacoes')
              .update({ 
                split_status: 'erro', 
                split_erro: dados?.erro || 'Erro ao configurar split no Split Fácil' 
              })
              .eq('pagamento_id', pagamento.id);
          }
        }
        break;
        
      default:
        console.log('Evento desconhecido:', evento);
    }

    return new Response(
      JSON.stringify({ received: true, event: evento }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    // Log do erro
    await supabase.from('logs_split_facil').insert({
      tipo: 'webhook',
      endpoint: '/split-facil-webhook',
      erro: errorMessage,
      status_code: 500
    });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
