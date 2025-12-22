import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCheckout } from '@/contexts/CheckoutContext';
import { createFullPayment } from '@/services/asaasService';
import { ProductSelectModal } from '@/components/ProductSelectModal';
import logoYellow from '@/assets/logo-chekauto-yellow.png';
import truckProduct from '@/assets/truck-yellow-close.png';

export default function PaymentData() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { vehicle, customer, product, setProductData } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PIX'>('PIX');
  const [productModalOpen, setProductModalOpen] = useState(false);
  
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

    // Validação rápida de CPF/CNPJ antes de chamar a API
    const digits = (customer.cpfCnpj || '').replace(/\D/g, '');
    const isCpf = digits.length === 11;
    const isCnpj = digits.length === 14;

    const isValidCpf = (cpf: string) => {
      if (!cpf || cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
      let sum = 0; let rest = 0;
      for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      rest = (sum * 10) % 11; if (rest === 10 || rest === 11) rest = 0;
      if (rest !== parseInt(cpf.substring(9, 10))) return false;
      sum = 0; for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      rest = (sum * 10) % 11; if (rest === 10 || rest === 11) rest = 0;
      if (rest !== parseInt(cpf.substring(10, 11))) return false;
      return true;
    };

    if (!(isCpf || isCnpj) || (isCpf && !isValidCpf(digits))) {
      toast({
        title: 'CPF/CNPJ inválido',
        description: 'Verifique o documento informado para continuar.',
        variant: 'destructive',
      });
      return; 
    }

    setLoading(true);

    try {
      const result = await createFullPayment(
        vehicle,
        customer,
        product,
        paymentMethod,
        paymentMethod === 'CREDIT_CARD' ? cardData : undefined
      );
      
      sessionStorage.setItem('paymentResult', JSON.stringify(result));

      toast({
        title: 'Pagamento iniciado',
        description: paymentMethod === 'PIX' 
          ? 'QR Code gerado com sucesso!' 
          : 'Processando pagamento...',
      });

      navigate('/solicitacao/confirmacao');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      const message = error instanceof Error ? error.message : 'Tente novamente';
      const friendly = /cpf|cnpj/i.test(message) ? 'CPF/CNPJ inválido. Verifique os dados.' : message;
      toast({
        title: 'Erro ao processar pagamento',
        description: friendly,
        variant: 'destructive',
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
          <div className="space-y-6">
            <Card className="p-6 border-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Resumo da Compra</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setProductModalOpen(true)}
                  className="text-sm"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Trocar Produto
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Produto:</span>
                  <span className="font-semibold">{product.name || 'CARROCERIA SOBRE CHASSI TANQUE'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-semibold">{customer.nomeCompleto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Veículo:</span>
                  <span className="font-semibold">{vehicle.placa}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-brand-yellow">R$ {(product.price || 1800).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-white rounded-lg p-6 border-2">
              <h2 className="text-xl font-bold mb-4">Forma de Pagamento</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                    paymentMethod === 'PIX' 
                      ? 'border-brand-yellow bg-brand-yellow/10' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  PIX
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                    paymentMethod === 'CREDIT_CARD' 
                      ? 'border-brand-yellow bg-brand-yellow/10' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="inline mr-2 h-5 w-5" />
                  Cartão
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {paymentMethod === 'CREDIT_CARD' && (
                  <>
                    <Input
                      placeholder="Número do Cartão"
                      value={cardData.number}
                      onChange={e => setCardData(prev => ({ ...prev, number: e.target.value }))}
                      className="bg-gray-100 border-0"
                      maxLength={16}
                      required
                    />
                    <Input
                      placeholder="Nome no Cartão"
                      value={cardData.name}
                      onChange={e => setCardData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-100 border-0"
                      required
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="MM/AA"
                        value={cardData.expiry}
                        onChange={e => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                        className="bg-gray-100 border-0"
                        maxLength={5}
                        required
                      />
                      <Input
                        placeholder="CVV"
                        value={cardData.cvv}
                        onChange={e => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                        className="bg-gray-100 border-0"
                        maxLength={4}
                        type="password"
                        required
                      />
                    </div>
                  </>
                )}

                {paymentMethod === 'PIX' && (
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <p className="font-semibold mb-2">Pagamento via PIX</p>
                    <p>Após finalizar, você receberá o QR Code para pagamento instantâneo.</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/solicitacao/cliente')}
                    className="flex-1"
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-brand-yellow hover:bg-brand-yellow/90 text-black font-semibold"
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
                </div>
              </form>
            </div>
          </div>

          <div className="hidden md:block">
            <img src={truckProduct} alt="Produto" className="w-full rounded-lg" />
          </div>
        </div>
      </div>

      <ProductSelectModal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSelect={(selectedProduct) => {
          setProductData({
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            description: selectedProduct.description,
            image: selectedProduct.image
          });
          toast({
            title: 'Produto alterado',
            description: `Agora você está comprando: ${selectedProduct.name}`,
          });
        }}
      />
    </div>
  );
}
