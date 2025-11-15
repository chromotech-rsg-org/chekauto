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

    const { 
      customerData, 
      paymentData, 
      userId 
    } = await req.json();

    console.log('Criando pagamento no Asaas:', { customerData, paymentData, userId });

    // Primeiro, criar ou buscar o cliente
    let customerId = customerData.id;
    
    if (!customerId) {
      const customerResponse = await fetch(`${baseUrl}/customers`, {
        method: 'POST',
        headers: {
          'access_token': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: customerData.name,
          cpfCnpj: customerData.cpfCnpj,
          email: customerData.email,
          phone: customerData.phone,
          mobilePhone: customerData.mobilePhone,
        }),
      });

      if (!customerResponse.ok) {
        const error = await customerResponse.text();
        console.error('Erro ao criar cliente:', error);
        throw new Error(`Erro ao criar cliente: ${error}`);
      }

      const customer = await customerResponse.json();
      customerId = customer.id;
      console.log('Cliente criado:', customerId);
    }

    // Criar a cobrança
    const paymentPayload: any = {
      customer: customerId,
      billingType: paymentData.billingType,
      value: paymentData.value,
      dueDate: paymentData.dueDate || new Date().toISOString().split('T')[0],
      description: paymentData.description,
      externalReference: paymentData.externalReference,
    };

    // Se for cartão de crédito, adicionar dados do cartão
    if (paymentData.billingType === 'CREDIT_CARD' && paymentData.creditCard) {
      paymentPayload.creditCard = paymentData.creditCard;
      paymentPayload.creditCardHolderInfo = paymentData.creditCardHolderInfo;
    }

    console.log('Criando cobrança:', paymentPayload);

    const paymentResponse = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'access_token': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentPayload),
    });

    if (!paymentResponse.ok) {
      const error = await paymentResponse.text();
      console.error('Erro ao criar pagamento:', error);
      throw new Error(`Erro ao criar pagamento: ${error}`);
    }

    const payment = await paymentResponse.json();
    console.log('Pagamento criado:', payment.id);

    // Se for PIX, buscar o QR Code
    let pixData = null;
    if (paymentData.billingType === 'PIX') {
      const pixResponse = await fetch(`${baseUrl}/payments/${payment.id}/pixQrCode`, {
        headers: {
          'access_token': apiKey,
        },
      });

      if (pixResponse.ok) {
        pixData = await pixResponse.json();
        console.log('QR Code PIX gerado');
      }
    }

    // Salvar no banco de dados Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from('pagamentos')
      .insert({
        asaas_payment_id: payment.id,
        user_id: userId,
        valor: payment.value,
        metodo_pagamento: payment.billingType,
        status: payment.status,
        qr_code_pix: pixData?.encodedImage || null,
        qr_code_copy_paste: pixData?.payload || null,
        invoice_url: payment.invoiceUrl,
        dados_cliente: customerData,
        dados_produto: paymentData,
      });

    if (dbError) {
      console.error('Erro ao salvar no banco:', dbError);
      throw dbError;
    }

    console.log('Pagamento salvo no banco de dados');

    return new Response(
      JSON.stringify({
        success: true,
        payment: {
          id: payment.id,
          status: payment.status,
          invoiceUrl: payment.invoiceUrl,
          pixQrCode: pixData?.encodedImage,
          pixCopyPaste: pixData?.payload,
          pixExpirationDate: pixData?.expirationDate,
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
