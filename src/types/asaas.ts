export interface AsaasCredentials {
  api_key: string;
  environment: 'sandbox' | 'production';
  webhook_secret?: string;
}

export interface AsaasCustomer {
  name: string;
  cpfCnpj: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
}

export interface AsaasPaymentRequest {
  customer: string | AsaasCustomer;
  billingType: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  value: number;
  dueDate: string;
  description?: string;
  externalReference?: string;
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
}

export interface AsaasPaymentResponse {
  id: string;
  customer: string;
  billingType: string;
  value: number;
  netValue: number;
  status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED_IN_CASH' | 'REFUND_REQUESTED' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_REQUESTED' | 'DUNNING_RECEIVED' | 'AWAITING_RISK_ANALYSIS';
  dueDate: string;
  originalDueDate: string;
  invoiceUrl: string;
  invoiceNumber?: string;
  externalReference?: string;
  description?: string;
  pixTransaction?: {
    qrCode: {
      encodedImage: string;
      payload: string;
      expirationDate: string;
    };
  };
  creditCard?: {
    creditCardNumber: string;
    creditCardBrand: string;
    creditCardToken: string;
  };
}

export interface AsaasWebhookEvent {
  event: string;
  payment: {
    id: string;
    customer: string;
    value: number;
    netValue: number;
    status: string;
    billingType: string;
    dueDate: string;
    invoiceUrl: string;
    externalReference?: string;
  };
}

export interface PaymentData {
  productName: string;
  productPrice: number;
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerPhone: string;
  paymentMethod: 'PIX' | 'CREDIT_CARD';
  cardData?: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  };
}
