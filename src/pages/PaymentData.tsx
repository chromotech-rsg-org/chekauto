import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';
import logoYellow from '@/assets/logo-chekauto-yellow.png';
import truckProduct from '@/assets/truck-yellow-close.png';

export default function PaymentData() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'cartao' | 'pix'>('cartao');
  const [cardData, setCardData] = useState({
    numero: '',
    titular: '',
    cvv: '',
    validade: '',
    parcelas: '1'
  });

  const steps = [
    { label: 'Dados do Veículo', completed: true, active: false },
    { label: 'Dados do Cliente', completed: true, active: false },
    { label: 'Pagamento', completed: false, active: true },
    { label: 'Finalizado', completed: false, active: false }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payment data:', { paymentMethod, cardData });
    navigate('/solicitacao/confirmacao');
  };

  return (
    <div className="min-h-screen bg-black">
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
      <div className="py-8 bg-black">
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
              
              <h3 className="text-lg font-bold text-black mb-2">CARROCERIA SOBRE CHASSI TANQUE</h3>
              <p className="text-gray-600 text-sm mb-4">
                Uma carroceria sobre chassi tanque é um implemento rodoviário para caminhões, composto por um reservatório, geralmente cilíndrico, montado sobre a estrutura do chassi do veículo, e que tem como principal função o transporte de líquidos.
              </p>
              
              <div className="bg-gray-50 rounded p-4 mb-4">
                <p className="text-xs text-gray-600">Placeholder para características do produto</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">R$1950,00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Desconto</span>
                  <span className="font-semibold">R$150,00</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2"></div>
                <div className="flex justify-between text-base">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-brand-yellow">R$1750,00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dados de Pagamento */}
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-xl font-bold text-black mb-4">Dados do Pagamento</h2>
            <p className="text-sm text-gray-600 mb-6">Preencha as informações para finalizar a compra</p>
            
            {/* Método de Pagamento */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('cartao')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all text-sm ${
                  paymentMethod === 'cartao'
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <CreditCard className="inline-block w-4 h-4 mr-2" />
                Cartão de Crédito
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all text-sm ${
                  paymentMethod === 'pix'
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pagamento via PIX
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {paymentMethod === 'cartao' ? (
                <div className="space-y-4">
                  <div>
                    <Input
                      id="numeroCartao"
                      value={cardData.numero}
                      onChange={(e) => setCardData(prev => ({ ...prev, numero: e.target.value }))}
                      placeholder="Número do Cartão"
                      className="bg-gray-100 border-0"
                      required
                    />
                  </div>

                  <div>
                    <Input
                      id="titular"
                      value={cardData.titular}
                      onChange={(e) => setCardData(prev => ({ ...prev, titular: e.target.value }))}
                      placeholder="Nome do Titular"
                      className="bg-gray-100 border-0"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id="cvv"
                      value={cardData.cvv}
                      onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="CVV"
                      maxLength={3}
                      className="bg-gray-100 border-0"
                      required
                    />
                    <Input
                      id="validade"
                      value={cardData.validade}
                      onChange={(e) => setCardData(prev => ({ ...prev, validade: e.target.value }))}
                      placeholder="Validade"
                      className="bg-gray-100 border-0"
                      required
                    />
                  </div>

                  <div>
                    <Select value={cardData.parcelas} onValueChange={(value) => setCardData(prev => ({ ...prev, parcelas: value }))}>
                      <SelectTrigger className="bg-gray-100 border-0">
                        <SelectValue placeholder="Número de Parcelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1x de R$ 1.750,00 sem juros</SelectItem>
                        <SelectItem value="2">2x de R$ 875,00 sem juros</SelectItem>
                        <SelectItem value="3">3x de R$ 583,33 sem juros</SelectItem>
                        <SelectItem value="6">6x de R$ 291,67 sem juros</SelectItem>
                        <SelectItem value="12">12x de R$ 145,83 sem juros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-6 text-center">
                    <div className="bg-gray-200 w-40 h-40 mx-auto mb-3 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 text-sm">QR Code PIX</p>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Escaneie o QR Code ou copie o código abaixo</p>
                    <div className="bg-gray-50 p-2 rounded text-xs font-mono break-all">
                      00020126580014br.gov.bcb.pix...
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-semibold rounded-full mt-6">
                Finalizar Compra
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
