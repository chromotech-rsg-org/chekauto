import { supabase } from '@/integrations/supabase/client';
import { PaymentData } from '@/types/asaas';

export const createPayment = async (paymentData: PaymentData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const customerData = {
      name: paymentData.customerName,
      cpfCnpj: paymentData.customerCpf,
      email: paymentData.customerEmail,
      mobilePhone: paymentData.customerPhone,
    };

    const asaasPaymentData: any = {
      billingType: paymentData.paymentMethod,
      value: paymentData.productPrice,
      dueDate: new Date().toISOString().split('T')[0],
      description: `Compra: ${paymentData.productName}`,
      externalReference: `${user.id}-${Date.now()}`,
    };

    // Se for cartão de crédito, adicionar dados do cartão
    if (paymentData.paymentMethod === 'CREDIT_CARD' && paymentData.cardData) {
      const [expiryMonth, expiryYear] = paymentData.cardData.expiry.split('/');
      asaasPaymentData.creditCard = {
        holderName: paymentData.cardData.name,
        number: paymentData.cardData.number.replace(/\s/g, ''),
        expiryMonth: expiryMonth.trim(),
        expiryYear: `20${expiryYear.trim()}`,
        ccv: paymentData.cardData.cvv,
      };
      asaasPaymentData.creditCardHolderInfo = {
        name: paymentData.customerName,
        email: paymentData.customerEmail,
        cpfCnpj: paymentData.customerCpf,
        postalCode: '00000000', // Você pode adicionar um campo para CEP se necessário
        addressNumber: '0',
        phone: paymentData.customerPhone,
      };
    }

    const { data, error } = await supabase.functions.invoke('asaas-create-payment', {
      body: {
        customerData,
        paymentData: asaasPaymentData,
        userId: user.id,
      },
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    return data.payment;
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (paymentId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('asaas-check-payment', {
      body: { paymentId },
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    return data.payment;
  } catch (error) {
    console.error('Erro ao consultar pagamento:', error);
    throw error;
  }
};

export const getUserPayments = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('user_id', user.id)
      .order('criado_em', { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    throw error;
  }
};
