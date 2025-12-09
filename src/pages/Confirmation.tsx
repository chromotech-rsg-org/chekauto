import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Loader2, QrCode, Copy, Home, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCheckout } from '@/contexts/CheckoutContext';
import { checkPaymentStatus } from '@/services/asaasService';
import logoYellow from '@/assets/logo-chekauto-yellow.png';

export default function Confirmation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { vehicle, customer, product, clearCheckout } = useCheckout();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('PENDING');
  const [checking, setChecking] = useState(false);

  const steps = [
    { label: 'Dados do Veículo', completed: true, active: false },
    { label: 'Dados do Cliente', completed: true, active: false },
    { label: 'Pagamento', completed: true, active: false },
    { label: 'Finalizado', completed: true, active: true }
  ];

  useEffect(() => {
    const storedData = sessionStorage.getItem('paymentResult');
    if (storedData) {
      const data = JSON.parse(storedData);
      setPaymentData(data);
      if (data.payment?.status) {
        setPaymentStatus(data.payment.status);
      }
    }
  }, []);

  // Auto-check payment status every 5 seconds if payment is pending
  useEffect(() => {
    if (!paymentData?.payment?.id || paymentStatus !== 'PENDING') return;

    const intervalId = setInterval(async () => {
      try {
        const result = await checkPaymentStatus(paymentData.payment.id);
        setPaymentStatus(result.status);
        
        if (result.status === 'RECEIVED' || result.status === 'CONFIRMED') {
          toast({
            title: "Pagamento confirmado!",
            description: "Seu pagamento foi aprovado com sucesso.",
          });
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Erro ao consultar status automaticamente:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [paymentData, paymentStatus, toast]);

  const handleCheckStatus = async () => {
    if (!paymentData?.payment?.id) return;

    setChecking(true);
    try {
      const result = await checkPaymentStatus(paymentData.payment.id);
      setPaymentStatus(result.status);
      
      if (result.status === 'RECEIVED' || result.status === 'CONFIRMED') {
        toast({
          title: "Pagamento confirmado!",
          description: "Seu pagamento foi aprovado com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao consultar status:', error);
      toast({
        title: "Erro ao consultar status",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Código PIX copiado para a área de transferência",
    });
  };

  const handleNewRequest = () => {
    clearCheckout();
    sessionStorage.removeItem('paymentResult');
    navigate('/');
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'RECEIVED':
      case 'CONFIRMED':
        return {
          title: 'PAGAMENTO APROVADO',
          description: 'Todas as informações serão enviadas por email.',
          color: 'bg-green-500',
          icon: CheckCircle2
        };
      case 'PENDING':
        return {
          title: 'AGUARDANDO PAGAMENTO',
          description: paymentData?.payment?.pixCopyPaste 
            ? 'Complete o pagamento via PIX para continuar.'
            : 'Estamos processando seu pagamento.',
          color: 'bg-blue-500',
          icon: Loader2
        };
      case 'OVERDUE':
        return {
          title: 'PAGAMENTO VENCIDO',
          description: 'Entre em contato para gerar um novo pagamento.',
          color: 'bg-red-500',
          icon: CheckCircle2
        };
      default:
        return {
          title: 'PROCESSANDO PAGAMENTO',
          description: 'Aguarde enquanto processamos sua transação.',
          color: 'bg-gray-500',
          icon: Loader2
        };
    }
  };

  const status = getStatusMessage();
  const StatusIcon = status.icon;

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
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl space-y-6">
          {/* Status Card */}
          <div className={`${status.color} rounded-2xl p-12 text-center`}>
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              {paymentStatus === 'RECEIVED' || paymentStatus === 'CONFIRMED' ? (
                <CheckCircle2 className="w-16 h-16 text-black" strokeWidth={2.5} />
              ) : paymentStatus === 'PENDING' ? (
                <Loader2 className="w-16 h-16 text-black animate-spin" strokeWidth={2.5} />
              ) : (
                <QrCode className="w-16 h-16 text-black" strokeWidth={2.5} />
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 uppercase tracking-wide">
              {status.title}
            </h1>
            
            <p className="text-xl text-white">
              {status.description}
            </p>
          </div>

          {/* QR Code PIX (se disponível) - verificar ambas as estruturas possíveis */}
          {(paymentData?.payment?.pixQrCode || paymentData?.pixQrCode) && paymentStatus === 'PENDING' && (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Pague com PIX</h2>
              
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <img 
                  src={`data:image/png;base64,${paymentData?.payment?.pixQrCode || paymentData?.pixQrCode}`} 
                  alt="QR Code PIX" 
                  className="w-64 h-64"
                />
              </div>

              {(paymentData?.payment?.pixCopyPaste || paymentData?.pixCopyPaste) && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Ou copie o código PIX:</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={paymentData?.payment?.pixCopyPaste || paymentData?.pixCopyPaste} 
                      readOnly 
                      className="flex-1 px-4 py-2 border rounded-lg text-sm bg-gray-50"
                    />
                    <Button 
                      onClick={() => copyToClipboard(paymentData?.payment?.pixCopyPaste || paymentData?.pixCopyPaste)}
                      variant="outline"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleCheckStatus} 
                disabled={checking}
                className="mt-6 bg-brand-yellow hover:bg-brand-yellow/90 text-black"
              >
                {checking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Já Paguei - Verificar Status'
                )}
              </Button>
            </div>
          )}

          {/* Botão Voltar */}
          <div className="text-center">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              size="lg"
            >
              Voltar para a Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
