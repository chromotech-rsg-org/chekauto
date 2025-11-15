import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const resendApiKey = Deno.env.get('RESEND_API_KEY') as string;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tipo, cliente, veiculo, produto, pagamento, pixData } = await req.json();
    
    console.log('Enviando email:', { tipo, cliente: cliente?.nome });

    const isConfirmacao = tipo === 'confirmacao';
    const emailRemetente = 'noreply@binrenave.com.br';
    const emailAdmin = 'comercial@binrenave.com.br';

    // Email inicial - pedido recebido
    if (!isConfirmacao) {
      const htmlCliente = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #F0BA1D; color: #000; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
            .section { margin: 20px 0; padding: 15px; background: white; border-radius: 5px; }
            .section-title { font-weight: bold; color: #F0BA1D; margin-bottom: 10px; }
            .info-row { margin: 5px 0; }
            .qr-code { text-align: center; margin: 20px 0; }
            .pix-code { background: #f4f4f4; padding: 15px; border: 1px solid #ddd; border-radius: 5px; word-break: break-all; font-family: monospace; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Pedido Recebido - ChekAuto</h1>
            </div>
            
            <div class="content">
              <p>Olá <strong>${cliente.nome}</strong>,</p>
              <p>Recebemos seu pedido com sucesso!</p>
              
              <div class="section">
                <div class="section-title">📋 DADOS DO PEDIDO</div>
                <div class="info-row"><strong>Número:</strong> #${pagamento.id}</div>
                <div class="info-row"><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</div>
                <div class="info-row"><strong>Status:</strong> Aguardando Pagamento</div>
              </div>
              
              <div class="section">
                <div class="section-title">🚗 DADOS DO VEÍCULO</div>
                ${veiculo.placa ? `<div class="info-row"><strong>Placa:</strong> ${veiculo.placa}</div>` : ''}
                ${veiculo.renavam ? `<div class="info-row"><strong>RENAVAM:</strong> ${veiculo.renavam}</div>` : ''}
                ${veiculo.chassi ? `<div class="info-row"><strong>Chassi:</strong> ${veiculo.chassi}</div>` : ''}
                ${veiculo.catMmv ? `<div class="info-row"><strong>CAT/MMV:</strong> ${veiculo.catMmv}</div>` : ''}
              </div>
              
              <div class="section">
                <div class="section-title">📦 PRODUTO/SERVIÇO</div>
                <div class="info-row"><strong>${produto.nome}</strong></div>
                <div class="info-row"><strong>Valor:</strong> R$ ${Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
              
              ${pixData ? `
              <div class="section">
                <div class="section-title">💰 PAGAMENTO - PIX</div>
                ${pixData.encodedImage ? `
                <div class="qr-code">
                  <img src="${pixData.encodedImage}" alt="QR Code PIX" style="max-width: 250px;" />
                </div>
                ` : ''}
                <p><strong>Código PIX para copiar e colar:</strong></p>
                <div class="pix-code">${pixData.payload}</div>
                <p style="margin-top: 10px; font-size: 12px; color: #666;">
                  ${pixData.expirationDate ? `Válido até: ${new Date(pixData.expirationDate).toLocaleString('pt-BR')}` : ''}
                </p>
              </div>
              ` : ''}
              
              <p>Após o pagamento, você receberá um email de confirmação.</p>
            </div>
            
            <div class="footer">
              <p>Atenciosamente,<br><strong>Equipe ChekAuto</strong></p>
              <p>www.binrenave.com.br</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Enviar para cliente
      const clienteResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `ChekAuto <${emailRemetente}>`,
          to: [cliente.email],
          subject: `Pedido Recebido - ChekAuto #${pagamento.id?.substring(0, 8)}`,
          html: htmlCliente,
        }),
      });

      if (!clienteResponse.ok) {
        throw new Error('Erro ao enviar email para cliente');
      }

      // Enviar cópia para admin
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `ChekAuto <${emailRemetente}>`,
          to: [emailAdmin],
          subject: `[NOVO PEDIDO] #${pagamento.id?.substring(0, 8)} - ${cliente.nome}`,
          html: htmlCliente,
        }),
      });

      console.log('Email de pedido enviado com sucesso');
    } 
    // Email de confirmação - pagamento aprovado
    else {
      const dadosCliente = pagamento.dados_cliente || {};
      const dadosVeiculo = pagamento.dados_veiculo || {};
      const dadosProduto = pagamento.dados_produto || {};

      const htmlConfirmacao = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
            .section { margin: 20px 0; padding: 15px; background: white; border-radius: 5px; }
            .section-title { font-weight: bold; color: #22c55e; margin-bottom: 10px; }
            .info-row { margin: 5px 0; }
            .success-badge { background: #22c55e; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Pagamento Confirmado - ChekAuto</h1>
            </div>
            
            <div class="content">
              <p>Olá <strong>${dadosCliente.name || dadosCliente.nome}</strong>,</p>
              <p>🎉 Seu pagamento foi confirmado com sucesso!</p>
              
              <div class="section">
                <div class="section-title">📋 PEDIDO</div>
                <div class="info-row"><strong>Número:</strong> #${pagamento.asaas_payment_id?.substring(0, 8)}</div>
                <div class="info-row"><span class="success-badge">PAGO</span></div>
                <div class="info-row"><strong>Valor:</strong> R$ ${Number(pagamento.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
              
              <div class="section">
                <div class="section-title">🚗 VEÍCULO</div>
                ${dadosVeiculo.placa ? `<div class="info-row"><strong>Placa:</strong> ${dadosVeiculo.placa}</div>` : ''}
                ${dadosVeiculo.renavam ? `<div class="info-row"><strong>RENAVAM:</strong> ${dadosVeiculo.renavam}</div>` : ''}
                ${dadosVeiculo.chassi ? `<div class="info-row"><strong>Chassi:</strong> ${dadosVeiculo.chassi}</div>` : ''}
              </div>
              
              <div class="section">
                <div class="section-title">📦 SERVIÇO</div>
                <div class="info-row"><strong>${dadosProduto.nome || dadosProduto.name}</strong></div>
              </div>
              
              <p>Em breve você receberá os resultados da consulta.</p>
            </div>
            
            <div class="footer">
              <p>Atenciosamente,<br><strong>Equipe ChekAuto</strong></p>
              <p>www.binrenave.com.br</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Enviar para cliente
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `ChekAuto <${emailRemetente}>`,
          to: [dadosCliente.email],
          subject: `✅ Pagamento Confirmado - ChekAuto #${pagamento.asaas_payment_id?.substring(0, 8)}`,
          html: htmlConfirmacao,
        }),
      });

      // Enviar cópia para admin
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `ChekAuto <${emailRemetente}>`,
          to: [emailAdmin],
          subject: `[PAGAMENTO CONFIRMADO] #${pagamento.asaas_payment_id?.substring(0, 8)} - ${dadosCliente.name || dadosCliente.nome}`,
          html: htmlConfirmacao,
        }),
      });

      console.log('Email de confirmação enviado com sucesso');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email enviado com sucesso' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});