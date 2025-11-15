import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCheckout } from '@/contexts/CheckoutContext';
import { createFullPayment } from '@/services/asaasService';
import logoYellow from '@/assets/logo-chekauto-yellow.png';
import truckProduct from '@/assets/truck-yellow-close.png';

export default function PaymentData() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { vehicle, customer, product } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PIX'>('PIX');
  
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const steps = [
    { label: 'Dados do Veículo', completed: true, active: false },
    { label: 'Dados do Cliente', completed: true, active: false },
    { label: 'Pagamento', completed: false, active: true },
    { label: 'Finalizado', completed: false, active: false }
  ];

  // Verificar se há dados do cliente e veículo
  useEffect(() => {
    if (!customer.nomeCompleto || !vehicle.chassi) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha os dados anteriores primeiro.",
        variant: "destructive",
      });
      navigate('/solicitacao/veiculo');
    }
  }, [customer, vehicle, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createFullPayment(
        vehicle,
        customer,
        product,
        paymentMethod,
        paymentMethod === 'CREDIT_CARD' ? cardData : undefined
      );
      
      // Armazenar dados do pagamento para mostrar na confirmação
      sessionStorage.setItem('paymentResult', JSON.stringify(result));

      toast({
        title: "Pagamento iniciado",
        description: paymentMethod === 'PIX' 
          ? "QR Code gerado com sucesso!" 
          : "Processando pagamento...",
      });

      navigate('/solicitacao/confirmacao');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black py-6 px-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={logoYellow} alt="CHEKAUTO" className="h-8" />
          <nav className="hidden md:flex items-center gap-12 text-white text-sm font-semibold">
            <a href="/" className="hover:text-brand-yellow transition-colors">A CHEKAUTO</a>
            <a href="/#consultation" className="hover:text-brand-yellow transition-colors">CONSULTA</a>
            <a href="/#implementations" className="hover:text-brand-yellow transition-colors">IMPLEMENTOS</a>
            <a href="/#benefits" className="hover:text-brand-yellow transition-colors">DIFERENCIAIS</a>
            <div className="w-10 h-10 bg-brand-yellow rounded-full"></div>
          </nav>
        </div>
      </header>

      {/* Stepper */}
      <div className="py-8 bg-white">
        <Stepper steps={steps} />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Resumo da Compra */}
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-xl font-bold text-black mb-4">Resumo da compra</h2>
            <p className="text-sm text-gray-600 mb-6">Resumo do item selecionado</p>
            
            <div className="mb-6">
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4 overflow-hidden">
                <img src={truckProduct} alt="Produto" className="w-full h-full object-cover" />
              </div>
              
              <h3 className="text-lg font-bold text-black mb-2">{productData.name}</h3>
              <p className="text-gray-600 text-sm mb-4">
                Uma carroceria sobre chassi tanque é um implemento rodoviário para caminhões, composto por um reservatório, geralmente cilíndrico, montado sobre a estrutura do chassi do veículo.
              </p>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">R$ {productData.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-brand-yellow">R$ {productData.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dados de Pagamento */}
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-xl font-bold text-black mb-4">Dados de pagamento</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados do Cliente */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Dados do Cliente</h3>
                
                <div>
                  <Label htmlFor="customerName">Nome Completo</Label>
                  <Input 
                    id="customerName" 
                    required
                    value={customerData.name}
                    onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                    placeholder="Nome completo" 
                  />
                </div>

                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input 
                    id="customerEmail" 
                    type="email"
                    required
                    value={customerData.email}
                    onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                    placeholder="email@exemplo.com" 
                  />
                </div>

                <div>
                  <Label htmlFor="customerCpf">CPF</Label>
                  <Input 
                    id="customerCpf" 
                    required
                    value={customerData.cpf}
                    onChange={(e) => setCustomerData({...customerData, cpf: e.target.value})}
                    placeholder="000.000.000-00" 
                  />
                </div>

                <div>
                  <Label htmlFor="customerPhone">Telefone</Label>
                  <Input 
                    id="customerPhone" 
                    required
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                    placeholder="(00) 00000-0000" 
                  />
                </div>
              </div>

              {/* Método de Pagamento */}
              <div>
                <Label htmlFor="paymentMethod">Forma de pagamento</Label>
                <Select 
                  value={paymentMethod} 
                  onValueChange={(value: 'CREDIT_CARD' | 'PIX') => setPaymentMethod(value)}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dados do Cartão (se cartão selecionado) */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-700">Dados do Cartão</h3>
                  
                  <div>
                    <Label htmlFor="cardNumber">Número do cartão</Label>
                    <div className="relative">
                      <Input 
                        id="cardNumber" 
                        required
                        value={cardData.number}
                        onChange={(e) => setCardData({...cardData, number: e.target.value})}
                        placeholder="0000 0000 0000 0000" 
                        maxLength={19}
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">Nome no cartão</Label>
                    <Input 
                      id="cardName" 
                      required
                      value={cardData.name}
                      onChange={(e) => setCardData({...cardData, name: e.target.value})}
                      placeholder="Nome como está no cartão" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Validade</Label>
                      <Input 
                        id="cardExpiry" 
                        required
                        value={cardData.expiry}
                        onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                        placeholder="MM/AA" 
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvv">CVV</Label>
                      <Input 
                        id="cardCvv" 
                        required
                        value={cardData.cvv}
                        onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                        placeholder="123" 
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Info PIX */}
              {paymentMethod === 'PIX' && (
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Após confirmar, você receberá o QR Code PIX para realizar o pagamento.
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-brand-yellow hover:bg-brand-yellow/90 text-black font-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Finalizar Compra'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
