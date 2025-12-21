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
      vehicleData,
      productData,
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
          cpfCnpj: String(customerData.cpfCnpj).replace(/\D/g, ''),
          email: customerData.email,
          phone: customerData.phone,
          mobilePhone: String(customerData.mobilePhone || '').replace(/\D/g, ''),
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
      value: Number(paymentData.value),
      dueDate: paymentData.dueDate || new Date().toISOString().split('T')[0],
      description: paymentData.description,
      externalReference: String(paymentData.externalReference),
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

    // Inserir pagamento e obter o ID do banco
    const { data: pagamentoInserido, error: dbError } = await supabase
      .from('pagamentos')
      .insert({
        asaas_payment_id: payment.id,
        user_id: userId || null,
        valor: Number(payment.value),
        metodo_pagamento: payment.billingType,
        status: payment.status,
        qr_code_pix: pixData?.encodedImage || null,
        qr_code_copy_paste: pixData?.payload || null,
        invoice_url: payment.invoiceUrl,
        dados_cliente: customerData,
        dados_produto: productData || null,
        dados_veiculo: vehicleData || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao salvar no banco:', dbError);
      throw dbError;
    }

    console.log('Pagamento salvo no banco de dados com ID:', pagamentoInserido.id);

    // Criar ou atualizar cliente na tabela clientes
    let clienteId = null;
    if (customerData.cpfCnpj) {
      const cpfCnpjLimpo = String(customerData.cpfCnpj).replace(/\D/g, '');
      
      // Buscar cliente existente
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id')
        .eq('cpf_cnpj', cpfCnpjLimpo)
        .maybeSingle();

      if (clienteExistente) {
        // Atualizar cliente existente para cliente_ativo (fez solicitação)
        const { data: clienteAtualizado } = await supabase
          .from('clientes')
          .update({
            nome: customerData.name,
            email: customerData.email,
            telefone: customerData.phone || customerData.mobilePhone,
            status: 'cliente_ativo', // Mudou de lead para cliente_ativo ao fazer solicitação
            endereco: {
              logradouro: customerData.address,
              numero: customerData.addressNumber,
              complemento: customerData.complement,
              bairro: customerData.province,
              cep: customerData.postalCode
            },
            ultima_interacao: new Date().toISOString()
          })
          .eq('id', clienteExistente.id)
          .select()
          .single();
        
        clienteId = clienteAtualizado?.id;
      } else {
        // Criar novo cliente como cliente_ativo (já está fazendo solicitação)
        const { data: novoCliente } = await supabase
          .from('clientes')
          .insert({
            nome: customerData.name,
            email: customerData.email,
            cpf_cnpj: cpfCnpjLimpo,
            telefone: customerData.phone || customerData.mobilePhone,
            status: 'cliente_ativo',
            endereco: {
              logradouro: customerData.address,
              numero: customerData.addressNumber,
              complemento: customerData.complement,
              bairro: customerData.province,
              cep: customerData.postalCode
            }
          })
          .select()
          .single();
        
        clienteId = novoCliente?.id;
      }
    }

    // Criar solicitação vinculada ao pagamento (usando UUID do banco, não ID do Asaas)
    if (clienteId) {
      // Preparar dados completos do veículo incluindo nome do anexo se existir
      const dadosVeiculoCompletos = {
        ...vehicleData,
        // Se notaFiscal existir, salvar apenas o nome do arquivo
        notaFiscalNome: vehicleData?.notaFiscal?.name || vehicleData?.notaFiscalNome || null
      };
      // Remover o File object pois não pode ser serializado
      delete dadosVeiculoCompletos.notaFiscal;

      const { error: solError } = await supabase
        .from('solicitacoes')
        .insert({
          pagamento_id: pagamentoInserido.id,
          cliente_id: clienteId,
          produto_id: productData?.id || null,
          status: 'pendente',
          dados_veiculo: dadosVeiculoCompletos
        });
      
      if (solError) {
        console.error('Erro ao criar solicitação:', solError);
      } else {
        console.log('Solicitação criada com sucesso para cliente:', clienteId);
      }
    }

    // ===== SPLIT FÁCIL INTEGRATION =====
    // Buscar splits configurados para o produto
    if (productData?.id) {
      const splitFacilUrl = Deno.env.get('SPLIT_FACIL_URL');
      const contaAsaasId = Deno.env.get('SPLIT_FACIL_CONTA_ASAAS_ID');
      
      if (splitFacilUrl && contaAsaasId) {
        console.log('Buscando splits configurados para produto:', productData.id);
        
        const { data: splitsConfig } = await supabase
          .from('splits')
          .select(`
            id,
            percentual,
            parceiro_id,
            parceiros!inner (
              id,
              nome,
              wallet_id,
              ativo
            )
          `)
          .eq('produto_id', productData.id);
        
        if (splitsConfig && splitsConfig.length > 0) {
          console.log('Splits encontrados:', splitsConfig.length);
          
          // Filtrar apenas parceiros ativos com wallet_id configurado
          const splitsValidos = splitsConfig.filter((s: any) => 
            s.parceiros?.ativo && s.parceiros?.wallet_id
          );
          
          if (splitsValidos.length > 0) {
            // Montar payload para Split Fácil (conforme documentação)
            const splitPayload = {
              contaAsaasId: contaAsaasId,
              paymentId: payment.id,
              origem: "api",
              splits: splitsValidos.map((s: any) => ({
                walletId: s.parceiros.wallet_id,
                percentualValue: s.percentual
              }))
            };
            
            console.log('Enviando para Split Fácil:', JSON.stringify(splitPayload));
            
            try {
              const splitResponse = await fetch(`${splitFacilUrl}/functions/v1/asaas-split`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(splitPayload),
              });
              
              const splitResponseText = await splitResponse.text();
              let splitResult;
              try {
                splitResult = JSON.parse(splitResponseText);
              } catch (parseError) {
                console.error('Resposta não é JSON válido:', splitResponseText.substring(0, 500));
                throw new Error('Resposta inválida do Split Fácil');
              }
              console.log('Resposta Split Fácil:', JSON.stringify(splitResult));
              
              if (splitResult.success) {
                console.log('Split configurado com sucesso!');
                
                // Salvar no histórico de splits
                for (const s of splitsValidos) {
                  const valorSplit = (Number(payment.value) * s.percentual) / 100;
                  await supabase.from('historico_splits').insert({
                    pagamento_id: pagamentoInserido.id,
                    parceiro_id: s.parceiro_id,
                    produto_id: productData.id,
                    valor: valorSplit,
                    status: 'configurado'
                  });
                }
              } else {
                console.error('Erro ao configurar split:', splitResult.error);
              }
            } catch (splitError) {
              console.error('Erro ao chamar Split Fácil:', splitError);
            }
          } else {
            console.log('Nenhum parceiro ativo com wallet_id encontrado');
          }
        } else {
          console.log('Nenhum split configurado para este produto');
        }
      } else {
        console.log('Split Fácil não configurado (URL ou contaAsaasId ausente)');
      }
    }
    // ===== FIM SPLIT FÁCIL =====

    // Enviar email de confirmação de pedido
    try {
      await supabase.functions.invoke('enviar-email-pedido', {
        body: {
          cliente: customerData,
          veiculo: vehicleData,
          produto: productData,
          pagamento: payment,
          pixData: pixData
        }
      });
      console.log('Email de pedido enviado');
    } catch (emailError) {
      console.error('Erro ao enviar email, mas continuando:', emailError);
    }

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
        status: 200,
      }
    );
  }
});
